"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UniversalSearchModal from '@/components/UniversalSearchModal';
import MarqueeBanner from '@/components/MarqueeBanner';
import Toast from '@/components/Toast';
import { CATEGORIES } from '@/lib/categories';
import { calculateSHA256, formatBytes } from '@/lib/file';
import { 
  Search, 
  File as FileIcon, 
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
  Cpu,
  Layers,
} from 'lucide-react';
import { executeLocalUtility, inspectFileDeterministically, FileIntelligenceReport } from '@/lib/engine';

import TypewriterText from '@/components/TypewriterText';

export default function Home() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [inspectedFile, setInspectedFile] = useState<{
    file: File;
    hash: string | null;
    isHashing: boolean;
  } | null>(null);

  // Toast popup state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const [fileReport, setFileReport] = useState<FileIntelligenceReport | null>(null);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setInspectedFile({ file, hash: null, isHashing: true });
    
    const report = await inspectFileDeterministically(file);
    setFileReport(report);
    setInspectedFile({ file, hash: report.sha256Hash, isHashing: false });

    setToastMessage(`BrandEX File Intelligence: Analyzed "${file.name}" (${report.fileSizeFormatted}).`);
    setShowToast(true);
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setInspectedFile({ file, hash: null, isHashing: true });
    
    const report = await inspectFileDeterministically(file);
    setFileReport(report);
    setInspectedFile({ file, hash: report.sha256Hash, isHashing: false });

    setToastMessage(`BrandEX File Intelligence: Analyzed "${file.name}" (${report.fileSizeFormatted}).`);
    setShowToast(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col transition-colors selection:bg-[#EEF2FF] selection:text-[#4F46E5]">
      
      {/* NAVBAR */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      
      {/* UNIVERSAL SEARCH MODAL */}
      <UniversalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* FLOATING PROCESSING TOAST NOTIFICATION */}
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

      <main className="flex-1 w-full px-6 sm:px-10 py-6 flex flex-col items-center">
        
        {/* LANDING PAGE HERO SECTION WITH JITTER-FREE TYPEWRITER */}
        <div className="text-center w-full max-w-5xl mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pt-4">
          
          {/* PURPLE PILL BADGE */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] text-xs font-extrabold tracking-wide uppercase mb-4 shadow-xs hover:bg-[#E0E7FF] hover:border-[#4F46E5]/30 hover:scale-[1.02] transition-all duration-200 cursor-default">
            <span>LOCAL-FIRST UTILITY PLATFORM</span>
          </div>

          {/* HEADLINE WITH TYPEWRITER EFFECT (FIXED HEIGHT TO PREVENT JITTER) */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4 max-w-4xl mx-auto min-h-[130px] sm:min-h-[150px] flex flex-col justify-center items-center">
            <span>All Your Software Utilities</span>
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] bg-clip-text text-transparent mt-1">
              <TypewriterText 
                phrases={[
                  "Zero Server Uploads Required."
                ]}
                typingSpeed={50}
                deletingSpeed={30}
                pauseDuration={2200}
              />
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-medium px-4 leading-relaxed max-w-3xl mx-auto mb-6">
            Convert documents, optimize media, validate schemas, and compute hashes directly inside your browser. Zero server file uploads required.
          </p>

          <div className="flex flex-wrap justify-center items-center gap-4">
            <Link
              href="/categories"
              className="px-7 py-3.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold transition-all duration-200 shadow-md hover:shadow-indigo-500/25 hover:scale-[1.03] active:scale-[0.97] flex items-center space-x-2"
            >
              <span>Explore Utilities Directory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="px-6 py-3.5 rounded-full bg-white border border-slate-200 hover:border-[#4F46E5] text-slate-700 hover:text-[#4F46E5] text-xs font-extrabold transition-all duration-200 flex items-center space-x-2 shadow-xs hover:scale-[1.03] active:scale-[0.97]"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span>Universal Search</span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-500">⌘K</kbd>
            </button>
          </div>
        </div>

        {/* FILE DROPZONE (CLICK ANYWHERE IN BOX TO SELECT FILE) */}
        {!inspectedFile ? (
          <div 
            className={`w-full max-w-[780px] mb-20 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-center justify-center p-8 cursor-pointer shadow-sm hover:shadow-md relative overflow-hidden group ${
              isDragging ? 'border-[#4F46E5] bg-[#EEF2FF]/60 ring-4 ring-[#4F46E5]/10' : 'border-slate-200 bg-white hover:border-[#4F46E5]'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              onChange={handleFileInputChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              title="Click anywhere to select file"
            />
            <div className="w-12 h-12 rounded-2xl bg-[#EEF2FF] border border-indigo-100 flex items-center justify-center mr-4 shadow-xs mb-4 sm:mb-0 text-[#4F46E5] shrink-0 group-hover:scale-110 transition-transform">
              <FileIcon className="w-6 h-6" />
            </div>
            <div className="text-center sm:text-left">
              <p className="font-extrabold text-slate-900 text-base group-hover:text-[#4F46E5] transition-colors">
                Select or drop a file to run local utilities
              </p>
              <p className="text-xs text-slate-500 mt-1 font-medium">
                Click anywhere in this box or drag & drop files to process locally
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[780px] mb-20 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in duration-300">
            {/* FILE INTELLIGENCE HEADER */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
               <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4F46E5] flex items-center justify-center text-white font-extrabold shadow-sm">
                    <FileIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold text-indigo-300 uppercase tracking-widest block">BRANDEX FILE INTELLIGENCE</span>
                    <span className="font-extrabold text-white text-base truncate max-w-md block">{inspectedFile.file.name}</span>
                  </div>
               </div>
               <button onClick={() => { setInspectedFile(null); setFileReport(null); }} className="text-slate-400 hover:text-white transition-colors text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-800">
                 Close
               </button>
            </div>

            {/* DETERMINISTIC FILE METADATA */}
            <div className="p-6 grid grid-cols-2 sm:grid-cols-3 gap-4 border-b border-slate-200 bg-slate-50/50">
               <div>
                 <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">Detected Format</p>
                 <p className="text-xs font-bold text-slate-900">{fileReport?.detectedFormat || inspectedFile.file.type || 'Binary Blob'}</p>
               </div>
               <div>
                 <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">File Size</p>
                 <p className="text-xs font-bold text-slate-900">{fileReport?.fileSizeFormatted || formatBytes(inspectedFile.file.size)}</p>
               </div>
               <div>
                 <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">SHA-256 Hash</p>
                 <span className="text-[11px] font-mono text-slate-900 font-semibold truncate block">
                   {inspectedFile.isHashing ? 'Computing...' : (inspectedFile.hash?.slice(0, 14) + '...')}
                 </span>
               </div>

               {/* DYNAMIC DETAILS FROM DETERMINISTIC PARSER */}
               {fileReport?.details && Object.entries(fileReport.details).map(([key, val]) => (
                 <div key={key}>
                   <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-1">{key}</p>
                   <p className="text-xs font-bold text-[#4F46E5]">{String(val)}</p>
                 </div>
               ))}
            </div>

            {/* SUGGESTED LOCAL UTILITY ACTIONS */}
            <div className="p-6 bg-white">
              <div className="flex justify-between items-center mb-4">
                 <p className="text-[11px] font-extrabold text-slate-900 uppercase tracking-wider">Available Local Actions</p>
                 <span className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span> Local Execution
                 </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                 {(fileReport?.suggestedActions || [
                   { name: 'Compress File', categorySlug: 'pdf', description: 'Run local file optimization' },
                   { name: 'Compute Hash', categorySlug: 'security', description: 'Compute cryptographic SHA-256 checksum' }
                 ]).map(action => (
                   <Link 
                     key={action.name} 
                     href={`/categories/${action.categorySlug}`} 
                     className="p-4 bg-white border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-900 hover:border-[#4F46E5] hover:shadow-lg hover:shadow-[#4F46E5]/10 hover:-translate-y-0.5 transition-all text-left group flex flex-col justify-between"
                   >
                     <div className="flex justify-between items-center mb-1">
                       <span className="text-slate-900 font-extrabold group-hover:text-[#4F46E5] transition-colors">{action.name}</span>
                       <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#4F46E5] group-hover:translate-x-0.5 transition-all" />
                     </div>
                     <span className="text-[11px] font-medium text-slate-500">{action.description}</span>
                   </Link>
                 ))}
              </div>
            </div>
          </div>
        )}

        {/* POPULAR TASKS TICKER */}
        <div className="w-full flex flex-col items-center mb-20">
          <h2 className="text-[11px] font-extrabold text-[#4F46E5] uppercase tracking-widest mb-6">
            POPULAR UTILITY PIPELINES
          </h2>
          <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
            {[
              { name: 'Compress PDF', slug: 'pdf' },
              { name: 'Convert Image', slug: 'images' },
              { name: 'JSON Formatter', slug: 'dev' },
              { name: 'SHA256 Checksum', slug: 'security' },
              { name: 'JSON to CSV', slug: 'data' },
              { name: 'ZIP Extractor', slug: 'archives' },
              { name: 'QR Code Generator', slug: 'web' },
              { name: 'UUID Token Generator', slug: 'generators' }
            ].map(task => (
              <Link 
                key={task.name} 
                href={`/categories/${task.slug}`}
                className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-extrabold text-slate-700 hover:border-[#4F46E5] hover:text-[#4F46E5] hover:bg-[#EEF2FF]/50 hover:scale-[1.03] transition-all shadow-xs"
              >
                {task.name}
              </Link>
            ))}
          </div>
        </div>

        {/* COMPACT SQUARE GRID UTILITY DIRECTORY */}
        <div className="w-full mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] text-xs font-extrabold tracking-wide uppercase mb-3">
              <span>PLATFORM DIRECTORY</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight uppercase">
              Modular Tool Ecosystem
            </h2>
            <p className="text-slate-600 text-xs font-medium">
              Click any compact toolkit square to launch local browser-native software tools.
            </p>
          </div>

          {/* COMPACT 4-COLUMN SQUARE GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <Link 
                key={cat.slug} 
                href={`/categories/${cat.slug}`}
                className="smooth-card bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4F46E5] hover:shadow-lg hover:shadow-[#4F46E5]/10 hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] uppercase tracking-wider border border-indigo-100 truncate max-w-[110px]">
                      {cat.title}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {cat.toolCount} Tools
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#4F46E5] transition-colors leading-tight mb-2">
                    {cat.name}
                  </h3>

                  <p className="text-[11px] text-slate-500 line-clamp-3 leading-relaxed font-medium">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#4F46E5]">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* OPEN SOURCE CTA */}
        <div className="w-full max-w-4xl bg-[#0f172a] rounded-2xl p-10 lg:p-12 text-center text-white mb-12 shadow-2xl border border-slate-800 relative overflow-hidden">
           <h2 className="text-3xl font-extrabold text-white mb-3 tracking-tight uppercase">BUILT IN THE OPEN</h2>
           <p className="text-slate-300 text-sm mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
             BrandEX Utilities is designed as a clean open-source toolkit for everyday digital work.
           </p>
           <div className="flex flex-wrap justify-center gap-6 mb-8 text-xs font-semibold text-indigo-300">
             <span>✓ Open Source</span>
             <span>✓ Self-hostable</span>
             <span>✓ Community driven</span>
             <span>✓ Transparent</span>
           </div>
           <a 
             href="https://github.com/brandex" 
             target="_blank" 
             rel="noreferrer" 
             className="inline-flex items-center px-7 py-3.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-xs rounded-full transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
           >
             View on GitHub <ArrowRight className="w-4 h-4 ml-2" />
           </a>
        </div>

      </main>

      {/* INFINITE MARQUEE ANIMATION BANNER */}
      <MarqueeBanner />

      {/* Structured Footer matching exact visual reference */}
      <Footer />
    </div>
  );
}
