# Figma adapter — Officience landing page (Sept-2026 redesign)

Project instance for the `figma-to-code` skill. Everything project-specific the skill needs lives here.

## Figma

- File key: `cplHg0LeeRaYKPdvSJK37E` ("Officience.com 2026") — MCP server: `http://127.0.0.1:3845/mcp`
- URL `node-id=3129-3829` → tool format `3129:3829` (dash → colon).
- `get_design_context` **times out** on this file (every node tried). Work from
  `get_metadata` (exact geometry) + `get_variable_defs` (bound tokens: type styles,
  colours, spacing, radii) + `get_screenshot`. Between them you get everything the
  reference code would have given you, and the variable dump is more authoritative.
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

## Assets

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
  - Chrome on Windows will not resize below ~500px wide — use device emulation for 390.
  - Overflow: compare against `document.documentElement.clientWidth`, not `window.innerWidth`.
  - The survey email function (`api/survey.ts`, Node runtime) does NOT run under `vite` — e2e only on a Vercel deploy.
  - Vercel `SMTP_USER`/`SMTP_PASS` are branch-filtered to `redesign/2026`; any other branch's preview 500s on submit until they are re-scoped. Rate limit is 5 requests / 10 min / IP.
- Tailwind Play CDN generates classes on demand: a class injected by script needs a
  tick before `getComputedStyle` reflects it. Wait ~400ms when probing tokens.

## Standing divergences from Figma (user-approved — do NOT "correct" back)

- Survey talent flow has NO CV upload box (links-only; portfolio field required).
- Overlay menu gets a scoped `.menu-scroll` scrollbar: `index.html` kills scrollbars
  globally (`scrollbar-width: none` + `::-webkit-scrollbar{display:none}`), and
  Firefox can only approximate the drawn one via `scrollbar-width: thin`.
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
