import React, { useState, useEffect, useRef } from 'react';
import Link from '@/components/Link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UniversalSearchModal from '@/components/UniversalSearchModal';
import Toast from '@/components/Toast';
import ToolFileUploader from '@/components/tool-runner/ToolFileUploader';
import ToolTextEditor from '@/components/tool-runner/ToolTextEditor';
import ToolSettingsPanel, { ToolSettingsState } from '@/components/tool-runner/ToolSettingsPanel';
import ToolResultView from '@/components/tool-runner/ToolResultView';
import { UtilityItem, CategoryData } from '@/lib/categories';
import { getToolInputMode, hasToolSettings } from '@/lib/toolRequirements';
import { getSampleDataForTool } from '@/lib/sampleData';
import { executeLocalUtility, ProcessingResult } from '@/lib/engine';
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Share2, 
  HelpCircle, 
  CheckCircle2, 
  ExternalLink,
  Zap,
  AlertTriangle
} from 'lucide-react';

interface ToolDetailPageProps {
  tool: UtilityItem;
  category: CategoryData;
}

export default function ToolDetailPage({ tool, category }: ToolDetailPageProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Settings State
  const [settings, setSettings] = useState<ToolSettingsState>({
    customPassword: 'brandex123',
    targetFormat: 'image/png',
    quality: 90,
    resizeWidth: 800,
    resizeHeight: 600,
    jsonIndent: 2,
    convertMode: 'encode',
    regexPattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}',
    hmacSecret: 'brandex_secret_key',
    uuidCount: 5,
    rotationDegrees: 90,
    marginPt: 20,
    hashAlgorithm: 'SHA-256',
    passwordLength: 16,
    csvHeaderStyle: 'snake',
    jsonSearchKey: 'id',
    imgToPdfPageSize: 'fit',
    imgToPdfOrientation: 'auto'
  });

  const activeUrlsRef = useRef<string[]>([]);

  // Memory Leak Prevention: revoke object URLs when component unmounts
  useEffect(() => {
    return () => {
      activeUrlsRef.current.forEach(url => {
        try {
          URL.revokeObjectURL(url);
        } catch {
          // Ignore
        }
      });
      activeUrlsRef.current = [];
    };
  }, []);

  const inputMode = getToolInputMode(tool);

  const showToastNotification = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  const handleSettingsUpdate = (updates: Partial<ToolSettingsState>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToastNotification(`Link to "${tool.name}" copied to clipboard!`);
    }
  };

  const handleLoadSample = () => {
    const sample = getSampleDataForTool(tool.id);
    if (sample) {
      if (sample.text) {
        setTextInput(sample.text);
      }
      if (sample.options) {
        handleSettingsUpdate(sample.options as any);
      }
      showToastNotification(`Sample data loaded for "${tool.name}"!`);
    }
  };

  const runExecution = async () => {
    if (inputMode === 'file-only' || inputMode === 'file-and-text') {
      if (selectedFiles.length === 0) {
        showToastNotification(`Please upload a file to use ${tool.name}.`);
        return;
      }
    }

    if (inputMode === 'text-only') {
      if (!textInput.trim()) {
        showToastNotification(`Please enter some text or click "✨ Try with Sample" to use ${tool.name}.`);
        return;
      }
    }

    setIsProcessing(true);
    setResult(null);

    try {
      const res = await executeLocalUtility({
        toolId: tool.id,
        files: selectedFiles,
        textInput: textInput,
        options: {
          password: settings.customPassword,
          targetFormat: settings.targetFormat,
          quality: (settings.quality || 90) / 100,
          maxWidth: settings.resizeWidth,
          maxHeight: settings.resizeHeight,
          indent: settings.jsonIndent,
          mode: settings.convertMode,
          pattern: settings.regexPattern,
          secret: settings.hmacSecret,
          count: settings.uuidCount,
          degrees: settings.rotationDegrees,
          margin: settings.marginPt,
          algorithm: settings.hashAlgorithm,
          style: settings.csvHeaderStyle,
          searchKey: settings.jsonSearchKey,
          length: settings.passwordLength
        }
      });

      if (res.outputUrl) {
        activeUrlsRef.current.push(res.outputUrl);
      }

      setIsProcessing(false);
      setResult(res);

      if (res.success) {
        showToastNotification(`"${tool.name}" completed successfully!`);
      }
    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : 'Processing failed';
      setResult({ success: false, error: msg });
    }
  };

  // Other tools in the same category for related links
  const relatedTools = category.featuredTools
    .filter(t => t.id !== tool.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col transition-colors selection:bg-[#EEF2FF] selection:text-[#4F46E5]">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} currentPath={`/tools/${tool.id}`} />
      <UniversalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* FLOATING TOAST NOTIFICATION */}
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

      <main className="flex-1 w-full mx-auto px-6 sm:px-10 py-6 max-w-6xl">
        
        {/* SEO BREADCRUMB */}
        <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-8">
          <Link href="/" className="hover:text-[#4F46E5] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-[#4F46E5] transition-colors">Categories</Link>
          <span>/</span>
          <Link href={`/categories/${category.slug}`} className="hover:text-[#4F46E5] transition-colors">{category.name}</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{tool.name}</span>
        </nav>

        {/* HERO TITLE & SEO HEADER */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <Link 
              href={`/categories/${category.slug}`}
              className="text-xs font-extrabold uppercase px-3 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100 hover:bg-indigo-100 transition-colors"
            >
              {category.name}
            </Link>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Private (Runs on your device)</span>
            </div>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors ml-auto"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Share Tool</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-3 break-words">
            {tool.name}
          </h1>

          <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-medium max-w-3xl leading-relaxed mb-4">
            {tool.description} Fast, secure, and always free with zero server file uploads.
          </p>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
            <span className="font-extrabold text-slate-400 uppercase tracking-wider">Input:</span>
            {tool.inputFormats.map(fmt => (
              <span key={fmt} className="font-mono px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                {fmt}
              </span>
            ))}
            <span className="text-slate-400 font-extrabold mx-1">→</span>
            <span className="font-extrabold text-slate-400 uppercase tracking-wider">Output:</span>
            {tool.outputFormats.map(fmt => (
              <span key={fmt} className="font-mono px-2 py-0.5 rounded-md bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] font-extrabold">
                {fmt}
              </span>
            ))}
          </div>
        </div>

        {/* INTERACTIVE WORKSPACE CARD */}
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-sm mb-16 space-y-6">
          
          {/* 1. FILE UPLOADER (WHEN TOOL ACCEPTS FILES) */}
          {(inputMode === 'file-only' || inputMode === 'file-and-text') && (
            <ToolFileUploader 
              tool={tool}
              selectedFiles={selectedFiles}
              onFilesChange={setSelectedFiles}
              onError={showToastNotification}
            />
          )}

          {/* 2. TEXT / CODE EDITOR (WHEN TOOL ACCEPTS TEXT) */}
          {(inputMode === 'text-only' || inputMode === 'file-and-text') && (
            <ToolTextEditor 
              tool={tool}
              value={textInput}
              onChange={setTextInput}
              onLoadSample={handleLoadSample}
              onToast={showToastNotification}
            />
          )}

          {/* 3. TOOL SETTINGS (ONLY WHEN TOOL HAS OPTIONS) */}
          {hasToolSettings(tool) && (
            <ToolSettingsPanel 
              tool={tool}
              settings={settings}
              onChange={handleSettingsUpdate}
            />
          )}

          {/* ACTION BUTTON & STATUS */}
          <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-100">
            <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Your files never leave this device. Processing is 100% in-browser.</span>
            </div>

            <button
              type="button"
              onClick={runExecution}
              disabled={isProcessing}
              className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-sm transition-all flex items-center justify-center shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-h-[46px]"
            >
              {isProcessing ? 'Processing...' : 'Run Tool'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* EXECUTION ERROR */}
          {result && !result.success && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start space-x-2 animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold">Failed to process:</strong> {result.error}
              </div>
            </div>
          )}

          {/* EXECUTION RESULT */}
          {result && result.success && (
            <div className="pt-4">
              <ToolResultView 
                result={result}
                selectedFiles={selectedFiles}
                textInput={textInput}
                onToast={showToastNotification}
              />
            </div>
          )}
        </div>

        {/* HOW TO USE GUIDE (SEO STEP-BY-STEP) */}
        <section className="mb-16">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">
            How to Use {tool.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#4F46E5] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                1
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Select Your Input</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {inputMode === 'file-only' || inputMode === 'file-and-text'
                  ? `Drag & drop your ${tool.inputFormats.join(', ')} file into the upload zone or browse your files.`
                  : `Type, paste your text or click "✨ Try with Sample" to load ready-to-test data.`}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#4F46E5] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                2
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Configure Options</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {hasToolSettings(tool)
                  ? 'Customize parameters such as quality, format, or sizing to match your exact workflow needs.'
                  : 'BrandEX automatically uses optimal, lossless presets for the fastest processing.'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#4F46E5] text-white font-extrabold flex items-center justify-center text-sm shadow-xs">
                3
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">Download or Copy</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Click &quot;Run Tool&quot; to execute in-memory instantly. Preview your result and download the generated file or copy the text output.
              </p>
            </div>
          </div>
        </section>

        {/* KEY BENEFITS (SEO TRUST) */}
        <section className="mb-16 bg-slate-50 border border-slate-200 rounded-3xl p-8 lg:p-10">
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-6">
            Why Choose BrandEX {tool.name}?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">100% Private & Local</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your data and documents never touch a third-party server. Everything processes in your browser session.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-[#4F46E5] flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Lightning Fast</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Powered by WebAssembly and native HTML5 APIs for instantaneous client-side execution without upload lag.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">High Fidelity Output</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Zero quality loss, zero watermarks, and zero compromises on original layout, dimensions, or text clarity.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-sm">Forever Free & Unlimited</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No sign-up, no subscriptions, and no daily usage caps. Always accessible for developers and professionals.
              </p>
            </div>
          </div>
        </section>

        {/* FREQUENTLY ASKED QUESTIONS (SEO FAQ) */}
        <section className="mb-16">
          <div className="flex items-center space-x-2 mb-6">
            <HelpCircle className="w-5 h-5 text-[#4F46E5]" />
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Is {tool.name} really free?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Yes, {tool.name} is completely free with no hidden fees, subscriptions, or account requirements.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Are my documents or data stored on BrandEX servers?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Never. BrandEX Utilities operates on a 100% local-first architecture. All computations execute on your CPU and browser memory.
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm">
                Can I use this tool on my mobile phone or tablet?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Yes! All BrandEX tools are responsive and work seamlessly on modern mobile browsers (iOS Safari, Android Chrome).
              </p>
            </div>

            <div className="border border-slate-200 rounded-2xl p-5 bg-white space-y-2">
              <h3 className="font-extrabold text-slate-900 text-sm">
                What file formats are supported?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {tool.name} accepts {tool.inputFormats.join(', ')} and exports to {tool.outputFormats.join(', ')}.
              </p>
            </div>
          </div>
        </section>

        {/* RELATED TOOLS FROM SAME CATEGORY */}
        {relatedTools.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                More {category.name} Tools
              </h2>
              <Link 
                href={`/categories/${category.slug}`}
                className="text-xs font-bold text-[#4F46E5] hover:underline flex items-center"
              >
                <span>View all {category.name}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedTools.map(rel => (
                <Link
                  key={rel.id}
                  href={`/tools/${rel.id}`}
                  className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4F46E5] hover:shadow-md transition-all group"
                >
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-[#4F46E5] transition-colors mb-1.5">
                      {rel.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                      {rel.description}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#4F46E5] mt-4">
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* BRANDEX DIGITAL AGENCY CALLOUT BANNER */}
        <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-indigo-900/60 shadow-xl mb-12">
          <div className="space-y-2 max-w-xl text-center md:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>BrandEX Digital Agency</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">Need Custom Software or Automated Workflows?</h3>
            <p className="text-slate-300 text-xs leading-relaxed font-medium">
              We design and engineer bespoke web applications, enterprise automation systems, and high-performance digital tools tailored to your business operations.
            </p>
          </div>
          <a
            href="https://brandex.co.in"
            target="_blank"
            rel="noreferrer"
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold shrink-0 transition-all flex items-center justify-center space-x-2 shadow-lg hover:scale-[1.03] active:scale-[0.97] min-h-[44px]"
          >
            <span>Visit brandex.co.in</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

      </main>

      <Footer />
    </div>
  );
}
