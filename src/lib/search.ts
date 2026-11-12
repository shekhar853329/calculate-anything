import Fuse from 'fuse.js';
import type { Tool } from '@/data/tools';

let fuse: Fuse<Tool> | null = null;

export function initSearch(tools: Tool[]) {
  fuse = new Fuse(tools, {
    keys: ['name', 'description', 'keywords', 'category'],
    threshold: 0.35,
    includeScore: true,
  });
}

export function searchTools(query: string, tools: Tool[]): Tool[] {
  if (!query.trim()) return tools;
  if (!fuse) initSearch(tools);
  return fuse!.search(query).map(r => r.item);
}
