import React from 'react';
import Link from './Link';
import BrandexLogo from './BrandexLogo';
import { 
  MapPin, 
  Mail, 
  Phone, 
  ExternalLink, 
  ShieldCheck
} from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0b1426] text-slate-300 pt-12 pb-8 px-6 sm:px-10 font-sans border-t border-slate-800">
      <div className="w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* LEFT BRAND COLUMN */}
          <div className="lg:col-span-4 space-y-6">
            <a href="https://www.brandex.co.in" target="_blank" rel="noreferrer" className="inline-block hover:opacity-90 transition-opacity">
              <BrandexLogo size="md" variant="dark" />
            </a>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-medium">
              BrandEX Utilities is a production-grade, local-first utility platform. Process PDF documents, convert image formats, validate schemas, and generate cryptographic keys 100% inside your browser memory with zero server file uploads.
            </p>

            {/* SOCIAL ICONS ROW */}
            <div className="flex items-center space-x-2.5 pt-1">
              {[
                { label: 'GitHub', icon: 'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z' },
                { label: 'X', icon: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
                { label: 'LinkedIn', icon: 'M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.78a1.62 1.62 0 1 0 0 3.24 1.62 1.62 0 0 0 0-3.24z' },
                { label: 'Instagram', icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z' }
              ].map((soc) => (
                <a 
                  key={soc.label} 
                  href="https://www.brandex.co.in" 
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-600 transition-colors"
                  aria-label={soc.label}
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d={soc.icon} />
                  </svg>
                </a>
              ))}
            </div>

            {/* BUTTON LINK TO OFFICIAL PORTAL */}
            <div className="pt-2">
              <a 
                href="https://www.brandex.co.in" 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-900/90 text-xs font-semibold text-slate-200 hover:text-white hover:border-slate-700 transition-all shadow-sm group"
              >
                <span>Visit Official Brandex Portal (brandex.co.in)</span>
                <ExternalLink className="w-3.5 h-3.5 ml-2 text-slate-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* MIDDLE SECTION: PLATFORM DIRECTORY (ACCURATE TOOLKIT CATEGORIES) */}
          <div className="lg:col-span-5 space-y-4">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">
              UTILITY PLATFORM DIRECTORY
            </h4>

            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 text-xs">
              {/* SUB-COLUMN 1 */}
              <ul className="space-y-2.5 text-slate-400">
                <li><Link href="/categories/pdf" className="hover:text-white transition-colors">PDF & Document Suite</Link></li>
                <li><Link href="/categories/images" className="hover:text-white transition-colors">Image Converter & Compressor</Link></li>
                <li><Link href="/categories/dev" className="hover:text-white transition-colors">Developer Formatters & Diff</Link></li>
                <li><Link href="/categories/data" className="hover:text-white transition-colors">Data & CSV Converters</Link></li>
                <li><Link href="/categories" className="hover:text-white transition-colors">Universal Tools Directory</Link></li>
              </ul>

              {/* SUB-COLUMN 2 */}
              <ul className="space-y-2.5 text-slate-400">
                <li><Link href="/categories/security" className="hover:text-white transition-colors">Security & Checksum Hashing</Link></li>
                <li><Link href="/categories/archives" className="hover:text-white transition-colors">ZIP Archive Manager</Link></li>
                <li><Link href="/categories/web" className="hover:text-white transition-colors">Web & QR Generators</Link></li>
                <li><Link href="/categories/generators" className="hover:text-white transition-colors">UUID & Token Generators</Link></li>
                <li><a href="https://www.brandex.co.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">About BrandEX Platform</a></li>
              </ul>
            </div>
          </div>

          {/* RIGHT SECTION: LOCATION & CONTACT */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-4">
              LOCATION & CONTACT
            </h4>

            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start space-x-2.5">
                <MapPin className="w-4 h-4 text-[#4F46E5] shrink-0 mt-0.5" />
                <span className="leading-snug">#121, 13th main Binny layout Vijaynagar Bangalore-560040</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 text-[#4F46E5] shrink-0" />
                <a href="mailto:brandexhq@gmail.com" className="hover:text-white transition-colors">brandexhq@gmail.com</a>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#4F46E5] shrink-0" />
                <a href="tel:+919986880072" className="hover:text-white transition-colors">+91 99868 80072</a>
              </li>
              <li className="flex items-center space-x-2.5">
                <ExternalLink className="w-4 h-4 text-[#4F46E5] shrink-0" />
                <a href="https://www.brandex.co.in" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">www.brandex.co.in</a>
              </li>
              <li className="flex items-center space-x-2.5 pt-2 text-[11px] text-slate-400 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>GST Registered: 29OGNPS8060K175</span>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & HYPERLINK ROW */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <div className="space-y-0.5 text-center md:text-left">
            <div>© {new Date().getFullYear()} Brandex. All Rights Reserved.</div>
            <div className="text-[11px] text-slate-400 font-mono">Entity ID: 29OGNPS8060K175</div>
          </div>

          {/* BOLD A PRODUCT OF BRANDEX WITH DIRECT HYPERLINK TO BRANDEX.CO.IN */}
          <a 
            href="https://www.brandex.co.in" 
            target="_blank" 
            rel="noreferrer" 
            className="flex items-center space-x-2 text-xs text-slate-200 font-extrabold uppercase tracking-wider hover:opacity-80 transition-all cursor-pointer group"
          >
            <span className="text-[11px] text-slate-200 font-extrabold tracking-widest group-hover:text-white">A PRODUCT OF</span>
            <BrandexLogo size="sm" variant="dark" />
          </a>

          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/guidelines" className="hover:text-white transition-colors">Guidelines</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
