import { workAsset, workSources } from '../../assets';
import crunch from '../services/data-engineering-processing';
import type { Picture, ToolLogo } from '../services/types';
import type { WorkCase } from './types';

/**
 * The IOGA case study — Figma 3770:4574 (the frame is named "Brochure Rizlum"),
 * with three more team members in 3816:8634. The copy is verbatim.
 *
 * Every picture is baked at its drawn box with Figma's own crop and scale, in
 * `assets-src/work-page/ioga/`. The portraits have the Gray/200 ground baked
 * in, as on the service pages.
 *
 * Slips shipped as drawn (adapter section 20):
 * - The back link says "Back to All Brochure".
 * - The third team card has the "ThanhCong" photo with the plate "Cong Chau,
 *   ITs", which is the IT Operations copy. A hidden "Tuan Ngo" plate is not built.
 * - "Discover Other Works" repeats the three Crunch cards. "Ads scraping /
 *   collection" is not a listing project, and it shows the FV Hospital photo.
 */

const pic = (name: string, widths: number[], w: number, h: number, alt: string): Picture => ({
  sources: workSources('ioga', name, widths),
  w,
  h,
  alt,
});

/** A Tech Stack logo at its drawn box. Each file is 3x that box. */
const logo = (file: string, alt: string, w: number, h: number): ToolLogo => ({
  src: workAsset('ioga', `stack/${file}.webp`),
  alt,
  w,
  h,
});

const PORTRAIT = [548, 1096];

const ioga: WorkCase = {
  slug: 'ioga',
  name: 'IOGA',
  hero: {
    image: pic('hero', [800, 1440, 1920], 1440, 840, 'A woman in a yellow sweater smiles as she records herself with a phone on a small tripod.'),
    title: 'IOGA',
    subtitle: 'A B2B video platform pairing AI with human expertise to turn complex content into accessible, on-demand learning.',
    tags: ['SaaS', 'E-Learning Platform'],
    titleWidth: 698,
    subtitleWidth: 645,
  },
  facts: [
    { label: 'Founded', value: '2019' },
    { label: 'Location', value: 'Based in France' },
    { label: 'Industry', value: 'SaaS · E-Learning' },
    { label: 'Market', value: '4,500+ users — \nCorporates & SMEs' },
  ],
  challenge: {
    text: 'As a video platform for sharing knowledge in the B2B space, IOGA is committed to helping businesses capture and leverage their tacit knowledge. By integrating AI with human wisdom, IOGA aims to improve its software, making it ever more robust and value-oriented for clients. With a focus on enhancing performance, delivering accessible content, and creating a seamless user experience, IOGA empowers clients to harness collective intelligence for greater success.',
    chips: ['Tasks automated', 'Mobile UX', 'Crash-free'],
    image: pic(
      'challenge',
      [900, 1536],
      1536,
      1024,
      'The IOGA brochure: "People\'s knowledge for a brighter tomorrow", with the platform screens and the AI and human wisdom diagram.',
    ),
  },
  solution: [
    {
      text:
        'Leveraging the power of AI, ChatGPT was integrated to assist users in auto-generating questions or tables of contents based on use cases, keywords, and more.',
      image: pic('solution-1', [900, 1800], 2048, 1149, 'The IOGA AI Assistant dialog, which asks for a theme, an instruction and a language for a new scenario.'),
    },
    {
      text: "In line with IOGA's vision, users are equipped with full control over video, audio formats, subtitles, 30 language options, and shareable links across both PC and Mobile.",
      image: pic('solution-2', [900, 1800], 2048, 1104, 'The IOGA video editor, with a presenter video, subtitle languages and a transcript.'),
    },
    {
      text: 'With auto-time markers, audiences can find exactly what they need in seconds, and transform complex information into structured and memorable insights.',
      image: pic('solution-3', [900, 1800], 2048, 1095, 'The IOGA publication view, with a video, an audio waveform and a list of time markers.'),
    },
  ],
  impact: [
    { value: '100%', label: 'Fully Remote Training', text: 'Smooth virtual sessions with no crashes or interruptions.' },
    { value: '40%', label: 'Time Saved', text: 'Master the tool in just 6 simple, automated steps.' },
    { value: '50,000H+', label: 'Knowledge Consumed', text: 'Accessible, subtitled video knowledge for learning on the go.' },
  ],
  stack: [
    {
      title: 'Front-end',
      h: 173,
      logos: [
        logo('typescript-191', 'TypeScript', 63.758, 63.758),
        logo('vue-192', 'Vue.js', 64.101, 56.089),
        logo('kotlin-160', 'Kotlin', 53.231, 53.231),
      ],
    },
    {
      title: 'Back-end',
      h: 190,
      logos: [
        logo('dotnet-191', '.NET Core', 63.758, 63.758),
        logo('docker-262', 'Docker', 87.234, 57.872),
        logo('nginx-201', 'NGINX', 67, 76),
        logo('postgresql-166', 'PostgreSQL', 55.264, 56.991),
        logo('database-189', 'Database', 62.991, 62.991),
      ],
    },
    {
      title: 'Infrastructure & DevOps',
      h: 185,
      logos: [
        logo('aws-233', 'Amazon Web Services', 77.815, 46.628),
        logo('terraform-207', 'Terraform', 69.148, 69.148),
        logo('azure-devops-176', 'Azure DevOps', 58.827, 58.827),
      ],
    },
  ],
  // 3816:8585 (Quang, Khoa, Cong) and 3816:8634 (Nhu, Phat, Binh): six people
  // in a two-column grid (ruling 20c). No LinkedIn URLs exist yet (19j).
  team: [
    { name: 'Quang Luu', role: 'PM/Dev', photo: pic('team-quang-luu', PORTRAIT, 428, 479, 'Quang Luu, arms crossed, in a blue polo shirt.') },
    { name: 'Khoa Nguyen', role: 'Android', photo: pic('team-khoa-nguyen', PORTRAIT, 428, 479, 'Khoa Nguyen, arms crossed, in a black T-shirt.') },
    { name: 'Cong Chau', role: 'ITs', photo: pic('team-cong-chau', PORTRAIT, 428, 479, 'A man in a grey polo shirt smiles at the camera.') },
    { name: 'Nhu Nguyen', role: 'Frontend', photo: pic('team-nhu-nguyen', PORTRAIT, 428, 479, 'Nhu Nguyen, with glasses and a black top, smiles at the camera.') },
    { name: 'Phat Vo', role: 'Backend', photo: pic('team-phat-vo', PORTRAIT, 428, 479, 'Phat Vo, with glasses and a black shirt.') },
    { name: 'Binh Giang', role: 'QC', photo: pic('team-binh-giang', PORTRAIT, 428, 479, 'Binh Giang, in a blue and white striped shirt, smiles at the camera.') },
  ],
  quotes: [
    {
      quote: 'We chose IOGA because of its easy UX, video chaptering and transcription.',
      author: 'Guillaume Laurent',
      company: 'Director of Training Professions at Bureau Veritas Group',
      avatar: workAsset('ioga', 'avatar-guillaume-laurent-156.webp'),
    },
    {
      quote: 'IOGA gives us complete satisfaction, particularly in translation, as our group includes speakers of 18 recognized languages.',
      author: 'Ariane Broquet',
      company: 'Knowledge Manager at Colas Groupe',
      avatar: workAsset('ioga', 'avatar-ariane-broquet-156.webp'),
    },
  ],
  // 3816:7878 draws the three Crunch cards, with the same files and crops.
  related: crunch.work ?? [],
};

export default ioga;
