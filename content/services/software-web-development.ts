import { serviceAsset, serviceSources } from '../../assets';
import type { ServicePageContent, ToolLogo } from './types';

/**
 * Software & Web Development — Figma 3707:3568 ("Brochure Dev", 1440), with the
 * whole FV Hospital card in 3707:6041.
 *
 * Every picture is baked at its drawn box, so the box ratio below is the file
 * ratio. Two Figma fills are stretched (the IOGA card image and the Mobile Apps
 * tech panel). The bake keeps their framing at one scale on both axes.
 */

const SLUG = 'software-web-development';
const pic = (name: string, widths: number[], w: number, h: number, alt: string) => ({
  sources: serviceSources(SLUG, name, widths),
  w,
  h,
  alt,
});

// The strip in the drawn order, at the drawn box sizes (3707:6113).
const TOOLS: [string, number, number][] = [
  ['TypeScript', 76.247, 76.247],
  ['Vue.js', 80.88, 69.956],
  ['Kotlin', 66.062, 66.558],
  ['.NET Core', 75.194, 75.194],
  ['Docker', 81.594, 54.131],
  ['NGINX', 87.199, 87.199],
  ['PostgreSQL', 72.711, 74.983],
  ['Amazon DynamoDB', 75.825, 75.825],
  ['AWS', 80.142, 48.023],
  ['Terraform', 82.355, 82.355],
  ['Azure DevOps', 78.353, 78.353],
  ['WordPress', 84.728, 84.817],
  ['jQuery', 89.977, 84.529],
  ['Sass', 83.244, 62.411],
  ['CSS3', 69.892, 69.892],
  ['HTML5', 69.932, 69.932],
  ['PHP', 142.473, 76.876],
];

const tools: ToolLogo[] = TOOLS.map(([alt, w, h], i) => ({ src: serviceAsset(SLUG, `logo-${i + 1}.webp`), alt, w, h }));

const CARD_W = 571;
const CARD_H = 550;
const WORK = [1141, 571];
const TEAM = [428, 856];

const software: ServicePageContent = {
  slug: SLUG,
  name: 'Software & Web Development',
  hero: {
    image: pic(
      'hero',
      [800, 1024],
      1024,
      600,
      'Otter mascots in purple Officience hoodies gather around a laptop in a meeting room, beside a board that reads “Design, Develop, Deploy, Together”.',
    ),
    title: 'Software & Web Development',
    subtitle: 'Build the technology behind your business.',
  },
  rows: [
    {
      title: 'Web Applications',
      tagline: 'Build your high-converting landing page to call for action.',
      tags: ['Responsive', 'UX/UI Design', 'Performance', 'Lead Generation', 'SEO-Optimized'],
      image: pic('row-web', [699, 1398], 699, 467, 'A workshop website with a course banner and an article page.'),
    },
    {
      title: 'Mobile Apps',
      tagline: 'Daily operations, on the go.',
      tags: ['iOS & Android', 'Hybrid', 'Native Experience', 'User Engagement', 'Offline-First'],
      image: pic(
        'row-mobile',
        [707, 1415],
        707.3,
        430.11,
        'The mobile stack (Android, iOS, Ionic, Dart, Swift, Java, Kotlin, Flutter) beside a phone screen of a learning app.',
      ),
    },
    {
      title: 'Saas Platforms',
      tagline: 'Scale your software product to global users with ease.',
      tags: ['Multi-tenancy', 'Subscription', 'Cloud Architecture', 'Scalability', 'Security'],
      image: pic('row-saas', [702, 1404], 702, 439, 'A hand holds a tablet under a SaaS cloud linked to mobile, network and database icons.'),
    },
    {
      title: 'E-Commerce',
      tagline: 'Launch & run your online shop next week.',
      tags: ['Digital Storefront', 'Payment Gateway', 'Checkout Optimization', 'Inventory', 'Conversion'],
      image: pic('row-ecom', [707, 1414], 707, 457, 'Three shop app screens: the catalog, the payment and the order tracking.'),
    },
    {
      title: 'Enterprise Auto',
      tagline: 'Take back 50% of your time with custom tools.',
      tags: ['Connection', 'Workflow', 'Automation', 'Interaction', 'Collaboration'],
      image: pic('row-auto', [659, 1319], 659.285, 432.012, 'A custom invoice tool with its form and summary panel.'),
    },
    {
      title: 'Testing & QA',
      tagline: 'Driven by Automation, Validated for Perfection: Ensuring End-to-End Quality.',
      tags: ['Scenario', 'Automation', 'Completion', 'Regression'],
      image: pic('row-qa', [669, 1338], 669, 418, 'A person in a suit touches a security lock icon linked to network and data icons.'),
    },
  ],
  tools,
  work: [
    {
      image: pic('work-ioga', WORK, CARD_W, CARD_H, 'A woman films herself with a phone on a small tripod.'),
      tags: ['Software Development', 'Mobile App'],
      title: 'IOGA',
    },
    {
      image: pic('work-cmp', WORK, CARD_W, CARD_H, 'The CMP precious-metals site, with a sign-up form over a periodic table.'),
      tags: ['Dashboard', 'WordPress'],
      title: 'CMP',
    },
    {
      image: pic('work-fv', WORK, CARD_W, CARD_H, 'The FV Hospital website, with the hospital building and its accreditation figures.'),
      tags: ['Web App', 'Software Development'],
      title: 'FV HOSPITAL',
    },
  ],
  quotes: [
    {
      quote:
        'Officience has become our main Sharepoint partner and there has not been a single day to regret this decision.',
      author: 'Dr.Jean Marcel Guillon - CEO',
      company: 'FV Hospital',
      avatar: serviceAsset(SLUG, 'quote-guillon.webp'),
    },
    {
      quote: 'I really appreciate the availability of the Officience team, and its responsiveness.',
      author: 'M-A Leurette – Program Director',
      company: 'Orange',
      avatar: serviceAsset(SLUG, 'quote-leurette.webp'),
    },
  ],
  team: {
    title: 'Our Players',
    stat: '20 Members · 26+ Tools & Languages',
    people: [
      { name: 'Thu Nguyen', role: 'IT Business Manager', photo: pic('team-thu', TEAM, 428, 479, 'Thu Nguyen.') },
      { name: 'Tuan Ngo', role: 'Senior Sharepoint and .NET', photo: pic('team-tuan', TEAM, 428, 479, 'Tuan Ngo.') },
      { name: 'Duc Nguyen', role: 'IT Business Analyst', photo: pic('team-duc', TEAM, 428, 479, 'Duc Nguyen.') },
    ],
  },
};

export default software;
