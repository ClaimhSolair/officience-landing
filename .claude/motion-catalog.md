# Motion catalog — Sept-2026 pass

One spec per requested behaviour, measured live from the reference sites at **1440** (desktop) and **390** (mobile) with the CDP rig. Plan: `whimsical-prancing-harp.md` (v3). Rulings: layout wins · no pin by default · reference is the spec **per breakpoint** · framer-motion 11 only.

**Read this first — the drive taxonomy.** Every effect is one of two kinds, and the distinction was verified with a park-and-hold test (park mid-animation, read at +150ms and +2500ms without scrolling; a scrub holds its value, a timed animation advances):

| Kind | Verified members | Implementation |
|---|---|---|
| **Scrub** — deterministic function of scrollY | nexvio card stack scale · nexvio inner image zoom · nava card image zoom+fade · archiste inner parallax · reddent char sweep · moonx hero scale | `useScroll` + `useTransform`, **must branch on `useReducedMotion()`** |
| **Timed** — fires on entry, runs on its own clock | nexvio section headings · oma-genera menu expand/collapse · oma-genera label roll · salient odometer | `whileInView` / variants; `MotionConfig reducedMotion="user"` already covers these |

That split is not cosmetic: `MotionConfig` governs the timed class only. MotionValues written by `useTransform` bypass it, and Tailwind `motion-reduce:` cannot reach a JS-set inline style. **Every scrub needs its own `useReducedMotion()` branch to a static end-state.**

---

## Corrections to the first (desktop-only) measurement pass

Three findings from this pass overturn or extend what the plan recorded. They are folded into the specs below.

1. **nexvio cards also run an inner image zoom-settle** — `scale 1.2 → 1.0`, scrubbed, clamped at 1.0. The first pass recorded only the stack scale and "no fade, no blur". Re-verified at 1440 as well as 390, so it is not a mobile-only behaviour.
2. **nexvio section headings are timed, not scrubbed.** The first pass sampled at stepped scroll positions with a 320ms settle, which let the animation finish inside each settle and read as position-correlated. The hold test shows a parked heading advancing from `ty 40 / opacity 0` to `ty 0 / opacity 1` with no scroll input.
3. **archiste project cards do have an arrival at mobile** (scale up + caption rise), where the first pass concluded "no entrance animation at all". Their drive could not be cleanly classified — see item 7's flag.

---

## Item 1 — Header menu (oma-genera → `Header.tsx` + `MenuOverlay.tsx`)

**Trigger** — click on the nav trigger. **Kind** — timed.

| | Desktop (1440) | Mobile (390) |
|---|---|---|
| Trigger | text pill, "Menu" ⇄ "Close" | text pill 200×52, "Click to expand" |
| Panel box | height 132 → 909, anchored top-right | height 52 → 775, width 200 → 375 (full-bleed) |
| Duration | ~330–370ms | ~424ms open / ~399ms close |
| Easing | hard ease-in-out | **`cubic-bezier(0.83, 0, 0.17, 1)`** (easeInOutQuint) |
| Surface | glass `blur(20px)`; pill `blur(10px)` | same |

The close curve was captured per-frame at 390 and fits easeInOutQuint within ~2% throughout: it holds under 11% of its travel for the first 150ms, crosses the middle 70% in ~75ms, then eases out over the final ~175ms. The variant name flips **instantly** (t≈27ms) and the box animates afterwards — the label swap is not part of the transition.

**Label roll** (menu items and the pill): each label is duplicated and stacked one line-slot apart; hover springs both copies up one slot. Slot = **49px desktop, 34px mobile** — it tracks line-height, so implement it as `1lh` / a line-height multiple rather than a fixed px. ~250ms with a small overshoot, settled ~400ms. Hover-only, therefore **desktop-only in practice** (no hover on touch).

**Ours differs, deliberately.** Our menu is a right drawer (`w-full md:w-[658px]`, `translate-x` 300ms, `MenuOverlay.tsx:120–123`) inside inert/focus-trap/scroll-lock a11y (`lib/modal.ts`). Below `md` ours is already full-bleed, which matches the reference's mobile panel. Adopt tempo and easing; the expansion geometry is the benchmark's open question.

