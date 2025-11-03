"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAtomValue } from "jotai";
import { userAtom } from "../../../../lib/stores/authStore";
import Modal, { ModalFooter } from "../../../components/dashboard/Modal";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  Globe,
  Linkedin,
  Twitter,
  Github,
} from "lucide-react";

interface MentorData {
  id: string;
  name: string;
  email: string;
  image?: string;
  institutionName?: string;
  researchArea?: string;
  academicLevel?: string;
  userType: string;
  bio: string;
  expertise: string[];
  hourlyRate: number;
  availability: string;
  responseTime: string;
  languages: string[];
  timezone: string;
  education: string[];
  publications: string[];
  specializations: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  completedProjects: number;
  hasCompleteProfile: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function MentorProfilePage() {
  const router = useRouter();
  const params = useParams();
  const user = useAtomValue(userAtom);

  const [messageText, setMessageText] = useState("");
  const [mentor, setMentor] = useState<MentorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  // Fetch mentor data
  useEffect(() => {
    const fetchMentor = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/mentors/${params.id as string}`);

        if (!response.ok) {
          throw new Error("Failed to fetch mentor");
        }
        const data = await response.json();
        setMentor(data.mentor);
      } catch (error: any) {
        console.error("Error fetching mentor:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentor();
  }, [params.id]);

  // Set default message when modal opens
  useEffect(() => {
    if (isMessageModalOpen && mentor && !messageText) {
      const defaultMessage = `Hi ${mentor.name}! 

I'm interested in your expertise in ${
        mentor.researchArea || "your field"
      }. I'm working on a research project and would love to discuss how you might be able to help me with guidance and mentorship.

Could we schedule a brief conversation to discuss this further? I'm available for a call or meeting at your convenience.

Thank you for your time and consideration!`;
      setMessageText(defaultMessage);
    }
  }, [isMessageModalOpen, mentor, messageText]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !mentor) return;

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          senderId: user?.id,
          receiverId: mentor.id,
          subject: `Message from student to ${mentor.name}`,
          body: messageText.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      toast.success(`Message sent successfully! An email notification has been sent to ${mentor.name}. Please stay tuned for their response!`);
      setMessageText("");
      setIsMessageModalOpen(false);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mentor profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !mentor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Mentor Not Found
          </h3>
          <p className="text-gray-600 mb-6">
            {error || "The mentor you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => router.push("/communities")}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
          >
            Back to Communities
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push("/communities")}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h1 className="text-2xl font-bold text-gray-900">
                      {mentor.name}
                    </h1>
                    {!mentor.hasCompleteProfile && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full border border-yellow-200">
                        Profile in progress
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600">
                    {mentor.researchArea} • {mentor.institutionName}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold ${
                    mentor.availability === "Available"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : "bg-red-100 text-red-800 border border-red-200"
                  }`}
                >
                  {mentor.availability === "Available"
                    ? "Available for Mentoring"
                    : "Currently Busy"}
                </div>
                <button
                  onClick={() => setIsMessageModalOpen(true)}
                  disabled={!mentor.hasCompleteProfile}
                  className={`px-6 py-2 rounded-xl transition-colors duration-200 font-medium flex items-center space-x-2 ${
                    mentor.hasCompleteProfile
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-400 text-white cursor-not-allowed'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{mentor.hasCompleteProfile ? 'Reach Out' : 'Profile Incomplete'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Mentor Info */}
          <div className="lg:col-span-2">
            {/* Profile Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 p-8 shadow-lg mb-8">
              <div className="flex flex-col md:flex-row items-start space-y-6 md:space-y-0 md:space-x-8">
                <img
                  src={mentor.image || "/images/default-mentor.jpg"}
                  alt={mentor.name}
                  className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                  onError={(e) => {
                    e.currentTarget.src = "/images/default-mentor.jpg";
                  }}
                />
                <div className="flex-1">
                  <div className="mb-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                      {mentor.name}
                    </h2>
                    <p className="text-xl text-blue-600 font-semibold mb-2">
                      {mentor.researchArea}
                    </p>
                    <p className="text-gray-600 mb-4">
                      {mentor.institutionName}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>Response: {mentor.responseTime}</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>{mentor.completedProjects} projects completed</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200/60">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  About
                </h3>
                {mentor.bio ? (
                  <p className="text-gray-700 leading-relaxed">{mentor.bio}</p>
                ) : (
                  <p className="text-gray-500 italic">Profile information is being updated...</p>
                )}
              </div>

              {/* Profile Completion Notice */}
              {!mentor.hasCompleteProfile && (
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 text-sm font-bold">!</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 mb-1">
                        Profile in Progress
                      </h4>
                      <p className="text-sm text-yellow-700">
                        This mentor is still completing their profile. Some information may be missing or incomplete.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 shadow-lg">
              <div className="p-8">
                <div className="space-y-8">
                  {/* Expertise */}
                  {mentor.expertise && mentor.expertise.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Areas of Expertise
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {mentor.expertise.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Specializations */}
                  {mentor.specializations &&
                    mentor.specializations.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Mentoring Specializations
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {mentor.specializations.map(
                            (specialization, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full border border-green-200"
                              >
                                {specialization}
                              </span>
                            )
                          )}
                        </div>
                      </div>
                    )}

                  {/* Education */}
                  {mentor.education && mentor.education.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Education
                      </h3>
                      <div className="space-y-3">
                        {mentor.education.map((edu, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <p className="text-gray-900">{edu}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Publications */}
                  {mentor.publications && mentor.publications.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Publications
                      </h3>
                      <div className="space-y-3">
                        {mentor.publications.map((pub, index) => (
                          <div
                            key={index}
                            className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <p className="text-gray-900">{pub}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {mentor.languages && mentor.languages.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Languages
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {mentor.languages.map((language, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full border border-purple-200"
                          >
                            {language}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Social Links */}
                  {mentor.socialLinks &&
                    Object.values(mentor.socialLinks).some((link) => link) && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Connect
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {mentor.socialLinks.linkedin && (
                            <a
                              href={mentor.socialLinks.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Linkedin className="w-4 h-4" />
                              <span>LinkedIn</span>
                            </a>
                          )}
                          {mentor.socialLinks.twitter && (
                            <a
                              href={mentor.socialLinks.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
                            >
                              <Twitter className="w-4 h-4" />
                              <span>Twitter</span>
                            </a>
                          )}
                          {mentor.socialLinks.github && (
                            <a
                              href={mentor.socialLinks.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                            >
                              <Github className="w-4 h-4" />
                              <span>GitHub</span>
                            </a>
                          )}
                          {mentor.socialLinks.website && (
                            <a
                              href={mentor.socialLinks.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                            >
                              <Globe className="w-4 h-4" />
                              <span>Website</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-gray-200/60 p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Completed Projects</span>
                  <span className="font-semibold text-gray-900">
                    {mentor.completedProjects}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold text-gray-900">
                    {mentor.responseTime}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Availability</span>
                  <span
                    className={`font-semibold ${
                      mentor.availability === "Available"
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {mentor.availability}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Timezone</span>
                  <span className="font-semibold text-gray-900">
                    {mentor.timezone}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setIsMessageModalOpen(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Reach Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      <Modal
        open={isMessageModalOpen}
        onOpenChange={setIsMessageModalOpen}
        title={`Reach Out to ${mentor?.name}`}
        description="Send a message to connect with this mentor"
        size="2xl"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Message
            </label>
            <textarea
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder="Hi! I'm interested in your expertise in [research area]. I'm working on [brief description of your project] and would love to discuss how you might be able to help me with [specific areas where you need guidance]. 

Could we schedule a brief conversation to discuss this further? I'm available [your availability].

Thank you for your time!"
              rows={8}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white text-gray-900"
            />
          </div>

          {/* Email Notification Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-blue-800 mb-1">
                  Email Notification
                </h4>
                <p className="text-sm text-blue-700">
                  When you send this message, an email notification will be automatically sent to {mentor?.name}. 
                  They will receive your message content and can respond directly through the platform. 
                  Please stay tuned for their response!
                </p>
              </div>
            </div>
          </div>

          <ModalFooter>
            <button
              onClick={() => setIsMessageModalOpen(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!messageText.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 font-medium flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </ModalFooter>
        </div>
      </Modal>
    </div>
  );
}
