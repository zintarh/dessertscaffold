'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Share2, 
  MoreHorizontal,
  Eye,
  Edit,
  Download,
  Copy,
  Star,
  Trash2,
  Users,
  Globe,
  Lock,
  Mail,
  Check
} from 'lucide-react';
import TipTapEditor from '../components/TipTapEditor';
import Modal, { ModalFooter, ModalSection } from '../../../components/Modal';

interface ShareSettings {
  isPublic: boolean;
  allowComments: boolean;
  allowEditing: boolean;
  collaborators: string[];
}

export default function NewDocumentPage() {
  const router = useRouter();
  const [documentTitle, setDocumentTitle] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [targetWords, setTargetWords] = useState(5000);
  const [currentWords, setCurrentWords] = useState(0);
  const [shareSettings, setShareSettings] = useState<ShareSettings>({
    isPublic: false,
    allowComments: true,
    allowEditing: false,
    collaborators: []
  });
  const [newCollaborator, setNewCollaborator] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleContentUpdate = (content: string) => {
    setCurrentContent(content);
    const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;
    setCurrentWords(wordCount);
  };

  const handleSave = async () => {
    if (!documentTitle.trim()) {
      alert('Please enter a document title');
      return;
    }

    setIsSaving(true);
    // Simulate saving
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Here you would typically save to your backend
    console.log('Saving document:', { title: documentTitle, content: currentContent });
    
    setIsSaving(false);
    // Redirect to documents page after saving
    router.push('/student/documents');
  };

  const handleBack = () => {
    if (documentTitle.trim() || currentContent.trim()) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        router.push('/student/documents');
      }
    } else {
      router.push('/student/documents');
    }
  };

  const generateShareLink = () => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/shared/new-document`;
    setShareLink(link);
    return link;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const addCollaborator = () => {
    if (newCollaborator.trim() && !shareSettings.collaborators.includes(newCollaborator.trim())) {
      setShareSettings(prev => ({
        ...prev,
        collaborators: [...prev.collaborators, newCollaborator.trim()]
      }));
      setNewCollaborator('');
    }
  };

  const removeCollaborator = (email: string) => {
    setShareSettings(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter(c => c !== email)
    }));
  };

  const toggleSharing = () => {
    const newSharedState = !shareSettings.isPublic;
    setShareSettings(prev => ({ ...prev, isPublic: newSharedState }));
    if (newSharedState) {
      generateShareLink();
    }
  };

  const updatePermissions = (field: 'allowComments' | 'allowEditing', value: boolean) => {
    setShareSettings(prev => ({ ...prev, [field]: value }));
  };

  const progressPercentage = Math.min((currentWords / targetWords) * 100, 100);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="flex-1 max-w-2xl">
              <input
                type="text"
                placeholder="Untitled document"
                value={documentTitle}
                onChange={(e) => setDocumentTitle(e.target.value)}
                className="w-full text-2xl font-normal text-gray-900 placeholder-gray-400 border-none outline-none focus:ring-0 bg-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={isSaving || !documentTitle.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
            
            <button
              onClick={() => setShowShareModal(true)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                shareSettings.isPublic 
                  ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {shareSettings.isPublic ? <Globe className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{shareSettings.isPublic ? 'Shared' : 'Share'}</span>
            </button>
            
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              
              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="py-1">
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                      <Copy className="w-4 h-4" />
                      <span>Make a copy</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                      <Star className="w-4 h-4" />
                      <span>Star</span>
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Document Info Bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-8 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-6">
            <span>Author: You</span>
            <span>Last saved: Never</span>
            <span>Target words: {targetWords.toLocaleString()}</span>
            <span>Current words: {currentWords.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <span>Progress:</span>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs">{Math.round(progressPercentage)}%</span>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <TipTapEditor
            content={currentContent}
            onUpdate={handleContentUpdate}
            placeholder="Start writing your new document..."
          />
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Share Document</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {/* Share Link Section */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Share Link</label>
                  <button
                    onClick={toggleSharing}
                    className={`text-xs px-2 py-1 rounded ${
                      shareSettings.isPublic 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {shareSettings.isPublic ? 'Public' : 'Private'}
                  </button>
                </div>
                
                {shareSettings.isPublic && (
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={shareLink || generateShareLink()}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900"
                    />
                    <button
                      onClick={() => copyToClipboard(shareLink || generateShareLink())}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                )}
              </div>

              {/* Collaborators Section */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Add Collaborators
                </label>
                <div className="flex items-center space-x-2 mb-3">
                  <input
                    type="email"
                    value={newCollaborator}
                    onChange={(e) => setNewCollaborator(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white text-gray-900 placeholder-gray-500"
                    onKeyPress={(e) => e.key === 'Enter' && addCollaborator()}
                  />
                  <button
                    onClick={addCollaborator}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                  </button>
                </div>
                
                {shareSettings.collaborators.length > 0 && (
                  <div className="space-y-2">
                    {shareSettings.collaborators.map((email, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{email}</span>
                        </div>
                        <button
                          onClick={() => removeCollaborator(email)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Permissions */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Allow Comments</label>
                    <p className="text-xs text-gray-500">Collaborators can add comments</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareSettings.allowComments}
                      onChange={(e) => updatePermissions('allowComments', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Allow Editing</label>
                    <p className="text-xs text-gray-500">Collaborators can edit the document</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={shareSettings.allowEditing}
                      onChange={(e) => updatePermissions('allowEditing', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Here you would save the share settings to your backend
                    console.log('Share settings:', shareSettings);
                    setShowShareModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Click outside to close menus */}
      {(isMenuOpen || showShareModal) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsMenuOpen(false);
            setShowShareModal(false);
          }}
        />
      )}
    </div>
  );
}
