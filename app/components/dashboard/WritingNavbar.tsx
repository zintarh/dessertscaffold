'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {  Globe, GraduationCap, Settings, User, } from 'lucide-react';

interface WritingNavbarProps {
  isDraft: boolean;
  isSaved: boolean;
  lastSaved?: Date;
  onPublish: () => void;
  onSave: () => void;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  title?: string;
}

export default function WritingNavbar({
  isDraft,
  isSaved,
  lastSaved,
  onPublish,
  onSave,
  user,
  title
}: WritingNavbarProps) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPublishMenu, setShowPublishMenu] = useState(false);

  // Auto-save indicator
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saving' | 'saved' | 'error'>('saved');

  // Auto-save effect
  useEffect(() => {
    if (!isSaved) {
      setAutoSaveStatus('saving');
      const timer = setTimeout(() => {
        setAutoSaveStatus('saved');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isSaved]);

  const getDraftStatus = () => {
    if (autoSaveStatus === 'saving') return 'Saving...';
    if (autoSaveStatus === 'error') return 'Save failed';
    if (isSaved) return 'All changes saved';
    return 'Unsaved changes';
  };

  const getDraftStatusColor = () => {
    if (autoSaveStatus === 'saving') return 'text-yellow-600';
    if (autoSaveStatus === 'error') return 'text-red-600';
    if (isSaved) return 'text-green-600';
    return 'text-orange-600';
  };

  const getLastSavedText = () => {
    if (!lastSaved) return '';
    const now = new Date();
    const diff = now.getTime() - lastSaved.getTime();
    const minutes = Math.floor(diff / 60000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <motion.nav
      className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50 backdrop-blur-sm"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left side - Logo and Draft Status */}
        <div className="flex items-center space-x-6">
          {/* App Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-emerald-500 rounded-lg flex items-center justify-center shadow-lg">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              Dissertation Scaffold
            </span>
          </motion.div>

          {/* Draft Status */}
          <div className="flex items-center space-x-3">
            <div className={`w-2 h-2 rounded-full ${
              autoSaveStatus === 'saving' ? 'bg-yellow-500 animate-pulse' :
              autoSaveStatus === 'error' ? 'bg-red-500' :
              isSaved ? 'bg-green-500' : 'bg-orange-500'
            }`} />
            <div className="flex flex-col">
              <span className={`text-sm font-medium ${getDraftStatusColor()}`}>
                {getDraftStatus()}
              </span>
              {lastSaved && (
                <span className="text-xs text-gray-500">
                  Last saved {getLastSavedText()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center - Title (if provided) */}
        {title && (
          <div className="flex-1 max-w-2xl mx-8">
            <input
              type="text"
              value={title}
              placeholder="Title..."
              className="w-full text-center text-lg font-medium text-gray-700 bg-transparent border-none outline-none placeholder-gray-400"
              readOnly
            />
          </div>
        )}

        {/* Right side - Actions and User Profile */}
        <div className="flex items-center space-x-4">
          {/* Save Button */}
          {/* <motion.button
            onClick={onSave}
            disabled={isSaved}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isSaved
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
            }`}
            whileHover={!isSaved ? { scale: 1.05 } : {}}
            whileTap={!isSaved ? { scale: 0.95 } : {}}
          >
            <Save className="w-4 h-4 inline mr-2" />
            Save
          </motion.button> */}

          {/* Publish Button */}
          <div className="relative">
            <motion.button
              onClick={() => setShowPublishMenu(!showPublishMenu)}
              className="px-6 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg font-medium hover:from-emerald-600 hover:to-blue-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Globe className="w-4 h-4" />
              <span>Publish</span>
            </motion.button>

            {/* Publish Menu */}
            {showPublishMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      onPublish();
                      setShowPublishMenu(false);
                    }}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-left text-sm text-gray-700"
                  >
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <div>
                      <div className="font-medium">Publish Now</div>
                      <div className="text-xs text-gray-500">Make it public</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setShowPublishMenu(false)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-left text-sm text-gray-700"
                  >
                    <Settings className="w-4 h-4 text-gray-500" />
                    <div>
                      <div className="font-medium">Schedule</div>
                      <div className="text-xs text-gray-500">Publish later</div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* User Profile */}
          <div className="relative">
            <motion.button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              whileHover={{ scale: 1.02 }}
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {user?.name || 'User'}
              </span>
            </motion.button>

            {/* Profile Menu */}
            {showProfileMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
              >
                <div className="p-2 space-y-1">
                  <div className="px-3 py-2 border-b border-gray-100">
                    <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                  
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-left text-sm text-gray-700">
                    <User className="w-4 h-4 text-gray-500" />
                    <span>Profile</span>
                  </button>
                  
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-left text-sm text-gray-700">
                    <Settings className="w-4 h-4 text-gray-500" />
                    <span>Settings</span>
                  </button>
                  
                  <div className="border-t border-gray-100 pt-1">
                    <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 text-left text-sm text-red-600">
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menus */}
      {(showProfileMenu || showPublishMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowProfileMenu(false);
            setShowPublishMenu(false);
          }}
        />
      )}
    </motion.nav>
  );
}