**Blocking couplings**
- `useNavigateTarget` scrolls the page `setTimeout(…, 320)` after close (`MenuOverlay.tsx:36`), hand-tuned to the current 300ms transition. Any tempo change must derive this from the shared token or await `transitionend`, or the page moves under a still-closing panel.
- The pill roll has **no text to roll** in our build — icon-only hamburger (`Header.tsx:72–80`), X to close. **Q11.**
- Panel glass would override the approved solid `#F7F7F7`. Default: keep solid, take the motion only.

**Reduced motion** — timed class, covered by `MotionConfig`; drawer keeps its existing `motion-reduce:transition-none`.

---

## Item 2 — Header glass on scroll (self-specified, no reference)

**Trigger** — scrollY past one header height. **Kind** — timed (a state cross-fade, ~300ms).

Bar goes to reduced-alpha `bg-bg-primary` + `backdrop-blur`. Scheduled **with the benchmark**, same surface as item 1.

⚠ **Contrast floor.** The lockup and icons are white (inverted PNG, `Header.tsx:55`). At 30% alpha over our light sections they land on near-white. The glass state needs either a higher-alpha blue or a scrolled-state treatment for the logo and icons — settle it in the same ruling as **Q6** ("70% glass transparent" = 30% or 70% opaque).

**Reduced motion** — cross-fade collapses to an instant state change.

---

## Item 3 — Pinwheel pop (moonx → `FlowerDivider.tsx`)

**Kind** — scrub. **Desktop:** 1350px pinned runway; moon `scale = 1 + scrollY/600`, wordmark `scale = 1 + scrollY/250` plus 0.133·y drift — pure linear.

**Mobile: the effect does not exist.** At 390 the hero collapses to a static 400px band; no pin, and `scale` is unchanged across 300/700/1100px of scroll (measured: zero scale deltas). Per ruling 4 the mobile spec is **static**.

**Ours (no-pin adaptation):** scale the flower across its band's viewport transit — `useScroll` on the band, `offset ["start end", "center center"]`, scale ~0.45 → 1, transform-only, zero height change. Band heights (522/850/1000px) untouched. `lg:`+ only; static below.

**Reduced motion** — `useReducedMotion()` → render at final scale, no binding.

---

## Item 4 — Card stack-up (nexvio → `AboutUs.tsx` story cards)

**Kind** — scrub. Survives at both breakpoints with the **same law**.

| | Desktop (1440) | Mobile (390) |
|---|---|---|
| Card | `sticky top:100px`, 1239×702 | `sticky top:100px`, 343×600 |
| Flow spacing | 940px | 660px |
| Scale | **1.0 → 0.90, clamped** | identical |
| Release | all cards release together | identical |

Later cards compress the same 1.0→0.90 into a shorter runway, because every card targets the same release point. No fade, no blur on the card itself.

**Plus the inner image zoom-settle** (correction 1): each card's image scrubs **`scale 1.2 → 1.0`**, clamped, completing as the card seats. Measured at both widths.

**Ours:** three cards already stacked full-width in flow — sticky stacking **adds zero page height** (the flow height is the runway). Sticky offset from our real header (`69 / 113 / 119px`, `Header.tsx:34`), **not** the reference's 100px. Verify `#about` still lands and that `section_view` still fires.

**Reduced motion** — cards render at scale 1, images at 1.0, no sticky scrub.

---

## Item 7 — Photo zoom-pop + caption (→ the same `AboutUs.tsx` cards)

**Recommendation changed by this pass. Use nexvio's zoom-settle, not archiste's parallax.**

The team asked for "photo zoom-in popping-up along with text description bubble at the bottom". archiste — the site they cited — turns out to deliver that through **inner parallax**: image drawn ~1.2× oversized, `translateY` scrubbing −90→+90 desktop (**−88→+88 at mobile**, 1061px image in an 884px window). Vertical overdraw is exactly what our crop ruling forbids: cards 2–3 ship `object-cover lg:object-fill` (`AboutUs.tsx:79,87`) *because* the 2026-08-26 ruling rejected cover-crops for cutting the subjects' heads off. Parallax would reintroduce that reframe on desktop and mobile both, and would need new taller crops at two breakpoints (upload-gated).

**nexvio's zoom-settle gives the same described effect with none of that cost:**
- it is literally a zoom-in pop — `scale 1.2 → 1.0`, scrubbed on arrival;
- it **settles at 1.0**, i.e. ends on exactly the Figma-approved framing — the animation only ever shows a *tighter* crop in transit, never a reframed end state;
- it needs **no new assets** and no ruling override;
- it composes natively with item 4 — same reference, same cards, one scroll binding.

