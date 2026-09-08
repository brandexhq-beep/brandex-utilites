export type ProcessingMode = 'LOCAL' | 'LOCAL_PREFERRED' | 'SERVER';

export interface UtilityDefinition {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  inputTypes: string[];
  outputTypes: string[];
  processingMode: ProcessingMode;
  maxFileSize: number; // in bytes
  engine: string;
  version: string;
  enabled: boolean;
  securityProfile?: {
    timeoutMs?: number;
    memoryLimitMb?: number;
    requiresIsolation?: boolean;
    sandboxParams?: Record<string, any>;
  };
}

// Global registry of all available utilities
export const UTILITY_REGISTRY: Record<string, UtilityDefinition> = {
  'compress-pdf': {
    id: 'compress-pdf',
    name: 'Compress PDF',
    slug: 'compress-pdf',
    category: 'pdf',
    description: 'Reduce PDF file size while maintaining useful quality.',
    inputTypes: ['application/pdf'],
    outputTypes: ['application/pdf'],
    processingMode: 'LOCAL_PREFERRED',
    maxFileSize: 200 * 1024 * 1024, // 200MB
    engine: 'pdf-compressor',
    version: '1.0.0',
    enabled: true,
    securityProfile: {
      timeoutMs: 60000,
      memoryLimitMb: 512,
      requiresIsolation: true,
    }
  },
  'image-compressor': {
    id: 'image-compressor',
    name: 'Image Compressor',
    slug: 'image-compressor',
    category: 'images',
    description: 'Reduce image size while maintaining quality.',
    inputTypes: ['image/jpeg', 'image/png', 'image/webp'],
    outputTypes: ['image/jpeg', 'image/png', 'image/webp'],
    processingMode: 'LOCAL',
    maxFileSize: 50 * 1024 * 1024, // 50MB
    engine: 'image-compressor',
    version: '1.0.0',
    enabled: true,
  },
  'json-formatter': {
    id: 'json-formatter',
    name: 'JSON Formatter',
    slug: 'json-formatter',
    category: 'dev',
    description: 'Format and beautify JSON data.',
    inputTypes: ['application/json'],
    outputTypes: ['application/json'],
    processingMode: 'LOCAL',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    engine: 'json-formatter',
    version: '1.0.0',
    enabled: true,
  }
};
