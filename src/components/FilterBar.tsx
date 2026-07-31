import React from 'react';
import { CategoryFilter } from '../types';
import { Search, SlidersHorizontal, Star, LayoutGrid, List } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: CategoryFilter;
  onCategoryChange: (cat: CategoryFilter) => void;
  sortBy: 'newest' | 'clicks' | 'alphabetical' | 'favorites';
  onSortChange: (sort: 'newest' | 'clicks' | 'alphabetical' | 'favorites') => void;
  favoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  categories: CategoryFilter[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  favoritesOnly,
  onToggleFavoritesOnly,
  categories,
}) => {
  return (
    <div className="space-y-4 mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#86868b]">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects by title, link, tag, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-black/[0.08] focus:border-[#0071e3] rounded-full text-sm text-[#1d1d1f] placeholder-[#86868b] focus:outline-none transition-all shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-2">
          {/* Favorites Only toggle */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`px-3.5 py-2 rounded-full border text-xs font-semibold flex items-center space-x-1.5 cursor-pointer transition-all ${
              favoritesOnly
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-white text-[#515154] border-black/[0.08] hover:bg-[#f2f2f7]'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${favoritesOnly ? 'fill-white' : 'text-amber-500'}`} />
            <span>Favorites</span>
          </button>

          {/* Sort Select */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as any)}
              className="px-3.5 py-2 bg-white border border-black/[0.08] text-[#1d1d1f] text-xs font-semibold rounded-full focus:outline-none focus:border-[#0071e3] cursor-pointer shadow-2xs"
            >
              <option value="newest">Newest First</option>
              <option value="favorites">Favorites First</option>
              <option value="clicks">Most Clicked</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Segmented Control Pills */}
      <div className="bg-[#e8e8ed]/80 p-1 rounded-2xl flex items-center space-x-1 overflow-x-auto scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-all ${
                isActive
                  ? 'bg-white text-[#1d1d1f] shadow-xs font-semibold'
                  : 'text-[#6e6e73] hover:text-[#1d1d1f]'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
};
