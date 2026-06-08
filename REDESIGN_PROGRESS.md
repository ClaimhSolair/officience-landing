# Officience 2026 Redesign — Progress Memory

> Working memory for the 2026 redesign. Survives context resets. Last updated: 2026-06-05.
> Approved plan lives at: `C:\Users\ADMIN\.claude\plans\open-the-spec-plan-crystalline-peach.md`

## PIXEL-FAITHFUL PASS — COMPLETE (2026-06-05)
Second pass: rebuilt every section to Figma's exact tokens/geometry (frame `2202:4875`). All 12 pass-tasks (#13–24) done.
- **Design-token layer** in `index.html`: typography utility classes `.t-display-xl/.t-display-md/.t-h2/.t-h3/.t-h4/.t-subtitle/.t-body-xl/.t-body-lg` (clamp-anchored to exact Figma px), Figma colors (`text-default #0f1219`, `subtitle #5a5a5a`, `link #4b4d53`, `sec-100 #ffbfc7`, etc.), spacing/radius/shadow tokens.
- **Container model**: `Section`/`Container` in `ui/Section.tsx` = `max-w-content (1720px)` + `px-[clamp(24px,7vw,100px)]`; `App.tsx` main gap `clamp(56,9vw,120px)`. **Section order fixed** → Hero→Services→Approach→Testimonials→WhyUs→Contact→Footer.
- **ROOT-CAUSE FIX**: all Figma-exported SVGs had `preserveAspectRatio="none" width/height=100%` → browser fell back to ~300px and squished art. Fixed every SVG to carry real `viewBox` dims (`scripts` inline node fixer). Hero tiles now true 800×160 (5:1).
- **Cache-busting**: `assets.ts` now appends `?v=<ASSET_VERSION>` (currently `3`) to every URL — R2 dev URL sends no Cache-Control, so bump `ASSET_VERSION` on any re-upload. New assets added: `contact/pin.svg`, `footer/{facebook,youtube,linkedin}.svg`.
- Per-section faithful specifics: Header (#f7f7f7 bar, Montserrat-20 nav, square CTA), Hero (Display-xl blue title, milestones Display-md/H4, 2 marquee rows), Services (radius-4 cards, ↗ brochure btn, real bullets), Approach (no CTA, blue H2 steps, mascot), Testimonials (20px quotes, H3 names, logos uniform-height grayscale marquee), Why Us (4-quadrant pinwheel hugging center cross + 138px icon), Contact (white card w/ addresses INSIDE incl. real Japan + HCMC OffyPlex/CrunchBase), Footer (white social glyphs, dynamic year, banner).
- **Verified**: `npm run build` green (317 kB / 100 kB gzip); no overflow at 1920/1536/1440/1366/375; sections diffed against Figma `get_screenshot`.
- **NOT committed** — still awaiting explicit approval to commit/push `redesign/2026`.

---
### (Pass 1 notes below — superseded by the faithful pass above)

## Hard constraints (do not violate)
- **Branch isolation:** ALL work on `redesign/2026`. **Never** commit/push/merge to `main` without explicit user approval. Production (officience.com) must stay live.
- **No commit/push yet** — awaiting user go-ahead. A push to `redesign/2026` generates the Vercel preview URL.
- **`.env` is git-ignored and holds a secret** (Cloudflare token). Never commit it. Consider rotating the token after the build (it appeared in chat).

## Current git state
- Branch: `redesign/2026` (cut from `main`). `main` untouched.
- Modified (10 components + config): App.tsx, components/{Capabilities,ClientStories,Contact,Footer,Header,Hero,HowWeEngage,Survey,WhyOfficience}.tsx, index.html, package.json, package-lock.json.
- New untracked: assets.ts, wrangler.toml, scripts/, assets-src/, .gitignore, CLAUDE.md.
- Nothing staged/committed.

## Tech stack (unchanged)
React 18.3 + TS 5.6 + Vite 5.4, Tailwind **via CDN** (config in index.html — only colors/fonts extended, NO custom spacing scale → use arbitrary values `px-[100px]` or inline `style`+`clamp()`), Framer Motion 11, Lucide icons. Fonts: Lexend (`font-sans`), Montserrat (`font-body`).

## Asset pipeline (COMPLETE — 27/27 uploaded, verified HTTP 200)
- R2 account `d9f699dcdee9916fea0acbcbe505d117`, bucket `redesign`, public base `https://pub-37210447316445838bf89f8613ac9ea5.r2.dev/`.
- Source files in `assets-src/` (organized by section). Re-upload via `npm run upload-assets` (reads `.env`, walks assets-src, `wrangler r2 object put`).
- All URLs centralized in `assets.ts` (`ASSETS.header/hero/services/approach/testimonials/clients/whyus/footer`).
- SVGs carry colors via `fill="var(--fill-0, #hex)"` fallbacks → render correctly as `<img>`.

## Section status (all sections built + real assets mapped + visually verified)
| Section | File | Status |
|---|---|---|
| Header | Header.tsx | ✅ R2 logo (wordmark included), nav: What we do/Services(#capabilities), Showcase(ext demo.officience.com/work), Career(ext LinkedIn jobs), Why choose us(#why-us); CTA→#contact |
| Hero | Hero.tsx | ✅ blue title clamp, milestones 20/200+/6/500+, 2 opposite-direction icon marquees |
| Services | Capabilities.tsx | ✅ 4 cards, real icons, exact Figma copy, "View General Brochure" + per-card links (demo.officience.com/brochure) |
| Approach | HowWeEngage.tsx | ✅ split: title+mascot left, 3 numbered cards (01 Engage/02 Collaborate/03 Run) right; CTA→onOpenSurvey |
| Testimonials | ClientStories.tsx | ✅ "People Trust Us", 3 cards w/ author photos+quote icon, 12 client logos grayscale marquee |
| Why Us | WhyOfficience.tsx | ✅ 4-quadrant cross, real center icon, fixed overlap via directional inner padding |
| Contact | Contact.tsx | ✅ "Let's Build Together" + 2 branch options (work/category), 4 offices grid |
| Survey | Survey.tsx | ✅ two-branch wizard (work=2 steps, category=2 steps) + completion; FormSubmit.co |
| Footer | Footer.tsx | ✅ R2 white logo + banner, social 45px circles, dynamic year © {getFullYear()} |

## Build/verify
- `npm run build` (`tsc -b && vite build`) passes — 318 kB JS / 100 kB gzip. No console errors.
- Verified visually at 1440px + 375px via preview. Dev server on port 5173.

## Known intentional deviations from Figma
- Figma typo "Anlytics" → kept correct **"Analytics"**.
- Figma hardcoded "2025" footer → kept **dynamic year** (per user decision).

## Survey — DONE (2026-06-08, pixel-faithful to Figma)
Rebuilt `components/Survey.tsx` to the Figma survey frames (page `2148:826`, nodes `2195:xxxx`). Both flows are 3-step with a labelled 3-tab progress bar (work: Requirements→Expectations→Completed; category: Category→Detail→Completed).
- Config-driven (WORK_OPTIONS / CATEGORY_CARDS / DETAIL_OPTIONS / TAG_STYLES / PROGRESS_LABELS) + internal primitives (ProgressBar, ChipGroup, CardOptions, TextField, TextArea). Props unchanged → no App/Contact edits.
- Exact copy/options; colored "solve" tags (Product/Design/Data/Operation/General → Secondary/Green/Orange/Primary/Gray 50+700 tints, arbitrary Tailwind values, no index.html change). Modal 800px, radius/shadow/tokens per Figma.
- **Button gating**: Next/Submit greyed (`#d9d9d9`) until required (*) fields valid, then blue (`isStepValid`). Work step2 dropped file upload (textarea only); CV PDF upload lives only in Intern/Full-time detail. Category details: Intern+Fulltime (shared) / Coworking / Partnership / Other.
- **Submission moved off FormSubmit → own Vercel Edge function** `api/survey.ts` + **Resend** (2026-06-08). All flows POST `FormData` to `/api/survey`; the function emails the team an HTML table + **CV PDF attached** (Resend), `reply_to`=candidate. Recipients live server-side (env-overridable: `SURVEY_TO`/`SURVEY_CC`/`RESEND_FROM`; default To/CC = the original list). CV capped at 4 MB (Edge body limit) — guarded in UI + function. Frontend now reads the response: success → completed screen, failure → error banner + retry. `vercel.json` SPA rewrite excludes `/api`. **Setup steps for going live in `SURVEY_SETUP.md`** (needs `RESEND_API_KEY` in Vercel env + domain verification to email the whole team).
- Minor faithful deviations: removed asterisk from group labels "3. Contact details" & category picker (fields/gating handle required); category-detail questions left un-numbered (Figma numbering was inconsistent 2/3/4).
- Verified: `npm run build` green (322 kB / 101 kB gz); all 4 flows + gating + completion screen diffed vs Figma `get_screenshot`; responsive at 1280/375 (2-col grids stack, modal scrolls in 90vh, no overflow). Completion tested with stubbed fetch (no real test emails sent).

## Open items (awaiting user input — NOT actioned)
1. **⏳ BACKLOG — Resend setup (survey emails go live):** Survey now posts to `api/survey.ts` but emails won't actually send until the user provisions Resend. Steps in `SURVEY_SETUP.md`: (a) create Resend account → `RESEND_API_KEY` in Vercel env; (b) verify `officience.com` domain (SPF/DKIM DNS) + set `RESEND_FROM` so it can email the whole team (until then only the Resend account owner receives); (c) deploy preview / `vercel dev` and submit a real Internship app w/ small PDF to confirm attachment + reply-to. **Remind the user to do this later.**
2. **Japan office address** — added (Ark Mori Bldg, Tokyo); confirm correct.
3. **Footer "About us"** → placeholder `https://demo.officience.com/about`.
4. Confirm `demo.officience.com/brochure` and `demo.officience.com/work` (Showcase) are live.
5. **Commit + push to `redesign/2026`** for Vercel preview — requires explicit approval.

## How to resume / re-verify
- `npm run dev` → http://localhost:5173
- Re-upload assets: drop files in `assets-src/` → `npm run upload-assets`
- Full transcript (pre-compaction): `C:\Users\ADMIN\.claude\projects\C--Projects-Landing---Main-officience-vercel-ready-officience\14334a01-390c-4184-aba7-62e66ebfeb74.jsonl`
