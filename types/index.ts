export type DocumentType = "Research Proposal" | "Dissertation";
export type AcademicLevel = "Master's" | "PhD" | "Scholarly";
export type Discipline =
  | "Science"
  | "Humanities"
  | "Social Sciences"
  | "Engineering"
  | "Business";

export interface TimelineSection {
  id: string;
  title: string;
  description: string;
  whatToInclude: string[];
  proTips: string[];
  duration: number; // in weeks
  status: "not-started" | "in-progress" | "completed";
  isCompleted: boolean; // Track completion status
  startDate?: Date;
  endDate?: Date;
  content?: string; // Add content field for storing written text
}

export interface Timeline {
  id: string;
  documentType: DocumentType;
  researchTopic?: string;
  startDate: Date;
  completionDate: Date;
  academicLevel: AcademicLevel;
  discipline: Discipline;
  sections: TimelineSection[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TimelineCreationState {
  step: 1 | 2 | 3;
  documentType: DocumentType | null;
  researchTopic?: string; // Add research topic field
  startDate: Date | null;
  completionDate: Date | null;
  academicLevel: AcademicLevel | null;
  discipline: Discipline | null;
  sections: TimelineSection[];
  isCreating: boolean;
}