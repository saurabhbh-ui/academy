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
  { value: 'fill-in-the-blank', label: 'Fill-in-the-Blank' },
  { value: 'mcq', label: 'Multiple Choice Question' },
  { value: 'true-false', label: 'True/False' }
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

export function ConnectConfigForm() {
  const navigate = useNavigate();
  const { setConnectConfiguration } = useWorkflow();
  
  const [formData, setFormData] = useState({
    learnerProfileRole: '',
    learnerProfileDepartment: '',
    artefacts: [] as string[],
    taskExamples: '',
    taskTypes: [] as string[],
    questionTypes: [] as string[],
    scenarioDetailsCountryType: [] as string[],
    scenarioDetailsAuthorityType: [] as string[],
    scenarioDetailsFinancialInstitutionsType: [] as string[],
    scenarioDescriptions: '',
    characterRoles: [] as string[],
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

  const toggleMultiSelect = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).includes(value)
        ? (prev[field as keyof typeof prev] as string[]).filter(v => v !== value)
        : [...(prev[field as keyof typeof prev] as string[]), value]
    }));
  };

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
                <select
                  value={formData.learnerProfileRole}
                  onChange={(e) => setFormData({...formData, learnerProfileRole: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select or type in...</option>
                  {LEARNER_PROFILE_ROLE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground mt-1">
                  Enter or select the role that best represents the learner's position
                </p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">Department</label>
                <select
                  value={formData.learnerProfileDepartment}
                  onChange={(e) => setFormData({...formData, learnerProfileDepartment: e.target.value})}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select or type in...</option>
                  {LEARNER_PROFILE_DEPARTMENT_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
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
                  <label key={opt.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.questionTypes.includes(opt.value)}
                      onChange={() => toggleMultiSelect('questionTypes', opt.value)}
                      className="rounded"
                    />
                    <span className="text-sm">{opt.label}</span>
                  </label>
                ))}
              </div>
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
