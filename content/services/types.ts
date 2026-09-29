import type { ImageSource } from '../../assets';

/**
 * The content of one service page ("Brochure" in Figma). The seven child pages
 * share one template (`pages/ServicePage.tsx`), and each page is one object of
 * this type in `content/services/<slug>.ts`.
 *
 * An optional key that is absent hides its section. People & Talent draws no
 * Selected Work and no quotes, so its object has neither key.
 *
 * The copy is verbatim from Figma. Slips are flagged in adapter section 19 and
 * ship as drawn.
 */

/** A picture at its file's own ratio. `w` x `h` is that ratio. */
export interface Picture {
  sources: ImageSource[];
  w: number;
  h: number;
  alt: string;
}

export interface ServiceRow {
  /** A `\n` is a line break that Figma draws. It applies from lg. */
  title: string;
  /**
   * The line under the title. Absent where Figma draws a note to the designer
   * in place of copy (the Design & Digital rows, user ruling 2026-09-29).
   */
  tagline?: string;
  tags: string[];
  image: Picture;
}

export interface ToolLogo {
  src: string;
  alt: string;
  /** The drawn box, in CSS px at lg. */
  w: number;
  h: number;
}

export interface WorkCard {
  image: Picture;
  tags: string[];
  title: string;
}

export interface Quote {
  quote: string;
  /** "Name – Role", as Figma sets it on one line. */
  author: string;
  company?: string;
  avatar: string;
}

export interface TeamMember {
  name: string;
  role: string;
  photo: Picture;
  /** No URLs exist yet. The icon shows only when a URL is set. */
  linkedin?: string;
}

export interface ServicePageContent {
  slug: string;
  /** The page name, for the document title and the menu. */
  name: string;
  hero: {
    image: Picture;
    title: string;
    subtitle: string;
    /** A chip above the title ("Officience × Rizlum"). */
    pill?: string;
    /**
     * The drawn widths of the title and subtitle text boxes at lg, where a page
     * differs from Software (684 and 461). They set where the lines wrap.
     */
    titleWidth?: number;
    subtitleWidth?: number;
  };
  rows: ServiceRow[];
  tools?: ToolLogo[];
  work?: WorkCard[];
  quotes?: Quote[];
  team: {
    /** The display heading ("Our Players"). */
    title?: string;
    /** A large statement that Design & Digital draws in place of a heading. */
    statement?: string;
    /** The line on the right ("20 Members · 26+ Tools & Languages"). */
    stat?: string;
    people: TeamMember[];
  };
}
