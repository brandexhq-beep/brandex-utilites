import React from 'react';
import { UtilityItem } from '@/lib/categories';
import { hasToolSettings } from '@/lib/toolRequirements';
import { 
  Sliders, 
  KeyRound, 
  RotateCw, 
  Maximize2, 
  Hash, 
  Code, 
  FileText, 
  ShieldCheck, 
  Lock 
} from 'lucide-react';

export interface ToolSettingsState {
  customPassword?: string;
  targetFormat?: 'image/jpeg' | 'image/png' | 'image/webp' | 'image/x-icon';
  quality?: number;
  resizeWidth?: number;
  resizeHeight?: number;
  jsonIndent?: number;
  convertMode?: 'encode' | 'decode';
  regexPattern?: string;
  hmacSecret?: string;
  uuidCount?: number;
  rotationDegrees?: number;
  marginPt?: number;
  hashAlgorithm?: 'SHA-256' | 'SHA-512' | 'SHA-1';
  passwordLength?: number;
  csvHeaderStyle?: 'snake' | 'camel' | 'lower';
  jsonSearchKey?: string;
  imgToPdfPageSize?: 'fit' | 'a4' | 'letter';
  imgToPdfOrientation?: 'auto' | 'portrait' | 'landscape';
}

interface ToolSettingsPanelProps {
  tool: UtilityItem;
  settings: ToolSettingsState;
  onChange: (updates: Partial<ToolSettingsState>) => void;
}

