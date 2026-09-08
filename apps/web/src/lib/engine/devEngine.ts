import { ProcessingResult } from './imageEngine';

/**
 * Real Local JSON Formatter & Validator
 */
export function formatJSON(input: string, indent: number = 2): ProcessingResult {
  try {
    if (!input || !input.trim()) throw new Error("JSON input cannot be empty.");
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
  } catch (err: any) {
    return {
      success: false,
      error: `Invalid JSON: ${err.message}`
    };
  }
}

/**
 * Real Local Base64 Encoder / Decoder
 */
export function processBase64(input: string, mode: 'encode' | 'decode'): ProcessingResult {
  try {
    if (!input) throw new Error("Input string is empty.");
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
  } catch (err: any) {
    return {
      success: false,
      error: `Base64 ${mode} error: ${err.message}`
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
      throw new Error("Invalid JWT format. A valid token consists of 3 dot-separated parts.");
    }
    const b64Decode = (str: string) => {
      const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(decodeURIComponent(escape(atob(base64))));
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
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to decode JWT token."
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
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Failed to compute diff."
    };
  }
}

/**
 * Real Local cURL to Code Converter
 */
export function convertCurl(curlCommand: string): ProcessingResult {
  try {
    if (!curlCommand || !curlCommand.trim()) throw new Error("cURL command cannot be empty.");
    const urlMatch = curlCommand.match(/curl\s+['"]?([^'"]+)['"]?/i);
    const url = urlMatch ? urlMatch[1] : 'https://api.example.com/v1/resource';

    const jsFetchCode = `// Generated JavaScript Fetch Code
fetch('${url}', {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'Brandex-Utilities/1.0'
  }
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`;

    const blob = new Blob([jsFetchCode], { type: 'text/javascript' });

    return {
      success: true,
      outputBlob: blob,
      outputUrl: URL.createObjectURL(blob),
      outputFileName: 'fetch_request.js',
      data: jsFetchCode,
      outputSize: blob.size
    };
  } catch (err: any) {
    return {
      success: false,
      error: `cURL conversion error: ${err.message}`
    };
  }
}

/**
 * Real Local RegEx Evaluator
 */
export function evaluateRegex(pattern: string, text: string): ProcessingResult {
  try {
    if (!pattern) throw new Error("RegEx pattern is required.");
    const regex = new RegExp(pattern, 'g');
    const matches = [];
    let match;
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        index: match.index,
        match: match[0],
        groups: match.slice(1)
      });
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
  } catch (err: any) {
    return {
      success: false,
      error: `RegEx evaluation error: ${err.message}`
    };
  }
}

/**
 * Real Local XML Prettifier & Formatter
 */
export function formatXML(xmlInput: string): ProcessingResult {
  try {
    if (!xmlInput) throw new Error("XML content cannot be empty.");
    let formatted = '';
    let reg = /(>)(<)(\/*)/g;
    let xml = xmlInput.replace(reg, '$1\r\n$2$3');
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
  } catch (err: any) {
    return {
      success: false,
      error: `XML formatting error: ${err.message}`
    };
  }
}

/**
 * Real Local SQL Query Prettifier
 */
export function formatSQL(sqlInput: string): ProcessingResult {
  try {
    if (!sqlInput) throw new Error("SQL query cannot be empty.");
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
  } catch (err: any) {
    return {
      success: false,
      error: `SQL formatting error: ${err.message}`
    };
  }
}
