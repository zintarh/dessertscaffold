"use client";

import { useParams, useRouter } from "next/navigation";
import { useAtomValue, useSetAtom } from "jotai";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  PlayCircle,
  TrendingUp,
  BarChart3,
  Target,
  FileText,
  Info,
  Calendar,

  MessageCircle,
} from "lucide-react";
import {
  timelinesAtom,
  fetchTimelinesAtom,
  timelinesLoadingAtom,
} from "../../../../lib/stores/timelineStore";
import { useState, useEffect } from "react";
import { TimelineSection } from "@/types";
import {
  RESEARCH_TIMELINE_SECTIONS,
  DISSERTATION_SECTIONS,
} from "../../../../lib/constants/timeline-sections";
import MentorInvitationsList from "../../components/MentorInvitationsList";
import MentorInviteModal from "../../components/MentorInviteModal";
import toast from "react-hot-toast";
import { isStudentAtom } from "@/lib/stores/authStore";

// Utility function to safely parse dates from API
const parseDate = (
  dateValue: Date | string | null | undefined
): Date | null => {
  if (!dateValue) return null;
  if (dateValue instanceof Date) return dateValue;
  if (typeof dateValue === "string") {
    const parsed = new Date(dateValue);
    return isNaN(parsed.getTime()) ? null : parsed;
  }
  return null;
};

