import React, { useState, useEffect } from 'react';
import Link from './Link';
import { Search, ArrowRight, ExternalLink, Menu, X, ShieldCheck } from 'lucide-react';
import BrandexLogo from './BrandexLogo';

interface NavbarProps {
  onOpenSearch?: () => void;
  currentPath?: string;
}

export default function Navbar({ onOpenSearch, currentPath }: NavbarProps) {
  const [pathname, setPathname] = useState(currentPath || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
    }
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isMobileMenuOpen) {
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
  }, [isMobileMenuOpen]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Categories', href: '/categories' },
    { label: 'PDF Tools', href: '/categories/pdf' },
    { label: 'Image Tools', href: '/categories/images' },
    { label: 'Developer', href: '/categories/dev' },
    { label: 'Security', href: '/categories/security' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-16 min-h-16 max-h-16 bg-white border-b border-slate-200 shadow-xs shrink-0 flex items-center box-border pt-[env(safe-area-inset-top,0px)]">
        <div className="w-full h-full px-4 sm:px-8 lg:px-10 flex items-center justify-between box-border">
          
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

          {/* DESKTOP NAVIGATION LINKS WITH BOTTOM BORDER INDICATOR */}
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

          {/* RIGHT SIDE ACTIONS */}
          <div className="flex items-center space-x-2.5 sm:space-x-4">
            <button 
              onClick={onOpenSearch}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:border-[#4F46E5] transition-all text-xs font-medium min-h-[38px]"
              title="Search utilities (⌘K)"
              aria-label="Search utilities"
            >
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 rounded border border-slate-200 bg-white text-[10px] font-mono text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* AGENCY EXTERNAL LINK (DESKTOP) */}
            <a
              href="https://brandex.co.in"
              target="_blank"
              rel="noreferrer"
              className="hidden lg:inline-flex items-center space-x-1 px-3.5 py-1.5 rounded-full border border-slate-200 hover:border-[#4F46E5] text-slate-700 hover:text-[#4F46E5] text-xs font-bold transition-all shadow-2xs hover:scale-[1.02] min-h-[38px]"
              title="BrandEX Digital Agency — Websites & Custom Software"
            >
              <span>Agency</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* PURPLE PILL BUTTON (TABLET & DESKTOP) */}
            <Link
              href="/categories"
              className="hidden sm:inline-flex items-center space-x-1.5 px-4 sm:px-5 py-2 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-bold transition-all shadow-sm min-h-[38px]"
            >
              <span>Explore Platform</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            {/* MOBILE MENU TOGGLE BUTTON (VISIBLE ON MOBILE & TABLET < XL) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:text-[#4F46E5] hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-[#4F46E5]/20 min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-800" />
              ) : (
                <Menu className="w-5 h-5 text-slate-800" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION DRAWER & BACKDROP */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 xl:hidden flex flex-col">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full bg-white border-b border-slate-200 shadow-2xl flex flex-col max-h-[85dvh] overflow-y-auto pt-[env(safe-area-inset-top,0px)] pb-[max(1.5rem,env(safe-area-inset-bottom,1.5rem))]">
            
            {/* Drawer Header */}
            <div className="h-16 px-4 sm:px-8 flex items-center justify-between border-b border-slate-100">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <BrandexLogo size="md" />
              </Link>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Search Shortcut in Drawer */}
            <div className="p-4 sm:px-8 border-b border-slate-100 bg-slate-50/60">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  if (onOpenSearch) onOpenSearch();
                }}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-500 text-xs font-medium shadow-2xs text-left"
              >
                <div className="flex items-center space-x-2.5">
                  <Search className="w-4 h-4 text-[#4F46E5]" />
                  <span>Search across all 214+ tools...</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-100 text-[10px] font-mono text-slate-400 font-bold">
                  Search
                </span>
              </button>
            </div>

            {/* Navigation Links List */}
            <nav className="p-4 sm:px-8 space-y-1">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-3 py-1">
                Navigation
              </div>

              {[
                { label: 'Home', href: '/' },
                { label: 'All Categories (214 Tools)', href: '/categories', badge: '18 Suites' },
                { label: 'PDF & Documents', href: '/categories/pdf' },
                { label: 'Image Processing', href: '/categories/images' },
                { label: 'Developer & Code Tools', href: '/categories/dev' },
                { label: 'Security & Cryptography', href: '/categories/security' },
                { label: 'QR Studio', href: '/tools/qr-studio', badge: 'Studio' },
              ].map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold transition-colors ${
                      isActive 
                        ? 'bg-[#EEF2FF] text-[#4F46E5]' 
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EEF2FF] text-[#4F46E5] border border-indigo-100">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Agency Link & Explore CTA */}
            <div className="p-4 sm:px-8 border-t border-slate-100 space-y-3">
              <a
                href="https://brandex.co.in"
                target="_blank"
                rel="noreferrer"
                className="w-full flex items-center justify-between p-3.5 rounded-xl border border-indigo-100 bg-[#EEF2FF]/60 hover:bg-[#EEF2FF] text-[#4F46E5] text-xs font-bold transition-colors"
              >
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#4F46E5]" />
                  <span>BrandEX Digital Agency (Bangalore)</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-[#4F46E5]" />
              </a>

              <Link
                href="/categories"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-[#4F46E5] text-white text-xs font-extrabold hover:bg-[#4338CA] transition-colors shadow-sm"
              >
                <span>Browse All 214+ Tools</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
