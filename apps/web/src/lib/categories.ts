export interface UtilityItem {
  id: string;
  name: string;
  description: string;
  badge?: string;
  isLocalOnly: boolean;
  inputFormats: string[];
  outputFormats: string[];
  subgroup?: string;
}

export interface CategoryData {
  id: string;
  slug: string;
  title: string;
  name: string;
  subtitle: string;
  description: string;
  iconName: string;
  accentColor: string;
  toolCount: number;
  featuredTools: UtilityItem[];
}

export const CATEGORIES: CategoryData[] = [
  // 1. PDF & DOCUMENTS
  {
    id: 'pdf',
    slug: 'pdf',
    title: 'PDF & DOCUMENTS',
    name: 'PDF & Documents',
    subtitle: 'Merge, split, compress, protect, edit layout, inspect navigation, fill forms & analyze DOCX.',
    description: 'Local-first document processing utilities. All operations execute safely inside your browser session without exposing sensitive business documents to third party servers.',
    iconName: 'FileText',
    accentColor: '#4F46E5',
    toolCount: 38,
    featuredTools: [
      // PDF Core Engine
      { id: 'pdf-compress', name: 'Compress PDF Document', description: 'Reduce PDF file size while preserving text and image clarity.', badge: 'DOCUMENT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Processing' },
      { id: 'pdf-merge', name: 'Merge Multiple PDFs', description: 'Combine multiple PDF documents into a single organized file.', badge: 'DOCUMENT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Processing' },
      { id: 'pdf-split', name: 'Split PDF Pages', description: 'Extract specific pages or break a large document into individual files.', badge: 'DOCUMENT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Processing' },
      { id: 'pdf-to-img', name: 'PDF to High-Res Images', description: 'Convert PDF pages into high-resolution JPG or PNG images.', badge: 'DOCUMENT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PNG', 'JPG'], subgroup: 'PDF Processing' },
      { id: 'img-to-pdf', name: 'Images to PDF Converter', description: 'Convert single or batch photos into a single PDF document.', badge: 'DOCUMENT ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG', 'WEBP'], outputFormats: ['PDF'], subgroup: 'PDF Processing' },
      { id: 'pdf-encrypt', name: 'Password Protect PDF', description: 'Encrypt your document with AES-256 password protection.', badge: 'SECURITY ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Processing' },
      // PDF Editing & Layout
      { id: 'pdf-margin-editor', name: 'PDF Page Margin Editor', description: 'Adjust document margins and visual page spacing locally.', badge: 'LAYOUT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Editing & Layout' },
      { id: 'pdf-bg-editor', name: 'PDF Page Background Editor', description: 'Modify page background colors or overlay background textures.', badge: 'LAYOUT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Editing & Layout' },
      { id: 'pdf-color-converter', name: 'PDF Page Color Converter', description: 'Convert colored PDF pages into grayscale or monochrome.', badge: 'LAYOUT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Editing & Layout' },
      { id: 'pdf-template-creator', name: 'PDF Page Template Creator', description: 'Build reusable structural grid templates for PDF exports.', badge: 'LAYOUT ENGINE', isLocalOnly: true, inputFormats: ['Config'], outputFormats: ['PDF'], subgroup: 'PDF Editing & Layout' },
      { id: 'pdf-label-editor', name: 'PDF Page Label Editor', description: 'Customize page numbering labels, headers, and footer tags.', badge: 'LAYOUT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Editing & Layout' },
      { id: 'pdf-orientation-analyzer', name: 'PDF Page Orientation Analyzer', description: 'Detect portrait vs landscape pages across multi-page documents.', badge: 'LAYOUT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['JSON'], subgroup: 'PDF Editing & Layout' },
      { id: 'pdf-rotation-batch', name: 'PDF Page Rotation Batch Editor', description: 'Batch rotate PDF pages in 90-degree increments.', badge: 'LAYOUT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Editing & Layout' },
      { id: 'pdf-dimension-converter', name: 'PDF Page Dimension Converter', description: 'Rescale PDF dimensions between Letter, A4, Legal, and Tabloid.', badge: 'LAYOUT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Editing & Layout' },
      { id: 'pdf-bleed-editor', name: 'PDF Bleed Box Editor', description: 'Inspect and set print bleed box boundaries.', badge: 'LAYOUT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Editing & Layout' },
      { id: 'pdf-trim-editor', name: 'PDF Trim Box Editor', description: 'Set exact page trim dimensions for commercial printing.', badge: 'LAYOUT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Editing & Layout' },
      { id: 'pdf-media-editor', name: 'PDF Media Box Editor', description: 'Define the total physical boundary box of PDF pages.', badge: 'LAYOUT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Editing & Layout' },
      { id: 'pdf-crop-editor', name: 'PDF Crop Box Editor', description: 'Adjust printable bounding box coordinates.', badge: 'LAYOUT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Editing & Layout' },
      { id: 'pdf-art-editor', name: 'PDF Art Box Editor', description: 'Define intent boundaries for document illustrations.', badge: 'LAYOUT ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Editing & Layout' },
      // PDF Navigation
      { id: 'pdf-destination-inspector', name: 'PDF Destination Inspector', description: 'Parse named destination targets inside interactive PDFs.', badge: 'NAV ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['JSON'], subgroup: 'PDF Navigation' },
      { id: 'pdf-internal-link-mapper', name: 'PDF Internal Link Mapper', description: 'Map page jump links and cross-references across chapters.', badge: 'NAV ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['Graph'], subgroup: 'PDF Navigation' },
      { id: 'pdf-external-link-mapper', name: 'PDF External Link Mapper', description: 'Extract all web hyper-references and external links embedded in PDF.', badge: 'NAV ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['URLs'], subgroup: 'PDF Navigation' },
      { id: 'pdf-named-dest', name: 'PDF Named Destination Inspector', description: 'List named anchors and jump targets.', badge: 'NAV ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['JSON'], subgroup: 'PDF Navigation' },
      { id: 'pdf-page-label-gen', name: 'PDF Page Label Generator', description: 'Generate custom Roman numeral or alphanumeric page label trees.', badge: 'NAV ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Navigation' },
      { id: 'pdf-nav-tree', name: 'PDF Navigation Tree Inspector', description: 'Visualize interactive table-of-contents structural trees.', badge: 'NAV ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['Tree'], subgroup: 'PDF Navigation' },
      { id: 'pdf-outline-depth', name: 'PDF Outline Depth Analyzer', description: 'Analyze bookmark nesting levels and document hierarchy.', badge: 'NAV ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['Stats'], subgroup: 'PDF Navigation' },
      { id: 'pdf-bookmark-validator', name: 'PDF Bookmark Hierarchy Validator', description: 'Check broken destination anchors in document bookmarks.', badge: 'NAV ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['Report'], subgroup: 'PDF Navigation' },
      // PDF Forms
      { id: 'pdf-form-filler', name: 'PDF Form Field Filler', description: 'Populate interactive AcroForm fields locally in browser memory.', badge: 'FORM ENGINE', isLocalOnly: true, inputFormats: ['PDF', 'JSON'], outputFormats: ['PDF'], subgroup: 'PDF Forms' },
      { id: 'pdf-form-renamer', name: 'PDF Form Field Renamer', description: 'Batch update key identifiers of form text inputs and checkboxes.', badge: 'FORM ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Forms' },
      { id: 'pdf-form-converter', name: 'PDF Form Field Type Converter', description: 'Transform text inputs into dropdown lists or signature blocks.', badge: 'FORM ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Forms' },
      { id: 'pdf-form-default-val', name: 'PDF Form Field Default Value Editor', description: 'Set pre-filled initial values for form inputs.', badge: 'FORM ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Forms' },
      { id: 'pdf-form-required', name: 'PDF Form Field Required/Optional Editor', description: 'Toggle mandatory validation flags on form inputs.', badge: 'FORM ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Forms' },
      { id: 'pdf-form-tab-order', name: 'PDF Form Field Tab Order Editor', description: 'Re-order keyboard navigation focus order for form fields.', badge: 'FORM ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['PDF'], subgroup: 'PDF Forms' },
      { id: 'pdf-form-appearance', name: 'PDF Form Field Appearance Inspector', description: 'Inspect field fonts, stroke widths, and background colors.', badge: 'FORM ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['JSON'], subgroup: 'PDF Forms' },
      { id: 'pdf-form-exporter', name: 'PDF Form Field Exporter', description: 'Export entered user data into JSON or FDF form payloads.', badge: 'FORM ENGINE', isLocalOnly: true, inputFormats: ['PDF'], outputFormats: ['JSON'], subgroup: 'PDF Forms' },
      // Documents (DOCX)
      { id: 'docx-page-count', name: 'DOCX Page Count Analyzer', description: 'Estimate exact printed page count and paragraph counts for Word docs.', badge: 'DOCX ENGINE', isLocalOnly: true, inputFormats: ['DOCX'], outputFormats: ['Stats'], subgroup: 'Documents' },
      { id: 'docx-style-inspector', name: 'DOCX Style Inspector', description: 'Extract font names, paragraph margins, and color schemes from DOCX XML.', badge: 'DOCX ENGINE', isLocalOnly: true, inputFormats: ['DOCX'], outputFormats: ['JSON'], subgroup: 'Documents' },
      { id: 'docx-heading-inspector', name: 'DOCX Heading Inspector', description: 'Extract outline structure (H1-H6) from Word documents.', badge: 'DOCX ENGINE', isLocalOnly: true, inputFormats: ['DOCX'], outputFormats: ['Tree'], subgroup: 'Documents' },
      { id: 'docx-image-extractor', name: 'DOCX Image Extractor', description: 'Extract embedded PNG and JPG images from DOCX archive packages.', badge: 'DOCX ENGINE', isLocalOnly: true, inputFormats: ['DOCX'], outputFormats: ['PNG', 'JPG'], subgroup: 'Documents' }
    ]
  },

  // 2. IMAGES & MEDIA
  {
    id: 'images',
    slug: 'images',
    title: 'IMAGES & MEDIA',
    name: 'Images & Media',
    subtitle: 'Compress, crop, resize, convert formats, edit DPI, convert HEIC/PSD, and analyze image channels.',
    description: 'Lightning-fast image optimization and transformation suite powered by modern WebAssembly and HTML5 canvas APIs.',
    iconName: 'Image',
    accentColor: '#4F46E5',
    toolCount: 35,
    featuredTools: [
      // Core Image Tools
      { id: 'img-compress', name: 'Image Compressor Engine', description: 'Compress PNG, JPG, and WebP images up to 80% without visible quality loss.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG', 'WEBP'], outputFormats: ['PNG', 'JPG', 'WEBP'], subgroup: 'Image Processing' },
      { id: 'img-convert', name: 'Universal Image Converter', description: 'Convert images instantly between PNG, JPG, WEBP, GIF, and ICO.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG', 'WEBP'], outputFormats: ['PNG', 'JPG', 'WEBP', 'ICO'], subgroup: 'Image Processing' },
      { id: 'img-resize', name: 'Image Dimension Scaler', description: 'Scale dimensions by exact pixels or percentage ratio.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG', 'WEBP'], outputFormats: ['PNG', 'JPG', 'WEBP'], subgroup: 'Image Processing' },
      { id: 'exif-remove', name: 'Strip EXIF Metadata', description: 'Remove camera specs, location coordinates, and timestamps for privacy.', badge: 'PRIVACY ENGINE', isLocalOnly: true, inputFormats: ['JPG', 'PNG'], outputFormats: ['JPG', 'PNG'], subgroup: 'Image Processing' },
      // Processing
      { id: 'img-dpi-editor', name: 'Image DPI Editor', description: 'Modify print DPI metadata (72 DPI, 150 DPI, 300 DPI) without re-sampling.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['JPG', 'PNG'], outputFormats: ['JPG', 'PNG'], subgroup: 'Image Processing' },
      { id: 'img-res-editor', name: 'Image Resolution Editor', description: 'Resample image grid density for digital screen displays.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG'], outputFormats: ['PNG', 'JPG'], subgroup: 'Image Processing' },
      { id: 'img-canvas-expander', name: 'Image Canvas Expander', description: 'Extend outer padding and background border spacing around images.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG'], outputFormats: ['PNG', 'JPG'], subgroup: 'Image Processing' },
      { id: 'img-canvas-trimmer', name: 'Image Canvas Trimmer', description: 'Auto-trim transparent or solid color borders around graphics.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['PNG'], outputFormats: ['PNG'], subgroup: 'Image Processing' },
      { id: 'img-fit-box', name: 'Image Fit-to-Box', description: 'Resize images to fit inside bounding constraints with aspect preservation.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG'], outputFormats: ['PNG'], subgroup: 'Image Processing' },
      { id: 'img-fill-box', name: 'Image Fill-to-Box', description: 'Crop images to completely fill exact target aspect ratio dimensions.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG'], outputFormats: ['PNG'], subgroup: 'Image Processing' },
      { id: 'img-exact-kb', name: 'Image Exact-KB Optimizer', description: 'Iteratively compress image quality to match an exact target byte threshold (e.g. 50 KB).', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['JPG', 'PNG'], outputFormats: ['JPG'], subgroup: 'Image Processing' },
      { id: 'img-exact-dim', name: 'Image Exact-Dimensions Optimizer', description: 'Enforce precise width x height dimensions with smart scaling.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG'], outputFormats: ['PNG'], subgroup: 'Image Processing' },
      { id: 'img-aspect-cropper', name: 'Image Aspect-Ratio Cropper', description: 'Crop photos to 1:1, 16:9, 4:3, or 9:16 social presets.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG'], outputFormats: ['PNG'], subgroup: 'Image Processing' },
      { id: 'img-batch-watermark', name: 'Image Batch Watermarker', description: 'Apply text or logo image watermarks across multiple photos.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG'], outputFormats: ['PNG', 'JPG'], subgroup: 'Image Processing' },
      { id: 'img-batch-resize', name: 'Image Batch Resizer', description: 'Process batch dimension scaling for hundreds of image assets.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG'], outputFormats: ['PNG', 'JPG'], subgroup: 'Image Processing' },
      { id: 'img-batch-rename', name: 'Image Batch Renamer', description: 'Rename photo filenames based on sequential rules and timestamps.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['Files'], outputFormats: ['Files'], subgroup: 'Image Processing' },
      { id: 'img-sequence-creator', name: 'Image Sequence Creator', description: 'Combine individual frames into animated sequence formats.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['PNG'], outputFormats: ['GIF', 'WEBP'], subgroup: 'Image Processing' },
      { id: 'img-sequence-extractor', name: 'Image Sequence Extractor', description: 'Deconstruct animated GIFs or WebPs into individual frame images.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['GIF', 'WEBP'], outputFormats: ['PNG'], subgroup: 'Image Processing' },
      { id: 'img-strip-gen', name: 'Image Strip Generator', description: 'Stitch horizontal or vertical photo strips.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG'], outputFormats: ['PNG'], subgroup: 'Image Processing' },
      { id: 'img-tile-gen', name: 'Image Seamless Tile Generator', description: 'Test and craft seamlessly repeating background tiles.', badge: 'MEDIA ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG'], outputFormats: ['PNG'], subgroup: 'Image Processing' },
      // Formats
      { id: 'heic-jpg', name: 'HEIC → JPG Converter', description: 'Convert Apple iPhone HEIC photos into widely compatible JPGs.', badge: 'FORMAT ENGINE', isLocalOnly: true, inputFormats: ['HEIC'], outputFormats: ['JPG'], subgroup: 'Image Formats' },
      { id: 'heic-png', name: 'HEIC → PNG Converter', description: 'Convert HEIC images to transparent PNG graphics.', badge: 'FORMAT ENGINE', isLocalOnly: true, inputFormats: ['HEIC'], outputFormats: ['PNG'], subgroup: 'Image Formats' },
      { id: 'heif-jpg', name: 'HEIF → JPG Converter', description: 'Transform High Efficiency Image Format files to JPG.', badge: 'FORMAT ENGINE', isLocalOnly: true, inputFormats: ['HEIF'], outputFormats: ['JPG'], subgroup: 'Image Formats' },
      { id: 'heif-png', name: 'HEIF → PNG Converter', description: 'Convert HEIF assets to uncompressed PNG.', badge: 'FORMAT ENGINE', isLocalOnly: true, inputFormats: ['HEIF'], outputFormats: ['PNG'], subgroup: 'Image Formats' },
      { id: 'jxl-png', name: 'JPEG XL → PNG Converter', description: 'Convert next-gen JPEG XL images to PNG format.', badge: 'FORMAT ENGINE', isLocalOnly: true, inputFormats: ['JXL'], outputFormats: ['PNG'], subgroup: 'Image Formats' },
      { id: 'jxl-jpg', name: 'JPEG XL → JPG Converter', description: 'Convert JPEG XL files to standardized JPG photos.', badge: 'FORMAT ENGINE', isLocalOnly: true, inputFormats: ['JXL'], outputFormats: ['JPG'], subgroup: 'Image Formats' },
      { id: 'psd-preview', name: 'PSD Preview Extractor', description: 'Render fast web previews of Photoshop PSD project files.', badge: 'FORMAT ENGINE', isLocalOnly: true, inputFormats: ['PSD'], outputFormats: ['PNG'], subgroup: 'Image Formats' },
      { id: 'psd-layer-inspector', name: 'PSD Layer Inspector', description: 'Inspect Photoshop document layer hierarchy and layer names.', badge: 'FORMAT ENGINE', isLocalOnly: true, inputFormats: ['PSD'], outputFormats: ['Tree'], subgroup: 'Image Formats' },
      { id: 'eps-preview', name: 'EPS Preview Generator', description: 'Render vector Encapsulated PostScript files into PNG.', badge: 'FORMAT ENGINE', isLocalOnly: true, inputFormats: ['EPS'], outputFormats: ['PNG'], subgroup: 'Image Formats' },
      { id: 'tga-png', name: 'TGA → PNG Converter', description: 'Convert TARGA game textures into PNG graphics.', badge: 'FORMAT ENGINE', isLocalOnly: true, inputFormats: ['TGA'], outputFormats: ['PNG'], subgroup: 'Image Formats' },
      { id: 'tga-jpg', name: 'TGA → JPG Converter', description: 'Convert TGA image files to JPG.', badge: 'FORMAT ENGINE', isLocalOnly: true, inputFormats: ['TGA'], outputFormats: ['JPG'], subgroup: 'Image Formats' },
      { id: 'pcx-png', name: 'PCX → PNG Converter', description: 'Convert legacy ZSoft PCX image files into PNG.', badge: 'FORMAT ENGINE', isLocalOnly: true, inputFormats: ['PCX'], outputFormats: ['PNG'], subgroup: 'Image Formats' },
      // Analysis
      { id: 'img-noise-analyzer', name: 'Image Noise Analyzer', description: 'Measure ISO noise and pixel grain distribution.', badge: 'ANALYSIS ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG'], outputFormats: ['Stats'], subgroup: 'Image Analysis' },
      { id: 'img-blur-detect', name: 'Image Blur Detection', description: 'Evaluate image sharpness using Laplacian variance matrix calculations.', badge: 'ANALYSIS ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG'], outputFormats: ['Score'], subgroup: 'Image Analysis' },
      { id: 'img-sharpness-analyzer', name: 'Image Sharpness Analyzer', description: 'Calculate edge contrast acuity metrics across photo regions.', badge: 'ANALYSIS ENGINE', isLocalOnly: true, inputFormats: ['PNG', 'JPG'], outputFormats: ['Chart'], subgroup: 'Image Analysis' }
    ]
  },

  // 3. DEVELOPER TOOLS
  {
    id: 'dev',
    slug: 'dev',
    title: 'DEVELOPER',
    name: 'Developer Tools',
    subtitle: 'Formatters, validators, line counters, HTTP builders, stack trace tools & config maskers.',
    description: 'Essential developer utilities built for high efficiency, complete offline support, and clean zero-server execution.',
    iconName: 'Code',
    accentColor: '#4F46E5',
    toolCount: 36,
    featuredTools: [
      // Core Dev
      { id: 'json-formatter', name: 'JSON Formatter & Validator', description: 'Format, validate, prettify, and repair malformed JSON payloads.', badge: 'DEVELOPER ENGINE', isLocalOnly: true, inputFormats: ['JSON'], outputFormats: ['JSON'], subgroup: 'Code Utilities' },
      { id: 'jwt-decoder', name: 'JWT Token Inspector', description: 'Decode and inspect JSON Web Token headers, payloads, and timestamps.', badge: 'DEVELOPER ENGINE', isLocalOnly: true, inputFormats: ['String'], outputFormats: ['JSON'], subgroup: 'Developer Inspection' },
      { id: 'diff-checker', name: 'Code & Text Diff Checker', description: 'Compare two code snippets or text blocks side by side with line highlighting.', badge: 'DEVELOPER ENGINE', isLocalOnly: true, inputFormats: ['Code'], outputFormats: ['Diff'], subgroup: 'Code Utilities' },
      { id: 'base64', name: 'Base64 Encoder / Decoder', description: 'Encode binary or plain strings to Base64 and decode back instantly.', badge: 'DEVELOPER ENGINE', isLocalOnly: true, inputFormats: ['Text'], outputFormats: ['Base64'], subgroup: 'Code Utilities' },
      // Code Utilities
      { id: 'code-line-counter', name: 'Code Line Counter', description: 'Count total, active code, blank, and comment lines in source files.', badge: 'CODE ENGINE', isLocalOnly: true, inputFormats: ['Code'], outputFormats: ['Stats'], subgroup: 'Code Utilities' },
      { id: 'code-complexity-estimator', name: 'Code Complexity Estimator', description: 'Estimate cyclomatic complexity metrics for JS/TS code blocks.', badge: 'CODE ENGINE', isLocalOnly: true, inputFormats: ['Code'], outputFormats: ['Stats'], subgroup: 'Code Utilities' },
      { id: 'indentation-converter', name: 'Indentation Converter (Tabs ↔ Spaces)', description: 'Convert tab indentation to custom spaces (2, 4, 8) and vice versa.', badge: 'CODE ENGINE', isLocalOnly: true, inputFormats: ['Code'], outputFormats: ['Code'], subgroup: 'Code Utilities' },
      { id: 'line-ending-converter', name: 'Line Ending Converter (LF ↔ CRLF)', description: 'Convert Unix (LF) and Windows (CRLF) line endings.', badge: 'CODE ENGINE', isLocalOnly: true, inputFormats: ['Text'], outputFormats: ['Text'], subgroup: 'Code Utilities' },
      { id: 'code-comment-stripper', name: 'Code Comment Stripper', description: 'Remove single-line and multi-line comments from JS/CSS/HTML code.', badge: 'CODE ENGINE', isLocalOnly: true, inputFormats: ['Code'], outputFormats: ['Code'], subgroup: 'Code Utilities' },
      { id: 'code-comment-extractor', name: 'Code Comment Extractor', description: 'Extract inline comments and JSDoc blocks into structured documentation.', badge: 'CODE ENGINE', isLocalOnly: true, inputFormats: ['Code'], outputFormats: ['Text'], subgroup: 'Code Utilities' },
      { id: 'trailing-whitespace-cleaner', name: 'Trailing Whitespace Cleaner', description: 'Strip unwanted trailing spaces at line ends across source code.', badge: 'CODE ENGINE', isLocalOnly: true, inputFormats: ['Code'], outputFormats: ['Code'], subgroup: 'Code Utilities' },
      { id: 'bom-detector', name: 'BOM Detector & Remover', description: 'Detect and strip UTF-8 Byte Order Mark (BOM) headers from text files.', badge: 'CODE ENGINE', isLocalOnly: true, inputFormats: ['File'], outputFormats: ['File'], subgroup: 'Code Utilities' },
      { id: 'source-code-stats', name: 'Source Code Statistics', description: 'Generate file distribution and character frequency reports.', badge: 'CODE ENGINE', isLocalOnly: true, inputFormats: ['Files'], outputFormats: ['JSON'], subgroup: 'Code Utilities' },
      // API / Request Utilities
      { id: 'http-request-builder', name: 'HTTP Request Builder', description: 'Craft GET, POST, PUT, DELETE HTTP requests with custom headers.', badge: 'API ENGINE', isLocalOnly: true, inputFormats: ['Config'], outputFormats: ['HTTP'], subgroup: 'API / Request Utilities' },
      { id: 'http-status-ref', name: 'HTTP Status Code Reference', description: 'Searchable dictionary of HTTP response status codes (1xx - 5xx).', badge: 'API ENGINE', isLocalOnly: true, inputFormats: ['Search'], outputFormats: ['Info'], subgroup: 'API / Request Utilities' },
      { id: 'http-method-tester', name: 'HTTP Method Tester', description: 'Test request method semantics and payload compatibility.', badge: 'API ENGINE', isLocalOnly: true, inputFormats: ['Method'], outputFormats: ['Report'], subgroup: 'API / Request Utilities' },
      { id: 'req-header-diff', name: 'Request Header Diff', description: 'Compare two HTTP request header blocks side by side.', badge: 'API ENGINE', isLocalOnly: true, inputFormats: ['Headers'], outputFormats: ['Diff'], subgroup: 'API / Request Utilities' },
      { id: 'res-header-diff', name: 'Response Header Diff', description: 'Compare HTTP server response headers for security configuration auditing.', badge: 'API ENGINE', isLocalOnly: true, inputFormats: ['Headers'], outputFormats: ['Diff'], subgroup: 'API / Request Utilities' },
      { id: 'mime-boundary-gen', name: 'MIME Boundary Generator', description: 'Generate unique multipart/form-data boundary strings.', badge: 'API ENGINE', isLocalOnly: true, inputFormats: ['None'], outputFormats: ['String'], subgroup: 'API / Request Utilities' },
      { id: 'multipart-form-builder', name: 'Multipart Form Data Builder', description: 'Construct boundary-separated multipart request payloads.', badge: 'API ENGINE', isLocalOnly: true, inputFormats: ['Form'], outputFormats: ['Payload'], subgroup: 'API / Request Utilities' },
      { id: 'cookie-header-builder', name: 'Cookie Header Builder', description: 'Generate HTTP Cookie headers with SameSite, Secure, and HttpOnly flags.', badge: 'API ENGINE', isLocalOnly: true, inputFormats: ['Fields'], outputFormats: ['Header'], subgroup: 'API / Request Utilities' },
      { id: 'auth-header-builder', name: 'Authorization Header Builder', description: 'Generate Basic Auth and Bearer Token HTTP Authorization headers.', badge: 'API ENGINE', isLocalOnly: true, inputFormats: ['Credentials'], outputFormats: ['Header'], subgroup: 'API / Request Utilities' },
      // Developer Inspection
      { id: 'stack-trace-formatter', name: 'Stack Trace Formatter', description: 'Prettify and format messy JavaScript/Node stack trace error logs.', badge: 'LOG ENGINE', isLocalOnly: true, inputFormats: ['Log'], outputFormats: ['Formatted'], subgroup: 'Developer Inspection' },
      { id: 'log-formatter', name: 'Log Formatter', description: 'Parse unstructured console logs into clean JSON streams.', badge: 'LOG ENGINE', isLocalOnly: true, inputFormats: ['Log'], outputFormats: ['JSON'], subgroup: 'Developer Inspection' },
      { id: 'log-level-extractor', name: 'Log Level Extractor', description: 'Filter log streams by severity level (INFO, WARN, ERROR, DEBUG).', badge: 'LOG ENGINE', isLocalOnly: true, inputFormats: ['Log'], outputFormats: ['Filtered'], subgroup: 'Developer Inspection' },
      { id: 'log-timestamp-extractor', name: 'Log Timestamp Extractor', description: 'Extract and standardize timestamps from application log files.', badge: 'LOG ENGINE', isLocalOnly: true, inputFormats: ['Log'], outputFormats: ['Timestamps'], subgroup: 'Developer Inspection' },
      { id: 'ansi-cleaner', name: 'ANSI Escape Cleaner', description: 'Strip terminal color codes and ANSI control sequences from logs.', badge: 'LOG ENGINE', isLocalOnly: true, inputFormats: ['Log'], outputFormats: ['Text'], subgroup: 'Developer Inspection' },
      { id: 'env-var-diff', name: 'Environment Variable Diff', description: 'Compare `.env` files to highlight missing or mismatched key names.', badge: 'CONFIG ENGINE', isLocalOnly: true, inputFormats: ['.env'], outputFormats: ['Diff'], subgroup: 'Developer Inspection' },
      { id: 'config-value-masker', name: 'Config Value Masker', description: 'Automatically redact password keys, secrets, and private tokens in config files.', badge: 'CONFIG ENGINE', isLocalOnly: true, inputFormats: ['Config'], outputFormats: ['Masked'], subgroup: 'Developer Inspection' }
    ]
  },

  // 4. DATA & FORMATS
  {
    id: 'data',
    slug: 'data',
    title: 'DATA & FORMATS',
    name: 'Data & Formats',
    subtitle: 'Spreadsheet inspectors, XLSX tools, JSON key transformers & CSV encodings.',
    description: 'Transform complex dataset schemas effortlessly with automatic column detection and clean formatting.',
    iconName: 'Database',
    accentColor: '#4F46E5',
    toolCount: 30,
    featuredTools: [
      // Core Data
      { id: 'json-to-csv', name: 'JSON to CSV Converter', description: 'Convert JSON arrays or nested objects into structured CSV spreadsheets.', badge: 'DATA ENGINE', isLocalOnly: true, inputFormats: ['JSON'], outputFormats: ['CSV'], subgroup: 'CSV' },
      { id: 'csv-to-json', name: 'CSV to JSON Converter', description: 'Parse CSV files into clean key-value JSON arrays with custom headers.', badge: 'DATA ENGINE', isLocalOnly: true, inputFormats: ['CSV'], outputFormats: ['JSON'], subgroup: 'CSV' },
      // Spreadsheet Utilities
      { id: 'xlsx-sheet-inspector', name: 'XLSX Sheet Inspector', description: 'Inspect sheet tabs, total rows, cell types, and metadata in Excel workbooks.', badge: 'EXCEL ENGINE', isLocalOnly: true, inputFormats: ['XLSX'], outputFormats: ['JSON'], subgroup: 'Spreadsheet Utilities' },
      { id: 'xlsx-sheet-merger', name: 'XLSX Sheet Merger', description: 'Merge multiple Excel worksheets into a unified master dataset.', badge: 'EXCEL ENGINE', isLocalOnly: true, inputFormats: ['XLSX'], outputFormats: ['XLSX'], subgroup: 'Spreadsheet Utilities' },
      { id: 'xlsx-sheet-splitter', name: 'XLSX Sheet Splitter', description: 'Split multi-tab Excel workbooks into separate individual files.', badge: 'EXCEL ENGINE', isLocalOnly: true, inputFormats: ['XLSX'], outputFormats: ['ZIP'], subgroup: 'Spreadsheet Utilities' },
      { id: 'xlsx-column-stats', name: 'XLSX Column Statistics', description: 'Compute min, max, average, sum, and variance across Excel columns.', badge: 'EXCEL ENGINE', isLocalOnly: true, inputFormats: ['XLSX'], outputFormats: ['Stats'], subgroup: 'Spreadsheet Utilities' },
      { id: 'xlsx-formula-inspector', name: 'XLSX Formula Inspector', description: 'Extract all formula calculations embedded in Excel sheets.', badge: 'EXCEL ENGINE', isLocalOnly: true, inputFormats: ['XLSX'], outputFormats: ['List'], subgroup: 'Spreadsheet Utilities' },
      { id: 'xlsx-empty-cell-analyzer', name: 'XLSX Empty Cell Analyzer', description: 'Scan sheets for missing data values and null cell occurrences.', badge: 'EXCEL ENGINE', isLocalOnly: true, inputFormats: ['XLSX'], outputFormats: ['Report'], subgroup: 'Spreadsheet Utilities' },
      // JSON / Structured Data
      { id: 'json-key-finder', name: 'JSON Key Finder', description: 'Locate nested JSON keys by dot-notation or JSONPath expressions.', badge: 'JSON ENGINE', isLocalOnly: true, inputFormats: ['JSON'], outputFormats: ['Paths'], subgroup: 'JSON / Structured Data' },
      { id: 'json-key-renamer', name: 'JSON Key Renamer', description: 'Batch update key names in deep JSON objects without changing values.', badge: 'JSON ENGINE', isLocalOnly: true, inputFormats: ['JSON'], outputFormats: ['JSON'], subgroup: 'JSON / Structured Data' },
      { id: 'json-key-remover', name: 'JSON Key Remover', description: 'Strip specific key properties (e.g. `__v`, `password`) from JSON trees.', badge: 'JSON ENGINE', isLocalOnly: true, inputFormats: ['JSON'], outputFormats: ['JSON'], subgroup: 'JSON / Structured Data' },
      { id: 'json-array-sorter', name: 'JSON Array Sorter', description: 'Sort JSON array elements by specific property keys alphabetically or numerically.', badge: 'JSON ENGINE', isLocalOnly: true, inputFormats: ['JSON'], outputFormats: ['JSON'], subgroup: 'JSON / Structured Data' },
      { id: 'json-array-deduplicator', name: 'JSON Array Deduplicator', description: 'Remove duplicate object entries from JSON arrays based on unique IDs.', badge: 'JSON ENGINE', isLocalOnly: true, inputFormats: ['JSON'], outputFormats: ['JSON'], subgroup: 'JSON / Structured Data' },
      { id: 'json-type-analyzer', name: 'JSON Type Analyzer', description: 'Analyze data types (string, number, boolean, object) across JSON nodes.', badge: 'JSON ENGINE', isLocalOnly: true, inputFormats: ['JSON'], outputFormats: ['Schema'], subgroup: 'JSON / Structured Data' },
      { id: 'json-circular-detector', name: 'JSON Circular Reference Detector', description: 'Detect recursive circular dependencies in JS objects.', badge: 'JSON ENGINE', isLocalOnly: true, inputFormats: ['JS Object'], outputFormats: ['Report'], subgroup: 'JSON / Structured Data' },
      { id: 'json-pointer-tester', name: 'JSON Pointer Tester', description: 'Evaluate RFC 6901 JSON Pointers against target payloads.', badge: 'JSON ENGINE', isLocalOnly: true, inputFormats: ['JSON'], outputFormats: ['Value'], subgroup: 'JSON / Structured Data' },
      // CSV
      { id: 'csv-encoding-detector', name: 'CSV Encoding Detector', description: 'Detect UTF-8, UTF-16, ASCII, or ISO-8859-1 character encoding.', badge: 'CSV ENGINE', isLocalOnly: true, inputFormats: ['CSV'], outputFormats: ['Info'], subgroup: 'CSV' },
      { id: 'csv-encoding-converter', name: 'CSV Encoding Converter', description: 'Convert CSV encoding formats to standard UTF-8.', badge: 'CSV ENGINE', isLocalOnly: true, inputFormats: ['CSV'], outputFormats: ['CSV'], subgroup: 'CSV' },
      { id: 'csv-quote-fixer', name: 'CSV Quote Fixer', description: 'Repair unescaped double quotes and irregular delimiter formatting in CSV files.', badge: 'CSV ENGINE', isLocalOnly: true, inputFormats: ['CSV'], outputFormats: ['CSV'], subgroup: 'CSV' },
      { id: 'csv-line-break-fixer', name: 'CSV Line Break Fixer', description: 'Normalize line breaks inside quoted CSV string cells.', badge: 'CSV ENGINE', isLocalOnly: true, inputFormats: ['CSV'], outputFormats: ['CSV'], subgroup: 'CSV' },
      { id: 'csv-header-normalizer', name: 'CSV Header Normalizer', description: 'Clean CSV header titles into lowercase snake_case or camelCase.', badge: 'CSV ENGINE', isLocalOnly: true, inputFormats: ['CSV'], outputFormats: ['CSV'], subgroup: 'CSV' },
      { id: 'csv-empty-col-remover', name: 'CSV Empty Column Remover', description: 'Automatically strip columns containing zero data entries.', badge: 'CSV ENGINE', isLocalOnly: true, inputFormats: ['CSV'], outputFormats: ['CSV'], subgroup: 'CSV' },
      { id: 'csv-frequency-analyzer', name: 'CSV Frequency Analyzer', description: 'Calculate distinct value occurrences across specified CSV columns.', badge: 'CSV ENGINE', isLocalOnly: true, inputFormats: ['CSV'], outputFormats: ['Chart'], subgroup: 'CSV' }
    ]
  },

  // 5. SECURITY & PRIVACY
  {
    id: 'security',
    slug: 'security',
    title: 'SECURITY',
    name: 'Security & Privacy',
    subtitle: 'Generate cryptographic hashes, secret key tools, HMAC, PBKDF2, PII scanners & privacy analyzers.',
    description: 'Browser-native security suite utilizing Web Crypto API for zero-knowledge hash generation and data encryption.',
    iconName: 'Lock',
    accentColor: '#4F46E5',
    toolCount: 28,
    featuredTools: [
      // Password & Secrets
      { id: 'password-gen', name: 'Secure Password Generator', description: 'Generate cryptographically random passwords with custom rules.', badge: 'SECURITY ENGINE', isLocalOnly: true, inputFormats: ['Config'], outputFormats: ['String'], subgroup: 'Password & Secrets' },
      { id: 'password-entropy-calc', name: 'Password Entropy Calculator', description: 'Measure exact bit strength and entropy calculations for passwords.', badge: 'SECURITY ENGINE', isLocalOnly: true, inputFormats: ['String'], outputFormats: ['Bits'], subgroup: 'Password & Secrets' },
      { id: 'passphrase-entropy-calc', name: 'Passphrase Entropy Calculator', description: 'Calculate word-list randomness strength for multi-word passphrases.', badge: 'SECURITY ENGINE', isLocalOnly: true, inputFormats: ['String'], outputFormats: ['Bits'], subgroup: 'Password & Secrets' },
      { id: 'secret-masker', name: 'Secret Masker & Redactor', description: 'Redact passwords, OAuth tokens, and secret strings from document text.', badge: 'PRIVACY ENGINE', isLocalOnly: true, inputFormats: ['Text'], outputFormats: ['Text'], subgroup: 'Password & Secrets' },
      { id: 'log-secret-scanner', name: 'Log Secret Scanner', description: 'Scan application log files for exposed API keys and private tokens.', badge: 'PRIVACY ENGINE', isLocalOnly: true, inputFormats: ['Log'], outputFormats: ['Report'], subgroup: 'Password & Secrets' },
      { id: 'credential-pattern-detector', name: 'Credential Pattern Detector', description: 'Detect hardcoded secret keys using deterministic regex patterns.', badge: 'PRIVACY ENGINE', isLocalOnly: true, inputFormats: ['Code'], outputFormats: ['Report'], subgroup: 'Password & Secrets' },
      // Cryptography
      { id: 'hash-calculator', name: 'Checksum & Hash Calculator', description: 'Compute SHA-256, SHA-512, MD5, and SHA-1 checksums for any file or text.', badge: 'SECURITY ENGINE', isLocalOnly: true, inputFormats: ['File'], outputFormats: ['HEX'], subgroup: 'Cryptography' },
      { id: 'hmac-gen', name: 'HMAC Generator & Verifier', description: 'Generate and verify SHA-256 HMAC signatures with secret keys.', badge: 'SECURITY ENGINE', isLocalOnly: true, inputFormats: ['Text'], outputFormats: ['HEX'], subgroup: 'Cryptography' },
      { id: 'pbkdf2-calc', name: 'PBKDF2 Calculator', description: 'Derive key bytes using PBKDF2 key derivation functions.', badge: 'SECURITY ENGINE', isLocalOnly: true, inputFormats: ['Text'], outputFormats: ['HEX'], subgroup: 'Cryptography' },
      { id: 'hkdf-gen', name: 'HKDF Key Generator', description: 'Extract and expand key material using HMAC-based Key Derivation Function.', badge: 'SECURITY ENGINE', isLocalOnly: true, inputFormats: ['Text'], outputFormats: ['HEX'], subgroup: 'Cryptography' },
      { id: 'aes-key-gen', name: 'AES Key Generator', description: 'Generate 128-bit and 256-bit AES cryptographic keys.', badge: 'SECURITY ENGINE', isLocalOnly: true, inputFormats: ['None'], outputFormats: ['HEX'], subgroup: 'Cryptography' },
      { id: 'rsa-keypair', name: 'RSA Key Pair Generator', description: 'Generate public and private PEM key pairs in browser memory.', badge: 'SECURITY ENGINE', isLocalOnly: true, inputFormats: ['None'], outputFormats: ['PEM'], subgroup: 'Cryptography' },
      { id: 'der-pem-converter', name: 'DER ↔ PEM Converter', description: 'Convert certificate keys between binary DER and Base64 PEM formats.', badge: 'SECURITY ENGINE', isLocalOnly: true, inputFormats: ['Key'], outputFormats: ['Key'], subgroup: 'Cryptography' },
      { id: 'cert-fingerprint', name: 'Certificate Fingerprint Generator', description: 'Compute SHA-256 fingerprints for SSL/TLS x509 certificates.', badge: 'SECURITY ENGINE', isLocalOnly: true, inputFormats: ['PEM'], outputFormats: ['HEX'], subgroup: 'Cryptography' },
      // Privacy
      { id: 'text-pii-scanner', name: 'Text PII Pattern Scanner', description: 'Scan text for personal identifiers like credit cards, SSNs, and phone numbers.', badge: 'PRIVACY ENGINE', isLocalOnly: true, inputFormats: ['Text'], outputFormats: ['Report'], subgroup: 'Privacy' },
      { id: 'tracking-param-remover', name: 'Tracking Parameter Cleaner', description: 'Strip `utm_source`, `fbclid`, and `gclid` tracking parameters from links.', badge: 'PRIVACY ENGINE', isLocalOnly: true, inputFormats: ['URL'], outputFormats: ['URL'], subgroup: 'Privacy' },
      { id: 'doc-privacy-score', name: 'Document Privacy Score', description: 'Analyze documents for embedded author names, timestamps, and hidden metadata.', badge: 'PRIVACY ENGINE', isLocalOnly: true, inputFormats: ['File'], outputFormats: ['Score'], subgroup: 'Privacy' }
    ]
  },

  // 6. ARCHIVES & COMPRESSION
  {
    id: 'archives',
    slug: 'archives',
    title: 'ARCHIVES',
    name: 'Archives & Compression',
    subtitle: 'Compress and extract ZIP, TAR, GZ, 7Z packages & analyze compression benchmarks.',
    description: 'Fast, secure archive manipulation without downloading unverified extraction tools.',
    iconName: 'Archive',
    accentColor: '#4F46E5',
    toolCount: 16,
    featuredTools: [
      { id: 'zip-extract', name: 'ZIP Archive Extractor', description: 'Unpack files from ZIP archives directly in your browser session.', badge: 'ARCHIVE ENGINE', isLocalOnly: true, inputFormats: ['ZIP'], outputFormats: ['Files'], subgroup: 'Archive Management' },
      { id: 'zip-create', name: 'Create ZIP Package', description: 'Select multiple files and compress them into a single `.zip` file.', badge: 'ARCHIVE ENGINE', isLocalOnly: true, inputFormats: ['Files'], outputFormats: ['ZIP'], subgroup: 'Archive Management' },
      { id: 'zip-repair-inspector', name: 'ZIP File Repair Inspector', description: 'Inspect corrupt ZIP header structures and recover accessible uncompressed files.', badge: 'ARCHIVE ENGINE', isLocalOnly: true, inputFormats: ['ZIP'], outputFormats: ['Files'], subgroup: 'Archive Management' },
      { id: 'zip-comment-editor', name: 'ZIP Comment Editor', description: 'Read and update embedded zip archive comments.', badge: 'ARCHIVE ENGINE', isLocalOnly: true, inputFormats: ['ZIP'], outputFormats: ['ZIP'], subgroup: 'Archive Management' },
      { id: 'tar-inspector', name: 'TAR File Inspector', description: 'Inspect uncompressed TAR file contents and entry file paths.', badge: 'ARCHIVE ENGINE', isLocalOnly: true, inputFormats: ['TAR'], outputFormats: ['Tree'], subgroup: 'Archive Management' },
      { id: 'gzip-header-inspector', name: 'GZIP Header Inspector', description: 'Inspect GZIP header flags, operating system origin, and timestamps.', badge: 'ARCHIVE ENGINE', isLocalOnly: true, inputFormats: ['GZ'], outputFormats: ['JSON'], subgroup: 'Archive Management' },
      { id: 'compression-ratio-calc', name: 'Compression Ratio Calculator', description: 'Calculate exact compression savings percentage and space saved.', badge: 'ARCHIVE ENGINE', isLocalOnly: true, inputFormats: ['Stats'], outputFormats: ['Stats'], subgroup: 'Compression Analysis' },
      { id: 'archive-dup-detector', name: 'Archive Duplicate Entry Detector', description: 'Scan archives for duplicate file entries and identical file hashes.', badge: 'ARCHIVE ENGINE', isLocalOnly: true, inputFormats: ['ZIP'], outputFormats: ['Report'], subgroup: 'Compression Analysis' }
    ]
  },

  // 7. WEB & NETWORK
  {
    id: 'web',
    slug: 'web',
    title: 'WEB',
    name: 'Web & Network',
    subtitle: 'URL lab, query parameters, HTML element inspectors, meta tag builders & canonicalizers.',
    description: 'Utilities for web developers, designers, and site managers to test and inspect web artifacts.',
    iconName: 'Globe',
    accentColor: '#4F46E5',
    toolCount: 26,
    featuredTools: [
      // URL Lab
      { id: 'url-encoder', name: 'URL Encoder / Decoder', description: 'Safely encode or decode query parameters and URI components.', badge: 'WEB ENGINE', isLocalOnly: true, inputFormats: ['String'], outputFormats: ['URL'], subgroup: 'URL Lab' },
      { id: 'url-scheme-detector', name: 'URL Scheme & Host Analyzer', description: 'Deconstruct URL schemes (http, https), subdomains, domains, and port numbers.', badge: 'WEB ENGINE', isLocalOnly: true, inputFormats: ['URL'], outputFormats: ['JSON'], subgroup: 'URL Lab' },
      { id: 'url-canonicalizer', name: 'URL Canonicalizer & Normalizer', description: 'Clean up trailing slashes, duplicate protocol prefixes, and lowercase paths.', badge: 'WEB ENGINE', isLocalOnly: true, inputFormats: ['URL'], outputFormats: ['URL'], subgroup: 'URL Lab' },
      // Query Parameters
      { id: 'query-param-sorter', name: 'Query Parameter Sorter & Deduplicator', description: 'Sort query string keys alphabetically and strip redundant duplicate keys.', badge: 'WEB ENGINE', isLocalOnly: true, inputFormats: ['URL'], outputFormats: ['URL'], subgroup: 'Query Parameters' },
      { id: 'query-param-extractor', name: 'Query Parameter Extractor', description: 'Parse URL search params into a clean key-value table.', badge: 'WEB ENGINE', isLocalOnly: true, inputFormats: ['URL'], outputFormats: ['JSON'], subgroup: 'Query Parameters' },
      { id: 'query-param-privacy', name: 'Query Parameter Privacy Scanner', description: 'Detect tracking tokens (`utm_*`, `gclid`) and clean links.', badge: 'WEB ENGINE', isLocalOnly: true, inputFormats: ['URL'], outputFormats: ['URL'], subgroup: 'Query Parameters' },
      // Web Inspection
      { id: 'html-link-extractor', name: 'HTML Link & Image Extractor', description: 'Extract all `<a href>` hyperlinks and `<img>` sources from raw HTML.', badge: 'WEB ENGINE', isLocalOnly: true, inputFormats: ['HTML'], outputFormats: ['List'], subgroup: 'Web Inspection' },
      { id: 'html-form-extractor', name: 'HTML Form Extractor', description: 'Parse form actions, input names, and method attributes from web pages.', badge: 'WEB ENGINE', isLocalOnly: true, inputFormats: ['HTML'], outputFormats: ['JSON'], subgroup: 'Web Inspection' },
      // Web Meta
      { id: 'meta-generator', name: 'OpenGraph & SEO Meta Builder', description: 'Generate social media preview tags for X, Facebook, and Google SEO.', badge: 'WEB ENGINE', isLocalOnly: true, inputFormats: ['Form'], outputFormats: ['HTML'], subgroup: 'Web Meta' },
      { id: 'meta-len-checker', name: 'Title & Meta Description Length Checker', description: 'Check pixel truncation boundaries for SEO page titles and descriptions.', badge: 'WEB ENGINE', isLocalOnly: true, inputFormats: ['Text'], outputFormats: ['Stats'], subgroup: 'Web Meta' }
    ]
  },

  // 8. QR & CODES STUDIO (STANDALONE CATEGORY)
  {
    id: 'qr',
    slug: 'qr',
    title: 'QR & CODES STUDIO',
    name: 'QR & Codes Studio',
    subtitle: 'Generate branded QR codes, India UPI payment QRs, vCards, scan/decode payload, batch QR lists & high-DPI export.',
    description: 'Complete local QR engine with customizable frames, eyes, logo integration, error correction, and batch CSV generation.',
    iconName: 'QrCode',
    accentColor: '#4F46E5',
    toolCount: 32,
    featuredTools: [
      // Inputs
      { id: 'qr-url', name: 'URL → QR Studio', description: 'Generate high-res vector QR codes for websites and web links.', badge: 'QR ENGINE', isLocalOnly: true, inputFormats: ['URL'], outputFormats: ['SVG', 'PNG'], subgroup: 'QR Input Types' },
      { id: 'qr-vcard', name: 'vCard & Contact QR Generator', description: 'Create contact card QR codes for instant smartphone address book import.', badge: 'QR ENGINE', isLocalOnly: true, inputFormats: ['vCard'], outputFormats: ['SVG', 'PNG'], subgroup: 'QR Input Types' },
      { id: 'qr-wifi', name: 'Wi-Fi Network QR Code', description: 'Generate instant Wi-Fi login QR codes (WPA/WPA2/WPA3).', badge: 'QR ENGINE', isLocalOnly: true, inputFormats: ['Credentials'], outputFormats: ['SVG', 'PNG'], subgroup: 'QR Input Types' },
      { id: 'qr-upi', name: 'India UPI QR Generator', description: 'Generate static/dynamic India UPI payment QR codes with custom amount, merchant name & note.', badge: 'PAYMENT ENGINE', isLocalOnly: true, inputFormats: ['UPI ID'], outputFormats: ['SVG', 'PNG'], subgroup: 'QR Input Types' },
      { id: 'qr-upi-validator', name: 'UPI QR Payload Validator', description: 'Validate UPI payment payload formatting, VPA structure, and transaction rules.', badge: 'PAYMENT ENGINE', isLocalOnly: true, inputFormats: ['QR Payload'], outputFormats: ['Report'], subgroup: 'QR Input Types' },
      // QR Decoder
      { id: 'qr-decoder', name: 'Universal QR Decoder & Action Sheet', description: 'Upload QR image or use camera to decode payload and trigger action sheets (clean URL, copy, re-brand).', badge: 'QR ENGINE', isLocalOnly: true, inputFormats: ['Image'], outputFormats: ['Data'], subgroup: 'QR → Data' },
      // Customization Studio
      { id: 'qr-canvas-editor', name: 'QR Canvas Size & Padding Editor', description: 'Customize QR pixel boundaries, margins, and alignment grids.', badge: 'QR STUDIO', isLocalOnly: true, inputFormats: ['Config'], outputFormats: ['SVG'], subgroup: 'Customization Studio' },
      { id: 'qr-logo-editor', name: 'QR Logo Integrator & Contrast Checker', description: 'Embed company logo with background padding and contrast safety checks.', badge: 'QR STUDIO', isLocalOnly: true, inputFormats: ['Image'], outputFormats: ['SVG'], subgroup: 'Customization Studio' },
      { id: 'qr-export-print', name: 'QR Print & Sticker Sheet Generator', description: 'Layout multiple QR codes on printable A4/Letter sticker sheets.', badge: 'QR STUDIO', isLocalOnly: true, inputFormats: ['QR Codes'], outputFormats: ['PDF'], subgroup: 'Customization Studio' },
      // Batch Tools
      { id: 'qr-csv-batch', name: 'CSV → QR Batch Generator', description: 'Import CSV spreadsheets to generate and zip download hundreds of QR codes locally.', badge: 'BATCH ENGINE', isLocalOnly: true, inputFormats: ['CSV'], outputFormats: ['ZIP'], subgroup: 'QR Batch Tools' }
    ]
  },

  // 9. EMAIL & COMMUNICATION (STANDALONE CATEGORY)
  {
    id: 'email',
    slug: 'email',
    title: 'EMAIL & COMMUNICATION',
    name: 'Email & Communication',
    subtitle: 'Signature Studio with client previews, inline CSS converters, HTML sanitizers & image embedders.',
    description: 'Design pixel-perfect HTML email signatures compatible across Gmail, Outlook, Apple Mail, and mobile clients.',
    iconName: 'Mail',
    accentColor: '#4F46E5',
    toolCount: 24,
    featuredTools: [
      // Signature Studio
      { id: 'email-sig-studio', name: 'Email Signature Studio', description: 'Build minimal, professional, corporate, and developer signatures with live client previews.', badge: 'EMAIL STUDIO', isLocalOnly: true, inputFormats: ['Fields'], outputFormats: ['HTML'], subgroup: 'Signature Layouts' },
      // Inspection & Utilities
      { id: 'email-sig-size-checker', name: 'Email Signature Weight & Size Checker', description: 'Calculate total HTML code size and image payload weight for email signature compliance.', badge: 'EMAIL ENGINE', isLocalOnly: true, inputFormats: ['HTML'], outputFormats: ['Report'], subgroup: 'New Email Signature Utilities' },
      { id: 'email-inline-css', name: 'Email Signature Inline CSS Converter', description: 'Convert global `<style>` blocks into bulletproof inline `style=""` attributes.', badge: 'EMAIL ENGINE', isLocalOnly: true, inputFormats: ['HTML'], outputFormats: ['HTML'], subgroup: 'New Email Signature Utilities' },
      { id: 'email-css-compat', name: 'Email Signature CSS Compatibility Checker', description: 'Check CSS properties against Outlook desktop rendering engine limitations.', badge: 'EMAIL ENGINE', isLocalOnly: true, inputFormats: ['HTML'], outputFormats: ['Report'], subgroup: 'New Email Signature Utilities' },
      { id: 'email-img-embedder', name: 'Email Signature Image Embedder', description: 'Convert remote signature images to embedded Base64 data URIs.', badge: 'EMAIL ENGINE', isLocalOnly: true, inputFormats: ['HTML'], outputFormats: ['HTML'], subgroup: 'New Email Signature Utilities' },
      { id: 'email-client-previewer', name: 'Gmail / Outlook / Apple Mail Previewer', description: 'Simulate signature rendering across Gmail, Outlook, and mobile dark mode.', badge: 'EMAIL STUDIO', isLocalOnly: true, inputFormats: ['HTML'], outputFormats: ['Preview'], subgroup: 'Client Previews' }
    ]
  },

  // 10. GENERATORS & ASSETS
  {
    id: 'generators',
    slug: 'generators',
    title: 'GENERATORS',
    name: 'Generators & Assets',
    subtitle: 'UUIDs, KSUID, CUID2, short IDs, placeholder data, favicons & avatar generators.',
    description: 'Quick asset and token creation suite for prototyping, testing, and interface design.',
    iconName: 'Wand2',
    accentColor: '#4F46E5',
    toolCount: 22,
    featuredTools: [
      { id: 'uuid-generator', name: 'UUID v4 Token Generator', description: 'Generate single or bulk RFC4122 compliant UUID v4 unique identifiers.', badge: 'GENERATOR ENGINE', isLocalOnly: true, inputFormats: ['Count'], outputFormats: ['UUID'], subgroup: 'Identifier Generators' },
      { id: 'ksuid-generator', name: 'KSUID Generator', description: 'Generate K-Sortable Globally Unique Identifiers with embedded timestamps.', badge: 'GENERATOR ENGINE', isLocalOnly: true, inputFormats: ['Count'], outputFormats: ['KSUID'], subgroup: 'Identifier Generators' },
      { id: 'cuid2-generator', name: 'CUID2 Identifier Generator', description: 'Generate secure, collision-resistant CUID2 strings for database primary keys.', badge: 'GENERATOR ENGINE', isLocalOnly: true, inputFormats: ['Count'], outputFormats: ['CUID2'], subgroup: 'Identifier Generators' },
      { id: 'lorem-ipsum', name: 'Lorem Ipsum Generator', description: 'Create placeholder text paragraphs, sentences, or word lists.', badge: 'GENERATOR ENGINE', isLocalOnly: true, inputFormats: ['Options'], outputFormats: ['Text'], subgroup: 'Placeholder Generators' },
      { id: 'placeholder-user-data', name: 'Placeholder User Data Generator', description: 'Generate mock user profiles (name, email, address, company) in JSON or CSV.', badge: 'GENERATOR ENGINE', isLocalOnly: true, inputFormats: ['Count'], outputFormats: ['JSON', 'CSV'], subgroup: 'Placeholder Generators' },
      { id: 'favicon-gen', name: 'Favicon Package Builder', description: 'Convert an icon image into standard 16x16, 32x32, and Apple Touch icons.', badge: 'GENERATOR ENGINE', isLocalOnly: true, inputFormats: ['PNG'], outputFormats: ['ICO'], subgroup: 'Asset Generators' },
      { id: 'initials-avatar-gen', name: 'Initials Avatar & Monogram Generator', description: 'Generate clean circular initials avatars for user profiles.', badge: 'GENERATOR ENGINE', isLocalOnly: true, inputFormats: ['Name'], outputFormats: ['SVG', 'PNG'], subgroup: 'Asset Generators' }
    ]
  },

  // 11. DESIGN & CSS
  {
    id: 'design',
    slug: 'design',
    title: 'DESIGN & CSS',
    name: 'Design & CSS Tools',
    subtitle: 'Color converters, CSS box shadow/gradient builders, CSS variable extractors & typography scales.',
    description: 'Essential designer & frontend utilities running locally in your browser window.',
    iconName: 'Sliders',
    accentColor: '#4F46E5',
    toolCount: 22,
    featuredTools: [
      { id: 'hex-rgb', name: 'HEX → RGB Converter', description: 'Convert HEX color codes to RGB and RGBA values.', badge: 'DESIGN ENGINE', isLocalOnly: true, inputFormats: ['HEX'], outputFormats: ['RGB'], subgroup: 'CSS Inspection' },
      { id: 'css-var-extractor', name: 'CSS Variable Extractor & Converter', description: 'Extract `:root` CSS custom properties and convert to JSON tokens.', badge: 'DESIGN ENGINE', isLocalOnly: true, inputFormats: ['CSS'], outputFormats: ['JSON'], subgroup: 'CSS Inspection' },
      { id: 'css-shadow-gen', name: 'CSS Box Shadow Builder', description: 'Generate multi-layer soft CSS box shadow declarations.', badge: 'DESIGN ENGINE', isLocalOnly: true, inputFormats: ['Config'], outputFormats: ['CSS'], subgroup: 'CSS Layout' },
      { id: 'css-gradient-gen', name: 'CSS Gradient Generator', description: 'Create multi-stop linear and radial CSS gradients.', badge: 'DESIGN ENGINE', isLocalOnly: true, inputFormats: ['Config'], outputFormats: ['CSS'], subgroup: 'CSS Layout' },
      { id: 'css-container-gen', name: 'CSS Container & Grid Generator', description: 'Generate responsive CSS Grid and Flexbox container declarations.', badge: 'DESIGN ENGINE', isLocalOnly: true, inputFormats: ['Config'], outputFormats: ['CSS'], subgroup: 'CSS Layout' },
      { id: 'font-scale-gen', name: 'Font Scale & Typography Generator', description: 'Calculate modular typography scales (Major Third, Golden Ratio).', badge: 'DESIGN ENGINE', isLocalOnly: true, inputFormats: ['Base Size'], outputFormats: ['CSS'], subgroup: 'Typography' }
    ]
  },

  // 12. DATE & TIME
  {
    id: 'datetime',
    slug: 'datetime',
    title: 'DATE & TIME',
    name: 'Date & Time Tools',
    subtitle: 'Unix timestamp converters, ISO 8601 parsers, cron explainer, work week calculators & time overlap tools.',
    description: 'Format, calculate, and convert date formats and cron schedules locally.',
    iconName: 'Calendar',
    accentColor: '#4F46E5',
    toolCount: 18,
    featuredTools: [
      { id: 'unix-timestamp', name: 'Unix Timestamp Converter', description: 'Convert Epoch timestamps to human readable ISO date strings.', badge: 'TIME ENGINE', isLocalOnly: true, inputFormats: ['Timestamp'], outputFormats: ['Date'], subgroup: 'Calendar' },
      { id: 'cron-parser', name: 'Cron Schedule Explainer', description: 'Parse 5-field cron expressions into human readable schedules.', badge: 'TIME ENGINE', isLocalOnly: true, inputFormats: ['Cron'], outputFormats: ['Text'], subgroup: 'Scheduling' },
      { id: 'work-week-calc', name: 'Work Week & Business Hours Calculator', description: 'Calculate working business days excluding holidays and weekends.', badge: 'TIME ENGINE', isLocalOnly: true, inputFormats: ['Dates'], outputFormats: ['Days'], subgroup: 'Scheduling' },
      { id: 'meeting-overlap', name: 'Meeting Time Overlap Finder', description: 'Find intersecting work availability slots across global timezones.', badge: 'TIME ENGINE', isLocalOnly: true, inputFormats: ['Timezones'], outputFormats: ['Slots'], subgroup: 'Scheduling' }
    ]
  },

  // 13. MATH & UNIT CONVERTERS
  {
    id: 'math',
    slug: 'math',
    title: 'MATH & CONVERTERS',
    name: 'Math & Unit Converters',
    subtitle: 'Unit converters, px to rem calculators, aspect ratio solvers, bit/byte storage & engineering math.',
    description: 'Perform instant unit calculations and aspect ratio math offline.',
    iconName: 'Calculator',
    accentColor: '#4F46E5',
    toolCount: 25,
    featuredTools: [
      { id: 'px-rem', name: 'px → rem Converter', description: 'Convert pixel values to REM font sizes based on 16px base.', badge: 'MATH ENGINE', isLocalOnly: true, inputFormats: ['px'], outputFormats: ['rem'], subgroup: 'Digital' },
      { id: 'rem-px', name: 'rem → px Converter', description: 'Convert REM font sizes back to exact pixel values.', badge: 'MATH ENGINE', isLocalOnly: true, inputFormats: ['rem'], outputFormats: ['px'], subgroup: 'Digital' },
      { id: 'aspect-ratio', name: 'Aspect Ratio Calculator', description: 'Calculate image and video aspect ratio proportions (16:9, 4:3).', badge: 'MATH ENGINE', isLocalOnly: true, inputFormats: ['Dimensions'], outputFormats: ['Ratio'], subgroup: 'Geometry' },
      { id: 'bit-byte-calc', name: 'Bit ↔ Byte Storage Calculator', description: 'Convert between bits, bytes, KB, MB, GB, TB, and PB.', badge: 'MATH ENGINE', isLocalOnly: true, inputFormats: ['Number'], outputFormats: ['Units'], subgroup: 'Digital' },
      { id: 'ppi-calc', name: 'Pixel Density (PPI/DPI) Calculator', description: 'Compute screen PPI from display resolution and diagonal size.', badge: 'MATH ENGINE', isLocalOnly: true, inputFormats: ['Resolution'], outputFormats: ['PPI'], subgroup: 'Digital' }
    ]
  },

  // 14. TEXT & STRING TOOLS
  {
    id: 'text',
    slug: 'text',
    title: 'TEXT UTILITIES',
    name: 'Text & String Tools',
    subtitle: 'Word counters, case converters, line sorters, deduplicators, slug generators, unicode normalizers & regex extractors.',
    description: 'Transform, inspect, format, and sanitize text strings directly in browser memory.',
    iconName: 'Type',
    accentColor: '#4F46E5',
    toolCount: 28,
    featuredTools: [
      { id: 'word-counter', name: 'Word & Character Counter', description: 'Calculate word count, character count, sentence count, and reading time.', badge: 'TEXT ENGINE', isLocalOnly: true, inputFormats: ['Text'], outputFormats: ['Stats'], subgroup: 'Text Analysis' },
      { id: 'case-uppercase', name: 'UPPERCASE Converter', description: 'Convert text to all uppercase characters.', badge: 'TEXT ENGINE', isLocalOnly: true, inputFormats: ['Text'], outputFormats: ['Text'], subgroup: 'Text Cleaning' },
      { id: 'slug-generator', name: 'URL Slug Generator', description: 'Clean and format strings into URL-safe lowercase slugs.', badge: 'TEXT ENGINE', isLocalOnly: true, inputFormats: ['Text'], outputFormats: ['Slug'], subgroup: 'Text Cleaning' },
      { id: 'unicode-normalizer', name: 'Unicode Normalizer & Inspector', description: 'Inspect and normalize Unicode NFC, NFD, NFKC, and NFKD forms.', badge: 'TEXT ENGINE', isLocalOnly: true, inputFormats: ['Text'], outputFormats: ['Text'], subgroup: 'Text Cleaning' },
      { id: 'invisible-char-detector', name: 'Invisible & Zero-Width Character Detector', description: 'Detect and remove hidden zero-width spaces (`\\u200B`) and non-breaking spaces.', badge: 'TEXT ENGINE', isLocalOnly: true, inputFormats: ['Text'], outputFormats: ['Clean Text'], subgroup: 'Text Cleaning' },
      { id: 'regex-regex-extractor', name: 'Regex Data Extractor (Emails/URLs/Phones/IPs)', description: 'Deterministic pattern extractor for extracting emails, URLs, IP addresses, and phone numbers.', badge: 'TEXT ENGINE', isLocalOnly: true, inputFormats: ['Text'], outputFormats: ['Lists'], subgroup: 'Text Extraction' }
    ]
  },

  // 15. FILE MANAGEMENT & INSPECTION
  {
    id: 'files',
    slug: 'files',
    title: 'FILE INSPECTOR',
    name: 'File Management & Inspection',
    subtitle: 'File header/footer inspectors, byte entropy visualizers, batch filename renamers & collision checkers.',
    description: 'Inspect raw binary headers, byte distribution, and manage batch file operations locally.',
    iconName: 'FolderSearch',
    accentColor: '#4F46E5',
    toolCount: 18,
    featuredTools: [
      { id: 'file-header-inspector', name: 'File Header & Magic Byte Inspector', description: 'Inspect file signature magic bytes to identify true file types.', badge: 'FILE ENGINE', isLocalOnly: true, inputFormats: ['File'], outputFormats: ['HEX'], subgroup: 'File Analysis' },
      { id: 'file-entropy-viz', name: 'File Byte Entropy Visualizer', description: 'Visualize byte distribution entropy to detect encrypted or compressed regions.', badge: 'FILE ENGINE', isLocalOnly: true, inputFormats: ['File'], outputFormats: ['Chart'], subgroup: 'File Analysis' },
      { id: 'batch-filename-validator', name: 'Batch Filename Validator & Collision Checker', description: 'Validate OS filename safety and detect name collision conflicts before renaming.', badge: 'FILE ENGINE', isLocalOnly: true, inputFormats: ['Files'], outputFormats: ['Report'], subgroup: 'Batch File Operations' }
    ]
  },

  // 16. ACCESSIBILITY
  {
    id: 'a11y',
    slug: 'a11y',
    title: 'ACCESSIBILITY',
    name: 'Accessibility & Contrast',
    subtitle: 'Color contrast checkers, blindness simulators, duplicate ID checkers & missing ARIA detectors.',
    description: 'Evaluate web accessibility compliance and simulate visual color vision deficiencies.',
    iconName: 'Eye',
    accentColor: '#4F46E5',
    toolCount: 16,
    featuredTools: [
      { id: 'color-blind-sim', name: 'Color Vision Deficiency Simulator', description: 'Simulate Protanopia, Deuteranopia, and Tritanopia across image assets.', badge: 'A11Y ENGINE', isLocalOnly: true, inputFormats: ['Image'], outputFormats: ['Preview'], subgroup: 'Visual' },
      { id: 'html-a11y-checker', name: 'HTML Missing ARIA & Alt Checker', description: 'Inspect HTML snippets for missing `alt`, duplicate `id`s, and un-labeled buttons.', badge: 'A11Y ENGINE', isLocalOnly: true, inputFormats: ['HTML'], outputFormats: ['Report'], subgroup: 'HTML' }
    ]
  },

  // 17. PRINT & PAPER
  {
    id: 'print',
    slug: 'print',
    title: 'PRINT & PAPER',
    name: 'Print & Paper Layouts',
    subtitle: 'A4 scaling calculators, multi-page poster splitters & passport/photo print sheet layouts.',
    description: 'Prepare documents and images for physical printing, poster tiling, and photo sheet grid export.',
    iconName: 'Printer',
    accentColor: '#4F46E5',
    toolCount: 14,
    featuredTools: [
      { id: 'poster-splitter', name: 'Multi-Page Poster Splitter', description: 'Split large images across multiple A4 printable pages for tiled poster printing.', badge: 'PRINT ENGINE', isLocalOnly: true, inputFormats: ['Image'], outputFormats: ['PDF'], subgroup: 'Printing' },
      { id: 'photo-sheet-gen', name: 'Passport & ID Photo Sheet Generator', description: 'Layout 2x2 or passport photos onto 4x6 / A4 printable photo grid sheets.', badge: 'PRINT ENGINE', isLocalOnly: true, inputFormats: ['Photo'], outputFormats: ['PDF', 'PNG'], subgroup: 'Photo' }
    ]
  },

  // 18. PRODUCTIVITY
  {
    id: 'productivity',
    slug: 'productivity',
    title: 'PRODUCTIVITY',
    name: 'Productivity & Timers',
    subtitle: 'Checklist converters, Markdown note cleaners, Pomodoro & multi-timers.',
    description: 'Offline utility tools for list formatting, meeting agenda creation, and focus timer sessions.',
    iconName: 'CheckSquare',
    accentColor: '#4F46E5',
    toolCount: 15,
    featuredTools: [
      { id: 'checklist-converter', name: 'Checklist to Markdown / CSV Converter', description: 'Convert plain text task lists into interactive Markdown checklists or CSVs.', badge: 'PRODUCTIVITY ENGINE', isLocalOnly: true, inputFormats: ['Text'], outputFormats: ['MD', 'CSV'], subgroup: 'Lists' },
      { id: 'pomodoro-timer', name: 'Pomodoro & Focus Session Timer', description: 'Customizable local focus interval timer with audio alerts.', badge: 'PRODUCTIVITY ENGINE', isLocalOnly: true, inputFormats: ['Config'], outputFormats: ['Timer'], subgroup: 'Timers' }
    ]
  }
];

export function getCategoryBySlug(slug: string): CategoryData | undefined {
  return CATEGORIES.find(c => c.slug.toLowerCase() === slug.toLowerCase());
}

export function getAllTools(): Array<{ tool: UtilityItem; category: CategoryData }> {
  return CATEGORIES.flatMap(category => 
    category.featuredTools.map(tool => ({ tool, category }))
  );
}

export function getToolById(toolId: string): { tool: UtilityItem; category: CategoryData } | undefined {
  for (const category of CATEGORIES) {
    const tool = category.featuredTools.find(t => t.id.toLowerCase() === toolId.toLowerCase());
    if (tool) {
      return { tool, category };
    }
  }
  return undefined;
}
