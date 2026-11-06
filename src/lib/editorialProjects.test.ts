import { test } from 'node:test';
import assert from 'node:assert/strict';
import { selectEditorialProjects } from './editorialProjects';
import type { Project } from '../types';

const project = (id: string, createdAt: number, extra: Partial<Project> = {}): Project => ({
  id, createdAt, updatedAt: createdAt, title: id, url: `https://example.com/${id}`,
  tags: [], category: 'Web App', thumbnailUrl: '', favicon: '', status: 'active', isFavorite: false, clickCount: 0, ...extra,
});
test('only active projects are selected; pinned projects lead and newest follows', () => {
  const input = [project('new', 30), project('archived', 50, {status:'archived',isFavorite:true}), project('pinned', 1, {isFavorite:true}), project('old', 2)];
  const original = [...input];
  const result = selectEditorialProjects(input, 2);
  assert.deepEqual(result.featured.map(p => p.id), ['pinned', 'new']);
  assert.deepEqual(result.index.map(p => p.id), ['old']);
  assert.equal(result.total, 3);
  assert.deepEqual(input, original);
});
test('ties are stable and every active record appears exactly once', () => {
  const input = Array.from({length:10}, (_, i) => project(String(i), 1));
  const result = selectEditorialProjects(input);
  assert.equal(result.featured.length, 4);
  assert.deepEqual([...result.featured, ...result.index].map(p => p.id), input.map(p => p.id));
});
test('an empty collection has no fabricated entries', () => {
  assert.deepEqual(selectEditorialProjects([]), {featured:[],index:[],total:0});
});
