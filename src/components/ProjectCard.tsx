import React, { useState } from 'react';
import { Project } from '../types';
import {
  ExternalLink,
  Star,
  Pencil,
  Trash2,
  RefreshCw,
  MousePointerClick,
  Copy,
  Check,
  Globe,
  Sparkles
} from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onOpen: (project: Project) => void;
  onToggleFavorite: (id: string, current: boolean) => void;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onRefreshThumbnail: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onOpen,
  onToggleFavorite,
  onEdit,
  onDelete,
  onRefreshThumbnail,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(project.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const domain = project.url.replace(/^https?:\/\//i, '').split('/')[0];

  return (
    <div className="bg-white border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:border-[#0071e3]/40 transition-all duration-300 rounded-2xl flex flex-col overflow-hidden group">
      {/* Thumbnail Header Area */}
      <div
        onClick={() => onOpen(project)}
        className="relative aspect-video w-full bg-[#f2f2f7] cursor-pointer overflow-hidden group/thumb select-none border-b border-black/[0.06]"
      >
        {/* Screenshot Image */}
        <img
          src={imgError ? `https://s.wordpress.com/mshots/v1/${encodeURIComponent(project.url)}?w=1280&h=800` : project.thumbnailUrl}
          alt={project.title}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/thumb:scale-105"
          onError={() => setImgError(true)}
        />

        {/* Hover overlay with explicit redirect hint */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xs opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4 text-white space-y-2">
          <div className="w-11 h-11 rounded-full bg-[#0071e3] flex items-center justify-center shadow-lg transform translate-y-2 group-hover/thumb:translate-y-0 transition-transform duration-200">
            <ExternalLink className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-semibold bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white border border-white/20">
            Open Website in New Tab
          </span>
        </div>

        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Favicon & Domain */}
          <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-black/[0.08] shadow-xs flex items-center space-x-1.5 max-w-[70%]">
            <img
              src={project.favicon || `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`}
              alt="Favicon"
              className="w-3.5 h-3.5 rounded-full shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-[11px] font-medium text-[#1d1d1f] truncate">
              {domain}
            </span>
          </div>

          {/* Favorite button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(project.id, project.isFavorite);
            }}
            className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
              project.isFavorite
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white/90 text-[#86868b] hover:text-amber-500 border border-black/[0.08]'
            }`}
            title={project.isFavorite ? 'Unpin Favorite' : 'Pin to Favorites'}
          >
            <Star className={`w-4 h-4 ${project.isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Category pill */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-white/95 backdrop-blur-md text-[#0071e3] rounded-full border border-black/[0.08] shadow-2xs">
            {project.category}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3
              onClick={() => onOpen(project)}
              className="text-base font-semibold text-[#1d1d1f] hover:text-[#0071e3] transition-colors cursor-pointer line-clamp-1 tracking-tight"
            >
              {project.title}
            </h3>

            {/* Click Count Badge */}
            <div
              className="flex items-center space-x-1 text-xs text-[#6e6e73] bg-[#f2f2f7] rounded-full px-2.5 py-0.5 shrink-0 font-medium"
              title="Times launched in new tab"
            >
              <MousePointerClick className="w-3 h-3 text-[#0071e3]" />
              <span>{project.clickCount || 0}</span>
            </div>
          </div>

          {project.description && (
            <p className="text-xs text-[#86868b] line-clamp-2 mb-3 leading-relaxed font-normal">
              {project.description}
            </p>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
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

        {/* Card Actions Footer */}
        <div className="pt-3 border-t border-black/[0.06] flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              onClick={handleCopyLink}
              className="p-1.5 text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f2f2f7] rounded-full transition-colors cursor-pointer"
              title="Copy link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => onRefreshThumbnail(project)}
              className="p-1.5 text-[#86868b] hover:text-[#0071e3] hover:bg-[#f2f2f7] rounded-full transition-colors cursor-pointer"
              title="Refresh / Re-peek website screenshot"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 text-[#86868b] hover:text-[#1d1d1f] hover:bg-[#f2f2f7] rounded-full transition-colors cursor-pointer"
              title="Edit project"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="p-1.5 text-[#86868b] hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors cursor-pointer"
              title="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onOpen(project)}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full transition-all duration-150 cursor-pointer flex items-center space-x-1.5 shadow-xs"
          >
            <span>Launch</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
