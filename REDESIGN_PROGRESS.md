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
| Header | Header.tsx | ✅ R2 logo, nav unchanged; CTA→#contact. **Compact bar (2026-06-09) — see Header+Hero refinements section below** |
| Hero | Hero.tsx | ✅ blue title clamp, milestones 20/200+/6/500+, **2 STATIC icon rows** (marquee de-animated 2026-06-09) |
| Services | Capabilities.tsx | ✅ 4 cards, real icons, exact Figma copy, "View General Brochure" + per-card links (demo.officience.com/brochure) |
| Approach | HowWeEngage.tsx | ✅ split: title+mascot left, 3 numbered cards (01 Engage/02 Collaborate/03 Run) right; CTA→onOpenSurvey |
| Testimonials | ClientStories.tsx | ✅ "People Trust Us", 3 cards w/ author photos+quote icon, 12 client logos grayscale marquee |
| Why Us | WhyOfficience.tsx | ✅ 4-quadrant cross, real center icon. **Block now aspect-[1208/575] + justify-center per quadrant (2026-06-09) — see Why-Us layout fix below** |
| Contact | Contact.tsx | ✅ "Let's Build Together" + 2 branch options (work/category), 4 offices grid |
| Survey | Survey.tsx | ✅ two-branch wizard (work=2 steps, category=2 steps) + completion; FormSubmit.co |
| Footer | Footer.tsx | ✅ R2 white logo + banner, social 45px circles, dynamic year © {getFullYear()}. **"Terms & Conditions" link → tabbed legal modal (2026-06-09) — see Legal modal section below** |

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

