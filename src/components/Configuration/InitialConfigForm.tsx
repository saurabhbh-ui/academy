import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUpload } from '@/components/FileUpload';
import { Button, Input, Label, Select, Textarea } from '@/components/UI';
import { TONE_OPTIONS, BRIEF_OPTIONS } from '@/constants';
import type { Configuration } from '@/types';

interface InitialConfigFormProps {
  onFilesChange?: (files: File[]) => void;
  onConfigSubmit?: (config: Configuration) => void;
}

export function InitialConfigForm({ onFilesChange, onConfigSubmit }: InitialConfigFormProps) {
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);
  const [title, setTitle] = useState('');
  const [sectionsToHighlight, setSectionsToHighlight] = useState('');
  const [sectionsToExclude, setSectionsToExclude] = useState('');
  const [numberOfBriefs, setNumberOfBriefs] = useState('three');
  const [tone, setTone] = useState('professional_and_concise');

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    onFilesChange?.(newFiles);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const config: Configuration = {
      title,
      sectionsToHighlight,
      sectionsToExclude,
      numberOfBriefs: numberOfBriefs as any,
      tone: tone as any,
    };

    onConfigSubmit?.(config);
    navigate('/outline');
  };

  const isValid = files.length > 0 && title.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="files" className="text-base">
          Source Files <span className="text-destructive">*</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Upload PDF documents to generate learning content from
        </p>
        <FileUpload files={files} onChange={handleFilesChange} maxFiles={5} />
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-base">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          placeholder="e.g., Introduction to Banking Regulations"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      {/* Sections to Highlight */}
      <div className="space-y-2">
        <Label htmlFor="highlight" className="text-base">
          Sections to Highlight
        </Label>
        <p className="text-sm text-muted-foreground">
          Specify sections or topics you want to emphasize (optional)
        </p>
        <Textarea
          id="highlight"
          placeholder="e.g., Risk management, Compliance procedures"
          value={sectionsToHighlight}
          onChange={(e) => setSectionsToHighlight(e.target.value)}
          rows={3}
        />
      </div>

      {/* Sections to Exclude */}
      <div className="space-y-2">
        <Label htmlFor="exclude" className="text-base">
          Sections to Exclude
        </Label>
        <p className="text-sm text-muted-foreground">
          Specify sections or topics you want to skip (optional)
        </p>
        <Textarea
          id="exclude"
          placeholder="e.g., Historical background, Appendices"
          value={sectionsToExclude}
          onChange={(e) => setSectionsToExclude(e.target.value)}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Number of Briefs */}
        <div className="space-y-2">
          <Label htmlFor="briefs" className="text-base">
            Number of Briefs <span className="text-destructive">*</span>
          </Label>
          <Select
            id="briefs"
            value={numberOfBriefs}
            onChange={(e) => setNumberOfBriefs(e.target.value)}
            required
          >
            {BRIEF_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Tone */}
        <div className="space-y-2">
          <Label htmlFor="tone" className="text-base">
            Tone <span className="text-destructive">*</span>
          </Label>
          <Select id="tone" value={tone} onChange={(e) => setTone(e.target.value)} required>
            {TONE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={() => navigate('/')}>
          Cancel
        </Button>
        <Button type="submit" disabled={!isValid}>
          Continue to Outline →
        </Button>
      </div>
    </form>
  );
}
