# Figma adapter — Officience landing page (2026 redesign)

Project instance for the `figma-to-code` skill. Everything project-specific the skill needs lives here.

## Figma

- File key: `cplHg0LeeRaYKPdvSJK37E` ("Officience.com 2026") — MCP server: `http://127.0.0.1:3845/mcp`
- URL `node-id=2202-5139` → tool format `2202:5139` (dash → colon).
- Known nodes (grow this map as you work):
  - `2202:4875` — main desktop redesign frame (1920px artboard)
  - `2255:555` — header nav (4 items: What we do / People Trust Us / Our Approach / Why choose us)
  - `2202:5109` — Why Us 4-quadrant block (1208×575)
  - `2202:5139` — Contact section (desktop) · `2284:2172` — Contact mobile frame
  - `2202:5207` — Footer mobile · `2445:341` — brochure CTA (sharp rectangle)
  - Survey (page `2148:826`): work flow `2195:2838` step1 · `2195:3012` step2 (Q4 numbering per `2195:3171`) · `2195:3332` step3; category `2195:3513` picker · `2195:3809` Intern+Fulltime detail (NO CV upload box) · `2195:2174` Coworking · `2195:2309` Partnership · `2195:2614` Other. `_fill` siblings = selected/valid states.

## Assets

- Source folder: `assets-src/` (relative paths become R2 object keys)
- Drop folder for user exports: `clients/` or any root folder agreed per task (left untracked)
- Originals backup before overwriting: `.logo-orig-backup/` (git-ignored)
- Upload command: `npm run upload-assets` (wrangler → R2; creds in git-ignored `.env`) — **approval-gated**
- Bucket: R2 `redesign` → public `https://pub-37210447316445838bf89f8613ac9ea5.r2.dev/<key>` (the pre-redesign production site uses a different bucket, `pub-e3bac769…` — don't touch it)
- Cache-bust: `ASSET_VERSION` in `assets.ts` — bump on **every** re-upload. R2 overwrites objects in place (old `?v=` URLs serve new bytes); r2.dev sends no `Cache-Control`, so verify fresh bytes with a never-used `?cb=<guid>` and if a stale response got cached under the new `?v=N`, bump once more.
- Image processing: Python + Pillow (installed; `magick` is NOT) — RGBA → soft white-key ramp min(r,g,b) 236→250 → `getbbox()` crop.

## Design tokens

- Tailwind via CDN, configured in `index.html` (supports `max-md:` variants + `!` important).
- Type tokens: `t-*` classes (e.g. `t-display-xl`, `t-body-lg`) defined in `index.html`; `t-body-lg` line-height is 1.625 (=26px) per Figma Body-lg. Mobile clamp floors: display-xl 30, display-md 24, h2 20, h3 18 (caps keep desktop identical).
- Radii/spacing: `fig`/`rounded-fig-*` tokens. Palette: primary `#1F49BF`, background `#F7F7F7`; capability hover chains `#1F49BF→#000086→#000050` (filled) and `#1F49BF→#63A4FC→#000086` (text links).
- Fonts: Lexend (headings), Montserrat (body) via Google Fonts.

## Verification

- Widths: 320 / 375 / 768 / 1024 / 1280 / 1440 (+1920 for the artboard). Build check: `npm run build` (tsc -b).
- Preview quirks (all confirmed in this project):
  - `preview_screenshot` hangs (framer rAF never settles) — use `preview_eval` geometry + `preview_snapshot`.
  - Preview tab is `document.hidden` → rAF frozen → framer `AnimatePresence mode="wait"` modals (Survey) can't advance past step 0; verify on the first mounted step.
  - Preview reports `prefers-reduced-motion: reduce` and freezes CSS animations at frame 0 — verify wiring (keyframes exist), not motion.
  - Overflow: compare against `document.documentElement.clientWidth`, not `window.innerWidth`.
  - The survey email function (`api/survey.ts`, Node runtime) does NOT run under `vite` — e2e only on a Vercel deploy.

## Standing divergences from Figma (user-approved — do NOT "correct" back)

- Header is compact (~88px steady; logo fixed `h-[56px] md:h-[72px]`), NOT Figma's 120.5px. Never reintroduce vw/clamp on the logo height.
- Header content is double-guttered (1520px span vs Figma's 1720) — shown to user, intentionally kept.
- Hero icon band is static (`bg-repeat-x` rows), not a marquee.
- Survey talent flow has NO CV upload box (links-only; portfolio field required).

## Project hard rules

- `main` = live production (officience.com) — untouched until an explicitly approved merge. Work on `redesign/2026`; a push there rebuilds the Vercel preview (access-protected; keep protection on).
- git commit/push and R2 uploads: only on explicit user approval, every time.
- Plan Mode rule: see `CLAUDE.md` — any Plan Mode signal is a hard stop on execution.
- Merge conflicts with `main` exist by design — do not resolve until merge time with explicit approval.
