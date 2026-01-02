import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { SourceDocument, Configuration, ConnectConfiguration, Brief } from '@/types';

interface WorkflowState {
  // Configuration
  sourceFiles: File[];
  parsedSources: SourceDocument[];
  configuration: Configuration | null;
  connectConfiguration: ConnectConfiguration | null;
  
  // Content
  outlineContent: string;
  briefsContent: string;
  briefs: Brief[];
  connectContent: string;
  testContent: string;
  summaryContent: string;
  
  // Loading states
  isGenerating: boolean;
  currentStage: string;
}

interface WorkflowContextType extends WorkflowState {
  setSourceFiles: (files: File[]) => void;
  setParsedSources: (sources: SourceDocument[]) => void;
  setConfiguration: (config: Configuration) => void;
  setConnectConfiguration: (config: ConnectConfiguration) => void;
  setOutlineContent: (content: string) => void;
  setBriefsContent: (content: string) => void;
  setBriefs: (briefs: Brief[]) => void;
  setConnectContent: (content: string) => void;
  setTestContent: (content: string) => void;
  setSummaryContent: (content: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setCurrentStage: (stage: string) => void;
  resetWorkflow: () => void;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

const initialState: WorkflowState = {
  sourceFiles: [],
  parsedSources: [],
  configuration: null,
  connectConfiguration: null,
  outlineContent: '',
  briefsContent: '',
  briefs: [],
  connectContent: '',
  testContent: '',
  summaryContent: '',
  isGenerating: false,
  currentStage: '',
};

export function WorkflowProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkflowState>(initialState);

  const setSourceFiles = useCallback((files: File[]) => {
    setState((prev) => ({ ...prev, sourceFiles: files }));
  }, []);

  const setParsedSources = useCallback((sources: SourceDocument[]) => {
    setState((prev) => ({ ...prev, parsedSources: sources }));
  }, []);

  const setConfiguration = useCallback((config: Configuration) => {
    setState((prev) => ({ ...prev, configuration: config }));
  }, []);

  const setConnectConfiguration = useCallback((config: ConnectConfiguration) => {
    setState((prev) => ({ ...prev, connectConfiguration: config }));
  }, []);

  const setOutlineContent = useCallback((content: string) => {
    setState((prev) => ({ ...prev, outlineContent: content }));
  }, []);

  const setBriefsContent = useCallback((content: string) => {
    setState((prev) => ({ ...prev, briefsContent: content }));
  }, []);

  const setBriefs = useCallback((briefs: Brief[]) => {
    setState((prev) => ({ ...prev, briefs }));
  }, []);

  const setConnectContent = useCallback((content: string) => {
    setState((prev) => ({ ...prev, connectContent: content }));
  }, []);

  const setTestContent = useCallback((content: string) => {
    setState((prev) => ({ ...prev, testContent: content }));
  }, []);

  const setSummaryContent = useCallback((content: string) => {
    setState((prev) => ({ ...prev, summaryContent: content }));
  }, []);

  const setIsGenerating = useCallback((isGenerating: boolean) => {
    setState((prev) => ({ ...prev, isGenerating }));
  }, []);

  const setCurrentStage = useCallback((stage: string) => {
    setState((prev) => ({ ...prev, currentStage: stage }));
  }, []);

  const resetWorkflow = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <WorkflowContext.Provider
      value={{
        ...state,
        setSourceFiles,
        setParsedSources,
        setConfiguration,
        setConnectConfiguration,
        setOutlineContent,
        setBriefsContent,
        setBriefs,
        setConnectContent,
        setTestContent,
        setSummaryContent,
        setIsGenerating,
        setCurrentStage,
        resetWorkflow,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflow() {
  const context = useContext(WorkflowContext);
  if (context === undefined) {
    throw new Error('useWorkflow must be used within WorkflowProvider');
  }
  return context;
}
