export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'mentor';
  avatar?: string;
  bio?: string;
  expertise?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Mentor extends User {
  role: 'mentor';
  expertise: string[];
  hourlyRate: number;
  availability: {
    days: string[];
    hours: {
      start: string;
      end: string;
    };
  };
  isAvailable: boolean;
}

export interface MentorBooking {
  id: string;
  userId: string;
  mentorId: string;
  documentId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  requestedAccess: 'edit' | 'write' | 'comment';
  message?: string;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
  completedAt?: Date;
}

export interface DocumentAccess {
  id: string;
  documentId: string;
  userId: string;
  mentorId: string;
  accessType: 'edit' | 'write' | 'comment';
  grantedAt: Date;
  expiresAt?: Date;
  isActive: boolean;
}

export interface MentorComment {
  id: string;
  documentId: string;
  mentorId: string;
  content: string;
  sectionId?: string;
  position: {
    start: number;
    end: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MentorProfile {
  id: string;
  mentorId: string;
  bio: string;
  expertise: string[];
  experience: number; // years
  education: string[];
  certifications: string[];
  languages: string[];
  hourlyRate: number;
  availability: {
    days: string[];
    hours: {
      start: string;
      end: string;
    };
  };
  isAvailable: boolean;
  createdAt: Date;
  updatedAt: Date;
}
