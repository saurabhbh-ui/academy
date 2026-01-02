import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WorkflowLayout } from '@/components/Layout';
import { Canvas } from '@/components/Canvas';
import { ChatPanel } from '@/components/Chat';
import { Button } from '@/components/UI';
import { ConnectConfigForm } from '@/components/Configuration';
import { useWorkflow } from '@/providers/WorkflowProvider';
import { chatCompletion, adjustLength, adjustLevel } from '@/lib/apiService';
import { apiClient } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { parseBriefsContent, combineBriefsContent } from '@/lib/briefs';
import type { ConnectConfiguration } from '@/types';

// ============================================================================
// OUTLINE PAGE - Fully Integrated
// ============================================================================
export function OutlinePage() {
  const navigate = useNavigate();
  const {
    parsedSources,
    configuration,
    outlineContent,
    setOutlineContent,
    setIsGenerating,
    setCurrentStage,
  } = useWorkflow();

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setCurrentStage('outline');
    if (!outlineContent && parsedSources.length > 0 && configuration) {
      generateOutline();
    } else {
      setIsInitializing(false);
    }
  }, []);

  const generateOutline = async () => {
    if (!configuration || parsedSources.length === 0) {
      console.error('Missing configuration or sources');
      setIsInitializing(false);
      return;
    }

    setIsGenerating(true);
    setIsLoading(true);
    setIsInitializing(true);
    
    try {
      const response = await apiClient.post('/api/outline/generate', {
        source: parsedSources,
        config: {
          title: configuration.title,
          tone: configuration.tone,
          brief_count: configuration.numberOfBriefs,
          sections_to_highlight: configuration.sectionsToHighlight || '',
          sections_to_exclude: configuration.sectionsToExclude || '',
        },
      });

      setOutlineContent(response.data.content);
      setMessages([{ role: 'assistant', content: response.data.response.content }]);
    } catch (error) {
      console.error('Error generating outline:', error);
      setMessages([{ role: 'assistant', content: 'Sorry, there was an error generating the outline. Please check your backend connection.' }]);
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
      setIsInitializing(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!parsedSources.length || !configuration) return;

    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);

    try {
      let response = '';
      let updatedArtifact = outlineContent;
      
      const generator = chatCompletion({
        messages: [...messages, { role: 'user', content: message }],
        artifact: outlineContent,
        source: parsedSources,
        stage: 'outline',
        config: {
          title: configuration.title,
          tone: configuration.tone,
          brief_count: configuration.numberOfBriefs,
          sections_to_highlight: configuration.sectionsToHighlight || '',
          sections_to_exclude: configuration.sectionsToExclude || '',
        },
      });

      for await (const chunk of generator) {
        if (chunk.content) response += chunk.content;
        if (chunk.artifact) updatedArtifact = chunk.artifact;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: response || 'Content updated successfully.' }]);
      if (updatedArtifact !== outlineContent) setOutlineContent(updatedArtifact);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustLevel = async (level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    if (!parsedSources.length || !currentBrief) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: `Adjust to ${level} level` }]);

    try {
      let newContent = '';
      const generator = adjustLevel({
        newLevel: level,
        messages,
        artifact: outlineContent,
        source: parsedSources,
      });

      for await (const chunk of generator) {
        if (chunk.content) newContent = chunk.content;
      }

      if (newContent) {
        setOutlineContent(newContent);
        setMessages((prev) => [...prev, { role: 'assistant', content: `Content adjusted to ${level} level.` }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error adjusting the level.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustLength = async (length: 'shortest' | 'shorter' | 'longer' | 'longest') => {
    if (!parsedSources.length || !currentBrief) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: `Make it ${length}` }]);

    try {
      let newContent = '';
      const generator = adjustLength({
        newLength: length,
        messages,
        artifact: outlineContent,
        source: parsedSources,
      });

      for await (const chunk of generator) {
        if (chunk.content) newContent = chunk.content;
      }

      if (newContent) {
        setOutlineContent(newContent);
        setMessages((prev) => [...prev, { role: 'assistant', content: `Content made ${length}.` }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error adjusting the length.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    console.log('Export outline');
  };

  const handleImport = () => {
    console.log('Import outline');
  };

  if (!parsedSources.length || !configuration) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-2">No Configuration Found</h2>
        <p className="text-muted-foreground mb-4">Please complete the configuration step first.</p>
        <Button onClick={() => navigate('/configuration')}>Go to Configuration</Button>
      </div>
    );
  }

  return (
    <WorkflowLayout
      title="Outline"
      description="Review and refine the generated content outline"
      canvas={
        isInitializing ? (
          <div className="flex items-center justify-center h-full border rounded-lg bg-card">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Generating outline...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
            </div>
          </div>
        ) : (
          <Canvas
            content={outlineContent}
            onChange={setOutlineContent}
            onExport={handleExport}
            onImport={handleImport}
          />
        )
      }
      chat={
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          onAdjustLevel={handleAdjustLevel}
          onAdjustLength={handleAdjustLength}
          placeholder="Ask AI to refine the outline..."
          isLoading={isLoading}
        />
      }
      actions={
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/configuration')}>
            ← Back to Configuration
          </Button>
          <Button onClick={() => navigate('/briefs/1')} disabled={!outlineContent || isInitializing}>
            Continue to Briefs →
          </Button>
        </div>
      }
    />
  );
}

// ============================================================================
// BRIEFS PAGE - Fully Integrated
// ============================================================================
export function BriefsPage() {
  const navigate = useNavigate();
  const { index } = useParams<{ index?: string }>();
  
  const {
    parsedSources,
    configuration,
    outlineContent,
    briefsContent,
    briefs,
    setBriefsContent,
    setBriefs,
    setIsGenerating,
    setCurrentStage,
  } = useWorkflow();

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [generatingBriefIndex, setGeneratingBriefIndex] = useState(0);
  const [totalBriefs, setTotalBriefs] = useState(0);

  const currentBriefIndex = useMemo(() => {
    if (!index) return 0;
    const numericIndex = Number(index);
    return Number.isNaN(numericIndex) ? 0 : numericIndex - 1;
  }, [index]);

  const currentBrief = briefs[currentBriefIndex];

  useEffect(() => {
    setCurrentStage('brief');
    
    if (!briefsContent && outlineContent && parsedSources.length > 0 && configuration) {
      generateBriefs();
    } else {
      setIsInitializing(false);
      if (briefsContent && briefs.length === 0) {
        setBriefs(parseBriefsContent(briefsContent));
      }
    }
  }, []);

  useEffect(() => {
    if (briefsContent && briefs.length === 0) {
      setBriefs(parseBriefsContent(briefsContent));
    }
  }, [briefsContent, briefs.length, setBriefs]);

  useEffect(() => {
    if (briefs.length === 0) return;

    if (!index || Number.isNaN(Number(index)) || currentBriefIndex < 0) {
      navigate('/briefs/1', { replace: true });
      return;
    }

    if (currentBriefIndex >= briefs.length) {
      navigate(`/briefs/${briefs.length}`, { replace: true });
    }
  }, [briefs.length, currentBriefIndex, index, navigate]);

  const generateBriefs = async () => {
    if (!configuration || !outlineContent || parsedSources.length === 0) {
      console.error('Missing configuration, outline, or sources');
      setIsInitializing(false);
      return;
    }

    setIsGenerating(true);
    setIsLoading(true);
    setIsInitializing(true);

    try {
      // Step 1: Extract brief instructions from outline
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

      const briefInstructions = extractResponse.data.briefs;
      setTotalBriefs(briefInstructions.length);

      // Step 2: Generate each brief
      const generatedBriefs = [];
      for (let i = 0; i < briefInstructions.length; i++) {
        setGeneratingBriefIndex(i + 1);
        
        const response = await apiClient.post('/api/brief/generate', {
          source: parsedSources,
          brief_instructions: briefInstructions[i],
        });

        const title =
          briefInstructions[i]?.title ||
          briefInstructions[i]?.sectionTitle ||
          `Brief ${i + 1}`;

        generatedBriefs.push({
          id: `brief-${i + 1}`,
          title,
          content: response.data.content,
        });

        setBriefs([...generatedBriefs]);
        setBriefsContent(combineBriefsContent(generatedBriefs));
      }

      setBriefs(generatedBriefs);
      setBriefsContent(combineBriefsContent(generatedBriefs));
      setMessages([{ role: 'assistant', content: `Successfully generated ${briefInstructions.length} briefs!` }]);
      
      // Navigate to first brief after generation
      navigate('/briefs/1');
    } catch (error) {
      console.error('Error generating briefs:', error);
      setMessages([{ role: 'assistant', content: 'Sorry, there was an error generating the briefs. Please check your backend connection.' }]);
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
      setIsInitializing(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!parsedSources.length || !configuration || !currentBrief) return;

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
        config: {
          title: configuration.title,
          tone: configuration.tone,
          brief_count: configuration.numberOfBriefs,
          sections_to_highlight: configuration.sectionsToHighlight || '',
          sections_to_exclude: configuration.sectionsToExclude || '',
        },
      });

      for await (const chunk of generator) {
        if (chunk.content) response += chunk.content;
        if (chunk.artifact) updatedArtifact = chunk.artifact;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: response || 'Content updated successfully.' }]);
      if (updatedArtifact !== currentBrief.content) {
        const updatedBriefs = briefs.map((brief, i) =>
          i === currentBriefIndex ? { ...brief, content: updatedArtifact } : brief
        );
        setBriefs(updatedBriefs);
        setBriefsContent(combineBriefsContent(updatedBriefs));
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustLevel = async (level: 'Beginner' | 'Intermediate' | 'Advanced') => {
    if (!parsedSources.length) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: `Adjust to ${level} level` }]);

    try {
      let newContent = '';
      const generator = adjustLevel({
        newLevel: level,
        messages,
        artifact: currentBrief.content,
        source: parsedSources,
      });

      for await (const chunk of generator) {
        if (chunk.content) newContent = chunk.content;
      }

      if (newContent) {
        const updatedBriefs = briefs.map((brief, i) =>
          i === currentBriefIndex ? { ...brief, content: newContent } : brief
        );
        setBriefs(updatedBriefs);
        setBriefsContent(combineBriefsContent(updatedBriefs));
        setMessages((prev) => [...prev, { role: 'assistant', content: `Content adjusted to ${level} level.` }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error adjusting the level.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdjustLength = async (length: 'shortest' | 'shorter' | 'longer' | 'longest') => {
    if (!parsedSources.length) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'user', content: `Make it ${length}` }]);

    try {
      let newContent = '';
      const generator = adjustLength({
        newLength: length,
        messages,
        artifact: currentBrief.content,
        source: parsedSources,
      });

      for await (const chunk of generator) {
        if (chunk.content) newContent = chunk.content;
      }

      if (newContent) {
        const updatedBriefs = briefs.map((brief, i) =>
          i === currentBriefIndex ? { ...brief, content: newContent } : brief
        );
        setBriefs(updatedBriefs);
        setBriefsContent(combineBriefsContent(updatedBriefs));
        setMessages((prev) => [...prev, { role: 'assistant', content: `Content made ${length}.` }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error adjusting the length.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    console.log('Export briefs');
  };

  const handleImport = () => {
    console.log('Import briefs');
  };

  if (!parsedSources.length || !configuration || !outlineContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-2">Missing Prerequisites</h2>
        <p className="text-muted-foreground mb-4">Please complete the outline step first.</p>
        <Button onClick={() => navigate('/outline')}>Go to Outline</Button>
      </div>
    );
  }

  return (
    <WorkflowLayout
      title={currentBrief ? currentBrief.title : "Briefs"}
      description="Review and refine the detailed content briefs"
      canvas={
        isInitializing ? (
          <div className="flex items-center justify-center h-full border rounded-lg bg-card">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Generating briefs...</p>
              <p className="text-sm text-muted-foreground mt-2">
                {totalBriefs > 0 ? `Brief ${generatingBriefIndex} of ${totalBriefs}` : 'This may take a few moments'}
              </p>
            </div>
          </div>
        ) : currentBrief ? (
          <Canvas
            content={currentBrief.content}
            onChange={(newContent) => {
              const updatedBriefs = briefs.map((b, i) =>
                i === currentBriefIndex ? { ...b, content: newContent } : b
              );
              setBriefs(updatedBriefs);
              setBriefsContent(combineBriefsContent(updatedBriefs));
            }}
            onExport={handleExport}
            onImport={handleImport}
          />
        ) : (
          <div className="flex items-center justify-center h-full border rounded-lg bg-card">
            <p className="text-muted-foreground">No brief content available</p>
          </div>
        )
      }
      chat={
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          onAdjustLevel={handleAdjustLevel}
          onAdjustLength={handleAdjustLength}
          placeholder="Ask AI to refine the briefs..."
          isLoading={isLoading}
        />
      }
      actions={
        <div className="flex justify-between">
          {currentBriefIndex > 0 ? (
            <Button variant="outline" onClick={() => navigate(`/briefs/${currentBriefIndex}`)}>
              ← Previous Brief
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate('/outline')}>
              ← Back to Outline
            </Button>
          )}
          
          <div className="text-sm text-muted-foreground">
            {briefs.length > 0 && `Brief ${currentBriefIndex + 1} of ${briefs.length}`}
          </div>
          
          {currentBriefIndex < briefs.length - 1 ? (
            <Button onClick={() => navigate(`/briefs/${currentBriefIndex + 2}`)}>
              Next Brief →
            </Button>
          ) : (
            <Button onClick={() => navigate('/connect-configuration')} disabled={!briefs.length}>
              Continue to Connect Config →
            </Button>
          )}
        </div>
      }
    />
  );
}

// ============================================================================
// CONNECT CONFIG PAGE
// ============================================================================
export function ConnectConfigPage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Connect Configuration</h2>
        <p className="text-muted-foreground mt-2">
          Configure scenario-based learning experience
        </p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <ConnectConfigForm />
      </div>
    </div>
  );
}

