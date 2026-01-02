import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WorkflowLayout } from '@/components/Layout';
import { Canvas } from '@/components/Canvas';
import { ChatPanel } from '@/components/Chat';
import { Button } from '@/components/UI';
import { useWorkflow } from '@/providers/WorkflowProvider';
import { chatCompletion } from '@/lib/apiService';
import { apiClient } from '@/lib/api';
import { Loader2 } from 'lucide-react';

export function BriefsPage() {
  const { index } = useParams<{ index?: string }>();
  const navigate = useNavigate();
  const numericIndex = index ? Number(index) : 0;
  
  const { briefsData, setBriefsData, setCurrentStage, configuration } = useWorkflow();

  useEffect(() => {
    setCurrentStage('brief');
    
    // Auto-redirect to /briefs/1 if no index
    if (!numericIndex) {
      navigate('/briefs/1', { replace: true });
      return;
    }
  }, [numericIndex, navigate, setCurrentStage]);

  // If invalid index, redirect
  if (Number.isNaN(numericIndex) || numericIndex < 1) {
    navigate('/briefs/1', { replace: true });
    return null;
  }

  // Get total number of briefs from configuration
  const totalBriefs = typeof configuration?.numberOfBriefs === 'number' 
    ? configuration.numberOfBriefs 
    : 1;

  const onNext = () => {
    if (numericIndex === totalBriefs) {
      // Last brief - go to connect config
      navigate('/connect-configuration');
    } else {
      // More briefs to go - navigate to next
      navigate(`/briefs/${numericIndex + 1}`);
    }
  };

  const onPrevious = () => {
    if (numericIndex > 1) {
      navigate(`/briefs/${numericIndex - 1}`);
    } else {
      navigate('/outline');
    }
  };

  return (
    <IndividualBrief
      key={numericIndex}
      briefIndex={numericIndex - 1}
      briefsData={briefsData}
      setBriefsData={setBriefsData}
      totalBriefs={totalBriefs}
      onNext={onNext}
      onPrevious={onPrevious}
    />
  );
}

