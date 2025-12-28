export const TONE_OPTIONS = [
  {
    label: 'Simple and Clear',
    description:
      'Emphasizes plain language, avoids jargon, and explains complex concepts with relatable examples.',
    value: 'simple_and_clear' as const,
  },
  {
    label: 'Professional and Concise',
    description: 'Formal and precise approach with minimal elaboration.',
    value: 'professional_and_concise' as const,
  },
  {
    label: 'Scenario-Based and Practical',
    description: 'Focuses on real-world applications to enhance understanding.',
    value: 'scenario_based_and_practical' as const,
  },
  {
    label: 'Technical and Analytical',
    description: 'In-depth explanations with data and advanced terminology.',
    value: 'technical_and_analytical' as const,
  },
  {
    label: 'Step-by-Step Instructional',
    description: 'Guides through processes or calculations.',
    value: 'step_by_step_instructional' as const,
  },
];

export const BRIEF_OPTIONS = [
  { label: '1', value: 'one' as const },
  { label: '2', value: 'two' as const },
  { label: '3', value: 'three' as const },
  { label: '4', value: 'four' as const },
  { label: '5', value: 'five' as const },
];

export const LEARNER_PROFILE_ROLE_OPTIONS = [
  { label: 'Policy analyst', value: 'Policy analyst' },
  { label: 'Supervisor', value: 'Supervisor' },
];

export const LEARNER_PROFILE_DEPARTMENT_OPTIONS = [
  { label: 'Policy department', value: 'Policy department' },
  { label: 'Supervision department', value: 'Supervision department' },
  { label: 'Financial stability department', value: 'Financial stability department' },
  { label: 'Innovation department', value: 'Innovation department' },
  { label: 'Resolution department', value: 'Resolution department' },
];

export const SCENARIO_DETAILS_COUNTRY_TYPE_OPTIONS = [
  { label: 'Developed', value: 'Developed' },
  { label: 'Developing', value: 'Developing' },
];

export const SCENARIO_DETAILS_AUTHORITY_TYPE_OPTIONS = [
  { label: 'Banking', value: 'Banking' },
  { label: 'Insurance', value: 'Insurance' },
  { label: 'Central bank', value: 'Central bank' },
  { label: 'Integrated authority', value: 'Integrated authority' },
];

export const SCENARIO_DETAILS_FINANCIAL_INSTITUTION_TYPE_OPTIONS = [
  { label: 'Bank', value: 'Bank' },
  { label: 'Insurer', value: 'Insurer' },
];

export const CHARACTER_ROLES_OPTIONS = [
  { label: 'Manager', value: 'Manager' },
  { label: 'Head of authority', value: 'Head of authority' },
  { label: 'CEO of bank', value: 'CEO of bank' },
  { label: 'CEO of insurer', value: 'CEO of insurer' },
  { label: 'Project team members', value: 'Project team members' },
];

export const ARTEFACTS_OPTIONS = [
  { label: 'Emails', value: 'Emails' },
  { label: 'Phone Calls', value: 'Phone Calls' },
  { label: 'Press Reports', value: 'Press Reports' },
  { label: 'Live News', value: 'Live News' },
  { label: 'Financial Statements', value: 'Financial Statements' },
];

export const TASK_TYPES_OPTIONS = [
  { label: 'Provide Advice', value: 'Provide Advice' },
  { label: 'Provide Recommendation', value: 'Provide Recommendation' },
  { label: 'Provide Report', value: 'Provide Report' },
];

export const QUESTION_TYPES_OPTIONS = [
  { label: 'Fill-in-the-Blank', value: 'Fill-in-the-Blank' },
  { label: 'Multiple Choice Question', value: 'Multiple Choice Question' },
  { label: 'True/False', value: 'True/False' },
];

export const CONNECT_CONFIG_OPTIONS = {
  scenarioType: [
    { label: 'Workplace', value: 'workplace' },
    { label: 'Customer Service', value: 'customer_service' },
    { label: 'Crisis Management', value: 'crisis_management' },
    { label: 'Decision Making', value: 'decision_making' },
  ],
  assessmentType: [
    { label: 'Multiple Choice', value: 'multiple_choice' },
    { label: 'True/False', value: 'true_false' },
    { label: 'Fill-in-the-Blank', value: 'fill_in_blank' },
    { label: 'Mixed', value: 'mixed' },
  ],
  numberOfQuestions: [
    { label: '3', value: '3' },
    { label: '5', value: '5' },
    { label: '7', value: '7' },
    { label: '10', value: '10' },
  ],
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
export const MAX_FILE_SIZE_MB = Number(import.meta.env.VITE_PARSER_MAX_FILE_SIZE_MB) || 5;
export const ALLOWED_FILE_TYPES = ['.pdf'];
export const SIDEBAR_KEY = 'fsi-aicademy-sidebar-collapsed';
export const TEXT_LIMIT = 5000;
