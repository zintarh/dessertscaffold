'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Bold, Italic, Underline, List, Quote, LinkIcon, ImageIcon } from 'lucide-react';
import GradientButton from './ui/GradientButton';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { AnimatePresence, motion } from 'framer-motion';

interface ParagraphBlock {
  id: string;
  content: string;
  editor: any; // TipTap editor instance - using any for now to avoid complex typing
}

interface ParagraphEditorProps {
  paragraph: ParagraphBlock;
  onUpdateContent: (id: string, content: string) => void;
  onAddParagraph: (afterId: string) => void;
  onSetParagraphs: (updater: (prev: ParagraphBlock[]) => ParagraphBlock[]) => void;
  activeToolbar: string | null;
  onSetActiveToolbar: (id: string | null) => void;
  onSetShowLinkInput: (show: boolean) => void;
  onSetShowImageInput: (show: boolean) => void;
}

export default function ParagraphEditor({
  paragraph,
  onUpdateContent,
  onAddParagraph,
  onSetParagraphs,
  activeToolbar,
  onSetActiveToolbar,
  onSetShowLinkInput,
  onSetShowImageInput
}: ParagraphEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
        blockquote: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg shadow-md my-4',
        },
      }),
      Placeholder.configure({
        placeholder: 'Write something...',
        emptyEditorClass: 'is-editor-empty',
      }),
    ],
    content: paragraph.content,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none p-0',
      },
    },
    onUpdate: ({ editor }) => {
      onUpdateContent(paragraph.id, editor.getHTML());
    },
    onCreate: ({ editor }) => {
      // Store editor reference
      onSetParagraphs(prev => 
        prev.map(p => p.id === paragraph.id ? { ...p, editor } : p)
      );
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && paragraph.content !== editor.getHTML()) {
      editor.commands.setContent(paragraph.content);
    }
  }, [paragraph.content, editor]);

  // Handle Enter key to create new paragraph
  useEffect(() => {
    if (!editor) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        const { from, empty } = editor.state.selection;
        const currentNode = editor.state.doc.nodeAt(from);
        
        // If cursor is at the end of paragraph and paragraph has content
        if (empty && currentNode && currentNode.textContent.trim() !== '') {
          const isAtEnd = from === currentNode.nodeSize - 1 + (currentNode.isBlock ? 0 : 1);
          if (isAtEnd || from === editor.state.doc.content.size - 1) {
            event.preventDefault();
            onAddParagraph(paragraph.id);
          }
        }
      }
    };

    const editorElement = editor.view.dom;
    editorElement.addEventListener('keydown', handleKeyDown);

    return () => {
      editorElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [editor, paragraph.id, onAddParagraph]);

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



  if (!editor) {
    return (
      <div className="flex items-center py-4">
        <div className="w-6 h-6 mr-4"></div>
        <div className="flex-1 h-6 bg-gray-100 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div
      data-paragraph-id={paragraph.id}
      className="relative group"
      onMouseEnter={() => onSetActiveToolbar(paragraph.id)}
      onMouseLeave={() => onSetActiveToolbar(null)}
    >
      {/* Toolbar */}
      <AnimatePresence>
        {activeToolbar === paragraph.id && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -top-12 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center space-x-2 z-10"
          >
            <button
              onClick={handleBold}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={handleItalic}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSetShowLinkInput(true)}
              className="p-2 rounded hover:bg-gray-100 transition-colors"
              title="Add Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSetShowImageInput(true)}
              className="p-4 rounded hover:bg-gray-100 transition-colors"
              title="Add Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Editor */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 min-h-[100px]">
        <EditorContent editor={editor} />
      </div>

      {/* Add Paragraph Button */}
      <button
        onClick={() => onAddParagraph(paragraph.id)}
        className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-600"
        title="Add new paragraph"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
