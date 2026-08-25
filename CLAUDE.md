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
    ClientStories.tsx  # Testimonial carousel
    HowWeEngage.tsx    # "Our Approach" - 3 ruled steps with inline pinwheel marks
    WhyOfficience.tsx  # "Why Choose Us" section
    Contact.tsx        # Contact section with survey entry points
    Footer.tsx         # Footer with social links
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
- Sept-2026 redesign work happens on `redesign/sept-2026` (cut from `main` at `2b0088d`). Merge `main` in at every checkpoint boundary. `main` stays untouched until an explicitly approved merge.
- git commit/push and R2 uploads require explicit user approval, every time.

## Plan Mode Rule
If a system reminder indicates Plan Mode is active (at any point in a session, including mid-session recurrences), treat it as a hard stop: do not edit files, run non-readonly commands, dispatch subagents that write/execute, or commit/push — regardless of prior approvals given earlier in the conversation. Surface the conflict to the user explicitly and wait for them to say the mode has changed to go-ahead before resuming any execution. Do not infer from past successful tool calls that the restriction no longer applies — ask instead of guessing.
