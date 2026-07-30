import React, { useState } from 'react';
import { addProject } from '../lib/projectsService';
import { Sparkles, Loader2 } from 'lucide-react';

interface SeedDataButtonProps {
  onSeeded?: () => void;
}

const SAMPLE_PROJECTS = [
  {
    title: 'React Official Documentation',
    url: 'https://react.dev',
    description: 'The library for web and native user interfaces built by Meta and community.',
    category: 'Open Source',
    tags: ['react', 'frontend', 'javascript', 'ui'],
    thumbnailUrl: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Freact.dev?w=1280&h=800',
    favicon: 'https://www.google.com/s2/favicons?domain=react.dev&sz=128',
    status: 'active' as const,
    isFavorite: true,
  },
  {
    title: 'Tailwind CSS Framework',
    url: 'https://tailwindcss.com',
    description: 'A utility-first CSS framework packed with classes that can be composed to build any design.',
    category: 'Design',
    tags: ['tailwind', 'css', 'design', 'styling'],
    thumbnailUrl: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Ftailwindcss.com?w=1280&h=800',
    favicon: 'https://www.google.com/s2/favicons?domain=tailwindcss.com&sz=128',
    status: 'active' as const,
    isFavorite: true,
  },
  {
    title: 'Vite Frontend Tooling',
    url: 'https://vite.dev',
    description: 'Next Generation Frontend Tooling providing fast development server and bundle optimization.',
    category: 'Tool',
    tags: ['vite', 'bundler', 'build', 'performance'],
    thumbnailUrl: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fvite.dev?w=1280&h=800',
    favicon: 'https://www.google.com/s2/favicons?domain=vite.dev&sz=128',
    status: 'active' as const,
    isFavorite: false,
  },
  {
    title: 'Figma Design System',
    url: 'https://figma.com',
    description: 'Collaborative web application for interface design, wireframing, and vector graphics.',
    category: 'Design',
    tags: ['design', 'ui', 'ux', 'prototyping'],
    thumbnailUrl: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Ffigma.com?w=1280&h=800',
    favicon: 'https://www.google.com/s2/favicons?domain=figma.com&sz=128',
    status: 'active' as const,
    isFavorite: false,
  },
  {
    title: 'Vercel Cloud Deployment',
    url: 'https://vercel.com',
    description: 'Build, deploy, and scale modern web applications with zero configuration.',
    category: 'Web App',
    tags: ['hosting', 'cloud', 'deployment', 'serverless'],
    thumbnailUrl: 'https://s.wordpress.com/mshots/v1/https%3A%2F%2Fvercel.com?w=1280&h=800',
    favicon: 'https://www.google.com/s2/favicons?domain=vercel.com&sz=128',
    status: 'active' as const,
    isFavorite: false,
  },
];

export const SeedDataButton: React.FC<SeedDataButtonProps> = ({ onSeeded }) => {
  const [loading, setLoading] = useState(false);

  const handleSeed = async () => {
    setLoading(true);
    try {
      for (const proj of SAMPLE_PROJECTS) {
        await addProject(proj);
      }
      if (onSeeded) onSeeded();
    } catch (err) {
      console.error('Failed to seed sample projects:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSeed}
      disabled={loading}
      className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#222222] hover:bg-[#2c2c2c] text-rose-400 font-mono font-bold text-xs uppercase tracking-wider border border-neutral-700 transition-colors cursor-pointer disabled:opacity-50"
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>Seeding Demo Projects...</span>
        </>
      ) : (
        <>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Load Starter Projects</span>
        </>
      )}
    </button>
  );
};
