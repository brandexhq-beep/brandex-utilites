import { ProcessingResult } from './imageEngine';

/**
 * Real Local JSON to CSV Converter
 */
export function jsonToCSV(jsonInput: string): ProcessingResult {
  try {
    const data = JSON.parse(jsonInput);
    const array = Array.isArray(data) ? data : [data];
    if (array.length === 0) throw new Error('JSON array is empty.');

    const headers = Object.keys(array[0]);
    const csvRows = [headers.join(',')];

    for (const row of array) {
      const values = headers.map(header => {
        const val = row[header];
        const escaped = ('' + (val ?? '')).replace(/"/g, '""');
        return `"${escaped}"`;
      });
      csvRows.push(values.join(','));
    }

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'converted.csv',
      data: csvContent,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to convert JSON to CSV.';
    return {
      success: false,
      error: `JSON to CSV error: ${errorMsg}`
    };
  }
}

/**
 * Real Local CSV to JSON Converter
 */
export function csvToJSON(csvInput: string): ProcessingResult {
  try {
    const lines = csvInput.trim().split('\n');
    if (lines.length < 2) throw new Error('CSV must contain at least a header row and one data row.');

    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i].trim()) continue;
      const currentline = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = currentline[index] || '';
      });
      result.push(obj);
    }

    const jsonContent = JSON.stringify(result, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'converted.json',
      data: jsonContent,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to convert CSV to JSON.';
    return {
      success: false,
      error: `CSV to JSON error: ${errorMsg}`
    };
  }
}

/**
 * Real Local CSV RFC 4180 Quote Balancer & Fixer
 */
export function fixCSVQuotes(csvInput: string): ProcessingResult {
  try {
    const lines = csvInput.split('\n');
    const fixedLines = lines.map(line => {
      const parts = line.split(',');
      const fixedParts = parts.map(part => {
        const trimmed = part.trim();
        // If contains commas, double quotes, or newlines, quote properly
        if (trimmed.includes('"') || trimmed.includes(',')) {
          const innerEscaped = trimmed.replace(/^"|"$/g, '').replace(/"/g, '""');
          return `"${innerEscaped}"`;
        }
        return trimmed;
      });
      return fixedParts.join(',');
    });

    const fixed = fixedLines.join('\n');
    const blob = new Blob([fixed], { type: 'text/csv' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'fixed_quotes.csv',
      data: fixed,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to fix CSV quotes.';
    return { success: false, error: errorMsg };
  }
}

/**
 * Real Local CSV Header Normalizer (snake_case, camelCase, lowercase)
 */
export function normalizeCSVHeaders(csvInput: string, style: 'snake' | 'camel' | 'lower' = 'snake'): ProcessingResult {
  try {
    const lines = csvInput.trim().split('\n');
    if (lines.length === 0) throw new Error('CSV input is empty.');

    const headers = lines[0].split(',').map(h => {
      const clean = h.trim().replace(/^"|"$/g, '');
      if (style === 'snake') {
        return clean.toLowerCase().replace(/[\s\W-]+/g, '_');
      } else if (style === 'camel') {
        return clean.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
      } else {
        return clean.toLowerCase().replace(/\s+/g, ' ');
      }
    });

    lines[0] = headers.join(',');
    const normalized = lines.join('\n');
    const blob = new Blob([normalized], { type: 'text/csv' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'normalized_headers.csv',
      data: normalized,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to normalize CSV headers.';
    return { success: false, error: errorMsg };
  }
}

/**
 * Real Local CSV Empty Column Eliminator
 */
export function removeEmptyCSVColumns(csvInput: string): ProcessingResult {
  try {
    const lines = csvInput.trim().split('\n').filter(Boolean);
    if (lines.length === 0) throw new Error('CSV input is empty.');

    const rows = lines.map(l => l.split(',').map(c => c.trim().replace(/^"|"$/g, '')));
    const colCount = rows[0].length;

    // Detect which columns are non-empty in at least one data row
    const keepColIndices: number[] = [];
    for (let c = 0; c < colCount; c++) {
      const hasValue = rows.slice(1).some(row => row[c] && row[c].length > 0);
      if (hasValue) keepColIndices.push(c);
    }

    const prunedRows = rows.map(row => keepColIndices.map(c => `"${row[c] || ''}"`).join(','));
    const prunedContent = prunedRows.join('\n');
    const removedCount = colCount - keepColIndices.length;

    const blob = new Blob([prunedContent], { type: 'text/csv' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'pruned_columns.csv',
      data: `Removed ${removedCount} empty column(s). New columns: ${keepColIndices.length}.\n\n` + prunedContent,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to remove empty CSV columns.';
    return { success: false, error: errorMsg };
  }
}

/**
 * Real Local JSON Key Search Engine
 */
export function findJSONKeys(jsonInput: string, targetKey: string = 'id'): ProcessingResult {
  try {
    const data = JSON.parse(jsonInput);
    const matches: Array<{ path: string; value: unknown }> = [];

    function search(obj: unknown, currentPath: string = '$') {
      if (obj && typeof obj === 'object') {
        if (Array.isArray(obj)) {
          obj.forEach((item, idx) => search(item, `${currentPath}[${idx}]`));
        } else {
          for (const [k, v] of Object.entries(obj)) {
            const newPath = `${currentPath}.${k}`;
            if (k.toLowerCase().includes(targetKey.toLowerCase())) {
              matches.push({ path: newPath, value: v });
            }
            search(v, newPath);
          }
        }
      }
    }

    search(data);

    const report = {
      searchKey: targetKey,
      matchesFound: matches.length,
      matches
    };

    const formatted = JSON.stringify(report, null, 2);
    const blob = new Blob([formatted], { type: 'application/json' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'json_key_search.json',
      data: formatted,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to search JSON keys.';
    return { success: false, error: errorMsg };
  }
}

/**
 * Real Local JSON Array Deduplicator
 */
export function deduplicateJSONArray(jsonInput: string, keyField?: string): ProcessingResult {
  try {
    const data = JSON.parse(jsonInput);
    if (!Array.isArray(data)) throw new Error('Input must be a valid JSON array.');

    const seen = new Set<string>();
    const deduplicated = [];

    for (const item of data) {
      let identifier: string;
      if (keyField && item && typeof item === 'object' && keyField in item) {
        identifier = String((item as Record<string, unknown>)[keyField]);
      } else {
        identifier = JSON.stringify(item);
      }

      if (!seen.has(identifier)) {
        seen.add(identifier);
        deduplicated.push(item);
      }
    }

    const removed = data.length - deduplicated.length;
    const formatted = JSON.stringify(deduplicated, null, 2);
    const blob = new Blob([formatted], { type: 'application/json' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'deduplicated_array.json',
      data: formatted,
      outputSize: blob.size,
      compressionRatio: `Removed ${removed} duplicate entries`
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to deduplicate JSON array.';
    return { success: false, error: errorMsg };
  }
}
