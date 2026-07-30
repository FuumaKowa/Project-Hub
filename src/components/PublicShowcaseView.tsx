import React, { useState } from 'react';
import { Project } from '../types';
import {
  ExternalLink,
  Search,
  Globe,
  Sparkles,
  MousePointerClick,
  Copy,
  Check,
  Star,
  Eye,
  ArrowUpRight,
  FolderGit2,
  Share2
} from 'lucide-react';

interface PublicShowcaseViewProps {
  projects: Project[];
  onOpenProject: (project: Project) => void;
  onSwitchToManager?: () => void;
  showAdminToggle?: boolean;
}

export const PublicShowcaseView: React.FC<PublicShowcaseViewProps> = ({
  projects,
  onOpenProject,
  onSwitchToManager,
  showAdminToggle = true,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedShareLink, setCopiedShareLink] = useState(false);

  // Extract categories dynamically
  const categories = ['All', ...Array.from(new Set(projects.map((p) => p.category))).filter(Boolean)];

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.url.toLowerCase().includes(search.toLowerCase()) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())));
    return matchesCategory && matchesSearch;
  });

  const handleCopyLink = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSharePortfolio = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShareLink(true);
    setTimeout(() => setCopiedShareLink(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-rose-500 selection:text-white font-sans antialiased">
      {/* Showcase Top Bar Header */}
      <header className="border-b-2 border-neutral-800 bg-[#0a0a0a]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Portfolio Brand / Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-rose-600 border border-rose-500 text-white flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                  Project Portfolio
                </h1>
                <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold bg-[#1e1e1e] text-rose-400 border border-neutral-700">
                  {projects.length} {projects.length === 1 ? 'WORK' : 'WORKS'}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-mono hidden sm:block">
                Public showcase gallery of live web apps & projects
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSharePortfolio}
              className="px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-[#1a1a1a] hover:bg-[#252525] text-neutral-200 border border-neutral-700 flex items-center space-x-2 transition-colors cursor-pointer"
            >
              {copiedShareLink ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-rose-400" />
                  <span className="hidden sm:inline">Share Showcase</span>
                </>
              )}
            </button>

            {showAdminToggle && onSwitchToManager && (
              <button
                onClick={onSwitchToManager}
                className="px-4 py-2 text-xs font-mono font-black uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white border border-rose-500 flex items-center space-x-2 transition-colors cursor-pointer shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
              >
                <FolderGit2 className="w-4 h-4" />
                <span>Admin Manager</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Header for Visitors */}
      <section className="border-b border-neutral-900 bg-[#0d0d0d] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-rose-950/60 border border-rose-800 text-rose-400 font-mono text-xs uppercase font-bold mb-3">
              <Eye className="w-3.5 h-3.5" />
              <span>Public Live Gallery</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-white mb-2">
              Featured Web Creations
            </h2>
            <p className="text-sm font-mono text-neutral-400 max-w-2xl leading-relaxed">
              Explore live websites, web applications, and tools built and compiled here. Click any project card or screenshot to launch the site in a new tab.
            </p>
          </div>

          {/* Global Stats */}
          <div className="flex items-center space-x-4 border border-neutral-800 bg-[#141414] p-4 text-center">
            <div>
              <div className="text-2xl font-black font-mono text-rose-500">{projects.length}</div>
              <div className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">Total Built</div>
            </div>
            <div className="w-px h-8 bg-neutral-800" />
            <div>
              <div className="text-2xl font-black font-mono text-white">
                {projects.reduce((acc, p) => acc + (p.clickCount || 0), 0)}
              </div>
              <div className="text-[10px] font-mono uppercase text-neutral-400 tracking-wider">Total Visits</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Category Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by keyword, tech tag, or URL..."
              className="w-full pl-10 pr-4 py-3 bg-[#111111] border-2 border-neutral-800 focus:border-rose-500 text-sm font-mono text-white placeholder-neutral-500 focus:outline-none transition-colors"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-rose-600 text-white border border-rose-500 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]'
                    : 'bg-[#141414] text-neutral-400 hover:text-white border border-neutral-800 hover:bg-[#1a1a1a]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-[#111111] border-2 border-neutral-800 shadow-2xl hover:border-rose-500 transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Image Screenshot Container */}
                <div
                  onClick={() => onOpenProject(project)}
                  className="relative aspect-video w-full bg-black cursor-pointer overflow-hidden border-b border-neutral-800 group/img"
                >
                  <img
                    src={project.thumbnailUrl}
                    alt={project.title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(project.url)}?w=1280&h=800`;
                    }}
                  />

                  {/* Hover Launch Action */}
                  <div className="absolute inset-0 bg-black/75 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4 text-white space-y-2">
                    <div className="w-12 h-12 bg-rose-600 border border-white flex items-center justify-center shadow-lg transform translate-y-2 group-hover/img:translate-y-0 transition-transform">
                      <ArrowUpRight className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-mono font-bold tracking-widest uppercase bg-black px-3 py-1 border border-neutral-700">
                      Visit Website Live
                    </span>
                  </div>

                  {/* Top Domain Overlay */}
                  <div className="absolute top-3 left-3 bg-black/90 px-2.5 py-1 border border-neutral-700 flex items-center space-x-1.5">
                    {project.favicon && (
                      <img src={project.favicon} alt="" className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span className="text-[11px] font-mono font-bold text-neutral-300 truncate max-w-[180px]">
                      {project.url.replace(/^https?:\/\//i, '').split('/')[0]}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-1 text-[10px] font-mono font-black uppercase tracking-wider bg-black/90 text-rose-400 border border-rose-950">
                      {project.category}
                    </span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3
                        onClick={() => onOpenProject(project)}
                        className="text-base font-black text-white hover:text-rose-400 transition-colors cursor-pointer uppercase tracking-wide line-clamp-1"
                      >
                        {project.title}
                      </h3>

                      <div className="flex items-center space-x-1 text-[11px] font-mono text-neutral-400 bg-[#1a1a1a] border border-neutral-800 px-2 py-0.5 shrink-0">
                        <MousePointerClick className="w-3 h-3 text-rose-500" />
                        <span className="font-bold">{project.clickCount || 0}</span>
                      </div>
                    </div>

                    <p className="text-xs font-mono text-neutral-400 line-clamp-3 leading-relaxed mb-4">
                      {project.description || 'No detailed description provided for this project link.'}
                    </p>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#181818] text-neutral-300 border border-neutral-800"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Launch Button & Copy Link */}
                  <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                    <button
                      onClick={() => handleCopyLink(project.url, project.id)}
                      className="text-xs font-mono font-bold text-neutral-400 hover:text-white flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      {copiedId === project.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => onOpenProject(project)}
                      className="px-4 py-2 text-xs font-mono font-black uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-500 border border-rose-500 flex items-center space-x-1.5 cursor-pointer shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] transition-colors"
                    >
                      <span>Visit Live</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-neutral-800 bg-[#111111] p-12 text-center max-w-md mx-auto my-12">
            <Globe className="w-10 h-10 text-neutral-600 mx-auto mb-3" />
            <h3 className="text-lg font-black uppercase tracking-wider text-white mb-2">No Projects Found</h3>
            <p className="text-xs font-mono text-neutral-400">
              No project matches the selected search query or category filter.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-900 py-8 px-4 text-center mt-12 text-xs font-mono text-neutral-500">
        <p>Portfolio Showcase Hub &bull; Live Link Directory & Auto-Screenshot System</p>
      </footer>
    </div>
  );
};
