// Core types for FSI AIcademy application

export interface ParsedFile {
  name: string;
  size: number;
  content: string;
  markdown: string;
}

export interface SourceDocument {
  name: string;
  content: string;
  markdown: string;
  figures?: any[];
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export type ToneOption =
  | 'simple_and_clear'
  | 'professional_and_concise'
  | 'scenario_based_and_practical'
  | 'technical_and_analytical'
  | 'step_by_step_instructional';

export type BriefCount = 'one' | 'two' | 'three' | 'four' | 'five';

export interface Configuration {
  title: string;
  tone: ToneOption;
  numberOfBriefs: BriefCount;
  sectionsToHighlight?: string;
  sectionsToExclude?: string;
}

export interface ConnectConfiguration {
  learnerProfileRole?: string;
  learnerProfileDepartment?: string;
  scenarioDetailsCountryType?: string[];
  scenarioDetailsAuthorityType?: string[];
  scenarioDetailsFinancialInstitutionsType?: string[];
  scenarioDescriptions?: string;
  characterRoles: string[];
  artefacts: string[];
  taskExamples?: string;
  taskTypes: string[];
  questionTypes: string[];
}

export type WorkflowType = 'full_tutorial' | 'executive_summary';

export type WorkflowStep =
  | 'configuration'
  | 'outline'
  | 'briefs'
  | 'connectConfiguration'
  | 'connect'
  | 'testYourself'
  | 'executiveSummary';

export interface HistoryEntry {
  id: string;
  workflow: WorkflowType;
  title: string;
  configuration?: Configuration;
  connectConfiguration?: ConnectConfiguration;
  artifacts: {
    outline?: string;
    briefs?: string[];
    connect?: string;
    testYourself?: string;
    executiveSummary?: string;
  };
  currentStep: WorkflowStep;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: Message[];
  artifact: string;
  source: ParsedFile[];
  config?: Configuration;
  stage: string;
  briefInstructions?: {
    sectionTitle: string;
    sectionContent: string;
    index: number;
  };
}

export type ArtifactLength = 'shortest' | 'shorter' | 'longer' | 'longest';
export type ArtifactLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface AdjustLengthRequest {
  messages: Message[];
  artifact: string;
  source: ParsedFile[];
  newLength: ArtifactLength;
}

export interface AdjustLevelRequest {
  messages: Message[];
  artifact: string;
  source: ParsedFile[];
  newLevel: ArtifactLevel;
}

export interface UpdateSelectionRequest {
  messages: Message[];
  artifactChunk: {
    block: string;
    selection: string;
  };
  source: ParsedFile[];
  query: string;
}

export interface ExportRequest {
  content: string;
}

export interface ImportResponse {
  content: string;
}

export interface StreamChunk {
  type: 'response' | 'artifact' | 'block' | 'progress';
  content: string;
}
