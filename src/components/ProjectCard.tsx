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
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Thumbnail Header Area - Acts as the primary interactive button that redirects on click */}
      <div
        onClick={() => onOpen(project)}
        className="relative aspect-video w-full bg-slate-900 cursor-pointer overflow-hidden group/thumb select-none"
      >
        {/* Screenshot Image */}
        <img
          src={imgError ? `https://s.wordpress.com/mshots/v1/${encodeURIComponent(project.url)}?w=1280&h=800` : project.thumbnailUrl}
          alt={project.title}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/thumb:scale-105"
          onError={() => setImgError(true)}
        />

        {/* Hover overlay with explicit redirect hint */}
        <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4 text-white space-y-2">
          <div className="w-12 h-12 rounded-full bg-indigo-600/90 backdrop-blur-xs flex items-center justify-center shadow-lg transform translate-y-2 group-hover/thumb:translate-y-0 transition-transform duration-200">
            <ExternalLink className="w-6 h-6 text-white" />
          </div>
          <span className="text-xs font-bold tracking-wide uppercase bg-black/40 px-3 py-1 rounded-full backdrop-blur-md">
            Open Website in New Tab
          </span>
        </div>

        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Favicon & Domain */}
          <div className="bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-200/80 shadow-xs flex items-center space-x-1.5 max-w-[70%]">
            <img
              src={project.favicon || `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`}
              alt="Favicon"
              className="w-3.5 h-3.5 rounded-xs shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="text-[11px] font-semibold text-slate-800 truncate">
              {domain}
            </span>
          </div>

          {/* Favorite button (pointer events re-enabled) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(project.id, project.isFavorite);
            }}
            className={`pointer-events-auto p-1.5 rounded-lg backdrop-blur-md transition-all cursor-pointer ${
              project.isFavorite
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white/90 text-slate-400 hover:text-amber-500 border border-slate-200/80'
            }`}
            title={project.isFavorite ? 'Unpin Favorite' : 'Pin to Favorites'}
          >
            <Star className={`w-4 h-4 ${project.isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Bottom Category pill */}
        <div className="absolute bottom-3 left-3 pointer-events-none">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white rounded-md backdrop-blur-md border border-white/10">
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
              className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
            >
              {project.title}
            </h3>

            {/* Click Count Badge */}
            <div
              className="flex items-center space-x-1 text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0"
              title="Times launched in new tab"
            >
              <MousePointerClick className="w-3 h-3 text-slate-400" />
              <span className="font-medium">{project.clickCount || 0}</span>
            </div>
          </div>

          {project.description && (
            <p className="text-xs text-slate-500 line-clamp-2 mb-3 leading-relaxed">
              {project.description}
            </p>
          )}

          {/* Tags */}
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 text-slate-600 rounded-md border border-slate-200/60"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Card Actions Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <button
              onClick={handleCopyLink}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Copy link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => onRefreshThumbnail(project)}
              className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
              title="Refresh / Re-peek website screenshot"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onEdit(project)}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Edit project"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(project.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Delete project"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => onOpen(project)}
            className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:text-white bg-indigo-50 hover:bg-indigo-600 rounded-xl transition-all duration-150 cursor-pointer flex items-center space-x-1.5"
          >
            <span>Launch</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