## Header + Hero refinements — DONE & PUSHED (2026-06-09)
User flagged two unrequested changes from the `2c3a658` checkpoint and asked to fix only those. Committed on `redesign/2026` (NOT yet merged to `main`):
- **Hero icon band → static** (`Hero.tsx`): replaced the looping `MarqueeRow` (animate-marquee) with `IconRow` — two static full-width `bg-repeat-x` rows (`backgroundSize:auto 100%`), same `iconsRow1`/`iconsRow2` SVGs, 2-row Figma layout kept. `animate-marquee` keyframes in `index.html` left in place but now unused.
- **Header → compact, fixed logo** (`Header.tsx`): user wants a compact bar (NOT Figma node 2255-555's 120.5px) with a consistent logo. Final = CTA button `py-[12px]`, header padding `py-[8px]`, logo **`h-[56px] md:h-[72px]`** (fixed px, 72px desktop) → **steady ~88px header at every window width**.
  - **Two gotchas worth remembering:**
    1. 1.25× bump was first applied to an already-shrunk 48px logo (=60px) → *smaller* than the original 72.5px, looked unchanged. Size against the original.
    2. A `vw`-based logo (`clamp(48px,4.7vw,90px)`) makes header height track **window width** (75px@1253, 81px@1392, 106px maximized). User read this as a "local vs Vercel build difference" — it was just different browser-window widths (verified local@1253 == Vercel@1253 == 74.89px). **For sizes the user wants consistent across machines, use fixed px / breakpoints, NOT vw.**
- Commits: `f265bf6` (static band + first compaction) → `289971e` (logo 90px) → **`9cb4f36`** (fixed 72px logo, final). All pushed; Vercel Preview green. Branch-alias URL `officience-landing-git-redesign-2026-ldks-projects-e4d63e2c.vercel.app` always serves latest (per-commit hash URLs are immutable — that caused repeated "changes not showing" confusion).
- Left untouched per user: header content double-gutter (`max-w-content` + `px-100` → 1520px span vs Figma 1720; shown to user, declined).

## Legal modal — General T&C + Privacy in one tabbed modal — DONE & PUSHED (2026-06-09)
User supplied `Terms & Conditions 2025 (LTD).docx` (a 23-section B2B services contract) and asked to add it. Discovered the footer **"Terms & Conditions"** link actually opened a **Privacy Policy**. Per user decisions: **combine both in ONE modal, two tabs** (Terms & Conditions default + Privacy Policy), **restyle to 2026 tokens**, footer label stays "Terms & Conditions".
- **New `components/legalContent.ts`**: typed model (`LegalSection`→`LegalClause`→`LegalBlock` of `p`/`ul`/`address`). `TERMS_SECTIONS` = 23 sections transcribed **verbatim** from the docx (proper curly quotes/dashes, subsections 4.1–14.4, 5 bullet lists, §20 address, closing line). `PRIVACY_SECTIONS` = the old 14-section policy migrated unchanged.
- **Rewrote `components/TermsConditions.tsx`** (props `{isOpen,onClose}` unchanged): tabbed shell matching the Survey modal (`bg-bg-secondary max-w-[900px] rounded-fig-m shadow-fig-xs`), `t-h2/t-h3/t-h4`/`t-body-lg` tokens, primary-blue header+underline tabs, shared `LegalDocument` renderer that **auto-linkifies emails (`mailto:`) and URLs**. Resets to Terms tab on open, resets scroll on tab switch (`key={tab}` on body), body-scroll lock, closes on Esc/backdrop/X/Close. `Footer.tsx`/`App.tsx` wiring untouched.
- **Extraction gotcha**: docx text via `zipfile`+regex — use precise `<w:t(?:\s[^>]*)?>` (plain `<w:t[^>]*>` also matches `<w:tbl>`/`<w:tc>` and leaks table XML); decode `word/document.xml` as utf-8 (smart quotes are real Unicode, NOT cp1252 here).
- **Source discrepancy left verbatim (flagged to user, NOT reconciled):** Privacy §14 address = "Ward 15", new T&C §20 = "Ward 12". Also fixed an obvious missing-space typo in T&C §16 ("OFFICIENCE.Each" → "OFFICIENCE. Each") — punctuation only.
- Commit: **`a4e4b4c`**. Pushed; build green (345 kB / 110 kB gz).

## Why-Us 4-quadrant layout fix — DONE & PUSHED (2026-06-09)
User: the "Why Choose Us" 4 elements' spacing/layout was off vs Figma (node 2202-5109, "Why Us Items" = **1208×575**). Build had huge empty bands above/below the centre icon.
- **Root cause** (`WhyOfficience.tsx`): quadrants pinned text to the OUTER edge (`justify-start` top row / `justify-end` bottom) with `min-h` up to 290px each → top labels shoved to top, bottom labels to bottom. Figma centres each text in its quadrant around the cross.
- **Fix**: block now `aspect-[1208/575]` (tracks **container** width, not vw — same lesson as the header logo); `justify-center` each cell; inner gap to the cross `pr/pl-[clamp(20px,3vw,48px)]` (Figma ≈36–48px); `min-h-[480px]` floor so the `md`/tablet range can't collide with the icon (desktop aspect height 575 overrides it). Mobile stacked layout untouched.
- Verified 1920/1440/768: exact **1208×575** at desktop, no text/icon overlap at any width. Commit **`f2277dd`**.

## Open items (awaiting user input — NOT actioned)
0. **Two T&C content confirmations (2026-06-09):** (a) address Ward 15 (Privacy) vs Ward 12 (T&C) — confirm which is correct; (b) confirm the §16 missing-space typo fix is acceptable.
1. **⏳ BACKLOG — Resend setup (survey emails go live):** Survey now posts to `api/survey.ts` but emails won't actually send until the user provisions Resend. Steps in `SURVEY_SETUP.md`: (a) create Resend account → `RESEND_API_KEY` in Vercel env; (b) verify `officience.com` domain (SPF/DKIM DNS) + set `RESEND_FROM` so it can email the whole team (until then only the Resend account owner receives); (c) deploy preview / `vercel dev` and submit a real Internship app w/ small PDF to confirm attachment + reply-to. **Remind the user to do this later.**
2. **Japan office address** — added (Ark Mori Bldg, Tokyo); confirm correct.
3. **Footer "About us"** → placeholder `https://demo.officience.com/about`.
4. Confirm `demo.officience.com/brochure` and `demo.officience.com/work` (Showcase) are live.
5. **Commit + push to `redesign/2026`** for Vercel preview — requires explicit approval.

## How to resume / re-verify
- `npm run dev` → http://localhost:5173
- Re-upload assets: drop files in `assets-src/` → `npm run upload-assets`
- Full transcript (pre-compaction): `C:\Users\ADMIN\.claude\projects\C--Projects-Landing---Main-officience-vercel-ready-officience\14334a01-390c-4184-aba7-62e66ebfeb74.jsonl`
