import React, { useState } from 'react';
import Link from '@/components/Link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UniversalSearchModal from '@/components/UniversalSearchModal';
import { CATEGORIES } from '@/lib/categories';
import { 
  FileText, 
  Image as ImageIcon, 
  Code, 
  Database, 
  Lock, 
  Archive, 
  Globe, 
  Wand2, 
  ArrowRight,
  Search,
  ShieldCheck,
  X,
  QrCode,
  Mail,
  Sliders,
  Calendar,
  Calculator,
  Type,
  FolderSearch,
  Eye,
  Printer,
  CheckSquare
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-6 h-6" />,
  Image: <ImageIcon className="w-6 h-6" />,
  Code: <Code className="w-6 h-6" />,
  Database: <Database className="w-6 h-6" />,
  Lock: <Lock className="w-6 h-6" />,
  Archive: <Archive className="w-6 h-6" />,
  Globe: <Globe className="w-6 h-6" />,
  Wand2: <Wand2 className="w-6 h-6" />,
  QrCode: <QrCode className="w-6 h-6" />,
  Mail: <Mail className="w-6 h-6" />,
  Sliders: <Sliders className="w-6 h-6" />,
  Calendar: <Calendar className="w-6 h-6" />,
  Calculator: <Calculator className="w-6 h-6" />,
  Type: <Type className="w-6 h-6" />,
  FolderSearch: <FolderSearch className="w-6 h-6" />,
  Eye: <Eye className="w-6 h-6" />,
  Printer: <Printer className="w-6 h-6" />,
  CheckSquare: <CheckSquare className="w-6 h-6" />
};

export default function CategoriesPage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [filterQuery, setFilterQuery] = useState('');

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
    cat.description.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-bg-secondary text-text-primary font-sans flex flex-col transition-colors">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} currentPath="/categories" />
      <UniversalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      <main className="flex-1 w-full mx-auto px-6 sm:px-10 py-6">
        
        {/* BREADCRUMB */}
        <div className="flex items-center space-x-2 text-xs font-medium text-text-muted mb-6">
          <Link href="/" className="hover:text-brand-purple transition-colors">Home</Link>
          <span>/</span>
          <span className="text-brand-navy font-semibold">Categories</span>
        </div>

        {/* HERO BANNER SECTION */}
        <div className="bg-gradient-to-br from-white via-[#FAFAFF] to-[#EEF2FF]/70 border border-slate-200/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 mb-12 shadow-xl shadow-indigo-500/5 relative overflow-hidden">
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] text-xs font-extrabold tracking-wide uppercase mb-4 shadow-xs">
              <span>100% Free & Private</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 leading-[1.2] sm:leading-tight break-words">
              Explore All <span className="bg-gradient-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED] bg-clip-text text-transparent inline-block pt-0.5 pb-1.5">Tool Categories</span>
            </h1>
            
            <p className="text-sm sm:text-base lg:text-lg text-slate-600 font-medium mb-8 leading-relaxed">
              Explore specialized toolkits for document management, image conversion, security, data formatting, and developer workflows. Everything runs directly on your device.
            </p>

            {/* INTERACTIVE SEARCH BAR WITH FOCUS GLOW */}
            <div className="relative max-w-xl mb-5">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#4F46E5]" />
              <input 
                type="text" 
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                placeholder="Search categories (e.g., 'PDF', 'Images', 'Developer', 'Security')..." 
                className="w-full h-13 pl-12 pr-10 rounded-2xl border border-slate-200 bg-white text-slate-900 text-sm font-medium shadow-xs focus:outline-none focus:border-[#4F46E5] focus:ring-4 focus:ring-[#4F46E5]/10 transition-all placeholder:text-slate-400"
              />
              {filterQuery && (
                <button 
                  onClick={() => setFilterQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* QUICK FILTER TAG BUTTONS */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mr-1">Quick Filters:</span>
              {[
                { label: 'All', value: '' },
                { label: 'PDF', value: 'pdf' },
                { label: 'Images', value: 'image' },
                { label: 'Developer', value: 'dev' },
                { label: 'Security', value: 'security' },
                { label: 'Data', value: 'data' },
                { label: 'Web', value: 'web' },
                { label: 'Text', value: 'text' }
              ].map(tag => {
                const isActive = filterQuery.toLowerCase() === tag.value.toLowerCase();
                return (
                  <button
                    key={tag.label}
                    onClick={() => setFilterQuery(tag.value)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all border shadow-2xs ${
                      isActive 
                        ? 'bg-[#4F46E5] text-white border-[#4F46E5] shadow-indigo-500/20' 
                        : 'bg-white text-slate-700 border-slate-200 hover:border-[#4F46E5] hover:text-[#4F46E5]'
                    }`}
                  >
                    {tag.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* COMPACT BALANCED CATEGORIES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {filteredCategories.map(cat => (
            <Link 
              key={cat.slug} 
              href={`/categories/${cat.slug}`}
              className="smooth-card bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-[#4F46E5] hover:shadow-lg hover:shadow-[#4F46E5]/10 hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs transition-transform group-hover:scale-105 duration-200"
                    style={{ backgroundColor: cat.accentColor }}
                  >
                    {ICON_MAP[cat.iconName] || <FileText className="w-5 h-5" />}
                  </div>
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100">
                    {cat.toolCount} Tools
                  </span>
                </div>

                <h2 className="text-[10px] font-extrabold text-[#4F46E5] uppercase tracking-wider mb-1 truncate">
                  {cat.title}
                </h2>
                <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#4F46E5] transition-colors leading-tight mb-2">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium mb-4">
                  {cat.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-extrabold text-[#4F46E5] group-hover:translate-x-0.5 transition-transform">
                <span>Browse Tools</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>

        {/* SECURITY PROMISE BANNER */}
        <div className="bg-[#0f172a] rounded-2xl p-8 lg:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 mb-12 shadow-xl border border-slate-800">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center space-x-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Private & Secure</span>
            </div>
            <h3 className="text-2xl font-bold text-white">Files Never Leave Your Device</h3>
            <p className="text-indigo-200 text-sm max-w-xl">
              BrandEX Utilities processes conversions, encryption, formatting, and file extractions directly inside your browser — zero files are ever sent to servers.
            </p>
          </div>
          <Link 
            href="/categories/security"
            className="px-6 py-3 rounded-xl bg-white text-brand-navy font-bold text-sm hover:bg-indigo-50 transition-colors shrink-0 shadow-sm"
          >
            Explore Security Tools
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
