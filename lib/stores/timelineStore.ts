import { atom } from "jotai";
import { 
  DISSERTATION_SECTIONS, 
  RESEARCH_TIMELINE_SECTIONS 
} from "../constants/timeline-sections";
import { Timeline, TimelineCreationState, TimelineSection, DocumentType, AcademicLevel, Discipline } from "@/types";

// Types for timeline creation


// Dynamic section generation based on document type
const generateSections = (documentType: DocumentType): TimelineSection[] => {
  if (documentType === "Research Proposal") {
    return RESEARCH_TIMELINE_SECTIONS.map(section => ({
      ...section,
      id: `section-${Date.now()}-${section.order}`,
      duration: 2, // Default duration of 2 weeks
      status: "not-started" as const,
      content: "",
    }));
  } else {
    // Dissertation sections
    return DISSERTATION_SECTIONS.map(section => ({
      ...section,
      id: `section-${Date.now()}-${section.order}`,
      duration: 2, // Default duration of 2 weeks
      status: "not-started" as const,
      content: "",
    }));
  }
};

const initialState: TimelineCreationState = {
  step: 1,
  documentType: null,
  startDate: null,
  completionDate: null,
  academicLevel: null,
  discipline: null,
  sections: [],
  isCreating: false,
};

export const timelineCreationStateAtom = atom(initialState);
const TIMELINES_KEY = "dissert-timelines";

const saveTimelinesToStorage = (timelines: Timeline[]) => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem(TIMELINES_KEY, JSON.stringify(timelines));
    } catch (error) {
      console.error("Error saving timelines:", error);
    }
  }
};

const loadTimelinesFromStorage = (): Timeline[] => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(TIMELINES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((timeline: any) => ({
          ...timeline,
          startDate: new Date(timeline.startDate),
          completionDate: new Date(timeline.completionDate),
          createdAt: new Date(timeline.createdAt),
          updatedAt: new Date(timeline.updatedAt),
        }));
      }
    } catch (error) {
      console.error("Error loading timelines:", error);
    }
  }
  return [];
};

export const evaluationSyncAtom = atom(
  (get) => get(timelineCreationStateAtom).researchTopic,
  (get, set, researchTopic: string) => {
    const currentState = get(timelineCreationStateAtom);

    const suggestedDocumentType: DocumentType = "Research Proposal";
    const suggestedAcademicLevel: AcademicLevel = "PhD";
    const suggestedDiscipline: Discipline = "Science";

    const generatedSections = generateSections(suggestedDocumentType);

    set(timelineCreationStateAtom, {
      ...currentState,
      researchTopic,
      documentType: suggestedDocumentType,
      academicLevel: suggestedAcademicLevel,
      discipline: suggestedDiscipline,
      sections: generatedSections, // Add the generated sections
      step: 1, // Start from step 1
    });
  }
);

// Computed atom to get current evaluation context
export const currentEvaluationContextAtom = atom((get) => {
  const state = get(timelineCreationStateAtom);
  return {
    researchTopic: state.researchTopic,
    hasResearchTopic: !!state.researchTopic,
    documentType: state.documentType,
    academicLevel: state.academicLevel,
    discipline: state.discipline,
  };
});

// Function to clear evaluation context
export const clearEvaluationContextAtom = atom(null, (get, set) => {
  set(timelineCreationStateAtom, initialState);
});

// Function to clear all timelines (useful for removing sample data)
export const clearAllTimelinesAtom = atom(null, (get, set) => {
  set(timelinesAtom, []);
  localStorage.removeItem(TIMELINES_KEY);
});

// Atom to store timelines from API
export const timelinesAtom = atom<Timeline[]>([]);

// Loading and error states for API calls
export const timelinesLoadingAtom = atom<boolean>(false);
export const timelinesErrorAtom = atom<string | null>(null);

// API-based timeline fetching with loading states
export const fetchTimelinesAtom = atom(
  null,
  async (get, set) => {
    try {
      set(timelinesLoadingAtom, true);
      set(timelinesErrorAtom, null);
      
      const response = await fetch('/api/timelines');
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          set(timelinesAtom, data.timelines);
        } else {
          set(timelinesErrorAtom, data.error || 'Failed to fetch timelines');
        }
      } else {
        set(timelinesErrorAtom, 'Failed to fetch timelines');
      }
    } catch (error) {
      console.error('Error fetching timelines:', error);
      set(timelinesErrorAtom, 'Network error occurred');
    } finally {
      set(timelinesLoadingAtom, false);
    }
  }
);

