import { ProcessingResult } from './imageEngine';

/**
 * Real Local Web Crypto Checksum Calculator (SHA-256, SHA-512, SHA-1)
 */
export async function computeHash(input: File | string, algorithm: 'SHA-256' | 'SHA-512' | 'SHA-1' = 'SHA-256'): Promise<ProcessingResult> {
  try {
    let dataBuffer: BufferSource;
    if (typeof input === 'string') {
      dataBuffer = new TextEncoder().encode(input);
    } else {
      dataBuffer = await input.arrayBuffer();
    }

    const hashBuffer = await crypto.subtle.digest(algorithm, dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const blob = new Blob([hashHex], { type: 'text/plain' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: `checksum_${algorithm.toLowerCase()}.txt`,
      data: hashHex,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Hash calculation failed.';
    return {
      success: false,
      error: `Hash calculation error: ${errorMsg}`
    };
  }
}

/**
 * Real Local HMAC Signature Calculator
 */
export async function computeHMAC(secret: string, dataText: string): Promise<ProcessingResult> {
  try {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret || 'secret_key');
    const messageData = encoder.encode(dataText || 'sample_payload');

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const hashArray = Array.from(new Uint8Array(signature));
    const hmacHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const blob = new Blob([hmacHex], { type: 'text/plain' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'hmac_sha256.txt',
      data: hmacHex,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'HMAC calculation failed.';
    return {
      success: false,
      error: `HMAC calculation error: ${errorMsg}`
    };
  }
}

/**
 * Real Local RSA Key Pair Generator
 */
export async function generateRSAKeyPair(): Promise<ProcessingResult> {
  try {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );

    const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
      let binary = '';
      const bytes = new Uint8Array(buffer);
      const chunkSize = 0x8000;
      for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunkSize)));
      }
      return btoa(binary);
    };

    const exportedPublic = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const b64Public = arrayBufferToBase64(exportedPublic);
    const pemPublic = `-----BEGIN PUBLIC KEY-----\n${b64Public.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;

    const exportedPrivate = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    const b64Private = arrayBufferToBase64(exportedPrivate);
    const pemPrivate = `-----BEGIN PRIVATE KEY-----\n${b64Private.match(/.{1,64}/g)?.join('\n')}\n-----END PRIVATE KEY-----`;

    const fullResult = `${pemPublic}\n\n${pemPrivate}`;
    const blob = new Blob([fullResult], { type: 'text/plain' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'rsa_keypair_2048.pem',
      data: fullResult,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'RSA Keygen failed.';
    return {
      success: false,
      error: `RSA Keygen error: ${errorMsg}`
    };
  }
}

/**
 * Real Local UUID v4 Generator (Cryptographically Secure)
 */
export function generateUUIDs(count: number = 1): ProcessingResult {
  try {
    const uuids = Array.from({ length: Math.min(count, 100) }, () => crypto.randomUUID());
    const text = uuids.join('\n');
    const blob = new Blob([text], { type: 'text/plain' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'uuids.txt',
      data: uuids,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'UUID generation failed.';
    return {
      success: false,
      error: `UUID generation error: ${errorMsg}`
    };
  }
}

/**
 * Real Local Cryptographically Secure Password Generator
 */
export function generateSecurePassword(length: number = 16, includeSymbols: boolean = true): ProcessingResult {
  try {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' + (includeSymbols ? '!@#$%^&*()_+-=[]{}|;:,.<>?' : '');
    const randomArray = new Uint32Array(length);
    crypto.getRandomValues(randomArray);

    let password = '';
    for (let i = 0; i < length; i++) {
      password += chars[randomArray[i] % chars.length];
    }

    const blob = new Blob([password], { type: 'text/plain' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'password.txt',
      data: password,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Password generation failed.';
    return {
      success: false,
      error: `Password generation error: ${errorMsg}`
    };
  }
}

/**
 * Real Local Password & Passphrase Entropy Calculator
 */
export function calculatePasswordEntropy(password: string): ProcessingResult {
  if (!password) {
    return { success: false, error: 'Password or passphrase cannot be empty.' };
  }

  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^a-zA-Z0-9]/.test(password)) poolSize += 33;

  const length = password.length;
  // Entropy in bits: E = L * log2(R)
  const bits = poolSize > 0 ? Math.round(length * Math.log2(poolSize)) : 0;

  // Crack time estimates assuming 10 billion guesses/sec
  const secondsToCrack = Math.pow(2, bits) / 1e10;
  let crackTime = '< 1 second';
  if (secondsToCrack > 31536000 * 1000) crackTime = '> 1,000 centuries';
  else if (secondsToCrack > 31536000) crackTime = `~${Math.round(secondsToCrack / 31536000)} year(s)`;
  else if (secondsToCrack > 86400) crackTime = `~${Math.round(secondsToCrack / 86400)} day(s)`;
  else if (secondsToCrack > 3600) crackTime = `~${Math.round(secondsToCrack / 3600)} hour(s)`;
  else if (secondsToCrack > 60) crackTime = `~${Math.round(secondsToCrack / 60)} minute(s)`;

  let rating = 'Very Weak';
  if (bits >= 80) rating = 'Very Strong';
  else if (bits >= 60) rating = 'Strong';
  else if (bits >= 40) rating = 'Moderate';
  else if (bits >= 25) rating = 'Weak';

  const report = `=== PASSWORD ENTROPY & STRENGTH ANALYSIS ===
