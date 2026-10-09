import { careerSources, type ImageSource } from '../../assets';

/**
 * The open jobs (ruling 21a: a new job is a commit and a deploy). The hub lists
 * every job in this order, and each job has a page at `/career/<slug>`.
 *
 * Copy comes from Figma where Figma draws it: the job page 3864:16770 draws
 * Senior PHP Developer in full, and the hub 3297:2342 draws the title, the
 * excerpt and the tags of the other three. The rest of those three is
 * placeholder copy (ruling 21d). `placeholder: true` marks it, and
 * `scripts/check-career-placeholders.mjs` warns on every build while one is left
 * (ruling 21k: HR replaces or removes them before the merge).
 */

/** The role chips of the apply form, in the drawn order (3881:4503). */
export const APPLY_ROLES = ['Design / UX', 'Front-end', 'Back-end', 'Data / AI', 'QA', 'BPO'] as const;
export type ApplyRole = (typeof APPLY_ROLES)[number];

export type JobCategory = 'Tech & IT' | 'Media & Marketing' | 'Business & Services';

export interface JobPicture {
  sources: ImageSource[];
  alt: string;
}

export interface Job {
  slug: string;
  title: string;
  category: JobCategory;
  /** ISO date. Shown as "Sep 17, 2026". */
  postedAt: string;
  /** The hub's first meta line, e.g. "HCM - Hybrid". */
  where: string;
  /** The hub's tag lines under `where`. */
  tags: string[];
  /** The hub's two-line excerpt, verbatim. */
  excerpt: string;
  salary: string;
  location: string;
  employment: { type: string; term: string };
  teamSize: string;
  roleIntro: string;
  roleBullets: string[];
  qualifications: string[];
  /** The chip the apply form selects first (ruling 21g). */
  applyRole: ApplyRole;
  /** 461x398, Figma's stretch of the art (3878:19040). */
  image: JobPicture;
  /** 109x103, the sidebar thumbnail. */
  thumb: JobPicture;
  placeholder?: true;
}

/** "About us" on every job page (3878:18833), verbatim. */
export const ABOUT_COMPANY =
  "Officience (since 2006) - a French-owned pioneer, brings Vietnamese agility to the world by providing business performance services that help clients succeed. For over 15 years, we've been dedicated to delivering IT Solutions, Data Management, and Creative Design with care and smile.";

const art = (key: string, alt: string) => ({
  image: { sources: careerSources(`job-${key}`, [461, 842]), alt },
  thumb: { sources: careerSources(`thumb-${key}`, [218, 327]), alt: '' },
});

const PLACEHOLDER_ROLE = {
  roleIntro: 'Placeholder text. HR writes the role description before this page goes live.',
  roleBullets: ['Placeholder responsibility 1', 'Placeholder responsibility 2', 'Placeholder responsibility 3'],
  qualifications: ['Placeholder qualification 1', 'Placeholder qualification 2', 'Placeholder qualification 3'],
};

const OFFICE = {
  salary: 'Negotiable',
  location: 'District 10, HCMC (hybrid)',
  employment: { type: 'Full-time', term: 'Permanent' },
  teamSize: '200 - 250 members',
  where: 'HCM - Hybrid',
};

export const JOBS: Job[] = [
  {
    slug: 'senior-php-developer',
    title: 'Senior PHP Developer',
    category: 'Tech & IT',
    postedAt: '2026-09-17',
    ...OFFICE,
    // Figma draws no hub row for this job. The tags and the excerpt come from
    // its own page copy.
    tags: ['PHP', 'Laravel / Symfony', 'MySQL', 'English'],
    excerpt: 'In IT Craft, we build and operate end-to-end IT solutions with iter....',
    roleIntro:
      'In IT Craft, we build and operate end-to-end IT solutions with iterative, value-focused approach and self-organizing teams.',
    roleBullets: [
      'Analyze requirements and design technical solutions',
      'Write clean and maintainable code',
      'Conduct code reviews and enforce coding standards',
      'Write unit tests and interact with testers',
      'Estimate development effort and suggest quality improvements',
      'Research new technologies and libraries',
    ],
    qualifications: [
      '5+ years experience in web development technologies',
      'Hands-on CMS (Wordpress or Drupal)',
      'Experience with PHP Web and MVC framework (Laravel, Symfony, Magento...)',
      'Knowledge in architecture patterns & best practices',
      'Troubleshooting performance, scale, object clustering issue for integration solutions and debugging',
      'Knowledge of JS frameworks (Angular, Node, React, etc) is a big plus',
      'Familiarity with one of Apache, Nginx, Symfony, Doctrine, Varnish, Jenkins, RESTful Web services, Linux command line (Ubuntu, Debian)',
      'Knowledge of HTML5, CSS, jQuery, and databases (e.g. MySQL, MongoDB)',
      'Good English, multi-tasking, collaboration, presentation, strategic & tactical thinking, and research & development skills',
    ],
    applyRole: 'Back-end',
    ...art('php', 'An otter mascot in a blue hoodie points at code on a monitor, holding a coffee cup.'),
  },
  {
    slug: 'middle-backend-developer',
    title: 'Middle Backend Developer',
    category: 'Tech & IT',
    postedAt: '2026-08-10',
    ...OFFICE,
    tags: ['Communication', 'DevOps', 'Infrastructure As Code'],
    excerpt: 'In your role, you design and develop new features/libraries of autom....',
    ...PLACEHOLDER_ROLE,
    applyRole: 'Back-end',
    ...art('it', 'An otter mascot works at a desk with several monitors.'),
    placeholder: true,
  },
  {
    slug: 'software-web-developer',
    title: 'Software & Web Developer',
    category: 'Tech & IT',
    postedAt: '2026-08-10',
    ...OFFICE,
    tags: ['English', 'OEM', 'C++', 'Enterprise tools', 'System integrations'],
    excerpt: 'You will be responsible for building, automating, and maintaining....',
    ...PLACEHOLDER_ROLE,
    applyRole: 'Front-end',
    ...art('ecom', 'An otter mascot in front of a wall of screens with charts.'),
    placeholder: true,
  },
  {
    slug: 'business-intelligence-analytics-officer',
    // "Officier" is the drawn spelling (spec, Figma slips). It ships as drawn.
    title: 'Business Intelligence & Analytics Officier',
    category: 'Tech & IT',
    postedAt: '2026-08-10',
    ...OFFICE,
    tags: ['Business intelligence dashboards', 'Automation solutions', 'Forecasting models', 'AI & machine learning'],
    excerpt: 'Turn your data into business insights. automating, and maintaining....',
    ...PLACEHOLDER_ROLE,
    applyRole: 'Data / AI',
    ...art('pr', 'An otter mascot at a desk covered with reports and a laptop.'),
    placeholder: true,
  },
];

export const jobBySlug = (slug: string | undefined) => JOBS.find((j) => j.slug === slug);

/** Every job except the one on screen, for the job page's sidebar (ruling 21e). */
export const otherJobs = (slug: string) => JOBS.filter((j) => j.slug !== slug);

/** "Sep 17, 2026" and "May 08, 2026", as the artboards set dates. */
export const formatPosted = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
