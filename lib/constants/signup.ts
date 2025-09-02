// Signup form constants and static data
import {
  GraduationCap,
  Users,
  Building,
  CheckCircle,
  Target,
} from '../../app/components/Icons';

export const SIGNUP_CONSTANTS = {
  // User type options
  USER_TYPES: [
    {
      id: "STUDENT",
      title: "Student",
      description: "MSc, PhD, or Research student",
      icon: GraduationCap,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "MENTOR",
      title: "Academic Mentor",
      description: "Supervisor or advisor",
      icon: Users,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      id: "INSTITUTION",
      title: "Institution",
      description: "University or organization",
      icon: Building,
      color: "from-purple-500 to-purple-600",
    },
  ] as const,

  // Academic level options
  ACADEMIC_LEVELS: [
    { value: "UNDERGRADUATE", label: "Undergraduate" },
    { value: "MASTERS", label: "Masters" },
    { value: "PHD", label: "PhD" },
    { value: "POSTDOC", label: "Postdoc" },
  ] as const,

  // Step titles and descriptions
  STEPS: [
    {
      step: 1,
      title: "Choose your category",
      description: "Select the type of account you want to create",
    },
    {
      step: 2,
      title: "Tell us about yourself",
      description: "Provide your personal information",
    },
    {
      step: 3,
      title: "Create your account",
      description: "Set up your login credentials",
    },
    {
      step: 4,
      title: "Review & complete",
      description: "Review your information and complete registration",
    },
  ] as const,

  // Form validation messages
  VALIDATION_MESSAGES: {
    EMAIL_REQUIRED: "Email is required",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_MIN_LENGTH: "Password must be at least 8 characters long",
    EMAIL_INVALID: "Please enter a valid email address",
    PASSWORDS_MISMATCH: "Passwords do not match",
    USER_TYPE_REQUIRED: "Please select your user type",
    FIRST_NAME_REQUIRED: "First name is required",
    LAST_NAME_REQUIRED: "Last name is required",
    ACADEMIC_LEVEL_REQUIRED: "Please select your academic level",
    INSTITUTION_NAME_REQUIRED: "Institution name is required",
  } as const,

  // Error types and messages
  ERROR_TYPES: {
    AUTH: "auth",
    NETWORK: "network",
    VALIDATION: "validation",
  } as const,

  // Error display messages
  ERROR_MESSAGES: {
    AUTH: {
      title: "Authentication Failed",
      suggestion: "Please check your email and password, or create a new account if you don't have one.",
      action: "Try Again",
    },
    NETWORK: {
      title: "Connection Error",
      suggestion: "Please check your internet connection and try again.",
      action: "Retry",
    },
    VALIDATION: {
      title: "Invalid Input",
      suggestion: "Please check your email format and ensure password is at least 8 characters.",
      action: "Fix Input",
    },
    DEFAULT: {
      title: "Error",
      suggestion: "Please try again or contact support if the problem persists.",
      action: "Try Again",
    },
  } as const,

  // User type mappings for backend API
  USER_TYPE_MAP: {
    STUDENT: 'STUDENT',
    MENTOR: 'MENTOR',
    INSTITUTION: 'INSTITUTION',
  } as const,

  // Academic level mappings for backend API
  ACADEMIC_LEVEL_MAP: {
    STUDENT: 'MASTERS', // Default for students, can be updated later
  } as const,

  // Form field placeholders
  PLACEHOLDERS: {
    FIRST_NAME: "Enter your first name",
    LAST_NAME: "Enter your last name",
    EMAIL: "Enter your email",
    EMAIL_EDU_NG: "Enter your edu.ng email",
    PASSWORD: "Enter your password",
    CONFIRM_PASSWORD: "Confirm your password",
    INSTITUTION_NAME: "Enter institution name",
    RESEARCH_AREA: "Enter your research area",
    ACADEMIC_LEVEL: "Select your academic level",
  } as const,

  // Form labels
  LABELS: {
    FIRST_NAME: "First Name",
    LAST_NAME: "Last Name",
    EMAIL: "Email Address",
    PASSWORD: "Password",
    CONFIRM_PASSWORD: "Confirm Password",
    INSTITUTION_NAME: "Institution Name",
    RESEARCH_AREA: "Research Area",
    ACADEMIC_LEVEL: "Academic Level",
    USER_TYPE: "I am a...",
    REMEMBER_ME: "Remember me",
  } as const,

  // Button texts
  BUTTONS: {
    NEXT: "Next",
    PREVIOUS: "Previous",
    SUBMIT: "Create Account",
    TRY_AGAIN: "Try Again",
    CREATE_ACCOUNT: "Create Account",
    FIX_INPUT: "Fix Input",
    RETRY: "Retry",
  } as const,

  // Page titles and descriptions
  PAGE: {
    TITLE: "Join the Future",
    SUBTITLE: "Start your research journey today",
    WELCOME_BACK: "Welcome Back!",
    WELCOME_DESCRIPTION: "Continue your research journey with access to advanced research tools, expert guidance, and a community of scholars.",
  } as const,

  // Feature highlights
  FEATURES: [
    {
      icon: CheckCircle,
      text: "Expert research evaluation",
      color: "bg-blue-500/20",
      iconColor: "text-blue-400",
    },
    {
      icon: Users,
      text: "Expert community access",
      color: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
    },
    {
      icon: Target,
      text: "Personalized research roadmap",
      color: "bg-orange-500/20",
      iconColor: "text-orange-400",
    },
  ] as const,
} as const;

// Type exports for use in components
export type UserType = typeof SIGNUP_CONSTANTS.USER_TYPES[number]['id'];
export type AcademicLevel = typeof SIGNUP_CONSTANTS.ACADEMIC_LEVELS[number]['value'];
export type ErrorType = typeof SIGNUP_CONSTANTS.ERROR_TYPES[keyof typeof SIGNUP_CONSTANTS.ERROR_TYPES];