Our caption band already exists (desktop overlay band ≈ their caption row).

**Flag:** archiste's mobile cards also scale up 0.5→1.0 with the caption rising 340px, but that arrival's drive could not be cleanly classified — an index-stable hold test at two positions was inconclusive on that site. Not load-bearing, since the recommendation no longer depends on archiste.

**Reduced motion** — images render at 1.0.

---

## Item 5 — Text colour scrub (reddent → About manifesto)

**Kind** — scrub. Present at both breakpoints, and **the law is essentially breakpoint-invariant.**

| | Desktop | Mobile (390) |
|---|---|---|
| Rate | 0.20 chars/px | **0.19 chars/px** |
| Sweep distance | ~645px | ~675px |
| Start | host top ≈ 0.70·vh | host top ≈ **0.72·vh** |
| End | — | host top ≈ **−0.09·vh** |
| Per-char opacity | 0.2 → 1, hard frontier | identical |

**Express it portably, not as chars-per-pixel.** The reference's string is 129 chars at both widths; ours is not, so cloning "0.19 chars/px" would make our sweep an arbitrary length. The portable form: **the frontier crosses the whole string over ~0.8 viewport-heights of scroll**, from host-top ≈ 0.72·vh to ≈ −0.09·vh. That is copy-length-independent and breakpoint-portable.

