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
const ASSET_VERSION = '23';
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

/**
 * A file of the Services pages, from `assets-src/services/<slug>/`. The page
 * content files (`content/services/*.ts`) build their own URLs with these two
 * helpers, so the seven pages do not all live in this file.
 */
export const serviceAsset = (slug: string, file: string) => a(`/services/${slug}/${file}`);

/** One service picture at several widths (`<name>-<w>.webp`), narrowest first. */
export const serviceSources = (slug: string, name: string, widths: number[]): ImageSource[] =>
  [...widths].sort((x, y) => x - y).map((w) => ({ url: serviceAsset(slug, `${name}-${w}.webp`), w }));

/**
 * A file of the Career pages, from `assets-src/career/`. Each picture is baked
 * at the box aspect that Figma draws, so `object-fit` has no effect in CSS.
 */
export const careerAsset = (file: string) => a(`/career/${file}`);

/** One Career picture at several widths (`<name>-<w>.webp`), narrowest first. */
export const careerSources = (name: string, widths: number[]): ImageSource[] =>
  [...widths].sort((x, y) => x - y).map((w) => ({ url: careerAsset(`${name}-${w}.webp`), w }));

/**
 * A file of the Work pages, from `assets-src/work-page/<dir>/`. The `dir` is
 * `listing` for the Work listing and the slug for a case study. This is not
 * `works/`, which the home page's Proven Results uses.
 */
export const workAsset = (dir: string, file: string) => a(`/work-page/${dir}/${file}`);

/** One Work picture at several widths (`<name>-<w>.webp`), narrowest first. */
export const workSources = (dir: string, name: string, widths: number[]): ImageSource[] =>
  [...widths].sort((x, y) => x - y).map((w) => ({ url: workAsset(dir, `${name}-${w}.webp`), w }));

/**
 * One photo of a marquee row. `w` x `h` is the file's own ratio, and the tile
 * box takes that ratio, so no tile crops or stretches at any height.
 */
export interface PhotoTile {
  url: string;
  sources: ImageSource[];
  w: number;
  h: number;
  alt: string;
}

/**
 * A story-page marquee tile. Each file exists at 480 and 922 tall: two times
 * the 240px mobile row and the 461px desktop row.
 */
const storyTile = (dir: string, name: string, w480: number, w922: number, alt: string): PhotoTile => {
  const sources = [
    { url: a(`/about-page/diy-story/${dir}/${name}-h480.webp`), w: w480 },
    { url: a(`/about-page/diy-story/${dir}/${name}-h922.webp`), w: w922 },
  ];
  return { url: sources[1].url, sources, w: w922, h: 922, alt };
};

/** A Round 1 column tile: Figma's 272x459 crop, at 1x and 2x. */
const roundTile = (name: string, alt: string): PhotoTile => {
  const sources = [272, 544].map((w) => ({ url: a(`/about-page/diy-story/round-1-cols/${name}-w${w}.webp`), w }));
  return { url: sources[1].url, sources, w: 272, h: 459, alt };
};

