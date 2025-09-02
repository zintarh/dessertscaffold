'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bold, Italic, Underline, Link, List, Quote, Type, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import GradientButton from './ui/GradientButton';
import ParagraphEditor from './ParagraphEditor';
import { AnimatePresence, motion } from 'framer-motion';

interface ParagraphBlock {
  id: string;
  content: string;
  editor: any; // TipTap editor instance - using any for now to avoid complex typing
}

interface MediumEditorProps {
  title: string;
  onTitleChange: (title: string) => void;
  onChange: (content: string) => void;
}

export default function MediumEditor({
  title,
  onTitleChange,
  onChange
}: MediumEditorProps) {
  const [paragraphs, setParagraphs] = useState<ParagraphBlock[]>([]);
  const [activeToolbar, setActiveToolbar] = useState<string | null>(null);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Client-side only rendering to prevent SSR hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);



  const addNewParagraph = useCallback((afterId?: string) => {
    const newId = `paragraph-${Date.now()}-${Math.random()}`;
    const newParagraph: ParagraphBlock = {
      id: newId,
      content: '',
      editor: null
    };

    setParagraphs(prev => {
      if (afterId) {
        const index = prev.findIndex(p => p.id === afterId);
        const newParagraphs = [...prev];
        newParagraphs.splice(index + 1, 0, newParagraph);
        return newParagraphs;
      }
      return [...prev, newParagraph];
    });

    // Focus the new paragraph after a short delay
    setTimeout(() => {
      const element = document.querySelector(`[data-paragraph-id="${newId}"] .ProseMirror`);
      if (element) {
        (element as HTMLElement).focus();
      }
    }, 100);
  }, []);

  // Initialize with one empty paragraph
  useEffect(() => {
    if (paragraphs.length === 0 && isMounted) {
      addNewParagraph();
    }
  }, [isMounted, paragraphs.length, addNewParagraph]);

  const updateParagraphContent = useCallback((id: string, content: string) => {
    setParagraphs(prev => 
      prev.map(p => p.id === id ? { ...p, content } : p)
    );
    
    // Update overall content
    const allContent = paragraphs.map(p => p.id === id ? content : p.content).join('\n\n');
    onChange(allContent);
  }, [paragraphs, onChange]);

  const handleTitleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      // Focus first paragraph
      const firstParagraph = document.querySelector('[data-paragraph-id] .ProseMirror');
      if (firstParagraph) {
        (firstParagraph as HTMLElement).focus();
      }
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    onTitleChange(value);
    
    // Auto-resize textarea
    if (titleRef.current) {
      titleRef.current.style.height = 'auto';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  };

  // Don't render until client-side to prevent SSR hydration issues
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      {/* Title Field */}
      <div className="mb-12">
        <textarea
          ref={titleRef}
          value={title}
          onChange={handleTitleChange}
          onKeyDown={handleTitleKeyDown}
          placeholder="Title"
          className="w-full text-5xl font-bold text-gray-900 placeholder-gray-300 border-none outline-none resize-none overflow-hidden bg-transparent leading-tight"
          rows={1}
          style={{ minHeight: '1.2em' }}
        />
      </div>

      {/* Writing Area */}
      <div className="space-y-4">
        {paragraphs.map((paragraph) => (
          <ParagraphEditor
            key={paragraph.id}
            paragraph={paragraph}
            onUpdateContent={updateParagraphContent}
            onAddParagraph={addNewParagraph}
            onSetParagraphs={setParagraphs}
            activeToolbar={activeToolbar}
            onSetActiveToolbar={setActiveToolbar}
            onSetShowLinkInput={setShowLinkInput}
            onSetShowImageInput={setShowImageInput}
          />
        ))}
      </div>

      {/* Link Input Modal */}
      <AnimatePresence>
        {showLinkInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowLinkInput(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-96 max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Add Link</h3>
              <input
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                autoFocus
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    const activeEditor = paragraphs.find(p => p.id === activeToolbar)?.editor;
                    if (activeEditor && linkUrl.trim()) {
                      activeEditor.chain().focus().setLink({ href: linkUrl.trim() }).run();
                      setLinkUrl('');
                      setShowLinkInput(false);
                      setActiveToolbar(null);
                    }
                  }}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Add Link
                </button>
                <button
                  onClick={() => setShowLinkInput(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Input Modal */}
      <AnimatePresence>
        {showImageInput && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowImageInput(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-96 max-w-[90vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold mb-4">Add Image</h3>
              <div className="space-y-4">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Alt text (optional)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      const activeEditor = paragraphs.find(p => p.id === activeToolbar)?.editor;
                      if (activeEditor && imageUrl.trim()) {
                        activeEditor.chain().focus().setImage({ src: imageUrl.trim(), alt: imageAlt.trim() }).run();
                        setImageUrl('');
                        setImageAlt('');
                        setShowImageInput(false);
                        setActiveToolbar(null);
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2 px-4 rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    Add Image
                  </button>
                  <button
                    onClick={() => setShowImageInput(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
