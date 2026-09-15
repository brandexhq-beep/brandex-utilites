/**
 * BrandEX Utilities — Sample Data Repository
 * Realistic, high-quality test payloads for instant 1-click testing across all utilities.
 */

export interface SamplePayload {
  text?: string;
  options?: Record<string, any>;
  description: string;
}

export const SAMPLE_DATA: Record<string, SamplePayload> = {
  // 1. JSON & APIs
  'json-formatter': {
    description: 'Formatted JSON User API response',
    text: '{"status":"success","data":{"userId":"usr_9842","name":"Sarah Jenkins","email":"sarah.jenkins@brandex.co.in","role":"Product Director","organizations":["BrandEX Global","Acme Corp"],"settings":{"twoFactorEnabled":true,"theme":"dark","notifications":{"email":true,"sms":false,"push":true}},"stats":{"logins":142,"lastLogin":"2026-09-15T08:30:00Z"}}}',
  },
  'json-to-csv': {
    description: 'Sample JSON Array of Customer Orders',
    text: JSON.stringify([
      { order_id: 'ORD-101', customer: 'Alice Wong', product: 'BrandEX Pro Cloud', amount_usd: 129.00, status: 'Completed' },
      { order_id: 'ORD-102', customer: 'Bob Vance', product: 'Custom Web Suite', amount_usd: 1450.00, status: 'In Progress' },
      { order_id: 'ORD-103', customer: 'Charlie Kelly', product: 'Security Audit', amount_usd: 850.00, status: 'Pending' }
    ], null, 2),
  },
  'json-key-finder': {
    description: 'Deeply nested JSON object with identifiers',
    text: JSON.stringify({
      company: 'BrandEX Digital',
      departments: [
        { name: 'Engineering', lead: { id: 'ENG-01', name: 'Dev Lead' }, members: [{ id: 'ENG-02' }, { id: 'ENG-03' }] },
        { name: 'Design', lead: { id: 'DES-01', name: 'Creative Lead' }, members: [{ id: 'DES-02' }] }
      ]
    }, null, 2),
  },

  // 2. CSV & Data
  'csv-to-json': {
    description: 'RFC 4180 CSV with quoted strings and commas',
    text: `id,customer_name,company,email,deal_value_usd,city,status\n1,"Anderson, Thomas","MetaCortex, Inc.",neo@metacortex.com,45000,"San Francisco, CA",Active\n2,"Trinity, Captain","Nebuchadnezzar LLC",trinity@zion.org,62000,"Zion Core",Verified\n3,"Smith, Agent","Matrix Security Services",agent.smith@matrix.net,99000,"New York, NY",Negotiating`,
  },
  'csv-header-normalizer': {
    description: 'Unnormalized raw CSV headers',
    text: `Customer Full Name,Order ID Number,Total Amount (USD),Creation Date,Is Account Active?\n"John Doe",1001,49.99,"2026-01-10",TRUE\n"Jane Smith",1002,199.50,"2026-02-14",TRUE`,
  },
  'csv-quote-fixer': {
    description: 'Malformed CSV with uneven quotes',
    text: `id,name,notes\n1,Alice,Senior "Lead" Architect\n2,Bob,"Notes with "quotes" inside"\n3,Charlie,Clean text`,
  },

  // 3. Developer Tools
  'jwt-debugger': {
    description: 'Standard RFC 7519 JSON Web Token (HS256)',
    text: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNhcmFoIEplbmtpbnMiLCJlbWFpbCI6InNhcmFoQGJyYW5kZXguY28uaW4iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6MTc1MDAwMDAwMH0.XgVb0c03xX0r3g518oI_vJ21tH79n8mQ2A4B6C8D0E1',
  },
  'regex-tester': {
    description: 'Email detection regex with sample text',
    text: 'Contact our agency at hello@brandex.co.in, support@brandex.co.in or personal founder email srush@brandex.co.in for enterprise software projects.',
    options: {
      pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}'
    }
  },
  'curl-converter': {
    description: 'cURL POST request to BrandEX API',
    text: `curl -X POST https://api.brandex.co.in/v1/utilities/process \\\n  -H "Authorization: Bearer brandex_live_token_7789" \\\n  -H "Content-Type: application/json" \\\n  -d '{"task": "batch_convert", "format": "webp", "quality": 90}'`,
  },
  'base64': {
    description: 'Text string for Base64 encoding/decoding',
    text: 'BrandEX Digital Agency — Crafting world-class websites, software, and automation for modern businesses. Visit https://brandex.co.in',
  },
  'url-encoder': {
    description: 'Complex URL with parameters and special characters',
    text: 'https://brandex.co.in/services?category=Custom Software & Web Engineering&client=Enterprise Group&tags=react,astro,tailwind',
  },

  // 4. Security & Cryptography
  'hash-calculator': {
    description: 'Cryptographic test string for SHA-256 / SHA-512',
    text: 'BrandEX Secure Cryptographic Hash Payload — Verifying file integrity and zero server leakage.',
  },
  'checksum-calc': {
    description: 'Deterministic payload for checksum verification',
    text: 'brandex-enterprise-release-v2.4.0-checksum-verification-string',
  },
  'password-gen': {
    description: '16-character high entropy password config',
    options: { length: 20 }
  },
  'uuid-generator': {
    description: 'Batch of 5 unique RFC 4122 v4 UUIDs',
    options: { count: 5 }
  },

  // 5. Design & CSS
  'rgb-hex': {
    description: 'BrandEX Indigo brand colors (RGB to HEX)',
    text: '79, 70, 229',
  },
  'css-var-extractor': {
    description: 'Production CSS stylesheet with CSS custom properties',
    text: `:root {\n  --brand-primary: #4F46E5;\n  --brand-secondary: #0F172A;\n  --brand-accent: #7C3AED;\n  --brand-surface: #F8FAFC;\n  --brand-border: #E2E8F0;\n  --font-family-base: "Inter", system-ui, sans-serif;\n  --container-max-width: 1280px;\n  --shadow-elevation: 0 10px 25px -5px rgba(79, 70, 229, 0.1);\n}\n\nbody {\n  color: var(--brand-secondary);\n  background: var(--brand-surface);\n}`,
  },
  'css-container-gen': {
    description: 'Responsive container query configuration',
    text: '.card-container { container-type: inline-size; container-name: card; }',
  },
  'aspect-ratio': {
    description: '4K Ultra HD Dimensions',
    text: '3840x2160',
  },

  // 6. Text & String
  'case-converter': {
    description: 'Multi-case sentence to transform',
    text: 'BrandEX Digital Agency Builds Custom High-Performance Software And Enterprise Portals',
  },
  'word-counter': {
    description: 'Comprehensive business pitch paragraph',
    text: 'BrandEX is a full-service digital agency focused on delivering cutting-edge websites, bespoke software applications, and complete business workflow automations. Our team of senior designers and engineers partners with enterprises and startups to accelerate growth and operational efficiency.',
  },
  'slug-generator': {
    description: 'Article headline with punctuation',
    text: 'How BrandEX Utilities Delivers 100% In-Browser Privacy & Lightning Speed In 2026!',
  },

  // 7. Date & Time
  'cron-parser': {
    description: 'Production cron schedule (Every weekday at 9:00 AM)',
    text: '0 9 * * 1-5',
  },
  'work-week-calc': {
    description: 'Quarterly business sprint timeframe',
    text: '2026-09-01, 2026-10-31',
  },

  // 8. Math & Units
  'bit-byte-calc': {
    description: '500 Megabytes to bits and gigabytes',
    text: '500 MB',
  },
  'ppi-calc': {
    description: 'MacBook Pro 16-inch Retina (3456 x 2234 at 16.2")',
    text: '3456, 2234, 16.2',
  },

  // 9. Web & HTML
  'markdown-preview': {
    description: 'Rich Markdown documentation with code and quotes',
    text: `# BrandEX Utilities Platform\n\n> 100% Client-Side Local Browser Engine.\n\n### Key Features\n- **Zero Server Uploads**: Complete privacy for sensitive business files.\n- **Instant WebAssembly Speed**: High performance image and PDF pipelines.\n- **Open & Free**: Developed by [BrandEX](https://brandex.co.in).\n\n\`\`\`javascript\nconst engine = new BrandexLocalEngine();\nawait engine.execute('pdf-compress', { file });\n\`\`\``,
  },
  'meta-tags-gen': {
    description: 'BrandEX Agency Website Details',
    text: 'BrandEX | Digital Agency for Websites, Software & Business Systems\nhttps://brandex.co.in\nHigh-performance web applications, enterprise platforms, and digital transformation services.',
  }
};

/**
 * Helper to retrieve sample payload for a specific tool ID, or fallback intelligently.
 */
export function getSampleDataForTool(toolId: string): SamplePayload | null {
  if (SAMPLE_DATA[toolId]) {
    return SAMPLE_DATA[toolId];
  }

  // Smart fallbacks by tool characteristics
  if (toolId.includes('json')) {
    return SAMPLE_DATA['json-formatter'];
  }
  if (toolId.includes('csv')) {
    return SAMPLE_DATA['csv-to-json'];
  }
  if (toolId.includes('hash') || toolId.includes('checksum')) {
    return SAMPLE_DATA['hash-calculator'];
  }
  if (toolId.includes('case') || toolId.includes('text') || toolId.includes('word') || toolId.includes('slug')) {
    return SAMPLE_DATA['case-converter'];
  }
  if (toolId.includes('cron')) {
    return SAMPLE_DATA['cron-parser'];
  }
  if (toolId.includes('ratio')) {
    return SAMPLE_DATA['aspect-ratio'];
  }
  if (toolId.includes('uuid')) {
    return SAMPLE_DATA['uuid-generator'];
  }
  if (toolId.includes('password')) {
    return SAMPLE_DATA['password-gen'];
  }

  return null;
}