export const ASSETS = {
  header: { logo: a('/header/logo.png') },
  // Exported from Figma 3137:1875 — one path set, all fills #1F49BF, so the
  // petals are knock-outs that show whatever sits behind them.
  brand: { flower: a('/brand/officience-flower.svg') },
  icons: { eyebrow: a('/icons/eyebrow-mark.svg') },
  // The five 3D shapes of the hero, Figma 4285:7878 (adapter 27a). Figma crops,
  // flips and turns each 1080px source in its frame. Each file has that result
  // baked in at the outer box of its node, at 3x the 1440 size, so the CSS only
  // places a plain image. The old files in /hero/ are not turned, so they do not
  // agree with this frame. WebP q88 with alpha.
  hero: {
    shapes: {
      leaf: { url: a('/home/shapes/leaf.webp'), w: 561, h: 594 },
      asterisk: { url: a('/home/shapes/asterisk.webp'), w: 520, h: 525 },
      ring: { url: a('/home/shapes/ring.webp'), w: 609, h: 618 },
      star: { url: a('/home/shapes/star.webp'), w: 573, h: 562 },
      ellipse: { url: a('/home/shapes/ellipse.webp'), w: 545, h: 540 },
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
        // Card 1 is the exception to the "whole frame" rule above. Figma 3137:1917
        // zoom-crops the photo (image 142.42% x 178.21% of the box, at -20.23% /
        // -64.38%). The crop window (494,707) 2443x1098 of the 3480x1957 original
        // is baked into the file at the 1792/860 box aspect, with Figma's 0.936
        // horizontal squeeze, so object-fill is a no-op (drift 2026-10-12, #1).
        small: a('/about/card-1-lg-1144.webp'),
        smallWidth: 1144,
        large: a('/about/card-1-lg-2288.webp'),
        largeWidth: 2288,
        mobile: [
          { url: a('/about/card-1-mobile-800.webp'), w: 800 },
          { url: a('/about/card-1-mobile-1600.webp'), w: 1600 },
        ],
      },
      {
        small: a('/about/card-2-900.webp'),
        smallWidth: 900,
        large: a('/about/card-2-1024.webp'),
        largeWidth: 1024,
        mobile: [
          { url: a('/about/card-2-mobile-800.webp'), w: 800 },
          { url: a('/about/card-2-mobile-1600.webp'), w: 1600 },
        ],
      },
      {
        small: a('/about/card-3-900.webp'),
        smallWidth: 900,
        large: a('/about/card-3-1024.webp'),
        largeWidth: 1024,
        mobile: [
          { url: a('/about/card-3-mobile-800.webp'), w: 800 },
          { url: a('/about/card-3-mobile-1600.webp'), w: 1600 },
        ],
      },
    ],
  },
  /**
   * The About Us **page** (Figma 3133:4423). Its own namespace, because
   * `about` above belongs to the home page's story cards and the two sets are
   * unrelated. Source folder: assets-src/about-page.
   */
  aboutPage: {
    // The 2006 team photo, as the team made it for Figma 3779:5758 (user,
    // 2026-09-24): Figma's own 1980x1080 render of that frame. It is the old
    // 1024x768 photo widened 1.375x, with the dark scrim in the pixels, so the
    // hero draws no scrim of its own. Its detail is the 1024px source's, so the
    // 1980 file is soft at 1920; the camera original is on the team's list.
    hero: [
      { url: a('/about-page/hero-2006-800.webp'), w: 800 },
      { url: a('/about-page/hero-2006-1280.webp'), w: 1280 },
      { url: a('/about-page/hero-2006-1980.webp'), w: 1980 },
    ],
    /**
     * Our Journey. Figma scales and offsets every one of these fills past what
     * object-fit would use, and each crop differs — 1.10x on 2006 against 2.18x
     * on 2011. CSS cannot express that, so **each crop is baked into the file at
     * its box aspect** (361x262 for a single, 180x262 for one half of a pair),
     * which makes `object-cover` a no-op and stops CSS distorting anything.
     *
     * Every file carries 2x its displayed size except `y2012`, whose source is
     * 1244x794 and whose crop leaves only 607px for a 722px slot — 1.68x. That
     * one original is on the team's list.
     */
    journey: {
      y2006: a('/about-page/journey/2006.webp'),
      y2010: a('/about-page/journey/2010.webp'),
      y2011: a('/about-page/journey/2011.webp'),
      y2012: a('/about-page/journey/2012.webp'),
      y2013: a('/about-page/journey/2013.webp'),
      y2015a: a('/about-page/journey/2015-a.webp'),
      y2015b: a('/about-page/journey/2015-b.webp'),
      y2016: a('/about-page/journey/2016.webp'),
      y2017a: a('/about-page/journey/2017-a.webp'),
      y2017b: a('/about-page/journey/2017-b.webp'),
      y2025a: a('/about-page/journey/2025-a.webp'),
      y2025b: a('/about-page/journey/2025-b.webp'),
      y2026: a('/about-page/journey/2026.webp'),
    },
    // The 869px flower watermark behind the timeline, drawn at 4% opacity. It
    // belongs to the section, not the track, so it does not scroll with it.
    journeyWatermark: a('/about-page/journey-watermark.svg'),
    // The Our Values marks are inline in components/about/ValueMarks.tsx. Each
    // one is a flat vector under 2 kB, so a request per mark costs more than it
    // saves.
    // DIY Jam. The user's file (2026-09-30) is 856x711, the Figma box of
    // 3133:4525 at 1x. The box takes the same ratio, so the whole photo shows.
    // It is 1x only, so it upscales where the box is wider than 856px.
    diyJam: a('/about-page/diy-jam-856.webp'),
    /**
     * Our Team portraits, from Figma 3214:4405 and 3214:4430 (2026-09-24).
     * Each source is a cut-out with a soft alpha edge. The bake puts it on its
     * drawn ground (white, and #ECF4FF for Duc) with alpha blending, then bakes
     * the frame's two nested transforms into the file at the card's box aspect,
     * so `object-cover` has no effect. The earlier files had a hard, jagged
     * edge, because a flood-fill turned their black ground white. All seven
     * carry 2x.
     */
    team: {
      ducHaDuong: a('/about-page/team/duc-ha-duong.webp'),
      duongCaoPhuong: a('/about-page/team/duong-cao-phuong.webp'),
      aiDuyen: a('/about-page/team/ai-duyen.webp'),
      thienVi: a('/about-page/team/thien-vi.webp'),
      thuyDung: a('/about-page/team/thuy-dung.webp'),
      bachTrinh: a('/about-page/team/bach-trinh.webp'),
      minhQuyen: a('/about-page/team/minh-quyen.webp'),
    },
    /**
     * The anniversary banner in Our Working Life. Figma composes it from layers
     * rather than shipping one picture: a blue ground, two photo-grid textures
     * at 38% on `mix-blend-overlay`, the vertical logo, the "20th" mark, and two
     * lines of live text. It is rebuilt the same way, so the type stays crisp
     * and selectable at any width.
     *
     * Both textures are 1024x417 for a 929px box — 1.10x. They carry a 38%
     * overlay, so the softness does not show.
     */
    banner: {
      gridTop: a('/about-page/banner/grid-top.webp'),
      gridBottom: a('/about-page/banner/grid-bottom.webp'),
      logoMark: a('/about-page/banner/logo-mark.svg'),
      logoWord: a('/about-page/banner/logo-word.svg'),
      twentieth: a('/about-page/banner/twentieth.svg'),
    },
    /**
     * The Our Working Life story photos (Figma 4047:8972, 4047:8973, 4047:8986).
     * Each file is baked at the 836:542 photo box, which is the banner's ratio.
     * Virtual Race and Offy Friday are Figma's cover crops. The Real Secret has
     * no object-fit in Figma, so Figma stretches its 3:2 file 1.03x into the box,
     * and the bake does the same. Each icon is a flat #F7F7F7 mark.
     */
    workingLife: {
      virtualRace: [960, 1920].map((w) => ({ url: a(`/about-page/working-life/virtual-race-${w}.webp`), w })),
      offyFriday: [960, 1672].map((w) => ({ url: a(`/about-page/working-life/offy-friday-${w}.webp`), w })),
      realSecret: [960, 1024].map((w) => ({ url: a(`/about-page/working-life/real-secret-${w}.webp`), w })),
      linkedin: a('/about-page/working-life/linkedin.svg'),
      facebook: a('/about-page/working-life/facebook.svg'),
      youtube: a('/about-page/working-life/youtube.svg'),
    },
    /**
     * The DIY Jam story page (Figma 3830:8872). Source folder:
     * assets-src/about-page/diy-story.
     *  - `top`: the whole photo at its own 1024x683 (3:2), the only size the
     *    team gave. It upscales in a 1392-1792px box, and the original is on
     *    the team's list.
     *  - `sparks`: Figma's crop (1117:593) of a 4096px frame, baked in.
     *  - `finale`: the Grand Finale poster, 16:9 into a 16:9 box.
     *  - `round1`: the two vertical columns of Figma 4047:9480 (2026-09-30), in
     *    the frame's top-to-bottom order. Each tile is Figma's crop of a 4096px
     *    3:2 frame into a 272x459 box, baked in at 1x and 2x.
     *  - `celebrating`: the marquee row, in the frame's order (3842:15420).
     */
    diyStory: {
      top: a('/about-page/diy-story/top-1024.webp'),
      sparks: [
        { url: a('/about-page/diy-story/sparks-1117.webp'), w: 1117 },
        { url: a('/about-page/diy-story/sparks-2234.webp'), w: 2234 },
      ],
      finale: [
        { url: a('/about-page/diy-story/finale-1117.webp'), w: 1117 },
        { url: a('/about-page/diy-story/finale-2234.webp'), w: 2234 },
      ],
      round1: {
        left: [
          roundTile('bi8a6049', 'A team sets up its laptops at the presenters’ table.'),
          roundTile('bi8a6037', 'A presenter explains the context of his project.'),
          roundTile('bi8a6080', 'A presenter takes the room through the pain points.'),
          roundTile('bi8a5872', 'A presenter pitches a translation tool for the marketing team.'),
          roundTile('bi8a5805', 'A presenter explains the timesheet problem beside her slides.'),
          roundTile('bi8a5713', 'A presenter shows her team’s challenge to the room.'),
          roundTile('bi8a5549', 'Coffee and tea for the break.'),
        ],
        right: [
          roundTile('bi8a6063', 'The audience listens to a Round 1 pitch.'),
          roundTile('bi8a5671', 'A presenter demonstrates a chatbot for business.'),
          roundTile('bi8a5842', 'A presenter pitches a productivity tool on stage.'),
          roundTile('bi8a5577', 'Two hosts open Round 1 on stage.'),
          roundTile('bi8a5767', 'Two participants ask a question from the floor.'),
          roundTile('bi8a5974', 'A judge asks a question at the judges’ table.'),
          roundTile('bi8a5545', 'Fruit trays for the break.'),
        ],
      },
      celebrating: [
        storyTile('celebrating', 'nyp128', 853, 1639, 'A winning team holds its certificate and trophy on stage.'),
        storyTile('celebrating', 'nyp130', 853, 1639, 'The Second Prize winners on stage.'),
        storyTile('celebrating', 'nyp132', 853, 1639, 'A prize-winning team shows its certificates on stage.'),
        storyTile('celebrating', 'nyp135', 853, 1639, 'A team receives its certificates on stage.'),
        storyTile('celebrating', 'nyp126', 853, 1639, 'The participants on stage with their certificates.'),
      ],
    },
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
  // The home page of frame 4229:4651 (adapter 27). Each file is baked at the box
  // aspect that Figma draws, so `object-fit` has no effect in CSS.
  home: {
    // The 1440x595 band of 4291:12606, cut from the 4096x2731 original.
    team: [768, 1440, 2160, 2880].map((w) => ({ url: a(`/home/team-${w}.webp`), w })),
    // The 640x360 image boxes of the Client Spotlights cards (track 4483:6462,
    // 2026-10-16). The v2 files are new keys, so they need no ASSET_VERSION bump.
    stories: {
      ioga: [640, 1280].map((w) => ({ url: a(`/home/stories/ioga-v2-${w}.webp`), w })),
      cmp: [640, 1280].map((w) => ({ url: a(`/home/stories/cmp-v2-${w}.webp`), w })),
      lab: [640, 1280].map((w) => ({ url: a(`/home/stories/lab-v2-${w}.webp`), w })),
    },
  },
  testimonials: {
    // 192px WebP, cut from the Figma originals of 4469:5931 (2026-10-16). The
    // largest circle is 64 at 1440 and 85 at fhd, so 192 covers 2x. These are
    // new keys, so they need no ASSET_VERSION bump.
    people: {
      guillon: a('/testimonials/author-guillon-192.webp'),
      leurette: a('/testimonials/author-leurette-192.webp'),
      lemaire: a('/testimonials/author-lemaire-192.webp'),
      bastien: a('/testimonials/author-bastien-192.webp'),
      adrien: a('/testimonials/author-adrien-192.webp'),
    },
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
      // box left the logo at ~2x and reading as blurry. The design team found the
      // earlier 105x21.9 too large (tracker row 24). Figma's 73x15.2 still drew the
      // letters about 10% larger than the other logos: cap R 12.5 against
      // OpenReal's 11.25, x-height 9.5 against 8.9 (measured at 1440). So the box
      // is 0.92 of Figma's, which matches the OpenReal and Uniques letters (user,
      // 2026-10-13).
      { name: 'Rizlum', url: a('/footer/partners/rizlum.webp'), w: 67.16, h: 13.98 },
      // Figma 3151:2562 draws the image box 80 x 19.09 (drift 2026-10-12, #15).
      { name: 'OpenReal', url: a('/footer/partners/openreal.webp'), w: 80, h: 19.087 },
      { name: 'Uniques', url: a('/footer/partners/uniques.webp'), w: 80.099, h: 20.706 },
    ],
  },
};
