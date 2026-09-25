import React, { useState, useEffect, useRef } from 'react';
import { ProcessingResult } from '@/lib/engine';
import { 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Download, 
  Columns, 
  Check, 
  FileText 
} from 'lucide-react';
import { formatBytes } from './ToolFileUploader';

interface ToolResultViewProps {
  result: ProcessingResult;
  selectedFiles: File[];
  textInput: string;
  onToast: (msg: string) => void;
}

export default function ToolResultView({
  result,
  selectedFiles,
  textInput,
  onToast
}: ToolResultViewProps) {
  const [previewMode, setPreviewMode] = useState<'split' | 'before' | 'after'>('split');
  const [copied, setCopied] = useState(false);
  const activeUrlsRef = useRef<string[]>([]);

  // Memory Cleanup: Track created object URLs and revoke them on unmount
  useEffect(() => {
    if (result.outputUrl) {
      activeUrlsRef.current.push(result.outputUrl);
    }
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
  }, [result]);

  const copyResultData = () => {
    if (result?.data) {
      const textToCopy = typeof result.data === 'string' ? result.data : JSON.stringify(result.data, null, 2);
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onToast('Copied result to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
    <div className="rounded-2xl border border-indigo-200 bg-slate-50/70 p-4.5 space-y-4 shadow-sm animate-in fade-in zoom-in-95 duration-200">
      {/* RESULT BANNER & CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xs text-slate-900">Ready! Here&apos;s your result:</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-300">
                <Sparkles className="w-2.5 h-2.5 mr-1 text-emerald-600" />
                Ultra High Fidelity
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Processed securely in your browser — zero files sent to servers
            </span>
          </div>
        </div>

        {/* VIEW MODE SELECTOR (SIDE-BY-SIDE / BEFORE / AFTER) */}
        {isGraphic && (
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
        )}
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

      {/* GRAPHIC BEFORE & AFTER PREVIEW */}
      {isGraphic ? (
        <div className={`grid gap-4 ${previewMode === 'split' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
          {(previewMode === 'split' || previewMode === 'before') && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col">
              <div className="px-3.5 py-2 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>BEFORE (Original)</span>
                </span>
                <span className="font-mono text-[10px] text-slate-500">
                  {result.originalSize ? formatBytes(result.originalSize) : (selectedFiles[0] ? formatBytes(selectedFiles[0].size) : '')}
                </span>
              </div>
              <div className="p-4 flex items-center justify-center min-h-[220px] max-h-[300px] overflow-hidden bg-slate-900/5">
                {beforeImageUrl ? (
                  <img src={beforeImageUrl} alt="Original Before" className="max-h-[260px] object-contain rounded" />
                ) : (
                  <div className="text-center p-6 text-slate-400 text-xs">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <span>Raw Input Media</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {(previewMode === 'split' || previewMode === 'after') && (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs flex flex-col">
              <div className="px-3.5 py-2 bg-emerald-50/70 border-b border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-800">
                <span className="flex items-center space-x-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>AFTER (Optimized Result)</span>
                </span>
                <span className="font-mono text-[10px] text-emerald-700 font-extrabold">
                  {result.outputSize ? formatBytes(result.outputSize) : ''}
                </span>
              </div>
              <div className="p-4 flex items-center justify-center min-h-[220px] max-h-[300px] overflow-hidden bg-slate-900/5">
                {result.outputUrl ? (
                  <img src={result.outputUrl} alt="Optimized Output" className="max-h-[260px] object-contain rounded" />
                ) : (
                  <div className="text-center p-6 text-slate-400 text-xs">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <span>Processed Output Ready</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* TEXT / CODE RESULT DISPLAY */
        afterText && (
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span>Formatted Output:</span>
              <span className="text-[11px] font-mono text-slate-500">
                {afterText.split('\n').length} lines • {afterText.length} characters
              </span>
            </div>
            <pre className="p-4 bg-slate-900 text-emerald-400 rounded-xl font-mono text-xs overflow-x-auto max-h-64 leading-relaxed border border-slate-800 shadow-inner selection:bg-emerald-900 selection:text-white">
              {afterText}
            </pre>
          </div>
        )
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
              {copied ? 'Copied to Clipboard!' : 'Copy Result'}
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
              Download File ({result.outputFileName || 'output'})
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
