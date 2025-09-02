"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  CheckCircle,
  PlayCircle,
  Circle,
  TrendingUp,
  BarChart3,
  ArrowRight,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Timeline, TimelineSection } from "@/types";

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
  return date.toLocaleDateString();
};

interface TimelineTrackerProps {
  timeline: Timeline;
  onSectionClick?: (section: TimelineSection) => void;
  onStatusUpdate?: (
    sectionId: string,
    status: TimelineSection["status"]
  ) => void;
  onDeleteClick?: (timeline: Timeline) => void;
}

// Compact card component for dashboard
export function TimelineCard({
  timeline,
  onDeleteClick,
}: {
  timeline: Timeline;
  onDeleteClick?: (timeline: Timeline) => void;
}) {
  const router = useRouter();

  const calculateProgress = () => {
    const totalSections = timeline.sections.length;
    const completedSections = timeline.sections.filter(
      (s) => s.status === "completed"
    ).length;
    return Math.round((completedSections / totalSections) * 100);
  };

  const progress = calculateProgress();

  const getCurrentSection = () => {
    const inProgressSection = timeline.sections.find(
      (s) => s.status === "in-progress"
    );
    if (inProgressSection) return inProgressSection;

    const nextSection = timeline.sections.find(
      (s) => s.status === "not-started"
    );
    return nextSection;
  };

  const currentSection = getCurrentSection();

  const handleCardClick = () => {
    if (!timeline.id) {
      console.error("Timeline ID is missing:", timeline);
      return;
    }

    try {
      router.push(`/user/timelines/${timeline.id}`);
    } catch (error) {
      console.error("Navigation error:", error);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click
    if (onDeleteClick) {
      onDeleteClick(timeline);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group relative"
      style={{ userSelect: "none" }}
    >
      {/* Action buttons */}
      <div className="absolute top-2 right-2 flex items-center space-x-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/user/timelines/${timeline.id}/gantt`);
          }}
          className="p-1 text-gray-400 hover:text-green-500 transition-colors rounded-full hover:bg-green-50"
          title="View Gantt Chart"
        >
          <BarChart3 className="w-4 h-4" />
        </button>

        <button
          onClick={handleDeleteClick}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
          title="Delete timeline"
        >
          <Trash2 className="w-4 h-4" />
        </button>

      
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">
            {timeline.researchTopic}
          </h3>
          {timeline.documentType && (
            <p className="text-sm text-gray-700 truncate mb-1">
              {timeline.documentType}
            </p>
          )}
          <p className="text-xs text-gray-500 truncate">
            {timeline.academicLevel} • {timeline.discipline}
          </p>
        </div>
        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
      </div>

      {/* Current Section */}
      {currentSection && (
        <div className="flex items-center space-x-2 text-xs text-gray-600">
          <div
            className={`w-2 h-2 rounded-full ${
              currentSection.status === "in-progress"
                ? "bg-blue-500"
                : "bg-gray-400"
            }`}
          />
          <span className="truncate">
            {currentSection.status === "in-progress"
              ? "Currently working on:"
              : "Next up:"}{" "}
            {currentSection.title}
          </span>
        </div>
      )}

      {/* Timeline Dates */}
      <div className="flex items-center space-x-1 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-100">
        <Calendar className="w-3 h-3" />
        <span>
          {formatDate(timeline.startDate)} -{" "}
          {formatDate(timeline.completionDate)}
        </span>
      </div>
    </div>
  );
}

