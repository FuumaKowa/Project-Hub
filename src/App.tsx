import React, { useState, useEffect, useMemo } from 'react';
import { Project, CategoryFilter } from './types';
import {
  subscribeToProjects,
  addProject,
  updateProject,
  deleteProject,
  recordProjectClick,
  toggleFavorite
} from './lib/projectsService';
import { Header } from './components/Header';
import { QuickAddBar } from './components/QuickAddBar';
import { StatsOverview } from './components/StatsOverview';
import { FilterBar } from './components/FilterBar';
import { ProjectCard } from './components/ProjectCard';
import { AddProjectModal } from './components/AddProjectModal';
import { SeedDataButton } from './components/SeedDataButton';
import { Toast, ToastMessage } from './components/Toast';
import { FolderGit2, Plus, Sparkles, Loader2, SearchX } from 'lucide-react';

const CATEGORIES: CategoryFilter[] = [
  'All',
  'Web App',
  'Portfolio',
  'Tool',
  'Design',
  'Mobile',
  'Open Source',
  'Other',
];

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [quickAddUrl, setQuickAddUrl] = useState('');
  const [isQuickAnalyzing, setIsQuickAnalyzing] = useState(false);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'clicks' | 'alphabetical' | 'favorites'>('newest');
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: Date.now().toString(), text, type });
  };

  // Real-time Firestore sync
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToProjects(
      (updatedProjects) => {
        setProjects(updatedProjects);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore listener error:', err);
        setLoading(false);
        showToast('Connected in offline mode or error reading Firestore', 'info');
      }
    );

    return () => unsubscribe();
  }, []);

  // Quick Add Trigger from Top Bar
  const handleQuickAdd = async (url: string) => {
    setQuickAddUrl(url);
    setIsAddModalOpen(true);
  };

  // Open Project Link in NEW TAB & record click
  const handleOpenProject = async (project: Project) => {
    // 1. Open in new tab immediately
    window.open(project.url, '_blank', 'noopener,noreferrer');

    // 2. Increment click count in Firestore
    try {
      await recordProjectClick(project.id);
    } catch (err) {
      console.error('Click counter update error:', err);
    }

    showToast(`Redirected to "${project.title}" in new tab`, 'info');
  };

  // Toggle Favorite Star
  const handleToggleFavorite = async (id: string, current: boolean) => {
    try {
      await toggleFavorite(id, current);
      showToast(current ? 'Removed from favorites' : 'Pinned to favorites');
    } catch (err) {
      showToast('Failed to update favorite status', 'error');
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Are you sure you want to remove this project link from your Hub?')) {
      try {
        await deleteProject(id);
        showToast('Project deleted');
      } catch (err) {
        showToast('Failed to delete project', 'error');
      }
    }
  };

  // Save (Create / Update) Project
  const handleSaveProject = async (
    projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'clickCount'>
  ) => {
    if (editingProject) {
      await updateProject(editingProject.id, projectData);
      showToast(`Updated "${projectData.title}"`);
    } else {
      await addProject(projectData);
      showToast(`Added "${projectData.title}" to Project Hub!`);
    }
    setEditingProject(null);
    setQuickAddUrl('');
  };

  // Re-peek and refresh screenshot
  const handleRefreshThumbnail = async (project: Project) => {
    showToast(`Re-peeking into ${project.url}...`, 'info');
    try {
      const res = await fetch('/api/analyze-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: project.url }),
      });

      if (res.ok) {
        const data = await res.json();
        const newThumb = data.screenshots.wordpress || project.thumbnailUrl;
        const newFavicon = data.favicon || project.favicon;

        await updateProject(project.id, {
          thumbnailUrl: `${newThumb}&refresh=${Date.now()}`,
          favicon: newFavicon,
          title: data.title || project.title,
        });
        showToast(`Screenshot thumbnail refreshed for "${project.title}"`);
      }
    } catch (err) {
      showToast('Could not refresh thumbnail screenshot', 'error');
    }
  };

  // Filtered and Sorted Projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        // Search query filter
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          p.title.toLowerCase().includes(query) ||
          p.url.toLowerCase().includes(query) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          p.tags.some((t) => t.toLowerCase().includes(query));

        // Category filter
        const matchesCategory =
          selectedCategory === 'All' || p.category === selectedCategory;

        // Favorites filter
        const matchesFavorites = !favoritesOnly || p.isFavorite;

        return matchesQuery && matchesCategory && matchesFavorites;
      })
      .sort((a, b) => {
        if (sortBy === 'favorites') {
          if (a.isFavorite !== b.isFavorite) return a.isFavorite ? -1 : 1;
          return b.createdAt - a.createdAt;
        }
        if (sortBy === 'clicks') {
          return (b.clickCount || 0) - (a.clickCount || 0);
        }
        if (sortBy === 'alphabetical') {
          return a.title.localeCompare(b.title);
        }
        // default newest
        return b.createdAt - a.createdAt;
      });
  }, [projects, searchQuery, selectedCategory, sortBy, favoritesOnly]);

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased pb-16">
      {/* Top Bar */}
      <Header
        onOpenAddModal={() => {
          setEditingProject(null);
          setQuickAddUrl('');
          setIsAddModalOpen(true);
        }}
        totalProjects={projects.length}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Quick Add Bar & Thumbnail Generator */}
        <QuickAddBar onQuickAdd={handleQuickAdd} isAnalyzing={isQuickAnalyzing} />

        {/* Stats Summary */}
        <StatsOverview projects={projects} />

        {/* Search, Filter & Sort Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          favoritesOnly={favoritesOnly}
          onToggleFavoritesOnly={() => setFavoritesOnly(!favoritesOnly)}
          categories={CATEGORIES}
        />

        {/* Projects Grid / Content States */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-neutral-400">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500 mb-3" />
            <p className="text-sm font-mono font-bold uppercase tracking-wider">Loading your Project Hub...</p>
          </div>
        ) : filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onOpen={handleOpenProject}
                onToggleFavorite={handleToggleFavorite}
                onEdit={(p) => {
                  setEditingProject(p);
                  setIsAddModalOpen(true);
                }}
                onDelete={handleDeleteProject}
                onRefreshThumbnail={handleRefreshThumbnail}
              />
            ))}
          </div>
        ) : projects.length > 0 ? (
          /* Search/Filter No Results */
          <div className="bg-[#111111] border-2 border-neutral-800 p-12 text-center max-w-md mx-auto my-8">
            <SearchX className="w-10 h-10 text-neutral-500 mx-auto mb-3" />
            <h3 className="text-base font-black uppercase tracking-wider text-white mb-1">No matching projects</h3>
            <p className="text-xs text-neutral-400 font-mono mb-4">
              Try adjusting your search terms or clearing your category filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setFavoritesOnly(false);
              }}
              className="px-4 py-2 bg-[#222222] hover:bg-[#2a2a2a] text-rose-400 border border-neutral-700 font-mono font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Initial Empty Hub State */
          <div className="bg-[#111111] border-2 border-dashed border-neutral-800 p-12 text-center max-w-xl mx-auto my-8 shadow-2xl">
            <div className="w-16 h-16 bg-[#1a1a1a] border border-neutral-700 text-rose-500 flex items-center justify-center mx-auto mb-4 font-bold">
              <FolderGit2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-2">
              Your Project Hub is Empty
            </h3>
            <p className="text-xs text-neutral-400 font-mono mb-6 leading-relaxed">
              Store all your web projects, apps, and repositories in one central dashboard. Each project button automatically peeks into the link and captures a live screenshot thumbnail.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  setEditingProject(null);
                  setQuickAddUrl('');
                  setIsAddModalOpen(true);
                }}
                className="w-full sm:w-auto px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider border border-rose-500 transition-colors cursor-pointer flex items-center justify-center space-x-2 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Your First Project</span>
              </button>
              <SeedDataButton />
            </div>
          </div>
        )}
      </main>

      {/* Modal for Adding / Editing Project */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingProject(null);
          setQuickAddUrl('');
        }}
        onSave={handleSaveProject}
        initialUrl={quickAddUrl}
        initialData={editingProject}
      />

      {/* Floating Toast notifications */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
