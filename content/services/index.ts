import type { ServicePageContent } from './types';
import design from './design-digital';
import software from './software-web-development';
import analytics from './business-intelligence-analytics';
import crunch from './data-engineering-processing';
import itOps from './it-operations-support';
import people from './people-talent-solutions';
import ai from './trusted-ai-insurance';

/** The seven service pages by slug, in the hub's order. */
export const SERVICE_PAGES: Record<string, ServicePageContent> = Object.fromEntries(
  [design, software, analytics, crunch, itOps, people, ai].map((page) => [page.slug, page]),
);
