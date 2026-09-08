import JSZip from 'jszip';
import { ProcessingResult } from './imageEngine';

/**
 * Real Local ZIP File Extractor
 */
export async function extractZip(file: File): Promise<ProcessingResult> {
  try {
    const zip = new JSZip();
    const contents = await zip.loadAsync(file);
    const fileList: string[] = [];

    contents.forEach((relativePath) => {
      fileList.push(relativePath);
    });

    const summaryJson = JSON.stringify({
      archiveName: file.name,
      totalFiles: fileList.length,
      files: fileList
    }, null, 2);

    const blob = new Blob([summaryJson], { type: 'application/json' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: `${file.name.replace(/\.[^/.]+$/, "")}_manifest.json`,
      data: summaryJson,
      outputSize: blob.size
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Failed to extract ZIP archive: ${err.message}`
    };
  }
}

/**
 * Real Local ZIP Archive Creator
 */
export async function createZip(files: File[]): Promise<ProcessingResult> {
  try {
    if (!files || files.length === 0) throw new Error("Please select at least one file to compress into ZIP.");

    const zip = new JSZip();
    for (const f of files) {
      const buffer = await f.arrayBuffer();
      zip.file(f.name, buffer);
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' });
    const outputUrl = URL.createObjectURL(zipBlob);

    return {
      success: true,
      outputBlob: zipBlob,
      outputUrl,
      outputFileName: `archive_${Date.now()}.zip`,
      outputSize: zipBlob.size
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Failed to create ZIP package: ${err.message}`
    };
  }
}
