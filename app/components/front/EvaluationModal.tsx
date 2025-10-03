"use client";
import { useState } from "react";
import { ArrowRight, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { Modal } from "../ui/front/modal";
import {
  academicLevels,
  disciplines,
  durationOptions,
  goals,
  getCurrentSections,
  parseDurationToWeeks,
} from "@/lib/constants/timeline-sections";
import TimelineStep from "./evaluation/TimelineStep";
import TimelineSetupStep from "./evaluation/TimelineSetupStep";
import GoalsStep from "./evaluation/GoalsStep";
import { evaluationData } from "@/lib/constants";
import ScoreStep from "./evaluation/ScoreStep";

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  researchTopic: string;
  evaluationData?: any;
}

export default function EvaluationModal({
  isOpen,
  onClose,
  researchTopic,
  evaluationData: realEvaluationData,
}: EvaluationModalProps) {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<
    "score" | "goals" | "timeline-setup" | "timeline"
  >("score");

  const [researchStartDate, setResearchStartDate] = useState("");
  const [researchCompletionDate, setResearchCompletionDate] = useState("");
  const [academicLevel, setAcademicLevel] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [sectionDurations, setSectionDurations] = useState<
    Record<string, string>
  >({});
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [isCreatingTimeline, setIsCreatingTimeline] = useState(false);

  const getProjectType = (): "dissertation" | "research-proposal" => {
    if (selectedGoal === "dissertation") {
      return "dissertation";
    }
    return "research-proposal";
  };

  const selectGoal = (goalId: string) => {
    setSelectedGoal(goalId);
  };

  const toggleSection = (sectionTitle: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionTitle)) {
      newExpanded.delete(sectionTitle);
    } else {
      newExpanded.add(sectionTitle);
    }
    setExpandedSections(newExpanded);
  };

  const updateSectionDuration = (section: string, duration: string) => {
    setSectionDurations((prev) => ({
      ...prev,
      [section]: duration,
    }));
  };

  const handleContinue = async () => {
    if (isCreatingTimeline) return;

    setIsCreatingTimeline(true);

    try {
      const projectType = getProjectType();
      const sections = getCurrentSections(projectType);

      // Convert section durations to the format expected by the API
      const timelineSections = sections.map((section, index) => ({
        title: section.title,
        duration: parseDurationToWeeks(
          sectionDurations[section.title] || "1 week"
        ),
        order: index + 1,
      }));

      const timelineData = {
        documentType:
          projectType === "dissertation" ? "DISSERTATION" : "RESEARCH_TIMELINE",
        title: `${researchTopic} - ${
          projectType === "dissertation" ? "Dissertation" : "Research Proposal"
        }`,
        researchTopic: researchTopic,
        startDate: researchStartDate,
        completionDate: researchCompletionDate,
        academicLevel: academicLevel,
        discipline: discipline,
        sections: timelineSections,
      };

      console.log("Creating timeline with data:", timelineData);

      const response = await fetch("/api/timelines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(timelineData),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Timeline created successfully!");
        console.log("Timeline created:", result.timeline);
        onClose();
        // Redirect to the timeline page
        window.location.href = `/user/timelines/${result.timeline.id}`;
      } else {
        console.error("Timeline creation failed:", result);
        toast.error(result.error || "Failed to create timeline");
      }
    } catch (error) {
      console.error("Error creating timeline:", error);
      toast.error("An error occurred while creating the timeline");
    } finally {
      setIsCreatingTimeline(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        currentStep === "score"
          ? "Evaluation Results"
          : currentStep === "goals"
          ? "What are your research goals?"
          : currentStep === "timeline-setup"
          ? "Research Timeline Setup"
          : "Project Timeline"
      }
      description={
        currentStep === "score"
          ? `Analysis complete for "${researchTopic}". Review your scores across 6 key metrics.`
          : currentStep === "goals"
          ? `For "${researchTopic}", what would you like to achieve? Select all that apply and we'll tailor our analysis to your specific needs.`
          : currentStep === "timeline-setup"
          ? `Configure your research parameters for "${researchTopic}". Set your academic level, discipline, and project type.`
          : `Plan your research timeline for "${researchTopic}". Set milestones and deadlines to keep your project on track.`
      }
      closeOnBackdropClick={false}
    >
      <div className="flex min-h-[600px]">
        <div className="w-1/5 bg-gray-50 p-3 flex flex-col justify-between">
          <div>
            <h3
              className="text-sm font-semibold mb-3"
              style={{ color: "var(--text-primary)" }}
            >
              Steps
            </h3>
            <nav className="space-y-1">
              <button
                className={`w-full flex items-center space-x-2 p-2 rounded-md text-left transition-colors ${
                  currentStep === "score"
                    ? "bg-purple-100 text-purple-800 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === "score"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  1
                </div>
                <span className="text-sm">Scores</span>
              </button>
              <button
                // onClick={() => setCurrentStep("goals")}
                className={`w-full flex items-center space-x-2 p-2 rounded-md text-left transition-colors ${
                  currentStep === "goals"
                    ? "bg-purple-100 text-purple-800 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === "goals"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span className="text-sm">Goals</span>
              </button>
              <button
                className={`w-full flex items-center space-x-2 p-2 rounded-md text-left transition-colors ${
                  currentStep === "timeline-setup"
                    ? "bg-purple-100 text-purple-800 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === "timeline-setup"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  3
                </div>
                <span className="text-sm">Setup</span>
              </button>
              <button
                className={`w-full flex items-center space-x-2 p-2 rounded-md text-left transition-colors ${
                  currentStep === "timeline"
                    ? "bg-purple-100 text-purple-800 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === "timeline"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  4
                </div>
                <span className="text-sm">Timeline</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-4/5 p-6 flex flex-col">
          {currentStep === "score" ? (
            <ScoreStep
              evaluationData={
                realEvaluationData
                  ? {
                      overall: Math.round(
                        (realEvaluationData.novelty.score +
                          realEvaluationData.trends.score +
                          realEvaluationData.methodological_complexity.score +
                          realEvaluationData.research_gaps.score +
                          realEvaluationData.grant_potential.score +
                          realEvaluationData.literature_availability.score) /
                          6
                      ),
                      metrics: [
                        {
                          name: "Novelty",
                          score: realEvaluationData.novelty.score,
                          description: realEvaluationData.novelty.justification,
                        },
                        {
                          name: "Trends",
                          score: realEvaluationData.trends.score,
                          description: realEvaluationData.trends.justification,
                        },
                        {
                          name: "Methodology",
                          score:
                            realEvaluationData.methodological_complexity.score,
                          description:
                            realEvaluationData.methodological_complexity
                              .justification,
                        },
                        {
                          name: "Research Gaps",
                          score: realEvaluationData.research_gaps.score,
                          description:
                            realEvaluationData.research_gaps.justification,
                        },
                        {
                          name: "Grant Potential",
                          score: realEvaluationData.grant_potential.score,
                          description:
                            realEvaluationData.grant_potential.justification,
                        },
                        {
                          name: "Literature",
                          score:
                            realEvaluationData.literature_availability.score,
                          description:
                            realEvaluationData.literature_availability
                              .justification,
                        },
                      ],
                    }
                  : {
                      overall: evaluationData.overallScore,
                      metrics: evaluationData.metrics.map((metric) => ({
                        name: metric.name,
                        score: metric.score,
                        description: metric.description,
                      })),
                    }
              }
            />
          ) : currentStep === "goals" ? (
            <GoalsStep
              goals={goals}
              selectedGoal={selectedGoal}
              onSelectGoal={selectGoal}
            />
          ) : currentStep === "timeline-setup" ? (
            <TimelineSetupStep
              researchTopic={researchTopic}
              projectType={getProjectType()}
              researchStartDate={researchStartDate}
              setResearchStartDate={setResearchStartDate}
              researchCompletionDate={researchCompletionDate}
              setResearchCompletionDate={setResearchCompletionDate}
              academicLevel={academicLevel}
              setAcademicLevel={setAcademicLevel}
              discipline={discipline}
              setDiscipline={setDiscipline}
              academicLevels={academicLevels}
              disciplines={disciplines}
            />
          ) : (
            <TimelineStep
              projectType={getProjectType()}
              sectionDurations={sectionDurations}
              expandedSections={expandedSections}
              onToggleSection={toggleSection}
              onUpdateSectionDuration={updateSectionDuration}
              durationOptions={durationOptions}
            />
          )}
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-gray-200">
        {currentStep === "score" ? (
          <>
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => setCurrentStep("goals")}
              className="px-6 py-2 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 hover:opacity-90"
              style={{
                backgroundColor: "var(--primary-button)",
              }}
            >
              <span>Set Goals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : currentStep === "goals" ? (
          <>
            <button
              onClick={() => setCurrentStep("score")}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Back to Scores
            </button>
            <button
              onClick={() => setCurrentStep("timeline-setup")}
              disabled={!selectedGoal}
              className="px-6 py-2 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center space-x-2 hover:opacity-90"
              style={{
                backgroundColor: "var(--primary-button)",
              }}
            >
              <span>Next: Setup</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : currentStep === "timeline-setup" ? (
          <>
            <button
              onClick={() => setCurrentStep("goals")}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Back to Goals
            </button>
            <button
              onClick={() => setCurrentStep("timeline")}
              disabled={
                !researchStartDate ||
                !researchCompletionDate ||
                !academicLevel ||
                !discipline
              }
              className="px-6 py-2 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-colors flex items-center space-x-2 hover:opacity-90"
              style={{
                backgroundColor: "var(--primary-button)",
              }}
            >
              <span>Next: Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setCurrentStep("timeline-setup")}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Back to Setup
            </button>
            <button
              onClick={handleContinue}
              disabled={isCreatingTimeline}
              className="px-6 py-2 text-white rounded-lg font-medium transition-colors flex items-center space-x-2 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--primary-button)",
              }}
            >
              {isCreatingTimeline ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Timeline...</span>
                </>
              ) : (
                <>
                  <span>Complete Analysis</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </>
        )}
      </div>
    </Modal>
  );
}
