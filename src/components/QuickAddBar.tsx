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
    <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
      {/* Decorative gradient glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl">
        <div className="flex items-center space-x-2 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Instant Website Thumbnail Generator</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
          Add a new project link to store & generate thumbnail
        </h2>
        <p className="text-slate-300 text-sm mb-5">
          Paste any website link below. Project Hub will peek into the site, capture an automatic live screenshot, extract meta info, and create an interactive redirect card.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <LinkIcon className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="Paste website link e.g. https://my-awesome-app.com"
              className="w-full pl-10 pr-4 py-3 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/15 focus:border-indigo-400 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={!inputUrl.trim() || isAnalyzing}
            className="px-5 py-3 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Peeking & Capturing...</span>
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
