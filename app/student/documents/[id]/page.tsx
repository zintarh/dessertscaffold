'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Save, 
  Share2, 
  MoreHorizontal,
  Copy,
  Users,
  Mail,
  Check
} from 'lucide-react';
import TipTapEditor from '../../components/TipTapEditor';
import Modal, { ModalFooter, ModalSection } from '../../../components/Modal';

interface DocumentData {
  id: number;
  title: string;
  content: string;
  lastModified: string;
  author: string;
  targetWords: number;
  currentWords: number;
  isShared: boolean;
  collaborators: string[];
  allowComments: boolean;
  allowEditing: boolean;
}

export default function DocumentEditor() {
  const params = useParams();
  const router = useRouter();
  const [document, setDocument] = useState<DocumentData>({
    id: 1,
    title: 'Untitled Document',
    content: '<h1>Start writing your document...</h1>',
    lastModified: new Date().toLocaleDateString(),
    author: 'John Doe',
    targetWords: 2000,
    currentWords: 0,
    isShared: false,
    collaborators: [],
    allowComments: false,
    allowEditing: false
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [newCollaborator, setNewCollaborator] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (params.id) {
      console.log('Loading document:', params.id);
    }
  }, [params.id]);

  const handleContentUpdate = (content: string) => {
    setDocument(prev => ({
      ...prev,
      content,
      currentWords: content.split(' ').length
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save operation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    console.log('Document saved:', document);
  };

  const toggleSharing = () => {
    setDocument(prev => ({ ...prev, isShared: !prev.isShared }));
  };

  const generateShareLink = () => {
    return `${window.location.origin}/shared/${document.id}`;
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const addCollaborator = () => {
    if (newCollaborator && !document.collaborators.includes(newCollaborator)) {
      setDocument(prev => ({
        ...prev,
        collaborators: [...prev.collaborators, newCollaborator]
      }));
      setNewCollaborator('');
    }
  };

  const removeCollaborator = (email: string) => {
    setDocument(prev => ({
      ...prev,
      collaborators: prev.collaborators.filter(c => c !== email)
    }));
  };

  const updatePermissions = (permission: 'allowComments' | 'allowEditing', value: boolean) => {
    setDocument(prev => ({ ...prev, [permission]: value }));
  };

  const progressPercentage = Math.min((document.currentWords / document.targetWords) * 100, 100);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/student/documents')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <input
                type="text"
                value={document.title}
                onChange={(e) => setDocument(prev => ({ ...prev, title: e.target.value }))}
                className="text-2xl font-normal text-gray-900 bg-transparent border-none outline-none focus:ring-0"
                placeholder="Untitled Document"
              />
              <p className="text-sm text-gray-500 mt-1">
                Last modified {document.lastModified} by {document.author}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save'}</span>
            </button>
            
            <button
              onClick={() => setShowShareModal(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
            
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Document Info Bar */}
      <div className="bg-gray-50 border-b border-gray-200 px-8 py-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-6">
            <span>Author: {document.author}</span>
            <span>Last saved: {document.lastModified}</span>
            <span>Target: {document.targetWords.toLocaleString()} words</span>
            <span>Current: {document.currentWords.toLocaleString()} words</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>Progress:</span>
            <div className="w-24 bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <span className="w-12 text-right">{Math.round(progressPercentage)}%</span>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="px-8 py-6">
        <div className="max-w-4xl mx-auto">
          <TipTapEditor
            content={document.content}
            onUpdate={handleContentUpdate}
            placeholder="Start writing your document..."
          />
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        open={showShareModal}
        onOpenChange={setShowShareModal}
        title="Share Document"
        size="md"
      >
        {/* Share Link Section */}
        <ModalSection title="Share Link">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={toggleSharing}
              className={`text-xs px-2 py-1 rounded ${
                document.isShared 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {document.isShared ? 'Public' : 'Private'}
            </button>
          </div>
          
          {document.isShared && (
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
        </ModalSection>

        {/* Collaborators Section */}
        <ModalSection title="Add Collaborators">
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
          
          {document.collaborators.length > 0 && (
            <div className="space-y-2">
              {document.collaborators.map((email, index) => (
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
        </ModalSection>

        {/* Permissions */}
        <ModalSection title="Permissions">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">Allow Comments</label>
                <p className="text-xs text-gray-500">Collaborators can add comments</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={document.allowComments}
                  onChange={(e) => updatePermissions('allowComments', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
                  checked={document.allowEditing}
                  onChange={(e) => updatePermissions('allowEditing', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </ModalSection>

        {/* Action Buttons */}
        <ModalFooter>
          <button
            onClick={() => setShowShareModal(false)}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // Here you would save the share settings to your backend
              console.log('Share settings:', {
                isShared: document.isShared,
                collaborators: document.collaborators,
                allowComments: document.allowComments,
                allowEditing: document.allowEditing
              });
              setShowShareModal(false);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Settings
          </button>
        </ModalFooter>
      </Modal>

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
