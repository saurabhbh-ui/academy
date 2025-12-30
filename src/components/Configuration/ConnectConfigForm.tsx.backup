import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Label, Select, Textarea } from '@/components/UI';
import { CONNECT_CONFIG_OPTIONS } from '@/constants';

export function ConnectConfigForm() {
  const navigate = useNavigate();
  
  const [learnerProfile, setLearnerProfile] = useState('');
  const [scenarioContext, setScenarioContext] = useState('');
  const [scenarioType, setScenarioType] = useState('workplace');
  const [protagonistRole, setProtagonistRole] = useState('');
  const [protagonistName, setProtagonistName] = useState('');
  const [settingLocation, setSettingLocation] = useState('');
  const [settingTime, setSettingTime] = useState('');
  const [artefacts, setArtefacts] = useState('');
  const [tasks, setTasks] = useState('');
  const [assessmentType, setAssessmentType] = useState('multiple_choice');
  const [numberOfQuestions, setNumberOfQuestions] = useState('5');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Store connect configuration (Phase 5)
    console.log({
      learnerProfile,
      scenarioContext,
      scenarioType,
      protagonistRole,
      protagonistName,
      settingLocation,
      settingTime,
      artefacts,
      tasks,
      assessmentType,
      numberOfQuestions,
    });

    // Navigate to connect generation page
    navigate('/connect');
  };

  const isValid = learnerProfile.trim().length > 0 && scenarioContext.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Learner Profile */}
      <div className="space-y-2">
        <Label htmlFor="learnerProfile" className="text-base">
          Learner Profile <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Describe the target audience for this learning content
        </p>
        <Textarea
          id="learnerProfile"
          placeholder="e.g., Junior bank employees with 1-2 years experience"
          value={learnerProfile}
          onChange={(e) => setLearnerProfile(e.target.value)}
          rows={3}
          required
        />
      </div>

      {/* Scenario Details Section */}
      <div className="rounded-lg border bg-muted/40 p-6 space-y-6">
        <h3 className="text-lg font-semibold">Scenario Details</h3>

        {/* Scenario Context */}
        <div className="space-y-2">
          <Label htmlFor="scenarioContext" className="text-base">
            Scenario Context <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="scenarioContext"
            placeholder="e.g., A customer comes to the bank with a fraud complaint"
            value={scenarioContext}
            onChange={(e) => setScenarioContext(e.target.value)}
            rows={3}
            required
          />
        </div>

        {/* Scenario Type */}
        <div className="space-y-2">
          <Label htmlFor="scenarioType" className="text-base">
            Scenario Type
          </Label>
          <Select
            id="scenarioType"
            value={scenarioType}
            onChange={(e) => setScenarioType(e.target.value)}
          >
            {CONNECT_CONFIG_OPTIONS.scenarioType.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Characters Section */}
      <div className="rounded-lg border bg-muted/40 p-6 space-y-6">
        <h3 className="text-lg font-semibold">Characters</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Protagonist Role */}
          <div className="space-y-2">
            <Label htmlFor="protagonistRole" className="text-base">
              Protagonist Role
            </Label>
            <Input
              id="protagonistRole"
              placeholder="e.g., Branch Manager"
              value={protagonistRole}
              onChange={(e) => setProtagonistRole(e.target.value)}
            />
          </div>

          {/* Protagonist Name */}
          <div className="space-y-2">
            <Label htmlFor="protagonistName" className="text-base">
              Protagonist Name
            </Label>
            <Input
              id="protagonistName"
              placeholder="e.g., Sarah Johnson"
              value={protagonistName}
              onChange={(e) => setProtagonistName(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Setting Section */}
      <div className="rounded-lg border bg-muted/40 p-6 space-y-6">
        <h3 className="text-lg font-semibold">Setting</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="settingLocation" className="text-base">
              Location
            </Label>
            <Input
              id="settingLocation"
              placeholder="e.g., Downtown branch office"
              value={settingLocation}
              onChange={(e) => setSettingLocation(e.target.value)}
            />
          </div>

          {/* Time */}
          <div className="space-y-2">
            <Label htmlFor="settingTime" className="text-base">
              Time Period
            </Label>
            <Input
              id="settingTime"
              placeholder="e.g., Morning rush hour"
              value={settingTime}
              onChange={(e) => setSettingTime(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Artefacts */}
      <div className="space-y-2">
        <Label htmlFor="artefacts" className="text-base">
          Artefacts
        </Label>
        <p className="text-sm text-muted-foreground">
          Documents, tools, or resources available in the scenario
        </p>
        <Textarea
          id="artefacts"
          placeholder="e.g., Customer complaint form, fraud detection checklist, internal policies"
          value={artefacts}
          onChange={(e) => setArtefacts(e.target.value)}
          rows={3}
        />
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        <Label htmlFor="tasks" className="text-base">
          Tasks
        </Label>
        <p className="text-sm text-muted-foreground">
          What actions should the learner take in this scenario?
        </p>
        <Textarea
          id="tasks"
          placeholder="e.g., Investigate the complaint, document findings, escalate if necessary"
          value={tasks}
          onChange={(e) => setTasks(e.target.value)}
          rows={3}
        />
      </div>

      {/* Assessment Section */}
      <div className="rounded-lg border bg-muted/40 p-6 space-y-6">
        <h3 className="text-lg font-semibold">Assessment</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assessment Type */}
          <div className="space-y-2">
            <Label htmlFor="assessmentType" className="text-base">
              Assessment Type
            </Label>
            <Select
              id="assessmentType"
              value={assessmentType}
              onChange={(e) => setAssessmentType(e.target.value)}
            >
              {CONNECT_CONFIG_OPTIONS.assessmentType.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Number of Questions */}
          <div className="space-y-2">
            <Label htmlFor="numberOfQuestions" className="text-base">
              Number of Questions
            </Label>
            <Select
              id="numberOfQuestions"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(e.target.value)}
            >
              {CONNECT_CONFIG_OPTIONS.numberOfQuestions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => navigate('/briefs')}>
          Back
        </Button>
        <Button type="submit" disabled={!isValid}>
          Continue to Connect →
        </Button>
      </div>
    </form>
  );
}
