import type { Brief } from '@/types';

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
