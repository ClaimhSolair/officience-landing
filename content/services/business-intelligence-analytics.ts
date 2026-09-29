import { serviceAsset, serviceSources } from '../../assets';
import type { ServicePageContent, ToolLogo } from './types';

/**
 * Business Intelligence & Analytics — Figma 3707:6222 ("Brochure Data", 1440),
 * with the extra work cards 3707:9184 and 3707:9195. The card 3707:9173
 * duplicates the in-page Ads card, so it is not repeated.
 *
 * Every picture is baked at its drawn box, so the box ratio below is the file
 * ratio. No Figma fill on this page is stretched. The drawn cards are 562.67
 * and 586.67 wide. The bake centres each image in the 570.67 in-page frame.
 */

const SLUG = 'business-intelligence-analytics';
const pic = (name: string, widths: number[], w: number, h: number, alt: string) => ({
  sources: serviceSources(SLUG, name, widths),
  w,
  h,
  alt,
});

// The strip in the drawn order, at the drawn box sizes (3716:11948). It is
// 8,791px wide, so it loops.
const TOOLS: [string, number, number][] = [
  ['MySQL', 123, 123],
  ['Azure Machine Learning', 190, 129],
  ['Google Cloud AI Platform', 66, 57.975],
  ['Vertex AI', 199, 64.114],
  ['Microsoft Excel', 190, 85.162],
  ['MongoDB', 261.002, 87.001],
  ['Dataiku', 238.262, 75],
  ['Power BI', 219.013, 69.146],
  ['Qlik', 155.095, 56.997],
  ['Tableau', 311, 64.403],
  ['Looker', 226, 59.393],
  ['Metabase', 379.887, 149],
  ['Google Data Studio', 289.484, 91.193],
  ['Python', 264.21, 91],
  ['Google BigQuery', 272, 153],
  ['Snowflake', 313.561, 107],
  ['Jupyter', 256.969, 69.382],
  ['scikit-learn', 237.773, 110.214],
  ['TensorFlow', 295.039, 96.426],
  ['MLflow', 219.588, 80.516],
  ['PyTorch', 286.234, 143.117],
  ['OpenAI', 362.68, 107.077],
  ['LangChain', 390.81, 107.852],
  ['n8n', 410.367, 164.147],
  ['Apache Airflow', 330.079, 139],
];

const tools: ToolLogo[] = TOOLS.map(([alt, w, h], i) => ({ src: serviceAsset(SLUG, `logo-${i + 1}.webp`), alt, w, h }));

const ROW = [587, 1174];
const CARD_W = 571;
const CARD_H = 550;
const WORK = [1141, 571];
const TEAM = [428, 856];

