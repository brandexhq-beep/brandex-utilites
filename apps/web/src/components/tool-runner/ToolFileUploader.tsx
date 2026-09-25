import React, { useState } from 'react';
import { UtilityItem } from '@/lib/categories';
import { getToolFileConstraints, validateFilesForTool } from '@/lib/toolRequirements';
import { FileUp, FileIcon, X, Trash2, AlertCircle } from 'lucide-react';

interface ToolFileUploaderProps {
  tool: UtilityItem;
  selectedFiles: File[];
  onFilesChange: (files: File[]) => void;
  onError: (msg: string) => void;
}

import { formatBytes } from '@/lib/file';
export { formatBytes };

export default function ToolFileUploader({
  tool,
  selectedFiles,
  onFilesChange,
  onError
}: ToolFileUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const constraints = getToolFileConstraints(tool);

  const processIncomingFiles = (incoming: File[]) => {
    if (!incoming || incoming.length === 0) return;

    // Validate file extensions
    const validation = validateFilesForTool(tool, incoming);
    if (!validation.valid) {
      onError(validation.error || 'Unsupported file format for this tool.');
      return;
    }

    if (constraints.multiple) {
      onFilesChange([...selectedFiles, ...incoming]);
    } else {
      // Single file tool: replace previous file
      if (incoming.length > 1) {
        onError(`This tool processes one file at a time. Selected "${incoming[0].name}".`);
      }
      onFilesChange([incoming[0]]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processIncomingFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processIncomingFiles(Array.from(e.target.files));
      e.target.value = ''; // Reset input to allow re-uploading the same file
    }
  };

  const removeFileAtIndex = (index: number) => {
    onFilesChange(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="border border-slate-200 rounded-2xl p-4.5 bg-slate-50/60 space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-extrabold text-slate-900 flex items-center space-x-1.5">
          <FileUp className="w-4 h-4 text-[#4F46E5]" />
          <span>Upload {constraints.multiple ? 'files' : 'file'} for {tool.name}:</span>
        </label>
        {selectedFiles.length > 0 && (
          <button 
            type="button" 
            onClick={() => onFilesChange([])} 
            className="text-[11px] font-bold text-slate-500 hover:text-rose-600 transition-colors flex items-center space-x-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear ({selectedFiles.length})</span>
          </button>
        )}
      </div>

      <div 
        onDragOver={(e) => { e.preventDefault(); setIsDragActive(true); }}
        onDragLeave={() => setIsDragActive(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-5 text-center transition-all cursor-pointer relative ${
          isDragActive 
            ? 'border-[#4F46E5] bg-[#EEF2FF]/70 ring-4 ring-[#4F46E5]/10' 
            : 'border-slate-300 bg-white hover:border-[#4F46E5] hover:bg-slate-50/50'
        }`}
      >
        <input 
          type="file" 
          accept={constraints.accept}
          multiple={constraints.multiple} 
          onChange={handleInputChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          title={`Select ${constraints.label}`}
        />

        {selectedFiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center space-y-2 py-3">
            <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] text-[#4F46E5] flex items-center justify-center border border-indigo-100 shadow-2xs">
              <FileUp className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-extrabold text-slate-900">
                Drag & drop {constraints.multiple ? 'files' : 'a file'} here, or <span className="text-[#4F46E5] underline">browse</span>
              </p>
              <p className="text-[11px] text-slate-400 font-medium mt-1">
                Accepted: <strong className="text-slate-600">{constraints.label}</strong> • 100% processed on your device
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2 text-left relative z-20">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
              <span>Ready to process ({selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''}):</span>
              <span className="text-[10px] text-slate-400 font-normal">{constraints.label}</span>
            </div>

            <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
              {selectedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
                  <div className="flex items-center space-x-2 truncate mr-2">
                    <FileIcon className="w-3.5 h-3.5 text-[#4F46E5] shrink-0" />
                    <span className="font-bold text-slate-900 truncate max-w-sm">{file.name}</span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="font-mono text-slate-500 text-[10px]">{formatBytes(file.size)}</span>
                    <button 
                      type="button" 
                      onClick={(e) => { e.stopPropagation(); removeFileAtIndex(idx); }}
                      className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors"
                      title="Remove file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {constraints.multiple && (
              <p className="text-center text-[11px] font-bold text-[#4F46E5] pt-1 hover:underline">
                + Add more files
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
