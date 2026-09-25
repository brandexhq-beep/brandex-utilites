import React, { useState, useEffect } from 'react';
import Link from './Link';
import { Search, X, ArrowRight } from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UniversalSearchModal({ isOpen, onClose }: UniversalSearchModalProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const allTools = CATEGORIES.flatMap(cat => 
    cat.featuredTools.map(tool => ({ ...tool, categorySlug: cat.slug, categoryName: cat.name }))
  );

  const filteredTools = query.trim() === '' 
    ? allTools.slice(0, 6) 
    : allTools.filter(t => 
        t.name.toLowerCase().includes(query.toLowerCase()) || 
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.categoryName.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[max(1rem,env(safe-area-inset-top,1rem))] sm:pt-20 px-3 sm:px-4 pb-[max(1rem,env(safe-area-inset-bottom,1rem))] bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="fixed inset-0" 
        onClick={onClose} 
        aria-hidden="true" 
      />

      <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200 my-auto sm:my-0 z-10">
        
        {/* SEARCH BAR INPUT */}
        <div className="p-3.5 sm:p-4 border-b border-slate-200 flex items-center space-x-3 bg-white">
          <Search className="w-5 h-5 text-[#4F46E5] shrink-0" />
          <input 
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools (e.g., 'Compress PDF', 'JSON', 'Resize Image')..."
            className="w-full bg-transparent text-slate-900 text-sm sm:text-base placeholder:text-slate-400 focus:outline-none font-medium h-10"
            autoFocus
          />
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center shrink-0"
            aria-label="Close search modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* RESULTS LIST WITH HOVER ANIMATIONS */}
        <div className="p-3 sm:p-4 max-h-[50dvh] sm:max-h-[420px] overflow-y-auto space-y-2">
          {filteredTools.length > 0 ? (
            filteredTools.map(tool => {
              const toolHref = tool.id.startsWith('qr-') 
                ? '/tools/qr-studio' 
                : `/tools/${tool.id}`;
              return (
                <Link
                  key={tool.id}
                  href={toolHref}
                  onClick={onClose}
                  className="p-3 sm:p-3.5 rounded-xl border border-slate-100 hover:border-[#4F46E5]/30 hover:bg-[#EEF2FF]/40 transition-all flex items-center justify-between group min-w-0"
                >
                  <div className="min-w-0 flex-1 pr-2">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5">
                      <span className="font-extrabold text-slate-900 text-xs sm:text-sm group-hover:text-[#4F46E5] transition-colors truncate">
                        {tool.name}
                      </span>
                      <span className="text-[9px] sm:text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100 shrink-0">
                        {tool.categoryName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#4F46E5] group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              );
            })
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              No tools found matching &quot;{query}&quot;. Try searching for PDF, Image, JSON, or Hash.
            </div>
          )}
        </div>

        {/* FOOTER TIP */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 px-4">
          <span className="text-[11px] truncate pr-2">100% Private — runs in browser</span>
          <span className="font-mono text-[10px] sm:text-[11px] bg-white px-2 py-0.5 rounded border border-slate-200 shrink-0">ESC to close</span>
        </div>

      </div>
    </div>
  );
}
