# Figma adapter — Officience landing page (Sept-2026 redesign)

Project instance for the `figma-to-code` skill. Everything project-specific the skill needs lives here.

## Figma

- File key: `cplHg0LeeRaYKPdvSJK37E` ("Officience.com 2026") — MCP server: `http://127.0.0.1:3845/mcp`
- URL `node-id=3129-3829` → tool format `3129:3829` (dash → colon).
- `get_design_context` times out on any sizeable subtree, but **works on small leaf
  nodes** — and that is how assets come out of this file (see below). For structure
  and values use `get_metadata` (exact geometry) + `get_variable_defs` (bound tokens:
  type styles, colours, spacing, radii) + `get_screenshot`; the variable dump is more
  authoritative than generated code anyway.
- On a container node `get_design_context` often returns the wrapper with its children
  elided — still useful, because the wrapper carries the auto-layout gap (e.g. the
  header lockup came back as `flex gap-[12.069px] items-center`). Drill to the leaf
  for the asset itself.
- In a `Font(...)` descriptor the `style:` field is unreliable — Display-xl reads
  `style: Regular` while its bound `weight:` is Bold/700. **Trust `weight:`.**

### Sept-2026 node map

- `3129:3829` — homepage, 1920 artboard (1920×13956). Fully enumerates; primary structural reference.
- `3137:2277` — homepage, 390 artboard (390×9116). Fully enumerates; source of every mobile value.
- `3129:3082` — homepage, 1440 artboard. Screenshot works, **children do not enumerate** (file quirk). Use 1920/390 plus per-section nodes.
- Per-section (1920): Header `3137:1822` · hero `3144:3189` · flower `3137:1873` · About `3144:3187` · Services `3137:1931` · Approach `3144:3723` · Proven Results `3137:2069` · Client Review `3151:2378` · Logo Slide `3137:2138` · Why Us `3151:2667` · Contact+Footer `3151:2398`
- Overlay menu `3275:2328` · headline/hero 1440 `3396:3227` · Proven Results expanded state `2943:1579`
- Survey set `2822:6528` (~25 frames) · Terms page `2922:1887` · Privacy page `2927:3153` (both under `2927:3151`)
- Buttons component: instance `3275:2504` → base `3552:2330` (336×56: 16px padding block, 24px line box, 8px gap, 24px icon, square corners)
- Per-section (390) — the whole artboard, enumerated once so nobody has to dump it again:
  Header `3133:6748` (y 0) · Hero `3187:3985` (69) · flower band `3147:6893` (417) ·
  About `3187:4452` (939) · Services `3187:4345` (2610) · Approach `3137:2432` (4290) ·
  Proven Results `3137:2448` (5652) · Testimonials `3137:2470` (6174) ·
  Logo slide `3153:8647` (6906, drawn **738px wide** — wider than the artboard) ·
  Why Us `3153:8671` (7066) · Contact `3153:8745` (7572) · Footer `3153:14667` (8488)
- Services button instances — 1920: `3137:1939` primary / `3137:1959` outline; 390: `3187:4359` primary / `3187:4371` outline. Worth reading per section: the
  same logical button is drawn with different radius, padding, type step and even
  a different arrow between the two artboards.

## Assets

### Getting them out of Figma (standing procedure — do this, don't improvise)

1. `get_design_context` on the **leaf** node that holds the artwork. It returns
   constants pointing at the local MCP asset server, e.g.
   `const imgGroup = "http://localhost:3845/assets/<hash>.svg"`. Both SVG and PNG
   come through the same way. Large subtrees time out — go leaf by leaf.
2. Download each one, e.g.
   `Invoke-WebRequest -Uri <url> -OutFile assets-src/<section>/<name>.svg -UseBasicParsing`.
   The hashes are per-session, so re-run step 1 rather than reusing an old URL.
3. Run new SVGs through the `preserveAspectRatio` fixer and spot-check the viewBox.
4. Commit the file with its section, then upload (approval-gated) and bump `ASSET_VERSION`.

**Inline vs bucket.** Small flat-filled vectors (a few paths, under ~2 kB) go inline as
a TSX component — no upload gate, no extra requests, and the section cannot render a
broken image. The three Our Approach marks cost 1.8 kB gzipped for all three, against
three R2 round trips. Reserve the bucket for photography and for art big or complex
enough that the markup would dominate the file.

**Masks are often no-ops.** A node named "Clip path group" exports as a mask SVG plus a
fill SVG. Open the mask first: if it is a single full-bounds rectangle (Approach's
Collaborate mark was `M140 0H0V140H140V0Z`), it clips nothing — keep the fill and drop
the mask entirely rather than reproducing a `mask-image`.

**What this cannot export:** live text inside artwork. Figma keeps it as text nodes,
so a lockup whose wording is type comes out as separate vectors plus bare strings.
Reconstructing small type (8–10px) in HTML is not worth the fidelity risk — ask for a
flattened SVG export with text outlined instead.

### Backlog — assets the team owes us

One left. The hero shapes below were delivered on 2026-08-26 and are now in the build.

1. **The white brand lockup** (header logo). `3552:2941` (flower + "officience") and
   `3552:2977` (the "20" mark) export cleanly, but "YEARS" / "ANNIVERSARY" are live
   text. Until a flattened SVG (text outlined) arrives, `Header.tsx` renders the old
   blue PNG inverted with `filter: brightness(0) invert(1)` — right height and colour,
   but the artwork is 2.51:1 against Figma's 2.38:1, so it sits ~8px too wide at 1440.