// Utility function to format dates safely
const formatDate = (dateValue: Date | string | null | undefined): string => {
  const date = parseDate(dateValue);
  if (!date) return "Not set";
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

function AccordionSection({
  section,
  index,
  onSectionClick,
  timeline,
  onToggleCompletion,
}: {
  section: TimelineSection;
  index: number;
  onSectionClick: (section: TimelineSection) => void;
  timeline: any;
  onToggleCompletion: (
    sectionId: string,
    isCompleted: boolean
  ) => Promise<void>;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const isStudent = useAtomValue(isStudentAtom);

  // Get static section data based on document type and section title
  const getStaticSectionData = () => {
    console.log("🔍 Looking for section:", section.title);
    console.log("📚 Timeline document type:", timeline.documentType);

    let sections;
    if (timeline.documentType === "RESEARCH_TIMELINE") {
      sections = RESEARCH_TIMELINE_SECTIONS;
    } else if (timeline.documentType === "DISSERTATION") {
      sections = DISSERTATION_SECTIONS;
    } else {
      // Fallback: try both
      sections = [...RESEARCH_TIMELINE_SECTIONS, ...DISSERTATION_SECTIONS];
    }

    console.log(
      "📚 Available sections:",
      sections.map((s) => s.title)
    );

    // Try exact match first
    let found = sections.find((s) => s.title === section.title);

    // If no exact match, try partial match
    if (!found) {
      found = sections.find(
        (s) =>
          s.title.toLowerCase().includes(section.title.toLowerCase()) ||
          section.title.toLowerCase().includes(s.title.toLowerCase())
      );
    }

    console.log("✅ Found static data:", found);
    return found || null;
  };

  const staticData = getStaticSectionData();

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header - Always Visible */}
      <div
        className="p-4 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
        onClick={() => {
          // Only allow expansion if we have static data
          if (staticData || isExpanded) {
            setIsExpanded(!isExpanded);
          } else {
            console.log(
              "⚠️ No static data available for section:",
              section.title
            );
          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-semibold ${
                section.isCompleted ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-lg font-semibold text-gray-900 mb-2 truncate"
                title={section.title}
              >
                {section.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed max-w-2xl">
                {staticData
                  ? staticData.description?.split("\n")[0] ||
                    "Section description"
                  : "No additional details available"}
              </p>
              {!staticData && (
                <p className="text-xs text-orange-600 mt-1">
                  ⚠️ Section details not available
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Duration
              </span>
              <p className="text-sm font-semibold text-gray-900">
                {section.duration} weeks
              </p>
            </div>

            {!section.isCompleted && !timeline.isMentorAccess && (
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Prevent accordion expansion
                  onSectionClick(section);
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                <span>Write</span>
              </button>
            )}
            {timeline.isMentorAccess && (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                View Only
              </span>
            )}
            <div
              className={`w-5 h-5 transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            >
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Section Progress Bar - Always Visible */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Section Progress
            </span>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  section.isCompleted
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                {section.isCompleted ? "Completed" : "Not Started"}
              </span>
              <span className="text-sm font-semibold text-gray-900">
                {section.isCompleted ? "100%" : "0%"}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                section.isCompleted ? "bg-green-500" : "bg-gray-300"
              }`}
              style={{
                width: section.isCompleted ? "100%" : "0%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      {isExpanded && staticData && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2 text-base">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Info className="w-4 h-4 text-blue-600" />
                </div>
                <span>What to Include</span>
              </h4>
              <ul className="space-y-2">
                {staticData.whatToInclude?.map((item: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-3 p-2 rounded-md hover:bg-blue-50 transition-colors"
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                )) || (
                  <li className="text-gray-500 text-sm">No items available</li>
                )}
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2 text-base">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <span>Pro Tips</span>
              </h4>
              <ul className="space-y-2">
                {staticData.proTips?.map((tip: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-3 p-2 rounded-md hover:bg-green-50 transition-colors"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                    <span className="text-gray-700 text-sm leading-relaxed">
                      {tip}
                    </span>
                  </li>
                )) || (
                  <li className="text-gray-500 text-sm">No tips available</li>
                )}
              </ul>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2 text-base">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <span>Description</span>
            </h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {staticData.description || "No description available"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border border-gray-200">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">
                    Estimated time:{" "}
                    <span className="font-semibold text-gray-900">
                      {section.duration} weeks
                    </span>
                  </span>
                </div>
                {section.content && (
                  <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Content available</span>
                  </div>
                )}
              </div>
              {!section.isCompleted && !timeline.isMentorAccess && (
                <button
                  onClick={() => onSectionClick(section)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 font-medium text-sm"
                >
                  <FileText className="w-4 h-4" />
                  <span>Continue Writing</span>
                </button>
              )}
              {timeline.isMentorAccess && (
                <span className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200">
                  Mentor View - Comments Available
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fallback if no static data */}
      {isExpanded && !staticData && (
        <div className="border-t border-gray-200 p-6 bg-gray-50">
          <div className="text-center text-gray-500">
            <Info className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p
              className="truncate"
              title={`Section details not available for "${section.title}"`}
            >
              Section details not available for "{section.title}"
            </p>
            <p className="text-sm mt-1">
              Document type: {timeline.documentType}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to format timeline duration
const formatTimelineDuration = (sections: any[]) => {
  const totalWeeks = sections.reduce(
    (total, section) => total + section.duration,
    0
  );
  if (totalWeeks < 4) {
    return `${totalWeeks} weeks`;
  } else if (totalWeeks < 52) {
    const months = Math.round(totalWeeks / 4.33);
    return `${months} months (${totalWeeks} weeks)`;
  } else {
    const years = Math.round(totalWeeks / 52);
    return `${years} year${years > 1 ? "s" : ""} (${totalWeeks} weeks)`;
  }
};

export default function TimelineDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const timelineId = params.id as string;
  const [isMentorInviteModalOpen, setIsMentorInviteModalOpen] = useState(false);
  const [progress, setProgress] = useState({
    completed: 0,
    total: 0,
    percentage: 0,
  });

  const timelines = useAtomValue(timelinesAtom);
  const fetchTimelines = useSetAtom(fetchTimelinesAtom);
  const isLoading = useAtomValue(timelinesLoadingAtom);

  const timeline = timelines.find((t) => t.id === timelineId);

  const isMentorAccess = timeline?.isMentorAccess || false;

  // Fetch timelines when component mounts
  useEffect(() => {
    if (timelines.length === 0) {
      fetchTimelines();
    }
  }, [timelines.length, fetchTimelines]);

  useEffect(() => {
    if (timeline) {
      const completedSections = timeline.sections.filter(
        (s) => s.isCompleted
      ).length;
      const totalSections = timeline.sections.length;
      const percentage =
        totalSections > 0
          ? Math.round((completedSections / totalSections) * 100)
          : 0;

      setProgress({
        completed: completedSections,
        total: totalSections,
        percentage,
      });
    }
  }, [timeline]);

  const handleToggleCompletion = async (
    sectionId: string,
    isCompleted: boolean
  ) => {
    try {
      const response = await fetch(
        `/api/timelines/${timelineId}/sections/${sectionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isCompleted }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update section");
      }

      const data = await response.json();

      if (data.success) {
        // Update local state optimistically
        const updatedTimeline = {
          ...timeline!,
          sections: timeline!.sections.map((section) =>
            section.id === sectionId ? { ...section, isCompleted } : section
          ),
        };

        // Update the timelines atom
        const updatedTimelines = timelines.map((t) =>
          t.id === timelineId ? updatedTimeline : t
        );

        // We need to update the atom directly since we don't have a setter
        // For now, we'll refetch the timelines to get the updated data
        await fetchTimelines();

        // Show success toast
        toast.success(
          isCompleted
            ? "Section marked as completed! 🎉"
            : "Section marked as incomplete"
        );
      }
    } catch (error) {
      console.error("Error updating section completion:", error);
      toast.error("Failed to update section. Please try again.");
      throw error; // Re-throw to let the component handle the error state
    }
  };

  // Show loading state while data is being fetched
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Loading Timeline...
            </h1>
            <p className="text-gray-600">
              Please wait while we fetch your timeline data.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show not found only after loading is complete and timeline is not found
  if (!timeline) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Timeline Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The timeline you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push("/user/dashboard")}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }


  const getCurrentSection = () => {
    const nextSection = timeline.sections.find((s) => !s.isCompleted);
    return nextSection;
  };

  const currentSection = getCurrentSection();

  const getNextDeadline = () => {
    const today = new Date();
    const nextSection = timeline.sections.find((s) => !s.isCompleted);

    if (nextSection) {
      return {
        section: nextSection,
        date: timeline.startDate,
        type: "next",
      };
    }

    return null;
  };

  const nextDeadline = getNextDeadline();

  const handleSectionClick = (section: TimelineSection) => {
    console.log("Section clicked:", section);
    router.push(`/user/writing/${timelineId}/${section.id}`);
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => router.push("/user/dashboard")}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-semibold text-gray-900">
                      {timeline.documentType} Timeline
                    </h1>
                    {isMentorAccess && (
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        Mentor Access
                      </span>
                    )}
                  </div>
                  {timeline.researchTopic && (
                    <p className="text-base font-medium text-blue-600 mb-1">
                      {timeline.researchTopic}
                    </p>
                  )}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>
                      {timeline.academicLevel} • {timeline.discipline}
                    </span>
                    {isMentorAccess && timeline.user && (
                      <>
                        <span>•</span>
                        <span>Student: {timeline.user.name}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    router.push(`/user/timelines/${timelineId}/gantt`)
                  }
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2 text-sm"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>View Gantt Chart</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-1 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Overall Progress
              </h3>
              <div className="flex flex-col items-center justify-center h-32 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-1">
                      Current Progress
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {progress.percentage}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Timeline Stats Card */}
            <div className="bg-white rounded-lg border border-gray-200 p-6 col-span-2 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Timeline Details
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    icon: Calendar,
                    bgColor: "bg-blue-100",
                    iconColor: "text-blue-600",
                    label: "Start Date",
                    value: formatDate(timeline.startDate),
                  },
                  {
                    icon: Target,
                    bgColor: "bg-green-100",
                    iconColor: "text-green-600",
                    label: "End Date",
                    value: formatDate(timeline.completionDate),
                  },
                  {
                    icon: Clock,
                    bgColor: "bg-purple-100",
                    iconColor: "text-purple-600",
                    label: "Duration",
                    value: formatTimelineDuration(timeline.sections),
                  },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}
                    >
                      <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <p className="text-xs text-gray-600 mb-1 font-medium">
                      {stat.label}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Current Status */}
        {currentSection && (
          <div className="mb-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                  <PlayCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    Next Up:
                  </h3>
                  <p className="text-blue-800 font-semibold text-xl mb-2">
                    {currentSection.title}
                  </p>
                  <div className="flex items-center space-x-4 text-blue-700">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {currentSection.duration} weeks
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                      <span className="text-sm font-medium">Not Started</span>
                    </div>
                  </div>
                </div>
                {!currentSection.isCompleted && !isMentorAccess && (
                  <button
                    onClick={() => handleSectionClick(currentSection)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-sm flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Continue Writing</span>
                  </button>
                )}

                {isMentorAccess && (
                  <button
                    onClick={() => handleSectionClick(currentSection)}
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg hover:from-blue-700 hover:to-emerald-600 transition-all duration-300 shadow-lg hover:shadow-xl font-medium text-sm flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>View Student's Work</span>
                  </button>
                )}

                {isMentorAccess && (
                  <span className="px-4 py-2 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200 flex items-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Mentor Access - Can Comment</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* All Sections with Progress - Accordion Style */}
        <div className="mb-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  Research Sections Progress
                </h2>
                <p className="text-gray-600 text-sm">
                  Track your progress through each section of your research
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search sections..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 bg-white text-gray-900 text-sm placeholder-gray-500"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900 text-sm">
                  <option value="">All Status</option>
                  <option value="not-started">Not Started</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            {/* Progress Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="text-lg font-semibold text-green-600 mb-1">
                  {progress.completed}
                </div>
                <div className="text-xs text-green-700">Completed</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-lg font-semibold text-gray-600 mb-1">
                  {progress.total - progress.completed}
                </div>
                <div className="text-xs text-gray-700">Not Started</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-lg font-semibold text-purple-600 mb-1">
                  {progress.total}
                </div>
                <div className="text-xs text-purple-700">Total Sections</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {timeline.sections.map((section, index) => (
              <AccordionSection
                key={section.id}
                section={section}
                index={index}
                onSectionClick={handleSectionClick}
                timeline={timeline}
                onToggleCompletion={handleToggleCompletion}
              />
            ))}
          </div>
        </div>

        {/* Mentor Invitations Section - Only show for project owners */}
        {!isMentorAccess && (
          <div className="mt-8">
            <MentorInvitationsList projectId={timelineId} />
          </div>
        )}
      </div>

      {/* Mentor Invite Modal */}
      <MentorInviteModal
        isOpen={isMentorInviteModalOpen}
        onClose={() => setIsMentorInviteModalOpen(false)}
        projectId={timelineId}
        projectTitle={timeline.researchTopic || timeline.documentType}
        onInviteSuccess={() => {
          window.location.reload();
        }}
      />
    </div>
  );
}
