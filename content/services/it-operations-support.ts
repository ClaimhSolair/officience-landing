import { serviceAsset, serviceSources } from '../../assets';
import type { ServicePageContent, ToolLogo } from './types';

/**
 * IT Operations & Support — Figma 3716:12297 ("Brochure ITs", 1440), with the
 * visible hero copy 3716:12762 and back button 3716:12768.
 *
 * Every picture is baked at its drawn box, so the box ratio below is the file
 * ratio. Five Figma fills are stretched (two row pictures, the Cassim's Brother
 * card image and two team portraits). The bake removes the stretch at one
 * scale on both axes. The page draws no quotes, so the object has no `quotes`.
 */

const SLUG = 'it-operations-support';
const pic = (name: string, widths: number[], w: number, h: number, alt: string) => ({
  sources: serviceSources(SLUG, name, widths),
  w,
  h,
  alt,
});

// The strip in the drawn order, at the drawn box sizes (3881:4451).
const TOOLS: [string, number, number][] = [
  ['Zabbix', 133, 34.757],
  ['Grafana', 130.314, 49.998],
  ['Prometheus', 196.375, 59.508],
  ['Nagios', 154.839, 75],
  ['Istio', 109.792, 75.998],
  ['Docker', 109.765, 72.82],
  ['Kubernetes', 110.458, 105.695],
  ['Windows', 85.87, 76],
  ['Linux', 190.301, 105],
  ['UNIX', 141.57, 129.548],
  ['NGINX', 87.199, 87.199],
  ['Apache Tomcat', 193.195, 117.411],
  ['IIS', 216.112, 117.173],
  ['Apache Maven', 168.906, 168.906],
  ['Jenkins', 242.828, 242.828],
  ['GitLab', 194.169, 175.987],
  ['Ansible', 171.781, 171.781],
  ['Terraform', 126.598, 126.598],
  ['Google Cloud', 467.758, 128.284],
  ['OVHcloud', 381.484, 131.424],
  ['Microsoft Azure', 111.17, 111.17],
  ['AWS', 135.6, 81.172],
  ['Amazon Bedrock', 245.606, 182.053],
];

const tools: ToolLogo[] = TOOLS.map(([alt, w, h], i) => ({ src: serviceAsset(SLUG, `logo-${i + 1}.webp`), alt, w, h }));

const ROW = [587, 1174];
const CARD_W = 571;
const CARD_H = 550;
const WORK = [1141, 571];
const TEAM = [428, 856];

const itOps: ServicePageContent = {
  slug: SLUG,
  name: 'IT Operations & Support',
  hero: {
    image: pic(
      'hero',
      [800, 1024],
      1024,
      600,
      'Otter mascots in blue Officience hoodies repair a computer in an office, beside a screen that reads “Installing Tools…”.',
    ),
    // Figma breaks the line after "Operations".
    title: 'IT Operations\n& Support',
    subtitle: 'Keep your systems stable, secure, and always running.',
    // The drawn subtitle box (3716:12767).
    subtitleWidth: 566,
  },
  rows: [
    {
      title: 'System Monitoring & Supervision',
      tagline: 'Real-time visibility across your systems.',
      tags: ['Monitoring', 'Alerting', 'High Availability', 'Orchestration', 'Surveillance'],
      image: pic('row-monitor', ROW, 587, 433, 'A technician checks a server rack with a handheld network tester.'),
    },
    {
      title: 'Technical Support & Helpdesk',
      tagline: 'Instant support to keep your operations smooth.',
      tags: ['Operating System', 'Networking', 'Proxy & Caching', 'OS Concepts', 'Connectivity'],
      image: pic('row-helpdesk', ROW, 587, 433.02, 'A man in glasses repairs the inside of a computer.'),
    },
    {
      title: 'Infrastructure Management',
      tagline: 'Enterprise-grade infrastructure, built for absolute reliability and scale.',
      tags: ['CI/CD', 'Infra as Code', 'Cloud', 'Security', 'Redundancy'],
      image: pic('row-infra', ROW, 587, 436, 'A long aisle of server racks in a data center.'),
    },
    {
      title: 'Service Continuity & Maintenance',
      tagline: 'We back you up, always.',
      tags: ['Backup', 'High Availability', 'Firewalls', 'Redundancy', 'Data Center'],
      image: pic('row-continuity', ROW, 587, 433.02, 'A technician in a safety vest works on equipment with tools on the floor.'),
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
  team: {
    title: 'Our Team',
    people: [
      {
        name: 'Linh Ngo',
        role: 'Cloud & Systems Engineer Linux & Windows Expert DevOps & Security & Monitoring Specialist',
        photo: pic('team-linh', TEAM, 428, 479, 'Linh Ngo.'),
      },
      { name: 'Tuan Nho', role: 'Senior Sharepoint and .NET', photo: pic('team-tuan', TEAM, 428, 479, 'Tuan Nho.') },
      { name: 'Cong Chau', role: 'ITs', photo: pic('team-cong', TEAM, 428, 479, 'Cong Chau.') },
    ],
  },
};

export default itOps;
