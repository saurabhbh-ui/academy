import { useEffect, useMemo, useState } from 'react';
import { BlockNoteEditor } from '@blocknote/core';
import { BlockNoteView } from '@blocknote/mantine';
import '@blocknote/mantine/style.css';
import { Button } from '@/components/UI';
import { 
  Undo2, 
  Redo2, 
  Bold, 
  Italic, 
  Underline,
  FileDown,
  FileUp,
  Edit3,
  Eye
} from 'lucide-react';

interface CanvasProps {
  content?: string;
  onChange?: (content: string) => void;
  onExport?: () => void;
  onImport?: () => void;
  editable?: boolean;
}

export function Canvas({ 
  content = '', 
  onChange, 
  onExport,
  onImport,
  editable = true 
}: CanvasProps) {
  const [isEditing, setIsEditing] = useState(false);

  const editor = useMemo(() => {
    return BlockNoteEditor.create();
  }, []);

  useEffect(() => {
    // Update editor when content changes externally
    if (content) {
      (async () => {
        try {
          // Use BlockNote's built-in markdown parser
          const blocks = await editor.tryParseMarkdownToBlocks(content);
          editor.replaceBlocks(editor.document, blocks);
        } catch (error) {
          console.error('Error parsing content:', error);
        }
      })();
    }
  }, [content, editor]);

  const handleEditorChange = () => {
    if (onChange) {
      const blocks = editor.document;
      onChange(JSON.stringify(blocks));
    }
  };

  const handleUndo = () => {
    editor.undo();
  };

  const handleRedo = () => {
    editor.redo();
  };

  const toggleBold = () => {
    editor.toggleStyles({ bold: true });
  };

  const toggleItalic = () => {
    editor.toggleStyles({ italic: true });
  };

  const toggleUnderline = () => {
    editor.toggleStyles({ underline: true });
  };

  return (
    <div className="flex flex-col h-full border rounded-lg bg-card">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/40">
        <div className="flex items-center gap-1">
          {/* Undo/Redo */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUndo}
            title="Undo"
            className="h-8 w-8 p-0"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRedo}
            title="Redo"
            className="h-8 w-8 p-0"
          >
            <Redo2 className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Text Formatting */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleBold}
            title="Bold"
            className="h-8 w-8 p-0"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleItalic}
            title="Italic"
            className="h-8 w-8 p-0"
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleUnderline}
            title="Underline"
            className="h-8 w-8 p-0"
          >
            <Underline className="h-4 w-4" />
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Import/Export */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onImport}
            title="Import from Word"
            className="h-8 px-3"
          >
            <FileUp className="h-4 w-4 mr-1" />
            Import
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            title="Export to Word"
            className="h-8 px-3"
          >
            <FileDown className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>

        {/* Edit/View Toggle */}
        {editable && (
          <Button
            variant={isEditing ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="h-8 px-3"
          >
            {isEditing ? (
              <>
                <Eye className="h-4 w-4 mr-1" />
                View Mode
              </>
            ) : (
              <>
                <Edit3 className="h-4 w-4 mr-1" />
                Edit Mode
              </>
            )}
          </Button>
        )}
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto p-4">
        <BlockNoteView
          editor={editor}
          onChange={handleEditorChange}
          editable={editable && isEditing}
          theme="light"
        />
      </div>
    </div>
  );
}