// Function to save timelines to localStorage
export const saveTimelinesAtom = atom(null, (get, set) => {
  const timelines = get(timelinesAtom);
  saveTimelinesToStorage(timelines);
});

// Computed atoms
export const canProceedToStep2Atom = atom((get) => {
  const state = get(timelineCreationStateAtom);
  return !!state.documentType;
});

export const canProceedToStep3Atom = atom((get) => {
  const state = get(timelineCreationStateAtom);
  return !!(
    state.documentType &&
    state.startDate &&
    state.completionDate &&
    state.academicLevel &&
    state.discipline
  );
});

export const canCreateTimelineAtom = atom((get) => {
  const state = get(timelineCreationStateAtom);
  
  return !!(
    state.documentType &&
    state.startDate &&
    state.completionDate &&
    state.academicLevel &&
    state.discipline &&
    state.sections.length > 0 &&
    state.sections.every(section => section.duration > 0)
  );
});

export const totalDurationAtom = atom((get) => {
  const state = get(timelineCreationStateAtom);
  return state.sections.reduce((total, section) => total + section.duration, 0);
});

export const currentStepAtom = atom(
  (get) => get(timelineCreationStateAtom).step
);
export const selectedDocumentTypeAtom = atom(
  (get) => get(timelineCreationStateAtom).documentType
);
export const timelineSectionsAtom = atom(
  (get) => get(timelineCreationStateAtom).sections
);
export const timelineConfigAtom = atom((get) => {
  const state = get(timelineCreationStateAtom);
  return {
    startDate: state.startDate,
    completionDate: state.startDate,
    academicLevel: state.academicLevel,
    discipline: state.discipline,
  };
});

export const isStepValidAtom = atom((get) => {
  const state = get(timelineCreationStateAtom);
  switch (state.step) {
    case 1:
      return !!state.documentType;
    case 2:
      return !!(
        state.documentType &&
        state.startDate &&
        state.completionDate &&
        state.academicLevel &&
        state.discipline
      );
    case 3:
      return state.sections.every((section) => section.duration > 0);
    default:
      return false;
  }
});

export const stepProgressAtom = atom((get) => {
  const state = get(timelineCreationStateAtom);
  let completedSteps = 0;

  if (state.documentType) completedSteps++;
  if (
    state.startDate &&
    state.completionDate &&
    state.academicLevel &&
    state.discipline
  )
    completedSteps++;
  if (state.sections.every((section) => section.duration > 0)) completedSteps++;

  return (completedSteps / 3) * 100;
});

// Action atoms
export const setDocumentTypeAtom = atom(
  null,
  (get, set, documentType: DocumentType) => {
    const state = get(timelineCreationStateAtom);
    const sections = generateSections(documentType);

    set(timelineCreationStateAtom, {
      ...state,
      documentType,
      sections: sections.map((section) => ({ ...section, duration: 1 })), // Reset durations
    });
  }
);

export const updateTimelineConfigAtom = atom(
  null,
  (
    get,
    set,
    updates: Partial<
      Pick<
        TimelineCreationState,
        "startDate" | "completionDate" | "academicLevel" | "discipline"
      >
    >
  ) => {
    const state = get(timelineCreationStateAtom);
    set(timelineCreationStateAtom, { ...state, ...updates });
  }
);

export const updateSectionDurationAtom = atom(
  null,
  (get, set, sectionId: string, duration: number) => {
    const state = get(timelineCreationStateAtom);
    const updatedSections = state.sections.map((section) =>
      section.id === sectionId ? { ...section, duration } : section
    );

    set(timelineCreationStateAtom, { ...state, sections: updatedSections });
  }
);

// New action atoms for better section management
export const addCustomSectionAtom = atom(
  null,
  (get, set, section: Omit<TimelineSection, "id" | "status">) => {
    const state = get(timelineCreationStateAtom);
    const newSection: TimelineSection = {
      ...section,
      id: `custom-${Date.now()}`,
      status: "not-started",
    };

    set(timelineCreationStateAtom, {
      ...state,
      sections: [...state.sections, newSection],
    });
  }
);

export const removeSectionAtom = atom(null, (get, set, sectionId: string) => {
  const state = get(timelineCreationStateAtom);
  const updatedSections = state.sections.filter(
    (section) => section.id !== sectionId
  );

  set(timelineCreationStateAtom, {
    ...state,
    sections: updatedSections,
  });
});

