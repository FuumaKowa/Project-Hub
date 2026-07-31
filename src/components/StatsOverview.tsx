import React from 'react';
import { Project } from '../types';
import { ExternalLink, Star, MousePointerClick, Grid } from 'lucide-react';

interface StatsOverviewProps {
  projects: Project[];
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({ projects }) => {
  const totalProjects = projects.length;
  const totalClicks = projects.reduce((acc, p) => acc + (p.clickCount || 0), 0);
  const favoriteCount = projects.filter((p) => p.isFavorite).length;
  const categoriesCount = new Set(projects.map((p) => p.category)).size;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="p-4 bg-white rounded-2xl border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center font-semibold">
          <Grid className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-[#86868b] font-medium">Total Stored</p>
          <p className="text-xl font-semibold text-[#1d1d1f] tracking-tight">{totalProjects}</p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-semibold">
          <Star className="w-5 h-5 fill-amber-500/20" />
        </div>
        <div>
          <p className="text-xs text-[#86868b] font-medium">Favorites</p>
          <p className="text-xl font-semibold text-[#1d1d1f] tracking-tight">{favoriteCount}</p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-semibold">
          <MousePointerClick className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-[#86868b] font-medium">Tab Redirects</p>
          <p className="text-xl font-semibold text-[#1d1d1f] tracking-tight">{totalClicks}</p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-black/[0.08] shadow-[0_4px_20px_rgba(0,0,0,0.03)] flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-semibold">
          <ExternalLink className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-[#86868b] font-medium">Categories</p>
          <p className="text-xl font-semibold text-[#1d1d1f] tracking-tight">{categoriesCount}</p>
        </div>
      </div>
    </div>
  );
};
