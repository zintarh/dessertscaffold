"use client";

import { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { userAtom } from "../../../lib/stores/authStore";
import { useRouter } from "next/navigation";
import { Clock, CheckCircle, XCircle, User, Calendar, BookOpen } from "lucide-react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";

interface MentorInvitation {
  id: string;
  role: string;
  invitedAt: string;
  respondedAt?: string;
  project: {
    id: string;
    title: string;
    documentType: string;
    researchTopic?: string;
    academicLevel?: string;
    discipline?: string;
    startDate?: string;
    completionDate?: string;
  };
  student: {
    id: string;
    name: string;
    email: string;
    image?: string;
    institutionName?: string;
  };
}

export default function MentorInvitationsPage() {
  const user = useAtomValue(userAtom);
  const router = useRouter();
  const [invitations, setInvitations] = useState<MentorInvitation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.userType !== "MENTOR") {
      router.push("/dashboard");
      return;
    }
    fetchInvitations();
  }, [user, router]);

  const fetchInvitations = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/mentor-invitations");
      const data = await response.json();

      if (data.success) {
        setInvitations(data.data);
      } else {
        setError(data.error || "Failed to fetch invitations");
      }
    } catch (error) {
      console.error("Error fetching invitations:", error);
      setError("Failed to fetch invitations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespondToInvitation = async (invitationId: string, action: "accept" | "decline") => {
    try {
      const invitation = invitations.find(inv => inv.id === invitationId);
      if (!invitation) return;

      const response = await fetch("/api/mentor-invite/respond", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId: invitation.project.id,
          action,
          inviteId: invitation.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(`Invitation ${action}ed successfully!`);
        fetchInvitations(); // Refresh the list
      } else {
        toast.error(data.error || `Failed to ${action} invitation`);
      }
    } catch (error) {
      console.error(`Error ${action}ing invitation:`, error);
      toast.error(`Failed to ${action} invitation. Please try again.`);
    }
  };

  const getStatusIcon = (role: string) => {
    switch (role) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "declined":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
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

  if (user?.userType !== "MENTOR") {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
            <Button
              onClick={fetchInvitations}
              variant="primary"
              size="lg"
              className="mt-4"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mentor Invitations</h1>
          <p className="mt-2 text-gray-600">
            View and respond to student invitations for mentoring their projects
          </p>
        </div>

        {invitations.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Invitations Yet</h3>
            <p className="text-gray-500">
              You haven't received any mentor invitations yet. Students can invite you using your invite codes.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {invitations.map((invitation) => (
              <div
                key={invitation.id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {invitation.student.image ? (
                        <img
                          src={invitation.student.image}
                          alt={invitation.student.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {invitation.student.name?.[0] || "S"}
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {invitation.student.name}
                      </h3>
                      <p className="text-sm text-gray-600">{invitation.student.email}</p>
                      {invitation.student.institutionName && (
                        <p className="text-sm text-blue-600">{invitation.student.institutionName}</p>
                      )}
                    </div>
                  </div>

                  <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(invitation.role)}`}>
                    {getStatusIcon(invitation.role)}
                    <span>{getStatusText(invitation.role)}</span>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Project Details</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p><strong>Title:</strong> {invitation.project.title}</p>
                      <p><strong>Type:</strong> {invitation.project.documentType}</p>
                      {invitation.project.researchTopic && (
                        <p><strong>Topic:</strong> {invitation.project.researchTopic}</p>
                      )}
                    </div>
                    <div>
                      {invitation.project.academicLevel && (
                        <p><strong>Level:</strong> {invitation.project.academicLevel}</p>
                      )}
                      {invitation.project.discipline && (
                        <p><strong>Discipline:</strong> {invitation.project.discipline}</p>
                      )}
                      {invitation.project.startDate && (
                        <p><strong>Start:</strong> {new Date(invitation.project.startDate).toLocaleDateString()}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Invited: {new Date(invitation.invitedAt).toLocaleDateString()}</span>
                    </div>
                    {invitation.respondedAt && (
                      <div className="flex items-center space-x-1">
                        <span>Responded: {new Date(invitation.respondedAt).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>

                  {invitation.role === "pending" && (
                    <div className="flex space-x-3">
                      <Button
                        onClick={() => handleRespondToInvitation(invitation.id, "decline")}
                        variant="danger"
                        size="md"
                      >
                        Decline
                      </Button>
                      <Button
                        onClick={() => handleRespondToInvitation(invitation.id, "accept")}
                        variant="success"
                        size="md"
                      >
                        Accept
                      </Button>
                    </div>
                  )}

                  {invitation.role === "active" && (
                    <Button
                      onClick={() => router.push(`/timelines/${invitation.project.id}`)}
                      variant="primary"
                      size="md"
                    >
                      View Project
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
