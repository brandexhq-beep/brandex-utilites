"use client";

import React from 'react';
import { 
  FileText, 
  Image as ImageIcon, 
  Code, 
  Database, 
  Lock, 
  Archive, 
  Globe, 
  Wand2, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Cpu, 
  FileCheck 
} from 'lucide-react';

const MARQUEE_ITEMS = [
  { icon: FileText, text: 'PDF Compression & Merging' },
  { icon: ShieldCheck, text: '100% Local-First Execution' },
  { icon: ImageIcon, text: 'WebP & PNG Optimization' },
  { icon: Code, text: 'JSON Formatter & Validator' },
  { icon: Lock, text: 'AES-256 PDF Encryption' },
  { icon: Database, text: 'JSON to CSV Converter' },
  { icon: Zap, text: 'Zero Server Data Storage' },
  { icon: Archive, text: 'ZIP & TAR Compression' },
  { icon: Globe, text: 'URL & QR Code Generator' },
  { icon: Wand2, text: 'UUID & Password Builder' }
];

export default function MarqueeBanner() {
  return (
    <div className="w-full bg-brand-navy text-white py-4 overflow-hidden border-y border-slate-800 select-none">
      <div className="flex w-max animate-marquee space-x-8">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div 
              key={idx} 
              className="flex items-center space-x-2.5 px-4 py-1 rounded-full bg-slate-900/80 border border-slate-800 shrink-0 text-xs font-semibold tracking-wide text-slate-200"
            >
              <IconComponent className="w-3.5 h-3.5 text-brand-purple shrink-0" />
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
