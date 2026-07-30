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
      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-semibold">
          <Grid className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Total Stored</p>
          <p className="text-xl font-bold text-slate-900">{totalProjects}</p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-semibold">
          <Star className="w-5 h-5 fill-amber-500/20" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Favorites</p>
          <p className="text-xl font-bold text-slate-900">{favoriteCount}</p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-semibold">
          <MousePointerClick className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Tab Redirects</p>
          <p className="text-xl font-bold text-slate-900">{totalClicks}</p>
        </div>
      </div>

      <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center font-semibold">
          <ExternalLink className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">Active Categories</p>
          <p className="text-xl font-bold text-slate-900">{categoriesCount}</p>
        </div>
      </div>
    </div>
  );
};
