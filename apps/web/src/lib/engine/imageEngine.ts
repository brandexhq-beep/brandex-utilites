export interface ImageProcessingOptions {
  file: File;
  targetFormat?: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/x-icon';
  quality?: number; // 0.1 to 1.0 (default: 0.92 for crystal-clear visual fidelity)
  maxWidth?: number;
  maxHeight?: number;
  stripExif?: boolean;
}

export interface ProcessingResult {
  success: boolean;
  outputBlob?: Blob;
  outputUrl?: string;
  outputFileName?: string;
  outputSize?: number;
  originalSize?: number;
  compressionRatio?: string;
  originalUrl?: string;
  originalDimensions?: { width: number; height: number };
  outputDimensions?: { width: number; height: number };
  originalInput?: string;
  error?: string;
  data?: any;
}

/**
 * Ultra High-Fidelity Local Browser Image Processing
 * Preserves color accuracy, alpha channels, and crisp details while optimizing byte size.
 */
export async function processImage(options: ImageProcessingOptions): Promise<ProcessingResult> {
  try {
    const {
      file,
      targetFormat = 'image/jpeg',
      quality = 0.92, // Default high-fidelity quality setting to prevent compression degradation
      maxWidth,
      maxHeight
    } = options;
    const originalSize = file.size;
    const originalUrl = URL.createObjectURL(file);

    // Load image into ImageBitmap with high color fidelity
    const imageBitmap = await createImageBitmap(file);
    const origWidth = imageBitmap.width;
    const origHeight = imageBitmap.height;
    let width = origWidth;
    let height = origHeight;

    // Calculate dimensions if resizing was explicitly requested
    if (maxWidth || maxHeight) {
      if (maxWidth && width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (maxHeight && height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }
    }

    // Initialize Canvas with crisp antialiasing & image smoothing
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d', { alpha: targetFormat !== 'image/jpeg', willReadFrequently: false });
    if (!ctx) throw new Error('Failed to initialize 2D canvas context');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Handle white background only for JPEG conversions if original had transparency
    if (targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(imageBitmap, 0, 0, width, height);

    // Render Canvas to high-fidelity Blob
    const outputBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Canvas toBlob output failed'));
        },
        targetFormat,
        quality
      );
    });

    const outputUrl = URL.createObjectURL(outputBlob);
    const ext = targetFormat.split('/')[1] || 'jpg';
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    const outputFileName = `${baseName}_processed.${ext === 'x-icon' ? 'ico' : ext}`;

    const savedBytes = originalSize - outputBlob.size;
    const compressionRatio = originalSize > 0
      ? `${((savedBytes / originalSize) * 100).toFixed(1)}%`
      : '0%';

    return {
      success: true,
      outputBlob,
      outputUrl,
      outputFileName,
      outputSize: outputBlob.size,
      originalSize,
      compressionRatio,
      originalUrl,
      originalDimensions: { width: origWidth, height: origHeight },
      outputDimensions: { width, height }
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to process image';
    return {
      success: false,
      error: errorMsg
    };
  }
}
