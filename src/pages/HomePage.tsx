import { Button } from '@/components/UI';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold tracking-tight mb-4">Welcome to FSI AIcademy</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        Transform your documents into interactive learning content
      </p>
      
      <div className="flex flex-col gap-4 w-full max-w-md">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold mb-2">Start New Workflow</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create a new tutorial from your documents
          </p>
          <Button 
            className="w-full" 
            onClick={() => navigate('/configuration')}
          >
            Get Started →
          </Button>
        </div>
      </div>
    </div>
  );
}
