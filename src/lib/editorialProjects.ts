import type { Project } from '../types';

export function selectEditorialProjects(projects: Project[], limit = 4) {
  const active = projects.filter(project => project.status === 'active').sort((a, b) =>
    Number(b.isFavorite) - Number(a.isFavorite) || b.createdAt - a.createdAt);
  return { featured: active.slice(0, limit), index: active.slice(limit), total: active.length };
}
