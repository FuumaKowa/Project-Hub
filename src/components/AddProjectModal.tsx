import React, { useState, useEffect } from 'react';
import { Project, LinkMetadata } from '../types';
import {
  X,
  Camera,
  ExternalLink,
  Sparkles,
  Loader2,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Tag,
  Globe,
  FolderPlus
} from 'lucide-react';

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'clickCount'>) => Promise<void>;
  initialUrl?: string;
  initialData?: Project | null;
}

const CATEGORIES = [
  'Web App',
  'Portfolio',
  'Tool',
  'Design',
  'Mobile',
  'Open Source',
  'Other',
];

export const AddProjectModal: React.FC<AddProjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialUrl = '',
  initialData = null,
}) => {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Web App');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [favicon, setFavicon] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<LinkMetadata | null>(null);
  const [selectedEngine, setSelectedEngine] = useState<'wordpress' | 'microlink' | 'thumIo' | 'ogImage' | 'custom'>('wordpress');
  const [customThumbnailInput, setCustomThumbnailInput] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setUrl(initialData.url);
        setTitle(initialData.title);
        setDescription(initialData.description || '');
        setCategory(initialData.category || 'Web App');
        setTags(initialData.tags || []);
        setThumbnailUrl(initialData.thumbnailUrl);
        setFavicon(initialData.favicon || '');
        setCustomThumbnailInput(initialData.customThumbnail ? initialData.thumbnailUrl : '');
        setSelectedEngine(initialData.customThumbnail ? 'custom' : 'wordpress');
      } else {
        setUrl(initialUrl);
        setTitle('');
        setDescription('');
        setCategory('Web App');
        setTags([]);
        setThumbnailUrl('');
        setFavicon('');
        setAnalysisResult(null);
        setSelectedEngine('wordpress');
        setCustomThumbnailInput('');

        if (initialUrl) {
          handleAnalyzeLink(initialUrl);
        }
      }
    }
  }, [isOpen, initialUrl, initialData]);

  const handleAnalyzeLink = async (targetUrl: string) => {
    if (!targetUrl.trim()) return;
    setIsAnalyzing(true);

    let normalized = targetUrl.trim();
    if (!/^https?:\/\//i.test(normalized)) {
      normalized = `https://${normalized}`;
    }

    let domain = '';
    try {
      domain = new URL(normalized).hostname.replace(/^www\./, '');
    } catch {
      domain = normalized;
    }

    const wordpressScreenshot = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(normalized)}?w=1280&h=800`;
    const microlinkScreenshot = `https://api.microlink.io/?url=${encodeURIComponent(normalized)}&screenshot=true&embed=screenshot.url`;
    const thumIoScreenshot = `https://image.thum.io/get/width/1200/crop/800/${normalized}`;
    const defaultFavicon = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;

    const fallbackTitle = domain ? domain.charAt(0).toUpperCase() + domain.slice(1) : 'New Project';
    const fallbackDesc = `Project live at ${domain}`;

    try {
      const res = await fetch('/api/analyze-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: normalized }),
      });

      if (res.ok) {
        const data: LinkMetadata & { url: string } = await res.json();
        setAnalysisResult(data);
        setUrl(data.url);
        if (!title || initialUrl) setTitle(data.title);
        if (!description || initialUrl) setDescription(data.description);
        if (data.suggestedCategory) setCategory(data.suggestedCategory);
        if (data.suggestedTags && data.suggestedTags.length > 0) setTags(data.suggestedTags);
        setFavicon(data.favicon || defaultFavicon);

        const defaultThumb = data.screenshots?.wordpress || wordpressScreenshot;
        setThumbnailUrl(defaultThumb);
        setSelectedEngine('wordpress');
        setIsAnalyzing(false);
        return;
      }
    } catch (err) {
      console.warn('API route /api/analyze-link unreachable (e.g. static Cloudflare host), switching to client-side screenshot generators:', err);
    }

    // Client-side fallback for Cloudflare Pages and static deployments
    const clientData: LinkMetadata = {
      url: normalized,
      title: fallbackTitle,
      description: fallbackDesc,
      thumbnailUrl: wordpressScreenshot,
      favicon: defaultFavicon,
      screenshots: {
        wordpress: wordpressScreenshot,
        microlink: microlinkScreenshot,
        thumIo: thumIoScreenshot,
      },
      suggestedCategory: 'Web App',
      suggestedTags: [domain.split('.')[0] || 'web'],
    };

    setAnalysisResult(clientData);
    setUrl(normalized);
    if (!title || initialUrl) setTitle(fallbackTitle);
    if (!description || initialUrl) setDescription(fallbackDesc);
    setFavicon(defaultFavicon);
    setThumbnailUrl(wordpressScreenshot);
    setSelectedEngine('wordpress');
    setIsAnalyzing(false);
  };

  const handleEngineChange = (engine: 'wordpress' | 'microlink' | 'thumIo' | 'ogImage' | 'custom') => {
    setSelectedEngine(engine);
    if (!analysisResult) return;

    if (engine === 'wordpress') {
      setThumbnailUrl(analysisResult.screenshots.wordpress);
    } else if (engine === 'microlink') {
      setThumbnailUrl(analysisResult.screenshots.microlink);
    } else if (engine === 'thumIo') {
      setThumbnailUrl(analysisResult.screenshots.thumIo);
    } else if (engine === 'ogImage' && analysisResult.ogImage) {
      setThumbnailUrl(analysisResult.ogImage);
    } else if (engine === 'custom') {
      setThumbnailUrl(customThumbnailInput);
    }
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDownTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim() || !title.trim() || isSaving) return;

    setIsSaving(true);
    try {
      const finalThumb = selectedEngine === 'custom' && customThumbnailInput.trim()
        ? customThumbnailInput.trim()
        : thumbnailUrl || `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1280&h=800`;

      const domain = url.replace(/^https?:\/\//i, '').split('/')[0];
      const finalFavicon = favicon || `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`;

      await onSave({
        title: title.trim(),
        url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`,
        description: description.trim(),
        category,
        tags,
        thumbnailUrl: finalThumb,
        favicon: finalFavicon,
        status: 'active',
        isFavorite: initialData ? initialData.isFavorite : false,
        customThumbnail: selectedEngine === 'custom',
      });
      onClose();
    } catch (err) {
      console.error('Failed to save project:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#111111] rounded-none shadow-2xl max-w-2xl w-full overflow-hidden border-2 border-white my-8">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b-2 border-neutral-800 flex items-center justify-between bg-[#161616]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-none bg-[#222222] border border-neutral-700 text-rose-500 flex items-center justify-center font-bold">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white uppercase tracking-wider">
                {initialData ? 'Edit Project Link' : 'Add New Project'}
              </h3>
              <p className="text-xs text-neutral-400 font-mono">
                Auto-peeks into website to generate screenshot thumbnail
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-none transition-colors cursor-pointer border border-transparent hover:border-neutral-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: URL input & Peek action */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-widest mb-2 font-mono">
              Website / Project Link <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-500">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://myproject.com or github.com/user/repo"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#181818] border border-neutral-700 focus:border-rose-500 focus:bg-[#202020] rounded-none text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors font-mono"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAnalyzeLink(url)}
                disabled={!url.trim() || isAnalyzing}
                className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider rounded-none flex items-center justify-center space-x-2 border border-rose-500 transition-colors disabled:opacity-50 cursor-pointer shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Peeking...</span>
                  </>
                ) : (
                  <>
                    <Camera className="w-3.5 h-3.5" />
                    <span>Capture Thumbnail</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Screenshot Thumbnail Preview & Engine Picker */}
          <div className="bg-[#161616] border border-neutral-800 rounded-none p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest flex items-center space-x-1.5 font-mono">
                <Camera className="w-3.5 h-3.5 text-rose-500" />
                <span>Captured Screenshot Preview</span>
              </span>
              {thumbnailUrl && (
                <span className="text-[11px] text-emerald-400 font-mono font-bold bg-emerald-950/60 px-2.5 py-1 rounded-none border border-emerald-800 flex items-center space-x-1 uppercase">
                  <Check className="w-3 h-3" />
                  <span>Thumbnail Ready</span>
                </span>
              )}
            </div>

            {/* Thumbnail Display Box */}
            <div className="relative aspect-video w-full rounded-none overflow-hidden bg-black border border-neutral-800 shadow-inner group">
              {isAnalyzing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 text-white p-4">
                  <Loader2 className="w-8 h-8 text-rose-500 animate-spin mb-2" />
                  <p className="text-sm font-bold uppercase tracking-wider">Peeking into website...</p>
                  <p className="text-xs text-neutral-400 font-mono">Taking screenshot & fetching page metadata</p>
                </div>
              ) : thumbnailUrl ? (
                <>
                  <img
                    src={thumbnailUrl}
                    alt="Captured Website Thumbnail"
                    className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=1280&h=800`;
                    }}
                  />
                  {favicon && (
                    <div className="absolute top-3 left-3 bg-black/90 backdrop-blur-sm p-1.5 rounded-none border border-neutral-700 shadow-xs flex items-center space-x-1.5">
                      <img src={favicon} alt="Favicon" className="w-4 h-4 rounded-none" />
                      <span className="text-[10px] font-mono font-bold text-neutral-300">
                        {url.replace(/^https?:\/\//i, '').split('/')[0]}
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 p-6 text-center">
                  <ImageIcon className="w-10 h-10 mb-2 stroke-1 text-neutral-600" />
                  <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Enter website link & click Capture Thumbnail</p>
                  <p className="text-[11px] text-neutral-500 font-mono mt-1">Automatic screenshot will appear here</p>
                </div>
              )}
            </div>

            {/* Engine Options */}
            {analysisResult && (
              <div className="mt-3 pt-3 border-t border-neutral-800">
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Select Screenshot Provider:
                </label>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleEngineChange('wordpress')}
                    className={`px-2.5 py-1 text-xs font-mono font-bold cursor-pointer transition-all ${
                      selectedEngine === 'wordpress'
                        ? 'bg-rose-600 text-white border border-rose-500'
                        : 'bg-[#222222] text-neutral-300 border border-neutral-700 hover:bg-neutral-800'
                    }`}
                  >
                    Engine 1 (Live MShots)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEngineChange('microlink')}
                    className={`px-2.5 py-1 text-xs font-mono font-bold cursor-pointer transition-all ${
                      selectedEngine === 'microlink'
                        ? 'bg-rose-600 text-white border border-rose-500'
                        : 'bg-[#222222] text-neutral-300 border border-neutral-700 hover:bg-neutral-800'
                    }`}
                  >
                    Engine 2 (Microlink)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleEngineChange('thumIo')}
                    className={`px-2.5 py-1 text-xs font-mono font-bold cursor-pointer transition-all ${
                      selectedEngine === 'thumIo'
                        ? 'bg-rose-600 text-white border border-rose-500'
                        : 'bg-[#222222] text-neutral-300 border border-neutral-700 hover:bg-neutral-800'
                    }`}
                  >
                    Engine 3 (Thum.io)
                  </button>
                  {analysisResult.ogImage && (
                    <button
                      type="button"
                      onClick={() => handleEngineChange('ogImage')}
                      className={`px-2.5 py-1 text-xs font-mono font-bold cursor-pointer transition-all ${
                        selectedEngine === 'ogImage'
                          ? 'bg-rose-600 text-white border border-rose-500'
                          : 'bg-[#222222] text-neutral-300 border border-neutral-700 hover:bg-neutral-800'
                      }`}
                    >
                      Site Banner (OG)
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleEngineChange('custom')}
                    className={`px-2.5 py-1 text-xs font-mono font-bold cursor-pointer transition-all ${
                      selectedEngine === 'custom'
                        ? 'bg-rose-600 text-white border border-rose-500'
                        : 'bg-[#222222] text-neutral-300 border border-neutral-700 hover:bg-neutral-800'
                    }`}
                  >
                    Custom URL
                  </button>
                </div>

                {selectedEngine === 'custom' && (
                  <input
                    type="text"
                    value={customThumbnailInput}
                    onChange={(e) => {
                      setCustomThumbnailInput(e.target.value);
                      setThumbnailUrl(e.target.value);
                    }}
                    placeholder="Paste custom image URL (https://...)"
                    className="mt-2 w-full px-3 py-1.5 text-xs bg-[#181818] border border-neutral-700 text-white focus:outline-none focus:border-rose-500 font-mono"
                  />
                )}
              </div>
            )}
          </div>

          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-widest mb-1.5 font-mono">
                Project Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. NextGen E-Commerce Portal"
                className="w-full px-3.5 py-2.5 bg-[#181818] border border-neutral-700 focus:border-rose-500 focus:bg-[#202020] rounded-none text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-300 uppercase tracking-widest mb-1.5 font-mono">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#181818] border border-neutral-700 focus:border-rose-500 focus:bg-[#202020] rounded-none text-sm text-white focus:outline-none transition-colors cursor-pointer font-mono"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat} className="bg-[#181818] text-white">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-widest mb-1.5 font-mono">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of what you built in this project..."
              className="w-full px-3.5 py-2.5 bg-[#181818] border border-neutral-700 focus:border-rose-500 focus:bg-[#202020] rounded-none text-sm text-white placeholder-neutral-500 focus:outline-none transition-colors resize-none font-mono"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-neutral-300 uppercase tracking-widest mb-1.5 font-mono">
              Tags
            </label>
            <div className="flex flex-wrap gap-1.5 p-2 bg-[#181818] border border-neutral-700 rounded-none min-h-10 items-center">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center px-2.5 py-1 rounded-none text-xs font-mono font-bold bg-[#222222] text-rose-400 border border-neutral-700"
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="ml-1.5 text-neutral-500 hover:text-white cursor-pointer"
                  >
                    &times;
                  </button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDownTag}
                placeholder={tags.length === 0 ? "Type tag & press enter (e.g. react, tailwind)" : "+ Add tag"}
                className="flex-1 bg-transparent border-none text-xs text-white placeholder-neutral-500 focus:outline-none px-1 font-mono"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-neutral-800 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 hover:text-white bg-[#1a1a1a] hover:bg-[#252525] border border-neutral-700 rounded-none cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!url.trim() || !title.trim() || isSaving}
              className="px-5 py-2.5 text-xs font-black uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-500 border border-rose-500 rounded-none cursor-pointer transition-colors disabled:opacity-50 flex items-center space-x-2 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Project...</span>
                </>
              ) : (
                <span>{initialData ? 'Update Project' : 'Save Project to Hub'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
