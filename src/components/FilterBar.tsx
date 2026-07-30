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
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects by title, link, tag, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/80 focus:border-indigo-500 rounded-xl text-sm text-slate-900 focus:outline-none transition-colors shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-2">
          {/* Favorites Only toggle */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`px-3 py-2.5 rounded-xl border text-xs font-medium flex items-center space-x-1.5 cursor-pointer transition-all ${
              favoritesOnly
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200/80 hover:bg-slate-50'
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
              className="px-3 py-2.5 bg-white border border-slate-200/80 text-slate-700 text-xs font-medium rounded-xl focus:outline-none focus:border-indigo-500 cursor-pointer shadow-2xs"
            >
              <option value="newest">Newest First</option>
              <option value="favorites">Favorites First</option>
              <option value="clicks">Most Clicked</option>
              <option value="alphabetical">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200/80 hover:bg-slate-50'
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
