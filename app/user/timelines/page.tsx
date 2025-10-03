'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAtomValue, useSetAtom } from 'jotai';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Download, 
  Eye, 
  Clock,

} from 'lucide-react';
import TimelineCreationModal from '../../components/dashboard/TimelineCreationModal';
import GanttChart from '../../components/dashboard/GanttChart';
import { timelinesAtom, updateSectionStatusAtom } from '../../../lib/stores/timelineStore';

// Utility function to safely parse dates from API
const parseDate = (dateValue: Date | string | null | undefined): Date | null => {
  if (!dateValue) return null;
  if (dateValue instanceof Date) return dateValue;
  if (typeof dateValue === 'string') {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

// Utility function to format dates safely
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
  const [viewMode, setViewMode] = useState<'list' | 'gantt'>('list');

  // Auto-open creation modal if create=true query parameter is present
  useEffect(() => {
    if (searchParams.get('create') === 'true') {
      setShowCreateModal(true);
      router.replace('/user/timelines');
    }
  }, [searchParams, router]);

  const handleCreateTimeline = () => {
    setShowCreateModal(true);
  };

  const handleTimelineClick = (timelineId: string) => {
    setSelectedTimeline(selectedTimeline === timelineId ? null : timelineId);
  };

  const handleStatusUpdate = (timelineId: string, sectionId: string, status: 'not-started' | 'in-progress' | 'completed') => {
    updateSectionStatus(timelineId, sectionId, status);
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
          /* Timeline Content */
          <div className="space-y-6">
            {/* View Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-medium text-gray-900">
                  {timelines.length} Timeline{timelines.length !== 1 ? 's' : ''}
                </h2>
                <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'list'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    List View
                  </button>
                  <button
                    onClick={() => setViewMode('gantt')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      viewMode === 'gantt'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    Gantt View
                  </button>
                </div>
              </div>
            </div>

            {/* Timeline List */}
            {viewMode === 'list' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {timelines.map((timeline) => (
                  <motion.div
                    key={timeline.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                  >
                    {/* Timeline Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {timeline.documentType}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {timeline.academicLevel} • {timeline.discipline}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleTimelineClick(timeline.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">Progress</span>
                          <span className="text-sm text-gray-500">{calculateProgress(timeline)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${calculateProgress(timeline)}%` }}
                          />
                        </div>
                      </div>

                      {/* Timeline Info */}
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center space-x-4">
                          <span className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(timeline.startDate)}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{timeline.sections.length} sections</span>
                          </span>
                        </div>
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                          {timeline.sections.reduce((total, s) => total + s.duration, 0)} weeks
                        </span>
                      </div>
                    </div>

                    {/* Timeline Sections Preview */}
                    {selectedTimeline === timeline.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-6 bg-gray-50"
                      >
                        <h4 className="font-medium text-gray-900 mb-3">Sections</h4>
                        <div className="space-y-2">
                          {timeline.sections.slice(0, 3).map((section) => (
                            <div key={section.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(section.status)}`} />
                                <span className="text-gray-700">{section.title}</span>
                              </div>
                              <span className="text-gray-500">{section.duration} weeks</span>
                            </div>
                          ))}
                          {timeline.sections.length > 3 && (
                            <div className="text-sm text-gray-500 text-center pt-2">
                              +{timeline.sections.length - 3} more sections
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}

            {/* Gantt Chart View */}
            {viewMode === 'gantt' && (
              <div className="space-y-6">
                {timelines.map((timeline) => (
                  <GanttChart
                    key={timeline.id}
                    timeline={timeline}
                    onExport={handleExport}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Timeline Creation Modal */}
      <TimelineCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        refreshTimelines={() => {
          // This will be handled by the dashboard's useEffect
          // The dashboard will automatically refresh when navigated to
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
