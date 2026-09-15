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
 * RFC 4180 Compliant CSV Parser
 * Correctly parses commas inside quotes, escaped quotes (""), and multiline fields.
 */
export function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if ((char === '\r' || char === '\n') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++;
      }
      currentRow.push(currentCell.trim());
      if (currentRow.some(c => c.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(c => c.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

export function serializeCSV(rows: string[][]): string {
  return rows.map(row => 
    row.map(cell => {
      const val = cell ?? '';
      if (val.includes(',') || val.includes('"') || val.includes('\n') || val.includes('\r')) {
        return `"${val.replace(/"/g, '""')}"`;
      }
      return val;
    }).join(',')
  ).join('\n');
}

/**
 * Real Local CSV to JSON Converter
 */
export function csvToJSON(csvInput: string): ProcessingResult {
  try {
    const rows = parseCSV(csvInput.trim());
    if (rows.length < 2) throw new Error('CSV must contain at least a header row and one data row.');

    const headers = rows[0];
    const result = [];

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (row.length === 0 || (row.length === 1 && !row[0])) continue;
      const obj: Record<string, string> = {};
      headers.forEach((header, index) => {
        obj[header] = row[index] || '';
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
    const rows = parseCSV(csvInput);
    const fixed = serializeCSV(rows);
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
    const rows = parseCSV(csvInput.trim());
    if (rows.length === 0) throw new Error('CSV input is empty.');

    rows[0] = rows[0].map(h => {
      const clean = h.trim();
      if (style === 'snake') {
        return clean.toLowerCase().replace(/[\s\W-]+/g, '_');
      } else if (style === 'camel') {
        return clean.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
      } else {
        return clean.toLowerCase().replace(/\s+/g, ' ');
      }
    });

    const normalized = serializeCSV(rows);
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
    const rows = parseCSV(csvInput.trim());
    if (rows.length === 0) throw new Error('CSV input is empty.');

    const colCount = rows[0].length;
    const keepColIndices: number[] = [];
    for (let c = 0; c < colCount; c++) {
      const hasValue = rows.slice(1).some(row => row[c] && row[c].length > 0);
      if (hasValue) keepColIndices.push(c);
    }

    const prunedRows = rows.map(row => keepColIndices.map(c => row[c] || ''));
    const prunedContent = serializeCSV(prunedRows);
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
