'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAtomValue, useSetAtom } from 'jotai';
import { motion } from 'framer-motion';
import { 
  Calendar
} from 'lucide-react';
import TimelineCreationModal from '../../components/dashboard/TimelineCreationModal';
import { TimelineCard } from '../../components/dashboard/TimelineTracker';
import { timelinesAtom, updateSectionStatusAtom } from '../../../lib/stores/timelineStore';

const parseDate = (dateValue: Date | string | null | undefined): Date | null => {
  if (!dateValue) return null;
  if (dateValue instanceof Date) return dateValue;
  if (typeof dateValue === 'string') {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

const formatDate = (dateValue: Date | string | null | undefined): string => {
  const date = parseDate(dateValue);
  if (!date) return 'Not set';
  return date.toLocaleDateString();
};

function TimelinesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timelines = useAtomValue(timelinesAtom);
  const updateSectionStatus = useSetAtom(updateSectionStatusAtom);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTimeline, setSelectedTimeline] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowCreateModal(true);
      router.replace('/timelines');
    }
  }, [searchParams, router]);


  const handleTimelineClick = (timelineId: string) => {
    setSelectedTimeline(selectedTimeline === timelineId ? null : timelineId);
  };



  const handleExport = (format: 'png' | 'pdf') => {
    console.log(`Exporting timeline as ${format}`);
  };

  const getStatusColor = (status: 'not-started' | 'in-progress' | 'completed') => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in-progress':
        return 'bg-blue-500';
      case 'not-started':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };



  

  const calculateProgress = (timeline: any) => {
    const totalSections = timeline.sections.length;
    const completedSections = timeline.sections.filter((s: any) => s.status === 'completed').length;
    return Math.round((completedSections / totalSections) * 100);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-normal text-gray-900">Research Timelines</h1>
         
        </div>
      </div>

      {/* Content */}
      <div className="px-8 py-6">
        {timelines.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No timelines yet</h3>
            <p className="text-gray-600 mb-6">
              Create your first research timeline to start planning your academic journey
            </p>
           
          </div>
        ) : (
          <div className="space-y-6">
           
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">
                {timelines.length} Timeline{timelines.length !== 1 ? 's' : ''}
              </h2>
            </div>

            {/* Timeline List (dashboard card) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {timelines.map((timeline) => (
                <motion.div
                  key={timeline.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <TimelineCard timeline={timeline} />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      <TimelineCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        refreshTimelines={() => {
        
        }}
      />
    </div>
  );
}

export default function TimelinesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading timelines...</p>
        </div>
      </div>
    }>
      <TimelinesContent />
    </Suspense>
  );
}
