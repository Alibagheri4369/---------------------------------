import { Project } from '../types';

/**
 * Production Initial Projects:
 * Completely reset to empty array per user requirements.
 * No mock, seed, or demo data is loaded. All user records originate
 * directly from the authenticated user's persistence layer in Supabase.
 */
export const INITIAL_UNIVERSAL_PROJECTS: Project[] = [];
