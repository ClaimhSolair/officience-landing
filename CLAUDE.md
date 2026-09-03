# Officience Landing Page

## Project Overview
Marketing website for Officience, a Vietnamese tech services company. One long home page plus two standalone legal pages. Currently mid-migration to the **Sept-2026 design** on branch `redesign/sept-2026`; `main` is the live 20th-anniversary build.

## Tech Stack
- **Framework:** React 18.3 + TypeScript 5.6
- **Routing:** react-router-dom 6.30 (`BrowserRouter`)
- **Build:** Vite 5.4
- **Styling:** Tailwind CSS (via CDN script tag in index.html)
- **Animations:** Framer Motion 11.11
- **Icons:** Lucide React
- **Fonts:** Lexend (headings), Montserrat (body) via Google Fonts — weights 300–700
- **Deploy:** Vercel (auto-deploys from `main` branch)

## Project Structure
```
officience/
  App.tsx              # Route table + the Layout shell every route renders inside
  index.tsx            # React entry point, mounts BrowserRouter
  index.html           # HTML template, Tailwind config, global styles, analytics
  types.ts             # Shared types (SurveyBranch, LegalDoc, …)
  assets.ts            # R2 image URLs; names all three buckets, selects one
  pages/
    HomePage.tsx       # The long marketing page; owns its own vertical rhythm
    LegalPage.tsx      # /terms-of-use and /privacy-policy (lazy-loaded)
  lib/
    modal.ts           # iOS-safe body scroll lock + focus trap for overlays
    pageMeta.ts        # usePageView: sets document.title and reports the pageview
  components/
    Header.tsx         # Sticky nav bar
    Hero.tsx           # Hero section with tagline
    Capabilities.tsx   # "Our Services" - 4 ruled list rows, brochure links
    ClientStories.tsx  # "People Trust Us" - 3 fixed quote cards, no carousel
    LogoMarquee.tsx    # Client logo wall - looping greyscale marquee, colour on hover
    HowWeEngage.tsx    # "Our Approach" - 3 ruled steps with inline pinwheel marks
    WhyOfficience.tsx  # "Why Choose Us" - 4 values in a crosshair, inlined pinwheel
    Contact.tsx        # "Connect With Us" - survey entry rows + 6 offices, own blue
    Footer.tsx         # Footer - brand, Company links, partner tiles, legal row
    SplashScreen.tsx   # Once-per-day splash (home route only)
    Survey.tsx         # Contact survey modal
    CookieConsent.tsx  # Consent banner (Google Consent Mode v2)
    LegalDocument.tsx  # Renders structured legal copy from legalContent.ts
    ScrollManager.tsx  # Scroll position and hash targets on route change
    ErrorBoundary.tsx  # Recovers from stale lazy chunks after a redeploy
    navigation.ts      # Every nav destination, in one table
    ui/                # Container, Button, SectionBadge, ApproachMark, CarouselDots
```

