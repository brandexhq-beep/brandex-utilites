import React, { useState, useEffect } from 'react';
import Link from '@/components/Link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import UniversalSearchModal from '@/components/UniversalSearchModal';
import Toast from '@/components/Toast';
import ToolRunnerModal from '@/components/tool-runner/ToolRunnerModal';
import { getCategoryBySlug, UtilityItem } from '@/lib/categories';
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
  ShieldCheck,
  Zap,
  CheckCircle2,
  QrCode,
  Mail,
  Calendar,
  Calculator,
  Type,
  FolderSearch,
  Eye,
  Printer,
  CheckSquare,
  Sliders
} from 'lucide-react';

const ICON_MAP: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-8 h-8 text-[#4F46E5]" />,
  Image: <ImageIcon className="w-8 h-8 text-[#4F46E5]" />,
  Code: <Code className="w-8 h-8 text-[#4F46E5]" />,
  Database: <Database className="w-8 h-8 text-[#4F46E5]" />,
  Lock: <Lock className="w-8 h-8 text-[#4F46E5]" />,
  Archive: <Archive className="w-8 h-8 text-[#4F46E5]" />,
  Globe: <Globe className="w-8 h-8 text-[#4F46E5]" />,
  Wand2: <Wand2 className="w-8 h-8 text-[#4F46E5]" />,
  QrCode: <QrCode className="w-8 h-8 text-[#4F46E5]" />,
  Mail: <Mail className="w-8 h-8 text-[#4F46E5]" />,
  Sliders: <Sliders className="w-8 h-8 text-[#4F46E5]" />,
  Calendar: <Calendar className="w-8 h-8 text-[#4F46E5]" />,
  Calculator: <Calculator className="w-8 h-8 text-[#4F46E5]" />,
  Type: <Type className="w-8 h-8 text-[#4F46E5]" />,
  FolderSearch: <FolderSearch className="w-8 h-8 text-[#4F46E5]" />,
  Eye: <Eye className="w-8 h-8 text-[#4F46E5]" />,
  Printer: <Printer className="w-8 h-8 text-[#4F46E5]" />,
  CheckSquare: <CheckSquare className="w-8 h-8 text-[#4F46E5]" />
};

interface CategoryDetailPageProps {
  slug?: string;
}

