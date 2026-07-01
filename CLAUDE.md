# Officience Landing Page

## Project Overview
Single-page marketing website for Officience, a Vietnamese tech services company. Currently themed for the 20th anniversary.

## Tech Stack
- **Framework:** React 18.3 + TypeScript 5.6
- **Build:** Vite 5.4
- **Styling:** Tailwind CSS (via CDN script tag in index.html)
- **Animations:** Framer Motion 11.11
- **3D:** React Three Fiber + Three.js (blob canvas, currently unused)
- **Icons:** Lucide React
- **Fonts:** Lexend (headings), Montserrat (body) via Google Fonts
- **Deploy:** Vercel (auto-deploys from `main` branch)

## Project Structure
```
officience/
  App.tsx              # Root component, assembles all sections
  index.tsx            # React entry point
  index.html           # HTML template, Tailwind config, global styles
  types.ts             # Shared types
  components/
    Header.tsx         # Sticky nav bar with 20th anniversary logo
    Hero.tsx           # Hero section with tagline
    Capabilities.tsx   # "What We Do" - 4 service cards
    ClientStories.tsx  # Testimonial carousel
    HowWeEngage.tsx    # "Our Approach" engagement section
    WhyOfficience.tsx  # "Why Choose Us" section
    Contact.tsx        # Contact form
    Footer.tsx         # Footer with social links
    SplashScreen.tsx   # Once-per-day splash with 20th anniversary banner
    Survey.tsx         # Contact survey modal
    TermsConditions.tsx # Terms modal
    ui/Section.tsx     # Reusable section wrapper
```

## Key Patterns
- **No router** - SPA with anchor-based navigation (`#capabilities`, `#clients`, etc.)
- **Smooth scroll** via `element.scrollIntoView({ behavior: 'smooth' })`
- **Responsive:** Tailwind breakpoints (`md:`, `lg:`) + CSS `clamp()` for fluid sizing
- **All images** hosted on Cloudflare R2: `pub-e3bac769bc084adbae54275f1413ca66.r2.dev`
- **Color palette:** primary `#1F49BF`, background `#F7F7F7`, custom Tailwind colors in index.html
- **Scrollbar** is hidden (`scrollbar-width: none` + `::-webkit-scrollbar { display: none }`) for seamless edges

## Splash Screen Logic
- Shows once per calendar day (localStorage key: `officience_splash_20th`)
- Desktop: 5s auto-dismiss, Mobile: 4s auto-dismiss
- Skip via X button or clicking backdrop
- Mobile breakpoint: `window.innerWidth < 768`

## Commands
- `npm run dev` - Start dev server (or `npx vite --host`)
- `npm run build` - Production build to `dist/`
- `npm run preview` - Preview production build

## Git & Deploy
- Remote: `github.com/ClaimhSolair/officience-landing.git`
- Branch: `main` (auto-deploys to Vercel)
- Domain: officience.com

## Plan Mode Rule
If a system reminder indicates Plan Mode is active (at any point in a session, including mid-session recurrences), treat it as a hard stop: do not edit files, run non-readonly commands, dispatch subagents that write/execute, or commit/push — regardless of prior approvals given earlier in the conversation. Surface the conflict to the user explicitly and wait for them to say the mode has changed to go-ahead before resuming any execution. Do not infer from past successful tool calls that the restriction no longer applies — ask instead of guessing.
