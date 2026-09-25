import React from 'react';
import { UtilityItem } from '@/lib/categories';
import { getSampleDataForTool } from '@/lib/sampleData';
import { Code, Sparkles, Clipboard, Trash2 } from 'lucide-react';

interface ToolTextEditorProps {
  tool: UtilityItem;
  value: string;
  onChange: (val: string) => void;
  onLoadSample: () => void;
  onToast: (msg: string) => void;
}

export default function ToolTextEditor({
  tool,
  value,
  onChange,
  onLoadSample,
  onToast
}: ToolTextEditorProps) {
  const sampleData = getSampleDataForTool(tool.id);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onChange(text);
        onToast('Pasted content from clipboard!');
      }
    } catch {
      onToast('Clipboard access blocked. Use Ctrl+V / ⌘V to paste.');
    }
  };

  const lineCount = value ? value.split('\n').length : 0;
  const charCount = value.length;

  return (
    <div className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50/60 space-y-2.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-extrabold text-slate-900 flex items-center space-x-1.5">
          <Code className="w-4 h-4 text-[#4F46E5]" />
          <span>Enter text or data:</span>
          {value && (
            <span className="text-[10px] font-mono text-slate-500 font-semibold ml-1">
              ({lineCount} {lineCount === 1 ? 'line' : 'lines'} • {charCount} chars)
            </span>
          )}
        </label>

        <div className="flex items-center space-x-1.5">
          {sampleData && (
            <button
              type="button"
              onClick={onLoadSample}
              className="px-2.5 py-1 rounded-lg bg-[#EEF2FF] hover:bg-indigo-100 text-[#4F46E5] border border-indigo-200 text-[11px] font-extrabold transition-all flex items-center space-x-1 shadow-2xs hover:scale-[1.02]"
              title={sampleData.description}
            >
              <Sparkles className="w-3 h-3 text-[#4F46E5]" />
              <span>✨ Try with Sample</span>
            </button>
          )}

          <button
            type="button"
            onClick={handlePaste}
            className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[11px] font-bold transition-all flex items-center space-x-1 shadow-2xs"
          >
            <Clipboard className="w-3 h-3 text-slate-500" />
            <span>Paste</span>
          </button>

          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="px-2 py-1 rounded-lg bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 text-[11px] font-bold transition-all flex items-center space-x-1 shadow-2xs"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={
          sampleData
            ? `Enter or paste your text here, or click '✨ Try with Sample' (${sampleData.description})...`
            : `Enter or paste data for ${tool.name}...`
        }
        className="w-full h-36 p-3.5 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/15 resize-y placeholder:text-slate-400 leading-relaxed shadow-inner"
      />
    </div>
  );
}
