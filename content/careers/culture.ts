import { careerAsset, careerSources, type ImageSource } from '../../assets';

/**
 * The copy and the pictures of the Career hub's "Our Culture" (3321:2570) and
 * Benefits (3387:3287) sections, verbatim from Figma.
 */

export interface CultureCard {
  title: string;
  body: string;
  /** The caption band's fill (System Colors). */
  band: string;
  photo: { sources: ImageSource[]; alt: string };
}

export const CULTURE_CARDS: CultureCard[] = [
  {
    title: 'Embrace Your Unique Journey',
    body: 'We welcome everyone — Come as you are, and grow in a workplace that truly supports you.',
    band: 'bg-green-200',
    photo: {
      sources: careerSources('culture-1', [800, 1022]),
      alt: 'Colleagues gather round a low table with a plant, laughing as they look at something together.',
    },
  },
  {
    title: 'Let’s Grow Together',
    body: "We learn from each other every day. Wherever you are in your career, there's always room to grow.",
    band: 'bg-pri-100',
    photo: {
      sources: careerSources('culture-2', [800, 1024]),
      alt: 'A large group of Officience staff holding certificates at an event, under an "Offies’" banner.',
    },
  },
  {
    title: 'You Plan Your Agenda',
    body: 'We trust you to manage your own schedule. Just align with your team, and take charge of your work',
    band: 'bg-dpink-100',
    photo: {
      sources: careerSources('culture-3', [800, 1392]),
      alt: 'An open office with desks and screens, with otter mascot cut-outs standing between the desks.',
    },
  },
];

export interface BenefitGroup {
  title: string;
  items: string[];
  /** Tile fill. */
  bg: string;
  /** Bullet dot colour. */
  dot: string;
  /** The corner illustration and its drawn box inside the 447x367 tile. */
  art: { src: string; left: number; top: number; w: number; h: number; rotate?: number };
}

export const BENEFITS: Record<'essential' | 'health' | 'worklife' | 'learning', BenefitGroup> = {
  essential: {
    title: 'Essential Benefits:',
    items: ['Social Insurance', '13th-month salary bonus', 'Continuous review', 'Paid time off'],
    bg: 'bg-pri-50',
    dot: 'bg-[#2D6DE0]',
    art: { src: careerAsset('ill-money.svg'), left: 332.28, top: 8.86, w: 164, h: 187 },
  },
  health: {
    title: 'Health and Welfare',
    items: ['Annual Health Check', 'PVI Insurance', 'Sports budget', 'Gifts and vouchers'],
    bg: 'bg-[#FFF1F3]',
    dot: 'bg-[#EF6880]',
    art: { src: careerAsset('ill-heart.svg'), left: 292.93, top: 12, w: 203.41, h: 183.25 },
  },
  worklife: {
    title: 'Work-life harmony',
    items: ['Equipment policy', 'Hybrid workspace', 'Flexible hours', 'Team parties'],
    bg: 'bg-[#DDF9EC]',
    dot: 'bg-[#22B573]',
    art: { src: careerAsset('ill-umbrella.svg'), left: 315.81, top: 5.6, w: 156.39, h: 162.3 },
  },
  learning: {
    title: 'Learning & Development',
    items: ['Peer-learning', 'Online courses', 'Trainings', 'Sponsoring'],
    bg: 'bg-[#FFF1E0]',
    dot: 'bg-[#FD941D]',
    art: { src: careerAsset('ill-book.svg'), left: 327.55, top: 3.83, w: 173.39, h: 133.29, rotate: -23.43 },
  },
};

const photo = (name: string, widths: number[], alt: string) => ({ sources: careerSources(name, widths), alt });

export const BENEFIT_PHOTOS = {
  a: photo('benefit-a', [447, 894], 'Three managers pour champagne into glasses at a company celebration.'),
  b: photo('benefit-b', [447, 894], 'A team in bright T-shirts raise their arms at an outdoor team-building day.'),
  c: photo('benefit-c', [447], 'A badminton club poses on a court after a game.'),
  wide: photo('benefit-wide', [918], 'A speaker presents to a seated audience in a hall with an "Our causes at heart" wall.'),
};
