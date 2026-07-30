import React from 'react';
import { Plus, FolderGit2, Eye, LayoutGrid } from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  totalProjects: number;
  currentMode: 'manager' | 'showcase';
  onModeChange: (mode: 'manager' | 'showcase') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  totalProjects,
  currentMode,
  onModeChange,
}) => {
  return (
    <header className="border-b-2 border-neutral-800 bg-[#0d0d0d]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-rose-600 border border-white text-white flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white">
                Project Hub
              </h1>
              <span className="px-2.5 py-0.5 text-[11px] font-mono font-bold bg-[#1e1e1e] text-rose-400 border border-neutral-700">
                {totalProjects} {totalProjects === 1 ? 'Project' : 'Projects'}
              </span>
            </div>
            <p className="text-xs text-neutral-400 font-mono hidden sm:block">
              Website bookmark directory & screenshot thumbnail generator
            </p>
          </div>
        </div>

        {/* Navigation Mode Switcher & Add Button */}
        <div className="flex items-center space-x-3">
          {/* Mode Tabs */}
          <div className="bg-[#141414] border border-neutral-800 p-1 flex items-center space-x-1">
            <button
              onClick={() => onModeChange('manager')}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer ${
                currentMode === 'manager'
                  ? 'bg-rose-600 text-white border border-rose-500 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Manager</span>
            </button>
            <button
              onClick={() => onModeChange('showcase')}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors cursor-pointer ${
                currentMode === 'showcase'
                  ? 'bg-rose-600 text-white border border-rose-500 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Public Showcase</span>
            </button>
          </div>

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-2 px-4 py-2 text-xs font-mono font-black uppercase tracking-wider text-white bg-rose-600 hover:bg-rose-500 border border-rose-500 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Project</span>
          </button>
        </div>
      </div>
    </header>
  );
};

