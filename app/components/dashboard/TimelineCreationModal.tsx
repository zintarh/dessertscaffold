"use client";

import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  BookOpen,
  Settings,
  CheckCircle,
  Clock,
  Info,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  timelineCreationStateAtom,
  canProceedToStep2Atom,
  canProceedToStep3Atom,
  canCreateTimelineAtom,
  totalDurationAtom,
  setDocumentTypeAtom,
  updateTimelineConfigAtom,
  updateSectionDurationAtom,
  nextStepAtom,
  prevStepAtom,
  resetTimelineCreationAtom,
} from "../../../lib/stores/timelineStore";
import { DocumentType, AcademicLevel, Discipline, TimelineSection } from "@/types";
import Modal, { ModalFooter, ModalSection } from "./Modal";
import React, { useState, useEffect } from 'react';
import GradientButton from '../../components/ui/GradientButton';
import toast from "react-hot-toast";

interface TimelineCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  researchTopic?: string;
  onTimelineCreated?: (timelineId: string) => void;
  refreshTimelines?: () => void;
}

// Step 1: Document Type Selection Component
function DocumentTypeSelection({
  documentType,
  onDocumentTypeSelect,
}: {
  documentType: DocumentType | null;
  onDocumentTypeSelect: (type: DocumentType) => void;
}) {
  return (
    <ModalSection
      title="Select Document Type"
      description="Choose the type of research document you want to create a timeline for"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => onDocumentTypeSelect("Research Proposal")}
          className={`p-6 border-2 rounded-lg text-left transition-all duration-200 ${
            documentType === "Research Proposal"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                documentType === "Research Proposal"
                  ? "bg-blue-500"
                  : "bg-gray-200"
              }`}
            >
              <BookOpen
                className={`w-5 h-5 ${
                  documentType === "Research Proposal"
                    ? "text-white"
                    : "text-gray-600"
                }`}
              />
            </div>
            <h4 className="font-semibold text-gray-900">Research Proposal</h4>
          </div>
          <p className="text-sm text-gray-600">
            A structured document outlining your research plan, methodology, and
            expected outcomes.
          </p>
        </button>

        <button
          onClick={() => onDocumentTypeSelect("Dissertation")}
          className={`p-6 border-2 rounded-lg text-left transition-all duration-200 ${
            documentType === "Dissertation"
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center space-x-3 mb-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                documentType === "Dissertation" ? "bg-blue-500" : "bg-gray-200"
              }`}
            >
              <BookOpen
                className={`w-5 h-5 ${
                  documentType === "Dissertation"
                    ? "text-white"
                    : "text-gray-600"
                }`}
              />
            </div>
            <h4 className="font-semibold text-gray-900">Dissertation</h4>
          </div>
          <p className="text-sm text-gray-600">
            A comprehensive research document presenting your original research
            findings and analysis.
          </p>
        </button>
      </div>
    </ModalSection>
  );
}