export default function TimelineTracker({
  timeline,
  onSectionClick,
  onStatusUpdate,
}: TimelineTrackerProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const getStatusColor = (status: TimelineSection["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500";
      case "in-progress":
        return "bg-blue-500";
      case "not-started":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusIcon = (status: TimelineSection["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in-progress":
        return <PlayCircle className="w-4 h-4 text-blue-600" />;
      case "not-started":
        return <Circle className="w-4 h-4 text-gray-400" />;
      default:
        return <Circle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = (status: TimelineSection["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in-progress":
        return "In Progress";
      case "not-started":
        return "Not Started";
      default:
        return "Not Started";
    }
  };

  const calculateProgress = () => {
    const totalSections = timeline.sections.length;
    const completedSections = timeline.sections.filter(
      (s) => s.status === "completed"
    ).length;
    const inProgressSections = timeline.sections.filter(
      (s) => s.status === "in-progress"
    ).length;

    return {
      completed: completedSections,
      inProgress: inProgressSections,
      notStarted: totalSections - completedSections - inProgressSections,
      percentage: Math.round((completedSections / totalSections) * 100),
    };
  };

  const progress = calculateProgress();

  const handleSectionClick = (section: TimelineSection) => {
    if (onSectionClick) {
      onSectionClick(section);
    } else {
      setExpandedSection(expandedSection === section.id ? null : section.id);
    }
  };

  const handleStatusUpdate = (
    sectionId: string,
    newStatus: TimelineSection["status"]
  ) => {
    if (onStatusUpdate) {
      onStatusUpdate(sectionId, newStatus);
    }
  };

  const getNextDeadline = () => {
    const today = new Date();
    const startDate = parseDate(timeline.startDate);
    const inProgressSections = timeline.sections.filter(
      (s) => s.status === "in-progress"
    );

    if (inProgressSections.length === 0) {
      const nextSection = timeline.sections.find(
        (s) => s.status === "not-started"
      );
      if (nextSection && startDate) {
        return {
          section: nextSection,
          date: startDate,
          type: "start",
        };
      }
    }

    if (startDate) {
      return {
        section: timeline.sections[0],
        date: startDate,
        type: "start",
      };
    }

    return null;
  };

  const nextDeadline = getNextDeadline();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Research Timeline
          </h3>
          <p className="text-sm text-gray-600">
            {timeline.documentType} • {timeline.academicLevel} •{" "}
            {timeline.discipline}
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>
            {formatDate(timeline.startDate)} -{" "}
            {formatDate(timeline.completionDate)}
          </span>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">
                Overall Progress
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {progress.percentage}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Completed</p>
              <p className="text-2xl font-bold text-green-900">
                {progress.completed}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <PlayCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">In Progress</p>
              <p className="text-2xl font-bold text-blue-900">
                {progress.inProgress}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Circle className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Remaining</p>
              <p className="text-2xl font-bold text-gray-900">
                {progress.notStarted}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Next Deadline */}
      {nextDeadline && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-900">
                {nextDeadline.type === "start"
                  ? "Next to Start"
                  : "Current Deadline"}
              </p>
              <p className="text-sm text-yellow-800">
                {nextDeadline.section.title} •{" "}
                {nextDeadline.date.toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Timeline Progress
          </span>
          <span className="text-sm text-gray-500">{progress.percentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress.percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900 mb-3">Research Sections</h4>
        {timeline.sections.map((section) => (
          <div key={section.id} className="border border-gray-200 rounded-lg">
            <button
              onClick={() => handleSectionClick(section)}
              className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-3 h-3 rounded-full ${getStatusColor(
                      section.status
                    )}`}
                  />
                  <div>
                    <h5 className="font-medium text-gray-900">
                      {section.title}
                    </h5>
                    <p className="text-sm text-gray-600">
                      {section.duration} weeks
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    {getStatusIcon(section.status)}
                    <span>{getStatusText(section.status)}</span>
                  </div>
                  <div className="text-gray-400">
                    <svg
                      className="w-5 h-5"
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
            </button>

            {/* Expanded Section Content */}
            {expandedSection === section.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-gray-200 p-4 bg-gray-50"
              >
                <div className="space-y-4">
                  <div>
                    <h6 className="font-medium text-gray-900 mb-2">
                      Description
                    </h6>
                    <p className="text-sm text-gray-600">
                      {section.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h6 className="font-medium text-gray-900 mb-2">
                        What to Include
                      </h6>
                      <ul className="space-y-1">
                        {section.whatToInclude.map((item, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2 text-sm text-gray-600"
                          >
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h6 className="font-medium text-gray-900 mb-2">
                        Pro Tips
                      </h6>
                      <ul className="space-y-1">
                        {section.proTips.map((tip, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-2 text-sm text-gray-600"
                          >
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Status Update */}
                  <div className="border-t border-gray-200 pt-4">
                    <h6 className="font-medium text-gray-900 mb-2">
                      Update Status
                    </h6>
                    <div className="flex space-x-2">
                      {(
                        ["not-started", "in-progress", "completed"] as const
                      ).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(section.id, status)}
                          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            section.status === status
                              ? "bg-blue-100 text-blue-700 border border-blue-300"
                              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                          }`}
                        >
                          {getStatusText(status)}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
