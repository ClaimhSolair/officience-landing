// Image origins on Cloudflare R2. Source files live in /assets-src and are
// published with `npm run upload-assets`.
//
//   PRODUCTION — serves every image on officience.com today. READ-ONLY for the
//   Sept-2026 redesign: uploads overwrite objects in place, with no cache
//   header and no deploy gate, so writing here would change the live site.
const R2_PRODUCTION = 'https://pub-37210447316445838bf89f8613ac9ea5.r2.dev';
//   STAGING — receives every Sept-2026 asset. Becomes the production origin at
//   merge (a URL flip, no copy), leaving R2_PRODUCTION intact as the rollback.
const R2_STAGING = 'https://pub-767c5aebf4a841a595fec5daeb08d3b4.r2.dev';

// Seeded with the full /assets-src set on 2026-08-20 and verified reachable, so
// the branch now serves its images from staging. R2_PRODUCTION stays named above
// as the rollback target: reverting this one line restores the live origin.
const R2 = R2_STAGING;

// Cache-busting version. The R2 public dev URL sends no Cache-Control header, so
// browsers cache assets heuristically and serve stale copies after a re-upload.
// Bump ASSET_VERSION whenever you replace an asset in the bucket to force a refetch.
const ASSET_VERSION = '9';
const a = (path: string) => `${R2}${path}?v=${ASSET_VERSION}`;

/** One `srcset` candidate: a URL and the intrinsic width it was encoded at. */
export interface ImageSource {
  url: string;
  w: number;
}

/** One client logo, at the pixel size the 1920 artboard draws it. */
export interface ClientLogo {
  /** Brand name — the image's alt text, so it has to read as the company. */
  name: string;
  url: string;
  w: number;
  h: number;
}

/** `srcset` string from a candidate list, widest last. */
export const srcSetOf = (sources: ImageSource[]) =>
  sources.map((s) => `${s.url} ${s.w}w`).join(', ');

export const ASSETS = {
  header: { logo: a('/header/logo.png') },
  // Exported from Figma 3137:1875 — one path set, all fills #1F49BF, so the
  // petals are knock-outs that show whatever sits behind them.
  brand: { flower: a('/brand/officience-flower.svg') },
  icons: { eyebrow: a('/icons/eyebrow-mark.svg') },
  // Story-card photography, exported from Figma and re-encoded as WebP q80 at
  // two widths. Cards 2 and 3 top out at 1024 because that is all the Figma
  // originals hold — they upscale slightly in a 1792px card.
  about: {
    cards: [
      { small: a('/about/card-1-900.webp'), large: a('/about/card-1-1800.webp'), largeWidth: 1800 },
      { small: a('/about/card-2-900.webp'), large: a('/about/card-2-1024.webp'), largeWidth: 1024 },
      { small: a('/about/card-3-900.webp'), large: a('/about/card-3-1024.webp'), largeWidth: 1024 },
    ],
  },
  hero: {
    iconsRow1: a('/hero/icons-group-1.svg'),
    iconsRow2: a('/hero/icons-group-2.svg'),
  },
  // Proven Results project shots. Each is cropped to the window the artboard
  // actually shows — Figma scales and offsets these fills, so a straight export
  // is mostly off-frame — then re-encoded WebP q80 at the widths the crop can
  // honestly carry. IOGA yields only 419px for a 587px slot; the others are
  // fine at 1x and short of a 2x screen. Originals are on the team's list.
  works: {
    ioga: [{ url: a('/works/ioga-419.webp'), w: 419 }],
    cmp: [
      { url: a('/works/cmp-600.webp'), w: 600 },
      { url: a('/works/cmp-677.webp'), w: 677 },
    ],
    lab: [
      { url: a('/works/lab-600.webp'), w: 600 },
      { url: a('/works/lab-924.webp'), w: 924 },
    ],
    funpass: [
      { url: a('/works/funpass-600.webp'), w: 600 },
      { url: a('/works/funpass-736.webp'), w: 736 },
    ],
  } satisfies Record<string, ImageSource[]>,
  services: {
    design: a('/services/design.svg'),
    software: a('/services/software.svg'),
    data: a('/services/data.svg'),
    bi: a('/services/bi.svg'),
  },
  approach: { mascot: a('/approach/mascot.png') },
  testimonials: {
    quote: a('/testimonials/quote.svg'),
    authors: [
      a('/testimonials/author-1.png'),
      a('/testimonials/author-2.png'),
      a('/testimonials/author-3.png'),
    ],
  },
  /**
   * The client wall, exported from the Figma marquee (3137:2138) at 2x the size
   * each logo is drawn at. Every crop keeps the transparent padding of its Figma
   * frame, so rendering at `w` x `h` reproduces the artboard's optical balance
   * with no per-logo nudging — the marquee only has to scale the pair.
   *
   * Figma lays out twelve tiles, but the twelfth is `saur` a second time, drawn
   * at a different size: the designer showing the loop wrapping, not a twelfth
   * client. The marquee duplicates its own track, so only the eleven real logos
   * live here.
   */
  clients: [
    { name: 'Orange', url: a('/clients/orange.webp'), w: 140.79, h: 140.5 },
    { name: '50inTech', url: a('/clients/50intech.webp'), w: 198.72, h: 78.52 },
    { name: 'Mailjet', url: a('/clients/mailjet.webp'), w: 186.92, h: 87.53 },
    { name: 'ENGIE', url: a('/clients/engie.webp'), w: 177.43, h: 62.95 },
    {
      name: 'Passerelles Numeriques',
      url: a('/clients/passerelles-numeriques.webp'),
      w: 134.66,
      h: 129.88,
    },
    { name: 'Alibaba', url: a('/clients/alibaba.webp'), w: 152.46, h: 84.52 },
    { name: 'Auchan', url: a('/clients/auchan.webp'), w: 227.14, h: 90.24 },
    { name: 'Diana', url: a('/clients/diana.webp'), w: 165.97, h: 110.65 },
    { name: 'b-process', url: a('/clients/b-process.webp'), w: 283.74, h: 88.57 },
    { name: 'saur Guadeloupe', url: a('/clients/saur.webp'), w: 221.58, h: 112.64 },
    { name: 'abaca', url: a('/clients/abaca.webp'), w: 204, h: 79.23 },
  ] satisfies ClientLogo[],
  whyus: { centerIcon: a('/whyus/center-icon.svg') },
  contact: { pin: a('/contact/pin.svg') },
  footer: {
    logo: a('/footer/logo.png'),
    banner: a('/footer/banner.png'),
    facebook: a('/footer/facebook.svg'),
    youtube: a('/footer/youtube.svg'),
    linkedin: a('/footer/linkedin.svg'),
    tiktok: a('/footer/tiktok.svg'),
  },
};
