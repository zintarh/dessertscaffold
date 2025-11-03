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
  Users,
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
import MentorInviteModal from "../../components/MentorInviteModal";
import toast from "react-hot-toast";
import Button from "../../components/ui/Button";
import OverviewTab from "../../components/timeline/OverviewTab";
import StatsTab from "../../components/timeline/StatsTab";
import ChartTab from "../../components/timeline/ChartTab";
import MentorsTab from "../../components/timeline/MentorsTab";

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

  const getStaticSectionData = () => {
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

    return found || null;
  };

  const staticData = getStaticSectionData();

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
      {/* Header - Always Visible */}
      <div
        className="p-3 hover:bg-gray-50 transition-all duration-200 cursor-pointer"
        onClick={() => {
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
          <div className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-semibold ${
                section.isCompleted ? "bg-orange-500" : "bg-gray-400"
              }`}
            >
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h3
                className="text-base font-semibold text-gray-900 mb-1 truncate"
                title={section.title}
              >
                {section.title}
              </h3>
              <p className="text-gray-600 text-xs leading-relaxed max-w-2xl">
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
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Duration
              </span>
              <p className="text-sm font-semibold text-gray-900">
                {section.duration} weeks
              </p>
            </div>

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
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-gray-700">
              Section Progress
            </span>
            <div className="flex items-center space-x-2">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  section.isCompleted
                    ? "bg-orange-100 text-orange-800 border border-orange-200"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                {section.isCompleted ? "Completed" : "Not Started"}
              </span>
              <span className="text-xs font-semibold text-gray-900">
                {section.isCompleted ? "100%" : "0%"}
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                section.isCompleted ? "bg-orange-500" : "bg-gray-300"
              }`}
              style={{
                width: section.isCompleted ? "100%" : "0%",
              }}
            />
          </div>
        </div>
      </div>

      {isExpanded && staticData && (
        <div className="border-t border-gray-200 p-4 bg-gray-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
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

            <div className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center space-x-2 text-base">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-orange-600" />
                </div>
                <span>Pro Tips</span>
              </h4>
              <ul className="space-y-2">
                {staticData.proTips?.map((tip: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start space-x-3 p-2 rounded-md hover:bg-orange-50 transition-colors"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
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
                  <div className="flex items-center space-x-2 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded-lg border border-orange-200">
                    <CheckCircle className="w-4 h-4" />
                    <span className="font-medium">Content available</span>
                  </div>
                )}
              </div>
              {!section.isCompleted && !timeline.isMentorAccess && (
                <Button
                  onClick={() => onSectionClick(section)}
                  variant="primary"
                  size="md"
                  className="flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Continue Writing</span>
                </Button>
              )}
              {timeline.isMentorAccess && (
                <span className="px-4 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-200">
                  Mentor View - Comments Available
                </span>
              )}
            </div>
          </div>
        </div>
      )}

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
  const [activeTab, setActiveTab] = useState<
    "overview" | "stats" | "chart" | "mentors"
  >("overview");
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
            <Button
              onClick={() => router.push("/dashboard")}
              variant="primary"
              size="md"
            >
              Back to Dashboard
            </Button>
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


  const handleSectionClick = (section: TimelineSection) => {
    console.log("Section clicked:", section);
    router.push(`/writing/${timelineId}/${section.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={() => router.push("/dashboard")}
                  variant="outline"
                  size="sm"
                  className="p-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div>
                  <div className="flex items-center space-x-3">
                    <h1 className="text-xl font-semibold text-gray-900">
                      {timeline.documentType} Timeline
                    </h1>
                    {isMentorAccess && (
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-medium rounded-full">
                        Mentor Access
                      </span>
                    )}
                  </div>
                  {timeline.researchTopic && (
                    <p className="text-base max-w-2xl font-medium text-purple-600 mb-1 line-clamp-1">
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

           
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "overview", name: "Overview", icon: FileText },
              { id: "stats", name: "Stats", icon: BarChart3 },
              { id: "chart", name: "Chart", icon: TrendingUp },
              { id: "mentors", name: "Mentors", icon: Users },
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as "overview" | "stats" | "chart" | "mentors"
                    )
                  }
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-purple-500 text-purple-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "overview" && (
          <OverviewTab
            currentSection={currentSection || null}
            timeline={timeline}
            progress={progress}
            isMentorAccess={isMentorAccess}
            handleSectionClick={handleSectionClick}
            handleToggleCompletion={handleToggleCompletion}
            timelineId={timelineId}
          />
        )}

        {activeTab === "stats" && (
          <StatsTab
            timeline={timeline}
            progress={progress}
            formatDate={formatDate}
            formatTimelineDuration={formatTimelineDuration}
          />
        )}

        {activeTab === "chart" && <ChartTab timeline={timeline} />}

        {activeTab === "mentors" && (
          <MentorsTab isMentorAccess={isMentorAccess} timelineId={timelineId} />
        )}
      </div>

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
