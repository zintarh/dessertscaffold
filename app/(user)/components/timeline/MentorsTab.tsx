"use client";

import { Users } from "lucide-react";
import MentorInvitationsList from "../MentorInvitationsList";

interface MentorsTabProps {
  isMentorAccess: boolean;
  timelineId: string;
}

export default function MentorsTab({ isMentorAccess, timelineId }: MentorsTabProps) {
  return (
    <div className="mb-8">
      {/* Mentor Invitations Section - Only show for project owners */}
      {!isMentorAccess && (
        <div>
          <MentorInvitationsList projectId={timelineId} />
        </div>
      )}
      
      {/* Show message for mentor access */}
      {isMentorAccess && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Mentor Management
            </h3>
            <p className="text-gray-600">
              You are viewing this timeline as a mentor. Mentor management features are not available in this view.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