export const reorderSectionsAtom = atom(
  null,
  (get, set, sectionIds: string[]) => {
    const state = get(timelineCreationStateAtom);
    const sectionMap = new Map(
      state.sections.map((section) => [section.id, section])
    );
    const reorderedSections = sectionIds.map((id) => sectionMap.get(id)!);

    set(timelineCreationStateAtom, {
      ...state,
      sections: reorderedSections,
    });
  }
);

export const duplicateSectionAtom = atom(
  null,
  (get, set, sectionId: string) => {
    const state = get(timelineCreationStateAtom);
    const sectionToDuplicate = state.sections.find(
      (section) => section.id === sectionId
    );

    if (sectionToDuplicate) {
      const duplicatedSection: TimelineSection = {
        ...sectionToDuplicate,
        id: `${sectionToDuplicate.id}-copy-${Date.now()}`,
        title: `${sectionToDuplicate.title} (Copy)`,
        status: "not-started",
      };

      set(timelineCreationStateAtom, {
        ...state,
        sections: [...state.sections, duplicatedSection],
      });
    }
  }
);

export const nextStepAtom = atom(null, (get, set) => {
  const state = get(timelineCreationStateAtom);
  if (state.step < 3) {
    set(timelineCreationStateAtom, {
      ...state,
      step: (state.step + 1) as 1 | 2 | 3,
    });
  }
});

export const prevStepAtom = atom(null, (get, set) => {
  const state = get(timelineCreationStateAtom);
  if (state.step > 1) {
    set(timelineCreationStateAtom, {
      ...state,
      step: (state.step - 1) as 1 | 2 | 3,
    });
  }
});

export const goToStepAtom = atom(null, (get, set, step: 1 | 2 | 3) => {
  const state = get(timelineCreationStateAtom);
  set(timelineCreationStateAtom, { ...state, step });
});





export const updateSectionStatusAtom = atom(
  null,
  (
    get,
    set,
    timelineId: string,
    sectionId: string,
    status: TimelineSection["status"]
  ) => {
    const timelines = get(timelinesAtom);
    const updatedTimelines = timelines.map((timeline) =>
      timeline.id === timelineId
        ? {
            ...timeline,
            sections: timeline.sections.map((section) =>
              section.id === sectionId ? { ...section, status } : section
            ),
            updatedAt: new Date(),
          }
        : timeline
    );

    set(timelinesAtom, updatedTimelines);

    // Save to localStorage
    saveTimelinesToStorage(updatedTimelines);
  }
);

export const updateSectionContentAtom = atom(
  null,
  (get, set, timelineId: string, sectionId: string, content: string) => {
    const timelines = get(timelinesAtom);
    const updatedTimelines = timelines.map((timeline) =>
      timeline.id === timelineId
        ? {
            ...timeline,
            sections: timeline.sections.map((section) =>
              section.id === sectionId ? { ...section, content } : section
            ),
            updatedAt: new Date(),
          }
        : timeline
    );

    set(timelinesAtom, updatedTimelines);

    // Save to localStorage
    saveTimelinesToStorage(updatedTimelines);
  }
);

export const updateSectionCompletionAtom = atom(
  null,
  (get, set, timelineId: string, sectionId: string, isCompleted: boolean) => {
    const timelines = get(timelinesAtom);
    const updatedTimelines = timelines.map((timeline) =>
      timeline.id === timelineId
        ? {
            ...timeline,
            sections: timeline.sections.map((section) =>
              section.id === sectionId ? { ...section, isCompleted } : section
            ),
            updatedAt: new Date(),
          }
        : timeline
    );

    set(timelinesAtom, updatedTimelines);

    // Save to localStorage
    saveTimelinesToStorage(updatedTimelines);
  }
);

export const resetTimelineCreationAtom = atom(null, (get, set) => {
  set(timelineCreationStateAtom, initialState);
});

// Function to delete a timeline from API
export const deleteTimelineAtom = atom(null, async (get, set, timelineId: string) => {
  try {
    console.log('🗑️ Deleting timeline:', timelineId);
    
    const response = await fetch(`/api/timelines?id=${timelineId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to delete timeline');
    }

    // If API call successful, update local state
    const timelines = get(timelinesAtom);
    const updatedTimelines = timelines.filter(
      (timeline) => timeline.id !== timelineId
    );
    set(timelinesAtom, updatedTimelines);

    console.log(
      `🗑️ Timeline ${timelineId} deleted successfully. Remaining timelines:`,
      updatedTimelines.length
    );
  } catch (error) {
    console.error('Error deleting timeline:', error);
    throw error; // Re-throw to let UI handle the error
  }
});
