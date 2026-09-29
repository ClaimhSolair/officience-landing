import { serviceAsset, serviceSources } from '../../assets';
import type { ServicePageContent, ToolLogo } from './types';

/**
 * Design & Digital Experience — Figma 3494:4864 ("Brochure CT", 1440), with the
 * PN card in 3524:14458.
 *
 * Every picture is baked at its drawn box, so the box ratio below is the file
 * ratio. Four Figma fills are stretched (the Branding leaf photo, the Van and
 * Tien portraits, and the FINPIVOT and Offy card images). The bake keeps their
 * framing at one scale on both axes.
 *
 * The UX/UI and Web Design pictures and the EcoEats card are live Figma layers.
 * These three files are Figma screenshots at 1x.
 *
 * The line under each row title is a note to the designer, so the row has no
 * tagline (user ruling 2026-09-29). The Web Design line is real copy and shows.
 */

const SLUG = 'design-digital';
const pic = (name: string, widths: number[], w: number, h: number, alt: string) => ({
  sources: serviceSources(SLUG, name, widths),
  w,
  h,
  alt,
});

// The strip in the drawn order, at the drawn box sizes (3535:3680).
const TOOLS: [string, number, number][] = [
  ['Adobe Photoshop', 54.451, 53.071],
  ['Adobe Illustrator', 54.451, 53.071],
  ['Adobe After Effects', 54.191, 52.837],
  ['Adobe InDesign', 53.586, 52.4],
  ['Figma', 58.305, 57.829],
  ['Framer', 58.328, 58.328],
  ['Magnific', 58.328, 58.328],
  ['Maze', 149.709, 33.261],
];

const tools: ToolLogo[] = TOOLS.map(([alt, w, h], i) => ({ src: serviceAsset(SLUG, `logo-${i + 1}.webp`), alt, w, h }));

const CARD_W = 571;
const CARD_H = 550;
const WORK = [1141, 571];
const TEAM = [428, 856];

const designDigital: ServicePageContent = {
  slug: SLUG,
  name: 'Design & Digital Experience',
  hero: {
    image: pic(
      'hero',
      [800, 1024],
      1024,
      596,
      'Otter mascots in orange OTTY hoodies laugh around a laptop at a design table, below a mood board and a sign that reads “Better Ideas Together”.',
    ),
    title: 'Design & Digital Experience',
    subtitle: 'Design the look and experience of your brand and digital products.',
    // The drawn text boxes (3494:4151 and 3494:4154).
    titleWidth: 763,
    subtitleWidth: 566,
  },
  rows: [
    {
      // Figma breaks the line after "&".
      title: 'Branding &\nVisual Identity',
      tags: ['Color Palette', 'Illustration', 'Mood Board', 'Logo'],
      image: pic(
        'row-brand',
        [749, 1498],
        749,
        428.895,
        'A brand mood board: a green leaf photo, three colour swatches, logo grid sketches and a printed logo sheet.',
      ),
    },
    {
      title: 'UX/UI Design',
      tags: ['User Research', 'Wireframe', 'Interaction', 'Copywriting', 'Prototype'],
      image: pic(
        'row-uxui',
        [741],
        741,
        420,
        'Two finance dashboard screens, EcoEats phone app screens and EcoEats delivery packaging and signs.',
      ),
    },
    {
      title: 'Web Design',
      tagline: 'Turn your website into your best salesperson.',
      tags: ['Responsive Design', 'Design System', 'Information Architecture - IA', 'Web Performance / Usability'],
      image: pic(
        'row-webdesign',
        [751],
        751,
        464,
        'Page sections of the Passerelles Numériques website: the hero, the news, the objectives and the goals.',
      ),
    },
    {
      title: 'Product Design',
      tags: ['Showcase', 'Typography', 'Banners', 'Retouching'],
      image: pic(
        'row-product',
        [741, 1482],
        741,
        432,
        'Three L’Occitane promotion banners beside two retouched photos of a hotel bedroom.',
      ),
    },
  ],
  tools,
  work: [
    {
      image: pic('work-finpivot', WORK, CARD_W, CARD_H, 'Two Finpivot business cards on a grey ribbed surface.'),
      tags: ['Logo & Branding', 'Dashboard', 'Prototype'],
      title: 'FINPIVOT',
    },
    {
      image: pic('work-ecoeats', [571], CARD_W, CARD_H, 'The EcoEats Delivery logo, with a chef hat, on yellow.'),
      tags: ['Logo & Branding', 'Mobile App'],
      title: 'ECOEATS',
    },
    {
      image: pic('work-offy', WORK, CARD_W, CARD_H, 'A grid of bold red and blue illustrations: a kite, a rooster, a bottle and faces.'),
      tags: ['Branding', 'Illustrator'],
      title: 'Offy Puzzles 2024',
    },
    {
      image: pic('work-pn', WORK, CARD_W, CARD_H, 'The Passerelles Numériques website, with students in a classroom and the “Fight poverty with education” title.'),
      tags: ['Web Design', 'WordPress'],
      title: 'PN',
    },
  ],
  quotes: [
    {
      quote:
        '"We have been working with Officience since 2013 and they have become our best partner for retouching. All our retouching needs are swiftly taken care of despite the time difference with Vietnam, and their retouchers now know exactly what needs to be done with very minimal quality control from them. Taking on new clients, we feel confident including Officience in the retouching process every time."',
      author: 'Bastien LE BOURSICAUD',
      company: 'Abaca',
      avatar: serviceAsset(SLUG, 'quote-boursicaud.webp'),
    },
  ],
  team: {
    statement:
      'A highly synchronized team of talents collaborating seamlessly to elevate your brand’s aesthetics and identity.',
    people: [
      { name: 'Van Duong', role: 'Illustration Design', photo: pic('team-van', TEAM, 428, 479, 'Van Duong.') },
      { name: 'Tien Ho', role: 'Graphic UI/UX Design', photo: pic('team-tien', TEAM, 428, 479, 'Tien Ho.') },
      { name: 'Tuan Dang', role: 'Image eCommerce', photo: pic('team-tuan', TEAM, 428, 479, 'Tuan Dang.') },
    ],
  },
};

export default designDigital;
