// Redesign assets hosted on the Cloudflare R2 "redesign" bucket.
// Source files live in /assets-src and are uploaded via `npm run upload-assets`.
const R2 = 'https://pub-37210447316445838bf89f8613ac9ea5.r2.dev';

// Cache-busting version. The R2 public dev URL sends no Cache-Control header, so
// browsers cache assets heuristically and serve stale copies after a re-upload.
// Bump ASSET_VERSION whenever you replace an asset in the bucket to force a refetch.
const ASSET_VERSION = '7';
const a = (path: string) => `${R2}${path}?v=${ASSET_VERSION}`;

export const ASSETS = {
  header: { logo: a('/header/logo.png') },
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
  },
};
