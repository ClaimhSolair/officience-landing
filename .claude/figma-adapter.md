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

Both are shipped-around, not blocking. Revisit when the files arrive.

1. **The white brand lockup** (header logo). `3552:2941` (flower + "officience") and
   `3552:2977` (the "20" mark) export cleanly, but "YEARS" / "ANNIVERSARY" are live
   text. Until a flattened SVG (text outlined) arrives, `Header.tsx` renders the old
   blue PNG inverted with `filter: brightness(0) invert(1)` — right height and colour,
   but the artwork is 2.51:1 against Figma's 2.38:1, so it sits ~8px too wide at 1440.
2. **The hero's five floating 3D shapes.** They render in Figma and survive
   `contentsOnly`, but no level of `get_metadata` or `get_design_context` will list
   them — no node id, no asset, no coordinates. The team is sending the files
   separately. `Hero.tsx` ships without them. Placements measured off the 1440
   screenshot, as fractions of the hero box (left / top, width as % of hero width):

   | Shape | left | top | width |
   |---|---|---|---|
   | green leaf | 19.1% | 1.5% | 7.0% |
   | pink asterisk | 58.6% | 9.2% | 9.8% |
   | yellow ring | 48.0% | 50.7% | 9.6% |
   | blue star disc | 23.2% | 74.9% | 9.8% |
   | pink striped ellipse | 79.3% | 77.3% | 8.6% |

   They are decorative: give them `aria-hidden`, `pointer-events-none`,
   `decoding="async"` and no `loading="lazy"` above the fold.

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
15. The five hero 3D shapes, and the white brand lockup with text outlined.
16. Higher-resolution About cards 2 and 3, and the IOGA original (its crop upscales 1.4x).

**Destinations not yet specified**
17. Rizlum / HR / ITS, View All Work, and Discover Our Story have no targets.

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
