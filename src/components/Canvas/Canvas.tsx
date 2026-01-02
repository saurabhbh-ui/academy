import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Button } from '@/components/UI';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  Eye,
  Edit3,
  Download,
  Upload,
  RotateCcw
} from 'lucide-react';

interface CanvasProps {
  content: string;
  onChange?: (content: string) => void;
  onExport?: () => void;
  onImport?: () => void;
  onRegenerate?: () => void;
  editable?: boolean;
}

export function Canvas({ 
  content = '', 
  onChange, 
  onExport, 
  onImport,
  onRegenerate,
  editable = true 
}: CanvasProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localContent, setLocalContent] = useState(content);

  // Update local content when prop changes
  if (content !== localContent && !isEditing) {
    setLocalContent(content);
  }

  const handleChange = (newContent: string) => {
    setLocalContent(newContent);
    if (onChange) {
      onChange(newContent);
    }
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = localContent.substring(start, end);
    const newText = localContent.substring(0, start) + before + selectedText + after + localContent.substring(end);
    
    handleChange(newText);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const handleBold = () => insertMarkdown('**', '**');
  const handleItalic = () => insertMarkdown('*', '*');
  const handleUnderline = () => insertMarkdown('<u>', '</u>');
  const handleBulletList = () => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const lineStart = localContent.lastIndexOf('\n', start - 1) + 1;
    const newText = localContent.substring(0, lineStart) + '- ' + localContent.substring(lineStart);
    handleChange(newText);
  };
  const handleNumberedList = () => {
    const textarea = document.getElementById('markdown-editor') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const lineStart = localContent.lastIndexOf('\n', start - 1) + 1;
    const newText = localContent.substring(0, lineStart) + '1. ' + localContent.substring(lineStart);
    handleChange(newText);
  };

  const handleRegenerateClick = () => {
    // Use the callback if provided, otherwise show confirmation and clear
    if (onRegenerate) {
      onRegenerate();
    } else {
      if (window.confirm('Are you sure you want to regenerate? This will discard current changes.')) {
        if (onChange) {
          onChange(''); // Clear content to trigger regeneration
        }
      }
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-card overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
        <div className="flex items-center gap-2">
          {/* View/Edit Toggle */}
          {editable && (
            <div className="flex items-center gap-1 mr-4 bg-background rounded-md p-1">
              <Button
                variant={!isEditing ? "primary" : "ghost"}
                size="sm"
                onClick={() => setIsEditing(false)}
                className="h-8 px-3"
              >
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button
                variant={isEditing ? "primary" : "ghost"}
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 px-3"
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </div>
          )}

          {/* Formatting buttons - only show in edit mode */}
          {isEditing && editable && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBold}
                title="Bold (Ctrl+B)"
                className="h-8 w-8 p-0"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleItalic}
                title="Italic (Ctrl+I)"
                className="h-8 w-8 p-0"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUnderline}
                title="Underline (Ctrl+U)"
                className="h-8 w-8 p-0"
              >
                <Underline className="h-4 w-4" />
              </Button>

              <div className="w-px h-6 bg-border mx-1" />

              <Button
                variant="ghost"
                size="sm"
                onClick={handleBulletList}
                title="Bullet List"
                className="h-8 w-8 p-0"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNumberedList}
                title="Numbered List"
                className="h-8 w-8 p-0"
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          {onImport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onImport}
              title="Import from Word"
              className="h-8 px-3"
            >
              <Upload className="h-4 w-4 mr-1" />
              Import
            </Button>
          )}
          {onExport && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onExport}
              title="Export to Word"
              className="h-8 px-3"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRegenerateClick}
            title="Regenerate"
            className="h-8 px-3"
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Re-generate
          </Button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 overflow-y-auto">
        {isEditing && editable ? (
          /* Edit Mode - Textarea */
          <textarea
            id="markdown-editor"
            value={localContent}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full h-full p-6 font-mono text-sm resize-none focus:outline-none bg-background"
            placeholder="Start typing... Use markdown formatting:

**bold** for bold text
*italic* for italic text
# Heading 1
## Heading 2
- Bullet list
1. Numbered list"
            spellCheck={true}
          />
        ) : (
          /* View Mode - React Markdown */
          <div className="prose prose-sm max-w-none p-6 bg-background">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              components={{
                // Custom styling for markdown elements
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mt-6 mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold mt-5 mb-3" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold mt-4 mb-2" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 leading-7" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-4 space-y-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-4 space-y-2" {...props} />,
                li: ({node, ...props}) => <li className="leading-7" {...props} />,
                strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                em: ({node, ...props}) => <em className="italic" {...props} />,
                code: ({node, ...props}) => (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                ),
                pre: ({node, ...props}) => (
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4" {...props} />
                ),
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props} />
                ),
                a: ({node, ...props}) => (
                  <a className="text-primary hover:underline" {...props} />
                ),
                table: ({node, ...props}) => (
                  <div className="overflow-x-auto mb-4">
                    <table className="min-w-full divide-y divide-border" {...props} />
                  </div>
                ),
                th: ({node, ...props}) => (
                  <th className="px-4 py-2 bg-muted font-semibold text-left" {...props} />
                ),
                td: ({node, ...props}) => (
                  <td className="px-4 py-2 border-t border-border" {...props} />
                ),
              }}
            >
              {localContent || '*No content yet. Click Edit to start writing.*'}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
