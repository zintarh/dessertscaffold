'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2,  } from "lucide-react";
import GradientButton from "./ui/GradientButton";
import { Timeline } from '@/types';
import toast from 'react-hot-toast';

interface DeleteTimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  timeline: Timeline | null;
  onDelete: (timelineId: string) => Promise<void>;
}

export default function DeleteTimelineModal({
  isOpen,
  onClose,
  timeline,
  onDelete,
}: DeleteTimelineModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!timeline?.id) return;

    try {
      setIsDeleting(true);
      await onDelete(timeline.id);
      toast.success('Timeline deleted successfully');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete timeline');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !timeline) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Timeline</h3>
              <p className="text-sm text-gray-500">This action cannot be undone</p>
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete <span className="font-semibold">"{timeline.researchTopic || timeline.documentType}"</span>?
            </p>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Trash2 className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-700">
                  <p className="font-medium">This will permanently delete:</p>
                  <ul className="mt-1 space-y-1">
                    <li>• The entire timeline</li>
                    <li>• All {timeline.sections?.length || 0} sections</li>
                    <li>• All progress and content</li>
                    <li>• Any associated data</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <GradientButton
              onClick={handleDelete}
              disabled={isDeleting}
              variant="danger"
              size="md"
              className="flex-1 flex items-center justify-center space-x-2"
            >
              {isDeleting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Timeline</span>
                </>
              )}
            </GradientButton>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
