import React from 'react';
import { Plus, FolderGit2, Eye, LayoutGrid, KeyRound, LogOut, Share2 } from 'lucide-react';

interface HeaderProps {
  onOpenAddModal: () => void;
  totalProjects: number;
  currentMode: 'manager' | 'showcase';
  onModeChange: (mode: 'manager' | 'showcase') => void;
  onOpenSecuritySettings?: () => void;
  onLockAdmin?: () => void;
  onOpenOgModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  totalProjects,
  currentMode,
  onModeChange,
  onOpenSecuritySettings,
  onLockAdmin,
  onOpenOgModal,
}) => {
  return (
    <header className="apple-glass sticky top-0 z-30 border-b border-black/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 bg-[#0071e3] text-white rounded-xl flex items-center justify-center font-bold shadow-xs">
            <FolderGit2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-[#1d1d1f]">
                Project Hub
              </h1>
              <span className="px-2.5 py-0.5 text-xs font-medium bg-[#e8e8ed] text-[#515154] rounded-full">
                {totalProjects} {totalProjects === 1 ? 'Project' : 'Projects'}
              </span>
            </div>
            <p className="text-xs text-[#86868b] hidden sm:block">
              Website bookmark directory & screenshot generator
            </p>
          </div>
        </div>

        {/* Navigation Mode Switcher & Add Button */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Segmented Mode Control */}
          <div className="bg-[#e8e8ed]/80 p-1 rounded-full flex items-center space-x-1">
            <button
              onClick={() => onModeChange('manager')}
              className={`px-3.5 py-1 text-xs font-medium rounded-full flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentMode === 'manager'
                  ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Manager</span>
            </button>
            <button
              onClick={() => onModeChange('showcase')}
              className={`px-3.5 py-1 text-xs font-medium rounded-full flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentMode === 'showcase'
                  ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Public Showcase</span>
            </button>
          </div>

          {/* Open Graph Social Share Preview Button */}
          {onOpenOgModal && (
            <button
              onClick={onOpenOgModal}
              title="Open Graph Social Link Preview"
              className="p-2 bg-white hover:bg-[#f2f2f7] text-[#515154] hover:text-[#1d1d1f] border border-black/[0.08] rounded-full shadow-xs transition-colors cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#0071e3]" />
            </button>
          )}

          {currentMode === 'manager' && onOpenSecuritySettings && (
            <button
              onClick={onOpenSecuritySettings}
              title="Change Admin PIN"
              className="p-2 bg-white hover:bg-[#f2f2f7] text-[#515154] hover:text-[#1d1d1f] border border-black/[0.08] rounded-full shadow-xs transition-colors cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-[#0071e3]" />
            </button>
          )}

          {currentMode === 'manager' && onLockAdmin && (
            <button
              onClick={onLockAdmin}
              title="Lock Admin Session"
              className="p-2 bg-white hover:bg-rose-50 text-[#515154] hover:text-rose-600 border border-black/[0.08] rounded-full shadow-xs transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onOpenAddModal}
            className="inline-flex items-center space-x-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-[#0071e3] hover:bg-[#0077ed] rounded-full shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Project</span>
          </button>
        </div>
      </div>
    </header>
  );
};

