import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/UI';
import { useWorkflow } from '@/providers/WorkflowProvider';

// Constant options (matching original)
const LEARNER_PROFILE_ROLE_OPTIONS = [
  'Policy analyst',
  'Supervisor',
  'Regulatory specialist',
  'Risk manager'
];

const LEARNER_PROFILE_DEPARTMENT_OPTIONS = [
  'Policy department',
  'Supervision department',
  'Financial stability department',
  'Innovation department'
];

const ARTEFACTS_OPTIONS = [
  'Emails',
  'Phone Calls',
  'Press Reports',
  'Live News',
  'Financial Statements',
  'Regulatory Filings'
];

const TASK_TYPES_OPTIONS = [
  'Provide Advice',
  'Provide Recommendation',
  'Provide Report',
  'Conduct Analysis'
];

const QUESTION_TYPES_OPTIONS = [
  'Fill-in-the-Blank',
  'Multiple Choice Question',
  'True/False',
  'Yes/No'
];

const SCENARIO_DETAILS_COUNTRY_TYPE_OPTIONS = [
  'Developed',
  'Developing',
  'Emerging Market'
];

const SCENARIO_DETAILS_AUTHORITY_TYPE_OPTIONS = [
  'Banking',
  'Insurance',
  'Central bank',
  'Integrated authority'
];

const SCENARIO_DETAILS_FINANCIAL_INSTITUTION_TYPE_OPTIONS = [
  'Bank',
  'Insurer',
  'Investment Firm'
];

const CHARACTER_ROLES_OPTIONS = [
  'Manager',
  'Head of authority',
  'CEO of bank',
  'CEO of insurer',
  'Project team members'
];

type ConnectFormData = {
  learnerProfileRole: string;
  learnerProfileDepartment: string;
  artefacts: string[];
  taskExamples: string;
  taskTypes: string[];
  questionTypes: string[];
  scenarioDetailsCountryType: string[];
  scenarioDetailsAuthorityType: string[];
  scenarioDetailsFinancialInstitutionsType: string[];
  scenarioDescriptions: string;
  characterRoles: string[];
};

type MultiValueField =
  | 'artefacts'
  | 'taskTypes'
  | 'questionTypes'
  | 'scenarioDetailsCountryType'
  | 'scenarioDetailsAuthorityType'
  | 'scenarioDetailsFinancialInstitutionsType'
  | 'characterRoles';

