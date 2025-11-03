"use client";
import { Clock, ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import {
  getCurrentSections,
  formatTotalDuration,
  calculateTotalDuration,
} from "@/lib/constants/timeline-sections";

interface Section {
  title: string;
  order: number;
  description: string;
  whatToInclude: string[];
  proTips: string[];
}

interface TimelineStepProps {
  projectType: "dissertation" | "research-proposal";
  sectionDurations: Record<string, string>;
  expandedSections: Set<string>;
  onToggleSection: (sectionTitle: string) => void;
  onUpdateSectionDuration: (section: string, duration: string) => void;
  durationOptions: string[];
}

export default function TimelineStep({
  projectType,
  sectionDurations,
  expandedSections,
  onToggleSection,
  onUpdateSectionDuration,
  durationOptions,
}: TimelineStepProps) {
  const sections: Section[] = getCurrentSections(projectType);

  return (
    <div className="flex-1 space-y-6">
      <div className="space-y-6">
        <div className="text-center">
          <h3
            className="text-xl font-semibold mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            Project Timeline
          </h3>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Set duration for each section of your {projectType}
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4
              className="text-lg font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Sections
            </h4>
            <div className="text-sm text-tertiary">
              {getCurrentSections(projectType).length} sections
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-[var(--border)] scrollbar-track-surface">
            {sections.map((section, index) => {
              const isExpanded = expandedSections.has(section.title);
              return (
                <div
                  key={section.title}
                  className="bg-surface border border-default rounded-lg overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-3 cursor-pointer hover:bg-surface-muted transition-colors"
                    onClick={() => onToggleSection(section.title)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-surface-muted rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-tertiary">
                          {index + 1}
                        </span>
                      </div>
                      <span
                        className="font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {section.title}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-tertiary" />
                      <select
                        value={sectionDurations[section.title] || "1 week"}
                        onChange={(e) =>
                          onUpdateSectionDuration(section.title, e.target.value)
                        }
                        className="px-2 py-1 border border-default rounded text-sm bg-surface text-primary focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {durationOptions.map((duration) => (
                          <option key={duration} value={duration}>
                            {duration}
                          </option>
                        ))}
                      </select>
                      <div className="text-tertiary">
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </div>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-default p-4 bg-surface-muted">
                      <p className="text-sm text-secondary mb-3">
                        {section.description}
                      </p>

                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-primary mb-2 flex items-center space-x-1">
                            <BookOpen className="w-4 h-4 text-accent" />
                            <span>What to include</span>
                          </h5>
                          <ul className="space-y-1">
                            {section.whatToInclude.map((item, itemIndex) => (
                              <li
                                key={itemIndex}
                                className="flex items-start space-x-2"
                              >
                                <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
                                <span className="text-sm text-secondary">
                                  {item}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-surface-muted border border-default rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span
              className="font-semibold"
              style={{ color: "var(--text-primary)" }}
            >
              Total Timeline Duration
            </span>
            <span className="text-xl font-bold text-accent">
              {formatTotalDuration(
                calculateTotalDuration(projectType, sectionDurations)
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
