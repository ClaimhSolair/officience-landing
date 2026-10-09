import { workSources } from '../../assets';
import type { Picture } from '../services/types';
import type { WorkCase, WorkProject } from './types';
import ioga from './ioga';

/**
 * The Work listing, in the Figma order: 3353:3329 draws cards 1-6 and
 * 3403:3521 draws cards 7-12. The pagination puts six cards on a page.
 *
 * Each picture is baked at the drawn 684:398 box (Figma's own crop and scale),
 * so the page sets the box ratio and `object-cover` has no effect.
 */

/** A listing picture: 700 and 1400 wide. ECOEATS is live text in Figma, so its file is the 1x render. */
const card = (name: string, alt: string, widths = [700, 1400]): Picture => ({
  sources: workSources('listing', name, widths),
  w: 684,
  h: 398,
  alt,
});

export const WORK_PROJECTS: WorkProject[] = [
  {
    slug: 'lab',
    title: 'LAB',
    tags: ['CRM', 'Dashboard'],
    image: card('lab', 'A LAB dashboard with a donut chart, a bar chart and a line chart of files created by type of work.'),
  },
  {
    slug: 'ioga',
    title: 'IOGA',
    tags: ['Software Development', 'Mobile App'],
    image: card('ioga', 'A woman in a yellow sweater records herself with a phone on a small tripod.'),
  },
  {
    slug: 'finpivot',
    title: 'FINPIVOT',
    tags: ['Logo & Branding', 'Dashboard'],
    image: card('finpivot', 'Two FINPIVOT business cards, one blue and one white, on a grey folded surface.'),
  },
  {
    slug: 'ecoeats',
    title: 'ECOEATS',
    tags: ['Logo & Branding', 'Mobile App'],
    image: card('ecoeats', 'The EcoEats Delivery logo, a chef hat over a green and black wordmark, on yellow.', [684]),
  },
  {
    slug: 'izi-it',
    title: 'IZI-IT',
    tags: ['Application', 'Development'],
    image: card('izi-it', 'An IZI-IT banner that reads "Level up your IT monitoring", with a giraffe mark and Zabbix badges.'),
  },
  {
    slug: 'cmp',
    title: 'CMP',
    tags: ['Dashboard', 'WordPress'],
    image: card('cmp', 'The CMP login page for precious metals trading, over a periodic table of metals.'),
  },
  {
    slug: 'offy-puzzles-2024',
    title: 'Offy Puzzles 2024',
    tags: ['Branding', 'Illustrator'],
    image: card('offy-puzzles', 'A grid of Offy Puzzles illustrations in blue, red and orange: a kite, a rooster, a croissant and more.'),
  },
  {
    slug: 'passerelles-numeriques',
    title: 'Passerelles Numériques',
    tags: ['Web Design', 'WordPress'],
    image: card('passerelles', 'The Passerelles Numériques home page, "Fight poverty with education", with students at their desks.'),
  },
  {
    slug: 'rapide-tyres',
    title: 'Rapide Tyres',
    tags: ['E-commerce', 'Development'],
    image: card('rapide-tyres', 'A close view of a car tyre in a workshop.'),
  },
  {
    slug: 'funpass',
    title: 'FunPass',
    tags: ['Data Collection', 'Operation Support'],
    image: card('funpass', 'Young people dance and cheer with red cups at an outdoor festival.'),
  },
  {
    slug: 'healthcare',
    title: 'HealthCare',
    tags: ['Software Development', 'Web App'],
    image: card('healthcare', 'A nurse in blue scrubs takes notes beside a laptop that shows patient records.'),
  },
  {
    slug: 'cassims-brother',
    title: "Cassim's Brother",
    tags: ['Data Scraping', 'Qualification'],
    image: card('cassims-brother', 'A large covered market hall, seen from above, with rows of stalls.'),
  },
];

/** The case studies, by slug. Only IOGA has one (ruling 20a). */
export const WORK_CASES: Record<string, WorkCase> = { [ioga.slug]: ioga };

/** True when a project has a case study, so its card is a link. */
export const hasCase = (slug: string) => Object.prototype.hasOwnProperty.call(WORK_CASES, slug);
