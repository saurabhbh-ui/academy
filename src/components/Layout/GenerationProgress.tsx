import { Loader2 } from 'lucide-react';
import { useWorkflow } from '@/providers/WorkflowProvider';

const STAGE_LABELS: Record<string, string> = {
  configuration: 'configuration',
  outline: 'outline',
  brief: 'briefs',
  connect: 'connect tutorial',
  test_yourself: 'test yourself questions',
  exsum: 'executive summary',
};

export function GenerationProgress() {
  const { isGenerating, currentStage } = useWorkflow();

  if (!isGenerating) return null;

  const label = STAGE_LABELS[currentStage] || 'content';

  return (
    <div className="mb-4 flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
      <Loader2 className="h-4 w-4 animate-spin text-primary" />
      <div className="flex-1">
        <p className="text-sm font-medium capitalize">Generating {label}...</p>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
          <div className="h-full w-1/2 animate-pulse bg-primary" />
        </div>
      </div>
    </div>
  );
}
