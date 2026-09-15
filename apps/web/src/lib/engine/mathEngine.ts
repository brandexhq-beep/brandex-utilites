import { ProcessingResult } from './index';

export async function processMathUtility(
  toolId: string,
  textInput: string
): Promise<ProcessingResult> {
  const input = textInput.trim();

  switch (toolId) {
    case 'px-rem': {
      const val = parseFloat(input) || 16;
      const rem = val / 16;
      const res = `${val}px = ${rem}rem (based on standard 16px root font size)`;
      return { success: true, data: res, outputFileName: 'px_to_rem.txt' };
    }

    case 'rem-px': {
      const val = parseFloat(input) || 1;
      const px = val * 16;
      const res = `${val}rem = ${px}px (based on standard 16px root font size)`;
      return { success: true, data: res, outputFileName: 'rem_to_px.txt' };
    }

    case 'aspect-ratio': {
      const numbers = input.match(/\d+(\.\d+)?/g);
      let w = 1920;
      let h = 1080;
      if (numbers && numbers.length >= 2) {
        w = Math.round(parseFloat(numbers[0]));
        h = Math.round(parseFloat(numbers[1]));
      }

      if (w <= 0 || h <= 0) {
        return { success: false, error: 'Width and height must be positive numbers.' };
      }

      const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
      const divisor = gcd(w, h);
      const ratioW = w / divisor;
      const ratioH = h / divisor;
      const decimal = (w / h).toFixed(3);

      const commonName = 
        (ratioW === 16 && ratioH === 9) ? ' (16:9 Widescreen)' :
        (ratioW === 4 && ratioH === 3) ? ' (4:3 Standard)' :
        (ratioW === 1 && ratioH === 1) ? ' (1:1 Square)' :
        (ratioW === 21 && ratioH === 9) ? ' (21:9 Ultrawide)' :
        (ratioW === 9 && ratioH === 16) ? ' (9:16 Mobile Vertical)' :
        (ratioW === 16 && ratioH === 10) ? ' (16:10 Display)' : '';

      const report = `=== ASPECT RATIO CALCULATOR ===
Width: ${w} px
Height: ${h} px
Simplest Aspect Ratio: ${ratioW}:${ratioH}${commonName}
Decimal Ratio: ${decimal}:1
Total Pixels: ${(w * h).toLocaleString()} px (~${((w * h) / 1e6).toFixed(2)} Megapixels)`;

      return { success: true, data: report, outputFileName: 'aspect_ratio.txt' };
    }

    case 'bit-byte-calc': {
      const numMatch = input.match(/\d+(\.\d+)?/);
      const val = numMatch ? parseFloat(numMatch[0]) : 1024;
      const isBits = /bit/i.test(input) && !/byte/i.test(input);

      const bytes = isBits ? val / 8 : val;
      const bits = bytes * 8;

      const report = `=== DIGITAL STORAGE CONVERTER ===
Input Base Value: ${val} ${isBits ? 'Bits' : 'Bytes'}

Decimal Units (Base 10 / SI Standards):
• Bits: ${bits.toLocaleString()} bits
• Bytes: ${bytes.toLocaleString()} bytes
• Kilobytes (KB): ${(bytes / 1000).toLocaleString(undefined, { maximumFractionDigits: 3 })} KB
• Megabytes (MB): ${(bytes / 1e6).toLocaleString(undefined, { maximumFractionDigits: 3 })} MB
• Gigabytes (GB): ${(bytes / 1e9).toLocaleString(undefined, { maximumFractionDigits: 4 })} GB
• Terabytes (TB): ${(bytes / 1e12).toLocaleString(undefined, { maximumFractionDigits: 6 })} TB

Binary Units (Base 2 / IEC Standards):
• Kibibytes (KiB): ${(bytes / 1024).toLocaleString(undefined, { maximumFractionDigits: 3 })} KiB
• Mebibytes (MiB): ${(bytes / Math.pow(1024, 2)).toLocaleString(undefined, { maximumFractionDigits: 3 })} MiB
• Gibibytes (GiB): ${(bytes / Math.pow(1024, 3)).toLocaleString(undefined, { maximumFractionDigits: 4 })} GiB
• Tebibytes (TiB): ${(bytes / Math.pow(1024, 4)).toLocaleString(undefined, { maximumFractionDigits: 6 })} TiB`;

      return { success: true, data: report, outputFileName: 'storage_units.txt' };
    }

    case 'ppi-calc': {
      const numbers = input.match(/\d+(\.\d+)?/g);
      let w = 2560;
      let h = 1440;
      let diagInches = 27;

      if (numbers && numbers.length >= 3) {
        w = parseFloat(numbers[0]);
        h = parseFloat(numbers[1]);
        diagInches = parseFloat(numbers[2]);
      } else if (numbers && numbers.length === 2) {
        w = parseFloat(numbers[0]);
        h = parseFloat(numbers[1]);
      }

      if (w <= 0 || h <= 0 || diagInches <= 0) {
        return { success: false, error: 'Width, height, and diagonal inches must be positive numbers.' };
      }

      const diagPixels = Math.sqrt(Math.pow(w, 2) + Math.pow(h, 2));
      const ppi = Math.round((diagPixels / diagInches) * 10) / 10;
      const dotPitchMm = (25.4 / ppi).toFixed(4);

      const report = `=== SCREEN PIXEL DENSITY (PPI) REPORT ===
Resolution: ${w} × ${h} px
Diagonal Size: ${diagInches} inches
Diagonal Pixels: ${Math.round(diagPixels)} px
Pixel Density (PPI / DPI): ${ppi} PPI
Dot Pitch (Pixel Size): ${dotPitchMm} mm
Sharpness Class: ${ppi >= 300 ? 'Retina / Ultra High Density' : ppi >= 150 ? 'High Density (HiDPI)' : 'Standard Desktop Display'}`;

      return { success: true, data: report, outputFileName: 'ppi_report.txt' };
    }

    default:
      return { success: false, error: `Math utility "${toolId}" is not implemented.` };
  }
}
