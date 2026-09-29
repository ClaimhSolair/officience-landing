import { serviceAsset, serviceSources } from '../../assets';
import type { ServicePageContent, ToolLogo } from './types';

/**
 * Data Engineering & Processing — Figma 3716:11412 ("Brochure Crunch", 1440).
 *
 * Every picture is baked at its drawn box, so the box ratio below is the file
 * ratio. Two Figma fills are stretched (the Business Support picture and the
 * Cassim's Brother card image). The bake keeps their framing at one scale on
 * both axes.
 */

const SLUG = 'data-engineering-processing';
const pic = (name: string, widths: number[], w: number, h: number, alt: string) => ({
  sources: serviceSources(SLUG, name, widths),
  w,
  h,
  alt,
});

// The strip in the drawn order, at the drawn box sizes (3716:12067).
const TOOLS: [string, number, number][] = [
  ['Microsoft Office', 166.49, 67.983],
  ['Google Workspace', 304.977, 90.731],
  ['PyTorch', 149.766, 74.883],
  ['PostgreSQL', 72.711, 74.983],
  ['MySQL', 75.27, 75.27],
  ['Jira', 151.295, 74],
  ['Slack', 223.651, 69.55],
  ['PHP', 142.473, 76.876],
  ['Zendesk', 122.119, 124.027],
  ['HubSpot', 228.174, 128],
  ['Salesforce', 164.347, 115],
];

const tools: ToolLogo[] = TOOLS.map(([alt, w, h], i) => ({ src: serviceAsset(SLUG, `logo-${i + 1}.webp`), alt, w, h }));

const ROW = [587, 1174];
const CARD_W = 571;
const CARD_H = 550;
const WORK = [1141, 571];
const TEAM = [428, 856];

const crunch: ServicePageContent = {
  slug: SLUG,
  name: 'Data Engineering & Processing',
  hero: {
    image: pic(
      'hero',
      [800, 1024],
      1024,
      599,
      'Otter mascots in green Officience hoodies work at a desk in an office, beside a screen that reads “Data Engineering & Processing”.',
    ),
    title: 'Data Engineering & Processing',
    subtitle: 'Manage and process data to support your business operations.',
    // The drawn subtitle box (3716:11421).
    subtitleWidth: 566,
  },
  rows: [
    {
      title: 'Data Entry',
      tagline: 'High-volume capture, image processing & QC.',
      tags: ['OCR', 'NLP', 'Rubberband', 'Double', 'key QC', 'Multi-checkpoints'],
      image: pic('row-entry', ROW, 587, 433, 'A hand points a pen at charts on a laptop screen.'),
    },
    {
      title: 'Data Collect',
      tagline: 'Large-scale crawling and collection for structured datasets.',
      tags: ['Screen', 'Web scrape/crawl', 'Sourcing', 'Filter/qualify', 'Enrich'],
      image: pic('row-collect', ROW, 587, 433.02, 'People type on laptops at a long desk, with a mug in front.'),
    },
    {
      title: 'Data Process',
      tagline: 'Preparation, conversion, labelling and analysis in structured workflows.',
      tags: ['Label', 'ETL', 'Data mining', 'Structure', 'Identify', 'Report'],
      image: pic('row-process', ROW, 587, 433.02, 'A hand draws a flow chart in red marker on a whiteboard.'),
    },
    {
      title: 'Business Support',
      tagline: 'Dedicated operational support embedded in daily client processes.',
      tags: ['Help desk', 'Customer support', 'Daily admin', 'Transfer'],
      image: pic('row-support', ROW, 587, 433.02, 'Hands arrange sticky notes on a table during a planning session.'),
    },
  ],
  tools,
  work: [
    {
      image: pic('work-funpass', WORK, CARD_W, CARD_H, 'Young people dance and cheer at an outdoor festival.'),
      tags: ['Data Collection', 'Operation Support'],
      title: 'FunPass',
    },
    {
      image: pic('work-cassim', WORK, CARD_W, CARD_H, 'A large indoor market hall with rows of stalls under an arched roof.'),
      tags: ['Dashboard', 'WordPress'],
      title: "Cassim's Brother",
    },
    {
      image: pic('work-ads', WORK, CARD_W, CARD_H, 'The FV Hospital website, with the hospital building and its accreditation figures.'),
      tags: ['Web App', 'Illustrator'],
      title: 'Ads scraping / collection',
    },
  ],
  quotes: [
    {
      quote: 'Crunch definitely helps us face the data challenges ahead.',
      author: 'Daniel Walker',
      company: 'Vendor Manager:',
      avatar: serviceAsset(SLUG, 'quote-walker.webp'),
    },
  ],
  team: {
    title: 'Our Bamboo team',
    stat: '150+ MEMBERS  ·  YOUNG & ENGAGING   ·  Certified By Documation',
    people: [
      { name: 'Quynh Le', role: 'Data Analyst & BA', photo: pic('team-quynh', TEAM, 428, 479, 'Quynh Le.') },
      { name: 'Trinh Le', role: 'Senior BI Consultant', photo: pic('team-trinh', TEAM, 428, 479, 'Trinh Le.') },
      { name: 'Quyen Tran', role: 'Engager & Data Analyst', photo: pic('team-quyen', TEAM, 428, 479, 'Quyen Tran.') },
    ],
  },
};

export default crunch;
