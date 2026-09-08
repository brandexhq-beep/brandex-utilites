import QRCode from 'qrcode';
import jsQR from 'jsqr';

export interface QRCustomizeOptions {
  margin?: number;
  width?: number;
  fgColor?: string;
  bgColor?: string;
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  logoDataUrl?: string;
  logoSizePercent?: number; // e.g. 18%
}

export interface DecodedQRPayload {
  type: 'URL' | 'Text' | 'Email' | 'Phone' | 'SMS' | 'WhatsApp' | 'Wi-Fi' | 'vCard' | 'Location' | 'Calendar' | 'UPI' | 'Unknown';
  raw: string;
  details: Record<string, string>;
  isUrl: boolean;
  cleanUrl?: string;
  urlParts?: {
    scheme: string;
    host: string;
    path: string;
    query: Record<string, string>;
  };
  warning?: string;
}

/**
 * Real Algorithmic Local QR Code SVG & Canvas Matrix Engine with Optional Logo Composite
 */
export async function generateCustomQRCode(
  payload: string,
  options: QRCustomizeOptions = {}
): Promise<{ svgString: string; blob: Blob; url: string; dataUrl: string }> {
  if (!payload || !payload.trim()) throw new Error('QR payload cannot be empty.');

  const fg = options.fgColor || '#0F172A';
  const bg = options.bgColor || '#FFFFFF';
  const margin = options.margin ?? 2;
  const width = options.width ?? 350;
  // If logo is present, default to high error correction (H) so 30% can be obscured
  const ec = options.errorCorrectionLevel ?? (options.logoDataUrl ? 'H' : 'M');

  // 1. Generate clean SVG string
  const svgString = await QRCode.toString(payload, {
    type: 'svg',
    margin,
    width,
    errorCorrectionLevel: ec,
    color: {
      dark: fg,
      light: bg
    }
  });

  // 2. Generate Base DataURL
  let dataUrl = await QRCode.toDataURL(payload, {
    margin,
    width,
    errorCorrectionLevel: ec,
    color: {
      dark: fg,
      light: bg
    }
  });

  // 3. If a logo image is provided, composite it onto the canvas in browser memory
  if (options.logoDataUrl && typeof window !== 'undefined') {
    dataUrl = await new Promise<string>((resolve) => {
      const qrImg = new Image();
      qrImg.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = width;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(dataUrl);

        // Draw QR
        ctx.drawImage(qrImg, 0, 0, width, width);

        // Draw Logo in center
        const logoImg = new Image();
        logoImg.onload = () => {
          const logoSizePercent = options.logoSizePercent || 18;
          const logoDim = Math.floor((width * logoSizePercent) / 100);
          const x = Math.floor((width - logoDim) / 2);
          const y = Math.floor((width - logoDim) / 2);

          // White rounded background pad for logo
          ctx.fillStyle = bg;
          const pad = 6;
          ctx.beginPath();
          ctx.roundRect(x - pad, y - pad, logoDim + pad * 2, logoDim + pad * 2, 8);
          ctx.fill();

          // Draw Logo
          ctx.drawImage(logoImg, x, y, logoDim, logoDim);
          resolve(canvas.toDataURL('image/png'));
        };
        logoImg.onerror = () => resolve(dataUrl);
        logoImg.src = options.logoDataUrl!;
      };
      qrImg.onerror = () => resolve(dataUrl);
      qrImg.src = dataUrl;
    });
  }

  const blob = new Blob([svgString], { type: 'image/svg+xml' });
  const url = URL.createObjectURL(blob);

  return { svgString, blob, url, dataUrl };
}

/**
 * Robust Client-Side QR Code Decoder
 * Tests multiple image scalings (1x, 0.5x, 2x) and grayscale contrast enhancement to detect QR codes
 */
