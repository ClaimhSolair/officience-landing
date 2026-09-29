import type { ServicePageContent } from './types';
import software from './software-web-development';

/**
 * The service pages by slug. Phase 1 of the Services build (2026-09-29) has the
 * Software pilot only. The other six pages join this map in phase 2.
 */
export const SERVICE_PAGES: Record<string, ServicePageContent> = {
  [software.slug]: software,
};
