import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  userType?: 'STUDENT' | 'MENTOR' | 'INSTITUTION';
  institutionName?: string;
  researchArea?: string;
  academicLevel?: string;
  phone?: string;
  bio?: string;
  image?: string;
  isActive: boolean;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Current authenticated user atom - will be populated from NextAuth.js
export const currentUserAtom = atom<User | null>(null);

// Auth state atom - now derived from NextAuth.js
export const authStateAtom = atom<AuthState>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
});

// Computed atoms
export const userAtom = atom((get) => get(currentUserAtom));
export const isAuthenticatedAtom = atom((get) => !!get(currentUserAtom));
export const isLoadingAtom = atom((get) => get(authStateAtom).isLoading);

// User role atoms - centralized role checking
export const userRoleAtom = atom((get) => {
  const user = get(currentUserAtom);
  return user?.userType || 'STUDENT';
});

export const isStudentAtom = atom((get) => get(userRoleAtom) === 'STUDENT');
export const isMentorAtom = atom((get) => get(userRoleAtom) === 'MENTOR');
export const isInstitutionAtom = atom((get) => get(userRoleAtom) === 'INSTITUTION');

// User info atoms
export const userNameAtom = atom((get) => {
  const user = get(currentUserAtom);
  if (user?.firstName && user?.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  return user?.name || user?.email || 'User';
});

export const userDisplayNameAtom = atom((get) => {
  const user = get(currentUserAtom);
  return user?.firstName || user?.name || user?.email || 'User';
});

// Action atoms
export const setLoadingAtom = atom(
  null,
  (get, set, isLoading: boolean) => {
    const currentState = get(authStateAtom);
    set(authStateAtom, {
      ...currentState,
      isLoading,
    });
  }
);

// Update current user from NextAuth.js session
export const updateCurrentUserAtom = atom(
  null,
  (get, set, userData: any) => {
    try {
      // Create local user object from NextAuth.js session data
      const newUser: User = {
        id: userData.id,
        email: userData.email,
        password: '', // Don't store password in local state
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: userData.name,
        userType: userData.userType,
        institutionName: userData.institutionName,
        researchArea: userData.researchArea,
        academicLevel: userData.academicLevel,
        phone: userData.phone,
        bio: userData.bio,
        image: userData.image,
        isActive: userData.isActive || true,
        createdAt: userData.createdAt ? new Date(userData.createdAt) : new Date(),
        updatedAt: userData.updatedAt ? new Date(userData.updatedAt) : new Date(),
      };

      // Update current user
      set(currentUserAtom, newUser);
      
      // Update auth state
      set(authStateAtom, {
        user: newUser,
        isAuthenticated: true,
        isLoading: false,
      });

      console.log('✅ Current user updated from NextAuth.js session:', newUser.email);
      return newUser;
      
    } catch (error) {
      console.error('❌ Error updating current user:', error);
      throw error;
    }
  }
);

// Clear current user (for sign out)
export const clearCurrentUserAtom = atom(
  null,
  (get, set) => {
    set(currentUserAtom, null);
    set(authStateAtom, {
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
    console.log('✅ Current user cleared');
  }
);

// Logout function that clears state and redirects
export const logoutAtom = atom(
  null,
  async (get, set) => {
    try {
      // Clear local state
      set(currentUserAtom, null);
      set(authStateAtom, {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
      
      // Call NextAuth.js signOut
      const { signOut } = await import('next-auth/react');
      await signOut({ callbackUrl: '/signin' });
      
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Error during logout:', error);
      // Even if there's an error, clear local state
      set(currentUserAtom, null);
      set(authStateAtom, {
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }
);

// Update current user profile data
export const updateUserProfileAtom = atom(
  null,
  async (get, set, updates: Partial<Omit<User, 'id' | 'password' | 'isActive' | 'verificationToken' | 'verificationTokenExpires' | 'createdAt' | 'updatedAt'>>) => {
    try {
      const currentUser = get(currentUserAtom);
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Call backend API to update user profile
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update profile');
      }

      const result = await response.json();
      
      // Update local user state with new data
      const updatedUser: User = {
        ...currentUser,
        ...updates,
        updatedAt: new Date(),
      };

      set(currentUserAtom, updatedUser);
      set(authStateAtom, {
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
      });

      console.log('✅ User profile updated successfully');
      
      // Dispatch custom event to notify other components of user profile update
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('userProfileUpdated'));
      }
      
      return updatedUser;
      
    } catch (error) {
      console.error('❌ Error updating user profile:', error);
      throw error;
    }
  }
);

// Update user image specifically
export const updateUserImageAtom = atom(
  null,
  async (get, set, imageFile: File) => {
    try {
      const currentUser = get(currentUserAtom);
      if (!currentUser) {
        throw new Error('No user logged in');
      }

      // Convert File to base64 string
      const base64String = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            resolve(reader.result);
          } else {
            reject(new Error('Failed to convert file to base64'));
          }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(imageFile);
      });

      // Update user with base64 image string
      const updatedUser: User = {
        ...currentUser,
        image: base64String,
        updatedAt: new Date(),
      };

      set(currentUserAtom, updatedUser);
      set(authStateAtom, {
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
      });

      console.log('✅ User image updated successfully');
      return updatedUser;
      
    } catch (error) {
      console.error('❌ Error updating user image:', error);
      throw error;
    }
  }
);

// Backend API user registration - doesn't update local state until sign-in is successful
export const registerUserAtom = atom(
  null,
  async (get, set, userData: Omit<User, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>) => {
    try {
      
      // Call backend registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          userType: userData.userType || 'STUDENT',
          institutionName: userData.institutionName,
          researchArea: userData.researchArea,
          academicLevel: userData.academicLevel,
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        console.error('❌ Registration failed:', result.error);
        
        // Pass through validation error details for better UX
        if (result.details && Array.isArray(result.details)) {
          const error = new Error('Validation failed');
          (error as any).details = result.details;
          throw error;
        }
        
        throw new Error(result.error || 'Registration failed');
      }

      console.log('✅ Backend registration successful:', result.user);
      
      // Return the user data but DON'T update local state yet
      // Local state will only be updated after successful sign-in
      return result.user;
      
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }
);

