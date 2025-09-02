"use client";

import { useState, useEffect } from "react";
import { User, Clock, CheckCircle, XCircle, Mail } from "lucide-react";

interface MentorInvitation {
  id: string;
  role: string;
  invitedAt: string;
  respondedAt?: string;
  mentor: {
    id: string;
    name: string;
    email: string;
    image?: string;
    researchArea?: string;
    institutionName?: string;
  };
}

interface MentorInvitationsListProps {
  projectId: string;
}

export default function MentorInvitationsList({ projectId }: MentorInvitationsListProps) {
  const [invitations, setInvitations] = useState<MentorInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInvitations();
  }, [projectId]);

  const fetchInvitations = async () => {
    try {
      setIsLoading(true);
      // Fetch only active mentors (those who have accepted invitations)
      const response = await fetch(`/api/writing-space-access?projectId=${projectId}`);
      const data = await response.json();

      if (data.success) {
        // Filter to only show mentors with active access
        const activeMentors = data.data.filter((access: any) => access.accessType === "COMMENT");
        setInvitations(activeMentors.map((access: any) => ({
          id: access.id,
          role: "active",
          invitedAt: access.grantedAt,
          mentor: access.mentor,
        })));
      } else {
        setError(data.error || "Failed to fetch mentors");
      }
    } catch (error) {
      console.error("Error fetching mentors:", error);
      setError("Failed to fetch mentors");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (role: string) => {
    switch (role) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "declined":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusText = (role: string) => {
    switch (role) {
      case "pending":
        return "Pending Response";
      case "active":
        return "Accepted";
      case "declined":
        return "Declined";
      default:
        return "Unknown";
    }
  };

  const getStatusColor = (role: string) => {
    switch (role) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "declined":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Mentors</h3>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Mentors</h3>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchInvitations}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Mentors</h3>
      
      {invitations.length === 0 ? (
        <div className="text-center py-8">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No active mentors yet</p>
          <p className="text-sm text-gray-400">
            Mentors will appear here after they accept your email invitations
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  {invitation.mentor.image ? (
                    <img
                      src={invitation.mentor.image}
                      alt={invitation.mentor.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {invitation.mentor.name?.[0] || "M"}
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{invitation.mentor.name}</h4>
                  <p className="text-sm text-gray-600">{invitation.mentor.email}</p>
                  {invitation.mentor.researchArea && (
                    <p className="text-sm text-blue-600">{invitation.mentor.researchArea}</p>
                  )}
                  {invitation.mentor.institutionName && (
                    <p className="text-xs text-gray-500">{invitation.mentor.institutionName}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    // TODO: Implement messaging functionality
                    console.log("Message mentor:", invitation.mentor.id);
                  }}
                  className="flex items-center space-x-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>Message</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