const bi: ServicePageContent = {
  slug: SLUG,
  name: 'Business Intelligence & Analytics',
  hero: {
    image: pic(
      'hero',
      [800, 1024],
      1024,
      600,
      'Two otter mascots in red OTTY hoodies laugh at a laptop, below a screen that reads “Data into Impact”.',
    ),
    title: 'Business Intelligence & Analytics',
    subtitle: 'Turn your data into business insights.',
  },
  rows: [
    {
      title: 'Business Intelligence',
      tagline: 'See your business clearly - in real time.',
      tags: ['Dashboards', 'Reporting', 'KPIs', 'Visualization'],
      image: pic('row-bi', ROW, 587, 433, 'Two hands point at the screen of a laptop.'),
    },
    {
      title: 'Data Analytics',
      tagline: 'Find the insights your competitors are missing.',
      tags: ['Exploration', 'Segmentation', 'Trends'],
      image: pic('row-analytics', ROW, 587, 433.02, 'Hands type on a laptop that shows an analytics dashboard, beside a mug.'),
    },
    {
      title: 'Forecasting',
      tagline: 'Stop guessing. Start predicting.',
      tags: ['Scenario', 'Planning', 'Accuracy'],
      image: pic('row-forecast', ROW, 587, 433.02, 'A hand holds a calculator in front of a screen with a market chart.'),
    },
    {
      title: 'AI & Machine Learning',
      tagline: 'Build AI that works for your business, not against it.',
      tags: ['Models', 'Training', 'NLP', 'Fine-tuning', 'Generative AI'],
      image: pic('row-ai', ROW, 587, 433.02, 'A brain drawn as a circuit board above rows of coloured data blocks.'),
    },
    {
      title: 'Auto Solutions',
      tagline: 'Automate repetitive tasks. Focus on what matters.',
      tags: ['Integration', 'Workflow', 'Scheduling'],
      image: pic('row-auto', ROW, 587, 433.02, 'A team in a meeting room looks at a large screen with a business web page.'),
    },
  ],
  tools,
  work: [
    {
      image: pic('work-social', WORK, CARD_W, CARD_H, 'Four young people look at a laptop below social media icons and a sentiment chart.'),
      tags: ['Social Listening', 'Audience Engagement'],
      title: 'Social listening engagement',
    },
    {
      image: pic('work-cost', WORK, CARD_W, CARD_H, 'Three young people at a laptop below a quote, cost monitoring and order flow.'),
      tags: ['Cost Control', 'Process Efficiency'],
      title: 'Cost monitoring quote-to-order',
    },
    {
      image: pic('work-ads', WORK, CARD_W, CARD_H, 'A laptop with an ad collection dashboard, below ads that flow into a database.'),
      tags: ['Ad Intelligence', 'Data Collection'],
      title: 'Ads scraping / collection',
    },
    {
      image: pic('work-benchmark', WORK, CARD_W, CARD_H, 'A laptop and a monitor show a performance overview and a market benchmark.'),
      tags: ['Performance', 'Competitive Insights'],
      title: 'Benchmark dashboard',
    },
    {
      image: pic('work-sales', WORK, CARD_W, CARD_H, 'A laptop shows a sales performance dashboard, beside a sales growth report.'),
      tags: ['Sales Growth', 'Performance Optimization'],
      title: 'Sales performance booster',
    },
  ],
  quotes: [
    {
      quote: 'I am impressed with their response time and engagement.',
      author: 'Raymar Ranin – Telco Sourcing Expert',
      company: 'Orange',
      avatar: serviceAsset(SLUG, 'quote-ranin.webp'),
    },
    {
      quote: 'Outstanding response, design of requested tools on very high level.',
      author: 'Jozef Hrusovsky – Access Pricing Manager',
      company: 'Orange',
      avatar: serviceAsset(SLUG, 'quote-orange.webp'),
    },
    {
      quote:
        'Team is always available and easy to contact. They are always prompt to reply and help. They also take into consideration our suggestions for improvements for the report.',
      author: 'Lydia Taieb – Project Management Officer OBS Sourcing APAC',
      company: 'Orange',
      avatar: serviceAsset(SLUG, 'quote-orange.webp'),
    },
    {
      quote:
        'The team’s commitment is second-to-none and I appreciate their ability to present solutions at the same time as describing a problem – this is exactly what a manager needs to see.',
      author: 'Martin Howarth – Project Owner',
      company: 'Orange',
      avatar: serviceAsset(SLUG, 'quote-orange.webp'),
    },
    {
      quote:
        'Not in daily direct contact with the team, but from my engagement, I find them fully efficient in managing the activity. The quality of work and ideas coming from the team are excellent, well in tune with what we need and what is effectively the best way to monitor.',
      author: 'Parminder Sehra – Project Owner',
      company: 'Orange',
      avatar: serviceAsset(SLUG, 'quote-orange.webp'),
    },
  ],
  team: {
    title: 'Our A Team',
    stat: '38 MEMBERS  ·  85% WOMEN',
    people: [
      { name: 'Quynh Le', role: 'Data Analyst & BA', photo: pic('team-quynh', TEAM, 428, 479, 'Quynh Le.') },
      { name: 'Trinh Le', role: 'Senior BI Consultant', photo: pic('team-trinh', TEAM, 428, 479, 'Trinh Le.') },
      { name: 'Quyen Tran', role: 'Engager & Data Analyst', photo: pic('team-quyen', TEAM, 428, 479, 'Quyen Tran.') },
    ],
  },
};

export default bi;
