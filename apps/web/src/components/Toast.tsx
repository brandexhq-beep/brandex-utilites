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
    <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom,1rem))] left-3 right-3 sm:left-auto sm:right-6 z-[100] sm:max-w-sm animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl p-3.5 sm:p-4 flex items-start space-x-3 border border-slate-800">
        <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-200 leading-snug">{message}</p>

          {actionUrl && (
            <div className="mt-2.5">
              <a
                href={actionUrl}
                download={actionFileName || 'result'}
                className="inline-flex items-center px-3.5 py-1.5 rounded-lg bg-[#4F46E5] text-white font-bold text-xs hover:bg-[#4338CA] transition-all shadow-sm"
              >
                Download File
              </a>
            </div>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors shrink-0 min-h-[32px] min-w-[32px] flex items-center justify-center"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
