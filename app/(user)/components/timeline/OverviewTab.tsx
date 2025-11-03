"use client";

import { useState } from "react";
import {
  Clock,
  PlayCircle,
  FileText,
  MessageCircle,
  CheckCircle,
  Info,
} from "lucide-react";
import Button from "../ui/Button";
import MentorInvitationsList from "../MentorInvitationsList";
import {
  RESEARCH_TIMELINE_SECTIONS,
  DISSERTATION_SECTIONS,
} from "../../../../lib/constants/timeline-sections";
import { Timeline, TimelineSection } from "../../../../types";

interface OverviewTabProps {
  currentSection: TimelineSection | null;
  timeline: Timeline;
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  isMentorAccess: boolean;
  handleSectionClick: (section: TimelineSection) => void;
  handleToggleCompletion: (
    sectionId: string,
    isCompleted: boolean
  ) => Promise<void>;
  timelineId: string;
}

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
                section.isCompleted ? "bg-purple-500" : "bg-gray-400"
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

        <div className="mt-3">
          <div className="flex items-center justify-between mb-1">
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
            </div>
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

          <div className="mt-4 flex items-center justify-end">
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
      )}
    </div>
  );
}

export default function OverviewTab({
  currentSection,
  timeline,
  progress,
  isMentorAccess,
  handleSectionClick,
  handleToggleCompletion,
}: OverviewTabProps) {
  return (
    <>
      {currentSection && (
        <div className="mb-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  Next Up:
                </h3>
                <p className="text-purple-800 font-semibold text-xl mb-2">
                  {currentSection.title}
                </p>
                <div className="flex items-center space-x-4 text-purple-700">
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
                <Button
                  onClick={() => handleSectionClick(currentSection)}
                  variant="primary"
                  size="md"
                  className="flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Continue Writing</span>
                </Button>
              )}

              {isMentorAccess && (
                <Button
                  onClick={() => handleSectionClick(currentSection)}
                  variant="primary"
                  size="md"
                  className="flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>View Student's Work</span>
                </Button>
              )}

              {isMentorAccess && (
                <span className="px-4 py-2 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-200 flex items-center space-x-2">
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64 bg-white text-gray-900 text-sm placeholder-gray-500"
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
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white text-gray-900 text-sm">
                <option value="">All Status</option>
                <option value="not-started">Not Started</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Progress Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-lg font-semibold text-orange-600 mb-1">
                {progress.completed}
              </div>
              <div className="text-xs text-orange-700">Completed</div>
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
    </>
  );
}
