"use client";

import React, { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  actionUrl?: string;
  actionFileName?: string;
}

export default function Toast({ message, isVisible, onClose, actionUrl, actionFileName }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed top-[92px] left-1/2 -translate-x-1/2 z-[100] w-full max-w-md px-4 animate-in slide-in-from-top-6 fade-in duration-300">
      <div className="bg-white border-2 border-emerald-500 rounded-2xl shadow-2xl p-4 flex items-center space-x-3.5 text-slate-900 ring-4 ring-emerald-500/10">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 shadow-xs">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Processing Complete</h4>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-xs text-slate-600 mt-0.5 leading-snug truncate">{message}</p>

          {actionUrl && (
            <div className="mt-2">
              <a
                href={actionUrl}
                download={actionFileName || 'result'}
                className="inline-flex items-center px-4 py-1.5 rounded-lg bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition-all shadow-sm hover:scale-[1.02]"
              >
                Download Result File
              </a>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
