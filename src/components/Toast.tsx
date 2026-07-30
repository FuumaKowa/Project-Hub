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
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-[#161616] text-white px-4 py-3 border-2 border-white shadow-[4px_4px_0px_0px_rgba(244,63,94,0.5)] flex items-center space-x-3">
        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />}
        {toast.type === 'info' && <Info className="w-5 h-5 text-amber-400 shrink-0" />}
        <span className="text-xs font-mono font-bold tracking-tight">{toast.text}</span>
        <button onClick={onClose} className="text-neutral-400 hover:text-white p-1 cursor-pointer">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
