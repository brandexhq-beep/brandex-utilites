import { ProcessingResult } from './index';

export async function processTextUtility(
  toolId: string,
  textInput: string
): Promise<ProcessingResult> {
  const text = textInput || 'The quick brown fox jumps over the lazy dog. BrandEX local-first utilities.';

  switch (toolId) {
    case 'word-counter':
    case 'text-stats': {
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const characters = text.length;
      const sentences = text.split(/[.!?]+/).filter(Boolean).length;
      const paragraphs = text.split(/\n+/).filter(Boolean).length;
      const readingTime = Math.ceil(words / 200);

      const stats = {
        words,
        characters,
        sentences,
        paragraphs,
        readingTimeMinutes: readingTime,
        characterNoSpaces: text.replace(/\s+/g, '').length
      };

      const formatted = `=== TEXT STATISTICS ===\nWords: ${words}\nCharacters: ${characters}\nCharacters (No Spaces): ${stats.characterNoSpaces}\nSentences: ${sentences}\nParagraphs: ${paragraphs}\nEstimated Reading Time: ~${readingTime} min`;

      return {
        success: true,
        data: formatted,
        outputFileName: 'text_stats.txt'
      };
    }

    case 'case-uppercase': {
      return { success: true, data: text.toUpperCase(), outputFileName: 'uppercase.txt' };
    }

    case 'case-lowercase': {
      return { success: true, data: text.toLowerCase(), outputFileName: 'lowercase.txt' };
    }

    case 'case-title': {
      const titleCase = text.replace(
        /\w\S*/g,
        txt => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
      );
      return { success: true, data: titleCase, outputFileName: 'titlecase.txt' };
    }

    case 'case-camel': {
      const camel = text
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
      return { success: true, data: camel, outputFileName: 'camelcase.txt' };
    }

    case 'case-snake': {
      const snake = text
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        ?.map(x => x.toLowerCase())
        .join('_') || text.toLowerCase().replace(/\s+/g, '_');
      return { success: true, data: snake, outputFileName: 'snakecase.txt' };
    }

    case 'case-kebab': {
      const kebab = text
        .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
        ?.map(x => x.toLowerCase())
        .join('-') || text.toLowerCase().replace(/\s+/g, '-');
      return { success: true, data: kebab, outputFileName: 'kebabcase.txt' };
    }

    case 'sort-lines': {
      const sorted = text.split('\n').sort().join('\n');
      return { success: true, data: sorted, outputFileName: 'sorted_lines.txt' };
    }

    case 'dedupe-lines': {
      const lines = text.split('\n');
      const unique = Array.from(new Set(lines)).join('\n');
      return { success: true, data: unique, outputFileName: 'deduped_lines.txt' };
    }

    case 'slug-generator': {
      const slug = text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
      return { success: true, data: slug, outputFileName: 'slug.txt' };
    }

    case 'unicode-normalizer': {
      const nfc = text.normalize('NFC');
      const nfd = text.normalize('NFD');
      return {
        success: true,
        data: `=== UNICODE NORMALIZATION ===\nNFC (Canonical Composition):\n${nfc}\n\nNFD (Canonical Decomposition):\n${nfd}`,
        outputFileName: 'unicode_normalized.txt'
      };
    }

    case 'invisible-char-detector': {
      const hasZeroWidth = /[\u200B-\u200D\uFEFF]/g.test(text);
      const cleaned = text.replace(/[\u200B-\u200D\uFEFF]/g, '');
      return {
        success: true,
        data: `=== INVISIBLE CHARACTER DETECTOR ===\nZero-width spaces detected: ${hasZeroWidth ? 'YES' : 'NO'}\n\nCleaned Text Output:\n${cleaned}`,
        outputFileName: 'cleaned_text.txt'
      };
    }

    case 'regex-regex-extractor': {
      const emails = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g) || [];
      const urls = text.match(/https?:\/\/[^\s/$.?#].[^\s]*/g) || [];
      const ips = text.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g) || [];

      return {
        success: true,
        data: `=== EXTRACTED DATA PATTERNS ===\nEmails Found (${emails.length}):\n${emails.join('\n') || 'None'}\n\nURLs Found (${urls.length}):\n${urls.join('\n') || 'None'}\n\nIP Addresses Found (${ips.length}):\n${ips.join('\n') || 'None'}`,
        outputFileName: 'extracted_patterns.txt'
      };
    }

    default:
      return { success: false, error: `Text utility "${toolId}" is not implemented.` };
  }
}
