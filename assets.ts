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
const ASSET_VERSION = '12';
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
  // The hero's five floating 3D shapes. Delivered by the team as 1080x1080 PNGs
  // (~915kB all told) after Figma proved unable to export them; trimmed to their
  // artwork and re-encoded WebP q88 at 380px, which is 2x the widest slot a 1920
  // hero gives them. They sit above the fold, so the weight matters.
  hero: {
    shapes: {
      leaf: a('/hero/leaf.webp'),
      asterisk: a('/hero/asterisk.webp'),
      ring: a('/hero/ring.webp'),
      star: a('/hero/star.webp'),
      ellipse: a('/hero/ellipse.webp'),
    },
  },
  // Story-card photography. Two independent sets, because the artboards frame
  // these photos differently rather than merely at different sizes — art
  // direction, which srcset cannot express, hence <picture> in AboutUs.
  //
  //   small/large  the 1920 treatment: the whole frame, which the desktop card
  //                stretches into its 1792x860 box. Cards 2 and 3 top out at
  //                1024 and upscale in that box.
  //   mobile       the 390 treatment: Figma zoom-crops each photo 1.4-1.7x past
  //                what object-fit: cover would use and offsets it, so the crop
  //                window is baked into the file at exactly the artboard's box
  //                aspect. Cut from the 3480-4096px originals behind the mobile
  //                fills — far larger than the desktop exports above.
  about: {
    cards: [
      {
        small: a('/about/card-1-900.webp'),
        large: a('/about/card-1-1800.webp'),
        largeWidth: 1800,
        mobile: [
          { url: a('/about/card-1-mobile-800.webp'), w: 800 },
          { url: a('/about/card-1-mobile-1600.webp'), w: 1600 },
        ],
      },
      {
        small: a('/about/card-2-900.webp'),
        large: a('/about/card-2-1024.webp'),
        largeWidth: 1024,
        mobile: [
          { url: a('/about/card-2-mobile-800.webp'), w: 800 },
          { url: a('/about/card-2-mobile-1600.webp'), w: 1600 },
        ],
      },
      {
        small: a('/about/card-3-900.webp'),
        large: a('/about/card-3-1024.webp'),
        largeWidth: 1024,
        mobile: [
          { url: a('/about/card-3-mobile-800.webp'), w: 800 },
          { url: a('/about/card-3-mobile-1600.webp'), w: 1600 },
        ],
      },
    ],
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
  footer: {
    logo: a('/footer/logo.png'),
    banner: a('/footer/banner.png'),
    // Also used by MenuOverlay, which is why the footer reuses these rather
    // than inlining Figma's own footer marks: the two would otherwise draw
    // the same four brands at visibly different sizes on one site.
    facebook: a('/footer/facebook.svg'),
    youtube: a('/footer/youtube.svg'),
    linkedin: a('/footer/linkedin.svg'),
    tiktok: a('/footer/tiktok.svg'),
    /**
     * The "Our friends" tiles. Sizes are the ones the 1920 artboard draws each
     * logo at; 390 draws the same five at 0.8136x, which the footer derives from
     * a single scale rather than restating every pair.
     *
     * These are provisional. Figma's underlying files are named
     * "maxresdefault (3) 1", "Gemini_Generated_Image_…" and "images (9) 1" — a
     * video thumbnail, an AI generation and a stray download — so they are
     * stand-ins, not brand assets. Offinity is worse: it is drawn as six loose
     * vectors rather than one logo, and `offinity.svg` is those six recomposed.
     * All five want originals from the team.
     */
    partners: [
      { name: 'Offinity', url: a('/footer/partners/offinity.svg'), w: 83.15, h: 24.157 },
      { name: 'Officonnect', url: a('/footer/partners/officonnect.webp'), w: 113.235, h: 32.12 },
      // Tight-cropped to the artwork and exported at 3x, unlike its siblings: the
      // only source is a YouTube-thumbnail frame, so Figma's own padded 94x32 image
      // box left the logo at ~2x and reading as blurry. Sized to its siblings'
      // visual weight rather than Figma's noticeably smaller 53%-of-tile placement.
      { name: 'Rizlum', url: a('/footer/partners/rizlum.webp'), w: 105, h: 21.9 },
      { name: 'OpenReal', url: a('/footer/partners/openreal.webp'), w: 90.724, h: 21.645 },
      { name: 'Uniques', url: a('/footer/partners/uniques.webp'), w: 80.099, h: 20.706 },
    ],
  },
};
