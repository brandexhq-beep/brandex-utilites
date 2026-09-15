/**
 * BrandEX File Engine
 * Utilities for client-side file inspection, MIME detection, and streaming.
 */

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: number;
}

export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()?.toLowerCase() || '' : '';
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes === 0) return '0 Bytes';
  const sign = bytes < 0 ? '-' : '';
  const absBytes = Math.abs(bytes);
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.min(Math.floor(Math.log(absBytes) / Math.log(k)), sizes.length - 1);
  return `${sign}${parseFloat((absBytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}
