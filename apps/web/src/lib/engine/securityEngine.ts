import { ProcessingResult } from './imageEngine';

/**
 * Real Local Web Crypto Checksum Calculator (SHA-256, SHA-512, SHA-1)
 */
export async function computeHash(input: File | string, algorithm: 'SHA-256' | 'SHA-512' | 'SHA-1' = 'SHA-256'): Promise<ProcessingResult> {
  try {
    let buffer: ArrayBuffer;
    if (typeof input === 'string') {
      const encoder = new TextEncoder();
      buffer = encoder.encode(input).buffer;
    } else {
      buffer = await input.arrayBuffer();
    }

    const hashBuffer = await crypto.subtle.digest(algorithm, buffer);
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
  } catch (err: any) {
    return {
      success: false,
      error: `Hash calculation error: ${err.message}`
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
  } catch (err: any) {
    return {
      success: false,
      error: `HMAC calculation error: ${err.message}`
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

    const exportedPublic = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const b64Public = btoa(String.fromCharCode(...new Uint8Array(exportedPublic)));
    const pemPublic = `-----BEGIN PUBLIC KEY-----\n${b64Public.match(/.{1,64}/g)?.join('\n')}\n-----END PUBLIC KEY-----`;

    const exportedPrivate = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
    const b64Private = btoa(String.fromCharCode(...new Uint8Array(exportedPrivate)));
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
  } catch (err: any) {
    return {
      success: false,
      error: `RSA Keygen error: ${err.message}`
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
  } catch (err: any) {
    return {
      success: false,
      error: `UUID generation error: ${err.message}`
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
  } catch (err: any) {
    return {
      success: false,
      error: `Password generation error: ${err.message}`
    };
  }
}
