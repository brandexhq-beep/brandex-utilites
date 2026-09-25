import React, { useState } from 'react';
import Link from '@/components/Link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UniversalSearchModal from '@/components/UniversalSearchModal';
import { BookOpen, CheckCircle2, ShieldCheck, Zap, AlertTriangle } from 'lucide-react';

export default function GuidelinesPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col transition-colors selection:bg-[#EEF2FF] selection:text-[#4F46E5]">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} />
      <UniversalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="flex-1 w-full max-w-5xl mx-auto px-6 sm:px-10 py-10">
        
        {/* BREADCRUMB */}
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-6">
          <Link href="/" className="hover:text-[#4F46E5] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">Guidelines</span>
        </div>

        {/* HERO BANNER */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#0F172A] rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 mb-10 text-white shadow-xl relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#4F46E5]/20 border border-[#4F46E5]/40 text-indigo-300 text-[11px] sm:text-xs font-extrabold tracking-wide uppercase mb-4 max-w-full">
            <BookOpen className="w-4 h-4 mr-1 text-indigo-400 shrink-0" />
            <span className="truncate">PLATFORM GUIDELINES & BEST PRACTICES</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight break-words">
            Platform Guidelines & Performance Tips
          </h1>

          <p className="text-slate-300 text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed font-medium">
            Learn how to get maximum performance out of BrandEX local software utilities using your device memory.
          </p>
        </div>

        {/* GUIDELINES LIST */}
        <div className="space-y-8 text-slate-700 leading-relaxed text-sm font-medium mb-16">
          
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-3">
            <div className="flex items-center space-x-3 text-slate-900 font-extrabold text-lg">
              <Zap className="w-6 h-6 text-[#4F46E5]" />
              <h2>1. Hardware Memory Limits</h2>
            </div>
            <p>
              Since BrandEX Utilities processes 100% of tasks inside your browser, large files (such as 500MB+ PDFs or 4K videos) consume local system RAM. Ensure your browser tab has sufficient memory allocated for massive batch operations.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-3">
            <div className="flex items-center space-x-3 text-slate-900 font-extrabold text-lg">
              <ShieldCheck className="w-6 h-6 text-[#4F46E5]" />
              <h2>2. Offline Utility Operations</h2>
            </div>
            <p>
              You can bookmark BrandEX Utilities and run all text formatters, regex analyzers, QR generators, and password generators completely offline without an active internet connection.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-3">
            <div className="flex items-center space-x-3 text-slate-900 font-extrabold text-lg">
              <CheckCircle2 className="w-6 h-6 text-[#4F46E5]" />
              <h2>3. Exporting & Downloading Results</h2>
            </div>
            <p>
              When an operation completes, click the <strong>Download Real Result File</strong> button to save generated Blobs directly to your computer&apos;s Downloads folder.
            </p>
          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}
