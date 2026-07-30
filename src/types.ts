export interface Project {
  id: string;
  title: string;
  url: string;
  description?: string;
  thumbnailUrl: string;
  category: string;
  tags: string[];
  favicon: string;
  status: 'active' | 'archived';
  isFavorite: boolean;
  clickCount: number;
  createdAt: number; // timestamp in ms
  updatedAt: number; // timestamp in ms
  customThumbnail?: boolean;
}

export type CategoryFilter = 'All' | 'Web App' | 'Portfolio' | 'Tool' | 'Design' | 'Mobile' | 'Open Source' | 'Other';

export interface LinkMetadata {
  title: string;
  description: string;
  ogImage?: string;
  favicon: string;
  screenshots: {
    wordpress: string;
    microlink: string;
    thumIo: string;
  };
  suggestedCategory: string;
  suggestedTags: string[];
}
