import type { Brief } from '@/types';

export interface BriefPage {
  page_number: number;
  title: string;
  content: string;
}

export const parseBriefsContent = (content: string): Brief[] => {
  const briefRegex = /## Brief (\d+):/g;
  const matches = [...content.matchAll(briefRegex)];

  if (matches.length === 0) {
    return content
      ? [{
          id: 'brief-1',
          title: 'Brief 1',
          content,
        }]
      : [];
  }

  const briefs: Brief[] = [];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const briefNumber = match[1];
    const startIndex = match.index! + match[0].length;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index! : content.length;
    const briefContent = content.substring(startIndex, endIndex).trim();

    briefs.push({
      id: `brief-${briefNumber}`,
      title: `Brief ${briefNumber}`,
      content: `## Brief ${briefNumber}:\n\n${briefContent}`,
    });
  }

  return briefs;
};

export const combineBriefsContent = (briefs: Brief[]): string => {
  return briefs.map((brief) => brief.content).join('\n\n---\n\n');
};

export const extractBriefPages = (brief: Brief): BriefPage[] => {
  const pageRegex = /(?:^|\n)#+\s*Page\s+(\d+):\s*(.*)/gi;
  const matches = [...brief.content.matchAll(pageRegex)];

  if (matches.length === 0) {
    return [
      {
        page_number: 1,
        title: brief.title || 'Page 1',
        content: brief.content.trim(),
      },
    ];
  }

  const pages: BriefPage[] = [];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const pageNumber = Number(match[1]) || i + 1;
    const pageTitle = match[2]?.trim() || `Page ${pageNumber}`;
    const startIndex = match.index! + match[0].length;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index! : brief.content.length;
    const pageContent = brief.content.substring(startIndex, endIndex).trim();

    pages.push({
      page_number: pageNumber,
      title: pageTitle,
      content: pageContent,
    });
  }

  return pages;
};
