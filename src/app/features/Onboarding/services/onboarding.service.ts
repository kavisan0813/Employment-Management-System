/* ─── Onboarding Service ─── */
// Placeholder for future backend API integration.
// When backend is ready, replace mock data imports with API calls here.

import type {
  NewHire,
  OnboardingPhase,
  DocumentItem,
} from "../types/onboarding.types";

export const onboardingService = {
  /** Fetch all new hires */
  async getNewHires(): Promise<NewHire[]> {
    // TODO: Replace with API call
    return [];
  },

  /** Fetch phases for a specific employee */
  async getPhases(): Promise<OnboardingPhase[]> {
    // TODO: Replace with API call
    return [];
  },

  /** Fetch documents for a specific employee */
  async getDocuments(): Promise<DocumentItem[]> {
    // TODO: Replace with API call
    return [];
  },

  /** Mark a task as done */
  async markTaskDone(): Promise<void> {
    // TODO: Replace with API call
  },

  /** Upload a document */
  async uploadDocument(): Promise<void> {
    // TODO: Replace with API call
  },
};
