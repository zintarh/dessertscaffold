import { atom } from 'jotai';
import { EvaluationRequest, EvaluationResponse } from '../types/evaluation';

/**
 * Geotie store for research topic evaluation state management
 * Uses Jotai for atomic state management with persistence
 */

// Base atoms for evaluation state
export const topicAtom = atom<string>('');
export const keywordsAtom = atom<string[]>([]);
export const statusAtom = atom<'idle' | 'loading' | 'done' | 'error'>('idle');
export const resultAtom = atom<EvaluationResponse | null>(null);
export const errorAtom = atom<string | null>(null);

// Derived atoms for computed state
export const isLoadingAtom = atom((get) => get(statusAtom) === 'loading');
export const hasResultAtom = atom((get) => get(resultAtom) !== null);
export const hasErrorAtom = atom((get) => get(errorAtom) !== null);

// Request atom for API calls
export const requestAtom = atom<EvaluationRequest | null>((get) => {
  const topic = get(topicAtom);
  const keywords = get(keywordsAtom);
  
  if (!topic.trim()) return null;
  
  return {
    research_topic: topic.trim(),
    additional_keywords: keywords.length > 0 ? keywords : undefined,
  };
});

// Actions atoms
export const setTopicAtom = atom(
  null,
  (get, set, topic: string) => {
    set(topicAtom, topic);
    // Clear previous results when topic changes
    if (get(resultAtom)) {
      set(resultAtom, null);
      set(errorAtom, null);
      set(statusAtom, 'idle');
    }
  }
);

export const setKeywordsAtom = atom(
  null,
  (get, set, keywords: string[]) => {
    // Validate and clean keywords
    const cleanKeywords = keywords
      .map(k => k.trim())
      .filter(k => k.length >= 2 && k.length <= 50)
      .slice(0, 10); // Max 10 keywords
    
    set(keywordsAtom, cleanKeywords);
    
    // Clear previous results when keywords change
    if (get(resultAtom)) {
      set(resultAtom, null);
      set(errorAtom, null);
      set(statusAtom, 'idle');
    }
  }
);

export const addKeywordAtom = atom(
  null,
  (get, set, keyword: string) => {
    const currentKeywords = get(keywordsAtom);
    const trimmedKeyword = keyword.trim();
    
    if (trimmedKeyword.length >= 2 && 
        trimmedKeyword.length <= 50 && 
        !currentKeywords.includes(trimmedKeyword) &&
        currentKeywords.length < 10) {
      set(keywordsAtom, [...currentKeywords, trimmedKeyword]);
    }
  }
);

export const removeKeywordAtom = atom(
  null,
  (get, set, index: number) => {
    const currentKeywords = get(keywordsAtom);
    set(keywordsAtom, currentKeywords.filter((_, i) => i !== index));
  }
);

export const resetAtom = atom(
  null,
  (get, set) => {
    set(topicAtom, '');
    set(keywordsAtom, []);
    set(statusAtom, 'idle');
    set(resultAtom, null);
    set(errorAtom, null);
  }
);

// Main evaluation action
export const evaluateTopicAtom = atom(
  null,
  async (get, set) => {
    const request = get(requestAtom);
    if (!request) {
      set(errorAtom, 'Please enter a research topic');
      return;
    }

    set(statusAtom, 'loading');
    set(errorAtom, null);

    try {
      const response = await fetch('/api/evaluate-topic', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Evaluation failed');
      }

      const result: EvaluationResponse = await response.json();
      set(resultAtom, result);
      set(statusAtom, 'done');
      
    } catch (error) {
      console.error('Evaluation error:', error);
      set(errorAtom, error instanceof Error ? error.message : 'An unexpected error occurred');
      set(statusAtom, 'error');
    }
  }
);

// Persistence atoms (for localStorage)
export const persistedTopicAtom = atom(
  (get) => get(topicAtom),
  (get, set, newTopic: string) => {
    set(topicAtom, newTopic);
    if (typeof window !== 'undefined') {
      localStorage.setItem('evaluation_topic', newTopic);
    }
  }
);

export const persistedKeywordsAtom = atom(
  (get) => get(keywordsAtom),
  (get, set, newKeywords: string[]) => {
    set(keywordsAtom, newKeywords);
    if (typeof window !== 'undefined') {
      localStorage.setItem('evaluation_keywords', JSON.stringify(newKeywords));
    }
  }
);

// Initialize from localStorage
export const initializeFromStorageAtom = atom(
  null,
  (get, set) => {
    if (typeof window === 'undefined') return;
    
    const savedTopic = localStorage.getItem('evaluation_topic');
    const savedKeywords = localStorage.getItem('evaluation_keywords');
    
    if (savedTopic) {
      set(topicAtom, savedTopic);
    }
    
    if (savedKeywords) {
      try {
        const keywords = JSON.parse(savedKeywords);
        if (Array.isArray(keywords)) {
          set(keywordsAtom, keywords);
        }
      } catch (error) {
        console.warn('Failed to parse saved keywords:', error);
      }
    }
  }
);

// Export store interface for easier usage
export interface EvaluationStore {
  // State
  topic: string;
  keywords: string[];
  status: 'idle' | 'loading' | 'done' | 'error';
  result: EvaluationResponse | null;
  error: string | null;
  
  // Computed
  isLoading: boolean;
  hasResult: boolean;
  hasError: boolean;
  
  // Actions
  setTopic: (topic: string) => void;
  setKeywords: (keywords: string[]) => void;
  addKeyword: (keyword: string) => void;
  removeKeyword: (index: number) => void;
  evaluateTopic: () => Promise<void>;
  reset: () => void;
  initializeFromStorage: () => void;
}
