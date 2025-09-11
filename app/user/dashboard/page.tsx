"use client";

import { useRouter } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  FileText,
  Brain,
  Plus,
  Search,
  MessageCircle,
  Edit,
  DollarSign,
  Award,
} from "lucide-react";
import { TimelineCard } from "../../components/TimelineTracker";
import {
  timelinesAtom,
  fetchTimelinesAtom,
  timelinesLoadingAtom,
  timelinesErrorAtom,
  deleteTimelineAtom,
} from "../../../lib/stores/timelineStore";
import { userAtom, isStudentAtom, userNameAtom } from "@/lib/stores/authStore";
import DeleteTimelineModal from "../../components/DeleteTimelineModal";
import { MentorProfileUpdateCard } from "../../components/MentorProfileUpdateCard";
import GradientButton from "../../components/ui/GradientButton";

import { Timeline } from "@/types";
import AcceptedResearchProjects from "../components/AcceptedResearchProjects";
import { Mentor } from "@/lib/types";

export default function UnifiedDashboard() {
  const router = useRouter();
  const timelines = useAtomValue(timelinesAtom);
  const fetchTimelines = useSetAtom(fetchTimelinesAtom);
  const deleteTimeline = useSetAtom(deleteTimelineAtom);
  const isLoading = useAtomValue(timelinesLoadingAtom);
  const error = useAtomValue(timelinesErrorAtom);
  const currentUser = useAtomValue(userAtom);
  const isStudent = useAtomValue(isStudentAtom);
  const userName = useAtomValue(userNameAtom);

  // Mentor profile state
  const [mentorProfile, setMentorProfile] = useState<Mentor | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    timeline: Timeline | null;
  }>({
    isOpen: false,
    timeline: null,
  });

  // Fetch timelines from API when component mounts
  useEffect(() => {
    console.log("🔄 Dashboard: Fetching timelines from API...");
    fetchTimelines();
  }, [fetchTimelines]);

  // Fetch mentor profile for mentors
  useEffect(() => {
    const fetchMentorProfile = async () => {
      if (!currentUser || currentUser.userType !== "MENTOR") {
        setMentorProfile(null);
        return;
      }

      setProfileLoading(true);
      try {
        const response = await fetch("/api/user/mentor-profile", {
          cache: "no-cache",
          headers: {
            "Cache-Control": "no-cache",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Fetched mentor profile:", data.mentorProfile);
          setMentorProfile(data.mentorProfile);
        } else {
          console.log("No mentor profile found or error:", response.status);
          setMentorProfile(null);
        }
      } catch (error) {
        console.error("Error fetching mentor profile:", error);
        setMentorProfile(null);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchMentorProfile();

    // Listen for profile updates via custom event
    const handleProfileUpdate = () => {
      fetchMentorProfile();
    };

    // Listen for user profile updates too
    const handleUserUpdate = () => {
      fetchMentorProfile();
    };

    window.addEventListener("mentorProfileUpdated", handleProfileUpdate);
    window.addEventListener("userProfileUpdated", handleUserUpdate);

    return () => {
      window.removeEventListener("mentorProfileUpdated", handleProfileUpdate);
      window.removeEventListener("userProfileUpdated", handleUserUpdate);
    };
  }, [currentUser]);

  // Handle delete click
  const handleDeleteClick = (timeline: Timeline) => {
    setDeleteModal({
      isOpen: true,
      timeline,
    });
  };

  // Handle timeline deletion
  const handleDeleteTimeline = async (timelineId: string) => {
    await deleteTimeline(timelineId);
    fetchTimelines();
  };

  const isMentor = !isStudent;

  // Check if mentor profile is complete
  const isProfileComplete = mentorProfile?.updatedAt !== null;

  console.log(isProfileComplete, "isProfileComplete");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-normal text-gray-900">
              {isStudent ? "My Research Dashboard" : "Mentor Dashboard"}
            </h1>
            {currentUser && (
              <p className="text-sm text-gray-500 mt-1">
                Welcome back, {userName}!
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push("/user/communities")}
              className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Users className="w-4 h-4" />
              <span>Communities</span>
            </button>
            
          </div>
        </div>
      </div>

      <div className="px-8 py-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="relative flex-1 max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search in Research"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isStudent && (
              <button
                onClick={() => router.push("/user/new")}
                className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-blue-50 to-emerald-50 hover:from-blue-100 hover:to-emerald-100 transition-all duration-300 text-left shadow-sm hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Create Timeline
                    </h3>
                    <p className="text-sm text-gray-500">
                      Plan your research journey
                    </p>
                  </div>
                </div>
              </button>
            )}

            {isStudent && (
              <button
                onClick={() => router.push("/user/communities")}
                className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 text-left shadow-sm hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-sm">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Find Mentors</h3>
                    <p className="text-sm text-gray-500">
                      Connect with expert researchers
                    </p>
                  </div>
                </div>
              </button>
            )}

            {isMentor && (
              <>
                <button
                  onClick={() => router.push("/user/mentors")}
                  className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-cyan-50 to-blue-50 hover:from-cyan-100 hover:to-blue-100 transition-all duration-300 text-left shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                      <MessageCircle className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        View Requests
                      </h3>
                      <p className="text-sm text-gray-500">
                        Check pending mentor requests
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push("/user/mentors")}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Edit className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Active Projects
                      </h3>
                      <p className="text-sm text-gray-500">
                        Manage ongoing collaborations
                      </p>
                    </div>
                  </div>
                </button>

                {!isProfileComplete && (
                  <button
                    onClick={() => router.push("/user/settings")}
                    className="p-4 border border-gray-200 rounded-lg bg-gradient-to-br from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-all duration-300 text-left shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center shadow-sm">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Update Profile
                        </h3>
                        <p className="text-sm text-gray-500">
                          Complete your mentor profile
                        </p>
                      </div>
                    </div>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Timeline Section - For All Users */}
        {isLoading && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Active Research Timelines
              </h2>
              <button
                onClick={() => fetchTimelines()}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
                <span>Refresh</span>
              </button>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-gray-500">Loading timelines...</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Active Research Timelines
              </h2>
              <button
                onClick={() => fetchTimelines()}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
                <span>Refresh</span>
              </button>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="text-center">
                <p className="text-red-600 mb-2">Error loading timelines</p>
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {isStudent && !isLoading && !error && timelines.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">
                Active Research Timelines
              </h2>
              <button
                onClick={() => fetchTimelines()}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
              >
                <span>Refresh</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {timelines.map((timeline) => (
                <TimelineCard
                  key={timeline.id}
                  timeline={timeline}
                  onDeleteClick={() => handleDeleteClick(timeline)}
                />
              ))}
            </div>
          </div>
        )}

        {!isLoading && isStudent && !error && timelines.length === 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Get Started with Research Planning
            </h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="text-center">
                <Calendar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No timelines yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start by evaluating your research topic, then create a
                  comprehensive timeline to plan your academic journey
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <GradientButton
                    onClick={() => router.push("/")}
                    variant="primary"
                    size="md"
                    className="inline-flex items-center space-x-2"
                  >
                    <Brain className="w-4 h-4" />
                    <span>Evaluate Topic</span>
                  </GradientButton>
                </div>
              </div>
            </div>
          </div>
        )}

        {isMentor && (
          <>
            <div className="mb-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Your Mentor Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <MessageCircle className="w-8 h-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Active Research
                      </p>
                      <p className="text-2xl font-bold text-blue-900">0</p>
                    </div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <DollarSign className="w-8 h-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-sm font-medium text-purple-800">
                        Hourly Rate
                      </p>
                      <p className="text-2xl font-bold text-purple-900">$0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!isProfileComplete && (
              <div className="mb-8">
                <MentorProfileUpdateCard />
              </div>
            )}

            <div className="mb-8">
              <AcceptedResearchProjects />
            </div>
          </>
        )}
      </div>

      <DeleteTimelineModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, timeline: null })}
        onDelete={handleDeleteTimeline}
        timeline={deleteModal.timeline}
      />
    </div>
  );
}
