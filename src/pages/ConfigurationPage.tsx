import { useState } from 'react';
import { InitialConfigForm } from '@/components/Configuration';
import { useWorkflow } from '@/providers/WorkflowProvider';
import { parseFiles } from '@/lib/apiService';
import { Loader2 } from 'lucide-react';

export function ConfigurationPage() {
  const { setSourceFiles, setParsedSources, setConfiguration } = useWorkflow();
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilesChange = async (files: File[]) => {
    setSourceFiles(files);
    setError(null);
    
    if (files.length === 0) {
      setParsedSources([]);
      return;
    }

    // Parse files
    setIsParsing(true);
    try {
      const parsed = await parseFiles(files);
      setParsedSources(parsed);
    } catch (err) {
      console.error('Error parsing files:', err);
      setError('Failed to parse files. Please try again.');
      setParsedSources([]);
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Configuration</h2>
        <p className="text-muted-foreground mt-2">
          Upload files and configure your learning content generation
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {isParsing && (
        <div className="rounded-lg border bg-card p-8 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm text-muted-foreground">Parsing PDF files...</p>
        </div>
      )}

      <div className="rounded-lg border bg-card p-6">
        <InitialConfigForm 
          onFilesChange={handleFilesChange}
          onConfigSubmit={setConfiguration}
        />
      </div>
    </div>
  );
}
