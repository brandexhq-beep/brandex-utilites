import { ProcessingResult } from './index';

export async function processMathUtility(
  toolId: string,
  textInput: string
): Promise<ProcessingResult> {
  const val = parseFloat(textInput) || 16;

  switch (toolId) {
    case 'px-rem': {
      const rem = val / 16;
      const res = `${val}px = ${rem}rem (based on 16px base font size)`;
      return { success: true, data: res, outputFileName: 'px_to_rem.txt' };
    }

    case 'rem-px': {
      const px = val * 16;
      const res = `${val}rem = ${px}px (based on 16px base font size)`;
      return { success: true, data: res, outputFileName: 'rem_to_px.txt' };
    }

    case 'aspect-ratio': {
      const w = 1920;
      const h = 1080;
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const divisor = gcd(w, h);
      const ratio = `${w / divisor}:${h / divisor}`;
      return { success: true, data: `Width: 1920, Height: 1080 -> Aspect Ratio: ${ratio} (16:9 widescreen)`, outputFileName: 'aspect_ratio.txt' };
    }

    default:
      return { success: false, error: `Math utility "${toolId}" is not implemented.` };
  }
}
