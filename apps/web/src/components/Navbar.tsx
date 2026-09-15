import React, { useState, useEffect } from 'react';
import Link from './Link';
import { Search, ArrowRight, ExternalLink } from 'lucide-react';
import BrandexLogo from './BrandexLogo';

interface NavbarProps {
  onOpenSearch?: () => void;
  currentPath?: string;
}

export default function Navbar({ onOpenSearch, currentPath }: NavbarProps) {
  const [pathname, setPathname] = useState(currentPath || '');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: 'PDF Tools', href: '/categories/pdf' },
    { label: 'Image Tools', href: '/categories/images' },
    { label: 'Developer', href: '/categories/dev' },
    { label: 'Security', href: '/categories/security' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full h-16 min-h-16 max-h-16 bg-white border-b border-slate-200 shadow-xs shrink-0 flex items-center box-border">
      <div className="w-full h-full px-6 sm:px-10 flex items-center justify-between box-border">
        
        {/* LOGO & AGENCY TRUST BADGE */}
        <div className="flex items-center space-x-3 shrink-0">
          <Link href="/" className="flex items-center group">
            <BrandexLogo size="md" />
          </Link>
          <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
            100% Free & Private
          </span>
        </div>

        {/* NAVIGATION LINKS WITH BOTTOM BORDER INDICATOR */}
        <nav className="hidden xl:flex items-center space-x-6 text-xs font-semibold text-slate-600 h-full shrink">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`h-full inline-flex items-center border-b-2 transition-colors shrink-0 whitespace-nowrap ${
                  isActive 
                    ? 'border-[#4F46E5] text-[#4F46E5] font-bold' 
                    : 'border-transparent text-slate-600 hover:text-[#4F46E5]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* RIGHT SIDE ACTIONS MATCHING REFERENCE SCREENSHOT */}
        <div className="flex items-center space-x-4">
          <button 
            onClick={onOpenSearch}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-[#4F46E5] transition-all text-xs font-medium"
            title="Search utilities (⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search...</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* AGENCY EXTERNAL LINK */}
          <a
            href="https://brandex.co.in"
            target="_blank"
            rel="noreferrer"
            className="hidden lg:inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-[#4F46E5] text-slate-700 hover:text-[#4F46E5] text-xs font-bold transition-all shadow-2xs hover:scale-[1.02]"
            title="BrandEX Digital Agency — Websites & Custom Software"
          >
            <span>Agency</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* PURPLE PILL BUTTON MATCHING SCREENSHOT */}
          <Link
            href="/categories"
            className="hidden sm:inline-flex items-center space-x-1.5 px-5 py-2 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition-all shadow-sm"
          >
            <span>Explore Platform</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