export function ConnectConfigForm() {
  const navigate = useNavigate();
  const { setConnectConfiguration } = useWorkflow();
  
  const [formData, setFormData] = useState<ConnectFormData>({
    learnerProfileRole: '',
    learnerProfileDepartment: '',
    artefacts: [],
    taskExamples: '',
    taskTypes: [],
    questionTypes: [],
    scenarioDetailsCountryType: [],
    scenarioDetailsAuthorityType: [],
    scenarioDetailsFinancialInstitutionsType: [],
    scenarioDescriptions: '',
    characterRoles: [],
  });
  const [customInputs, setCustomInputs] = useState<Record<string, string>>({
    artefacts: '',
    taskTypes: '',
    scenarioDetailsCountryType: '',
    scenarioDetailsAuthorityType: '',
    scenarioDetailsFinancialInstitutionsType: '',
    characterRoles: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.learnerProfileRole || !formData.learnerProfileDepartment || !formData.scenarioDescriptions) {
      setError('Role, department, and scenario description are required to generate Connect.');
      return;
    }
    setError('');
    setConnectConfiguration(formData);
    navigate('/connect');
  };

  const toggleMultiSelect = (field: MultiValueField, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(v => v !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

  const addCustomValue = (field: MultiValueField) => {
    const inputValue = customInputs[field] || '';
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    setFormData((prev) => {
      const existing = (prev[field] as string[]) || [];
      if (existing.includes(trimmed)) return prev;
      return { ...prev, [field]: [...existing, trimmed] };
    });
    setCustomInputs((prev) => ({ ...prev, [field]: '' }));
  };

  const renderSelectedValues = (field: MultiValueField) => (
    <div className="flex flex-wrap gap-2 mt-3">
      {(formData[field] as string[]).map((value) => (
        <span
          key={value}
          className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs"
        >
          {value}
          <button
            type="button"
            className="ml-2 text-muted-foreground hover:text-foreground"
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                [field]: (prev[field] as string[]).filter((v) => v !== value),
              }))
            }
            aria-label={`Remove ${value}`}
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Learner Profile */}
          <div className="rounded-lg border p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4">Learner Profile</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Role</label>
                <input
                  list="role-options"
                  value={formData.learnerProfileRole}
                  onChange={(e) => setFormData({ ...formData, learnerProfileRole: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Select or type in..."
                  required
                />
                <datalist id="role-options">
                  {LEARNER_PROFILE_ROLE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} />
                  ))}
                </datalist>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter or select the role that best represents the learner's position
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Department</label>
                <input
                  list="department-options"
                  value={formData.learnerProfileDepartment}
                  onChange={(e) => setFormData({ ...formData, learnerProfileDepartment: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Select or type in..."
                  required
                />
                <datalist id="department-options">
                  {LEARNER_PROFILE_DEPARTMENT_OPTIONS.map((opt) => (
                    <option key={opt} value={opt} />
                  ))}
                </datalist>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter or select the department the learner is part of
                </p>
              </div>
            </div>
          </div>

          {/* Artefacts */}
          <div className="rounded-lg border p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4">Artefacts / Information conveyance</h3>
            <div>
              <div className="space-y-2">
                {ARTEFACTS_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.artefacts.includes(opt)}
                      onChange={() => toggleMultiSelect('artefacts', opt)}
                      className="rounded"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={customInputs.artefacts}
                  onChange={(e) => setCustomInputs({ ...customInputs, artefacts: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomValue('artefacts');
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Type another artefact and press Enter"
                />
                <Button type="button" variant="secondary" onClick={() => addCustomValue('artefacts')}>
                  Add
                </Button>
              </div>
              {renderSelectedValues('artefacts')}
              <p className="text-xs text-muted-foreground mt-2">
                Select or type in the artefacts to be used
              </p>
            </div>
          </div>

          {/* Tasks */}
          <div className="rounded-lg border p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4">Tasks</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Task Examples</label>
                <textarea
                  value={formData.taskExamples}
                  onChange={(e) => setFormData({...formData, taskExamples: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md min-h-[100px]"
                  placeholder=""
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Example tasks shaping the scenario
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Task Types</label>
                <div className="space-y-2">
                  {TASK_TYPES_OPTIONS.map(opt => (
                    <label key={opt} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.taskTypes.includes(opt)}
                        onChange={() => toggleMultiSelect('taskTypes', opt)}
                        className="rounded"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={customInputs.taskTypes}
                    onChange={(e) => setCustomInputs({ ...customInputs, taskTypes: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomValue('taskTypes');
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Type another task type and press Enter"
                  />
                  <Button type="button" variant="secondary" onClick={() => addCustomValue('taskTypes')}>
                    Add
                  </Button>
                </div>
                {renderSelectedValues('taskTypes')}
                <p className="text-xs text-muted-foreground mt-2">
                  Enter or select the task types the learner will be performing
                </p>
              </div>
            </div>
          </div>

          {/* Question Types */}
          <div className="rounded-lg border p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4">Question types</h3>
            <div>
              <div className="space-y-2">
                {QUESTION_TYPES_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.questionTypes.includes(opt)}
                      onChange={() => toggleMultiSelect('questionTypes', opt)}
                      className="rounded"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
              {renderSelectedValues('questionTypes')}
              <p className="text-xs text-muted-foreground mt-2">
                Select the question types to be used
              </p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Scenario Details */}
          <div className="rounded-lg border p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4">Scenario Details</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">Country Type</label>
                <div className="space-y-2">
                  {SCENARIO_DETAILS_COUNTRY_TYPE_OPTIONS.map(opt => (
                    <label key={opt} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.scenarioDetailsCountryType.includes(opt)}
                        onChange={() => toggleMultiSelect('scenarioDetailsCountryType', opt)}
                        className="rounded"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={customInputs.scenarioDetailsCountryType}
                    onChange={(e) => setCustomInputs({ ...customInputs, scenarioDetailsCountryType: e.target.value })}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomValue('scenarioDetailsCountryType');
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Type another country type and press Enter"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => addCustomValue('scenarioDetailsCountryType')}
                  >
                    Add
                  </Button>
                </div>
                {renderSelectedValues('scenarioDetailsCountryType')}
                <p className="text-xs text-muted-foreground mt-2">
                  Enter or select the type of country relevant to the scenario
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Authority Type</label>
                <div className="space-y-2">
                  {SCENARIO_DETAILS_AUTHORITY_TYPE_OPTIONS.map(opt => (
                    <label key={opt} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.scenarioDetailsAuthorityType.includes(opt)}
                        onChange={() => toggleMultiSelect('scenarioDetailsAuthorityType', opt)}
                        className="rounded"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={customInputs.scenarioDetailsAuthorityType}
                    onChange={(e) =>
                      setCustomInputs({ ...customInputs, scenarioDetailsAuthorityType: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomValue('scenarioDetailsAuthorityType');
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Type another authority type and press Enter"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => addCustomValue('scenarioDetailsAuthorityType')}
                  >
                    Add
                  </Button>
                </div>
                {renderSelectedValues('scenarioDetailsAuthorityType')}
                <p className="text-xs text-muted-foreground mt-2">
                  Enter or select the type of authority involved in the scenario
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Financial Institution Type</label>
                <div className="space-y-2">
                  {SCENARIO_DETAILS_FINANCIAL_INSTITUTION_TYPE_OPTIONS.map(opt => (
                    <label key={opt} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.scenarioDetailsFinancialInstitutionsType.includes(opt)}
                        onChange={() => toggleMultiSelect('scenarioDetailsFinancialInstitutionsType', opt)}
                        className="rounded"
                      />
                      <span className="text-sm">{opt}</span>
                    </label>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={customInputs.scenarioDetailsFinancialInstitutionsType}
                    onChange={(e) =>
                      setCustomInputs({ ...customInputs, scenarioDetailsFinancialInstitutionsType: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addCustomValue('scenarioDetailsFinancialInstitutionsType');
                      }
                    }}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="Type another institution type and press Enter"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => addCustomValue('scenarioDetailsFinancialInstitutionsType')}
                  >
                    Add
                  </Button>
                </div>
                {renderSelectedValues('scenarioDetailsFinancialInstitutionsType')}
                <p className="text-xs text-muted-foreground mt-2">
                  Enter or select the type of financial institution featured in the scenario
                </p>
              </div>
            </div>
          </div>

          {/* Scenario Types */}
          <div className="rounded-lg border p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4">Scenario Types</h3>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Scenario Description</label>
              <textarea
                value={formData.scenarioDescriptions}
                onChange={(e) => setFormData({...formData, scenarioDescriptions: e.target.value})}
                className="w-full px-3 py-2 border rounded-md min-h-[120px]"
                placeholder=""
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Provide a brief description of the scenario outlining the key elements
              </p>
            </div>
          </div>

          {/* Other Characters */}
          <div className="rounded-lg border p-6 bg-card">
            <h3 className="text-lg font-semibold mb-4">Other characters to include</h3>
            <div>
              <label className="text-sm font-medium mb-1.5 block">Character Roles</label>
              <div className="space-y-2">
                {CHARACTER_ROLES_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.characterRoles.includes(opt)}
                      onChange={() => toggleMultiSelect('characterRoles', opt)}
                      className="rounded"
                    />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={customInputs.characterRoles}
                  onChange={(e) => setCustomInputs({ ...customInputs, characterRoles: e.target.value })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCustomValue('characterRoles');
                    }
                  }}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Type another character role and press Enter"
                />
                <Button type="button" variant="secondary" onClick={() => addCustomValue('characterRoles')}>
                  Add
                </Button>
              </div>
              {renderSelectedValues('characterRoles')}
              <p className="text-xs text-muted-foreground mt-2">
                Select or type in any other roles to be included in the scenario
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-between pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/briefs/1')}
        >
          ← Back
        </Button>
        <Button type="submit">
          Create connect →
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive mt-2 text-right">{error}</p>
      )}
    </form>
  );
}
