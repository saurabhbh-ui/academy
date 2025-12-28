import { Button } from '@/components/UI';
import { Gauge, Ruler } from 'lucide-react';

interface QuickActionsProps {
  onAdjustLevel?: (level: 'Beginner' | 'Intermediate' | 'Advanced') => void;
  onAdjustLength?: (length: 'shortest' | 'shorter' | 'longer' | 'longest') => void;
  disabled?: boolean;
}

export function QuickActions({ onAdjustLevel, onAdjustLength, disabled }: QuickActionsProps) {
  return (
    <div className="flex flex-wrap gap-2 p-3 border-t bg-muted/20">
      {/* Level Adjustment */}
      <div className="flex items-center gap-1">
        <Gauge className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground mr-1">Level:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAdjustLevel?.('Beginner')}
          disabled={disabled}
          className="h-7 text-xs"
        >
          Beginner
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAdjustLevel?.('Intermediate')}
          disabled={disabled}
          className="h-7 text-xs"
        >
          Intermediate
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAdjustLevel?.('Advanced')}
          disabled={disabled}
          className="h-7 text-xs"
        >
          Advanced
        </Button>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Length Adjustment */}
      <div className="flex items-center gap-1">
        <Ruler className="h-4 w-4 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground mr-1">Length:</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAdjustLength?.('shortest')}
          disabled={disabled}
          className="h-7 text-xs"
        >
          Shortest
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAdjustLength?.('shorter')}
          disabled={disabled}
          className="h-7 text-xs"
        >
          Shorter
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAdjustLength?.('longer')}
          disabled={disabled}
          className="h-7 text-xs"
        >
          Longer
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onAdjustLength?.('longest')}
          disabled={disabled}
          className="h-7 text-xs"
        >
          Longest
        </Button>
      </div>
    </div>
  );
}
