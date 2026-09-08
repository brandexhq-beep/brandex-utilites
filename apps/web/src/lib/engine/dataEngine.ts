import { ProcessingResult } from './imageEngine';

/**
 * Real Local JSON to CSV Converter
 */
export function jsonToCSV(jsonInput: string): ProcessingResult {
  try {
    const data = JSON.parse(jsonInput);
    const array = Array.isArray(data) ? data : [data];
    if (array.length === 0) throw new Error("JSON array is empty.");

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
  } catch (err: any) {
    return {
      success: false,
      error: `JSON to CSV error: ${err.message}`
    };
  }
}

/**
 * Real Local CSV to JSON Converter
 */
export function csvToJSON(csvInput: string): ProcessingResult {
  try {
    const lines = csvInput.trim().split('\n');
    if (lines.length < 2) throw new Error("CSV must contain at least a header row and one data row.");

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
  } catch (err: any) {
    return {
      success: false,
      error: `CSV to JSON error: ${err.message}`
    };
  }
}
