'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TimelineCreationModal from '../../components/dashboard/TimelineCreationModal';

export default function NewTimelinePage() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Automatically show the timeline creation modal when this page loads
    setShowModal(true);
  }, []);

  const handleClose = () => {
    setShowModal(false);
    // Redirect back to dashboard after closing
    router.push('/dashboard');
  };

  const handleTimelineCreated = (timelineId: string) => {
    // Redirect to the newly created timeline
    router.push(`/timelines/${timelineId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-blue-500 rounded-lg"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Creating New Timeline</h2>
        <p className="text-gray-600">Opening timeline creation wizard...</p>
      </div>

      <TimelineCreationModal
        isOpen={showModal}
        onClose={handleClose}
        onTimelineCreated={handleTimelineCreated}
        refreshTimelines={() => {
          // This will be handled by the dashboard's useEffect
          // The dashboard will automatically refresh when navigated to
        }}
      />
    </div>
  );
}

