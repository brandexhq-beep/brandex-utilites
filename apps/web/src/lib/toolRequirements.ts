import { UtilityItem } from './categories';

export type ToolInputMode = 'file-only' | 'text-only' | 'file-and-text' | 'generator';

export interface ToolFileConstraints {
  accept: string;
  allowedExtensions: string[];
  label: string;
  multiple: boolean;
}

/**
 * Determines exact required input type for any utility
 */
export function getToolInputMode(tool: UtilityItem): ToolInputMode {
  const id = tool.id.toLowerCase();

  // Pure Generators (no input needed, options only)
  if ([
    'uuid-generator',
    'password-gen',
    'lorem-ipsum',
    'cron-parser'
  ].includes(id)) {
    return 'generator';
  }

  // Hybrid Tools (supports both file and text together)
  if ([
    'pdf-form-filler',
    'img-batch-watermark'
  ].includes(id)) {
    return 'file-and-text';
  }

  // Pure File Tools (Images, Documents, Archives)
  const isExplicitFileTool = 
    id.startsWith('pdf-') ||
    id.startsWith('img-') ||
    id.startsWith('image-') ||
    id.startsWith('docx-') ||
    id.startsWith('zip-') ||
    id.startsWith('tar-') ||
    id.startsWith('exif-') ||
    id.startsWith('heic-') ||
    id.startsWith('psd-') ||
    id.startsWith('svg-') ||
    id.startsWith('png-') ||
    id === 'qr-decoder' ||
    id === 'archive-inspect';

  if (isExplicitFileTool) {
    return 'file-only';
  }

  // Pure Text / Code / Data Tools
  return 'text-only';
}

/**
 * Returns strict file types, extensions, MIME types, and multi-file permissions
 */
export function getToolFileConstraints(tool: UtilityItem): ToolFileConstraints {
  const id = tool.id.toLowerCase();

  // Images to PDF (allows multiple image files)
  if (id === 'img-to-pdf' || id === 'images-to-pdf') {
    return {
      accept: 'image/png,image/jpeg,image/webp,image/gif,image/bmp,.png,.jpg,.jpeg,.webp,.gif,.bmp',
      allowedExtensions: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'],
      label: 'Images (PNG, JPG, WebP, GIF)',
      multiple: true
    };
  }

  // PDF Merge (allows multiple PDF files)
  if (id === 'pdf-merge') {
    return {
      accept: 'application/pdf,.pdf',
      allowedExtensions: ['.pdf'],
      label: 'PDF Documents (.pdf)',
      multiple: true
    };
  }

  // Batch Image tools
  if (id.includes('batch') && (id.startsWith('img-') || id.startsWith('image-'))) {
    return {
      accept: 'image/png,image/jpeg,image/webp,image/svg+xml,.png,.jpg,.jpeg,.webp,.svg',
      allowedExtensions: ['.png', '.jpg', '.jpeg', '.webp', '.svg'],
      label: 'Image Files (PNG, JPG, WebP, SVG)',
      multiple: true
    };
  }

  // All other PDF tools (single file)
  if (id.startsWith('pdf-')) {
    return {
      accept: 'application/pdf,.pdf',
      allowedExtensions: ['.pdf'],
      label: 'PDF Document (.pdf)',
      multiple: false
    };
  }

  // Word Document tools (DOCX)
  if (id.startsWith('docx-')) {
    return {
      accept: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      allowedExtensions: ['.docx'],
      label: 'Word Document (.docx)',
      multiple: false
    };
  }

  // Apple HEIC photos
  if (id.includes('heic')) {
    return {
      accept: '.heic,.heif,image/heic,image/heif',
      allowedExtensions: ['.heic', '.heif'],
      label: 'Apple Photo (.heic, .heif)',
      multiple: false
    };
  }

  // Photoshop PSD
  if (id.includes('psd')) {
    return {
      accept: '.psd,image/vnd.adobe.photoshop',
      allowedExtensions: ['.psd'],
      label: 'Photoshop File (.psd)',
      multiple: false
    };
  }

  // Archives (ZIP, TAR, GZ, RAR)
  if (id.startsWith('zip-') || id.startsWith('tar-') || id === 'archive-inspect') {
    return {
      accept: '.zip,.tar,.gz,.tgz,.rar,application/zip,application/x-zip-compressed',
      allowedExtensions: ['.zip', '.tar', '.gz', '.tgz', '.rar'],
      label: 'Archive Package (.zip, .tar, .gz)',
      multiple: false
    };
  }

  // QR Decoder (image upload)
  if (id === 'qr-decoder') {
    return {
      accept: 'image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp',
      allowedExtensions: ['.png', '.jpg', '.jpeg', '.webp'],
      label: 'QR Code Image (PNG, JPG, WebP)',
      multiple: false
    };
  }

  // General Image Tools
  if (id.startsWith('img-') || id.startsWith('image-') || id.startsWith('exif-') || id.startsWith('svg-') || id.startsWith('png-')) {
    return {
      accept: 'image/png,image/jpeg,image/webp,image/svg+xml,image/x-icon,.png,.jpg,.jpeg,.webp,.svg,.ico',
      allowedExtensions: ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico'],
      label: 'Image File (PNG, JPG, WebP, SVG, ICO)',
      multiple: false
    };
  }

  // Fallback for document/text tools that accept file upload
  return {
    accept: '.txt,.json,.csv,.xml,.md,text/*',
    allowedExtensions: ['.txt', '.json', '.csv', '.xml', '.md'],
    label: 'Text or Data File',
    multiple: false
  };
}

/**
 * Validates uploaded files against tool constraints
 */
export function validateFilesForTool(
  tool: UtilityItem, 
  files: File[]
): { valid: boolean; error?: string } {
  const constraints = getToolFileConstraints(tool);

  if (files.length === 0) {
    return { valid: true };
  }

  for (const file of files) {
    const fileName = file.name.toLowerCase();
    const hasValidExt = constraints.allowedExtensions.some(ext => fileName.endsWith(ext));
    
    // Check extension
    if (!hasValidExt && constraints.allowedExtensions.length > 0) {
      return {
        valid: false,
        error: `"${file.name}" is not supported. Please select ${constraints.label}.`
      };
    }
  }

  return { valid: true };
}

/**
 * Determines whether a tool has real customizable options
 * If false, the settings panel will NOT be rendered at all.
 */
export function hasToolSettings(tool: UtilityItem): boolean {
  const id = tool.id.toLowerCase();

  return [
    'pdf-encrypt',
    'pdf-rotation-batch',
    'pdf-margin-editor',
    'pdf-bleed-editor',
    'pdf-trim-editor',
    'pdf-split',
    'img-to-pdf',
    'img-convert',
    'image-converter',
    'img-compress',
    'image-compressor',
    'img-resize',
    'img-dpi-editor',
    'json-formatter',
    'code-formatter',
    'csv-to-json',
    'csv-header-normalizer',
    'json-key-finder',
    'hash-calculator',
    'checksum-calc',
    'hmac-gen',
    'base64',
    'uuid-generator',
    'password-gen',
    'regex-tester'
  ].includes(id);
}
