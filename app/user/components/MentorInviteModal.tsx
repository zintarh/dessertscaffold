"use client";

import { useState } from "react";
import Modal, { ModalFooter } from "../../components/Modal";
import toast from "react-hot-toast";
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react";

interface MentorInviteModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  projectTitle: string;
  onInviteSuccess?: () => void;
}

export default function MentorInviteModal({
  isOpen,
  onClose,
  projectId,
  projectTitle,
  onInviteSuccess,
}: MentorInviteModalProps) {
  const [mentorCode, setMentorCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInviteMentor = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mentorCode.trim()) {
      toast.error("Please enter a mentor code");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/invite-codes", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: mentorCode.trim(),
          timelineId: projectId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Mentor invited successfully! They will receive an email with Accept/Decline buttons. The invitation expires in 7 days.");
        setMentorCode("");
        onClose();
        onInviteSuccess?.();
      } else {
        toast.error(data.error || "Failed to invite mentor");
      }
    } catch (error) {
      console.error("Error inviting mentor:", error);
      toast.error("Failed to invite mentor. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={onClose}
      title="Invite a Mentor"
      description={`Invite a mentor to collaborate on "${projectTitle}"`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <UserPlus className="w-5 h-5 text-blue-600 mt-0.5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-blue-800 mb-1">
                How Mentor Invitations Work
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ask your mentor for their unique invite code</li>
                <li>• Enter the code below to send an invitation</li>
                <li>• They'll receive an email with project details</li>
                <li>• Once accepted, they can view and comment on your project</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleInviteMentor} className="space-y-4">
          <div>
            <label htmlFor="mentorCode" className="block text-sm font-medium text-gray-700 mb-2">
              Mentor Invite Code
            </label>
            <input
              type="text"
              id="mentorCode"
              value={mentorCode}
              onChange={(e) => setMentorCode(e.target.value)}
              placeholder="Enter the mentor's invite code"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder-gray-500"
              disabled={isLoading}
            />
            <p className="mt-2 text-sm text-gray-500">
              This is the unique code your mentor shared with you
            </p>
          </div>

          {/* Email Notification Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-green-800 mb-1">
                  Email Notification
                </h4>
                <p className="text-sm text-green-700">
                  When you invite a mentor, they will receive an email with your project details, 
                  research topic, and overview. They can accept or decline the invitation directly from the email.
                </p>
              </div>
            </div>
          </div>
        </form>

        <ModalFooter>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleInviteMentor}
            disabled={!mentorCode.trim() || isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Inviting...</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Send Invitation</span>
              </>
            )}
          </button>
        </ModalFooter>
      </div>
    </Modal>
  );
}