export default function ToolSettingsPanel({
  tool,
  settings,
  onChange
}: ToolSettingsPanelProps) {
  // If this tool has no real configurable settings, render nothing!
  if (!hasToolSettings(tool)) {
    return null;
  }

  const id = tool.id.toLowerCase();

  return (
    <div className="p-4.5 rounded-2xl bg-[#EEF2FF]/50 border border-indigo-100 space-y-3.5 animate-in fade-in duration-200">
      <div className="flex items-center space-x-2 text-xs font-extrabold text-slate-900 uppercase tracking-wider">
        <Sliders className="w-4 h-4 text-[#4F46E5]" />
        <span>Tool Settings</span>
      </div>

      {/* IMAGES TO PDF SETTINGS */}
      {(id === 'img-to-pdf' || id === 'images-to-pdf') && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">Page Size:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Fit Image', val: 'fit' },
                { label: 'A4', val: 'a4' },
                { label: 'Letter', val: 'letter' }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => onChange({ imgToPdfPageSize: opt.val as any })}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    (settings.imgToPdfPageSize || 'fit') === opt.val
                      ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-[#4F46E5]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 block">Orientation:</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { label: 'Auto', val: 'auto' },
                { label: 'Portrait', val: 'portrait' },
                { label: 'Landscape', val: 'landscape' }
              ].map(opt => (
                <button
                  key={opt.val}
                  type="button"
                  onClick={() => onChange({ imgToPdfOrientation: opt.val as any })}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
                    (settings.imgToPdfOrientation || 'auto') === opt.val
                      ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                      : 'bg-white text-slate-700 border-slate-300 hover:border-[#4F46E5]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PDF PASSWORD ENCRYPT */}
      {id === 'pdf-encrypt' && (
        <div className="space-y-1.5">
          <label className="text-xs font-extrabold text-slate-800 flex items-center">
            <KeyRound className="w-3.5 h-3.5 mr-1.5 text-[#4F46E5]" />
            Set Document Password:
          </label>
          <input 
            type="text" 
            value={settings.customPassword || ''}
            onChange={(e) => onChange({ customPassword: e.target.value })}
            placeholder="Enter custom password..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 shadow-xs"
          />
        </div>
      )}

      {/* PDF ROTATE */}
      {id === 'pdf-rotation-batch' && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 flex items-center">
            <RotateCw className="w-3.5 h-3.5 mr-1.5 text-[#4F46E5]" />
            Rotation Angle:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[90, 180, 270].map(deg => (
              <button
                key={deg}
                type="button"
                onClick={() => onChange({ rotationDegrees: deg })}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  settings.rotationDegrees === deg
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#4F46E5]'
                }`}
              >
                Rotate {deg}° Clockwise
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PDF MARGINS */}
      {(id === 'pdf-margin-editor' || id === 'pdf-bleed-editor' || id === 'pdf-trim-editor') && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block">Margin Width:</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Compact (10pt)', val: 10 },
              { label: 'Standard (20pt)', val: 20 },
              { label: 'Generous (36pt)', val: 36 },
              { label: 'Wide (54pt)', val: 54 }
            ].map(m => (
              <button
                key={m.val}
                type="button"
                onClick={() => onChange({ marginPt: m.val })}
                className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                  settings.marginPt === m.val
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#4F46E5]'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* IMAGE CONVERT: TARGET FORMAT */}
      {(id === 'img-convert' || id === 'image-converter') && (
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-800 block">Target Image Format:</label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'PNG', value: 'image/png' },
              { label: 'JPG', value: 'image/jpeg' },
              { label: 'WEBP', value: 'image/webp' },
              { label: 'ICO', value: 'image/x-icon' }
            ].map(fmt => {
              const isSelected = settings.targetFormat === fmt.value;
              return (
                <button
                  key={fmt.value}
                  type="button"
                  onClick={() => onChange({ targetFormat: fmt.value as any })}
                  className={`py-2 rounded-xl text-xs font-extrabold transition-all border shadow-xs ${
                    isSelected 
                      ? 'bg-[#4F46E5] text-white border-[#4F46E5] ring-2 ring-[#4F46E5]/30' 
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

      {/* IMAGE COMPRESS / CONVERT QUALITY */}
      {(id === 'img-compress' || id === 'image-compressor' || id === 'img-convert' || id === 'image-converter') && (
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center text-xs font-extrabold text-slate-800">
            <span>Visual Quality:</span>
            <span className="font-mono text-[#4F46E5] text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
              {settings.quality || 90}%
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Ultra High (95%)', val: 95 },
              { label: 'High (90%)', val: 90 },
              { label: 'Balanced (80%)', val: 80 }
            ].map(preset => (
              <button
                key={preset.val}
                type="button"
                onClick={() => onChange({ quality: preset.val })}
                className={`py-1.5 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                  settings.quality === preset.val
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
            value={settings.quality || 90}
            onChange={(e) => onChange({ quality: Number(e.target.value) })}
            className="w-full accent-[#4F46E5] cursor-pointer"
          />

          <div className="flex items-center text-[10px] text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />
            <span><strong>High Quality:</strong> Preserves original image sharpness and dimensions without blurring.</span>
          </div>
        </div>
      )}

      {/* IMAGE RESIZE */}
      {id === 'img-resize' && (
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="text-xs font-extrabold text-slate-800 block mb-1">Max Width (px):</label>
            <input 
              type="number" 
              value={settings.resizeWidth || 800}
              onChange={(e) => onChange({ resizeWidth: Number(e.target.value) })}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-mono"
            />
          </div>
          <div>
            <label className="text-xs font-extrabold text-slate-800 block mb-1">Max Height (px):</label>
            <input 
              type="number" 
              value={settings.resizeHeight || 600}
              onChange={(e) => onChange({ resizeHeight: Number(e.target.value) })}
              className="w-full px-3 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-mono"
            />
          </div>
        </div>
      )}

      {/* JSON FORMATTER: INDENTATION */}
      {(id === 'json-formatter' || id === 'code-formatter') && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block">Indentation:</label>
          <div className="flex space-x-2">
            {[
              { label: '2 Spaces', val: 2 },
              { label: '4 Spaces', val: 4 },
              { label: 'Compact / Minify', val: 0 }
            ].map(ind => (
              <button
                key={ind.val}
                type="button"
                onClick={() => onChange({ jsonIndent: ind.val })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  settings.jsonIndent === ind.val
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#4F46E5]'
                }`}
              >
                {ind.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BASE64: ENCODE / DECODE */}
      {id === 'base64' && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block">Operation:</label>
          <div className="flex space-x-2">
            {(['encode', 'decode'] as const).map(m => (
              <button
                key={m}
                type="button"
                onClick={() => onChange({ convertMode: m })}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold capitalize border transition-all ${
                  (settings.convertMode || 'encode') === m
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#4F46E5]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* REGEX TESTER */}
      {id === 'regex-tester' && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block">Regular Expression Pattern:</label>
          <input 
            type="text" 
            value={settings.regexPattern || ''}
            onChange={(e) => onChange({ regexPattern: e.target.value })}
            placeholder="e.g. [a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4F46E5]"
          />
        </div>
      )}

      {/* HASH / CHECKSUM ALGORITHM */}
      {(id === 'hash-calculator' || id === 'checksum-calc') && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block">Hashing Algorithm:</label>
          <div className="flex space-x-2">
            {(['SHA-256', 'SHA-512', 'SHA-1'] as const).map(alg => (
              <button
                key={alg}
                type="button"
                onClick={() => onChange({ hashAlgorithm: alg })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  (settings.hashAlgorithm || 'SHA-256') === alg
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#4F46E5]'
                }`}
              >
                {alg}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* HMAC SECRET */}
      {id === 'hmac-gen' && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block">Secret Key:</label>
          <input 
            type="text" 
            value={settings.hmacSecret || ''}
            onChange={(e) => onChange({ hmacSecret: e.target.value })}
            placeholder="Enter secret key..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4F46E5]"
          />
        </div>
      )}

      {/* UUID GENERATOR COUNT */}
      {id === 'uuid-generator' && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block">Number of UUIDs:</label>
          <div className="flex space-x-2">
            {[1, 5, 10, 20, 50].map(cnt => (
              <button
                key={cnt}
                type="button"
                onClick={() => onChange({ uuidCount: cnt })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  (settings.uuidCount || 5) === cnt
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-[#4F46E5]'
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PASSWORD GENERATOR */}
      {id === 'password-gen' && (
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-slate-800">
            <span>Password Length:</span>
            <span className="font-mono text-[#4F46E5] font-bold px-2 py-0.5 rounded bg-indigo-50 border border-indigo-100">
              {settings.passwordLength || 16} characters
            </span>
          </div>
          <input 
            type="range" 
            min="8" 
            max="64" 
            value={settings.passwordLength || 16}
            onChange={(e) => onChange({ passwordLength: Number(e.target.value) })}
            className="w-full accent-[#4F46E5] cursor-pointer"
          />
        </div>
      )}

      {/* CSV HEADER STYLE */}
      {(id === 'csv-to-json' || id === 'csv-header-normalizer') && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block">Header Style:</label>
          <div className="flex space-x-2">
            {(['snake', 'camel', 'lower'] as const).map(st => (
              <button
                key={st}
                type="button"
                onClick={() => onChange({ csvHeaderStyle: st })}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  (settings.csvHeaderStyle || 'snake') === st 
                    ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-xs' 
                    : 'bg-white text-slate-800 border-slate-300 hover:border-[#4F46E5]'
                }`}
              >
                {st === 'snake' ? 'snake_case' : st === 'camel' ? 'camelCase' : 'lowercase'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* JSON KEY SEARCH */}
      {id === 'json-key-finder' && (
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-800 block">Target Key Name:</label>
          <input
            type="text"
            value={settings.jsonSearchKey || ''}
            onChange={(e) => onChange({ jsonSearchKey: e.target.value })}
            placeholder="e.g. email, id, token..."
            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-xs font-mono text-slate-900 focus:outline-none focus:border-[#4F46E5]"
          />
        </div>
      )}
    </div>
  );
}
