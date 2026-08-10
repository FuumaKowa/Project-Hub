import React, { useState, useEffect } from 'react';
import {
  Share2,
  X,
  Check,
  Copy,
  ExternalLink,
  ShieldCheck,
  Globe,
  Sparkles,
  Code2,
  MessageSquare,
  Twitter,
  Linkedin,
  Radio,
  Image as ImageIcon
} from 'lucide-react';

interface OpenGraphModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast?: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const OpenGraphModal: React.FC<OpenGraphModalProps> = ({
  isOpen,
  onClose,
  showToast,
}) => {
  const [activePlatform, setActivePlatform] = useState<'linkedin' | 'twitter' | 'discord' | 'whatsapp'>('linkedin');
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMeta, setCopiedMeta] = useState(false);
  const [serverOg, setServerOg] = useState<any>(null);

  const baseUrl = window.location.origin;
  const ogImageFull = `${baseUrl}/og-image.png`;
  const siteTitle = 'Project Hub — Curated Web Project Showcase & Directory';
  const siteDesc = 'Discover, bookmark, and showcase curated web creations, applications, and tools with automatic live screenshots, category filters, and instant launch redirects.';

  useEffect(() => {
    if (isOpen) {
      fetch('/api/og-metadata')
        .then((res) => res.json())
        .then((data) => setServerOg(data))
        .catch((err) => console.log('OG Metadata fetch error:', err));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const metaHtmlSnippet = `<!-- Open Graph Meta Tags (LinkedIn, Twitter, WhatsApp, Discord) -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Project Hub" />
<meta property="og:title" content="${siteTitle}" />
<meta property="og:description" content="${siteDesc}" />
<meta property="og:image" content="${ogImageFull}" />
<meta property="og:image:type" content="image/png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />

<!-- Twitter Cards -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${siteTitle}" />
<meta name="twitter:description" content="${siteDesc}" />
<meta name="twitter:image" content="${ogImageFull}" />`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(baseUrl);
    setCopiedLink(true);
    if (showToast) showToast('Website link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyMeta = () => {
    navigator.clipboard.writeText(metaHtmlSnippet);
    setCopiedMeta(true);
    if (showToast) showToast('Open Graph HTML meta tags copied!', 'success');
    setTimeout(() => setCopiedMeta(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="w-full max-w-3xl bg-white/95 backdrop-blur-2xl rounded-3xl border border-black/[0.1] shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 border-b border-black/[0.08] bg-[#f2f2f7]/80 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-[#0071e3] text-white rounded-xl flex items-center justify-center font-bold shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1d1d1f] tracking-tight flex items-center space-x-2">
                <span>Social Link & Open Graph Preview</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full flex items-center space-x-1">
                  <Check className="w-3 h-3" />
                  <span>Live Ready</span>
                </span>
              </h3>
              <p className="text-xs text-[#86868b]">
                Preview how Project Hub appears on LinkedIn, Twitter, Discord, and WhatsApp
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#86868b] hover:text-[#1d1d1f] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Platform Tabs */}
          <div className="flex bg-[#f2f2f7] p-1 rounded-2xl gap-1">
            <button
              onClick={() => setActivePlatform('linkedin')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                activePlatform === 'linkedin'
                  ? 'bg-white text-[#0077b5] shadow-xs'
                  : 'text-[#515154] hover:text-[#1d1d1f]'
              }`}
            >
              <Linkedin className="w-4 h-4 fill-current" />
              <span>LinkedIn</span>
            </button>
            <button
              onClick={() => setActivePlatform('twitter')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                activePlatform === 'twitter'
                  ? 'bg-white text-black shadow-xs'
                  : 'text-[#515154] hover:text-[#1d1d1f]'
              }`}
            >
              <Twitter className="w-4 h-4 fill-current" />
              <span>Twitter / X</span>
            </button>
            <button
              onClick={() => setActivePlatform('discord')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                activePlatform === 'discord'
                  ? 'bg-white text-[#5865f2] shadow-xs'
                  : 'text-[#515154] hover:text-[#1d1d1f]'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>Discord</span>
            </button>
            <button
              onClick={() => setActivePlatform('whatsapp')}
              className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                activePlatform === 'whatsapp'
                  ? 'bg-white text-[#25d366] shadow-xs'
                  : 'text-[#515154] hover:text-[#1d1d1f]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>

          {/* Platform Preview Box */}
          <div className="bg-[#f9f9fb] border border-black/[0.08] rounded-2xl p-5 shadow-xs">
            <div className="text-xs font-semibold text-[#86868b] uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>{activePlatform.toUpperCase()} Card Preview</span>
              <span className="text-[11px] font-normal text-[#0071e3]">1200 x 630 Open Graph Standard</span>
            </div>

            {/* LINKEDIN PREVIEW */}
            {activePlatform === 'linkedin' && (
              <div className="max-w-md mx-auto bg-white border border-black/[0.12] rounded-xl overflow-hidden shadow-md">
                <div className="p-3 border-b border-black/[0.06] flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-[#0071e3] text-white flex items-center justify-center font-bold text-xs">
                    PH
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#1d1d1f]">Project Hub</p>
                    <p className="text-[10px] text-[#86868b]">Web Bookmark Showcase • Now</p>
                  </div>
                </div>
                <div className="px-3 py-2 text-xs text-[#1d1d1f]">
                  Explore curated web projects, tools, and portfolios with live screenshot previews! 🚀
                </div>
                <div className="relative border-t border-black/[0.08]">
                  <img src="/og-image.png" alt="LinkedIn OG Preview" className="w-full aspect-[1.91/1] object-cover" />
                  <div className="p-3 bg-[#f3f6f8] border-t border-black/[0.06]">
                    <p className="text-xs font-semibold text-[#1d1d1f] line-clamp-1">{siteTitle}</p>
                    <p className="text-[11px] text-[#515154] truncate mt-0.5">{baseUrl.replace(/^https?:\/\//, '')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TWITTER / X PREVIEW */}
            {activePlatform === 'twitter' && (
              <div className="max-w-md mx-auto bg-black text-white rounded-2xl overflow-hidden border border-neutral-800 p-4 shadow-md">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-[#0071e3] text-white flex items-center justify-center font-bold text-xs">
                    PH
                  </div>
                  <div>
                    <span className="text-xs font-bold">Project Hub</span>
                    <span className="text-xs text-neutral-400 ml-1.5">@ProjectHub • 1m</span>
                  </div>
                </div>
                <p className="text-xs mb-3 text-neutral-200">
                  Discover, bookmark, and showcase curated web creations with instant screenshot previews:
                </p>
                <div className="rounded-2xl overflow-hidden border border-neutral-800 bg-[#161616]">
                  <img src="/og-image.png" alt="Twitter Card Preview" className="w-full aspect-[1.91/1] object-cover" />
                  <div className="p-3">
                    <p className="text-[11px] text-neutral-400 uppercase tracking-wider">{baseUrl.replace(/^https?:\/\//, '')}</p>
                    <p className="text-xs font-bold text-white line-clamp-1 mt-0.5">{siteTitle}</p>
                    <p className="text-[11px] text-neutral-400 line-clamp-1 mt-0.5">{siteDesc}</p>
                  </div>
                </div>
              </div>
            )}

            {/* DISCORD PREVIEW */}
            {activePlatform === 'discord' && (
              <div className="max-w-md mx-auto bg-[#313338] text-[#dbdee1] rounded-2xl p-4 shadow-md font-sans">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-xs font-semibold text-white">Bot / User</span>
                  <span className="text-[10px] text-[#949ba4]">Today at 12:00 PM</span>
                </div>
                <p className="text-xs text-[#b5bac1] mb-2">{baseUrl}</p>
                <div className="border-l-4 border-[#0071e3] bg-[#2b2d31] rounded-r-xl p-3 space-y-2">
                  <p className="text-xs font-semibold text-[#00a8fc] uppercase tracking-wide">Project Hub</p>
                  <p className="text-xs font-bold text-white leading-snug">{siteTitle}</p>
                  <p className="text-[11px] text-[#dbdee1] leading-relaxed">{siteDesc}</p>
                  <img src="/og-image.png" alt="Discord Embed Preview" className="w-full rounded-lg aspect-[1.91/1] object-cover" />
                </div>
              </div>
            )}

            {/* WHATSAPP PREVIEW */}
            {activePlatform === 'whatsapp' && (
              <div className="max-w-md mx-auto bg-[#efeae2] p-4 rounded-2xl shadow-md">
                <div className="ml-auto max-w-[85%] bg-[#d9fdd3] rounded-2xl rounded-tr-none p-2.5 shadow-xs border border-[#b2e5a8]">
                  <div className="bg-[#c2ebbe] rounded-xl overflow-hidden mb-1.5 p-2">
                    <img src="/og-image.png" alt="WhatsApp Link Preview" className="w-full aspect-[1.91/1] rounded-lg object-cover mb-2" />
                    <p className="text-xs font-bold text-[#111b21] line-clamp-1">{siteTitle}</p>
                    <p className="text-[11px] text-[#3b4a54] line-clamp-2 mt-0.5">{siteDesc}</p>
                    <p className="text-[10px] text-[#667781] mt-1 truncate">{baseUrl}</p>
                  </div>
                  <p className="text-xs text-[#111b21]">{baseUrl}</p>
                  <p className="text-[10px] text-[#667781] text-right mt-1">12:05 PM ✓✓</p>
                </div>
              </div>
            )}
          </div>

          {/* Open Graph Meta Tag Audit Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-[#f2f2f7] rounded-2xl border border-black/[0.08] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#1d1d1f]">og:title</p>
                <p className="text-[11px] text-[#86868b] truncate max-w-[220px]">{siteTitle}</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full">Valid</span>
            </div>

            <div className="p-3 bg-[#f2f2f7] rounded-2xl border border-black/[0.08] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#1d1d1f]">og:image (1200 x 630 PNG)</p>
                <p className="text-[11px] text-[#86868b] truncate max-w-[220px]">/og-image.png</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full">1200x630 PNG</span>
            </div>

            <div className="p-3 bg-[#f2f2f7] rounded-2xl border border-black/[0.08] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#1d1d1f]">twitter:card</p>
                <p className="text-[11px] text-[#86868b]">summary_large_image</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full">Configured</span>
            </div>

            <div className="p-3 bg-[#f2f2f7] rounded-2xl border border-black/[0.08] flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-[#1d1d1f]">theme-color</p>
                <p className="text-[11px] text-[#86868b]">#f5f5f7 (Apple Neutral)</p>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-100 text-emerald-800 rounded-full">Active</span>
            </div>
          </div>

          {/* Meta Code Snippet Toggle */}
          <div className="bg-[#f2f2f7] border border-black/[0.08] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#1d1d1f] flex items-center space-x-1.5">
                <Code2 className="w-4 h-4 text-[#0071e3]" />
                <span>Generated Open Graph Meta Tags</span>
              </span>
              <button
                onClick={handleCopyMeta}
                className="px-3 py-1 bg-white hover:bg-[#e5e5ea] text-[#1d1d1f] border border-black/[0.08] rounded-full text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
              >
                {copiedMeta ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedMeta ? 'Copied HTML' : 'Copy HTML'}</span>
              </button>
            </div>
            <pre className="p-3 bg-[#1d1d1f] text-[#34c759] text-[11px] font-mono rounded-xl overflow-x-auto leading-relaxed">
              {metaHtmlSnippet}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-black/[0.08] bg-[#f2f2f7]/80 flex items-center justify-between">
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-white hover:bg-[#e5e5ea] text-[#1d1d1f] border border-black/[0.08] rounded-full text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#0071e3]" />}
            <span>{copiedLink ? 'Link Copied!' : 'Copy Share Link'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#0071e3] hover:bg-[#0077ed] text-white rounded-full text-xs font-semibold cursor-pointer transition-colors shadow-xs"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
