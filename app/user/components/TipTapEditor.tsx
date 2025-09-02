'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Quote,
  Undo,
  Redo
} from 'lucide-react';

interface TipTapEditorProps {
  content: string;
  onUpdate?: (content: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({ content, onUpdate, placeholder }: TipTapEditorProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const editor = useEditor({
    extensions: [StarterKit],
    content: content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'focus:outline-none min-h-[500px] p-6 text-gray-900',
      },
    },
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getHTML());
    },
  });

  if (!isClient || !editor) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg min-h-[500px] p-6">
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-500 text-sm">Loading editor...</p>
          </div>
        </div>
      </div>
    );
  }

  const ToolbarButton = ({ 
    onClick, 
    isActive = false, 
    children, 
    title 
  }: { 
    onClick: () => void; 
    isActive?: boolean; 
    children: React.ReactNode; 
    title: string;
  }) => (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition-colors ${
        isActive 
          ? 'bg-blue-100 text-blue-600' 
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-3 bg-gray-50">
        <div className="flex items-center space-x-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            isActive={editor.isActive('heading', { level: 1 })}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive('heading', { level: 2 })}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </ToolbarButton>
          
          <div className="w-px h-6 bg-gray-300 mx-2"></div>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </ToolbarButton>
          
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive('blockquote')}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </ToolbarButton>
        </div>
      </div>

      {/* Editor Content */}
      <div className="min-h-[500px]">
        <EditorContent 
          editor={editor} 
          className="[&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[500px] [&_.ProseMirror]:p-6 [&_.ProseMirror]:text-gray-900 [&_.ProseMirror]:text-base [&_.ProseMirror]:leading-relaxed"
        />
        {!content && (
          <div className="p-6 text-gray-400 text-sm">
            {placeholder || 'Start writing your document...'}
          </div>
        )}
      </div>

      {/* Custom Styles for Editor Content */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 500px;
          padding: 1.5rem;
          color: #111827;
          font-size: 1rem;
          line-height: 1.625;
        }
        
        .ProseMirror h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 1.5rem;
          margin-bottom: 1rem;
          color: #111827;
        }
        
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.25rem;
          margin-bottom: 0.75rem;
          color: #111827;
        }
        
        .ProseMirror p {
          margin-bottom: 1rem;
          color: #374151;
        }
        
        .ProseMirror ul, .ProseMirror ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
          color: #374151;
        }
        
        .ProseMirror li {
          margin-bottom: 0.5rem;
        }
        
        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .ProseMirror strong {
          font-weight: 600;
          color: #111827;
        }
        
        .ProseMirror em {
          font-style: italic;
          color: #374151;
        }
      `}</style>
    </div>
  );
}
