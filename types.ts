import { ReactNode } from 'react';

export interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
}

export interface NavItem {
  label: string;
  href: string;
}

export interface ClientStory {
  title: string;
  subtitle: string;
  points: string[];
}

/**
 * Which set of questions the survey opens on. Part of the survey contract:
 * `api/survey.ts` routes submissions by the answers each branch collects.
 */
export type SurveyBranch = 'work' | 'category';

/** The legal documents that have their own route. */
export type LegalDoc = 'terms' | 'privacy';