export default function CategoryDetailPage({ slug: propSlug }: CategoryDetailPageProps) {
  const [slug, setSlug] = useState(propSlug || '');
  
  useEffect(() => {
    if (!slug && typeof window !== 'undefined') {
      const parts = window.location.pathname.split('/').filter(Boolean);
      const last = parts[parts.length - 1];
      if (last && last !== 'categories') setSlug(last);
    }
  }, [slug]);

  const category = getCategoryBySlug(slug);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<UtilityItem | null>(null);

  // Sync tool from URL deep-link
  useEffect(() => {
    if (category && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const toolId = urlParams.get('tool');
      if (toolId) {
        const found = category.featuredTools.find(t => t.id === toolId);
        if (found) {
          setActiveTool(found);
        }
      }
    }
  }, [category]);

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const showToastNotification = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
  };

  const openToolModal = (tool: UtilityItem) => {
    setActiveTool(tool);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('tool', tool.id);
      window.history.replaceState(null, '', url.toString());
    }
  };

  const closeToolModal = () => {
    setActiveTool(null);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.delete('tool');
      window.history.replaceState(null, '', url.toString());
    }
  };

  if (!category) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between">
        <Navbar />
        <div className="max-w-lg mx-auto py-24 text-center px-6">
          <h1 className="text-3xl font-extrabold text-[#0f172a] mb-4">Category Not Found</h1>
          <p className="text-slate-600 mb-6">The tool category you are looking for does not exist.</p>
          <Link href="/categories" className="px-6 py-3 rounded-full bg-[#4F46E5] text-white font-bold text-sm">
            View All Categories
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans flex flex-col transition-colors selection:bg-[#EEF2FF] selection:text-[#4F46E5]">
      <Navbar onOpenSearch={() => setIsSearchOpen(true)} currentPath={`/categories/${slug}`} />
      <UniversalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* FLOATING TOAST NOTIFICATION DOCKED IN BOTTOM-RIGHT */}
      <Toast 
        message={toastMessage} 
        isVisible={showToast} 
        onClose={() => setShowToast(false)} 
      />

      <main className="flex-1 w-full mx-auto px-6 sm:px-10 py-6">
        
        {/* BREADCRUMB */}
        <div className="flex items-center space-x-2 text-xs font-medium text-slate-400 mb-8">
          <Link href="/" className="hover:text-[#4F46E5] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/categories" className="hover:text-[#4F46E5] transition-colors">Categories</Link>
          <span>/</span>
          <span className="text-slate-900 font-semibold">{category.name}</span>
        </div>

        {/* CATEGORY HEADER BANNER */}
        <div className="bg-white border border-slate-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 mb-12 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#EEF2FF] border border-indigo-100 flex items-center justify-center text-[#4F46E5] shadow-xs shrink-0">
                  {ICON_MAP[category.iconName] || <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-[#4F46E5]" />}
                </div>
                <div>
                  <span className="text-xs font-extrabold text-[#4F46E5] uppercase tracking-wider">
                    {category.title}
                  </span>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight break-words">
                    {category.name}
                  </h1>
                </div>
              </div>
              
              <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed font-medium">
                {category.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Runs 100% on your device</span>
                </div>
                <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100 text-xs font-semibold">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{category.toolCount} Tools Available</span>
                </div>
              </div>
            </div>

            {/* PRIVACY & SPEED HIGHLIGHTS */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 md:w-80 shrink-0 space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Why BrandEX?
              </h3>
              <ul className="space-y-2 text-xs text-slate-600 font-medium">
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                  100% Private (Runs on your device)
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                  Zero server file uploads
                </li>
                <li className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-2 shrink-0" />
                  Fast & free forever
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* UTILITY TOOLS LIST */}
        <div className="mb-16">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {category.name} Tools
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any tool below to launch and run directly on your device.
              </p>
            </div>
            <span className="text-xs font-bold text-[#4F46E5] bg-[#EEF2FF] px-3.5 py-1 rounded-full border border-indigo-100 self-start sm:self-auto">
              {category.toolCount} tools available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.featuredTools.map(tool => (
              <div 
                key={tool.id}
                className="smooth-card bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:border-[#4F46E5]/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-extrabold text-slate-900 text-base">
                      {tool.name}
                    </h3>
                    {tool.badge && (
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100">
                        {tool.badge.replace(/\s*ENGINE$/i, '')}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-4 font-medium">
                    {tool.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-1.5 mb-6">
                    <span className="text-[10px] text-slate-400 uppercase font-extrabold mr-1">Formats:</span>
                    {tool.inputFormats.map(fmt => (
                      <span key={fmt} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-700 font-bold">
                        {fmt}
                      </span>
                    ))}
                    <span className="text-[10px] text-slate-400 font-extrabold mx-1">→</span>
                    {tool.outputFormats.map(fmt => (
                      <span key={fmt} className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#EEF2FF] border border-indigo-100 text-[#4F46E5] font-extrabold">
                        {fmt}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-600 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                    Runs on device
                  </span>
                  
                  {tool.id.startsWith('qr-') ? (
                    <Link
                      href="/tools/qr-studio"
                      className="px-4 py-2 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all text-xs font-bold flex items-center shadow-xs hover:scale-[1.02]"
                    >
                      Open QR Studio
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  ) : (
                    <Link 
                      href={`/tools/${tool.id}`}
                      className="px-4 py-2 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white transition-all text-xs font-bold flex items-center shadow-xs hover:scale-[1.02]"
                    >
                      Open Tool
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* MODULAR TOOL RUNNER MODAL */}
      {activeTool && (
        <ToolRunnerModal 
          tool={activeTool}
          category={category}
          onClose={closeToolModal}
          onToast={showToastNotification}
        />
      )}

      <Footer />
    </div>
  );
}
