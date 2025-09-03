'use client';

import React, { useRef, useState } from 'react';
import { Bold, Italic,  Link, Image,  Plus, X, Code } from 'lucide-react';
import GradientButton from './ui/GradientButton';
import { AnimatePresence, motion } from 'framer-motion';


interface EditorToolbarProps {
  onBold: () => void;
  onItalic: () => void;
  onAddLink: (url: string) => void;
  onAddImage: (url: string, alt: string) => void;
  onAddCodeBlock: () => void;
  isBold: boolean;
  isItalic: boolean;
  hasSelection: boolean;
}

export default function EditorToolbar({
  onBold,
  onItalic,
  onAddLink,
  onAddImage,
  onAddCodeBlock,
  isBold,
  isItalic,
  hasSelection
}: EditorToolbarProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const handleAddLink = () => {
    if (linkUrl.trim()) {
      onAddLink(linkUrl.trim());
      setLinkUrl('');
      setShowLinkInput(false);
      setShowMenu(false);
    }
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      onAddImage(imageUrl.trim(), imageAlt.trim() || 'Image');
      setImageUrl('');
      setImageAlt('');
      setShowImageInput(false);
      setShowMenu(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      action();
    }
  };

  return (
    <div className="relative flex items-center space-x-2 mb-4">
      {/* Plus Menu Button */}
      <div className="relative" ref={menuRef}>
        <motion.button
          onClick={() => setShowMenu(!showMenu)}
          className={`p-2 rounded-lg transition-all duration-200 ${
            showMenu 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4" />
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
            >
              <div className="p-2 space-y-1">
                <button
                  onClick={() => setShowLinkInput(true)}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-left text-sm text-gray-700"
                >
                  <Link className="w-4 h-4 text-blue-500" />
                  <span>Add Link</span>
                </button>
                
                <button
                  onClick={() => setShowImageInput(true)}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-left text-sm text-gray-700"
                >
                  <Image className="w-4 h-4 text-green-500" />
                  <span>Add Image</span>
                </button>
                
                <button
                  onClick={() => {
                    onAddCodeBlock();
                    setShowMenu(false);
                  }}
                  className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 text-left text-sm text-gray-700"
                >
                  <Code className="w-4 h-4 text-purple-500" />
                  <span>Add Code Block</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Formatting Buttons */}
      <motion.button
        onClick={onBold}
        disabled={!hasSelection}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isBold 
            ? 'bg-blue-500 text-white' 
            : hasSelection
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
        }`}
        whileHover={hasSelection ? { scale: 1.05 } : {}}
        whileTap={hasSelection ? { scale: 0.95 } : {}}
        title="Bold (Ctrl+B)"
      >
        <Bold className="w-4 h-4" />
      </motion.button>

      <motion.button
        onClick={onItalic}
        disabled={!hasSelection}
        className={`p-2 rounded-lg transition-all duration-200 ${
          isItalic 
            ? 'bg-blue-500 text-white' 
            : hasSelection
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900'
              : 'bg-gray-50 text-gray-400 cursor-not-allowed'
        }`}
        whileHover={hasSelection ? { scale: 1.05 } : {}}
        whileTap={hasSelection ? { scale: 0.95 } : {}}
        title="Italic (Ctrl+I)"
      >
        <Italic className="w-4 h-4" />
      </motion.button>

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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Link</h3>
                <button
                  onClick={() => setShowLinkInput(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleAddLink)}
                    placeholder="https://example.com"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                
                <div className="flex space-x-3">
                  <GradientButton
                    onClick={handleAddLink}
                    variant="primary"
                    size="md"
                    className="flex-1"
                  >
                    Add Link
                  </GradientButton>
                  <button
                    onClick={() => setShowLinkInput(false)}
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
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Add Image</h3>
                <button
                  onClick={() => setShowImageInput(false)}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleAddImage)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Text (optional)
                  </label>
                  <input
                    type="text"
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    onKeyPress={(e) => handleKeyPress(e, handleAddImage)}
                    placeholder="Describe the image"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex space-x-3">
                  <GradientButton
                    onClick={handleAddImage}
                    variant="success"
                    size="md"
                    className="flex-1"
                  >
                    Add Image
                  </GradientButton>
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
