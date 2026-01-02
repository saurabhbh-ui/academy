import { apiClient, streamSSE } from './api';
import type { SourceDocument, Message, BriefInstructions } from '@/types';

// File parsing
export async function parseFiles(files: File[]): Promise<SourceDocument[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('file', file);
  });

  const response = await apiClient.post('/api/io/parse', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

// Chat completion with streaming
export async function* chatCompletion(data: {
  messages: Message[];
  artifact: string;
  source: SourceDocument[] | SourceDocument;
  stage?: string;
  config?: {
    title: string;
    tone: string;
    briefCount: string;
    sectionsToHighlight?: string;
    sectionsToExclude?: string;
  };
  briefInstructions?: BriefInstructions;
}) {
  const sourceArray = Array.isArray(data.source) ? data.source : [data.source];
  const normalizedSource = sourceArray.map((src) => ({
    fileType: src.fileType || src.name || '.pdf',
    content: src.content,
    figures: src.figures || [],
  }));

  const payload = {
    ...data,
    source: normalizedSource,
  };

  yield* streamSSE('/api/chat/completion', payload);
}

// Adjust length
export async function* adjustLength(data: {
  newLength: 'shortest' | 'shorter' | 'longer' | 'longest';
  messages: Message[];
  artifact: string;
  source: SourceDocument[];
}) {
  yield* streamSSE('/api/refine/adjust-length', data);
}

// Adjust level
export async function* adjustLevel(data: {
  newLevel: 'Beginner' | 'Intermediate' | 'Advanced';
  messages: Message[];
  artifact: string;
  source: SourceDocument[];
}) {
  yield* streamSSE('/api/refine/adjust-level', data);
}

// Update selection (inline editing)
export async function* updateSelection(data: {
  query: string;
  artifactChunk: {
    block: string;
    selection: string;
  };
  source: SourceDocument[];
}) {
  yield* streamSSE('/api/refine/update-selection', data);
}

// Export artifact
export async function exportArtifact(content: string): Promise<Blob> {
  const response = await apiClient.post(
    '/api/io/export-artifact',
    { content },
    {
      responseType: 'blob',
    }
  );

  return response.data;
}

// Import artifact
export async function importArtifact(file: File): Promise<{ content: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await apiClient.post('/api/io/import-artifact', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}
