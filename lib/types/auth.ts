import { z } from 'zod';

// User types
export interface User {
  id: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  userType: UserType;
  institutionName?: string;
  researchArea?: string;
  academicLevel?: string;
  avatar?: string;
  bio?: string;
  expertise?: string[];
  isActive: boolean;
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  resetPasswordToken?: string;
  resetPasswordTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type UserType = 'student' | 'mentor' | 'institution';

export type AcademicLevel = 'Undergraduate' | 'Masters' | 'PhD' | 'PostDoc';

// Authentication schemas
export const RegisterSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  userType: z.enum(['student', 'mentor', 'institution']),
  institutionName: z.string().optional(),
  researchArea: z.string().optional(),
  academicLevel: z.enum(['Undergraduate', 'Masters', 'PhD', 'PostDoc']).optional(),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one lowercase letter, one uppercase letter, and one number'),
});

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});

export const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  institutionName: z.string().optional(),
  researchArea: z.string().optional(),
  academicLevel: z.enum(['Undergraduate', 'Masters', 'PhD', 'PostDoc']).optional(),
  expertise: z.array(z.string()).optional(),
});

// JWT payload types
export interface JWTPayload {
  userId: string;
  email: string;
  userType: UserType;
  iat: number;
  exp: number;
}

export interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
  iat: number;
  exp: number;
}

// Response types
export interface AuthResponse {
  success: boolean;
  message: string;
  user?: Omit<User, 'password'>;
  token?: string;
  refreshToken?: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
  code?: string;
}

// Token types
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshToken {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  isRevoked: boolean;
}