// Individual Brief Component
function IndividualBrief({
  briefIndex,
  briefsData,
  setBriefsData,
  totalBriefs,
  onNext,
  onPrevious,
}: {
  briefIndex: number;
  briefsData: Array<{ content: string; title: string }> | null;
  setBriefsData: (data: Array<{ content: string; title: string }>) => void;
  totalBriefs: number;
  onNext: () => void;
  onPrevious: () => void;
}) {
  const {
    parsedSources,
    configuration,
    outlineContent,
    setIsGenerating,
  } = useWorkflow();

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const [hasTriedGeneration, setHasTriedGeneration] = useState(false);

  const currentBrief = briefsData?.[briefIndex];

  const generateThisBrief = useCallback(async () => {
    console.log('🔍 generateThisBrief called for index:', briefIndex);
    console.log('📊 Current state:', { 
      hasConfiguration: !!configuration, 
      hasOutline: !!outlineContent,
      sourcesCount: parsedSources.length,
      briefsDataLength: briefsData?.length || 0
    });

    if (!configuration || !outlineContent || !parsedSources.length) {
      console.error('❌ Missing prerequisites:', { 
        configuration: !!configuration, 
        outlineContent: !!outlineContent,
        parsedSources: parsedSources.length 
      });
      setIsInitializing(false);
      return;
    }

    setIsGenerating(true);
    setIsLoading(true);
    setIsInitializing(true);
    setHasTriedGeneration(true);

    try {
      console.log('📤 Extracting brief instructions...');
      // Extract instructions first
      const extractResponse = await apiClient.post('/api/brief/extract-instructions', {
        config: {
          title: configuration.title,
          tone: configuration.tone,
          brief_count: configuration.numberOfBriefs,
          sections_to_highlight: configuration.sectionsToHighlight || '',
          sections_to_exclude: configuration.sectionsToExclude || '',
        },
        outline_artifact: {
          content: outlineContent,
        },
      });

      console.log('✅ Brief instructions extracted:', extractResponse.data.briefs.length);
      const briefInstructions = extractResponse.data.briefs;
      const currentInstruction = briefInstructions[briefIndex];

      if (!currentInstruction) {
        throw new Error(`Brief instruction not found for index ${briefIndex}`);
      }

      console.log(`📤 Generating brief ${briefIndex + 1}...`);
      // Generate this specific brief
      const response = await apiClient.post('/api/brief/generate', {
        source: parsedSources,
        brief_instructions: currentInstruction,
      });

      console.log(`✅ Brief ${briefIndex + 1} generated successfully!`);
      // Update briefs data array
      const newBriefsData = [...(briefsData || [])];
      newBriefsData[briefIndex] = {
        content: response.data.content,
        title: `Brief ${briefIndex + 1}`,
      };
      setBriefsData(newBriefsData);

      setMessages([{ role: 'assistant', content: `Brief ${briefIndex + 1} generated successfully!` }]);
    } catch (error) {
      console.error('❌ Error generating brief:', error);
      setMessages([{ role: 'assistant', content: 'Sorry, there was an error generating this brief.' }]);
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
      setIsInitializing(false);
    }
  }, [briefIndex, configuration, outlineContent, parsedSources, briefsData, setBriefsData, setIsGenerating]);

  useEffect(() => {
    // Reset generation flag when index changes
    setHasTriedGeneration(false);
  }, [briefIndex]);

  useEffect(() => {
    console.log('🔄 useEffect triggered:', { 
      briefIndex, 
      hasBrief: !!currentBrief,
      briefsDataExists: !!briefsData,
      briefsDataLength: briefsData?.length || 0,
      hasTriedGeneration
    });
    
    if (!currentBrief && !hasTriedGeneration && !isLoading) {
      console.log('🚀 No brief found and haven\'t tried generation yet, triggering generation...');
      generateThisBrief();
    } else if (currentBrief) {
      console.log('✅ Brief already exists, skipping generation');
      setIsInitializing(false);
    } else if (hasTriedGeneration && !currentBrief) {
      console.log('⚠️ Generation was tried but brief still not available');
      setIsInitializing(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [briefIndex, briefsData, hasTriedGeneration, isLoading]); // Depend on briefIndex and briefsData

  const handleSendMessage = async (message: string) => {
    if (!parsedSources.length || !currentBrief) return;

    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);

    try {
      let response = '';
      let updatedArtifact = currentBrief.content;
      
      const generator = chatCompletion({
        messages: [...messages, { role: 'user', content: message }],
        artifact: currentBrief.content,
        source: parsedSources,
        stage: 'brief',
      });

      for await (const chunk of generator) {
        if (chunk.content) response += chunk.content;
        if (chunk.artifact) updatedArtifact = chunk.artifact;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: response || 'Content updated successfully.' }]);
      
      if (updatedArtifact !== currentBrief.content) {
        const newBriefsData = [...(briefsData || [])];
        newBriefsData[briefIndex] = { ...currentBrief, content: updatedArtifact };
        setBriefsData(newBriefsData);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustLength = async (length: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: `Adjusting length to ${length}...` }]);
    // TODO: Implement length adjustment
  };

  const handleAdjustLevel = async (level: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: `Adjusting level to ${level}...` }]);
    // TODO: Implement level adjustment
  };

  const handleExport = () => {
    console.log('Export brief');
  };

  const handleImport = () => {
    console.log('Import brief');
  };

  if (isInitializing) {
    return (
      <WorkflowLayout
        title={`Brief ${briefIndex + 1}`}
        description="Generating brief content..."
        canvas={
          <div className="flex items-center justify-center h-full border rounded-lg bg-card">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Generating Brief {briefIndex + 1}...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
            </div>
          </div>
        }
        chat={<div></div>}
        actions={<div></div>}
      />
    );
  }

  if (!currentBrief) {
    return (
      <WorkflowLayout
        title={`Brief ${briefIndex + 1}`}
        description="Brief not found"
        canvas={
          <div className="flex items-center justify-center h-full border rounded-lg bg-card">
            <div className="text-center">
              <p className="text-lg font-medium">Brief not available</p>
              <Button onClick={generateThisBrief} className="mt-4">Generate Brief</Button>
            </div>
          </div>
        }
        chat={<div></div>}
        actions={<div></div>}
      />
    );
  }


  return (
    <WorkflowLayout
      title={currentBrief.title || `Brief ${briefIndex + 1}`}
      description="Review and refine this brief"
      canvas={
        <Canvas
          content={currentBrief.content}
          onChange={(newContent) => {
            const newBriefsData = [...(briefsData || [])];
            newBriefsData[briefIndex] = { ...currentBrief, content: newContent };
            setBriefsData(newBriefsData);
          }}
          onExport={handleExport}
          onImport={handleImport}
        />
      }
      chat={
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          onAdjustLevel={handleAdjustLevel}
          onAdjustLength={handleAdjustLength}
          placeholder="Ask AI to refine this brief..."
          isLoading={isLoading}
        />
      }
      actions={
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onPrevious}>
            {briefIndex > 0 ? '← Previous Brief' : '← Back to Outline'}
          </Button>
          
          <div className="text-sm text-muted-foreground">
            Brief {briefIndex + 1} of {totalBriefs}
          </div>
          
          <Button onClick={onNext}>
            {briefIndex < totalBriefs - 1 ? 'Next Brief →' : 'Continue to Connect Config →'}
          </Button>
        </div>
      }
    />
  );
}
