import { serviceAsset, serviceSources } from '../../assets';
import type { ServicePageContent, ToolLogo } from './types';

/**
 * Trusted AI Platform for Insurance — Figma 3738:3980 ("Brochure Rizlum", 1440),
 * with the extra work cards 3738:4395/4406/4417 and the 4th team card 3739:4505.
 * The page draws no quotes, so the object has no `quotes` key.
 *
 * Every picture is baked at its drawn box, so the box ratio below is the file
 * ratio. The hero file has the drawn navy scrim baked in.
 *
 * The work tag chips look like marketing placeholders ("Social Listening" and
 * the others). They ship as drawn (ruling 19f).
 */

const SLUG = 'trusted-ai-insurance';
const pic = (name: string, widths: number[], w: number, h: number, alt: string) => ({
  sources: serviceSources(SLUG, name, widths),
  w,
  h,
  alt,
});

// The strip in the drawn order, at the drawn box sizes (3738:4067).
const TOOLS: [string, number, number][] = [
  ['Doc Insight', 66, 66],
  ['Voice', 48.875, 48.875],
  ['Call Insight', 52.25, 52.25],
  ['Gmail', 69.333, 52],
  ['Fraud Detection', 85.548, 89.82],
];

const tools: ToolLogo[] = TOOLS.map(([alt, w, h], i) => ({ src: serviceAsset(SLUG, `logo-${i + 1}.webp`), alt, w, h }));

const CARD_W = 571;
const CARD_H = 550;
const WORK = [1141, 571];
const TEAM = [428, 856];

const ai: ServicePageContent = {
  slug: SLUG,
  name: 'Trusted AI Platform for Insurance',
  hero: {
    image: pic('hero', [800, 1920], 1920, 1277, 'The Earth at night from space, with city lights across the dark land.'),
    title: 'Trusted AI Platform for Insurance',
    subtitle:
      'The first 100% on-premise AI platform based on fine-tuned Small Language Models, built specifically for regulated sectors.',
    pill: 'Officience × Rizlum',
    // The drawn text boxes are wider than Software's.
    titleWidth: 850,
    subtitleWidth: 887,
  },
  rows: [
    {
      title: 'On-Premise AI Deployment',
      tagline: 'No external API calls. Your data never leaves your infrastructure.',
      tags: ['Data Sovereignty', 'Client Infrastructure', 'Full Autonomy'],
      image: pic('row-onprem', [529, 1058], 529, 390, 'An AI chip glows in front of server racks in a data centre.'),
    },
    {
      title: 'SLM Learning',
      tagline: 'Train and fine-tune on your own data.',
      tags: ['Training Studio', 'Proprietary Data'],
      image: pic('row-slm', [529, 1058], 529, 353, 'A laptop shows an SLM cube linked to training steps, beside a stack of books.'),
    },
    {
      title: 'Agent Orchestration & No-Code Workflows',
      tagline: 'Build, customize, and connect your agents - no code needed.',
      tags: ['Agent & Workflow Studio'],
      image: pic(
        'row-agents',
        [527, 1053],
        526.5,
        351,
        'Robot agents around a central hub, linked to a no-code workflow panel and app icons.',
      ),
    },
    {
      title: 'Agent Library',
      tagline: 'Specialized agents for every operational need.',
      tags: ['Doc Insight', 'Voice', 'Call Insight', 'Chat', 'Emails', 'Fraud Detection'],
      image: pic('row-library', [525, 1050], 525, 350, 'A screen shows a library of robot agent cards, beside a stack of books.'),
    },
  ],
  tools,
  work: [
    {
      image: pic('work-enroll', WORK, CARD_W, CARD_H, 'Hands type on a laptop keyboard.'),
      tags: ['Social Listening', 'Audience Engagement'],
      title: 'Frictionless enrollment',
    },
    {
      image: pic('work-docs', WORK, CARD_W, CARD_H, 'A person reads a printed document at a desk.'),
      tags: ['Cost Control', 'Process Efficiency'],
      // Figma sets the ellipsis in the text itself (3738:4382). It ships as drawn.
      title: 'Intelligent document proces...',
    },
    {
      image: pic('work-email', WORK, CARD_W, CARD_H, 'Glass office towers seen from below.'),
      tags: ['Ad Intelligence', 'Data Collection'],
      title: 'Email flow management',
    },
    {
      image: pic('work-claims', WORK, CARD_W, CARD_H, 'Model houses, a key and a calculator on a dark table.'),
      tags: ['Ad Intelligence', 'Data Collection'],
      title: 'Claims declaration',
    },
    {
      image: pic('work-crm', WORK, CARD_W, CARD_H, 'A person holds a phone above an open notebook.'),
      tags: ['Performance', 'Competitive Insights'],
      title: 'Augmented customer relations',
    },
    {
      image: pic('work-fraud', WORK, CARD_W, CARD_H, 'Letter tiles spell “Real is rare”.'),
      tags: ['Sales Growth', 'Performance Optimization'],
      title: 'Compliance & anti-fraud',
    },
  ],
  team: {
    title: 'Our Navigators',
    stat: 'Soft power nurture caring',
    people: [
      { name: 'Théo Pham', role: 'CEO — Co-founder', photo: pic('team-theo', TEAM, 428, 479, 'Théo Pham.') },
      {
        name: 'Dang Chuan NGUYEN',
        role: 'CTO — Co-founder',
        photo: pic('team-chuan', TEAM, 428, 479, 'Dang Chuan NGUYEN.'),
      },
      { name: 'Quang Linh LE', role: 'COO — Co-founder', photo: pic('team-linh', TEAM, 428, 479, 'Quang Linh LE.') },
      {
        name: 'Guillaume SARKOZY',
        role: 'Vice-President',
        photo: pic('team-guillaume', TEAM, 428, 479, 'Guillaume SARKOZY.'),
      },
    ],
  },
};

export default ai;
