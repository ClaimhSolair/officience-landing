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
