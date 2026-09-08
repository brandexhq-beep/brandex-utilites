export interface ImageProcessingOptions {
  file: File;
  targetFormat?: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/x-icon';
  quality?: number; // 0.1 to 1.0
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
  error?: string;
  data?: any;
}

export async function processImage(options: ImageProcessingOptions): Promise<ProcessingResult> {
  try {
    const { file, targetFormat = 'image/jpeg', quality = 0.8, maxWidth, maxHeight, stripExif = true } = options;
    const originalSize = file.size;

    // Load image into HTMLImageElement
    const imageBitmap = await createImageBitmap(file);
    let width = imageBitmap.width;
    let height = imageBitmap.height;

    // Calculate dimensions if resizing
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

    // Draw onto Canvas (drawing strips EXIF metadata automatically)
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error("Failed to initialize 2D canvas context");

    // Handle white background for JPEG conversions if original had transparency
    if (targetFormat === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.drawImage(imageBitmap, 0, 0, width, height);

    // Render Canvas to Blob
    const outputBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Canvas toBlob output failed"));
        },
        targetFormat,
        quality
      );
    });

    const outputUrl = URL.createObjectURL(outputBlob);
    const ext = targetFormat.split('/')[1] || 'jpg';
    const baseName = file.name.replace(/\.[^/.]+$/, "");
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
      compressionRatio
    };

  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to process image"
    };
  }
}
