import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { GenerationProgress } from './GenerationProgress';

interface WorkflowLayoutProps {
  title: string;
  description?: string;
  canvas: ReactNode;
  chat?: ReactNode;
  actions?: ReactNode;
  showChat?: boolean;
}

export function WorkflowLayout({
  title,
  description,
  canvas,
  chat,
  actions,
  showChat = true,
}: WorkflowLayoutProps) {
  return (
    <div className="flex flex-col h-full max-w-full">
      <GenerationProgress />
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground mt-2">{description}</p>}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Canvas Area */}
        <div className={cn('flex-1 min-w-0', showChat ? 'w-2/3' : 'w-full')}>
          {canvas}
        </div>

        {/* Chat Panel */}
        {showChat && chat && (
          <div className="w-1/3 min-w-[300px] max-w-md">
            {chat}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {actions && <div className="mt-6">{actions}</div>}
    </div>
  );
}