2. ~~**The hero's five floating 3D shapes.**~~ **RESOLVED 2026-08-26.** Still
   unaddressable in Figma — no node id, no asset, no coordinates, in either artboard,
   and `Rectangle 3` behind them is a flat fill — so the placement remains *measured
   off the 1440 render*, not read from it. The team delivered five 1080x1080 PNGs
   (~915kB) to `hero/` in the staging bucket; they are trimmed and re-encoded to
   380px WebP (~101kB total) in `assets-src/hero/`, and `SHAPE_PLACEMENT` in
   `Hero.tsx` is now the source of truth for their positions.

   **The one correction worth remembering:** the left/top fractions hold, but sizing
   the shapes as a *percentage of band width* does not. The band's height is pinned
   (742px, 875 at 3xl) while its width follows the viewport, so a width-relative
   size that is right at 1440 overshoots by 1920 — the asterisk reached 187px against
   the artboard's 141px, and the star grew until it clipped through the bottom of the
   band. The widths are therefore pinned to their 1440 pixel values (leaf 101,
   asterisk 141, ring 138, star 141, ellipse 124). Note also that the **1920 artboard
   draws no shapes at all**, so anything above 1440 extrapolates the 1440 composition.

   They are decorative: `aria-hidden`, `pointer-events-none`, `decoding="async"` and
   no `loading="lazy"` above the fold. Hidden below `xl`, where the hero stacks into
   one column and a shape would land on the headline.

### Backlog — open items awaiting a ruling (index)

Everything below is **built as drawn** and flagged; none of it blocks the next step. This
index exists because the detail now spans several per-step sections. Grouped by the kind
of decision, not by section.

**Legibility / accessibility — one ruling covers each group**
1. **10px body copy in three places at 390**: the testimonial role line, the Why Us item
   descriptions, and the Contact option descriptions. Nothing else on the page goes below
   12px.
2. **Secondary/200 pink on the blue is 3.92:1** — fine for the 64px Why Us titles (large
   text needs 3:1), short of the 4.5:1 the 20px mobile titles need.

**Copy that reads as a slip rather than a decision**
3. **The Diana client logo drops the "AI"** from the company's name.
4. **"Vietnam_OffyPlex" / "Vietnam_CrunchBase"** as visible city labels.
5. **Three office addresses lost commas** against the live site, each exactly where Figma
   wraps the line.
6. **The 390 testimonial frame repeats the second quote** in the third card; 1920 carries
   the real one, which is what shipped.
7. **"has become" (1920) vs "had become" (390)**; 1920 shipped.
8. **Our Services 390-vs-1920 conflicts** — see that section for the four of them.

**Design details that differ between the two artboards for no evident reason**
9. Author name switches Lexend -> Montserrat between 1920 and 390 (testimonials).
10. Card radius and shadow differ between frames (testimonials: 12+shadow vs 4+none).
11. The eyebrow chip is 8/2 on About Us and 12/4 on every other 390 section.
12. "View All Brochure" radius is 8 at 1920 and 0 at 390.
13. The Contact form panel's radius is 6px, which is not in the radius scale.
14. The Contact card is on 74px gutters where every other section uses 64.

**Assets still owed by the team**
15. The white brand lockup with text outlined. (The five hero 3D shapes were
    delivered 2026-08-26 and are in the build.)
16. Higher-resolution About cards 2 and 3 **for the desktop framing**, and the IOGA
    original (its crop upscales 1.4x). Investigated 2026-08-26 and still owed, with a
    useful finding: the **390** fills are backed by 3480-4096px originals (that is
    where the mobile crops in ruling 18 come from), but the **1920** fills are
    separate, separately-processed **1024px** copies showing a tighter framing — not
    crops of those originals. A template match over the originals scored only
    0.61 and got worse under refinement, so the desktop composition cannot be
    reproduced from them; re-exporting would silently change the framing. Desktop
    cards 2 and 3 therefore still upscale 1.75x into the 1792px box. Ask the team for
    the desktop crops at source resolution rather than deriving them.

**Destinations not yet specified**
17. Rizlum / HR / ITS, View All Work, and Discover Our Story have no targets.

**Ruled on, recorded so it is not "fixed" back**
18. **The About photos are art-directed: the two artboards FRAME them differently.**
    This is the single most re-worked thing in the redesign; read it before touching
    `AboutUs.tsx`.
    - **1920** stretches the whole frame into the 1792x860 box. Sources are 1.33 and
      1.50 against a 2.08 box, so people render 1.57x and 1.39x wide. A cover-crop
      instead cuts their heads off. Ruled 2026-08-26: match the artboard — hence
      `lg:object-fill` on cards 2 and 3. Card 1 is a manual crop in Figma (a milder
      6% squeeze) and keeps `object-cover` with a tuned position.
    - **390** does something different in kind: it **zoom-crops** each photo 1.44x /
      1.52x / 1.70x past what `object-fit: cover` would use, then offsets it. Serving
      one file to both breakpoints therefore cannot work — it was what left the phone
      view visibly stretched. `srcset` only varies resolution, so the fix is
      `<picture>` with a `(min-width: 1024px)` source, and mobile files that carry
      Figma's crop **baked in at exactly the artboard box aspect** (358/220, and
      358/237 on card 3, whose mobile photo is drawn 237 tall). `object-cover` is then
      a no-op below lg and CSS distorts nothing — measured distortion 1.000.
    - Card 1's mobile fill carries a **0.915 horizontal squeeze in Figma itself**
      (`size-[157.9%]` resolves against different bases for width and height).
      Reproduced in the file rather than corrected.
    - Mobile crop windows, in original-source pixels, so nobody re-derives them:
      card 1 `(593,570) 2204x1239` of 3480x1957 · card 2 `(1392,767) 2688x1651` of
      4080x3072 · card 3 `(756,315) 2407x1603` of 4096x2730.
