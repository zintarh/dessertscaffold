'use client';

import { useState } from 'react';
import GradientButton from './ui/GradientButton';
import { 
  documentAccessByDocumentAtom, 
  mentorCommentsByDocumentAtom,
  addMentorCommentAtom,
  updateMentorCommentAtom,
  deleteMentorCommentAtom 
} from '../../lib/stores/mentorStore';
import { MentorComment } from '../../lib/types';
import { MessageCircle, Edit, Trash2, Send, X } from 'lucide-react';
import { useAtomValue, useSetAtom } from 'jotai/react';

interface MentorCommentPanelProps {
  documentId: string;
  currentUserId: string;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export default function MentorCommentPanel({ 
  documentId, 
  currentUserId, 
  isVisible, 
  onToggleVisibility 
}: MentorCommentPanelProps) {
  const [newComment, setNewComment] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const documentAccess = useAtomValue(documentAccessByDocumentAtom)(documentId);
  const comments = useAtomValue(mentorCommentsByDocumentAtom)(documentId);
  
  const addComment = useSetAtom(addMentorCommentAtom);
  const updateComment = useSetAtom(updateMentorCommentAtom);
  const deleteComment = useSetAtom(deleteMentorCommentAtom);

  // Check if current user has access to this document
  const userAccess = documentAccess.find(access => access.mentorId === currentUserId);
  const canComment = userAccess?.isActive && userAccess?.accessType === 'comment';
  const canWrite = userAccess?.isActive && userAccess?.accessType === 'write';
  const canEdit = userAccess?.isActive && userAccess?.accessType === 'edit';

  const handleAddComment = async () => {
    if (!newComment.trim() || !userAccess) return;

    try {
      await addComment({
        documentId,
        mentorId: currentUserId,
        content: newComment.trim(),
        sectionId: undefined, // TODO: Add section-specific commenting
        position: { start: 0, end: 0 } // TODO: Add position-specific commenting
      });
      
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) return;

    try {
      await updateComment(commentId, editContent.trim());
      setEditingComment(null);
      setEditContent('');
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment. Please try again.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteComment(commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  };

  const startEditing = (comment: MentorComment) => {
    setEditingComment(comment.id);
    setEditContent(comment.content);
  };

  const cancelEditing = () => {
    setEditingComment(null);
    setEditContent('');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white shadow-lg border-l border-gray-200 z-40">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <MessageCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">Mentor Comments</h3>
        </div>
        <button
          onClick={onToggleVisibility}
          className="p-1 rounded-md hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Access Status */}
      {userAccess ? (
        <div className="p-4 bg-blue-50 border-b border-blue-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-900">
              Access: {userAccess.accessType.charAt(0).toUpperCase() + userAccess.accessType.slice(1)}
            </span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            Granted on {new Date(userAccess.grantedAt).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <div className="p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">No Access</span>
          </div>
          <p className="text-xs text-gray-600 mt-1">
            Request access from the document owner
          </p>
        </div>
      )}

      {/* Add Comment */}
      {canComment && (
        <div className="p-4 border-b border-gray-200">
          <div className="space-y-3">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment or suggestion..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
            <div className="flex justify-end">
              <GradientButton
                onClick={handleAddComment}
                disabled={!newComment.trim()}
                variant="primary"
                size="md"
                className="flex items-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Send</span>
              </GradientButton>
            </div>
          </div>
        </div>
      )}

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No comments yet</p>
            <p className="text-sm text-gray-400">Be the first to leave feedback!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
              {/* Comment Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">
                      {comment.mentorId.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    Mentor {comment.mentorId.slice(-4)}
                  </span>
                </div>
                
                {/* Action Buttons */}
                {comment.mentorId === currentUserId && (
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => startEditing(comment)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Edit comment"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Comment Content */}
              {editingComment === comment.id ? (
                <div className="space-y-2">
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm resize-none"
                    rows={2}
                  />
                  <div className="flex space-x-2">
                    <GradientButton
                      onClick={() => handleUpdateComment(comment.id)}
                      variant="primary"
                      size="sm"
                    >
                      Save
                    </GradientButton>
                    <GradientButton
                      onClick={cancelEditing}
                      variant="secondary"
                      size="sm"
                    >
                      Cancel
                    </GradientButton>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-700">{comment.content}</p>
              )}

              {/* Comment Footer */}
              <div className="mt-2 text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleDateString()} at{' '}
                {new Date(comment.createdAt).toLocaleTimeString()}
                {comment.updatedAt > comment.createdAt && ' (edited)'}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