const extractBriefSection = (content: string, label: string) => {
  const regex = new RegExp(`\\*\\*${label}\\*\\*:?\\s*([\\s\\S]*?)(?=\\n\\*\\*|$)`, 'i');
  const match = content.match(regex);
  return match ? match[1].trim() : '';
};

const mapBriefToParsedOutline = (brief: { title: string; content: string }, index: number) => {
  const headingMatch = brief.content.match(/^##\s*Brief\s+\d+:\s*(.*)$/im);
  const headingTitle = headingMatch?.[1]?.trim();

  return {
    title: headingTitle || brief.title || `Brief ${index + 1}`,
    objectives: extractBriefSection(brief.content, 'Objectives'),
    overview: extractBriefSection(brief.content, 'Overview'),
    content: extractBriefSection(brief.content, 'Content') || brief.content,
  };
};

const mapQuestionTypes = (questionTypes?: string[]) => {
  if (!questionTypes || questionTypes.length === 0) return undefined;

  const mapping: Record<string, 'Fill-in-the-Blank' | 'Multiple Choice Question' | 'True/False' | 'Yes/No'> = {
    'fill-in-the-blank': 'Fill-in-the-Blank',
    mcq: 'Multiple Choice Question',
    'true-false': 'True/False',
    'yes-no': 'Yes/No',
  };

  const mapped = questionTypes
    .map(type => mapping[type])
    .filter((value): value is 'Fill-in-the-Blank' | 'Multiple Choice Question' | 'True/False' | 'Yes/No' => Boolean(value));

  return mapped.length ? mapped : undefined;
};

const buildConnectConfigPayload = (connectConfiguration: ConnectConfiguration) => {
  const stringOrUndefined = (value?: string) => value?.trim() || undefined;
  const arrayOrUndefined = (value?: string[]) => (value && value.length > 0 ? value : undefined);

  return {
    role: stringOrUndefined(connectConfiguration.learnerProfileRole),
    department: stringOrUndefined(connectConfiguration.learnerProfileDepartment),
    countryType: arrayOrUndefined(connectConfiguration.scenarioDetailsCountryType),
    authorityType: arrayOrUndefined(connectConfiguration.scenarioDetailsAuthorityType),
    financialInstitution: arrayOrUndefined(connectConfiguration.scenarioDetailsFinancialInstitutionsType),
    artefacts: arrayOrUndefined(connectConfiguration.artefacts),
    characters: arrayOrUndefined(connectConfiguration.characterRoles),
    scenarioDescription: stringOrUndefined(connectConfiguration.scenarioDescriptions),
    keypoints: arrayOrUndefined(connectConfiguration.taskTypes),
    taskExamples: stringOrUndefined(connectConfiguration.taskExamples),
    questions: mapQuestionTypes(connectConfiguration.questionTypes),
  };
};

// ============================================================================
// CONNECT PAGE - Fully Integrated
// ============================================================================
export function ConnectPage() {
  const navigate = useNavigate();
  const {
    parsedSources,
    briefs,
    briefsContent,
    connectConfiguration,
    connectContent,
    setConnectContent,
    setIsGenerating,
    setCurrentStage,
  } = useWorkflow();

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const availableBriefs = useMemo(
    () => (briefs.length > 0 ? briefs : parseBriefsContent(briefsContent || '')),
    [briefs, briefsContent]
  );

  useEffect(() => {
    setCurrentStage('connect');
  }, [setCurrentStage]);

  useEffect(() => {
    if (connectContent) {
      setIsInitializing(false);
      return;
    }

    if (availableBriefs.length > 0 && parsedSources.length > 0 && connectConfiguration) {
      generateConnect(availableBriefs);
    } else {
      setIsInitializing(false);
    }
  }, [availableBriefs, connectConfiguration, connectContent, parsedSources.length]);

  const generateConnect = async (briefList: typeof availableBriefs = availableBriefs) => {
    if (!connectConfiguration || briefList.length === 0 || parsedSources.length === 0) {
      console.error('Missing connect configuration, briefs, or sources');
      setIsInitializing(false);
      return;
    }

    setIsGenerating(true);
    setIsLoading(true);
    setIsInitializing(true);

    try {
      const response = await apiClient.post('/api/connect/generate-connect', {
        briefs: briefList.map(brief => ({ content: brief.content })),
        parsedOutline: {
          briefs: briefList.map((brief, index) => mapBriefToParsedOutline(brief, index)),
        },
        config: buildConnectConfigPayload(connectConfiguration),
      });

      setConnectContent(response.data.content);
      setMessages([{ role: 'assistant', content: response.data.response?.content || 'Connect generated successfully!' }]);
    } catch (error) {
      console.error('Error generating connect:', error);
      setMessages([{ role: 'assistant', content: 'Sorry, there was an error generating the connect tutorial.' }]);
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
      setIsInitializing(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!parsedSources.length) return;

    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);

    try {
      let response = '';
      let updatedArtifact = connectContent;
      
      const generator = chatCompletion({
        messages: [...messages, { role: 'user', content: message }],
        artifact: connectContent,
        source: parsedSources,
        stage: 'connect',
      });

      for await (const chunk of generator) {
        if (chunk.content) response += chunk.content;
        if (chunk.artifact) updatedArtifact = chunk.artifact;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: response || 'Content updated successfully.' }]);
      if (updatedArtifact !== connectContent) setConnectContent(updatedArtifact);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    console.log('Export connect');
  };

  const handleImport = () => {
    console.log('Import connect');
  };

  if (!parsedSources.length || availableBriefs.length === 0 || !connectConfiguration) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-2">Missing Prerequisites</h2>
        <p className="text-muted-foreground mb-4">Please complete the briefs and connect configuration steps first.</p>
        <Button onClick={() => navigate('/connect-configuration')}>Go to Connect Config</Button>
      </div>
    );
  }

  return (
    <WorkflowLayout
      title="Connect"
      description="Interactive scenario-based learning content"
      canvas={
        isInitializing ? (
          <div className="flex items-center justify-center h-full border rounded-lg bg-card">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Generating connect tutorial...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
            </div>
          </div>
        ) : (
          <Canvas
            content={connectContent}
            onChange={setConnectContent}
            onExport={handleExport}
            onImport={handleImport}
          />
        )
      }
      chat={
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          placeholder="Ask AI to refine the connect tutorial..."
          isLoading={isLoading}
        />
      }
      actions={
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/connect-configuration')}>
            ← Back to Connect Config
          </Button>
          <Button onClick={() => navigate('/test-yourself')} disabled={!connectContent || isInitializing}>
            Continue to Test Yourself →
          </Button>
        </div>
      }
    />
  );
}