Password Length: ${length} characters
Character Pool Size: ${poolSize} possible glyphs
Entropy Rating: ${bits} bits (${rating})
Estimated Brute-Force Time (10B guesses/sec): ${crackTime}
Composition:
• Lowercase Letters: ${/[a-z]/.test(password) ? 'Yes' : 'No'}
• Uppercase Letters: ${/[A-Z]/.test(password) ? 'Yes' : 'No'}
• Numbers: ${/[0-9]/.test(password) ? 'Yes' : 'No'}
• Special Symbols: ${/[^a-zA-Z0-9]/.test(password) ? 'Yes' : 'No'}`;

  const blob = new Blob([report], { type: 'text/plain' });

  return {
    success: true,
    outputBlob: blob,
    outputUrl: URL.createObjectURL(blob),
    outputFileName: 'entropy_report.txt',
    data: report,
    outputSize: blob.size
  };
}

/**
 * Real Local Secret & Credential Masker
 */
export function maskSecrets(text: string): ProcessingResult {
  if (!text) return { success: false, error: 'Input text cannot be empty.' };

  let masked = text;
  let secretsMasked = 0;

  // AWS Access Key: AKIA[0-9A-Z]{16}
  masked = masked.replace(/AKIA[0-9A-Z]{16}/g, (m) => {
    secretsMasked++;
    return m.slice(0, 4) + '****************';
  });

  // JWT Tokens: eyJ...
  masked = masked.replace(/eyJ[a-zA-Z0-9-_]+\.eyJ[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+/g, () => {
    secretsMasked++;
    return 'eyJ****************.****************.****************';
  });

  // Bearer Tokens: Bearer [token]
  masked = masked.replace(/Bearer\s+([a-zA-Z0-9-_\.]{12,})/gi, () => {
    secretsMasked++;
    return 'Bearer ********************';
  });

  // GitHub Personal Access Token: ghp_...
  masked = masked.replace(/ghp_[a-zA-Z0-9]{36}/g, () => {
    secretsMasked++;
    return 'ghp_************************************';
  });

  // Passwords in connection strings: postgres://user:password@host
  masked = masked.replace(/(:\/\/[^:]+:)([^@]+)(@)/g, (_, p1, _p2, p3) => {
    secretsMasked++;
    return `${p1}********${p3}`;
  });

  const blob = new Blob([masked], { type: 'text/plain' });

  return {
    success: true,
    outputBlob: blob,
    outputUrl: URL.createObjectURL(blob),
    outputFileName: 'masked_content.txt',
    data: masked,
    outputSize: blob.size,
    compressionRatio: `Masked ${secretsMasked} secret(s)`
  };
}

/**
 * Real Local Log Secret Scanner
 */
export function scanLogSecrets(logContent: string): ProcessingResult {
  const lines = logContent.split('\n');
  const findings: Array<{ line: number; type: string; snippet: string }> = [];

  const patterns = [
    { type: 'AWS Access Key', regex: /AKIA[0-9A-Z]{16}/ },
    { type: 'JWT Token', regex: /eyJ[a-zA-Z0-9-_]{20,}\./ },
    { type: 'Private Key Header', regex: /-----BEGIN (RSA |EC |OPENSSH )?PRIVATE KEY-----/ },
    { type: 'Authorization Header', regex: /Authorization:\s*Bearer/i },
    { type: 'API Key Assignment', regex: /(api_key|apikey|secret_key|access_token)\s*[=:]\s*['"][^'"]+['"]/i },
    { type: 'Database Password URL', regex: /:\/\/[^:]+:[^@]+@/ }
  ];

  lines.forEach((line, idx) => {
    patterns.forEach(p => {
      if (p.regex.test(line)) {
        findings.push({
          line: idx + 1,
          type: p.type,
          snippet: line.trim().slice(0, 100)
        });
      }
    });
  });

  const report = `=== LOG FILE CREDENTIAL AUDIT REPORT ===
Total Log Lines Scanned: ${lines.length}
Potential Sensitive Findings: ${findings.length}

${findings.length > 0
  ? findings.map(f => `[Line ${f.line}] Risk: ${f.type}\n  Snippet: ${f.snippet}`).join('\n\n')
  : 'Clean: No exposed credentials or private keys detected in scanned log.'}`;

  const blob = new Blob([report], { type: 'text/plain' });

  return {
    success: true,
    outputBlob: blob,
    outputUrl: URL.createObjectURL(blob),
    outputFileName: 'log_security_audit.txt',
    data: report,
    outputSize: blob.size
  };
}

/**
 * Real Local URL Tracking Parameter Stripper
 */
export function stripTrackingParams(urlText: string): ProcessingResult {
  try {
    const urls = urlText.split(/\s+/).filter(Boolean);
    const trackingParams = new Set([
      'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
      'fbclid', 'gclid', 'msclkid', 'mc_eid', 'yclid', 'ref', 'source',
      '_ga', '_gl', 'zanpid', 'igshid'
    ]);

    const cleanedUrls = urls.map(u => {
      try {
        const parsed = new URL(u);
        let removed = 0;
        Array.from(parsed.searchParams.keys()).forEach(key => {
          if (trackingParams.has(key.toLowerCase()) || key.toLowerCase().startsWith('utm_')) {
            parsed.searchParams.delete(key);
            removed++;
          }
        });
        return { url: parsed.toString(), removed };
      } catch {
        return { url: u, removed: 0 };
      }
    });

    const totalRemoved = cleanedUrls.reduce((acc, c) => acc + c.removed, 0);
    const resultText = cleanedUrls.map(c => c.url).join('\n');
    const blob = new Blob([resultText], { type: 'text/plain' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'clean_urls.txt',
      data: `Stripped ${totalRemoved} tracking parameter(s):\n\n${resultText}`,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to strip tracking parameters.';
    return { success: false, error: errorMsg };
  }
}
