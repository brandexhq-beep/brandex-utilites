"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
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
  CheckSquare
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

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || '';
  const category = getCategoryBySlug(slug);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<UtilityItem | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState('');

  // Toast popup state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Custom User Parameters
  const [customPassword, setCustomPassword] = useState('brandex123');
  const [targetFormat, setTargetFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp' | 'image/x-icon'>('image/png');
  const [quality, setQuality] = useState(75);
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  const [jsonIndent, setJsonIndent] = useState(2);
  const [convertMode, setConvertMode] = useState<'encode' | 'decode'>('encode');
  const [regexPattern, setRegexPattern] = useState('[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}');
  const [hmacSecret, setHmacSecret] = useState('brandex_secret_key');
  const [uuidCount, setUuidCount] = useState(5);

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
        indent: jsonIndent,
        mode: convertMode,
        pattern: regexPattern,
        secret: hmacSecret,
        count: uuidCount
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
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
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
          <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* MODAL HEADER */}
            <div className="p-6 border-b border-slate-200 bg-slate-50/60 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold text-[#4F46E5] uppercase tracking-wider">{category.name}</span>
                <h3 className="text-xl font-extrabold text-slate-900">{activeTool.name}</h3>
              </div>
              <button 
                onClick={() => setActiveTool(null)} 
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[500px] overflow-y-auto">
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

                {/* IMAGE COMPRESSOR: QUALITY SLIDER */}
                {(activeTool.id === 'img-compress' || activeTool.id === 'image-compressor') && (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs font-extrabold text-slate-800">
                      <span>Compression Quality:</span>
                      <span className="font-mono text-[#4F46E5] text-sm">{quality}%</span>
                    </div>
                    <input 
                      type="range" 
                      min="10" 
                      max="100" 
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full accent-[#4F46E5] cursor-pointer"
                    />
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

              {/* REAL SUCCESSFUL PROCESSING RESULT */}
              {result && result.success && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 font-extrabold text-emerald-700">
                      <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
                      <span>Processing Complete!</span>
                    </div>
                    {result.outputSize && (
                      <span className="text-[11px] font-mono text-emerald-900 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                        Output Size: {formatBytes(result.outputSize)}
                      </span>
                    )}
                  </div>

                  {/* VISUAL IMAGE/SVG PREVIEW IF RESULT IS A GRAPHIC */}
                  {(result.outputFileName?.endsWith('.svg') || result.outputFileName?.endsWith('.png') || result.outputFileName?.endsWith('.jpg') || (typeof result.data === 'string' && result.data.startsWith('<svg'))) ? (
                    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-xl border border-emerald-200 shadow-inner">
                      {result.outputUrl ? (
                        <img 
                          src={result.outputUrl} 
                          alt="Output Preview" 
                          className="max-h-56 w-auto object-contain rounded"
                        />
                      ) : (
                        <div 
                          className="max-h-56 w-auto flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: result.data }}
                        />
                      )}
                    </div>
                  ) : result.data && (
                    <div className="relative">
                      <pre className="p-3.5 rounded-xl bg-white border border-emerald-200 text-[11px] font-mono max-h-36 overflow-y-auto whitespace-pre-wrap text-slate-900 leading-relaxed">
                        {typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2)}
                      </pre>
                      <button 
                        onClick={copyResultData}
                        className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-300 text-[10px] font-bold text-slate-800 hover:bg-white transition-colors flex items-center shadow-xs"
                      >
                        <Copy className="w-3 h-3 mr-1 text-[#4F46E5]" />
                        {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  )}

                  {/* REAL DOWNLOAD BUTTON */}
                  {result.outputUrl && (
                    <div className="pt-2 flex justify-end">
                      <a 
                        href={result.outputUrl}
                        download={result.outputFileName || 'output'}
                        className="px-5 py-2.5 rounded-full bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition-all flex items-center shadow-md hover:shadow-lg hover:scale-[1.02]"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Real Result File
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* MODAL FOOTER */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3">
              <button 
                onClick={() => setActiveTool(null)} 
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
