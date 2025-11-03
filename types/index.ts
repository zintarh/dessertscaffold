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
  // Mentor access properties
  isMentorAccess?: boolean;
  mentorAccessType?: string | null;
  mentorAccessGrantedAt?: string | null;
  user?: {
    id: string;
    name: string;
    email: string;
  };
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



export interface MentorData {
  id: string;
  name: string;
  email: string;
  userType: string;
  institutionName?: string;
  researchArea?: string;
  academicLevel?: string;
  image?: string;
  expertise: string[];
  hourlyRate: number;
  rating: number;
  reviewCount: number;
  bio: string;
  availability: string;
  responseTime: string;
  completedProjects: number;
  specializations: string[];
  languages: string[];
  timezone: string;
  education: string[];
  publications: string[];
  socialLinks: Record<string, string>;
  isVerified: boolean;
  hasCompleteProfile: boolean;
}