// ============================================================================
// TEST YOURSELF PAGE - Fully Integrated
// ============================================================================
export function TestYourselfPage() {
  const navigate = useNavigate();
  const {
    parsedSources,
    briefs,
    briefsContent,
    testContent,
    setTestContent,
    setIsGenerating,
    setCurrentStage,
  } = useWorkflow();

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const combinedBriefsContent = useMemo(
    () => (briefs.length > 0 ? combineBriefsContent(briefs) : briefsContent),
    [briefs, briefsContent]
  );

  useEffect(() => {
    setCurrentStage('test_yourself');
    if (!testContent && combinedBriefsContent) {
      generateTest();
    } else {
      setIsInitializing(false);
    }
  }, [combinedBriefsContent, testContent]);

  const generateTest = async () => {
    if (!combinedBriefsContent) {
      console.error('Missing briefs content');
      setIsInitializing(false);
      return;
    }

    setIsGenerating(true);
    setIsLoading(true);
    setIsInitializing(true);

    try {
      // Extract brief instructions from briefs
      const briefInstructions = {
        title: 'Test Questions',
        learning_objectives: [],
        summary: combinedBriefsContent,
      };

      const generator = apiClient.post('/api/testyourself/generate-test', {
        artifact: { content: combinedBriefsContent },
        brief_instructions: briefInstructions,
      });

      const response = await generator;
      
      // Handle streaming response
      if (response.data) {
        setTestContent(response.data);
        setMessages([{ role: 'assistant', content: 'Test questions generated successfully!' }]);
      }
    } catch (error) {
      console.error('Error generating test:', error);
      setMessages([{ role: 'assistant', content: 'Sorry, there was an error generating the test questions.' }]);
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
      setIsInitializing(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!parsedSources.length) return;

    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);

    try {
      let response = '';
      let updatedArtifact = testContent;
      
      const generator = chatCompletion({
        messages: [...messages, { role: 'user', content: message }],
        artifact: testContent,
        source: parsedSources,
        stage: 'test_yourself',
      });

      for await (const chunk of generator) {
        if (chunk.content) response += chunk.content;
        if (chunk.artifact) updatedArtifact = chunk.artifact;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: response || 'Content updated successfully.' }]);
      if (updatedArtifact !== testContent) setTestContent(updatedArtifact);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    console.log('Export test');
  };

  const handleImport = () => {
    console.log('Import test');
  };

  if (!combinedBriefsContent) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-2">Missing Prerequisites</h2>
        <p className="text-muted-foreground mb-4">Please complete the briefs step first.</p>
        <Button onClick={() => navigate('/briefs/1')}>Go to Briefs</Button>
      </div>
    );
  }

  return (
    <WorkflowLayout
      title="Test Yourself"
      description="Self-assessment questions and exercises"
      canvas={
        isInitializing ? (
          <div className="flex items-center justify-center h-full border rounded-lg bg-card">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Generating test questions...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
            </div>
          </div>
        ) : (
          <Canvas
            content={testContent}
            onChange={setTestContent}
            onExport={handleExport}
            onImport={handleImport}
          />
        )
      }
      chat={
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          placeholder="Ask AI to refine the test questions..."
          isLoading={isLoading}
        />
      }
      actions={
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/connect')}>
            ← Back to Connect
          </Button>
          <Button onClick={() => navigate('/executive-summary')} disabled={!testContent || isInitializing}>
            Continue to Executive Summary →
          </Button>
        </div>
      }
    />
  );
}

