// This file is auto-updated when new wikis are published
export interface WikiMetadata {
  slug: string;
  owner: string;
  repo: string;
  title: string;
  description: string;
  generatedAt: string;
  pageCount: number;
  url: string;
}

export const wikis: WikiMetadata[] = [
  {
    "slug": "aqureshiest-nano-task-manager",
    "owner": "aqureshiest",
    "repo": "nano-task-manager",
    "title": "aqureshiest/nano-task-manager",
    "description": "# Nano Task Manager - Repository Knowledge\n\n## Project Identity\nMinimal educational task management web app demonstrating basic Flask + vanilla JS architecture.",
    "generatedAt": "2026-03-03",
    "pageCount": 9,
    "url": "/wikis/aqureshiest-nano-task-manager/"
  }
];

export default {
  load() {
    return wikis;
  }
};
