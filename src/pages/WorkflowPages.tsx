import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkflowLayout } from '@/components/Layout';
import { Canvas } from '@/components/Canvas';
import { ChatPanel } from '@/components/Chat';
import { Button } from '@/components/UI';
import { ConnectConfigForm } from '@/components/Configuration';
import { FileDown } from 'lucide-react';

export function OutlinePage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const handleSendMessage = (message: string) => {
    setMessages([...messages, { role: 'user', content: message }]);
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I understand you want to refine the outline. This feature will be connected in Phase 5.',
        },
      ]);
    }, 500);
  };

  const handleExport = () => {
    console.log('Export outline');
  };

  const handleImport = () => {
    console.log('Import outline');
  };

  return (
    <WorkflowLayout
      title="Outline"
      description="Review and refine the generated content outline"
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
          placeholder="Ask AI to refine the outline..."
        />
      }
      actions={
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/configuration')}>
            ← Back to Configuration
          </Button>
          <Button onClick={() => navigate('/briefs')}>
            Continue to Briefs →
          </Button>
        </div>
      }
    />
  );
}

export function BriefsPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const handleSendMessage = (message: string) => {
    setMessages([...messages, { role: 'user', content: message }]);
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I understand you want to refine the brief. This feature will be connected in Phase 5.',
        },
      ]);
    }, 500);
  };

  const handleExport = () => {
    console.log('Export brief');
  };

  const handleImport = () => {
    console.log('Import brief');
  };

  return (
    <WorkflowLayout
      title="Briefs"
      description="Review and refine the detailed content briefs"
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
          placeholder="Ask AI to refine the briefs..."
        />
      }
      actions={
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/outline')}>
            ← Back to Outline
          </Button>
          <Button onClick={() => navigate('/connect-configuration')}>
            Continue to Connect Config →
          </Button>
        </div>
      }
    />
  );
}

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

export function ConnectPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const handleSendMessage = (message: string) => {
    setMessages([...messages, { role: 'user', content: message }]);
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I understand you want to refine the scenario. This feature will be connected in Phase 5.',
        },
      ]);
    }, 500);
  };

  const handleExport = () => {
    console.log('Export connect');
  };

  const handleImport = () => {
    console.log('Import connect');
  };

  return (
    <WorkflowLayout
      title="Connect"
      description="Review and refine the scenario-based learning content"
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
          placeholder="Ask AI to refine the scenario..."
        />
      }
      actions={
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/connect-configuration')}>
            ← Back to Connect Config
          </Button>
          <Button onClick={() => navigate('/test-yourself')}>
            Continue to Test Yourself →
          </Button>
        </div>
      }
    />
  );
}

export function TestYourselfPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const handleSendMessage = (message: string) => {
    setMessages([...messages, { role: 'user', content: message }]);
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I understand you want to refine the quiz. This feature will be connected in Phase 5.',
        },
      ]);
    }, 500);
  };

  const handleExport = () => {
    console.log('Export quiz');
  };

  const handleImport = () => {
    console.log('Import quiz');
  };

  return (
    <WorkflowLayout
      title="Test Yourself"
      description="Review and refine the assessment questions"
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
          placeholder="Ask AI to refine the questions..."
        />
      }
      actions={
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/connect')}>
            ← Back to Connect
          </Button>
          <Button onClick={() => navigate('/summary')}>
            Continue to Summary →
          </Button>
        </div>
      }
    />
  );
}

export function ExecutiveSummaryPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);

  const handleSendMessage = (message: string) => {
    setMessages([...messages, { role: 'user', content: message }]);
    
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I understand you want to refine the summary. This feature will be connected in Phase 5.',
        },
      ]);
    }, 500);
  };

  const handleExport = () => {
    console.log('Export summary');
  };

  const handleImport = () => {
    console.log('Import summary');
  };

  const handleExportAll = () => {
    console.log('Export all steps');
  };

  return (
    <WorkflowLayout
      title="Executive Summary"
      description="Review the complete learning content package"
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
          placeholder="Ask AI to refine the summary..."
        />
      }
      actions={
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate('/test-yourself')}>
            ← Back to Test Yourself
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExportAll}>
              <FileDown className="h-4 w-4 mr-2" />
              Export All Steps
            </Button>
            <Button onClick={() => navigate('/')}>
              Finish & Return Home
            </Button>
          </div>
        </div>
      }
    />
  );
}

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-muted-foreground">Page not found</p>
    </div>
  );
}