// ============================================================================
// EXECUTIVE SUMMARY PAGE - Fully Integrated
// ============================================================================
export function ExecutiveSummaryPage() {
  const navigate = useNavigate();
  const {
    parsedSources,
    summaryContent,
    setSummaryContent,
    setIsGenerating,
    setCurrentStage,
  } = useWorkflow();

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    setCurrentStage('exsum');
    if (!summaryContent && parsedSources.length > 0) {
      generateSummary();
    } else {
      setIsInitializing(false);
    }
  }, []);

  const generateSummary = async () => {
    if (parsedSources.length === 0) {
      console.error('Missing sources');
      setIsInitializing(false);
      return;
    }

    setIsGenerating(true);
    setIsLoading(true);
    setIsInitializing(true);

    try {
      const response = await apiClient.post('/api/exsum/generate-exsum', {
        source: parsedSources,
      });

      setSummaryContent(response.data.content);
      setMessages([{ role: 'assistant', content: response.data.response.content }]);
    } catch (error) {
      console.error('Error generating summary:', error);
      setMessages([{ role: 'assistant', content: 'Sorry, there was an error generating the executive summary.' }]);
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
      setIsInitializing(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!parsedSources.length) return;

    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setIsLoading(true);

    try {
      let response = '';
      let updatedArtifact = summaryContent;
      
      const generator = chatCompletion({
        messages: [...messages, { role: 'user', content: message }],
        artifact: summaryContent,
        source: parsedSources,
        stage: 'exsum',
      });

      for await (const chunk of generator) {
        if (chunk.content) response += chunk.content;
        if (chunk.artifact) updatedArtifact = chunk.artifact;
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: response || 'Content updated successfully.' }]);
      if (updatedArtifact !== summaryContent) setSummaryContent(updatedArtifact);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, there was an error processing your request.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    console.log('Export summary');
  };

  const handleImport = () => {
    console.log('Import summary');
  };

  if (!parsedSources.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-2xl font-bold mb-2">Missing Prerequisites</h2>
        <p className="text-muted-foreground mb-4">Please upload source documents first.</p>
        <Button onClick={() => navigate('/configuration')}>Go to Configuration</Button>
      </div>
    );
  }

  return (
    <WorkflowLayout
      title="Executive Summary"
      description="High-level overview of the content"
      canvas={
        isInitializing ? (
          <div className="flex items-center justify-center h-full border rounded-lg bg-card">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Generating executive summary...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a moment</p>
            </div>
          </div>
        ) : (
          <Canvas
            content={summaryContent}
            onChange={setSummaryContent}
            onExport={handleExport}
            onImport={handleImport}
          />
        )
      }
      chat={
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          placeholder="Ask AI to refine the summary..."
          isLoading={isLoading}
        />
      }
      actions={
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/test-yourself')}>
            ← Back to Test Yourself
          </Button>
          <Button onClick={() => navigate('/reviewer')} disabled={!summaryContent || isInitializing}>
            Continue to Reviewer →
          </Button>
        </div>
      }
    />
  );
}

// ============================================================================
// REVIEWER PAGE - Placeholder (API endpoint exists but needs specific implementation)
// ============================================================================
export function ReviewerPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const handleSendMessage = (message: string) => {
    setMessages([...messages, { role: 'user', content: message }]);
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Reviewer functionality coming soon.' },
      ]);
    }, 500);
  };

  const handleExport = () => {
    console.log('Export reviewer');
  };

  const handleImport = () => {
    console.log('Import reviewer');
  };

  return (
    <WorkflowLayout
      title="Reviewer"
      description="Quality assurance and content review"
      canvas={
        <Canvas
          content={content}
          onChange={setContent}
          onExport={handleExport}
          onImport={handleImport}
        />
      }
      chat={
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          placeholder="Ask AI about the review..."
        />
      }
      actions={
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/executive-summary')}>
            ← Back to Executive Summary
          </Button>
          <Button onClick={() => navigate('/configuration')}>
            Start New Tutorial →
          </Button>
        </div>
      }
    />
  );
}