19. **The footer's social glyphs come from Figma, not the bucket.** `3129:3568` draws
    each mark at its own size inside a shared 38x38 box (LinkedIn 13.89x14.79, TikTok
    16.51x19.05, Facebook and YouTube filling the frame). The earlier decision to
    reuse MenuOverlay's bucket set was overruled 2026-08-26: that set normalised every
    mark to one 45.385 square, which rendered LinkedIn small and Facebook oversized.
    They are inlined in `ui/FooterIcons.tsx`. **MenuOverlay keeps the bucket set** —
    its own frame draws those.
20. **Rizlum's partner tile, rebuilt twice on 2026-08-26.** The original was
    horizontally stretched 1.61x (artwork ratio 7.74 against the source's 4.80) and
    filled only 27% of its canvas height instead of 44%, almost certainly by the
    white-key background pass — the logo is white-on-transparent, so that pass had
    nothing to key and mangled it. **Do not run a white-key pass over this file.**

    Reproducing Figma's padded `object-cover` box was still not enough: it leaves the
    logo occupying 145x30 of a 203x69 canvas, i.e. only ~2x effective resolution for
    the artwork and a 73px-wide render, which reads as blurry. The file is now
    **tight-cropped to the artwork at 320x67** (every pixel is logo, ~3x the display
    size) and drawn at 105x21.9 rather than Figma's 73x15.2, to carry the same visual
    weight as its sibling tiles. The one source is a YouTube-thumbnail frame whose
    artwork tops out at 897x187, so that is the ceiling until a real logo arrives.

**The responsive lesson worth keeping (2026-08-26)**
21. **A fixed height on a fluid width is the bug.** Every fidelity complaint from the
    26 Aug device review traced back to one shape of mistake: a pixel value that is
    correct at one artboard width and silently wrong at every other.
    - **About photos.** `h-220` / `lg:h-860` made the box aspect a function of the
      viewport: 1.63 at 390 but **4.50 by 1023**, so an `object-cover` threw away 70%
      of the picture on a tablet; and 1.43 at 1280 against 2.08 at 1920, so the same
      photo looked horizontally squeezed on a scaled laptop. Fixed with two constant
      ratios — `aspect-[358/220]`, `lg:aspect-[1792/860]`.
    - **Overlay bands and nowrap headings.** The About caption band's insets are the
      artboard's fixed 200/60/176, which at 1024 leaves a 576px band whose copy needs
      288px of height — it spilled over the photo, so the overlay now starts at `xl`.
      Likewise three `lg:w-[600px] lg:shrink-0` blurbs and the 86px nowrap headings
      beside them needed ~1130px inside a 976px column: 235px of copy was being
      silently truncated by `body { overflow-x: hidden }`, with no scrollbar to show
      it. The blurbs now carry `lg:min-w-0` so they shrink, and Client Review's
      heading is `2xl:whitespace-nowrap` — Figma lets it overrun its column by 32px,
      which is safe at 1920 but ran it straight over the cards below 1440.
    - **Check for this by measuring, not looking.** Probe a real page in an iframe at
      375/768/1024/1280/1440/1536/1920 and assert three things: no leaf element's
      right edge exceeds the width once clipping ancestors are excluded, every
      aspect-ratio box reports the same ratio within a breakpoint, and no absolutely
      positioned band needs more height than it has. `body` clips the evidence, so a
      screenshot will not show you the overflow.
22. **Our Approach is a row from md, not lg.** Figma draws only 390 and 1920, and
    taking the 390 stack all the way to 1023 left three full-width steps on a tablet
    where three columns fit. The mark keeps a fixed slot at md as well as lg, because
    Engage's mark is 105px where the other two are 100 and the text blocks would
    otherwise start on different lines.

### Backlog — copy and design questions for the team

- **Our Services, 390 vs 1920.** The mobile frame is behind the desktop one, so the
  build follows 1920 throughout (per the plan's "desktop wins"). Waiting on a ruling:
  BI & Analytics' mobile offering list is a verbatim copy of Software & Web
  Development's; Software's mobile list says "Enterprise tools" where desktop says
  "SaaS platforms"; Data Engineering is titled "Data Engineering" on mobile and carries
  a different promise line and two extra offerings; the mobile subtitle ends in a full
  stop and the desktop one does not.
- **"View All Brochure" corner radius** is 8px at 1920 and 0 at 390, for the same
  button. Built as drawn. Likely an oversight rather than intent.
- **Our Approach, 390 vs 1920.** The mobile blurb drops "with agile speed" ("How we
  transform your vision into seamless digital reality."); desktop copy is used at both.
  Mobile step frames are 340/350/350 tall regardless of their copy, so the rules run
  past the text — reproduced as a single 350px min-height, which makes Engage's rule
  10px longer than drawn.
- **"We're COSMIC." no longer expands the acronym.** The 20th-anniversary copy spelled
  it out (Caring, Openness & Sincerity, Merit, Innovation, Commitment); both Sept-2026
  artboards cut it, and nothing else on the page defines it.
- **The 390 eyebrow chip is drawn at two sizes.** Every 390 section is px-12/py-4/30px
  — Services `3187:4349`, Approach, Proven Results, Testimonials, Why Us, Contact —
  except About Us `3147:6973` at px-8/py-2/26px. `ui/SectionBadge` follows the majority,
  so the About Us chip renders 4px taller than its frame. Needs a ruling on which is
  canonical — one section differing by 4px reads as accidental.
- **The overlay menu names seven service units, Our Services lists four.** Rizlum, HR
  and ITS appear nowhere in the Services section on either artboard, and the four rows
  cover Design / Tech / Data / Crunch only. Either the section is missing three rows or
  the three menu items belong somewhere else. Related: those three still have no
  destination (`unresolved` in `components/navigation.ts`; render per design for now,
  redirect later).

- Source folder: `assets-src/` (relative paths become R2 object keys)
- Drop folder for user exports: any root folder agreed per task (left untracked)
- Upload command: `npm run upload-assets` (wrangler → R2; creds in git-ignored `.env`) — **approval-gated**
- `.env` does **not** exist in a git worktree — copy it from the parent checkout before uploading.
- `scripts/upload-assets.mjs` re-uploads **all** of `assets-src/` on every run, overwriting objects in place.

### The three buckets — read this before any upload

| Bucket | Public host | Role |
|---|---|---|
| legacy | `pub-e3bac769…` | Splash-screen art only. Still referenced by `SplashScreen.tsx`; preconnect stays while the splash ships. |
| **production** | `pub-37210447…` | **Serves every image on officience.com today.** Read-only for this redesign — writing here changes the live site, with no cache header, deploy gate, or rollback. |
| **staging** | `pub-767c5aeb…` | Bucket name `redesignsept2026`. Every Sept-2026 asset goes here. Becomes the production origin at merge (URL flip, no copy), leaving production intact as the rollback. |

`upload-assets.mjs` targets the staging bucket by default and **refuses** the
production bucket without `--allow-production`. Override the target with
`R2_BUCKET` in `.env`.

`assets.ts` names all three and selects one via a single `R2` constant. It still
points at **production** until the staging bucket has been seeded with the current
`assets-src/` set — flipping before the seed 404s every image on the branch preview.

- Cache-bust: `ASSET_VERSION` in `assets.ts` — bump on **every** re-upload. r2.dev sends no `Cache-Control`, so verify fresh bytes with a never-used `?cb=<guid>`; if a stale response got cached under the new `?v=N`, bump once more.
- Image processing: Python + Pillow (installed; `magick` is NOT) — RGBA → soft white-key ramp min(r,g,b) 236→250 → `getbbox()` crop.
- New SVG exports: run through the `preserveAspectRatio` fixer and spot-check the viewBox.

## Design tokens

- Tailwind via CDN, configured in `index.html` (supports `max-md:` variants + `!` important).

### Type — fixed styles, not fluid clamps

The Sept-2026 scale is **fixed px per named style**, verified identical at 1440 and
1920. Breakpoints do not interpolate a size; they **swap to a different style**
(hero title is Heading-H2 at 390 and Display-xl at 1440+; section titles are
Heading-H1 at 390 and a Display style on desktop).

So each Figma style is one Tailwind `fontSize` entry with line-height, letter-spacing
and weight baked in — which is what makes `text-h1 lg:text-display-sm` possible.
Family stays separate: `font-sans` = Lexend, `font-body` = Montserrat.

| Utility | Figma style | px / line-height / weight |
|---|---|---|
| `text-display-xl` | Display-xl | 86 / 95 / 700, ls −0.03em |
| `text-display-md` | Display-md | 64 / 74 / 500, ls −0.03em |
| `text-display-sm` | Display-sm | 50 / 58 / 500 |
| `text-h1` … `text-h4` | Heading-H1…H4 | 36/44/500 · 28/40/600 · 24/28/600 · 20/28/500 |
| `text-subtitle-1` / `-2` | Subtitle / Subtitle 2 | 24/36/400 · 28/36/400 |
| `text-body-xl` / `text-body-md` | Body-xl / Body-md | 20/28/400 · 14/20/500 |
| `text-btn-md` / `text-btn-lg` | Button-md / Button-lg | 16/24/500 · 20/24/600 |

Figma letter-spacing of `-3` is **percent**, i.e. `-0.03em`.

`subtitle-1`/`subtitle-2` are named that way on purpose: a `subtitle` key would
generate `text-subtitle`, which is already the **colour** utility for `#5A5A5A`.

The old July `.t-*` CSS classes are still in `index.html`, frozen verbatim, because
every unmigrated component consumes them. Do not rename or edit them — new work uses
the `text-*` utilities. The block gets deleted at cleanup once nothing references it.

### Colour / spacing

- Palette core unchanged: primary `#1F49BF`, background `#F7F7F7`, text `#0F1219`, subtitle `#5A5A5A`.
- Added: `sec-500 #DD3C57` · `sec-200 #FF9FAE` · `pri-50 #ECF4FF` · `org-200 #FED29F` · `green-200 #A5E5C8` · `green-100 #CAF2E0` · `dpink-100 #FAC5DE` · `black-900 #1B1E25` · `border-field #C6C6C6` · `border-frame #E5E5E5`.
- Contrast limits: `#FF9FAE` on `#1F49BF` is ≈3.9:1 → display/large text only, never body or labels. `border-field #C6C6C6` fails 3:1 as a non-text boundary → decorative only, not input borders.
- Radii `rounded-fig-xs|m|l` = 4 / 8 / 12. Content cap `max-w-content-2` = 1792px.
- Interaction states (Figma draws only the resting state — these are the house chains, encoded once in `components/ui/Button.tsx`): filled `#1F49BF→#000086→#000050`; text links `#1F49BF→#63A4FC→#000086`; outline hover `#F7F7F7`, pressed fills `#1F49BF`; tertiary hover `#ECF4FF`; `:focus-visible` = 2px outline at 2px offset, white on blue surfaces.
- Fonts: Lexend (headings), Montserrat (body) via Google Fonts — **weights 300–700 for both**; Montserrat 700 was previously unloaded while `.t-body-lg-bold` asked for it, so bold body text was browser-synthesised.

### Layout

One rule hits all three artboards: `mx-auto w-full max-w-content-2 px-fig-16 lg:px-fig-24`
(`components/ui/Container.tsx`). 390 → 358 content · 1440 → 1392 · 1920 → capped at
1792, which centres to exactly the 64px gutters the artboard draws. Section
backgrounds go on the parent so they stay full-bleed.

## Verification

- Widths: 320 / 375 / 390 / 768 / 1024 / 1280 / 1440 / 1920. Build check: `npm run build` (tsc -b).
- Real-browser passes are required for anything that moves: the preview tool freezes motion.
- Environment quirks (all confirmed in this project):
  - `preview_screenshot` hangs (framer rAF never settles) — use `preview_eval` geometry + `preview_snapshot`.
  - Preview tab is `document.hidden` → rAF frozen → framer `AnimatePresence mode="wait"` modals (Survey) can't advance past step 0.
  - Preview **and the local Chrome** report `prefers-reduced-motion: reduce`. Wiring is verifiable; motion is not. Turn Windows animations on to review motion.
  - **Chrome's window here cannot leave ~1526 CSS px** (1920 display at 125% scaling),
    in either direction — `resize_window` reports success and nothing changes. So:
    - **Load the page into an iframe of the width you want to test — including widths
      WIDER than the window.** Media queries follow the iframe's viewport, it is
      same-origin so its DOM measures normally, and it has caught real breakpoint bugs.
      `f.style.width='390px'` for mobile; **`f.style.width='1920px'` genuinely works** —
      inside it `matchMedia('(min-width:1920px)').matches` is true, the Container
      resolves to 1792 with 64px gutters, and every geometry read is valid. The frame
      just overflows the window horizontally, which measurement does not care about.
      Screenshots only show the leftmost ~1526px, so shoot in sections or measure
      instead. This replaces the old stylesheet-walking workaround, which confirmed
      declared values but never layout.
  - **`loading="lazy"` never fires in this Chrome profile.** Confirmed directly: an
    eager image loads, an otherwise identical lazy one pinned at `top:100px` in the
    viewport stays `complete: false` indefinitely. Nothing to fix in the markup — but
    it means lazy imagery is invisible to verification until you force it:
    `[...document.images].forEach(i => { if (i.loading === 'lazy') { const s = i.src; i.loading = 'eager'; i.src = ''; i.src = s; } })`
    then wait a few seconds. Do this in the iframe's `contentDocument` too.
  - Screenshots race the paint on a long document — if a region comes back blank,
    scroll the element into view, wait, and shoot again rather than concluding it broke.
    A tab that has timed out on `screenshot` a few times can wedge its renderer; open a
    fresh tab rather than fighting it.
  - `srcset` picks a **cached larger candidate** over fetching a smaller one, so a
    narrow viewport may report the desktop file. To test selection honestly, add a
    unique cache-busting param to every candidate.
  - Cross-origin `fetch()` to the r2.dev host fails CORS; `<img>` is unaffected. Don't
    read a failed `fetch` as a broken asset.
  - Overflow: compare against `document.documentElement.clientWidth`, not `window.innerWidth`.
  - **1px borders measure 0.8px** and 2px outlines 1.6px — the 125% display scaling
    snaps them to whole device pixels. A section whose rows each carry a rule comes out
    0.8px per rule taller than the artboard. Not a defect; don't chase it.
  - **`:focus-visible` does not match a programmatic `.focus()`** unless the last real
    interaction was the keyboard, and a non-matching element reports
    `outline-style: none` with `outline-color: currentColor` — which reads as a white
    focus ring on any white-text button. Press a real Tab first, then probe, or you will
    "find" an invisible-focus-ring bug that does not exist.
  - Long `javascript_tool` scripts sometimes come back `[BLOCKED: Cookie/query string
    data]`. Split the probe into smaller calls; walking `document.styleSheets` seems to
    provoke it.
  - **Google Fonts' Lexend runs ~6% wider than Figma's copy**: "View All Brochure" at
    SemiBold 20px measures 176.8px here against the 167px the artboard implies, so every
    hug-width button lands ~10px wider than its Figma frame. Font-version difference,
    not a padding error — check the padding/gap/icon numbers instead of the total width.
  - The survey email function (`api/survey.ts`, Node runtime) does NOT run under `vite` — e2e only on a Vercel deploy.
  - Vercel `SMTP_USER`/`SMTP_PASS` are branch-filtered to `redesign/2026`; any other branch's preview 500s on submit until they are re-scoped. Rate limit is 5 requests / 10 min / IP.
- Tailwind Play CDN generates classes on demand: a class injected by script needs a
  tick before `getComputedStyle` reflects it. Wait ~400ms when probing tokens.

## Standing divergences from Figma (user-approved — do NOT "correct" back)

- Survey talent flow has NO CV upload box (links-only; portfolio field required).
- Overlay menu gets a scoped `.menu-scroll` scrollbar: `index.html` kills scrollbars
  globally (`scrollbar-width: none` + `::-webkit-scrollbar{display:none}`), and
  Firefox can only approximate the drawn one via `scrollbar-width: thin`.
- UI glyphs come from **Lucide, not the Figma Iconly set** (the plan's asset policy).
  Iconly's are filled shapes, Lucide's are stroked, so arrows read a little lighter:
  `ArrowRight` for Iconly "Arrow - Right", `ArrowUpRight` for Iconly "Made_call".
- `ui/SectionBadge` steps its padding by breakpoint: 12/4 (30px tall) at 390, 8/2 (32px)
  from lg. Every 390 section is drawn at 12/4 **except About Us `3147:6973`**, which is
  8/2 — so the majority wins and the About Us chip renders 4px taller than its frame.
  Desktop is 8/2 everywhere, no conflict.
- **Our Approach columns are equal thirds** (`flex-1` + 120px gap) where the artboard
  draws 533.33 / 533.33 / 485 — those widths are Figma hug artifacts, not a grid. Line
  counts come out identical to the artboard at 1920 (4/4/3); the only visible effect is
  the 2nd and 3rd rules sitting 16px and 32px left of where Figma puts them.
- Footer keeps a "Cookie Settings" link and gains "Privacy Policy", neither of which
  the Figma footer draws — compliance requirement (Privacy link pending step-10 sign-off).

### Superseded by the Sept-2026 design

The July header rules no longer apply: heights are now the Figma values
(~69 / 113 / 119px at 390 / 1440 / 1920, fixed px per breakpoint, never vw), and the
double-gutter and compact-88px divergences are retired with the old header.

## Project hard rules

- `main` = live production (officience.com) — untouched until an explicitly approved merge.
- Work on `redesign/sept-2026` (cut from `main` at `2b0088d`). The old `redesign/2026` branch is fully merged; there are no standing merge conflicts. Merge `main` in at every checkpoint boundary.
- git commit/push and R2 uploads: only on explicit user approval, every time.
- Plan Mode rule: see `CLAUDE.md` — any Plan Mode signal is a hard stop on execution.
- Never write to the production bucket (`pub-37210447…`) during the redesign.

#### People Trust Us + the client wall (step 7)

- **The Diana logo drops "AI".** The wall's asset reads "Diana" as a stacked mark over
  wordmark; the live site's is "Diana AI", set horizontally. Renaming a client is more
  likely an asset slip than a decision. Built as drawn — the recommendation is to put
  the live asset back.
- **Two more logos are cut down from the live set**: Passerelles Numeriques is the
  circle mark alone, without the "Passerelles numeriques / Un passeport pour la vie"
  wordmark, and abaca drops "Photo/Video Agency". Both read as a deliberate mark-only
  treatment at small size — unlike Diana, neither changes the company's name. Confirm.
- **The twelfth logo tile is `saur` a second time**, drawn at 191.8x88.9 where its first
  appearance is 221.6x112.6. Read as the designer showing the loop wrapping rather than
  a twelfth client. Built with the eleven real logos and a duplicated track — confirm
  nobody is missing from the wall.
- **The 390 frame repeats the second quote in the third card.** L. Lemaire is credited
  with "I really appreciate the team's availability & responsiveness."; 1920 carries the
  real one, "Without you, I just could not work.". Built from 1920.
- **"has become" (1920) vs "had become" (390)** in the first quote. Built from 1920.
- **The author's name changes typeface between frames** — Lexend Medium 20/28 at 1920,
  Montserrat Bold 14/22 at 390. Every other name on the page stays in one family across
  breakpoints, so this may be a detached component rather than intent. Built as drawn.
- **The card is drawn as two different objects**: 12px radius with Shadow-sm at 1920,
  4px radius and no shadow at all at 390. Built as drawn.
- **The 390 role line is 10px** (Caption-sm-regular). Nothing else on the page goes below
  12px, and 10px is small on a real handset. Needs a ruling.
- **The 1920 quote column stops 199px short.** Header 600 + 146 gap + cards 847 = 1593
  from the 64px gutter, inside a 1792px content column, so the cards end at x=1657 with
  the column running to 1856. Built as drawn, left-aligned.
- **Shadow-sm is Black/950 at full opacity again**, as in Proven Results — a hard 1px
  edge rather than a soft lift. Rendered faithfully via `shadow-fig-sm`.
- **Neither frame specifies the wall's movement.** Figma draws a track far wider than the
  artboard and clips it. The motion is taken from the live site on the user's
  instruction: leftward travel, new logos entering from the right, continuous loop,
  paused under the pointer. The edge fade is the same carry-over — Figma clips hard.
- **Full colour is a hover state, so touch never reaches it.** Both frames leave the
  logos desaturated (Figma uses a luminosity blend, the build uses a greyscale filter)
  and the design draws no touch equivalent. Phones therefore see the greyscale band
  throughout, which is the resting state as drawn.

#### Why Choose Us (step 8)

- **The pink titles are 3.92:1 on the blue.** Secondary/200 `#FF9FAE` on BG/Primary
  `#1F49BF`. That clears AA for the 64px desktop titles (large text needs 3:1) but
  misses the 4.5:1 that the **20px mobile titles** need — Talents and Value-Driven only.
  White copy on the same blue is 7.6:1 and fine. Needs a ruling: nudge the pink darker
  on 390 only, or accept. Built as drawn.
- **The 390 item descriptions are 10px** (Caption-sm-regular) — the body copy of a whole
  section, and the second 10px in the design after the testimonial role line. Same
  ruling needed.
- **The crosshair is drawn ~30px left of the page centre.** The rules cross at x≈930.8
  where the content column centres on 960 — and the group's own bounding box centres on
  960 exactly, so the offset is inside the artwork, not the layout. Built centred on the
  column; reverting is one class.
- **The gutter either side of the centre line is drawn at two values** — 68px on the
  left, 61px on the right, for what reads as one gutter. Built symmetric at 64 (Space
  64, the average). Flag if the asymmetry was intended.
- **Item titles are 64px on a 58px line-height** — negative leading, and no such pair
  exists in the type scale (Display-md is the same 64px on 74px). Built as a per-section
  override rather than a new named style, since nothing else uses it.
- **The 390 frame carries four per-item icons that are switched off** — `Design_black`,
  `Data_black`, `IT_black` and `Intersect`, all 13.29px, `visible: false`. Not built.
  Confirm they are meant to stay hidden rather than having been lost.
- **The pinwheel is backed by a shape filled `#1F49BF`** — the section's own background,
  so it paints nothing. Dropped when inlining, the same no-op as the Approach marks'
  clip path.
- **Both rules are `#F7F7F7`, not white.** They read as white against the blue but are
  BG/Secondary, and reproducing that keeps them consistent with the page's other rules.
- **International's description has a trailing space** in Figma. Trimmed.

#### Connect With Us (step 9)

- **"Vietnam_OffyPlex" and "Vietnam_CrunchBase" are drawn as the city labels.** The
  underscore reads like a layer name that leaked into copy, and it renders verbatim on
  both artboards. Built as drawn — the recommendation is "OffyPlex, Vietnam" / "CrunchBase,
  Vietnam", or restoring the July grouping under one "Ho Chi Minh City, Vietnam" heading.
- **Three addresses lost commas** against the live site: France reads "Sébastopol 75001
  Paris" (was "Sébastopol, 75001, Paris"), USA "Dover Delaware" (was "Dover, Delaware"),
  Singapore "#04-08 Singapore" (was "#04-08, Singapore"). Each dropped comma sits exactly
  where Figma wraps the line, so they look like authoring artefacts. Built as drawn.
- **The offices flatten from a grouped 3-column list to six peers.** Both artboards draw
  six, so the July `officeColumns` nesting and its bold sub-labels are gone.
- **The card sits on 74px gutters** at 1772px wide, where every other section uses the
  1792px content column on 64px. Reproduced rather than snapped to the column, so
  `Contact` deliberately does not use `ui/Container`.
- **The form panel's radius is 6px**, which is not in the radius scale (xs 4, m 8, l 12) —
  it is Space 6 used as a radius. Built as drawn.
- **The desktop office columns hug their content** (432/446/394 and 434/443/394) on a fixed
  160px gutter, leaving 52px of slack in the 1644px frame. Built as equal thirds on the
  same 160px gutter with the address capped at Figma's 383px so the wrapping matches;
  columns 2 and 3 land ~9px and ~5px right of the artboard.
- **The 390 option descriptions are 10px** — the third 10px in the design, after the
  testimonial role and the Why Us descriptions. One ruling should cover all three.
- **The 390 second option row is 80px against Figma's 62.** Figma keeps "Internship,
  co-working, partnership & more." on one line with `nowrap` in a 218px slot; the web
  Montserrat renders wide enough that forcing it would risk overflow, so it wraps to two
  lines. That difference is the whole 20px by which the mobile section overruns.
- **The blurb is desktop-only** — the 390 frame drops "Our global teams across strategic
  locations…" entirely. Hidden rather than deleted.
- **The chevron is drawn at two optical weights** — a light glyph inside a 32px shadowed
  button at 390, a heavier bare glyph at 1920. Both ship and swap at the breakpoint.
- **The heading changes from "Let's Build Together" to "Connect With Us"**, hard-broken
  after "Connect" at 1920 and on one line at 390.
- The blue wrapper HomePage carried since July is now gone: Why Us and Contact each paint
  their own `Semantic/BG/Primary`, and `Footer` already set `bg-bg-primary` itself.

#### Footer (step 10)

- **All five partner logos are placeholders, not brand assets.** Figma's underlying
  files are named "maxresdefault (3) 1" (a video thumbnail),
  "Gemini_Generated_Image_jyzumvjyzumvjyzu 1" (an AI generation) and "images (9) 1" (a
  stray download). Offinity is worse: it is not one logo but six loose vectors, so
  `offinity.svg` is those six recomposed from their Figma insets. **All five want
  originals from the team** — this is the drop-folder item the plan anticipated.
- **The partner tiles have no destinations.** Figma draws them as bordered images with
  no link, so they ship as images. If they should link out, the URLs are needed.
- **The two column headings are drawn in different styles at 390** — "Company" in
  Montserrat Bold 14/22, "Our friends" in Lexend Medium 16/24 — where 1920 sets both in
  Lexend SemiBold 20/24. Reproduced.
- **The Company links change colour between frames**: Primary/50 `#ecf4ff` at 390, white
  at 1920. Reproduced.
- **The legal row is relabelled** "Terms & Conditions" -> "Terms of Use", and the 390
  frame stacks the two links vertically with the copyright on its own line beneath, where
  1920 runs all three inline separated by rules. Both reproduced; the routes are
  unchanged. The old note in `navigation.ts` claiming Figma omits Privacy Policy is stale
  and has been corrected — the Sept-2026 footer draws it.
- **Figma's own footer social marks are drawn at inconsistent relative sizes** — the
  LinkedIn glyph fills 36% of its 40.494px box where Facebook fills all of it. The build
  reuses the bucket set MenuOverlay already renders, so the same four brands are not
  drawn two different ways on one site; measured, they paint at a consistent size.
- **The footer keeps 20th-anniversary branding.** The lockup and the watermark band are
  byte-identical to the files already in the bucket, so nothing was re-uploaded and the
  footer stays consistent with the decision to leave the splash art alone. If the brand
  moves off the anniversary mark, this and the splash change together — and the plan's
  step-10 note about regenerating favicon.ico / icons/* / logo-512 applies then, not now.
- The mail and phone glyphs are inlined; every other footer vector was already a bucket
  asset or is a partner tile.

#### Survey (step 11) — in progress

The July build was already made from an earlier cut of these same frames, so this is a
refinement, not a rebuild. Deltas applied: modal 800 -> 968; progress bar to 8/4 gaps with
two distinct greys (Text/Subtitle-2 `#A0A0A0` for the inactive word, Border/Outline-Field
`#C6C6C6` for the inactive rule — the July build used one grey for both); chips to Figma's
12/6 with Medium `#5A5A5A` text; no Cancel on the first step.

- **A required consent checkbox is new** and appears on the last input step of BOTH
  branches (2809:2247 and 2818:3232): "I confirm that I have read and accepted the Terms of
  Use and Privacy Policy of Officience." It gates submission and is recorded in the payload
  (`consent: 'Accepted Terms & Privacy'` added to `FIELD_LABELS`) — a consent nobody records
  is not worth collecting. Its links open in a new tab so a part-filled form survives.
- **Figma's category picker drops "Full-time career"**, one of the five cards, and the one
  that (with Internship) routes to `jobs@`. Dropping it would leave full-time applicants no
  path at all. **Kept, flagged** — the design's four rows are four *detail forms*, and
  Intern/Full-time have always shared one, so this reads as a lost card rather than a
  decision. Needs a ruling.
- **Figma's Internship card description is the wrong copy** — "Build or improve a
  website/app", lifted from the work flow's solve options. The build's own line is kept.
- **The completed screen carries two misspellings** — "Transmission competed!" and "3
  bussiness days" — plus a lowercase "officience". The build already spells all three
  correctly and keeps doing so.
- **Figma labels the send button "Next step"** on the last input step, where the build says
  "Submit". Kept as "Submit": that click sends an email, and "Next step" understates an
  irreversible action. Same category as the typos — reproducing it would ship something
  worse for no design gain.
- **"What bring you here?"** on the picker is missing its "s", and duplicates the Contact
  section's own "What brings you here?".
- The chip keeps 12px of vertical padding at 390 (Figma draws 6) so it clears a 44px tap
  target — an accepted divergence, as elsewhere.

**Not yet verified, and not verifiable here.** `document.hidden` is true in this Chrome
profile, so rAF is frozen: framer's `AnimatePresence mode="wait"` never finishes the exit
animation, the incoming panel never mounts, and every screenshot comes back blank. Confirmed
working through the DOM: step-0 gate, the Back button appearing at step 1, the "Submit"
label, and the primary button disabled at step 1. **The consent checkbox's own rendering and
its isolated gate need a real, focused browser.** Live e2e additionally needs the Vercel
SMTP env re-scope and a preview deploy — `api/survey.ts` does not run under Vite.

#### Legal pages v2 (step 12)

Figma `2922:1887` (Terms) and `2927:3153` (Privacy) — **1440 artboards, and the only pages in
the redesign with no 390 frame**, so the mobile treatment is the build's own.

- **The section set already matched.** Figma's TOC lists twelve items and `TERMS_SECTIONS`
  already held exactly those twelve, in order, so the "transcription + diff vs legacy" the
  plan called for came out clean. The single difference is section 4: Figma's TOC abbreviates
  "Company Content **&** Media" where the transcribed draft says "**and**". The document's own
  wording is kept.
- **The heading is now "Terms of Use"**, not "Terms & Conditions", and a "Last updated: June
  2026" line joins the hero. The footer link was already relabelled in step 10.
- Type maps onto the scale with nothing new: hero `display-xl` 86/95, section headings
  `display-sm` 50/58, body `body-lg` 16/26 — all exact.
- The hero band is 478 tall around 147px of copy: **124 above, 207 below**. The slack under
  the title is deliberate in the artboard and is reproduced.
- **Figma stops the column rule after ~843px**, about the height of the contents card. With
  the panel sticky the rule runs the full column here, which is what a column divider is for.
- The contents panel is one list, not two. A separate mobile copy would have put twelve
  duplicate anchors in the document and let the two states disagree.
- **Clicking a contents row claims it immediately** rather than waiting for the scroll to
  settle: whether the click highlighted what you asked for otherwise depended on where the
  section landed against the spy's line, and one that stopped a pixel low highlighted its
  predecessor.
- Scroll position, not IntersectionObserver, decides the current row — legal sections run
  several screens each, so most of the time no boundary is intersecting anything and an
  observer simply stops reporting.

#### Cleanup (step 13)

Grep-zero confirmed for all ten legacy `.t-*` classes, `animate-fade-in`,
`animate-marquee-reverse`, the pre-Sept `max-w-content` token, and `ASSETS.hero` /
`.services` / `.approach` (their files stay in the bucket). `index.html` lost ~2 kB.

Verified: exactly one `h1` on `/` and it is the hero headline; H1→H2→H3 with no skips; 56
images with zero broken and zero missing `alt`; the only empty `alt`s are the decorative
flower and the marquee's duplicate logo copy, which is the intended pattern; JSON-LD
`sameAs` matches `SOCIALS` exactly; all four routes resolve with correct titles and the
unknown path redirects to `/`; `vercel.json` still sends `noindex, follow` for both legal
routes while `/` stays `index, follow`; the sitemap lists only `/`; the legal chunk is still
split out of the main bundle; canonical and `og:url` stay pinned to `/`.

**Two self-inflicted regressions found and fixed this session — both worth not repeating:**

1. **A colour token named the same as a fontSize token.** Adding `subtitle-2` to `colors`
   collided with the existing `subtitle-2` in `fontSize`; Tailwind feeds both scales from the
   `text-` prefix, so one class set a colour AND a 28px size, and the survey's progress
   labels shipped at 28px in a 40px bar. **Before adding any `colors` key, grep `fontSize`
   for the same name.** The colour is now `gray-fig-400`.
2. **A regex with `[^}]*` cannot delete a nested object.** Removing two keyframes that way
   chopped their middles out and left orphan fragments, which made `tailwind.config` a syntax
   error — so every custom utility silently died site-wide while core ones like `text-white`
   kept working. Brace-counting called it "balanced" because the orphans happened to pair up.
   **Validate the config by executing it (`node -e` on the object literal), not by counting
   braces.** That is how the repair was confirmed.

Also worth knowing: **injecting a probe element and reading its computed style is not a
reliable check** of whether a utility exists. The Play CDN generates on scan, and a
freshly-injected node is often not picked up — it reported 16px for `text-h1` on a page that
was rendering `text-h1` correctly. Read the real rendered element, or look for the rule in
`document.styleSheets`.
