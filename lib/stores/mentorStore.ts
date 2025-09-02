import { atom } from 'jotai';
import { 
  Mentor, 
  MentorBooking, 
  DocumentAccess, 
  MentorComment, 
} from '../types';

// Sample data - replace with backend API calls later
const sampleMentors: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    role: 'mentor',
    avatar: '/images/mentor1.jpg',
    bio: 'Experienced research supervisor with 15+ years in academic writing and methodology.',
    expertise: ['Research Methodology', 'Academic Writing', 'Statistics', 'Literature Review'],
    hourlyRate: 75,
    availability: {
      days: ['Monday', 'Wednesday', 'Friday'],
      hours: { start: '09:00', end: '17:00' }
    },
    isAvailable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'mentor-2',
    name: 'Prof. Michael Chen',
    email: 'michael.chen@research.org',
    role: 'mentor',
    avatar: '/images/mentor2.jpg',
    bio: 'Specialist in quantitative research methods and data analysis.',
    expertise: ['Data Analysis', 'Quantitative Methods', 'SPSS', 'Research Design'],
    hourlyRate: 85,
    availability: {
      days: ['Tuesday', 'Thursday', 'Saturday'],
      hours: { start: '10:00', end: '18:00' }
    },
    isAvailable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: 'mentor-3',
    name: 'Dr. Emily Rodriguez',
    email: 'emily.rodriguez@academic.edu',
    role: 'mentor',
    avatar: '/images/mentor3.jpg',
    bio: 'Expert in qualitative research and social sciences methodology.',
    expertise: ['Qualitative Methods', 'Social Sciences', 'Interviews', 'Content Analysis'],
    hourlyRate: 70,
    availability: {
      days: ['Monday', 'Tuesday', 'Friday'],
      hours: { start: '14:00', end: '20:00' }
    },
    isAvailable: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Atoms
export const mentorsAtom = atom<Mentor[]>(sampleMentors);
export const mentorBookingsAtom = atom<MentorBooking[]>([]);
export const documentAccessAtom = atom<DocumentAccess[]>([]);
export const mentorCommentsAtom = atom<MentorComment[]>([]);

// Computed atoms
export const availableMentorsAtom = atom((get) => 
  get(mentorsAtom).filter(mentor => mentor.isAvailable)
);

export const mentorBookingsByUserAtom = atom((get) => (userId: string) =>
  get(mentorBookingsAtom).filter(booking => booking.userId === userId)
);

export const mentorBookingsByMentorAtom = atom((get) => (mentorId: string) =>
  get(mentorBookingsAtom).filter(booking => booking.mentorId === mentorId)
);

export const documentAccessByDocumentAtom = atom((get) => (documentId: string) =>
  get(documentAccessAtom).filter(access => access.documentId === documentId && access.isActive)
);

export const mentorCommentsByDocumentAtom = atom((get) => (documentId: string) =>
  get(mentorCommentsAtom).filter(comment => comment.documentId === documentId)
);

// Actions
export const createMentorBookingAtom = atom(
  null,
  (get, set, booking: Omit<MentorBooking, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newBooking: MentorBooking = {
      ...booking,
      id: `booking-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const currentBookings = get(mentorBookingsAtom);
    set(mentorBookingsAtom, [...currentBookings, newBooking]);
    
    // TODO: Send email to mentor
    console.log('Sending email to mentor:', newBooking.mentorId);
    
    return newBooking;
  }
);

export const updateMentorBookingStatusAtom = atom(
  null,
  (get, set, bookingId: string, status: MentorBooking['status']) => {
    const currentBookings = get(mentorBookingsAtom);
    const updatedBookings = currentBookings.map(booking => {
      if (booking.id === bookingId) {
        const updated = {
          ...booking,
          status,
          updatedAt: new Date()
        };
        
        if (status === 'accepted') {
          updated.acceptedAt = new Date();
        } else if (status === 'completed') {
          updated.completedAt = new Date();
        }
        
        return updated;
      }
      return booking;
    });
    
    set(mentorBookingsAtom, updatedBookings);
    
    // If accepted, create document access
    if (status === 'accepted') {
      const booking = currentBookings.find(b => b.id === bookingId);
      if (booking) {
        const newAccess: DocumentAccess = {
          id: `access-${Date.now()}`,
          documentId: booking.documentId,
          userId: booking.userId,
          mentorId: booking.mentorId,
          accessType: booking.requestedAccess,
          grantedAt: new Date(),
          isActive: true
        };
        
        const currentAccess = get(documentAccessAtom);
        set(documentAccessAtom, [...currentAccess, newAccess]);
      }
    }
  }
);

export const grantDocumentAccessAtom = atom(
  null,
  (get, set, access: Omit<DocumentAccess, 'id' | 'grantedAt'>) => {
    const newAccess: DocumentAccess = {
      ...access,
      id: `access-${Date.now()}`,
      grantedAt: new Date()
    };
    
    const currentAccess = get(documentAccessAtom);
    set(documentAccessAtom, [...currentAccess, newAccess]);
  }
);

export const revokeDocumentAccessAtom = atom(
  null,
  (get, set, accessId: string) => {
    const currentAccess = get(documentAccessAtom);
    const updatedAccess = currentAccess.map(access => 
      access.id === accessId ? { ...access, isActive: false } : access
    );
    set(documentAccessAtom, updatedAccess);
  }
);

export const addMentorCommentAtom = atom(
  null,
  (get, set, comment: Omit<MentorComment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newComment: MentorComment = {
      ...comment,
      id: `comment-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const currentComments = get(mentorCommentsAtom);
    set(mentorCommentsAtom, [...currentComments, newComment]);
  }
);

export const updateMentorCommentAtom = atom(
  null,
  (get, set, commentId: string, content: string) => {
    const currentComments = get(mentorCommentsAtom);
    const updatedComments = currentComments.map(comment => 
      comment.id === commentId 
        ? { ...comment, content, updatedAt: new Date() }
        : comment
    );
    set(mentorCommentsAtom, updatedComments);
  }
);

export const deleteMentorCommentAtom = atom(
  null,
  (get, set, commentId: string) => {
    const currentComments = get(mentorCommentsAtom);
    const updatedComments = currentComments.filter(comment => comment.id !== commentId);
    set(mentorCommentsAtom, updatedComments);
  }
);

// Search and filter atoms
export const searchMentorsAtom = atom(
  null,
  (get, set, query: string, expertise?: string[]) => {
    const allMentors = get(mentorsAtom);
    let filtered = allMentors.filter(mentor => mentor.isAvailable);
    
    if (query) {
      filtered = filtered.filter(mentor => 
        mentor.name.toLowerCase().includes(query.toLowerCase()) ||
        mentor.bio?.toLowerCase().includes(query.toLowerCase()) ||
        mentor.expertise.some(exp => exp.toLowerCase().includes(query.toLowerCase()))
      );
    }
    
    if (expertise && expertise.length > 0) {
      filtered = filtered.filter(mentor =>
        expertise.some(exp => mentor.expertise.includes(exp))
      );
    }
    
    return filtered;
  }
);

// Email notification simulation (replace with actual email service)
export const sendMentorNotificationAtom = atom(
  null,
  async (get, set, mentorId: string, type: 'booking_request' | 'booking_accepted' | 'booking_rejected') => {
    const mentor = get(mentorsAtom).find(m => m.id === mentorId);
    if (!mentor) return;
    
    // TODO: Replace with actual email service
    console.log(`Sending ${type} notification to ${mentor.email}`);
    
    // Simulate email delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Email sent to ${mentor.email}`);
  }
);
