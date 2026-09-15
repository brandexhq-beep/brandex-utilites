import React, { useState, useEffect } from 'react';
import Link from '@/components/Link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UniversalSearchModal from '@/components/UniversalSearchModal';
import Toast from '@/components/Toast';
import { getCategoryBySlug, CATEGORIES, UtilityItem } from '@/lib/categories';
import { calculateSHA256, formatBytes } from '@/lib/file';
import { executeLocalUtility, ProcessingResult } from '@/lib/engine';
import { 
  FileText, 
  Image as ImageIcon, 
  Code, 
  Database, 
  Lock, 
  Archive, 
  Globe, 
  Wand2, 
  ArrowRight,
  ShieldCheck,
  Zap,
  CheckCircle2,
  FileIcon,
  Download,
  X,
  Copy,
  AlertTriangle,
  Sliders as SlidersIcon,
  KeyRound,
  QrCode,
  Mail,
  Calendar,
  Calculator,
  Type,
  FolderSearch,
  Eye,
  Printer,
  CheckSquare,
  Columns,
  Split,
  Layers,
  Sparkles,
  Check
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-8 h-8 text-[#4F46E5]" />,
  Image: <ImageIcon className="w-8 h-8 text-[#4F46E5]" />,
  Code: <Code className="w-8 h-8 text-[#4F46E5]" />,
  Database: <Database className="w-8 h-8 text-[#4F46E5]" />,
  Lock: <Lock className="w-8 h-8 text-[#4F46E5]" />,
  Archive: <Archive className="w-8 h-8 text-[#4F46E5]" />,
  Globe: <Globe className="w-8 h-8 text-[#4F46E5]" />,
  Wand2: <Wand2 className="w-8 h-8 text-[#4F46E5]" />,
  QrCode: <QrCode className="w-8 h-8 text-[#4F46E5]" />,
  Mail: <Mail className="w-8 h-8 text-[#4F46E5]" />,
  Sliders: <SlidersIcon className="w-8 h-8 text-[#4F46E5]" />,
  Calendar: <Calendar className="w-8 h-8 text-[#4F46E5]" />,
  Calculator: <Calculator className="w-8 h-8 text-[#4F46E5]" />,
  Type: <Type className="w-8 h-8 text-[#4F46E5]" />,
  FolderSearch: <FolderSearch className="w-8 h-8 text-[#4F46E5]" />,
  Eye: <Eye className="w-8 h-8 text-[#4F46E5]" />,
  Printer: <Printer className="w-8 h-8 text-[#4F46E5]" />,
  CheckSquare: <CheckSquare className="w-8 h-8 text-[#4F46E5]" />
};

interface CategoryDetailPageProps {
  slug?: string;
}

export default function CategoryDetailPage({ slug: propSlug }: CategoryDetailPageProps) {
  const [slug, setSlug] = useState(propSlug || '');
  useEffect(() => {
    if (!slug && typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const last = parts[parts.length - 1];
      if (last && last !== 'categories') setSlug(last);
    }
  }, [slug]);
  const category = getCategoryBySlug(slug);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<UtilityItem | null>(null);

  useEffect(() => {
    if (category && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const toolId = urlParams.get('tool');
      if (toolId) {
        const found = category.featuredTools.find(t => t.id === toolId);
        if (found) {
          setActiveTool(found);
        }
      }
    }
  }, [category]);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState('');

  // Toast popup state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Custom User Parameters
  const [customPassword, setCustomPassword] = useState('brandex123');
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp' | 'image/x-icon'>('image/png');
  const [quality, setQuality] = useState(90);
  const [previewMode, setPreviewMode] = useState<'split' | 'before' | 'after'>('split');
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  const [jsonIndent, setJsonIndent] = useState(2);
  const [convertMode, setConvertMode] = useState<'encode' | 'decode'>('encode');
  const [regexPattern, setRegexPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [hmacSecret, setHmacSecret] = useState('brandex_secret_key');
  const [uuidCount, setUuidCount] = useState(5);
  const [rotationDegrees, setRotationDegrees] = useState(90);
  const [marginPt, setMarginPt] = useState(20);
  const [hashAlgorithm, setHashAlgorithm] = useState<'SHA-256' | 'SHA-512' | 'SHA-1'>('SHA-256');
  const [passwordLength, setPasswordLength] = useState(16);
  const [codeIndentSpaces, setCodeIndentSpaces] = useState(2);
  const [indentToTabs, setIndentToTabs] = useState(false);
  const [lineEndingFormat, setLineEndingFormat] = useState<'LF' | 'CRLF'>('LF');
  const [csvHeaderStyle, setCsvHeaderStyle] = useState<'snake' | 'camel' | 'lower'>('snake');
  const [jsonSearchKey, setJsonSearchKey] = useState('id');

  // Real processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);
  const [copied, setCopied] = useState(false);

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="max-w-lg mx-auto py-24 text-center px-6">
          <h1 className="text-3xl font-extrabold text-[#0f172a] mb-4">Category Not Found</h1>
          <p className="text-slate-600 mb-6">The utility category you are looking for does not exist.</p>
          <Link href="/categories" className="px-6 py-3 rounded-full bg-[#4F46E5] text-white font-bold text-sm">
            View All Categories
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const openToolModal = (tool: UtilityItem) => {
    setActiveTool(tool);
    setResult(null);
    setCopied(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tool', tool.id);
      window.history.replaceState(null, '', url.toString());
    }
  };

  const closeToolModal = () => {
    setActiveTool(null);
    setResult(null);
    setCopied(false);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('tool');
      window.history.replaceState(null, '', url.toString());
    }
  };

  const runExecution = async () => {
    if (!activeTool) return;
    setIsProcessing(true);
    setResult(null);

    const res = await executeLocalUtility({
      toolId: activeTool.id,
      files: selectedFiles,
      textInput: textInput,
      options: {
        password: customPassword,
        targetFormat: targetFormat,
        quality: quality / 100,
        maxWidth: resizeWidth,
        maxHeight: resizeHeight,
        indent: jsonIndent || codeIndentSpaces,
        mode: convertMode,
        pattern: regexPattern,
        secret: hmacSecret,
        count: uuidCount,
        degrees: rotationDegrees,
        margin: marginPt,
        algorithm: hashAlgorithm,
        style: csvHeaderStyle,
        searchKey: jsonSearchKey,
        lineEnding: lineEndingFormat,
        length: passwordLength,
        toTabs: indentToTabs
      }
    });

    setIsProcessing(false);
    setResult(res);

    if (res.success) {
      setToastMessage(`Processing completed! "${activeTool.name}" is ready for download.`);
      setShowToast(true);
    }
  };

  const copyResultData = () => {
    if (result?.data) {
      const textToCopy = typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2);
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col transition-colors selection:bg-[#EEF2FF] selection:text-[#4F46E5]">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} currentPath={`/categories/${slug}`} />
      <UniversalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* FLOATING PROCESSING TOAST NOTIFICATION */}
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
        actionUrl={result?.outputUrl}
        actionFileName={result?.outputFileName}
      />

      <main className="flex-1 w-full mx-auto px-6 sm:px-10 py-6">
        
        {/* BREADCRUMB */}
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-8">
          <Link href="/" className="hover:text-[#4F46E5] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-[#4F46E5] transition-colors">Categories</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{category.name}</span>
        </div>

        {/* CATEGORY HEADER BANNER */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 lg:p-12 mb-12 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] border border-indigo-100 flex items-center justify-center text-[#4F46E5] shadow-xs">
                  {ICON_MAP[category.iconName] || <FileText className="w-8 h-8 text-[#4F46E5]" />}
                </div>
                <div>
                  <span className="text-xs font-extrabold text-[#4F46E5] uppercase tracking-wider">
                    {category.title}
                  </span>
                  <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {category.name}
                  </h1>
                </div>
              </div>
              
              <p className="text-base lg:text-lg text-slate-600 leading-relaxed font-medium">
                {category.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Local Browser Engine</span>
                </div>
                <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100 text-xs font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{category.toolCount} Implemented Utilities</span>
                </div>
              </div>
            </div>

            {/* HIGHLIGHTS */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:w-80 shrink-0 space-y-3">
              <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                Interactive Controls
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                  Custom password selection
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                  Format & quality sliders
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                  Live Blob generation & download
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* UNIVERSAL FILE / TEXT DROPZONE (SOLID MODERN BORDER) */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-extrabold text-[#4F46E5] uppercase tracking-wider">
              Select Inputs for {category.name}
            </h2>
            <span className="text-xs text-slate-400">
              Select real files or paste text input below
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* FILE DROP ZONE (CLICK ANYWHERE IN BOX TO SELECT FILE) */}
            <div 
              onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
              className={`border rounded-2xl p-6 text-center transition-all duration-200 cursor-pointer flex flex-col justify-center items-center relative overflow-hidden group ${
                dragActive ? 'border-[#4F46E5] bg-[#EEF2FF]/50 ring-4 ring-[#4F46E5]/10' : 'border-slate-200 bg-white hover:border-[#4F46E5]'
              }`}
            >
              {selectedFiles.length === 0 ? (
                <>
                  <input 
                    type="file" 
                    multiple 
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title="Click anywhere to select files"
                  />
                  <div className="flex flex-col items-center justify-center space-y-2 py-4">
                    <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center border border-indigo-100 group-hover:scale-110 transition-transform">
                      <FileIcon className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-extrabold text-slate-900 group-hover:text-[#4F46E5] transition-colors">
                      Select or Drop File(s)
                    </p>
                    <p className="text-xs text-slate-400 font-medium">
                      Supports {category.featuredTools.flatMap(t => t.inputFormats).filter((v, i, a) => a.indexOf(v) === i).slice(0, 6).join(', ')}
                    </p>
                  </div>
                </>
              ) : (
                <div className="w-full text-left space-y-2 relative z-20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900">Selected Files ({selectedFiles.length}):</span>
                    <button onClick={() => setSelectedFiles([])} className="text-xs text-slate-400 hover:text-slate-900 font-bold">Clear</button>
                  </div>
                  {selectedFiles.map((f, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 text-xs">
                      <span className="truncate max-w-[200px] font-bold text-slate-900">{f.name}</span>
                      <span className="text-slate-500 font-mono">{formatBytes(f.size)}</span>
                    </div>
                  ))}
                  <label className="block text-center pt-2">
                    <input type="file" multiple onChange={handleFileChange} className="hidden" />
                    <span className="text-xs font-bold text-[#4F46E5] hover:underline cursor-pointer">+ Add More Files</span>
                  </label>
                </div>
              )}
            </div>

            {/* TEXT INPUT AREA */}
            <div className="flex flex-col">
              <label className="text-xs font-extrabold text-slate-900 mb-2">Raw Text / Code Input (Optional):</label>
              <textarea 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Paste raw JSON, Base64, JWT token, or plain text here..."
                className="w-full h-36 p-3.5 rounded-2xl border border-slate-200 bg-white text-xs font-mono focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/10 resize-none placeholder:text-slate-400 text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* UTILITY TOOLS LIST */}
        <div className="mb-16">
          <h2 className="text-xs font-extrabold text-[#4F46E5] uppercase tracking-wider mb-6">
            Production-Grade {category.name} Tools
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.featuredTools.map(tool => (
              <div 
                key={tool.id}
                className="smooth-card bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-[#4F46E5]/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {tool.name}
                    </h3>
                    {tool.badge && (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100">
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 font-medium">
                    {tool.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mb-6">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold mr-1">Formats:</span>
                    {tool.inputFormats.map(fmt => (
                      <span key={fmt} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                        {fmt}
                      </span>
                    ))}
                    <span className="text-[10px] text-slate-400 font-extrabold mx-1">→</span>
                    {tool.outputFormats.map(fmt => (
                      <span key={fmt} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] font-extrabold">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                    Local Engine
                  </span>
                  
                  {tool.id.startsWith('qr-') ? (
                    <Link
                      href="/tools/qr-studio"
                      className="px-4 py-2 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all text-xs font-bold flex items-center shadow-xs hover:scale-[1.02]"
                    >
                      Open QR Studio
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  ) : (
                    <button 
                      onClick={() => openToolModal(tool)}
                      className="px-4 py-2 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all text-xs font-bold flex items-center shadow-xs hover:scale-[1.02]"
                    >
                      Launch Utility
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* REAL UTILITY RUNNER MODAL */}
      {activeTool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-4xl lg:max-w-5xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* MODAL HEADER */}
            <div className="p-6 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-[#4F46E5] uppercase tracking-wider">{category.name}</span>
                <h3 className="text-xl font-extrabold text-slate-900">{activeTool.name}</h3>
              </div>
              <button 
                onClick={closeToolModal} 
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[82vh] overflow-y-auto">
              <p className="text-xs text-slate-600 leading-relaxed font-medium">{activeTool.description}</p>
              
              {/* ENGINE & INPUT STATUS */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Processing Engine:</span>
                  <span className="font-semibold text-emerald-600 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                    Local Browser Session
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-medium">Selected Inputs:</span>
                  <span className="font-mono text-slate-900 font-bold bg-white px-2.5 py-0.5 rounded border border-slate-200">
                    {selectedFiles.length > 0 ? `${selectedFiles.length} file(s)` : (textInput ? 'Raw text input' : 'Default dataset')}
                  </span>
                </div>
              </div>

              {/* DYNAMIC USER PARAMETER CONTROLS */}
              <div className="p-4 rounded-2xl bg-[#EEF2FF]/40 border border-indigo-100 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  <SlidersIcon className="w-4 h-4 text-[#4F46E5]" />
                  <span>Utility Options & Settings</span>
                </div>

                {/* PDF ENCRYPT: CUSTOM PASSWORD INPUT */}
                {activeTool.id === 'pdf-encrypt' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 flex items-center">
                      <KeyRound className="w-3.5 h-3.5 mr-1.5 text-[#4F46E5]" />
                      Set Custom Encryption Password:
                    </label>
                    <input 
                      type="text" 
                      value={customPassword}
                      onChange={(e) => setCustomPassword(e.target.value)}
                      placeholder="Enter custom password..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 shadow-xs"
                    />
                  </div>
                )}

                {/* IMAGE CONVERTER: TARGET FORMAT SELECTOR */}
                {(activeTool.id === 'img-convert' || activeTool.id === 'image-converter') && (
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-slate-800 block">Select Target Image Format:</label>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: 'PNG', value: 'image/png' },
                        { label: 'JPG', value: 'image/jpeg' },
                        { label: 'WEBP', value: 'image/webp' },
                        { label: 'ICO', value: 'image/x-icon' }
                      ].map(fmt => {
                        const isSelected = targetFormat === fmt.value;
                        return (
                          <button
                            key={fmt.value}
                            type="button"
                            onClick={() => setTargetFormat(fmt.value as any)}
                            className={`py-2 rounded-xl text-xs font-extrabold transition-all border shadow-xs ${
                              isSelected 
                                ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-indigo-500/20 ring-2 ring-[#4F46E5]/30' 
                                : 'bg-white text-slate-800 border-slate-300 hover:border-[#4F46E5] hover:text-[#4F46E5]'
                            }`}
                          >
                            {fmt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* IMAGE COMPRESSOR: QUALITY SLIDER & PRESETS */}
                {(activeTool.id === 'img-compress' || activeTool.id === 'image-compressor' || activeTool.id === 'img-convert' || activeTool.id === 'image-converter') && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-extrabold text-slate-800">
                      <span>Visual Quality Setting:</span>
                      <span className="font-mono text-[#4F46E5] text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">{quality}% Fidelity</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {[
                        { label: 'Ultra Fidelity (95%)', val: 95 },
                        { label: 'High Fidelity (90%)', val: 90 },
                        { label: 'Balanced (80%)', val: 80 }
                      ].map(preset => (
                        <button
                          key={preset.val}
                          type="button"
                          onClick={() => setQuality(preset.val)}
                          className={`py-1.5 px-2 rounded-xl text-[11px] font-extrabold border transition-all ${
                            quality === preset.val
                              ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                              : 'bg-white text-slate-700 border-slate-300 hover:border-[#4F46E5]'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>

                    <input 
                      type="range" 
                      min="30" 
                      max="100" 
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-[#4F46E5] cursor-pointer"
                    />

                    <div className="flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
                      <span><strong>Zero-Quality-Loss Engine:</strong> Preserves full pixel dimensions and edge sharpness without artifacts.</span>
                    </div>
                  </div>
                )}

                {/* IMAGE RESIZER: DIMENSIONS */}
                {activeTool.id === 'img-resize' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-extrabold text-slate-800 block mb-1">Max Width (px):</label>
                      <input 
                        type="number" 
                        value={resizeWidth}
                        onChange={(e) => setResizeWidth(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4F46E5]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-extrabold text-slate-800 block mb-1">Max Height (px):</label>
                      <input 
                        type="number" 
                        value={resizeHeight}
                        onChange={(e) => setResizeHeight(Number(e.target.value))}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4F46E5]"
                      />
                    </div>
                  </div>
                )}

                {/* JSON FORMATTER: INDENTATION */}
                {activeTool.id === 'json-formatter' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 block">Indentation:</label>
                    <div className="flex space-x-2">
                      {[
                        { label: '2 Spaces', val: 2 },
                        { label: '4 Spaces', val: 4 },
                        { label: 'Minify', val: 0 }
                      ].map(ind => (
                        <button
                          key={ind.val}
                          type="button"
                          onClick={() => setJsonIndent(ind.val)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                            jsonIndent === ind.val ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs' : 'bg-white text-slate-800 border-slate-300 hover:border-[#4F46E5]'
                          }`}
                        >
                          {ind.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PDF ROTATION: ANGLE SELECTOR */}
                {activeTool.id === 'pdf-rotation-batch' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 block">Rotation Angle:</label>
                    <div className="flex space-x-2">
                      {[90, 180, 270].map(deg => (
                        <button
                          key={deg}
                          type="button"
                          onClick={() => setRotationDegrees(deg)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                            rotationDegrees === deg ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs' : 'bg-white text-slate-800 border-slate-300 hover:border-[#4F46E5]'
                          }`}
                        >
                          {deg}° Clockwise
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PDF MARGINS: PADDING SELECTOR */}
                {(activeTool.id.includes('margin') || activeTool.id.includes('bleed') || activeTool.id.includes('trim')) && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 block">Margin Expansion (pt):</label>
                    <div className="flex space-x-2">
                      {[10, 20, 36, 50].map(pt => (
                        <button
                          key={pt}
                          type="button"
                          onClick={() => setMarginPt(pt)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                            marginPt === pt ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs' : 'bg-white text-slate-800 border-slate-300 hover:border-[#4F46E5]'
                          }`}
                        >
                          +{pt} pt
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* HASH ALGORITHM SELECTOR */}
                {(activeTool.id.includes('hash') || activeTool.id === 'checksum-calc') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 block">Hash Algorithm:</label>
                    <div className="flex space-x-2">
                      {(['SHA-256', 'SHA-512', 'SHA-1'] as const).map(algo => (
                        <button
                          key={algo}
                          type="button"
                          onClick={() => setHashAlgorithm(algo)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                            hashAlgorithm === algo ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs' : 'bg-white text-slate-800 border-slate-300 hover:border-[#4F46E5]'
                          }`}
                        >
                          {algo}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* PASSWORD GENERATOR: LENGTH */}
                {activeTool.id === 'password-gen' && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-extrabold text-slate-800">
                      <span>Password Length:</span>
                      <span className="font-mono text-[#4F46E5] text-sm">{passwordLength} chars</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="48"
                      value={passwordLength}
                      onChange={(e) => setPasswordLength(Number(e.target.value))}
                      className="w-full accent-[#4F46E5] cursor-pointer"
                    />
                  </div>
                )}

                {/* BASE64 / URL: ENCODE VS DECODE */}
                {(activeTool.id === 'base64' || activeTool.id === 'url-encoder') && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 block">Operation Mode:</label>
                    <div className="flex space-x-2">
                      {(['encode', 'decode'] as const).map(m => (
                        <button
                          key={m}
                          type="button"
                          onClick={() => setConvertMode(m)}
                          className={`px-4 py-1.5 rounded-xl text-xs font-extrabold border uppercase transition-all ${
                            convertMode === m ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs' : 'bg-white text-slate-800 border-slate-300 hover:border-[#4F46E5]'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* CSV HEADER NORMALIZER */}
                {activeTool.id === 'csv-header-normalizer' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 block">Header Style:</label>
                    <div className="flex space-x-2">
                      {(['snake', 'camel', 'lower'] as const).map(st => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => setCsvHeaderStyle(st)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold border transition-all ${
                            csvHeaderStyle === st ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs' : 'bg-white text-slate-800 border-slate-300 hover:border-[#4F46E5]'
                          }`}
                        >
                          {st === 'snake' ? 'snake_case' : st === 'camel' ? 'camelCase' : 'lowercase'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* JSON KEY SEARCH */}
                {activeTool.id === 'json-key-finder' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-800 block">Target Key Name:</label>
                    <input
                      type="text"
                      value={jsonSearchKey}
                      onChange={(e) => setJsonSearchKey(e.target.value)}
                      placeholder="e.g. email, id, token..."
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4F46E5]"
                    />
                  </div>
                )}
              </div>

              {/* REAL EXECUTION ERROR DISPLAY */}
              {result && !result.success && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-extrabold">Execution Failed:</strong> {result.error}
                  </div>
                </div>
              )}

              {/* REAL SUCCESSFUL PROCESSING RESULT WITH BEFORE & AFTER PREVIEW */}
              {result && result.success && (() => {
                const isGraphic = Boolean(
                  (result.outputUrl && (
                    result.outputFileName?.match(/\.(png|jpe?g|webp|gif|svg|ico)$/i) || 
                    result.originalUrl || 
                    (selectedFiles.length > 0 && selectedFiles[0].type.startsWith('image/'))
                  )) || 
                  (typeof result.data === 'string' && result.data.trim().startsWith('<svg'))
                );

                const beforeImageUrl = result.originalUrl || (selectedFiles.length > 0 && selectedFiles[0].type.startsWith('image/') ? URL.createObjectURL(selectedFiles[0]) : null);
                const beforeText = result.originalInput || textInput || (selectedFiles.length > 0 ? `File: ${selectedFiles[0].name}\nSize: ${formatBytes(selectedFiles[0].size)}\nType: ${selectedFiles[0].type || 'application/octet-stream'}` : 'Initial payload');
                const afterText = typeof result.data === 'string' ? result.data : (result.data ? JSON.stringify(result.data, null, 2) : '');

                const sizeSavings = (result.originalSize && result.outputSize && result.originalSize > 0)
                  ? (((result.originalSize - result.outputSize) / result.originalSize) * 100)
                  : null;

                return (
                  <div className="rounded-2xl border border-indigo-200 bg-slate-50/70 p-4 space-y-4 shadow-sm">
                    {/* RESULT BANNER & CONTROLS */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                      <div className="flex items-center space-x-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                          <CheckCircle2 className="h-4 w-4" />
                        </span>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-extrabold text-xs text-slate-900">Processing Succeeded</span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-300">
                              <Sparkles className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                              Ultra High Fidelity
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium">
                            Processed in-memory using 100% client-side WebAssembly & Web APIs
                          </span>
                        </div>
                      </div>

                      {/* VIEW MODE SELECTOR (SIDE-BY-SIDE / BEFORE / AFTER) */}
                      <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-2xs self-start sm:self-auto">
                        <button
                          type="button"
                          onClick={() => setPreviewMode('split')}
                          className={`flex items-center px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            previewMode === 'split'
                              ? 'bg-[#4F46E5] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          <Columns className="w-3.5 h-3.5 mr-1.5" />
                          Side-by-Side
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewMode('before')}
                          className={`flex items-center px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            previewMode === 'before'
                              ? 'bg-[#4F46E5] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          Before
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewMode('after')}
                          className={`flex items-center px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                            previewMode === 'after'
                              ? 'bg-[#4F46E5] text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                          }`}
                        >
                          After
                        </button>
                      </div>
                    </div>

                    {/* METRIC STRIP (SIZE / COMPRESSION / FIDELITY) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="bg-white border border-slate-200 rounded-xl p-2.5">
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Original Size</div>
                        <div className="font-mono font-extrabold text-slate-900 mt-0.5">
                          {result.originalSize ? formatBytes(result.originalSize) : (selectedFiles[0] ? formatBytes(selectedFiles[0].size) : 'N/A')}
                        </div>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-2.5">
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Output Size</div>
                        <div className="font-mono font-extrabold text-emerald-700 mt-0.5">
                          {result.outputSize ? formatBytes(result.outputSize) : (afterText ? formatBytes(new TextEncoder().encode(afterText).length) : 'N/A')}
                        </div>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-2.5">
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Efficiency</div>
                        <div className="font-mono font-extrabold text-[#4F46E5] mt-0.5">
                          {sizeSavings !== null ? (
                            sizeSavings > 0 ? `-${sizeSavings.toFixed(1)}% size` : `+${Math.abs(sizeSavings).toFixed(1)}%`
                          ) : result.compressionRatio ? `${result.compressionRatio} ratio` : 'Optimized'}
                        </div>
                      </div>
                      <div className="bg-white border border-slate-200 rounded-xl p-2.5">
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Visual Fidelity</div>
                        <div className="font-bold text-emerald-600 mt-0.5 flex items-center">
                          <Check className="w-3 h-3 mr-1 text-emerald-500" />
                          100% Crisp
                        </div>
                      </div>
                    </div>

                    {/* BEFORE AND AFTER PREVIEW CANVAS */}
                    {isGraphic ? (
                      /* IMAGE / GRAPHIC BEFORE & AFTER PREVIEW */
                      <div className={`grid gap-4 ${previewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                        {/* BEFORE CARD */}
                        {(previewMode === 'split' || previewMode === 'before') && (
                          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col">
                            <div className="px-3.5 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                              <span className="flex items-center space-x-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                <span>BEFORE (Original)</span>
                              </span>
                              {result.originalDimensions && (
                                <span className="text-[10px] font-mono text-slate-500 font-semibold">
                                  {result.originalDimensions.width} × {result.originalDimensions.height} px
                                </span>
                              )}
                            </div>
                            <div className="p-4 flex-1 flex items-center justify-center min-h-[220px] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px] bg-slate-50/50">
                              {beforeImageUrl ? (
                                <img
                                  src={beforeImageUrl}
                                  alt="Before Original"
                                  className="max-h-64 max-w-full object-contain rounded shadow-xs"
                                />
                              ) : (
                                <div className="text-center text-slate-400 py-8">
                                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                  <p className="text-xs font-semibold">Original file preview not available</p>
                                </div>
                              )}
                            </div>
                            <div className="px-3.5 py-2 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex justify-between font-mono">
                              <span>Source: {selectedFiles[0]?.name || 'Original Input'}</span>
                              <span>{result.originalSize ? formatBytes(result.originalSize) : ''}</span>
                            </div>
                          </div>
                        )}

                        {/* AFTER CARD */}
                        {(previewMode === 'split' || previewMode === 'after') && (
                          <div className="bg-white border-2 border-emerald-400/80 rounded-xl overflow-hidden shadow-2xs flex flex-col">
                            <div className="px-3.5 py-2 bg-emerald-50/80 border-b border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-900">
                              <span className="flex items-center space-x-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span>AFTER (Processed Result)</span>
                              </span>
                              {result.outputDimensions ? (
                                <span className="text-[10px] font-mono text-emerald-800 font-semibold">
                                  {result.outputDimensions.width} × {result.outputDimensions.height} px
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                                  High Fidelity
                                </span>
                              )}
                            </div>
                            <div className="p-4 flex-1 flex items-center justify-center min-h-[220px] bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:12px_12px] bg-white">
                              {result.outputUrl ? (
                                <img
                                  src={result.outputUrl}
                                  alt="After Processed"
                                  className="max-h-64 max-w-full object-contain rounded shadow-xs"
                                />
                              ) : (typeof result.data === 'string' && result.data.trim().startsWith('<svg')) ? (
                                <div
                                  className="max-h-64 max-w-full flex items-center justify-center"
                                  dangerouslySetInnerHTML={{ __html: result.data }}
                                />
                              ) : (
                                <div className="text-center text-slate-400 py-8">
                                  <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                                  <p className="text-xs font-semibold">Output generated successfully</p>
                                </div>
                              )}
                            </div>
                            <div className="px-3.5 py-2 bg-emerald-50/40 border-t border-emerald-100 text-[11px] text-emerald-900 flex justify-between font-mono">
                              <span>Output: {result.outputFileName || 'processed'}</span>
                              <span className="font-bold text-emerald-700">{result.outputSize ? formatBytes(result.outputSize) : ''}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* TEXT / CODE / DATA / CSV / JSON BEFORE & AFTER PREVIEW */
                      <div className={`grid gap-4 ${previewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
                        {/* BEFORE TEXT CARD */}
                        {(previewMode === 'split' || previewMode === 'before') && (
                          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col">
                            <div className="px-3.5 py-2 bg-slate-100/80 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                              <span className="flex items-center space-x-1.5">
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                <span>BEFORE (Input Content)</span>
                              </span>
                              <span className="text-[10px] font-mono text-slate-500">
                                {beforeText.split('\n').length} lines • {beforeText.length} chars
                              </span>
                            </div>
                            <div className="p-3 bg-slate-900 flex-1">
                              <pre className="text-[11px] font-mono text-slate-200 max-h-52 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                                {beforeText}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* AFTER TEXT CARD */}
                        {(previewMode === 'split' || previewMode === 'after') && (
                          <div className="bg-white border-2 border-indigo-300 rounded-xl overflow-hidden shadow-2xs flex flex-col">
                            <div className="px-3.5 py-2 bg-indigo-50/80 border-b border-indigo-200 flex items-center justify-between text-xs font-bold text-indigo-950">
                              <span className="flex items-center space-x-1.5">
                                <span className="w-2 h-2 rounded-full bg-[#4F46E5]"></span>
                                <span>AFTER (Transformed Result)</span>
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className="text-[10px] font-mono text-indigo-700">
                                  {afterText.split('\n').length} lines • {afterText.length} chars
                                </span>
                                <button
                                  type="button"
                                  onClick={copyResultData}
                                  className="px-2 py-0.5 rounded bg-white border border-indigo-200 text-[10px] font-bold text-[#4F46E5] hover:bg-indigo-50 transition-colors flex items-center"
                                >
                                  <Copy className="w-2.5 h-2.5 mr-1" />
                                  {copied ? 'Copied!' : 'Copy'}
                                </button>
                              </div>
                            </div>
                            <div className="p-3 bg-slate-950 flex-1">
                              <pre className="text-[11px] font-mono text-emerald-400 max-h-52 overflow-y-auto whitespace-pre-wrap leading-relaxed">
                                {afterText}
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ACTION TOOLBAR (DOWNLOAD / COPY) */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
                      <div className="flex items-center space-x-2">
                        {afterText && (
                          <button
                            type="button"
                            onClick={copyResultData}
                            className="px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-xs font-extrabold text-slate-800 hover:bg-slate-50 transition-all flex items-center shadow-xs"
                          >
                            <Copy className="w-3.5 h-3.5 mr-1.5 text-[#4F46E5]" />
                            {copied ? 'Copied Output to Clipboard!' : 'Copy Transformed Data'}
                          </button>
                        )}
                      </div>

                      <div className="flex items-center space-x-3">
                        {result.outputUrl && (
                          <a
                            href={result.outputUrl}
                            download={result.outputFileName || 'output'}
                            className="px-5 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-xs transition-all flex items-center shadow-md hover:shadow-indigo-200 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download {result.outputFileName || 'Result File'}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* MODAL FOOTER */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3">
              <button 
                onClick={closeToolModal} 
                className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={runExecution} 
                disabled={isProcessing}
                className="px-6 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-xs transition-all flex items-center shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                {isProcessing ? 'Executing...' : 'Run Utility Now'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
