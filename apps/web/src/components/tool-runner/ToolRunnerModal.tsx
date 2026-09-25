import React, { useState, useEffect, useRef } from 'react';
import { UtilityItem, CategoryData } from '@/lib/categories';
import { getToolInputMode, hasToolSettings } from '@/lib/toolRequirements';
import { getSampleDataForTool } from '@/lib/sampleData';
import { executeLocalUtility, ProcessingResult } from '@/lib/engine';
import ToolFileUploader from './ToolFileUploader';
import ToolTextEditor from './ToolTextEditor';
import ToolSettingsPanel, { ToolSettingsState } from './ToolSettingsPanel';
import ToolResultView from './ToolResultView';
import { 
  X, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  ExternalLink, 
  AlertTriangle 
} from 'lucide-react';

interface ToolRunnerModalProps {
  tool: UtilityItem;
  category: CategoryData;
  onClose: () => void;
  onToast: (msg: string) => void;
}

export default function ToolRunnerModal({
  tool,
  category,
  onClose,
  onToast
}: ToolRunnerModalProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<ProcessingResult | null>(null);

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

  // Memory Leak Prevention: Revoke object URLs on modal close or unmount
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

  const handleSettingsUpdate = (updates: Partial<ToolSettingsState>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tool', tool.id);
      navigator.clipboard.writeText(url.toString());
      onToast(`Direct link to "${tool.name}" copied to clipboard!`);
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
      onToast(`Sample data loaded for "${tool.name}"!`);
    }
  };

  const runExecution = async () => {
    // Input validation
    if (inputMode === 'file-only' || inputMode === 'file-and-text') {
      if (selectedFiles.length === 0) {
        onToast(`Please upload a file to use ${tool.name}.`);
        return;
      }
    }

    if (inputMode === 'text-only') {
      if (!textInput.trim()) {
        onToast(`Please enter some text or click "✨ Try with Sample" to use ${tool.name}.`);
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
        onToast(`"${tool.name}" completed successfully!`);
      }
    } catch (err: unknown) {
      setIsProcessing(false);
      const msg = err instanceof Error ? err.message : 'Processing failed';
      setResult({ success: false, error: msg });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl w-full max-w-4xl lg:max-w-5xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* MODAL HEADER */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-extrabold text-[#4F46E5] uppercase tracking-wider">{category.name}</span>
            <h3 className="text-xl font-extrabold text-slate-900">{tool.name}</h3>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleShare}
              className="px-3.5 py-1.5 rounded-xl text-slate-600 hover:text-[#4F46E5] hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 transition-all text-xs font-bold flex items-center space-x-1.5 shadow-2xs"
              title="Copy share link to this tool"
            >
              <Share2 className="w-3.5 h-3.5 text-[#4F46E5]" />
              <span className="hidden sm:inline">Share Tool</span>
            </button>
            <button 
              onClick={onClose} 
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* DESCRIPTION & PRIVACY TAG */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
            <p className="text-xs text-slate-600 leading-relaxed font-normal">{tool.description}</p>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold shrink-0 self-start sm:self-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Private (Runs on your device)</span>
            </div>
          </div>

          {/* 1. FILE UPLOADER (ONLY WHEN TOOL ACCEPTS FILES) */}
          {(inputMode === 'file-only' || inputMode === 'file-and-text') && (
            <ToolFileUploader 
              tool={tool}
              selectedFiles={selectedFiles}
              onFilesChange={setSelectedFiles}
              onError={onToast}
            />
          )}

          {/* 2. TEXT / CODE EDITOR (ONLY WHEN TOOL ACCEPTS TEXT) */}
          {(inputMode === 'text-only' || inputMode === 'file-and-text') && (
            <ToolTextEditor 
              tool={tool}
              value={textInput}
              onChange={setTextInput}
              onLoadSample={handleLoadSample}
              onToast={onToast}
            />
          )}

          {/* 3. TOOL SETTINGS (ONLY WHEN TOOL HAS CONFIGURABLE OPTIONS) */}
          {hasToolSettings(tool) && (
            <ToolSettingsPanel 
              tool={tool}
              settings={settings}
              onChange={handleSettingsUpdate}
            />
          )}

          {/* 4. EXECUTION ERROR */}
          {result && !result.success && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-start space-x-2 animate-in fade-in duration-200">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold">Failed to process:</strong> {result.error}
              </div>
            </div>
          )}

          {/* 5. RESULT DISPLAY */}
          {result && result.success && (
            <ToolResultView 
              result={result}
              selectedFiles={selectedFiles}
              textInput={textInput}
              onToast={onToast}
            />
          )}

          {/* BRANDEX DIGITAL AGENCY LEAD-GEN BANNER */}
          <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-4 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-900/60 shadow-md">
            <div className="flex items-center space-x-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-inner">
                <Sparkles className="w-5 h-5 text-indigo-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold text-white">Need Custom Software or Automated Workflows?</span>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    BrandEX Agency
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed font-medium">
                  We architect bespoke web applications, high-volume automation, and custom internal software tools.
                </p>
              </div>
            </div>
            <a
              href="https://brandex.co.in"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold shrink-0 transition-all flex items-center space-x-1.5 shadow-md hover:scale-[1.03] active:scale-[0.97]"
            >
              <span>Visit brandex.co.in</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4.5 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3 shrink-0">
          <button 
            type="button"
            onClick={onClose} 
            className="px-5 py-2.5 rounded-full text-xs font-bold text-slate-600 border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
          <button 
            type="button"
            onClick={runExecution} 
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-xs transition-all flex items-center shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Run Tool'}
          </button>
        </div>
      </div>
    </div>
  );
}