**Mechanism — two options, same visual law (Q at sitting):**
- **(i) one-node gradient (recommended):** a scroll-driven hard-stop gradient with `background-clip: text`. One animated node; mid-word breaks impossible by construction.
- **(ii) faithful per-char:** word-wrapped char spans (word wrappers avoid the reference's own mid-word-break flaw, e.g. "d/eserves"). Hundreds of animated nodes — must clear the 4× throttle gate.

⚠ **End-state conflict:** Figma draws the manifesto two-tone (lead dark, rest grey); reddent ends uniform black. **Q5.**

**Reduced motion** — static Figma colours.

---

## Item 6 — Counters (salient → About milestones)

**Kind** — timed. **Mechanism confirmed identical at both breakpoints; only the pitch changes.**

- Tape = **50 glyphs** (five 0–9 loops) in a **one-glyph clip window**, `overflow: hidden`.
- **Pitch = the glyph line-height**: 136px desktop, **80px at 390** (= font-size there).
- Resting transform: **`ty = −pitch × (10 + digit)`** — verified exactly (−800 for "0", −880 for "1" at 80px pitch). The rest position sits one full revolution in, so the roll always turns through at least one 0→9 cycle before landing.

**Build:** derive pitch from CSS line-height rather than hard-coding px — the component then responds correctly at every breakpoint for free. Values `6 / 200 / 20 / 500+`; the `+` is static; digit counts differ from the reference's two-digit design, which is fine because the law is per-digit.

**Timing is the one number not measurable.** The roll never fires under automation (headless and headed, wheel included — it renders pre-completed). Mechanism is exact; **duration and easing get calibrated by eye at the benchmark** (starting proposal: ~1.2s ease-out, slight per-digit stagger). **Q10** accepts this.

**Reduced motion** — render final values statically.

---

## Item 8 — Process section (archiste → `Capabilities.tsx` Services)

**What archiste actually draws (desktop):** a sticky **title column** beside a 2×2 card grid. No stacking, no card entrances.
**At mobile: the sticky treatment is dropped entirely** — measured at 390, the process section has no sticky descendant; it is a plain stacked layout.

So the reference itself abandons this at mobile, and the team's phrase "Stacking Card Sticky Scroll" matches neither what archiste draws nor our section (Figma-locked full-width ruled rows, not cards).

**Options (Q2):**
- (a) sticky section header — **geometrically unlike the reference**: archiste's sticky title is a *side column*; ours is a full-width band stacked *above* the rows (`Capabilities.tsx:84–126`), so pinning it makes rows scroll under a floating band. Not "zero layout change".
- (b) row stacking + scale-under-cover — odd on 150–300px rows that aren't cards.
- **(c) row entrance reveals only — recommended.** Adds motion without inventing geometry no reference shows, and matches the reference's own mobile answer.

Use the **reveal token** below for (c).

**Reduced motion** — rows render in place.

---

## Item 9 — Cards line up right-to-left (interyo → `HowWeEngage.tsx`)

**Desktop:** pinned 100vh section, ~4060px runway, title anchored, 5 cards chain in from the right — each `x +350 → 0` with opacity 0 → 1 over ~700–900px of scroll, sequentially. Scrubbed.

**Mobile: the pin does not exist.** At 390 the only sticky element on the page belongs to the hero; the process section is plain stacked flow.

That is evidence *for* the no-pin adaptation rather than against it: **the reference itself ships the unpinned version at mobile.** Our three steps map to three arrivals.

**Options (Q3):** (a) faithful desktop pin (+~2 viewport-heights of page length — and re-check `section_view`, see the analytics note); **(b) no-pin staggered arrivals** from the right (+350px, fade, ~120ms stagger), title not pinned — now the better-supported option.

**Reduced motion** — arrivals collapse to opacity-only or static.

---

## Item 10 — Works carousel (nava-studio → `ProvenResults.tsx`)

**Desktop:** pinned 630px window, ~2400px runway, 2462px track scrubbing `tx 0 → −2000` linearly; each arriving card lands with image `scale 1.2 → 1.12`, opacity 0.2 → 0.8, caption 0.3 → 0.95, card lift `ty 56 → 0`.

**Mobile: no pin, no horizontal track.** Measured at 390: zero sticky elements, no horizontal-overflow container; the 2462px track becomes a **vertical stack** (`Work Card Wrapper` and `Lists` both 335×1491).

**But the per-card entrance survives, and it is scrubbed** (hold-test confirmed): image `scale 1.21 → 1.10` with opacity `0.1 → 1.0`, card `ty 60 → 0`.

This is decisive for **Q4**: the reference's own mobile build is "no pin, keep the per-card entrance" — exactly the plan's recommended adaptation. Keep our settled arrows + snap carousel contract (2026-08-24) and add the entrance as cards enter the horizontal viewport. No pin, no height change, no contract override.

**Divergence to note:** nava settles its images at **1.10**, i.e. permanently 10% zoomed. Ours should settle at **1.0** so the card ends on the approved Figma framing (same reasoning as item 7).

**Reduced motion** — cards render at rest.

---

## Item 11 — Logo marquee — already built

Right-to-left loop (`translateX 0 → −50%`, 40s linear), pause on track hover, grayscale → colour on hover, reduced-motion-aware. Only delta vs the ask: pause is track-hover rather than icon-only (**Q9**, propose keep). **No code planned.**

## Item 12 — Office addresses → Google Maps

Not an animation. Wrap each office row in a maps search link, house hover/focus-visible styles, recorded in the adapter as a team-requested divergence. **S effort.**

---

## Proposed `lib/motion.ts` tokens

```ts
// Durations and easings measured from the references (see motion-catalog.md).
export const EASE = {
  menu:   [0.83, 0, 0.17, 1],   // easeInOutQuint — oma-genera panel, fitted at 390
  reveal: [0.33, 1, 0.68, 1],   // easeOutCubic  — nexvio heading, fitted per-frame
} as const;

export const DUR = {
  menu:   0.4,    // 424ms open / 399ms close measured; one token both ways
  reveal: 1.0,    // 980ms to rest
  glass:  0.3,    // item 2, self-specified
} as const;

// The one reveal every timed entrance uses (nexvio, fitted).
export const reveal = {
  initial: { y: 40, opacity: 0 },
  whileInView: { y: 0, opacity: 1 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: DUR.reveal, ease: EASE.reveal },
};

// Scrub end-states, for the useReducedMotion() branch of every scrubbed effect.
export const SCRUB_REST = {
  cardStack:  { scale: 1 },
  imageZoom:  { scale: 1 },
  flower:     { scale: 1 },
} as const;

// Per-section kill switch — a one-line disable after merge.
export const MOTION = {
  flower: true, aboutStack: true, manifesto: true,
  counters: true, services: true, approach: true, work: true,
} as const;
```

Sticky offsets come from the real header (`69 / 113 / 119px`), never the references' 100px. Odometer pitch comes from CSS line-height, never a px constant.

---

## Verification additions this catalog implies

- Every scrub has a `useReducedMotion()` branch — check each one renders its `SCRUB_REST` state.
- `section_view` still fires per animated section (IntersectionObserver `threshold: 0.3`, `HomePage.tsx:38`). Any approved pin must be re-checked here: a long pinned runway can hold a tall section's intersection ratio under 0.3 permanently and silence the event.

  ⚠ **Measured margin, 1440 × 900:** peak intersection ratios are `about 0.31 · capabilities 0.43 · approach 0.83 · proven-results 0.66 · clients 0.73 · why-us 0.70 · contact 0.76`. **About clears the threshold by 0.01.** Sticky stacking (item 4) adds no page height, so the ratio should hold — but About is the one section where any height growth at all silences its analytics event. Re-measure this at the About checkpoint, not just at the end.
- Adapted effects are judged against **this catalog**, not against a reference GIF — an adaptation cannot match a recording of the thing it deliberately diverges from.
- Touch: scrubs are driven by scroll position, so flick-momentum changes the velocity profile but not the law. Check the About stack and the manifesto sweep on a real touch device at the About checkpoint.

⚠ **Headless Chrome reports `prefers-reduced-motion: reduce`.** Every scrub therefore renders at its rest state and reads as "the effect is broken" — the flower's first verification run showed a flat scale of 1 at every scroll position for exactly this reason. `Emulation.setEmulatedMedia` fixes it, but only if the override is set **before** the page loads and on the **same** CDP connection: it changes what a query evaluates to without notifying existing `MediaQueryList` listeners, so a React tree that already rendered never re-renders. The rig's `benchgo` command does this in the right order.

## Benchmark results (items 1 + 2 + 3, verified 2026-08-26)

| Check | Result |
|---|---|
| `tsc --noEmit` + `npm run build` | clean; 395.26 kB / 126.90 kB gzip |
| Header glass | `rgb(31,73,191)` → `rgba(31,73,191,0.7)` + `blur(12px)` past 69px |
| Flower scrub, motion on (1440) | scale 0.507 → 0.733 → 0.903 → 1.0, clamped at band centre |
| Flower, reduced motion | flat 1.0 at every position |
| Flower at 390 | flat 1.0 — static, matching moonx's own mobile behaviour |
| Band heights | 522 / 850 / 1000 unchanged at every width |
| Menu tempo | panel + backdrop both `0.4s cubic-bezier(0.83, 0, 0.17, 1)` on `transform` |
| Close → scroll coupling | panel fully off-canvas at t=360ms; scroll fires after, lands About at 113px |
| Roll geometry | occupied height 57.99 vs 58px line box (zero shift); clip headroom +13.19px; copies aligned to 0.19px |
| Overflow sweep | clean at 375/390/768/1280/1440/1536/1920 |
| LCP | hero H1 at 368ms, `opacity: 1` — unheld |
| 4× CPU throttle | 2 long tasks, longest 131ms, both during init; none while scrolling |
| `section_view` | all 7 sections cross 0.3 |

**Pre-existing defect found, not fixed** (out of scope, flagged per house rules): at **1024** the document scrolls to 1053px — 29px of horizontal overflow from the ProvenResults carousel slides (`lg:w-[570px]`). Confirmed pre-existing by disabling both new effects via the `MOTION` kill switches and re-measuring: identical 1053px. No leaf element is cut off, and no other width is affected.

## End-to-end audit of the production build (2026-08-26)

Method: `npm run build` → `vite preview` on :4178 → headless Chrome, **rAF health gated first**
(62fps, `document.hidden === false`) so a frozen compositor could not masquerade as a broken
effect. Motion preference forced per run, set *before* load. Movement measured as a page-wide
census — every element's transform/opacity/background sampled at 12 scroll positions across the
full 13,286px page and attributed to its analytics section — plus a structural check for each
item's signature, so "not built" is a fact rather than an inference.

| # | Item | Fires on the build? | Evidence |
|---|---|---|---|
| 1 | Menu tempo + label roll | ✅ | panel 1440→782, settles **426ms**, `0.4s cubic-bezier(0.83,0,0.17,1)`; real pointer rolls label `ty −77` in a 77px slot |
| 2 | Header glass | ✅ | `rgb(31,73,191)` → `rgba(31,73,191,0.7)` past 69px |
| 3 | Flower scrub | ✅ | scale **0.478 → 0.62 → 0.789 → 0.959 → 1.0** across the band transit |
| 11 | Logo marquee | ✅ (pre-existing) | `.marquee-track` translateX −256 → −330 and onward |
| 4 | About card stacking | ❌ not built | 0 sticky elements in `#about` |
| 5 | Manifesto text scrub | ❌ not built | 0 `background-clip:text`, no per-char/word split |
| 6 | Odometer counters | ❌ not built | 0 glyph tapes; milestones are plain text (6, 200, 20, 500+) |
| 7 | Photo zoom-settle | ❌ not built | 4 images in `#about`, none animated |
| 8 | Services row reveals | ❌ not built | no movers in `#capabilities` |
| 9 | Approach arrivals | ❌ not built | no movers in `#approach`, 0 sticky |
| 10 | Proven Results entrances | ❌ not built | no movers in `#proven-results` (3 scrollers = the existing carousel) |
| 12 | Office → Google Maps | ❌ not built | 0 links of any kind in `#contact` |

**Whole-page census, motion enabled: exactly three elements move** — the header, the flower, the
marquee track. Every content section is completely static. That is the expected state: only the
benchmark (items 1–3) was implemented, and item 11 predates this pass.

**Under `prefers-reduced-motion: reduce` — the setting this review machine actually reports — only
the header changes.** The flower renders static at full size and the marquee is stopped by
`motion-reduce:animate-none`. This reproduces the reviewer's "no animation aside from the glass
header" exactly, and is correct behaviour rather than a defect. Any review of this pass must
either enable Windows animation effects or override the preference in DevTools.

## Reviewing the build: `?motion=on`

A build that only animates on a machine with Windows animation effects enabled is not reviewable,
and the first review of this pass failed for exactly that reason. **Append `?motion=on` to any URL
to force motion on regardless of the OS setting**; `?motion=off` forces the opposite. The choice
persists in `sessionStorage` for the tab, so navigation keeps it, and it clears when the tab closes.

It is opt-in through the URL and never inferred, so a visitor who asked for less motion still gets
less motion. Implementation is `useMotionEnabled()` in `lib/motion.ts`, which also mirrors the
answer onto `<html data-motion>` so the stylesheet can reach the effects CSS owns (the marquee,
smooth anchor scrolling) — a media query cannot be overridden from script, which is why the
JS-driven effects stopped using `motion-reduce:` variants and now set their durations directly.

Verified on the production build with the browser reporting `prefers-reduced-motion: reduce`:

| | plain URL (real reduce visitor) | `?motion=on` (reviewer) |
|---|---|---|
| Menu panel | `0s`, settles 47ms | `0.4s`, settles 425ms |
| Label roll | not rolled (`ty 0`) | rolled (`ty −77`) |
| Flower | static | scale 0.48 → 1 |
| Marquee | stopped | translating −263 → −338 |
| Header glass | changes | changes |

**Reduced motion does not mean a dead page.** framer-motion's `reducedMotion="user"` suppresses
transforms but keeps opacity animations — observed here as the splash still fading out under
`reduce` while every transform stayed put. So when the remaining items land, the shared `reveal`
token (y + opacity) degrades to a fade rather than to nothing.


## Full build — end-to-end verification (2026-08-26)

All twelve items are now built or accounted for. Verified on the production build
(`vite preview`) with rAF health gated first, at both motion settings.

| # | Item | State | Evidence |
|---|---|---|---|
| 1 | Menu tempo + label roll | OK | panel settles 426ms @ `cubic-bezier(0.83,0,0.17,1)`; roll `ty -77` in a 77px slot |
| 2 | Header glass | OK | `rgb(31,73,191)` -> `rgba(...,0.7)` + blur past 69px |
| 3 | Flower scrub | OK | scale 0.48 -> 1.0 across the band; static at 390, as moonx is |
| 4 | About card stacking | OK | 3 cards `sticky`, top **113px desktop / 69px mobile** (our header, not the reference's 100), scale 1 -> 0.90 clamped, releasing together |
| 5 | Manifesto sweep | OK | 98 character spans, opacity 0.2 -> 1, frontier crossing ~0.8vh |
| 6 | Odometer counters | OK | 6 / 200 / 20 / 500+ on 50-glyph tapes, percentage-based so any type size works |
| 7 | Photo zoom-settle | OK | each card's photo 1.2 -> 1.0, staggered by arrival, ending on the approved crop |
| 8 | Services row reveals | OK | 4 rows, `y 40 -> 0`, opacity 0 -> 1 |
| 9 | Approach arrivals | OK | 3 steps, `x 120 -> 0` + fade, ~120ms stagger — **travel reduced, see below** |
| 10 | Proven Results entrances | OK | card `y 60 -> 0`, photo `scale 1.2 -> 1.0` + `opacity 0.1 -> 1`; carousel contract untouched |
| 11 | Logo marquee | OK | pre-existing, unchanged |
| 12 | Office -> Google Maps | OK | six rows link to `google.com/maps/search`, labelled per office |

**Gates:** `tsc` clean · build clean (399.06 kB / 128.42 kB gzip) · no leaf overflow at
375/390/768/1280/1440/1536/1920 · page height **unchanged at 13,286px**, so stacking cost nothing ·
`section_view` fires for all seven sections, `about` still at **0.31** · LCP hero H1 276ms at
`opacity: 1` · 4x throttle: 2 long tasks, longest 138ms, both at init, none while scrolling ·
anchors all land at 113px.

### Divergence: item 9's travel is 120px, not the measured 350px

interyo moves its cards 350px, but it does so inside a **pinned** section where they begin
off-canvas and the pin controls when they land. Unpinned, that offset defeats its own trigger: a
step translated 350px sits outside its clipped column, so it never reaches the 25% visibility that
starts the entrance. Measured on the built page — **24.6% intersection at 1440 (just under the
threshold) and 0% at 768 and below**, which left the third step frozen at `opacity: 0` permanently.
The travel is now 120px, which every column can hold at every breakpoint; all three steps arrive,
staggered, and the movement still reads as coming from the right.

This is the house rule about slide-in distances staying inside the viewport, caught by probing at
the initial offset rather than at the resting state.

### Reduced motion is two-tier

Timed reveals keep their **fade** and drop their **travel**; scroll-scrubs (stacking, photo zoom,
the manifesto sweep) and the odometer collapse to static. Verified under `reduce`: Services,
Approach and Proven Results animate `opacity 0 -> 1` with `tx/ty` pinned at 0, while the flower,
cards and counters sit at their resting state. A visitor who asked for less motion gets a calm page
rather than a dead one.

---

# v5 improvement pass (2026-08-27)

The v4 build shipped every item in its conservative form and read as flat: items 8, 9 and 10 had
become generic fade-ups, one 1000ms duration served every entrance, nothing cascaded *within* a
section, and five sections had no motion at all. The user reviewed it and rejected it. Four
decisions followed — full fidelity on 8/9/10 (overriding the earlier sitting picks), coverage for
all five static sections, menu corner-expand, and light mobile motion.

## Duration tiers replace the single reveal

`revealFast 450` (rows, captions, chips) · `revealBase 700` (cards, blocks — the new default) ·
`revealSlow 1000` (display-scale only, the measured nexvio value). Plus `exit 220`, `menuItem 350`,
`suffixPop 180`, and `STAGGER = {tight .045, base .08, loose .12}`. One duration serving every
transition was the single biggest reason the build read as uniform.

## Reveal v2: the container observes, the children move

v4 observed and translated the *same* element, so a travel large enough to read as movement could
push that element under its own visibility threshold — which is exactly what left Approach's third
step invisible and forced the 120px compromise. `Reveal stagger` + `RevealChild` inverts it: the
wrapper never transforms, so its ratio is honest and the travel is free. The compromise is gone —
mobile Approach now travels a real 200px, desktop the full measured 350px.

## Item by item

| # | v4 | v5 | Measured |
|---|---|---|---|
| 1 | slide-in slab, tempo only | corner-expand clip-path + item cascade | `inset(0 0 100% 100%)` to `inset(0)`; items 0.12 / 0.78 / 0.98 |
| 2 | glass flip | + hairline along the bottom edge in the glass state | tempo unchanged |
| 3 | scale only, static at 390 | **spins** -65deg to 0 alongside the scale; mobile 0.75 / -30deg | 0.45/-65 to 0.881/-14.1 to 1.0/0 |
| 4 | sticky stack | unchanged | scale 1 to 0.905 |
| 5 | hard one-character frontier | feathered across four characters | 92 spans |
| 6 | 1.2s / 80ms, a guess | **1.5s / 90ms** plus a suffix pop | by eye |
| 7 | settles at the card centre | settles at `center 0.6`, so the landing is seen | — |
| 8 | four rows fading up | **sticky deck**, opaque, 112px peek, covered rows to 0.98 | tops 113/225/337/449 |
| 9 | 120px timed slide | **pinned procession**, title anchored, 350px scrubbed | 350 to 128.5 to 0, sequential |
| 10 | manual carousel | **pinned horizontal scrub**, arrows retired at lg | track 0 to -379 to -964 to -1213 |
| 11 | — | unchanged | — |
| 12 | instant underline | underline slides in over 200ms | — |

## Coverage module

Hero — the H1 never animates (LCP); its siblings are sequenced after splash dismissal through a new
`splashDone` boolean on the Layout context, and the five decorative shapes stagger in then drift
22-58px. ClientStories — header cascade, cards 120ms apart, each rule drawing `scaleX 0 to 1`.
WhyOfficience — the crosshair draws out from the centre, the pinwheel turns -90deg to 0, and the four
values arrive from their own quadrants. Contact — card, survey rows, six office rows. Footer — fade
plus partner tiles.

## Divergences introduced, all deliberate

1. **The flower spins.** moonx scales without rotating. A pinwheel that never turns wastes its metaphor.
2. **Mobile is no longer static** where the reference is static (the flower). A per-item override of ruling 4.
3. **The manifesto frontier is feathered** across four characters; reddent's is hard. At display size a hard edge reads as a cursor wiping the line.
4. **Services rows gained an opaque fill.** Figma draws them on the section background because Figma never draws them overlapping. The fill is what makes covering read.
5. **The lg arrows are retired** when the deck is pinned. That moves *toward* the artboards, which draw no arrows at any width — but it overrides the 2026-08-24 five-slides-with-arrows contract, so it is a contract change, not only a motion change.
6. **The pinned deck scales to fit the viewport height.** The card is 800px and a pinned frame on a 900px-tall laptop offers about 674px. At 1920x1080 the deck is 1:1 with the artboard; below that it is proportionally smaller. Transform only, so the approved ratio is never distorted, only reduced. Under scale 0.7 the section falls back to the shipped swipe rail.

## v5 verification (production build, headless 1422x804, rAF gated first: 88 frames/600ms)

| Gate | Result |
|---|---|
| `tsc` + `npm run build` | clean; 408.83 kB / 131.62 kB gzip |
| Page height, motion **off** | **13,287px — identical to the v4 baseline**, so cascades and coverage cost nothing |
| Page height, motion **on** | 14,537px (**+1,250px**), all of it the two pins (approach +682, work +568) |
| `section_view` ratios | approach **0.455** · work **0.418** · capabilities 0.381 · clients 0.775 · why-us 0.748 · contact 0.66 — all clear 0.3 |
| `about` ratio | **0.281 at an 804px viewport — in BOTH motion modes.** Pre-existing, unchanged by v5; it needs a viewport 858px tall to fire. Flagged, not introduced. |
| Overflow, 375-1920 | no unclipped leaf exceeds the viewport at any width |
| 1024 `scrollWidth` | 1053px in **both** motion modes — the pre-existing 29px carousel overflow, confirmed again |
| Anchors | about / capabilities / approach / proven-results / contact all land at **113px**, pins included |
| LCP | hero H1 **276ms at opacity 1** — unheld, same as v4 |
| 4x CPU throttle | 2 long tasks (139ms, 109ms) across the full 14,537px walk; **67.9fps** sustained |
| Reduced motion | rows wait at **opacity 0 with an identity transform** — fade, no travel; flower/cards static at 1.0; counters plain; arrows and swipe rail restored; no sticky anywhere |
| Mobile 390 | flower 0.906/-11.3deg to 1.0/0deg · Approach unpinned, steps travel a real **200px** · swipe rail and 5 dots intact |

**Open item, flagged not fixed:** while the Services deck is fully stacked, the last row measures
433px from a top of 449px, so on viewports under about 890px tall its lower edge sits below the fold
until the deck releases. Nothing is clipped — the row is complete and scrolling reveals it — but on a
short laptop the fourth "View Brochure" button is briefly out of sight.
