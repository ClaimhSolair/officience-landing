# Motion adapter — Officience landing (Sept-2026 redesign)

## Stack
- framer-motion 11 (React 18.3 + Vite 5.4). Motion tokens/flags: `lib/motion.ts` — per-effect kill switches in `MOTION`, duration tiers `MS`/`SEC`, `EASE`, `STAGGER`; gate hook `useMotionEnabled()`; force flag `MOTION_FORCED`.
- Reduced-motion wiring: `<MotionConfig reducedMotion={MOTION_FORCED ? 'never' : 'user'}>` in `App.tsx` covers the timed class; **every scrub branches on `motionOn` in its own component**. Resolved state mirrored on `<html data-motion>`: yes.

## Catalog
- `.claude/motion-catalog.md` — read its drive-taxonomy table before adding entries; measured reference laws (7 Framer templates) live there and are expensive — never re-derive. Corrections get their own note.

## Run & probe
- Dev: `npx vite --host` · Preview: `npm run preview` (binds `localhost`/`::1` — probe via `http://localhost:<port>`, never 127.0.0.1)
- URL override: `?motion=on|off` (sessionStorage, per-origin — localhost's override never travels to a deploy)
- Breakpoints of record: 375 / 390 / 768 / 1024 / 1280 / 1440 / 1536 / 1920; review heights: 723 / 800 / ~900 (the user's laptop's usable height) / 1080

## Deploy
- Production: officience.com (public, OS-respecting motion). Previews: `*.vercel.app`, **SSO-walled** — share ONLY via a Vercel Shareable Link, never bare URLs; previews force motion ON via `MOTION_FORCED` (hostname-gated).

## Hard gates (project)
- Production R2 bucket `pub-37210447…` is **read-only** during the redesign; staging is `pub-767c5aeb…`. `npm run upload-assets` re-uploads all of `assets-src/` and is approval-gated; bump `ASSET_VERSION` once before an overwriting upload (cache rules in CLAUDE.md).
- git commit/push and R2 uploads require explicit user approval, every time.

## Rulings in force
1. Layout wins — approved DOM/visuals stay; only choreography transplants.
2. No pinning by default — the two current pins (Approach, Proven Results) are user-approved escalations with scale-to-fit.
3. The reference is the spec per breakpoint (mobile effects measured, not assumed).
4. framer-motion 11 only — no GSAP, no Lenis, no smooth-scroll hijack.
5. Divergences from measured laws (removed zoom, replaced flower scrub, motion-blur counters) are user-ordered and recorded in the catalog.
