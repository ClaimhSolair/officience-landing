import { serviceAsset, serviceSources } from '../../assets';
import type { ServicePageContent, ToolLogo } from './types';

/**
 * People & Talent Solutions — Figma 3726:13016 ("Brochure PO", 1440). The page
 * draws no Selected Work and no quotes, so the object has neither key.
 *
 * Every picture is baked at its drawn box, so the box ratio below is the file
 * ratio. One Figma fill is stretched (the Nga Bui portrait). The bake keeps its
 * anchor at one scale on both axes.
 */

const SLUG = 'people-talent-solutions';
const pic = (name: string, widths: number[], w: number, h: number, alt: string) => ({
  sources: serviceSources(SLUG, name, widths),
  w,
  h,
  alt,
});

// The strip in the drawn order, at the drawn box sizes (3731:3809).
const TOOLS: [string, number, number][] = [
  ['Zenefits', 154, 86.68],
  ['Homebase', 172, 86],
  ['Keka', 81, 29.326],
  ['BambooHR', 211.333, 118.875],
];

const tools: ToolLogo[] = TOOLS.map(([alt, w, h], i) => ({ src: serviceAsset(SLUG, `logo-${i + 1}.webp`), alt, w, h }));

const TEAM = [428, 856];

const people: ServicePageContent = {
  slug: SLUG,
  name: 'People & Talent Solutions',
  hero: {
    image: pic(
      'hero',
      [800, 1639],
      1639,
      959,
      'Otter mascots in pink “OTTY” hoodies hold a résumé and a laptop in an office, beside a board that reads “From Talent to Impact”.',
    ),
    title: 'People & Talent Solutions',
    subtitle: 'Find and grow the right talent for your team.',
    // The drawn subtitle box (3726:13415).
    subtitleWidth: 466,
  },
  rows: [
    {
      title: 'HR Operations & Administration',
      tagline: 'Fully digital. Walking the tightrope of local labor laws.',
      tags: ['Paperwork', 'Payroll', 'Benefits', 'ESG'],
      image: pic('row-hr', [707, 1414], 707, 414, 'A payroll app with a list of employees and the pay rate and amount of one employee.'),
    },
    {
      title: 'Vietnam Talent Sourcing & Hiring',
      tagline: 'Vietnam has talents.',
      tags: ['Insights', 'Sourcing', 'Assessment', 'Onboarding'],
      image: pic(
        'row-sourcing',
        [709, 1418],
        709,
        387,
        'A recruitment dashboard with jobs, CV counts and a bar chart of the last 28 days.',
      ),
    },
    {
      title: 'Recruitment Support',
      tagline: 'Vietnam — the rising talent hub of Asia.',
      tags: ['Talent/Expert', 'Interview Framework', 'Reporting'],
      image: pic(
        'row-recruit',
        [567, 1134],
        567.12,
        395.964,
        'A three-step process: talent and expert sourcing, the interview framework, and the report.',
      ),
    },
    {
      title: 'Culture & Onboarding',
      tagline: 'Culture over strategy.',
      tags: ['Orientation', 'Work habit', 'T-shape HR', 'Learning', 'Diversity & Inclusion', 'Well-being'],
      image: pic(
        'row-culture',
        [617, 1234],
        617,
        429.311,
        'A Tableau headcount dashboard with the share of females, the average age and an age chart.',
      ),
    },
  ],
  tools,
  team: {
    title: 'Our Navigators',
    stat: 'Soft power nurture caring',
    people: [
      { name: 'Nga Bui', role: 'HR', photo: pic('team-nga', TEAM, 428, 479, 'Nga Bui.') },
      {
        name: 'Dung Nguyen',
        role: 'HR Administrator | Talent Acquisition',
        photo: pic('team-dung', TEAM, 428, 479, 'Dung Nguyen.'),
      },
      { name: 'Vi Nguyen', role: 'HR Generalist', photo: pic('team-vi', TEAM, 428, 479, 'Vi Nguyen.') },
    ],
  },
};

export default people;
