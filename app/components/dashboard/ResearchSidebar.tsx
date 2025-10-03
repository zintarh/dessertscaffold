"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  CheckCircle,
  PlayCircle,
  Circle,
  CheckSquare,
  Square,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { DISSERTATION_SECTIONS, RESEARCH_TIMELINE_SECTIONS } from "@/lib/constants/timeline-sections";


interface Section {
  id: string;
  title: string;
  description: string;
  whatToInclude: string[];
  proTips: string[];
  status: "not-started" | "in-progress" | "completed";
  isCompleted: boolean;
  duration: number;
  content?: string;
}

interface Timeline {
  id: string;
  researchTopic?: string;
  documentType: string;
  sections: Section[];
}

interface ResearchSidebarProps {
  timeline: Timeline;
  currentSectionId: string;
  wordCount: number;
  onSectionClick: (sectionId: string) => void;
  onToggleSectionStatus: (
    sectionId: string,
    currentStatus: "not-started" | "in-progress" | "completed"
  ) => void;
  onToggleCompletion: (
    sectionId: string,
    isCompleted: boolean
  ) => Promise<void>;
  onExportSection: (section: Section) => void;
  onMarkComplete: () => void;
  showCompletionButton: boolean;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export default function ResearchSidebar({
  timeline,
  currentSectionId,
  wordCount,
  onSectionClick,
  onToggleSectionStatus,
  onToggleCompletion,
  onExportSection,
  onMarkComplete,
  showCompletionButton,
  isVisible,
  onToggleVisibility,
}: ResearchSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "b") {
        event.preventDefault();
        onToggleVisibility();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onToggleVisibility]);

  const toggleSectionExpansion = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };


  // Get static section data based on document type and section title
  const getStaticSectionData = (section: Section) => {
    let sections;
    if (timeline.documentType === "RESEARCH_TIMELINE") {
      sections = RESEARCH_TIMELINE_SECTIONS;
    } else if (timeline.documentType === "DISSERTATION") {
      sections = DISSERTATION_SECTIONS;
    } else {
      // Fallback: try both
      sections = [...RESEARCH_TIMELINE_SECTIONS, ...DISSERTATION_SECTIONS];
    }

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

  const getSectionContent = (section: Section) => {
    const staticData = getStaticSectionData(section);

    return (
      <div className="space-y-3 text-xs text-gray-700">
        <div>
          <h5 className="font-semibold text-gray-900 mb-2">
            Brief Description
          </h5>
          <p className="text-gray-700 leading-relaxed">
            {staticData?.description ||
              section.description ||
              "No description available"}
          </p>
        </div>

        <div>
          <h5 className="font-semibold text-gray-900 mb-2">
            What Must Be Included
          </h5>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {staticData?.whatToInclude?.map((item, index) => (
              <li key={index}>{item}</li>
            )) || <li className="text-gray-500">No items available</li>}
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-gray-900 mb-2">Pro Tips</h5>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {staticData?.proTips?.map((tip, index) => (
              <li key={index}>{tip}</li>
            )) || <li className="text-gray-500">No tips available</li>}
          </ul>
        </div>
      </div>
    );
  };

  if (!isVisible) {
    return null;
  }

  if (isCollapsed) {
    return (
      <div className="">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sticky top-8">
          <button
            onClick={() => setIsCollapsed(false)}
            className="w-full flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            title="Expand sidebar (Ctrl+B)"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Quick Stats in Collapsed Mode */}
          <div className="mt-3 text-center">
            <div className="text-xs text-gray-500 mb-1">Progress</div>
            <div className="text-lg font-bold text-blue-600">
              {timeline.sections.filter((s) => s.status === "completed").length}
              /{timeline.sections.length}
            </div>
            <div className="text-xs text-gray-400">sections</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 h-full flex flex-col overflow-hidden">
        {/* Header with collapse button */}
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <span>Research Sections</span>
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={onToggleVisibility}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              title="Hide sidebar (Ctrl+B)"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sections List */}
        <div
          className="space-y-3 flex-1 overflow-y-auto"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "#d1d5db #f3f4f6",
          }}
        >
          {timeline.sections.map((sectionItem) => {
            const isActive = sectionItem.id === currentSectionId;
            const isCompleted = sectionItem.isCompleted;
            const isExpanded = expandedSections.has(sectionItem.id);

            return (
              <div
                key={sectionItem.id}
                className={`group transition-all duration-300 ${
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500"
                    : "hover:bg-gray-50 border-l-4 border-transparent hover:border-l-blue-200"
                } rounded-lg overflow-hidden`}
              >
                {/* Section Header */}
                <div
                  className="cursor-pointer p-4 hover:bg-opacity-80 transition-all duration-200"
                  onClick={() => toggleSectionExpansion(sectionItem.id)}
                >
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <h4
                      className={`font-bold text-base ${
                        isActive ? "text-blue-900" : "text-gray-900"
                      } flex-1 min-w-0`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSectionClick(sectionItem.id);
                        }}
                        className="hover:text-blue-600 transition-colors hover:underline truncate block w-full text-left"
                        title={`Go to section: ${sectionItem.title}`}
                      >
                        {sectionItem.title}
                      </button>
                    </h4>
                    <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          try {
                            await onToggleCompletion(
                              sectionItem.id,
                              isCompleted
                            );
                          } catch (error) {
                            console.error("Error toggling completion:", error);
                          }
                        }}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          isCompleted
                            ? "text-green-600 hover:bg-green-100 hover:scale-110"
                            : "text-gray-400 hover:bg-gray-200 hover:scale-110"
                        }`}
                        title={
                          isCompleted
                            ? "Mark as incomplete"
                            : "Mark as complete"
                        }
                      >
                        {isCompleted ? (
                          <CheckSquare className="w-5 h-5" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                      {sectionItem.content && sectionItem.content.trim() && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onExportSection(sectionItem);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-100 transition-all duration-200 rounded-lg hover:scale-110"
                          title="Export section"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      )}
                      {/* Expand/Collapse Indicator */}
                      <div
                        className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-200 ${
                          isExpanded
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`text-sm ${isCompleted ? "text-green-600" : "text-gray-500"}`}
                    >
                      {isCompleted ? "Completed" : "Pending"}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <span className="text-sm">{sectionItem.duration}w</span>
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded
                      ? "max-h-[800px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="px-3 pb-3">
                    <div className="pt-2 border-t border-gray-100">
                      {/* Section Content */}
                      <div className="mb-4">
                        {getSectionContent(sectionItem)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Overall Document Progress */}
        <div className="mt-6 pt-5 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mb-4">Document Progress</h4>
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-blue-900">
                  Total Word Count
                </span>
                <span className="text-sm font-bold text-blue-900">
                  {wordCount}
                </span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      (wordCount / (timeline.sections.length * 200)) * 100
                    )}%`,
                  }}
                />
              </div>
              <p className="text-xs text-blue-600 mt-1">
                Target: {timeline.sections.length * 200} words
              </p>
            </div>

            {/* Mark Complete Button */}
            {showCompletionButton && (
              <button
                onClick={onMarkComplete}
                className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium shadow-sm"
              >
                <CheckCircle className="w-4 h-4" />
                <span>Mark Section Complete</span>
              </button>
            )}

            {timeline.sections.find((s) => s.id === currentSectionId)
              ?.status === "completed" && (
              <div className="w-full px-4 py-3 bg-gradient-to-r from-green-100 to-green-200 text-green-800 rounded-lg border border-green-300 flex items-center justify-center space-x-2 font-medium">
                <CheckCircle className="w-4 h-4" />
                <span>Section Completed! 🎉</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
