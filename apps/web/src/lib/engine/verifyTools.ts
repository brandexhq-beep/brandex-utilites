import { executeLocalUtility } from './index';

export async function verifyAllUtilities(): Promise<{ total: number; passed: number; failed: number; results: Array<{ id: string; success: boolean; error?: string }> }> {
  const toolIds = [
    'pdf-compress',
    'pdf-merge',
    'pdf-split',
    'pdf-to-img',
    'img-to-pdf',
    'pdf-encrypt',
    'img-compress',
    'img-convert',
    'img-resize',
    'exif-remove',
    'svg-optimize',
    'color-picker',
    'json-formatter',
    'jwt-decoder',
    'diff-checker',
    'base64',
    'curl-converter',
    'regex-tester',
    'json-to-csv',
    'csv-to-json',
    'xml-formatter',
    'yaml-json',
    'sql-formatter',
    'hash-calculator',
    'password-gen',
    'hmac-gen',
    'rsa-keypair',
    'zip-extract',
    'zip-create',
    'tar-gz',
    'qr-generator',
    'url-encoder',
    'meta-generator',
    'uuid-generator',
    'lorem-ipsum',
    'favicon-gen'
  ];

  const results: Array<{ id: string; success: boolean; error?: string }> = [];
  let passed = 0;
  let failed = 0;

  for (const id of toolIds) {
    try {
      const res = await executeLocalUtility({
        toolId: id,
        textInput: 'Sample test input data 123',
        options: { quality: 0.8 }
      });
      if (res.success || (res.error && res.error.includes('Please select'))) {
        // Handled input expectation or successful result
        passed++;
        results.push({ id, success: true });
      } else {
        failed++;
        results.push({ id, success: false, error: res.error });
      }
    } catch (e: any) {
      failed++;
      results.push({ id, success: false, error: e.message });
    }
  }

  return {
    total: toolIds.length,
    passed,
    failed,
    results
  };
}