## Key Patterns
- **Routes:** `/` (home), `/terms-of-use`, `/privacy-policy`; anything else redirects to `/`. `vercel.json` rewrites all non-`/api` paths to index.html.
- **Legal pages are noindex** (`X-Robots-Tag` in `vercel.json`) and are deliberately *not* in `sitemap.xml` — the canonical and `og:url` in index.html are static and pinned to `/`.
- **Section anchors** on the home page (`#capabilities`, `#clients`, …) double as the Vercel Analytics `section_view` keys — renaming one breaks dashboard continuity. Source of truth: `SECTION_IDS` in `components/navigation.ts`.
- **Cross-page anchors** use `<Link to="/#capabilities">`; `ScrollManager` retries on a timer until the target mounts.
- **Back/forward is never hijacked** — `ScrollManager` skips POP so the browser restores scroll itself.
- **Type scale:** fixed-px Tailwind `fontSize` utilities, one per Figma style (`text-display-xl`, `text-h1`…`text-h4`, `text-subtitle-1/2`, `text-body-xl/md`, `text-btn-md/lg`). Breakpoints **swap style** (`text-h1 lg:text-display-sm`), they don't interpolate. The old `.t-*` CSS classes in index.html are frozen legacy for unmigrated components — don't edit or rename them.
- **Content column:** `components/ui/Container.tsx` — `max-w-content-2` (1792px) + `px-fig-16 lg:px-fig-24` reproduces all three artboard gutters.
- **Responsive:** Tailwind breakpoints (`md:`, `lg:`); mobile is the base layer, desktop at `lg:`.
- **Color palette:** primary `#1F49BF`, background `#F7F7F7`, custom Tailwind colors in index.html
- **Scrollbar** is hidden globally (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`); surfaces that need one opt back in with `.menu-scroll`
- **Motion** respects `prefers-reduced-motion`: `<MotionConfig reducedMotion="user">` wraps the app and `scroll-behavior: smooth` sits behind a `no-preference` media query.

## Image buckets (Cloudflare R2)
Three buckets, all named in `assets.ts`:
- `pub-e3bac769…` — legacy; splash-screen art only.
- `pub-37210447…` — **production origin for officience.com. Read-only during the redesign** — uploads overwrite in place with no cache header and no rollback.
- `pub-767c5aeb…` — staging; every Sept-2026 asset. Becomes the production origin at merge (URL flip, no copy).

Upload with `npm run upload-assets` (approval-gated, and it re-uploads *all* of `assets-src/`). Bump `ASSET_VERSION` on every re-upload.

## Splash Screen Logic
- Rendered on the `/` route only. Decision 2026-08-20: **kept as-is for now**, so it still serves 20th-anniversary art from the legacy bucket and that bucket's preconnect stays. If it is ever reskinned, give it a new localStorage key so it re-shows.
- Shows once per calendar day (localStorage key: `officience_splash_20th`)
- Desktop: 5s auto-dismiss, Mobile: 4s auto-dismiss
- Skip via X button or clicking backdrop
- Mobile breakpoint: `window.innerWidth < 768`

## Survey Email Routing
- Survey submissions POST to `api/survey.ts` (Vercel Node function; **does not run under Vite** — e2e only on a Vercel deploy).
- Recipient is chosen per flow via `CATEGORY_ROUTES` (keyed on the `category` field, which must match the `CATEGORY_CARDS` labels in `Survey.tsx`):
  - Internship, Full-time career → `jobs@officience.com`
  - Co-working space → `hr@officience.com`
  - Work with Officience (Flow 1), Partnership & referral, Other inquiries → `contact@officience.com` (via `SURVEY_TO` env, else `DEFAULT_TO`)
- `SURVEY_TO` env now only overrides the **fallback** recipient (the contact@ flows), not the jobs@/hr@ routes.
- SMTP always authenticates as `SMTP_USER` (contact@officience.com) and sends TO the routed address; visitor's email is set as reply-to.

## Commands
- `npm run dev` - Start dev server (or `npx vite --host`)
- `npm run build` - Production build to `dist/`
- `npm run preview` - Preview production build

## Git & Deploy
- Remote: `github.com/ClaimhSolair/officience-landing.git`
- Branch: `main` (auto-deploys to Vercel)
- Domain: officience.com
- All Sept-2026 redesign work belongs on `redesign/sept-2026` (cut from `main` at `2b0088d`). Merge `main` in at every checkpoint boundary. `main` stays untouched until an explicitly approved merge.
- **A `claude/*` worktree branch is a staging area, not a destination.** `redesign/sept-2026` is checked out in the `officience-redesign-2026-7e23e2` worktree, so a session running in any other worktree *cannot* check it out and will quietly pile commits onto its own throwaway branch instead — which is how five commits ended up on `claude/branch-progress-check-dadbb2`. Before the session ends, land them: `git -C <redesign-worktree> merge --ff-only <claude-branch>`. Never write a commit count into this file; it is wrong on the next commit — ask git.
- git commit/push and R2 uploads require explicit user approval, every time.

## Responsive Rules
From a device review that found the same section broken three times. Follow literally.
- **Never pair a fixed pixel dimension with a fluid one.** A fixed height on a fluid width makes the box aspect a function of the viewport: `h-[220px]` gave ratio 1.63 at 390 but **4.50 at 1023**, so `object-cover` discarded 70% of the picture on a tablet; `h-[860px]` gave 1.43 at 1280 against 2.08 at 1920, so the same photo looked squeezed on a scaled laptop. Use `aspect-[w/h]` per breakpoint so every width inside a breakpoint is proportionally identical.
- **A maximised 1920x1080 browser reports ~1910px of viewport**, so `3xl:` (1920px) never fires there. Never put a desktop-critical value behind `3xl:` alone — it belongs at `lg:`/`xl:`, with `3xl:` reserved for genuine >=1920 steps.
- **Artboard-fixed geometry does not survive narrower widths.** Figma's fixed insets, padding and `whitespace-nowrap` are correct only at the artboard width. Before applying them at `lg:`, compute whether the content fits the column at 1024 — if not, move the treatment up a breakpoint (`xl:`/`2xl:`) rather than letting it overflow. Worked examples: the About caption band needs `xl:`, the Client Review heading needs `2xl:whitespace-nowrap`.
- **`body { overflow-x: hidden }` hides overflow from visual review.** A screenshot will happily certify a layout that is silently truncating copy (235px of it, in one case). Measure.

## Verification Procedure — layout changes
A screenshot is not verification. Do this before reporting any layout/responsive change as done.
1. Probe the **real page in an iframe** at **375 / 390 / 768 / 1024 / 1280 / 1440 / 1536 / 1920**. Window resizing is unreliable — it silently no-ops when maximised, and window borders push `innerWidth` just below the breakpoint you are targeting. Set the iframe width instead, and use `outline` not `border` so it does not eat pixels.
2. Assert at every width:
   - no leaf element's right edge exceeds the viewport, **after excluding ancestors that clip** (`overflow-x` hidden/clip/auto/scroll) — otherwise off-canvas drawers and the logo marquee give false positives;
   - every `aspect-ratio` box reports the **same ratio** within a breakpoint;
   - no absolutely positioned band needs more height than it has (`max(child.scrollHeight) + padding <= height`).
3. Check the state you were **not** told about. A bug reported at one width usually lives at the others too.
4. Traps: `document.hidden === true` freezes rAF and blanks screenshots — check it first. `loading="lazy"` never fires for offscreen images, so set `loading='eager'` before measuring. A fresh HMR reload can paint a blank image briefly — re-read before concluding. Long CDP evaluations time out around 45s, so probe two or three widths per call.

## Verification Procedure — motion & state changes
From the Sept-2026 motion retro (v4→v6.4): every lost review round was a *default* state never probed. Do this before reporting any motion/animation change as done.
- **Probe the default state first, the built state second.** The axis matrix: width × viewport height × `prefers-reduced-motion` (**both states, every suite** — Windows reports `reduce` whenever "Animation effects" is off, which is common; a rig that forces `no-preference` to make motion visible is structurally unable to see motion's absence) × origin (localhost vs the deployed host — `sessionStorage`/`localStorage` overrides are per-origin and do not travel) × first-visit state (splash, consent banner, empty storage).
- **Two strikes ⇒ change the mechanism, not the parameter.** If the same complaint survives one parameter tweak (a threshold, an offset, a duration), the shape is wrong. Worked example: the laptop-pin saga took three rounds because round two tightened a fit threshold (≥845px) instead of switching to scale-to-fit.
- **Observer/mover checks before committing motion code** (each has bitten twice as prose): a `useInView`/`whileInView` target must not be the element that is transformed, nor sit inside its own `overflow-hidden` window; initial gate states must equal the fallback (start `false`, enhance after measurement — an optimistic initial strands MotionValues); never re-prop one motion element between style-MotionValue and variant modes — branch to keyed elements.
- **Stranger-test every handoff.** Before declaring a link shareable, open the exact URL as a stranger: fresh profile, logged out, no query params. Every claim in a handoff message is either verified (say how) or labeled unverified — a handoff claim is a premise, same rule as choices. Vercel preview URLs are SSO-walled (bare `*.vercel.app` 302s to a login); share the Shareable Link, never a guessed alias.
- **Scan memory/notes for the target environment's name before shipping to it.** The reduce-motion trap was on file in three places and still shipped.

## Figma Fidelity Rules
- **`get_design_context` omits `object-fit`.** Infer the fill mode from `get_screenshot`, and check it **per node** — the About section alone uses a manual crop, a full stretch, and a 1.4-1.7x zoom crop across three sibling cards.
- **Different framing per breakpoint is art direction, and `srcset` cannot express it** (srcset only varies resolution). Use `<picture>` with a media source, and bake the crop into the file at the artboard's box aspect so `object-fit` is a no-op and CSS distorts nothing.
- **Reproduce what the artboard draws, including its mistakes, and flag them.** Never silently "improve" the design — deviating is the user's call, and users sometimes diverge from their own designs deliberately.
- Node IDs, per-section rulings and open questions live in `.claude/figma-adapter.md`. **Read its index before changing a section**; the numbered rulings record decisions already taken — do not re-litigate or "fix" them back.

## Asset & Cache Rules
- **Bump `ASSET_VERSION` before the upload that overwrites an existing key — once.** `r2.dev` sends no `Cache-Control`, so changing bytes under an already-served `?v=N` leaves the browser serving the stale file into the new layout. That cost three bumps in one session.
- Verify fresh bytes with a **never-used `?cb=<guid>`**, never with `?v=N`.
- `npm run upload-assets` re-uploads **all** of `assets-src/`. `.env` does not exist in a worktree: copy it from the parent checkout and force `R2_BUCKET=redesignsept2026` — the parent's says `redesign`, which is **production**.
- Never run a white-key / background-removal pass over white-on-transparent artwork: it has nothing to key and destroys the logo.
- Trim transparent margins and size exports to ~2-3x their **displayed** size. An asset that reproduces a padded Figma image box wastes its resolution on empty space and reads as blurry.

## Language — ASD-STE100 Simplified Technical English
Write all user-facing text in ASD-STE100 Simplified Technical English. This applies to chat replies, commit messages, reports, and Markdown documents.
- Use the active voice. Write "the probe reads the value", not "the value is read by the probe".
- Keep sentences short. Use 20 words maximum for an instruction. Use 25 words maximum for a description.
- Give one instruction in one sentence.
- Use the simple present tense when it is clear. Do not use the perfect or progressive tense if a simple tense says the same thing.
- Use one word for one meaning. Do not change the word for the same idea in the same text.
- Use a simple word when a technical word is not necessary.
- Use three nouns maximum together in a noun cluster.
- Write an article ("the" or "a") before a noun.
- Write positive sentences. Do not put two negatives in one sentence.
- Write six sentences maximum in a paragraph.
- Keep every technical name and technical verb exactly as it is: code identifiers, file paths, commands, branch names, and commit hashes do not change.
- **Code comments follow STE too.** Write every new comment and every comment you edit in STE. Keep the comment density of the file, but write the sentences in STE. This rule is stronger than the rule to match the idiom of the nearby code.
- Do not rewrite an existing comment only to make it STE. Change a comment when you change the code it explains. The file style becomes STE over time.

## Working Rules
- **Do not offer a choice built on an unverified premise.** If an option asserts a fact ("identical composition", "no visual change", "same framing"), verify it first or say in the option that it is unverified. An approval inherits the framing of the question, so a wrong premise makes the user's "yes" mean something they did not agree to.
- **Treat your own earlier flags as binding findings.** Re-read what you recorded about a breakpoint or node before changing it. A broad goal ("make it fully visible") is exactly what steamrolls a narrow, correct, already-documented constraint — and that regression is invisible to you and obvious to the user.
- When a new fix contradicts a prior flag, **the contradiction is the decision** — surface it, do not resolve it silently in favour of the newer goal.

## Plan Mode Rule
If a system reminder indicates Plan Mode is active (at any point in a session, including mid-session recurrences), treat it as a hard stop: do not edit files, run non-readonly commands, dispatch subagents that write/execute, or commit/push — regardless of prior approvals given earlier in the conversation. Surface the conflict to the user explicitly and wait for them to say the mode has changed to go-ahead before resuming any execution. Do not infer from past successful tool calls that the restriction no longer applies — ask instead of guessing.
