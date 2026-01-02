// Core types for FSI AIcademy application

export interface ParsedFile {
  name: string;
  size: number;
  content: string;
  markdown: string;
}

export interface Figure {
  id: string;
  b64image: string;
  caption?: string;
  footnote?: string;
  pageNumber: number;
}

export interface SourceDocument {
  name?: string;
  fileType?: string;
  content: string;
  figures?: Figure[];
}

export interface Message {
  role: 'user' | 'assistant' | 'system' | 'developer';
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

export interface BriefInstructions {
  title: string;
  objectives: string;
  overview: string;
  content: string;
  sectionTitle?: string;
  sectionContent?: string;
  index?: number;
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

export interface Brief {
  id: string;
  title: string;
  content: string;
  instructions?: BriefInstructions;
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

export interface ChatRequest {
  messages: Message[];
  artifact: string;
  source: SourceDocument[];
  config?: Configuration;
  stage: string;
  briefInstructions?: BriefInstructions;
}

export type ArtifactLength = 'shortest' | 'shorter' | 'longer' | 'longest';
export type ArtifactLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface AdjustLengthRequest {
  messages: Message[];
  artifact: string;
  source: SourceDocument[];
  newLength: ArtifactLength;
}

export interface AdjustLevelRequest {
  messages: Message[];
  artifact: string;
  source: SourceDocument[];
  newLevel: ArtifactLevel;
}

export interface UpdateSelectionRequest {
  messages: Message[];
  artifactChunk: {
    block: string;
    selection: string;
  };
  source: SourceDocument[];
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
