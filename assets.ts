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
const ASSET_VERSION = '8';
const a = (path: string) => `${R2}${path}?v=${ASSET_VERSION}`;

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
  clients: Array.from({ length: 11 }, (_, i) => a(`/clients/logo-${i + 1}.png`)),
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
