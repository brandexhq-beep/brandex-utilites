import { ProcessingResult } from './index';

export async function processDesignUtility(
  toolId: string,
  textInput: string
): Promise<ProcessingResult> {
  const input = textInput.trim() || '#4F46E5';

  switch (toolId) {
    case 'hex-rgb': {
      let hex = input.replace('#', '');
      if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
      const num = parseInt(hex, 16);
      if (isNaN(num) || (hex.length !== 6 && hex.length !== 8)) {
        return { success: false, error: 'Invalid HEX color code (e.g. #4F46E5 or #FFF).' };
      }
      
      const r = (num >> 16) & 255;
      const g = (num >> 8) & 255;
      const b = num & 255;

      const rgb = `rgb(${r}, ${g}, ${b})`;
      const json = JSON.stringify({ r, g, b, hex: `#${hex.toUpperCase()}`, rgb }, null, 2);

      return { success: true, data: json, outputFileName: 'color_rgb.json' };
    }

    case 'rgb-hex': {
      const match = input.match(/\d+/g);
      if (!match || match.length < 3) return { success: false, error: 'Enter valid RGB numbers (e.g. 79, 70, 229).' };
      const r = Math.min(255, Math.max(0, parseInt(match[0], 10)));
      const g = Math.min(255, Math.max(0, parseInt(match[1], 10)));
      const b = Math.min(255, Math.max(0, parseInt(match[2], 10)));
      
      const hex = '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase();
      const output = JSON.stringify({ r, g, b, hex, rgb: `rgb(${r}, ${g}, ${b})` }, null, 2);
      return { success: true, data: output, outputFileName: 'color_hex.json' };
    }

    case 'css-var-extractor': {
      const css = textInput || `:root {\n  --primary-color: #4F46E5;\n  --secondary-color: #6366F1;\n  --font-size-base: 16px;\n  --border-radius: 12px;\n}`;
      const varMatches = [...css.matchAll(/(--[a-zA-Z0-9_-]+)\s*:\s*([^;]+);/g)];
      const variables: Record<string, string> = {};
      
      for (const m of varMatches) {
        variables[m[1].trim()] = m[2].trim();
      }

      const report = {
        totalVariables: Object.keys(variables).length,
        variables
      };

      return {
        success: true,
        data: JSON.stringify(report, null, 2),
        outputFileName: 'css_variables.json'
      };
    }

    case 'css-container-gen': {
      const containerName = (input.match(/^[a-zA-Z0-9_-]+$/) ? input : 'card');
      const css = `/* Responsive CSS Container Queries for .${containerName} */
.${containerName}-wrapper {
  container-type: inline-size;
  container-name: ${containerName};
}

/* Default (Compact) */
.${containerName} {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

/* Medium Breakpoint */
@container ${containerName} (min-width: 450px) {
  .${containerName} {
    flex-direction: row;
    align-items: center;
    padding: 1.5rem;
  }
}

/* Wide Breakpoint */
@container ${containerName} (min-width: 700px) {
  .${containerName} {
    padding: 2rem;
    gap: 2rem;
  }
}`;
      return { success: true, data: css, outputFileName: 'container_queries.css' };
    }

    case 'font-scale-gen': {
      const basePx = parseFloat(input) || 16;
      const ratios = [
        { name: 'Major Second (1.125)', val: 1.125 },
        { name: 'Major Third (1.250)', val: 1.250 },
        { name: 'Perfect Fourth (1.333)', val: 1.333 },
        { name: 'Golden Ratio (1.618)', val: 1.618 }
      ];

      const scaleResult: Record<string, Record<string, string>> = {};

      for (const r of ratios) {
        scaleResult[r.name] = {
          'xs (step -1)': `${(basePx / r.val).toFixed(1)}px (${(1 / r.val).toFixed(3)}rem)`,
          'base (step 0)': `${basePx.toFixed(1)}px (1.000rem)`,
          'md (step 1)': `${(basePx * r.val).toFixed(1)}px (${r.val.toFixed(3)}rem)`,
          'lg (step 2)': `${(basePx * Math.pow(r.val, 2)).toFixed(1)}px (${Math.pow(r.val, 2).toFixed(3)}rem)`,
          'xl (step 3)': `${(basePx * Math.pow(r.val, 3)).toFixed(1)}px (${Math.pow(r.val, 3).toFixed(3)}rem)`,
          '2xl (step 4)': `${(basePx * Math.pow(r.val, 4)).toFixed(1)}px (${Math.pow(r.val, 4).toFixed(3)}rem)`
        };
      }

      return {
        success: true,
        data: JSON.stringify({ baseSizePx: basePx, typographicalScales: scaleResult }, null, 2),
        outputFileName: 'typographical_scales.json'
      };
    }

    case 'css-shadow-gen': {
      const color = input.startsWith('#') ? input : '#4F46E5';
      const css = `/* Layered Elevation Shadow */
box-shadow: 
  0 1px 2px 0 rgba(15, 23, 42, 0.05),
  0 10px 25px -5px ${color}33,
  0 8px 10px -6px ${color}1A;`;
      return { success: true, data: css, outputFileName: 'shadow.css' };
    }

    case 'css-gradient-gen': {
      const color = input.startsWith('#') ? input : '#4F46E5';
      const css = `/* Modern Mesh / Angled Gradient */
background: linear-gradient(135deg, ${color} 0%, #6366F1 50%, #7C3AED 100%);`;
      return { success: true, data: css, outputFileName: 'gradient.css' };
    }

    case 'svg-minifier': {
      const svg = textInput || '<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="3" fill="red" /></svg>';
      const minified = svg
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/>\s+</g, '><')
        .replace(/\s+/g, ' ')
        .trim();
      return { success: true, data: minified, outputFileName: 'optimized.svg' };
    }

    default:
      return { success: false, error: `Design utility "${toolId}" is not implemented.` };
  }
}