export async function decodeQRCodeFromImage(file: File): Promise<DecodedQRPayload> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Try multiple scaling factors for robustness
        const scales = [1, 0.75, 1.5, 0.5];
        let foundCode: any = null;

        for (const scale of scales) {
          const w = Math.floor(img.width * scale);
          const h = Math.floor(img.height * scale);

          // Limit excessive canvas sizes
          if (w > 2500 || h > 2500) continue;

          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;

          ctx.drawImage(img, 0, 0, w, h);
          const imageData = ctx.getImageData(0, 0, w, h);

          // Pass 1: standard
          foundCode = jsQR(imageData.data, w, h, { inversionAttempts: 'attemptBoth' });
          if (foundCode && foundCode.data) break;

          // Pass 2: Grayscale thresholding
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            const gray = (data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114);
            const binary = gray > 128 ? 255 : 0;
            data[i] = binary;
            data[i + 1] = binary;
            data[i + 2] = binary;
          }
          foundCode = jsQR(data, w, h, { inversionAttempts: 'attemptBoth' });
          if (foundCode && foundCode.data) break;
        }

        if (!foundCode || !foundCode.data) {
          return reject(new Error('No QR code detected in this image. Please provide a clear, focused image containing a QR code.'));
        }

        const classified = classifyQRPayload(foundCode.data);
        resolve(classified);
      };
      img.onerror = () => reject(new Error('Failed to load image file for QR decoding.'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
}

/**
 * Deep Payload Classifier & Inspector
 */
export function classifyQRPayload(raw: string): DecodedQRPayload {
  const trimmed = raw.trim();

  // Security Check: Dangerous Schemes
  let warning: string | undefined;
  if (/^(javascript:|data:|file:)/i.test(trimmed)) {
    warning = 'Potentially dangerous scheme detected. Script execution prevented.';
  }

  // URL
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      const queryParams: Record<string, string> = {};
      parsed.searchParams.forEach((val, key) => {
        queryParams[key] = val;
      });

      // Clean URL: Remove tracking parameters (utm_*, fbclid, gclid)
      const cleanParsed = new URL(trimmed);
      const trackingKeys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid'];
      trackingKeys.forEach(k => cleanParsed.searchParams.delete(k));

      return {
        type: 'URL',
        raw: trimmed,
        isUrl: true,
        cleanUrl: cleanParsed.toString(),
        urlParts: {
          scheme: parsed.protocol.replace(':', ''),
          host: parsed.host,
          path: parsed.pathname,
          query: queryParams
        },
        details: {
          'Target URL': trimmed,
          'Host Domain': parsed.host,
          'Protocol': parsed.protocol
        },
        warning
      };
    } catch {
      // Fall through to plain text if URL parsing fails
    }
  }

  // India UPI Payment
  if (trimmed.startsWith('upi://pay')) {
    try {
      const url = new URL(trimmed);
      const pa = url.searchParams.get('pa') || '';
      const pn = url.searchParams.get('pn') || '';
      const am = url.searchParams.get('am') || '';
      const tn = url.searchParams.get('tn') || '';

      return {
        type: 'UPI',
        raw: trimmed,
        isUrl: false,
        details: {
          'UPI ID / VPA': pa,
          'Payee Name': pn || 'Not Specified',
          'Amount (INR)': am ? `₹${am}` : 'Any Amount',
          'Transaction Note': tn || 'None'
        },
        warning
      };
    } catch {
      // Fall through
    }
  }

  // Wi-Fi
  if (trimmed.startsWith('WIFI:')) {
    const ssidMatch = trimmed.match(/S:([^;]+)/);
    const passMatch = trimmed.match(/P:([^;]+)/);
    const typeMatch = trimmed.match(/T:([^;]+)/);

    return {
      type: 'Wi-Fi',
      raw: trimmed,
      isUrl: false,
      details: {
        'Network SSID': ssidMatch ? ssidMatch[1] : 'Unknown',
        'Password': passMatch ? passMatch[1] : 'None / Open',
        'Security Type': typeMatch ? typeMatch[1] : 'WPA'
      },
      warning
    };
  }

  // vCard / Contact
  if (trimmed.startsWith('BEGIN:VCARD')) {
    const fnMatch = trimmed.match(/FN:([^\r\n]+)/);
    const orgMatch = trimmed.match(/ORG:([^\r\n]+)/);
    const telMatch = trimmed.match(/TEL[^\:]*:([^\r\n]+)/);
    const emailMatch = trimmed.match(/EMAIL[^\:]*:([^\r\n]+)/);

    return {
      type: 'vCard',
      raw: trimmed,
      isUrl: false,
      details: {
        'Full Name': fnMatch ? fnMatch[1] : 'Contact',
        'Organization': orgMatch ? orgMatch[1] : 'N/A',
        'Phone': telMatch ? telMatch[1] : 'N/A',
        'Email': emailMatch ? emailMatch[1] : 'N/A'
      },
      warning
    };
  }

  // Email
  if (trimmed.startsWith('mailto:')) {
    const email = trimmed.replace('mailto:', '').split('?')[0];
    return {
      type: 'Email',
      raw: trimmed,
      isUrl: false,
      details: { 'Recipient': email },
      warning
    };
  }

  // Phone
  if (trimmed.startsWith('tel:')) {
    return {
      type: 'Phone',
      raw: trimmed,
      isUrl: false,
      details: { 'Phone Number': trimmed.replace('tel:', '') },
      warning
    };
  }

  // SMS
  if (trimmed.startsWith('smsto:') || trimmed.startsWith('sms:')) {
    return {
      type: 'SMS',
      raw: trimmed,
      isUrl: false,
      details: { 'SMS Target': trimmed },
      warning
    };
  }

  // WhatsApp
  if (trimmed.includes('wa.me') || trimmed.includes('api.whatsapp.com')) {
    return {
      type: 'WhatsApp',
      raw: trimmed,
      isUrl: true,
      details: { 'WhatsApp Link': trimmed },
      warning
    };
  }

  // Plain Text
  return {
    type: 'Text',
    raw: trimmed,
    isUrl: false,
    details: { 'Content': trimmed },
    warning
  };
}

/**
 * Contrast Ratio Calculator (WCAG)
 */
export function calculateContrastRatio(fgHex: string, bgHex: string): { ratio: number; isGood: boolean } {
  const getLuminance = (hex: string) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) / 255;
    const g = parseInt(c.substring(2, 4), 16) / 255;
    const b = parseInt(c.substring(4, 6), 16) / 255;

    const a = [r, g, b].map(v => {
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };

  try {
    const l1 = getLuminance(fgHex);
    const l2 = getLuminance(bgHex);
    const brighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    const ratio = (brighter + 0.05) / (darker + 0.05);
    return {
      ratio: Math.round(ratio * 10) / 10,
      isGood: ratio >= 3.0 // Minimum 3:1 for QR scanner readability
    };
  } catch {
    return { ratio: 5, isGood: true };
  }
}
