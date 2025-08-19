'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import CodeBlock from '@tiptap/extension-code-block';
import Placeholder from '@tiptap/extension-placeholder';
import { motion } from 'framer-motion';


interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onBold: () => void;
  onItalic: () => void;
  onAddLink: (url: string) => void;
  onAddImage: (url: string, alt: string) => void;
  onAddCodeBlock: () => void;
  isBold: boolean;
  isItalic: boolean;
  hasSelection: boolean;
  placeholder?: string;
}

export default function RichTextEditor({
  content,
  onChange,
  onBold,
  onItalic,
  onAddLink,
  onAddImage,
  onAddCodeBlock,
  isBold,
  isItalic,
  hasSelection,
  placeholder = "Write your story..."
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4, 5, 6],
        },
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-md',
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: 'bg-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto',
        },
      }),
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    // Fix SSR hydration issues
    immediatelyRender: false,
  });

  // Update editor content when prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  // Handle keyboard shortcuts
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        switch (event.key.toLowerCase()) {
          case 'b':
            event.preventDefault();
            editor.chain().focus().toggleBold().run();
            break;
          case 'i':
            event.preventDefault();
            editor.chain().focus().toggleItalic().run();
            break;
          case 'k':
            event.preventDefault();
            const url = window.prompt('Enter URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
            break;
        }
      }

      // Handle Enter key to create new blocks
      if (event.key === 'Enter' && !event.shiftKey) {
        const { from, to } = editor.state.selection;
        const node = editor.state.doc.nodeAt(from);
        
        // If we're in a paragraph and it's empty, create a new paragraph
        if (node && node.type.name === 'paragraph' && node.textContent.trim() === '') {
          event.preventDefault();
          editor.chain().focus().insertContent('<p><br></p>').run();
        }
      }
    };

    // Use DOM event listener instead of TipTap event system
    const editorElement = editor.view.dom;
    editorElement.addEventListener('keydown', handleKeyDown);

    return () => {
      editorElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor]);

  // Expose editor methods to parent
  useEffect(() => {
    if (!editor) return;

    // Override the onBold, onItalic, etc. functions to use editor commands
    const originalOnBold = onBold;
    const originalOnItalic = onItalic;
    const originalOnAddLink = onAddLink;
    const originalOnAddImage = onAddImage;
    const originalOnAddCodeBlock = onAddCodeBlock;

    // Update the parent's state when editor state changes
    const updateParentState = () => {
      if (editor.isActive('bold') !== isBold) {
        // Trigger parent update
        originalOnBold();
      }
      if (editor.isActive('italic') !== isItalic) {
        // Trigger parent update
        originalOnItalic();
      }
    };

    editor.on('selectionUpdate', updateParentState);
    editor.on('transaction', updateParentState);

    return () => {
      editor.off('selectionUpdate', updateParentState);
      editor.off('transaction', updateParentState);
    };
  }, [editor, onBold, onItalic, onAddLink, onAddImage, onAddCodeBlock, isBold, isItalic]);

  // Handle formatting actions
  const handleBold = () => {
    if (editor) {
      editor.chain().focus().toggleBold().run();
    }
  };

  const handleItalic = () => {
    if (editor) {
      editor.chain().focus().toggleItalic().run();
    }
  };

  const handleAddLink = (url: string) => {
    if (editor) {
      if (editor.isActive('link')) {
        editor.chain().focus().unsetLink().run();
      } else {
        editor.chain().focus().setLink({ href: url }).run();
      }
    }
  };

  const handleAddImage = (url: string, alt: string) => {
    if (editor) {
      editor.chain().focus().setImage({ src: url, alt }).run();
    }
  };

  const handleAddCodeBlock = () => {
    if (editor) {
      editor.chain().focus().toggleCodeBlock().run();
    }
  };

  if (!editor) {
    return (
      <div className="min-h-[400px] bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-gray-500">Initializing editor...</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <EditorContent 
        editor={editor} 
        className="min-h-[400px] bg-white rounded-lg border border-gray-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all duration-200"
      />
      
      {/* Custom styles for the editor */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 400px;
          padding: 1rem;
          font-family: 'Georgia', 'Times New Roman', serif;
          line-height: 1.8;
          color: #374151;
        }
        
        .ProseMirror p {
          margin-bottom: 1.5rem;
        }
        
        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3,
        .ProseMirror h4,
        .ProseMirror h5,
        .ProseMirror h6 {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          font-weight: 600;
          line-height: 1.3;
          margin-top: 2rem;
          margin-bottom: 1rem;
          color: #111827;
        }
        
        .ProseMirror h1 { font-size: 2.25rem; }
        .ProseMirror h2 { font-size: 1.875rem; }
        .ProseMirror h3 { font-size: 1.5rem; }
        .ProseMirror h4 { font-size: 1.25rem; }
        .ProseMirror h5 { font-size: 1.125rem; }
        .ProseMirror h6 { font-size: 1rem; }
        
        .ProseMirror blockquote {
          border-left: 4px solid #3b82f6;
          padding-left: 1.5rem;
          margin: 1.5rem 0;
          font-style: italic;
          color: #6b7280;
        }
        
        .ProseMirror ul,
        .ProseMirror ol {
          margin: 1.5rem 0;
          padding-left: 2rem;
        }
        
        .ProseMirror li {
          margin-bottom: 0.5rem;
        }
        
        .ProseMirror code {
          background-color: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
        }
        
        .ProseMirror pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin: 1.5rem 0;
        }
        
        .ProseMirror pre code {
          background-color: transparent;
          padding: 0;
        }
        
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .ProseMirror a:hover {
          color: #1d4ed8;
        }
        
        .ProseMirror .is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
          font-style: italic;
        }
        
        .ProseMirror:focus .is-editor-empty:first-child::before {
          display: none;
        }
      `}</style>
    </motion.div>
  );
}
