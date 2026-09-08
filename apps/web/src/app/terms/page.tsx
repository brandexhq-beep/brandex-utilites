"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UniversalSearchModal from '@/components/UniversalSearchModal';
import { FileText, ShieldCheck, CheckCircle2, Scale } from 'lucide-react';

export default function TermsPage() {
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
          <span className="text-slate-900 font-semibold">Terms of Service</span>
        </div>

        {/* HERO BANNER */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#0F172A] rounded-3xl p-8 lg:p-12 mb-10 text-white shadow-xl relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-extrabold tracking-wide uppercase mb-4">
            <Scale className="w-4 h-4 mr-1 text-indigo-400" />
            <span>PLATFORM TERMS & USAGE AGREEMENT</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Terms of Service & Usage Guidelines
          </h1>

          <p className="text-slate-300 text-base lg:text-lg max-w-3xl leading-relaxed font-medium">
            BrandEX Utilities provides high-performance, browser-native tools with zero subscription fees, zero usage limits, and zero mandatory cloud accounts.
          </p>
        </div>

        {/* POLICY CONTENT SECTIONS */}
        <div className="space-y-10 text-slate-700 leading-relaxed text-sm font-medium mb-16">
          
          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-3">
            <h2 className="text-slate-900 font-extrabold text-lg mb-2">1. Local Processing & Unlimited Usage</h2>
            <p>
              All software utilities provided on BrandEX Utilities execute locally within your device browser. Users are granted unlimited personal and commercial usage without artificial quotas or rate limits imposed by BrandEX.
            </p>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-3">
            <h2 className="text-slate-900 font-extrabold text-lg mb-2">2. Data Ownership & Responsibility</h2>
            <p>
              Since files are processed completely on your local device and never uploaded to our servers, you retain 100% full ownership and sole responsibility for your files and documents.
            </p>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-3">
            <h2 className="text-slate-900 font-extrabold text-lg mb-2">3. Disclaimer of Warranty</h2>
            <p>
              BrandEX Utilities is provided "as is" without warranty of any kind. While all tools undergo rigorous deterministic testing, users are encouraged to maintain backup copies of critical files before running destructive operations like page splitting or formatting.
            </p>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-3">
            <h2 className="text-slate-900 font-extrabold text-lg mb-2">4. Official Company Contact</h2>
            <p>
              For commercial licensing or platform inquiries:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-800 font-semibold">
              <li>Official Portal: <a href="https://www.brandex.co.in" target="_blank" rel="noreferrer" className="text-[#4F46E5] underline">www.brandex.co.in</a></li>
              <li>GST Entity ID: 29OGNPS8060K175</li>
              <li>Address: #121, 13th main Binny layout Vijaynagar Bangalore-560040</li>
            </ul>
          </section>

        </div>

      </main>

      <Footer />
    </div>
  );
}
