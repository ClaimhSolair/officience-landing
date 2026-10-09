import type { Picture, Quote, TeamMember, ToolLogo, WorkCard } from '../services/types';

/**
 * The content of the Work pages: the listing (`/work`, Figma 3353:3329 and
 * 3403:3521) and the case studies (`/work/<slug>`, IOGA 3770:4574).
 *
 * The copy is verbatim from Figma. Slips are flagged in adapter section 20 and
 * ship as drawn.
 */

/** One card of the listing grid. */
export interface WorkProject {
  slug: string;
  title: string;
  /** The two chips. The Category filter takes its options from these. */
  tags: string[];
  /** The picture at the drawn 684:398 box. */
  image: Picture;
}

/** One line of the fact sidebar. A `\n` in the value is a drawn line break. */
export interface WorkFact {
  label: string;
  value: string;
}

/** One stat card of "Final Impact". */
export interface WorkImpact {
  value: string;
  label: string;
  text: string;
}

/** One numbered group of "Tech Stack". */
export interface WorkStack {
  title: string;
  logos: ToolLogo[];
  /** The drawn height of the group box at lg. It is a minimum, so a wrapped row can grow it. */
  h: number;
}

/** One case study. Each one is a file in `content/work/`. */
export interface WorkCase {
  slug: string;
  /** The page name, for the document title. */
  name: string;
  hero: {
    image: Picture;
    title: string;
    subtitle: string;
    /** The chips above the title. */
    tags: string[];
    /** The drawn widths of the title and subtitle boxes at lg. */
    titleWidth: number;
    subtitleWidth: number;
  };
  facts: WorkFact[];
  challenge: { text: string; chips: string[]; image: Picture };
  /** Three text and picture pairs. The first text is the intro under the heading. */
  solution: { text: string; image: Picture }[];
  impact: WorkImpact[];
  stack: WorkStack[];
  team: TeamMember[];
  quotes: Quote[];
  /** "Discover Other Works". */
  related: WorkCard[];
}
