import React from 'react';
import { Layers, Plus, ExternalLink, Sparkles, FolderGit2 } from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  totalProjects: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAddModal, totalProjects }) => {
  return (
    <header className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">Project Hub</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100/80">
                {totalProjects} {totalProjects === 1 ? 'Project' : 'Projects'}
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Store, preview & launch all your created websites with auto-generated screenshot thumbnails
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-all duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>
      </div>
    </header>
  );
};
