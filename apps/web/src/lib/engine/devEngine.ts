import { ProcessingResult } from './imageEngine';

/**
 * Real Local JSON Formatter & Validator
 */
export function formatJSON(input: string, indent: number = 2): ProcessingResult {
  try {
    if (!input || !input.trim()) throw new Error('JSON input cannot be empty.');
    const parsed = JSON.parse(input);
    const formatted = JSON.stringify(parsed, null, indent);
    const blob = new Blob([formatted], { type: 'application/json' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'formatted.json',
      data: formatted,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Invalid JSON format.';
    return {
      success: false,
      error: `Invalid JSON: ${errorMsg}`
    };
  }
}

/**
 * Real Local Base64 Encoder / Decoder
 */
export function processBase64(input: string, mode: 'encode' | 'decode'): ProcessingResult {
  try {
    if (!input) throw new Error('Input string is empty.');
    let result = '';
    if (mode === 'encode') {
      result = btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
    } else {
      result = decodeURIComponent(Array.prototype.map.call(atob(input.trim()), (c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    }
    const blob = new Blob([result], { type: 'text/plain' });
    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: mode === 'encode' ? 'encoded.b64' : 'decoded.txt',
      data: result,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Processing error.';
    return {
      success: false,
      error: `Base64 ${mode} error: ${errorMsg}`
    };
  }
}

/**
 * Real Local JWT Token Decoder
 */
export function decodeJWT(jwtToken: string): ProcessingResult {
  try {
    const parts = jwtToken.trim().split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT format. A valid token consists of 3 dot-separated parts.');
    }
    const b64Decode = (str: string) => {
      let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }
      const binaryString = atob(base64);
      const bytes = Uint8Array.from(binaryString, c => c.charCodeAt(0));
      return JSON.parse(new TextDecoder().decode(bytes));
    };

    const header = b64Decode(parts[0]);
    const payload = b64Decode(parts[1]);

    const decodedResult = JSON.stringify({ header, payload }, null, 2);
    const blob = new Blob([decodedResult], { type: 'application/json' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'jwt_payload.json',
      data: decodedResult,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to decode JWT token.';
    return {
      success: false,
      error: errorMsg
    };
  }
}

/**
 * Real Local Text & Code Diff Checker
 */
export function computeDiff(original: string, modified: string): ProcessingResult {
  try {
    const origLines = (original || '').split('\n');
    const modLines = (modified || '').split('\n');

    const diff: Array<{ type: 'add' | 'remove' | 'same'; text: string; lineNumber?: number }> = [];
    const maxLen = Math.max(origLines.length, modLines.length);

    let additions = 0;
    let deletions = 0;

    for (let i = 0; i < maxLen; i++) {
      const orig = origLines[i];
      const mod = modLines[i];

      if (orig === mod) {
        if (orig !== undefined) diff.push({ type: 'same', text: orig, lineNumber: i + 1 });
      } else {
        if (orig !== undefined) {
          diff.push({ type: 'remove', text: orig, lineNumber: i + 1 });
          deletions++;
        }
        if (mod !== undefined) {
          diff.push({ type: 'add', text: mod, lineNumber: i + 1 });
          additions++;
        }
      }
    }

    const diffOutput = JSON.stringify({ additions, deletions, totalLines: maxLen, diff }, null, 2);
    const blob = new Blob([diffOutput], { type: 'application/json' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'diff_report.json',
      data: { additions, deletions, diff },
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Failed to compute diff.';
    return {
      success: false,
      error: errorMsg
    };
  }
}

/**
 * Real Local cURL to Fetch / Code Converter
 */
export function convertCurl(curlCommand: string): ProcessingResult {
  try {
    if (!curlCommand || !curlCommand.trim()) throw new Error('cURL command cannot be empty.');

    const urlMatch = curlCommand.match(/curl\s+(?:-[A-Za-z0-9-]+\s+)*['"]?([^'"]+)['"]?/i);
    const methodMatch = curlCommand.match(/-X\s+([A-Z]+)/i);
    const method = methodMatch ? methodMatch[1].toUpperCase() : 'GET';
    const url = urlMatch ? urlMatch[1] : 'https://api.brandex.co.in/v1/resource';

    const headerMatches = [...curlCommand.matchAll(/-H\s+['"]([^'"]+)['"]/gi)];
    const headers: Record<string, string> = {};
    for (const m of headerMatches) {
      const [k, ...v] = m[1].split(':');
      if (k && v.length > 0) {
        headers[k.trim()] = v.join(':').trim();
      }
    }

    const dataMatch = curlCommand.match(/(?:-d|--data|--data-raw)\s+['"]([^'"]+)['"]/i);
    const rawBody = dataMatch ? dataMatch[1] : null;

    let bodyExpression = '// No request body';
    if (rawBody) {
      try {
        const parsed = JSON.parse(rawBody);
        bodyExpression = `body: JSON.stringify(${JSON.stringify(parsed, null, 2)})`;
      } catch {
        bodyExpression = `body: ${JSON.stringify(rawBody)}`;
      }
    }

    const jsFetchCode = `// Generated JavaScript Fetch Code by BrandEX
fetch('${url}', {
  method: '${method}',
  headers: ${JSON.stringify(headers, null, 4)},
  ${bodyExpression}
})
  .then(res => res.json())
  .then(data => console.log('Response:', data))
  .catch(err => console.error('Fetch error:', err));`;

    const blob = new Blob([jsFetchCode], { type: 'text/javascript' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'fetch_request.js',
      data: jsFetchCode,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'cURL conversion error.';
    return {
      success: false,
      error: `cURL conversion error: ${errorMsg}`
    };
  }
}

/**
 * Real Local RegEx Evaluator
 */
export function evaluateRegex(pattern: string, text: string): ProcessingResult {
  try {
    if (!pattern) throw new Error('RegEx pattern is required.');
    const regex = new RegExp(pattern, 'g');
    const matches = [];
    let match;
    let iterations = 0;
    const maxIterations = 5000;

    while ((match = regex.exec(text)) !== null) {
      iterations++;
      matches.push({
        index: match.index,
        match: match[0],
        groups: match.slice(1)
      });

      // Prevent infinite loop on empty matches (e.g. .*, ^, \b, ())
      if (match[0].length === 0) {
        regex.lastIndex++;
      }

      if (iterations >= maxIterations) {
        break;
      }
    }

    const output = JSON.stringify({ pattern, totalMatches: matches.length, matches }, null, 2);
    const blob = new Blob([output], { type: 'application/json' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'regex_results.json',
      data: { pattern, totalMatches: matches.length, matches },
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'RegEx evaluation error.';
    return {
      success: false,
      error: `RegEx evaluation error: ${errorMsg}`
    };
  }
}

/**
 * Real Local XML Prettifier & Formatter
 */
export function formatXML(xmlInput: string): ProcessingResult {
  try {
    if (!xmlInput) throw new Error('XML content cannot be empty.');
    let formatted = '';
    const reg = /(>)(<)(\/*)/g;
    const xml = xmlInput.replace(reg, '$1\r\n$2$3');
    let pad = 0;

    xml.split('\r\n').forEach(node => {
      let indent = 0;
      if (node.match(/.+<\/\w[^>]*>$/)) {
        indent = 0;
      } else if (node.match(/^<\/\w/)) {
        if (pad !== 0) pad -= 1;
      } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
        indent = 1;
      } else {
        indent = 0;
      }
      let padding = '';
      for (let i = 0; i < pad; i++) padding += '  ';
      formatted += padding + node + '\r\n';
      pad += indent;
    });

    const blob = new Blob([formatted], { type: 'application/xml' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'formatted.xml',
      data: formatted,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'XML formatting error.';
    return {
      success: false,
      error: `XML formatting error: ${errorMsg}`
    };
  }
}

/**
 * Real Local SQL Query Prettifier
 */
export function formatSQL(sqlInput: string): ProcessingResult {
  try {
    if (!sqlInput) throw new Error('SQL query cannot be empty.');
    const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'ON', 'GROUP BY', 'ORDER BY', 'HAVING', 'LIMIT', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET', 'DELETE'];

    let formatted = sqlInput;
    keywords.forEach(kw => {
      const regex = new RegExp(`\\b${kw}\\b`, 'gi');
      formatted = formatted.replace(regex, `\n${kw}`);
    });

    formatted = formatted.trim();
    const blob = new Blob([formatted], { type: 'text/x-sql' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'query.sql',
      data: formatted,
      outputSize: blob.size
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'SQL formatting error.';
    return {
      success: false,
      error: `SQL formatting error: ${errorMsg}`
    };
  }
}

/**
 * Real Local Code Line Counter
 */
export function countCodeLines(code: string): ProcessingResult {
  const lines = code.split('\n');
  let blankLines = 0;
  let commentLines = 0;
  let codeLines = 0;
  let inBlockComment = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      blankLines++;
      continue;
    }

    if (inBlockComment) {
      commentLines++;
      if (trimmed.includes('*/')) inBlockComment = false;
      continue;
    }

    if (trimmed.startsWith('/*')) {
      commentLines++;
      if (!trimmed.includes('*/')) inBlockComment = true;
      continue;
    }

    if (trimmed.startsWith('//') || trimmed.startsWith('#') || trimmed.startsWith('--')) {
      commentLines++;
      continue;
    }

    codeLines++;
  }

  const report = `=== SOURCE CODE LINE COUNT METRICS ===
Total Lines: ${lines.length}
Code Lines (SLOC): ${codeLines}
Comment Lines: ${commentLines}
Blank / Empty Lines: ${blankLines}
Characters: ${code.length.toLocaleString()}
Non-Whitespace Characters: ${code.replace(/\s+/g, '').length.toLocaleString()}
Average Line Length: ${(code.length / Math.max(1, lines.length)).toFixed(1)} chars`;

  const blob = new Blob([report], { type: 'text/plain' });

  return {
    success: true,
    outputBlob: blob,
    outputUrl: URL.createObjectURL(blob),
    outputFileName: 'line_count_metrics.txt',
    data: report,
    outputSize: blob.size
  };
}

/**
 * Real Local Code Comment Stripper
 */
export function stripCodeComments(code: string): ProcessingResult {
  // Remove multi-line comments: /* ... */
  let stripped = code.replace(/\/\*[\s\S]*?\*\//g, '');
  // Remove single-line comments: // ..., # ..., -- ...
  stripped = stripped.replace(/(^|\s)\/\/[^\n]*/g, '$1');
  stripped = stripped.replace(/(^|\s)#[^\n]*/g, '$1');

  const blob = new Blob([stripped], { type: 'text/plain' });

  return {
    success: true,
    outputBlob: blob,
    outputUrl: URL.createObjectURL(blob),
    outputFileName: 'clean_code.txt',
    data: stripped,
    outputSize: blob.size
  };
}

/**
 * Real Local Trailing Whitespace Cleaner
 */
export function cleanTrailingWhitespace(code: string): ProcessingResult {
  const cleaned = code
    .split('\n')
    .map(line => line.replace(/\s+$/, ''))
    .join('\n');

  const removedBytes = code.length - cleaned.length;
  const blob = new Blob([cleaned], { type: 'text/plain' });

  return {
    success: true,
    outputBlob: blob,
    outputUrl: URL.createObjectURL(blob),
    outputFileName: 'trimmed_code.txt',
    data: cleaned,
    outputSize: blob.size,
    compressionRatio: `${removedBytes} bytes saved`
  };
}

/**
 * Real Local Indentation Converter (Spaces to Tabs or Spaces to Spaces)
 */
export function convertIndentation(code: string, targetSpaces: number = 2, toTabs: boolean = false): ProcessingResult {
  const lines = code.split('\n');
  const converted = lines.map(line => {
    const match = line.match(/^([ \t]+)/);
    if (!match) return line;

    const leading = match[1];
    // Estimate current indent level (assuming tab = 4 or counting leading spaces)
    let spaceCount = 0;
    for (const char of leading) {
      if (char === '\t') spaceCount += 4;
      else spaceCount += 1;
    }

    const level = Math.round(spaceCount / 2);
    const newIndent = toTabs ? '\t'.repeat(level) : ' '.repeat(level * targetSpaces);
    return newIndent + line.slice(leading.length);
  }).join('\n');

  const blob = new Blob([converted], { type: 'text/plain' });

  return {
    success: true,
    outputBlob: blob,
    outputUrl: URL.createObjectURL(blob),
    outputFileName: 'reindented_code.txt',
    data: converted,
    outputSize: blob.size
  };
}

/**
 * Real Local Line Ending Converter (CRLF <-> LF)
 */
export function convertLineEndings(code: string, toFormat: 'LF' | 'CRLF' = 'LF'): ProcessingResult {
  const normalized = code.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const result = toFormat === 'CRLF' ? normalized.replace(/\n/g, '\r\n') : normalized;
  const blob = new Blob([result], { type: 'text/plain' });

  return {
    success: true,
    outputBlob: blob,
    outputUrl: URL.createObjectURL(blob),
    outputFileName: `line_endings_${toFormat.toLowerCase()}.txt`,
    data: `Converted document to ${toFormat} line endings (${toFormat === 'CRLF' ? '\\r\\n' : '\\n'}).`,
    outputSize: blob.size
  };
}

/**
 * Real Local BOM Detector & Cleaner
 */
export function detectAndStripBOM(content: string): ProcessingResult {
  const hasBOM = content.charCodeAt(0) === 0xFEFF;
  const cleaned = hasBOM ? content.slice(1) : content;

  const summary = `=== BYTE ORDER MARK (BOM) REPORT ===
BOM Detected: ${hasBOM ? 'YES (UTF-8 / UTF-16 BOM: \\uFEFF)' : 'NO (Clean UTF-8 Stream)'}
Cleaned Status: ${hasBOM ? 'BOM signature stripped successfully.' : 'No modifications required.'}`;

  const blob = new Blob([cleaned], { type: 'text/plain' });

  return {
    success: true,
    outputBlob: blob,
    outputUrl: URL.createObjectURL(blob),
    outputFileName: 'clean_bom.txt',
    data: summary + '\n\n' + cleaned,
    outputSize: blob.size
  };
}

/**
 * Real Local Source Code Statistics & Complexity Estimator
 */
export function computeSourceCodeStats(code: string): ProcessingResult {
  const lines = code.split('\n');
  const lineCount = lines.length;
  const words = code.trim().split(/\s+/).filter(Boolean).length;
  const chars = code.length;

  // Rough cyclomatic complexity heuristic based on decision keywords
  const branches = (code.match(/\b(if|else if|for|while|case|catch|\?|&&|\|\|)\b/g) || []).length;
  const complexity = branches + 1;

  const report = `=== SOURCE CODE COMPLEXITY & STATISTICAL PROFILE ===
Total Lines: ${lineCount}
Total Words: ${words}
Characters: ${chars}
Estimated Decision Branches: ${branches}
Cyclomatic Complexity Index: ${complexity} (${complexity < 10 ? 'Low / Maintainable' : complexity < 25 ? 'Moderate' : 'High / Refactor Recommended'})
Max Line Length: ${Math.max(...lines.map(l => l.length), 0)} characters
Estimated Token Count: ~${Math.round(chars / 4)}`;

  const blob = new Blob([report], { type: 'text/plain' });

  return {
    success: true,
    outputBlob: blob,
    outputUrl: URL.createObjectURL(blob),
    outputFileName: 'code_statistics.txt',
    data: report,
    outputSize: blob.size
  };
}
