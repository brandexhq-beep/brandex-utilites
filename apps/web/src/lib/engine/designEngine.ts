import { ProcessingResult } from './index';

export async function processDesignUtility(
  toolId: string,
  textInput: string
): Promise<ProcessingResult> {
  const input = textInput || '#4F46E5';

  switch (toolId) {
    case 'hex-rgb': {
      let hex = input.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const num = parseInt(hex, 16);
      if (isNaN(num)) return { success: false, error: 'Invalid HEX color code.' };
      
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;

      const rgb = `rgb(${r}, ${g}, ${b})`;
      const json = JSON.stringify({ r, g, b, hex: `#${hex}`, rgb }, null, 2);

      return { success: true, data: json, outputFileName: 'color_rgb.json' };
    }

    case 'rgb-hex': {
      const match = input.match(/\d+/g);
      if (!match || match.length < 3) return { success: false, error: 'Enter valid RGB numbers (e.g. 79, 70, 229).' };
      const r = parseInt(match[0]);
      const g = parseInt(match[1]);
      const b = parseInt(match[2]);
      
      const hex = '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
      return { success: true, data: hex, outputFileName: 'color_hex.txt' };
    }

    case 'css-shadow-gen': {
      const css = `box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.2), 0 8px 10px -6px rgba(79, 70, 229, 0.1);`;
      return { success: true, data: css, outputFileName: 'shadow.css' };
    }

    case 'css-gradient-gen': {
      const css = `background: linear-gradient(135deg, #4F46E5 0%, #6366F1 50%, #7C3AED 100%);`;
      return { success: true, data: css, outputFileName: 'gradient.css' };
    }

    case 'svg-minifier': {
      const svg = textInput || '<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>';
      const minified = svg
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();
      return { success: true, data: minified, outputFileName: 'optimized.svg' };
    }

    default:
      return { success: false, error: `Design utility "${toolId}" is not implemented.` };
  }
}
