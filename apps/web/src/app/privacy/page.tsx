"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UniversalSearchModal from '@/components/UniversalSearchModal';
import { ShieldCheck, Lock, EyeOff, ServerOff, Cpu, FileCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
          <span className="text-slate-900 font-semibold">Privacy Policy</span>
        </div>

        {/* HERO BANNER */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-[#0F172A] rounded-3xl p-8 lg:p-12 mb-10 text-white shadow-xl relative overflow-hidden">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold tracking-wide uppercase mb-4">
            <ShieldCheck className="w-4 h-4 mr-1 text-emerald-400" />
            <span>100% LOCAL-FIRST GUARANTEE</span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4 leading-tight">
            Privacy Policy & Zero-Knowledge Architecture
          </h1>

          <p className="text-slate-300 text-base lg:text-lg max-w-3xl leading-relaxed font-medium">
            At BrandEX Utilities, privacy is not a setting—it is the foundation of our local-first software architecture. Your files, documents, images, and text payloads never touch BrandEX servers.
          </p>
        </div>

        {/* POLICY CONTENT SECTIONS */}
        <div className="space-y-10 text-slate-700 leading-relaxed text-sm font-medium mb-16">
          
          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-3">
            <div className="flex items-center space-x-3 text-slate-900 font-extrabold text-lg mb-2">
              <ServerOff className="w-6 h-6 text-[#4F46E5]" />
              <h2>1. Zero Server Uploads Policy</h2>
            </div>
            <p>
              When you use any utility on BrandEX Utilities (including PDF processing, image compression, developer formatters, cryptography generators, QR generators, and file inspectors), processing occurs <strong>100% locally inside your web browser memory</strong> using WebAssembly (WASM), HTML5 Canvas, and WebCrypto APIs.
            </p>
            <p>
              No document text, images, PDF pages, secret keys, or uploaded files are transmitted to or stored on BrandEX servers or third-party cloud infrastructure.
            </p>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-3">
            <div className="flex items-center space-x-3 text-slate-900 font-extrabold text-lg mb-2">
              <EyeOff className="w-6 h-6 text-[#4F46E5]" />
              <h2>2. No Tracking Telemetry or Analytics</h2>
            </div>
            <p>
              BrandEX Utilities does not employ third-party analytics trackers, session replay recorders, or privacy-invasive advertising SDKs. We do not track individual user behavior, file contents, or text payloads.
            </p>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-3">
            <div className="flex items-center space-x-3 text-slate-900 font-extrabold text-lg mb-2">
              <Cpu className="w-6 h-6 text-[#4F46E5]" />
              <h2>3. Browser Memory & Local Storage Usage</h2>
            </div>
            <p>
              Temporary file blobs and calculation outputs exist only within transient browser memory (`Blob` objects and `URL.createObjectURL`). Closing your browser window or resetting the utility immediately purges all active processing state.
            </p>
          </section>

          <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6 lg:p-8 space-y-3">
            <div className="flex items-center space-x-3 text-slate-900 font-extrabold text-lg mb-2">
              <FileCheck className="w-6 h-6 text-[#4F46E5]" />
              <h2>4. Contact & Entity Information</h2>
            </div>
            <p>
              BrandEX Utilities is a product of <strong>Brandex</strong>. For privacy inquiries or developer questions regarding our local architecture, reach out directly at:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-800 font-semibold">
              <li>Official Portal: <a href="https://www.brandex.co.in" target="_blank" rel="noreferrer" className="text-[#4F46E5] underline">www.brandex.co.in</a></li>
              <li>Support Email: brandexhq@gmail.com</li>
              <li>Entity GST Registration: 29OGNPS8060K175</li>
            </ul>
          </section>

        </div>

      </main>

      <Footer />
    </div>
  );
}
