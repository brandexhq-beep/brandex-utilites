import React, { useState } from 'react';
import Link from '@/components/Link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UniversalSearchModal from '@/components/UniversalSearchModal';
import MarqueeBanner from '@/components/MarqueeBanner';
import { CATEGORIES } from '@/lib/categories';
import { 
  Search, 
  ArrowRight,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Zap,
  Lock
} from 'lucide-react';

const FEATURED_HERO_TOOLS = [
  {
    emoji: '📄',
    title: 'Compress PDF',
    description: 'Reduce PDF file size while keeping text and images sharp.',
    badge: 'Popular',
    href: '/tools/pdf-compress'
  },
  {
    emoji: '🖼️',
    title: 'Compress Image',
    description: 'Shrink PNG, JPG, and WebP images up to 80% without quality loss.',
    badge: 'Essential',
    href: '/tools/img-compress'
  },
  {
    emoji: '🔄',
    title: 'Convert Image',
    description: 'Instantly convert between PNG, JPG, WebP, GIF, and ICO formats.',
    badge: 'Fast',
    href: '/tools/img-convert'
  },
  {
    emoji: '📑',
    title: 'Merge PDFs',
    description: 'Combine multiple PDF documents into a single organized file.',
    badge: 'Popular',
    href: '/tools/pdf-merge'
  },
  {
    emoji: '⚙️',
    title: 'JSON Formatter',
    description: 'Validate, format, and beautify messy JSON data with one click.',
    badge: 'Developer',
    href: '/tools/json-formatter'
  },
  {
    emoji: '📊',
    title: 'CSV to JSON',
    description: 'Convert spreadsheet CSV data into clean, structured JSON.',
    badge: 'Data',
    href: '/tools/csv-to-json'
  },
  {
    emoji: '🔑',
    title: 'JWT Decoder',
    description: 'Safely inspect and decode JSON Web Tokens directly in browser.',
    badge: 'Security',
    href: '/tools/jwt-debugger'
  },
  {
    emoji: '📱',
    title: 'QR Code Studio',
    description: 'Create custom branded QR codes with colors, frames, and logos.',
    badge: 'Studio',
    href: '/tools/qr-studio'
  }
];

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col transition-colors selection:bg-[#EEF2FF] selection:text-[#4F46E5]">
      
      {/* NAVBAR */}
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} currentPath="/" />
      
      {/* UNIVERSAL SEARCH MODAL */}
      <UniversalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="flex-1 w-full px-6 sm:px-10 py-8 flex flex-col items-center">
        
        {/* HERO HEADER */}
        <div className="text-center w-full max-w-4xl mb-8 pt-2 sm:pt-4">
          
          {/* TRUST PILL */}
          <div className="inline-flex items-center space-x-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] text-[11px] sm:text-xs font-bold tracking-wide uppercase mb-4 sm:mb-5 shadow-2xs max-w-full text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-[#4F46E5] shrink-0" />
            <span className="truncate sm:whitespace-normal">100% In-Browser & Private • Zero Server Uploads</span>
          </div>

          {/* HEADLINE WITH UNCLIPPED GRADIENT AND RESPONSIVE LINE HEIGHT */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.2] sm:leading-[1.18] mb-4 max-w-3xl mx-auto break-words">
            <span className="block">Fast, Free Utilities for</span>
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] bg-clip-text text-transparent block mt-1 pt-1 pb-2">
              Everyday Digital Work
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 font-normal max-w-2xl mx-auto mb-8 leading-relaxed px-2 sm:px-0">
            Compress files, convert formats, format code, and generate QR codes right in your browser. Fast, private, and always free.
          </p>

          {/* PROMINENT SEARCH BAR */}
          <div className="w-full max-w-2xl mx-auto mb-6">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full bg-white border border-slate-300 hover:border-[#4F46E5] rounded-2xl p-3.5 sm:p-4.5 shadow-sm hover:shadow-md transition-all flex items-center justify-between text-left group min-h-[52px]"
            >
              <div className="flex items-center space-x-3.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-[#4F46E5] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                  <Search className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-slate-800 block">Search any tool...</span>
                  <span className="text-xs text-slate-400 block truncate">Compress PDF, Convert image, Format JSON, Decode JWT, QR Studio</span>
                </div>
              </div>
              <kbd className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono text-slate-500 font-bold shrink-0 ml-2">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* QUICK TAGS */}
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium mr-1">Popular:</span>
            {[
              { name: 'Compress PDF', href: '/tools/pdf-compress' },
              { name: 'Convert Image', href: '/tools/img-convert' },
              { name: 'JSON Formatter', href: '/tools/json-formatter' },
              { name: 'CSV to JSON', href: '/tools/csv-to-json' },
              { name: 'QR Studio', href: '/tools/qr-studio' },
              { name: 'JWT Decoder', href: '/tools/jwt-debugger' }
            ].map(tag => (
              <Link
                key={tag.name}
                href={tag.href}
                className="px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#EEF2FF] text-slate-600 hover:text-[#4F46E5] font-semibold transition-all border border-slate-200 hover:border-indigo-200 min-h-[32px] inline-flex items-center"
              >
                {tag.name}
              </Link>
            ))}
          </div>
        </div>

        {/* FEATURED DAILY TOOLS GRID */}
        <div className="w-full max-w-5xl mb-20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Featured Tools
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Our most used utilities. Click any tool to run it instantly in your browser.
              </p>
            </div>
            <Link 
              href="/categories" 
              className="text-xs font-extrabold text-[#4F46E5] hover:underline flex items-center space-x-1 shrink-0"
            >
              <span>View all categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_HERO_TOOLS.map(tool => (
              <Link
                key={tool.title}
                href={tool.href}
                className="bg-white border border-slate-200 hover:border-[#4F46E5] rounded-2xl p-5 shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl">{tool.emoji}</span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#4F46E5] transition-colors mb-1.5">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed font-normal">
                    {tool.description}
                  </p>
                </div>
                <div className="pt-3 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#4F46E5]">
                  <span>Launch Tool</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* ALL CATEGORIES DIRECTORY */}
        <div className="w-full max-w-5xl mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
              Browse by Category
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm font-normal">
              Find exactly what you need across our organized tool suites.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {CATEGORIES.map(cat => (
              <Link 
                key={cat.slug} 
                href={`/categories/${cat.slug}`}
                className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4F46E5] hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] uppercase tracking-wider border border-indigo-100 truncate max-w-[120px]">
                      {cat.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {cat.toolCount} tools
                    </span>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#4F46E5] transition-colors leading-tight mb-1.5">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#4F46E5]">
                  <span>Explore tools</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* BRANDEX DIGITAL AGENCY SHOWCASE BANNER */}
        <div className="w-full max-w-5xl mb-20 bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-8 sm:p-12 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wide">
                <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
                <span>Crafted by BrandEX Digital Agency</span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Empowering Businesses With Custom Software & High-Performance Websites
              </h2>

              <p className="text-slate-300 text-sm leading-relaxed font-normal">
                BrandEX Utilities is built for the community with 100% in-browser privacy and zero file uploads. Beyond free utilities, BrandEX partners with ambitious companies to build bespoke web applications, enterprise software, and automated workflows.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span>Custom Web Apps</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span>Modern Websites</span>
                </div>
                <div className="flex items-center space-x-2 text-xs font-medium text-slate-300">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                  <span>Workflow Automation</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col justify-between space-y-5">
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-indigo-300 tracking-wider">Custom Software & Websites</span>
                <h3 className="text-base sm:text-lg font-bold text-white">Have a Project or Workflow in Mind?</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Whether you need custom company tools, automated business systems, or a modern digital flagship for your brand, our team is ready to help.
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <a
                  href="https://brandex.co.in"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-extrabold transition-all flex items-center justify-center space-x-2 shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Talk to BrandEX Agency</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://github.com/brandex"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-5 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 text-xs font-semibold transition-all flex items-center justify-center space-x-2 border border-white/10"
                >
                  <span>View Community Tools on GitHub</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* MARQUEE BANNER */}
      <MarqueeBanner />

      {/* FOOTER */}
      <Footer />
    </div>
  );
}
