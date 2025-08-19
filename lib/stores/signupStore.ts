import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// Interface for the signup form data
export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  institutionName: string;
  userType: string;
  researchArea: string;
  academicLevel: string;
  agreeToTerms: boolean;
}

// Initial form data
const initialFormData: SignupFormData = {
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
  institutionName: '',
  userType: '',
  researchArea: '',
  academicLevel: '',
  agreeToTerms: false,
};

// Atoms with localStorage persistence
export const signupStepAtom = atomWithStorage('signup-step', 1);
export const signupFormDataAtom = atomWithStorage('signup-form-data', initialFormData);

// Computed atoms
export const isStepValidAtom = atom((get) => {
  const step = get(signupStepAtom);
  const formData = get(signupFormDataAtom);
  const isEmail = (v: string | undefined) => !!v && /.+@.+\..+/.test(v.trim());
  
  let isValid = false;
  
  switch (step) {
    case 1:
      isValid = !!formData.userType;
      break;
    case 2:
      // Personal details step: require first and last name only
      isValid = !!(formData.firstName?.trim() && formData.lastName?.trim());
      break;
    case 3:
      // Contact/affiliation step: require valid email; if userType is institution/mentor, also require edu.ng email
      if (!isEmail(formData.email)) {
        isValid = false;
        break;
      }
      
      // Validate edu.ng email for institution and academic mentor users
      if (formData.userType === 'institution' || formData.userType === 'mentor') {
        if (!formData.email.toLowerCase().includes('edu.ng')) {
          isValid = false;
          break;
        }
      }
      
      if (formData.userType === 'institution') {
        isValid = !!formData.institutionName?.trim();
      } else {
        isValid = true;
      }
      break;
    case 4:
      // Security & terms step: require strong password, match, and terms
      const hasPassword = !!formData.password;
      const hasConfirmPassword = !!formData.confirmPassword;
      const passwordsMatch = formData.password === formData.confirmPassword;
      const passwordLength = formData.password?.length || 0;
      const hasValidLength = passwordLength >= 8;
      const hasAgreedToTerms = !!formData.agreeToTerms;
      
      isValid = hasPassword && hasConfirmPassword && passwordsMatch && hasValidLength && hasAgreedToTerms;
      

      break;
    default:
      isValid = false;
  }
  
  return isValid;
});

export const canProceedAtom = atom((get) => get(isStepValidAtom));

export const canGoBackAtom = atom((get) => {
  const step = get(signupStepAtom);
  return step > 1;
});

// Action atoms
export const nextStepAtom = atom(
  null,
  (get, set) => {
    const currentStep = get(signupStepAtom);
    if (currentStep < 4) {
      set(signupStepAtom, currentStep + 1);
    }
  }
);

export const prevStepAtom = atom(
  null,
  (get, set) => {
    const currentStep = get(signupStepAtom);
    if (currentStep > 1) {
      set(signupStepAtom, currentStep - 1);
    }
  }
);

export const updateFormDataAtom = atom(
  null,
  (get, set, updates: Partial<SignupFormData>) => {
    const currentData = get(signupFormDataAtom);
    const normalized: Partial<SignupFormData> = {};
    Object.entries(updates).forEach(([key, value]) => {
      if (typeof value === 'string') {
        // Don't trim password fields, only trim other string fields
        if (key === 'password' || key === 'confirmPassword') {
          normalized[key as keyof SignupFormData] = value as any;
        } else {
          const trimmed = value.trim();
          normalized[key as keyof SignupFormData] = (key === 'email'
            ? trimmed.toLowerCase()
            : trimmed) as any;
        }
      } else {
        normalized[key as keyof SignupFormData] = value as any;
      }
    });
    set(signupFormDataAtom, { ...currentData, ...normalized });
  }
);

export const resetSignupAtom = atom(
  null,
  (get, set) => {
    set(signupStepAtom, 1);
    set(signupFormDataAtom, initialFormData);
  }
);

export const goToStepAtom = atom(
  null,
  (get, set, step: number) => {
    if (step >= 1 && step <= 4) {
      set(signupStepAtom, step);
    }
  }
);
