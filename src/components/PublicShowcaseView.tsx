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
  onOpenOgModal?: () => void;
}

export const PublicShowcaseView: React.FC<PublicShowcaseViewProps> = ({
  projects,
  onOpenProject,
  onSwitchToManager,
  showAdminToggle = true,
  onOpenOgModal,
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
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] font-sans antialiased selection:bg-[#0071e3] selection:text-white">
      {/* Showcase Top Bar Header */}
      <header className="apple-glass sticky top-0 z-40 border-b border-black/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Portfolio Brand / Title */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 bg-[#0071e3] text-white rounded-xl flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-semibold tracking-tight text-[#1d1d1f]">
                  Project Showcase
                </h1>
                <span className="px-2.5 py-0.5 text-xs font-medium bg-[#e8e8ed] text-[#515154] rounded-full">
                  {projects.length} {projects.length === 1 ? 'WORK' : 'WORKS'}
                </span>
              </div>
              <p className="text-xs text-[#86868b] hidden sm:block">
                Public showcase gallery of live web apps & projects
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onOpenOgModal ? (
              <button
                onClick={onOpenOgModal}
                className="px-3.5 py-1.5 text-xs font-medium bg-white hover:bg-[#f2f2f7] text-[#1d1d1f] border border-black/[0.08] rounded-full flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-[#0071e3]" />
                <span className="hidden sm:inline">Social Share &amp; Preview</span>
              </button>
            ) : (
              <button
                onClick={handleSharePortfolio}
                className="px-3.5 py-1.5 text-xs font-medium bg-white hover:bg-[#f2f2f7] text-[#1d1d1f] border border-black/[0.08] rounded-full flex items-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
              >
                {copiedShareLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-600 font-semibold">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-[#0071e3]" />
                    <span className="hidden sm:inline">Share Showcase</span>
                  </>
                )}
              </button>
            )}

            {showAdminToggle && onSwitchToManager && (
              <button
                onClick={onSwitchToManager}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full flex items-center space-x-1.5 transition-all cursor-pointer shadow-xs"
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>Admin Manager</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Header for Visitors */}
      <section className="border-b border-black/[0.06] bg-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-[#0071e3]/10 text-[#0071e3] rounded-full text-xs font-semibold mb-3">
              <Eye className="w-3.5 h-3.5" />
              <span>Public Live Gallery</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-[#1d1d1f] mb-3">
              Featured Creations
            </h2>
            <p className="text-sm sm:text-base text-[#86868b] max-w-2xl leading-relaxed font-normal">
              Explore live websites, web applications, and tools built and compiled here. Click any project card or screenshot to launch the site in a new tab.
            </p>
          </div>

          {/* Global Stats Widget */}
          <div className="flex items-center space-x-4 border border-black/[0.08] bg-[#f2f2f7]/80 rounded-2xl p-4 text-center shadow-xs shrink-0">
            <div>
              <div className="text-2xl font-semibold text-[#0071e3] tracking-tight">{projects.length}</div>
              <div className="text-[11px] font-medium text-[#86868b]">Total Built</div>
            </div>
            <div className="w-px h-8 bg-black/[0.08]" />
            <div>
              <div className="text-2xl font-semibold text-[#1d1d1f] tracking-tight">
                {projects.reduce((acc, p) => acc + (p.clickCount || 0), 0)}
              </div>
              <div className="text-[11px] font-medium text-[#86868b]">Total Visits</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search & Category Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#86868b]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects by keyword, tech tag, or URL..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/[0.08] focus:border-[#0071e3] rounded-full text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none transition-all shadow-2xs"
            />
          </div>

          {/* Category Tabs Segmented Control */}
          <div className="bg-[#e8e8ed]/80 p-1 rounded-2xl flex items-center space-x-1 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 text-xs font-medium rounded-full shrink-0 transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
                    : 'text-[#6e6e73] hover:text-[#1d1d1f]'
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
                className="bg-white border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#0071e3]/40 transition-all duration-300 rounded-2xl flex flex-col overflow-hidden group"
              >
                {/* Image Screenshot Container */}
                <div
                  onClick={() => onOpenProject(project)}
                  className="relative aspect-video w-full bg-[#f2f2f7] cursor-pointer overflow-hidden border-b border-black/[0.06] group/img"
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
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-xs opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4 text-white space-y-2">
                    <div className="w-11 h-11 rounded-full bg-[#0071e3] flex items-center justify-center shadow-lg transform translate-y-2 group-hover/img:translate-y-0 transition-transform">
                      <ArrowUpRight className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white border border-white/20">
                      Visit Website Live
                    </span>
                  </div>

                  {/* Top Domain Overlay */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-black/[0.08] shadow-xs flex items-center space-x-1.5">
                    {project.favicon && (
                      <img src={project.favicon} alt="" className="w-3.5 h-3.5 rounded-full shrink-0" />
                    )}
                    <span className="text-[11px] font-medium text-[#1d1d1f] truncate max-w-[180px]">
                      {project.url.replace(/^https?:\/\//i, '').split('/')[0]}
                    </span>
                  </div>

                  {/* Category Pill */}
                  <div className="absolute bottom-3 left-3">
                    <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-white/95 backdrop-blur-md text-[#0071e3] rounded-full border border-black/[0.08] shadow-2xs">
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
                        className="text-base font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors cursor-pointer line-clamp-1 tracking-tight"
                      >
                        {project.title}
                      </h3>

                      <div className="flex items-center space-x-1 text-xs text-[#6e6e73] bg-[#f2f2f7] rounded-full px-2.5 py-0.5 shrink-0 font-medium">
                        <MousePointerClick className="w-3 h-3 text-[#0071e3]" />
                        <span>{project.clickCount || 0}</span>
                      </div>
                    </div>

                    <p className="text-xs text-[#86868b] line-clamp-3 leading-relaxed mb-4">
                      {project.description || 'No detailed description provided for this project link.'}
                    </p>

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {project.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-0.5 text-[10px] font-medium bg-[#f2f2f7] text-[#515154] rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Launch Button & Copy Link */}
                  <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
                    <button
                      onClick={() => handleCopyLink(project.url, project.id)}
                      className="text-xs font-medium text-[#86868b] hover:text-[#1d1d1f] flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      {copiedId === project.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                          <span className="text-emerald-600 font-semibold">Copied</span>
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
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full flex items-center space-x-1.5 cursor-pointer shadow-xs transition-all"
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
          <div className="border border-dashed border-black/[0.12] bg-white rounded-3xl p-12 text-center max-w-md mx-auto my-12 shadow-xs">
            <Globe className="w-10 h-10 text-[#86868b] mx-auto mb-3" />
            <h3 className="text-base font-semibold text-[#1d1d1f] mb-1">No Projects Found</h3>
            <p className="text-xs text-[#86868b]">
              No project matches the selected search query or category filter.
            </p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-black/[0.08] py-8 px-4 text-center mt-12 text-xs text-[#86868b]">
        <p>Portfolio Showcase Hub &bull; Live Link Directory & Screenshot System</p>
      </footer>
    </div>
  );
};
