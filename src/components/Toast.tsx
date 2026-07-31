import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  text: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onClose();
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="bg-white/90 backdrop-blur-2xl text-[#1d1d1f] px-4 py-3 rounded-2xl border border-black/[0.1] shadow-2xl flex items-center space-x-3">
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-[#0071e3] shrink-0" />}
        <span className="text-xs font-semibold tracking-tight">{toast.text}</span>
        <button onClick={onClose} className="text-[#86868b] hover:text-[#1d1d1f] p-1 rounded-full hover:bg-black/5 cursor-pointer transition-colors">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
