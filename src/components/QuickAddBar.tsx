import React, { useState } from 'react';
import { Link as LinkIcon, Camera, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface QuickAddBarProps {
  onQuickAdd: (url: string) => void;
  isAnalyzing: boolean;
}

export const QuickAddBar: React.FC<QuickAddBarProps> = ({ onQuickAdd, isAnalyzing }) => {
  const [inputUrl, setInputUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim() || isAnalyzing) return;
    onQuickAdd(inputUrl.trim());
  };

  return (
    <div className="bg-[#1d1d1f] rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 relative overflow-hidden border border-black/10">
      {/* Decorative ambient subtle glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#0071e3]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="flex items-center space-x-2 text-[#2997ff] text-xs font-semibold tracking-wider uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant Screenshot Generator</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-2 text-white">
          Add a new project link to store & generate thumbnail
        </h2>
        <p className="text-[#a1a1a6] text-sm mb-6 leading-relaxed">
          Paste any website link below. Project Hub will peek into the site, capture an automatic live screenshot, extract meta info, and create an interactive redirect card.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#86868b]">
              <LinkIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste website link e.g. https://my-awesome-app.com"
              className="w-full pl-11 pr-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/15 focus:border-[#2997ff] rounded-2xl text-white placeholder-[#86868b] text-sm focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!inputUrl.trim() || isAnalyzing}
            className="px-6 py-3 bg-[#0071e3] hover:bg-[#0077ed] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-2xl flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Capturing...</span>
              </>
            ) : (
              <>
                <Camera className="w-4 h-4" />
                <span>Peek & Capture</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