// Step 2: Timeline Configuration Component
function TimelineConfiguration({
  startDate,
  completionDate,
  academicLevel,
  discipline,
  onConfigUpdate,
}: {
  startDate: Date | null;
  completionDate: Date | null;
  academicLevel: AcademicLevel | null;
  discipline: Discipline | null;
  onConfigUpdate: (
    updates: Partial<{
      startDate: Date | null;
      completionDate: Date | null;
      academicLevel: AcademicLevel | null;
      discipline: Discipline | null;
    }>
  ) => void;
}) {
  // Helper function to format date for input
  const formatDateForInput = (date: Date | null): string => {
    if (!date) return "";
    if (date instanceof Date && !isNaN(date.getTime())) {
      return date.toISOString().split("T")[0];
    }
    return "";
  };

  return (
    <ModalSection
      title="Configure Timeline"
      description="Set your project timeline and academic details"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={formatDateForInput(startDate)}
              onChange={(e) => {
                const newDate = e.target.value
                  ? new Date(e.target.value)
                  : null;
                onConfigUpdate({ startDate: newDate });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              placeholder="Select start date"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Completion Date
            </label>
            <input
              type="date"
              value={formatDateForInput(completionDate)}
              onChange={(e) => {
                const newDate = e.target.value
                  ? new Date(e.target.value)
                  : null;
                onConfigUpdate({ completionDate: newDate });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              placeholder="Select completion date"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Level
            </label>
            <select
              value={academicLevel || ""}
              onChange={(e) =>
                onConfigUpdate({
                  academicLevel: e.target.value as AcademicLevel,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select level</option>
              <option value="Master's">Master's</option>
              <option value="PhD">PhD</option>
              <option value="Scholarly">Scholarly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Discipline
            </label>
            <select
              value={discipline || ""}
              onChange={(e) =>
                onConfigUpdate({ discipline: e.target.value as Discipline })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
            >
              <option value="">Select discipline</option>
              <option value="Science">Science</option>
              <option value="Humanities">Humanities</option>
              <option value="Social Sciences">Social Sciences</option>
              <option value="Engineering">Engineering</option>
              <option value="Business">Business</option>
            </select>
          </div>
        </div>
      </div>
    </ModalSection>
  );
}

// Step 3: Research Structure Component
function ResearchStructure({
  documentType,
  sections,
  onSectionDurationUpdate,
  totalDuration,
}: {
  documentType: DocumentType | null;
  sections: TimelineSection[];
  onSectionDurationUpdate: (sectionId: string, duration: number) => void;
  totalDuration: number;
}) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  return (
    <ModalSection
      title="Research Structure"
      description={`Configure the duration for each section of your ${documentType?.toLowerCase()}`}
    >
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-900">Sections</h4>

        {/* Existing Sections */}
        {sections.map((section) => (
          <div
            key={section.id}
            className="border border-gray-200 rounded-lg bg-white overflow-hidden"
          >
            {/* Section Header - Clickable to expand/collapse */}
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center space-x-3">
                <h4 className="font-medium text-gray-900">{section.title}</h4>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <select
                  value={section.duration}
                  onChange={(e) =>
                    onSectionDurationUpdate(
                      section.id,
                      parseInt(e.target.value)
                    )
                  }
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 min-w-[100px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  {[1, 2, 3, 4, 5, 6, 8, 10, 12].map((weeks) => (
                    <option key={weeks} value={weeks}>
                      {weeks} {weeks === 1 ? "week" : "weeks"}
                    </option>
                  ))}
                </select>

                {/* Expand/Collapse Indicator */}
                <div className="text-gray-400">
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </div>
            </div>

            {/* Expandable Section Content */}
            {expandedSections.has(section.id) && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <p className="text-sm text-gray-600 mb-3">
                  {section.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
                      <Info className="w-4 h-4 text-blue-500" />
                      <span>What to include</span>
                    </h5>
                    <ul className="space-y-1">
                      {section.whatToInclude.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-600">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-700 mb-2 flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span>Pro tips</span>
                    </h5>
                    <ul className="space-y-1">
                      {section.proTips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-600">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-blue-900">
              Total Timeline Duration
            </span>
            <span className="text-lg font-semibold text-blue-900">
              {totalDuration} weeks
            </span>
          </div>
        </div>
      </div>
    </ModalSection>
  );
}

// Step Indicator Component
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {[1, 2, 3].map((stepNumber) => (
        <div key={stepNumber} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              stepNumber <= currentStep
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {stepNumber}
          </div>
          {stepNumber < 3 && (
            <div
              className={`w-8 h-1 mx-2 ${
                stepNumber < currentStep ? "bg-blue-500" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// Step Actions Component
function StepActions({
  currentStep,
  canProceedToStep2,
  canProceedToStep3,
  canCreateTimeline,
  onPrevious,
  onNext,
  onCreateTimeline,
}: {
  currentStep: number;
  canProceedToStep2: boolean;
  canProceedToStep3: boolean;
  canCreateTimeline: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onCreateTimeline: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <button
        onClick={onPrevious}
        disabled={currentStep === 1}
        className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
          currentStep === 1
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        }`}
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Previous</span>
      </button>

      <div className="flex items-center space-x-3">
        {currentStep === 3 ? (
          <GradientButton
            onClick={onCreateTimeline}
            disabled={!canCreateTimeline}
            variant="primary"
            size="lg"
          >
            Create Timeline
          </GradientButton>
        ) : (
          <button
            onClick={onNext}
            disabled={
              (currentStep === 1 && !canProceedToStep2) ||
              (currentStep === 2 && !canProceedToStep3)
            }
            className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-colors ${
              (currentStep === 1 && !canProceedToStep2) ||
              (currentStep === 2 && !canProceedToStep3)
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg"
            }`}
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function TimelineCreationModal({
  isOpen,
  onClose,
  researchTopic,
  onTimelineCreated,
  refreshTimelines,
}: TimelineCreationModalProps) {
  const [state, setState] = useAtom(timelineCreationStateAtom);
  const canProceedToStep2 = useAtomValue(canProceedToStep2Atom);
  const canProceedToStep3 = useAtomValue(canProceedToStep3Atom);
  const canCreateTimeline = useAtomValue(canCreateTimelineAtom);
  const totalDuration = useAtomValue(totalDurationAtom);

  const setDocumentType = useSetAtom(setDocumentTypeAtom);
  const updateTimelineConfig = useSetAtom(updateTimelineConfigAtom);
  const updateSectionDuration = useSetAtom(updateSectionDurationAtom);

  const nextStep = useSetAtom(nextStepAtom);
  const prevStep = useSetAtom(prevStepAtom);
  const resetTimelineCreation = useSetAtom(resetTimelineCreationAtom);

  // Debug logging
  console.log("TimelineCreationModal state:", {
    step: state.step,
    documentType: state.documentType,
    startDate: state.startDate,
    completionDate: state.completionDate,
    academicLevel: state.academicLevel,
    discipline: state.discipline,
    sections: state.sections.length,
  });

  const handleClose = () => {
    try {
      resetTimelineCreation();
      onClose();
    } catch (err) {
      console.error("Error closing modal:", err);
      onClose();
    }
  };

  const handleCreateTimeline = async () => {
    try {
      console.log("Creating timeline with research topic:", state.researchTopic);

      // Check if we can create timeline
      if (!canCreateTimeline) {
        toast.error('Please fill in all required fields and set section durations');
        return;
      }

      // Show loading toast
      const loadingToast = toast.loading('Creating timeline...');

      // Prepare timeline data directly from state
      const timelineData = {
        documentType: state.documentType === "Research Proposal" ? "RESEARCH_TIMELINE" : "DISSERTATION",
        researchTopic: state.researchTopic,
        startDate: state.startDate?.toISOString() || new Date().toISOString(),
        completionDate: state.completionDate?.toISOString() || new Date().toISOString(),
        academicLevel: state.academicLevel || "PhD",
        discipline: state.discipline || "Science",
        sections: state.sections.map((section, index) => ({
          title: section.title,
          duration: section.duration,
          order: index + 1,
        })),
      };

      console.log("Sending timeline data to API:", timelineData);

      // Call the backend API directly
      const response = await fetch('/api/timelines', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(timelineData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create timeline');
      }

      const result = await response.json();
      console.log("Timeline created successfully:", result);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success('Timeline created successfully! 🎉');

      // Call the callback if provided
      if (onTimelineCreated && result.timeline?.id) {
        onTimelineCreated(result.timeline.id);
      }

      // Refresh timelines if callback provided
      if (refreshTimelines) {
        refreshTimelines();
      }

      // Close the modal
      onClose();

    } catch (err) {
      console.error("Error creating timeline:", err);
      
      // Show error toast
      toast.error(err instanceof Error ? err.message : 'Failed to create timeline');
    }
  };

  const renderStepContent = () => {
    console.log("Rendering step content for step:", state.step);

    switch (state.step) {
      case 1:
        return (
          <DocumentTypeSelection
            documentType={state.documentType}
            onDocumentTypeSelect={setDocumentType}
          />
        );
      case 2:
        return (
          <TimelineConfiguration
            startDate={state.startDate}
            completionDate={state.completionDate}
            academicLevel={state.academicLevel}
            discipline={state.discipline}
            onConfigUpdate={updateTimelineConfig}
          />
        );
      case 3:
        return (
          <ResearchStructure
            documentType={state.documentType}
            sections={state.sections}
            onSectionDurationUpdate={updateSectionDuration}
            totalDuration={totalDuration}
          />
        );
      default:
        return <div className="text-center text-gray-500">Invalid step</div>;
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title="Create Research Timeline"
      size="2xl"
      showCloseButton={true}
    >
      <div className="min-h-[400px]">
        <StepIndicator currentStep={state.step} />

        {state.researchTopic && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">
                Research Topic:
              </span>
            </div>
            <p className="mt-2 text-blue-900 font-medium">
              {state.researchTopic}
            </p>
          </div>
        )}

        {renderStepContent()}
        <ModalFooter>
          <StepActions
            currentStep={state.step}
            canProceedToStep2={canProceedToStep2}
            canProceedToStep3={canProceedToStep3}
            canCreateTimeline={canCreateTimeline}
            onPrevious={prevStep}
            onNext={nextStep}
            onCreateTimeline={handleCreateTimeline}
          />
        </ModalFooter>
      </div>
    </Modal>
  );
}
