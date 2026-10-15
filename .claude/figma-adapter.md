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

One left. The hero shapes below were delivered on 2026-08-26 and are now in the build.

1. **The white brand lockup** (header logo). `3552:2941` (flower + "officience") and
   `3552:2977` (the "20" mark) export cleanly, but "YEARS" / "ANNIVERSARY" are live
   text. Until a flattened SVG (text outlined) arrives, `Header.tsx` renders the old
   blue PNG inverted with `filter: brightness(0) invert(1)` — right height and colour,
   but the artwork is 2.51:1 against Figma's 2.38:1, so it sits ~8px too wide at 1440.
2. ~~**The hero's five floating 3D shapes.**~~ **RESOLVED 2026-08-26.** Still
   unaddressable in Figma — no node id, no asset, no coordinates, in either artboard,
   and `Rectangle 3` behind them is a flat fill — so the placement remains *measured
   off the 1440 render*, not read from it. The team delivered five 1080x1080 PNGs
   (~915kB) to `hero/` in the staging bucket; they are trimmed and re-encoded to
   380px WebP (~101kB total) in `assets-src/hero/`, and `SHAPE_PLACEMENT` in
   `Hero.tsx` is now the source of truth for their positions.

   **The one correction worth remembering:** the left/top fractions hold, but sizing
   the shapes as a *percentage of band width* does not. The band's height is pinned
   (742px, 875 at 3xl) while its width follows the viewport, so a width-relative
   size that is right at 1440 overshoots by 1920 — the asterisk reached 187px against
   the artboard's 141px, and the star grew until it clipped through the bottom of the
   band. The widths are therefore pinned to their 1440 pixel values (leaf 101,
   asterisk 141, ring 138, star 141, ellipse 124). Note also that the **1920 artboard
   draws no shapes at all**, so anything above 1440 extrapolates the 1440 composition.

   They are decorative: `aria-hidden`, `pointer-events-none`, `decoding="async"` and
   no `loading="lazy"` above the fold. Hidden below `xl`, where the hero stacks into
   one column and a shape would land on the headline.

3. **The Services photo originals (added 2026-09-29, section 19).** Figma holds small files: the Software hero is
   1024x600 and upscales 1.4x at 1440, and the row and work-card files have 0.35 to 1.05 source px for each 2x px. Ask
   for the camera or export originals of each hero, row picture and work-card picture.

### Backlog — open items awaiting a ruling (index)

Everything below is **built as drawn** and flagged; none of it blocks the next step. This
index exists because the detail now spans several per-step sections. Grouped by the kind
of decision, not by section.

**Legibility / accessibility — one ruling covers each group**
1. **10px body copy at 390.** Six places, all drawn that way: the testimonial role line,
   the Why Us item descriptions, the Contact option descriptions, and — added by the
   2026-08-26 review — the Proven Results tag chips and its "10+ Works" pill
   (`ProvenResults.tsx`), plus the survey's progress-step labels (`Survey.tsx`). Nothing
   else on the page goes below 12px. One build-own instance also exists and can be
   changed without a ruling: LegalToc's mobile "On this page" eyebrow.
2. **Secondary/200 pink on the blue is 3.92:1** — fine for the 64px Why Us titles (large
   text needs 3:1), short of the 4.5:1 the 20px mobile titles need. Two more Figma-drawn
   pairs found 2026-08-26, both in the survey: the inactive progress label
   (Text/Subtitle-2 `#A0A0A0` on BG/Secondary `#F7F7F7`, ~2.4:1 at 10px bold) and the
   disabled Next button (white on `#D9D9D9`, ~1.6:1). The disabled control is exempt
   from WCAG 1.4.3, so that one is advisory.

**Copy that reads as a slip rather than a decision**
3. **The Diana client logo drops the "AI"** from the company's name.
4. **"Vietnam_OffyPlex" / "Vietnam_CrunchBase"** as visible city labels.
5. **Three office addresses lost commas** against the live site, each exactly where Figma
   wraps the line.
6. **The 390 testimonial frame repeats the second quote** in the third card; 1920 carries
   the real one, which is what shipped.
7. **"has become" (1920) vs "had become" (390)**; 1920 shipped.
8. **Our Services 390-vs-1920 conflicts** — see that section for the four of them.
8b. **Four survey strings are drawn with slips of their own** and ship verbatim, which
   sits oddly beside the three typos the build *does* correct (see the Survey section):
   "What bring you here?" (missing "s", and a near-duplicate of Contact's own "What
   brings you here?"), "Let's collaborate or referral or strategic partnership",
   "Something else general questions", and "2-5 peoples" / "+5 peoples". One ruling
   should cover the set, together with the three already-corrected typos.

**Design details that differ between the two artboards for no evident reason**
9. Author name switches Lexend -> Montserrat between 1920 and 390 (testimonials).
10. Card radius and shadow differ between frames (testimonials: 12+shadow vs 4+none).
11. The eyebrow chip is 8/2 on About Us and 12/4 on every other 390 section.
12. "View All Brochure" radius is 8 at 1920 and 0 at 390.
13. The Contact form panel's radius is 6px, which is not in the radius scale.
14. The Contact card is on 74px gutters where every other section uses 64.

**Assets still owed by the team**
15. The white brand lockup with text outlined. (The five hero 3D shapes were
    delivered 2026-08-26 and are in the build.)
16. Higher-resolution About cards 2 and 3 **for the desktop framing**, and the IOGA
    original (its crop upscales 1.4x). Investigated 2026-08-26 and still owed, with a
    useful finding: the **390** fills are backed by 3480-4096px originals (that is
    where the mobile crops in ruling 18 come from), but the **1920** fills are
    separate, separately-processed **1024px** copies showing a tighter framing — not
    crops of those originals. A template match over the originals scored only
    0.61 and got worse under refinement, so the desktop composition cannot be
    reproduced from them; re-exporting would silently change the framing. Desktop
    cards 2 and 3 therefore still upscale 1.75x into the 1792px box. Ask the team for
    the desktop crops at source resolution rather than deriving them.

**Destinations not yet specified**
17. Rizlum / HR / ITS, View All Work, and Discover Our Story have no targets.

**Ruled on, recorded so it is not "fixed" back**
18. **The About photos are art-directed: the two artboards FRAME them differently.**
    This is the single most re-worked thing in the redesign; read it before touching
    `AboutUs.tsx`.
    - **1920** stretches the whole frame into the 1792x860 box. Sources are 1.33 and
      1.50 against a 2.08 box, so people render 1.57x and 1.39x wide. A cover-crop
      instead cuts their heads off. Ruled 2026-08-26: match the artboard — hence
      `lg:object-fill` on cards 2 and 3. Card 1 is a manual crop in Figma (a milder
      6% squeeze) and keeps `object-cover` with a tuned position.
    - **390** does something different in kind: it **zoom-crops** each photo 1.44x /
      1.52x / 1.70x past what `object-fit: cover` would use, then offsets it. Serving
      one file to both breakpoints therefore cannot work — it was what left the phone
      view visibly stretched. `srcset` only varies resolution, so the fix is
      `<picture>` with a `(min-width: 1024px)` source, and mobile files that carry
      Figma's crop **baked in at exactly the artboard box aspect** (358/220, and
      358/237 on card 3, whose mobile photo is drawn 237 tall). `object-cover` is then
      a no-op below lg and CSS distorts nothing — measured distortion 1.000.
    - Card 1's mobile fill carries a **0.915 horizontal squeeze in Figma itself**
      (`size-[157.9%]` resolves against different bases for width and height).
      Reproduced in the file rather than corrected.
    - Mobile crop windows, in original-source pixels, so nobody re-derives them:
      card 1 `(593,570) 2204x1239` of 3480x1957 · card 2 `(1392,767) 2688x1651` of
      4080x3072 · card 3 `(756,315) 2407x1603` of 4096x2730.
18b. **The About Us PAGE hero shows the whole photograph — ruled 2026-09-03.**
    Figma `3133:4426` draws the 1024x768 frame with `object-fit: fill` into a
    1440x780 box, which stretches the people 1.385x. `object-cover` is not the
    alternative: it removes the top 213px and cuts off the logo board the team
    is holding, which is the subject. The user ruled **faithful proportion,
    fully visible, no stretch and no crop**, so the box gives way to the
    picture: `object-contain object-top` on a `bg-black-900` ground.
    - Measured at eight widths: distortion **1.000** everywhere, whole picture
      visible everywhere. The ground shows below the picture at mobile (227px
      at 390, which is exactly where the copy sits) and at the sides from md
      (8.3% each at 768, 13.9% at 1024-1440, 18.8% at 1536-1920).
    - It also **fixes** the resolution problem rather than hiding it: the fill
      rendered the 1024px source at 0.71x (1440) and 0.53x (1920); contained it
      renders at 0.98x and 0.85x.
    - White copy over the composited ground, picture and scrim measures
      **4.00-4.42:1** across 1024/1440/1536/1920. Both styles are large text, so
      AA needs 3:1. Do not remove the scrim: the picture's bottom-left is a pale
      wall and the copy sits on it.
    - This is the **opposite** call to ruling 18, which kept `lg:object-fill` on
      the home page's story cards. The difference is the subject: stretching a
      building is a proportion error, stretching the founding team and cropping
      their logo board destroys the content. Do not "align" the two.
    - **Amended 2026-09-24 (round 4).** Commit `4140f3d` changed this ruled
      `object-contain` to `object-cover object-center` and recorded no reason, so
      the build cropped the photo again. The team then asked for "no stretch, no
      cut, no crop" and named a "1920x1080 version". Measured: the node they
      linked, **3779:5758**, is 1980x1080, and its fill is the same **1024x768**
      file that ships (mean pixel difference 3.8/255). Figma **stretches** it
      1.375x wide into the frame (the fit score is 4.5 for a stretch, against 16
      or more for every crop). So that node is not the new file. The user chose to
      **supply the 1920x1080 file**. With it, the band takes 16:9 at every width,
      and the photo fills it with no stretch, crop or band. Below lg a 16:9 band
      is too short for the copy (219px at 390), so the copy sits under the photo
      on the dark ground. The photo parallax goes, because a parallax needs
      overdraw, and overdraw is a crop.
    - **Built 2026-09-24 with the file the user sent in chat.** Measured: it is
      **Figma's own render of 3779:5758**, not a new photo. It is 1980x1080 (not
      1920x1080), it differs from the Figma render by 1.94/255, it is the 4:3
      photo scaled about 1.95x across and 1.41x down (the 1.375x widening), and
      the dark scrim is in its pixels (the row brightness equals the render's).
      The logo circle on the board reads about 0.80 wide:tall in the 4:3 file and
      1.09 in this one, so this file makes the people about 9% wide, by that
      circle. The user saw these facts and chose **"use it as the team made it"**.
      So: the band is `aspect-[1980/1080]` at every width, the hero draws no CSS
      scrim (the file has one), and the copy sits on the photo from lg and under
      it below lg. Files: `hero-2006-{800,1280,1980}.webp`; 28 corner pixels of
      the frame's 4px radius were transparent and are flattened onto `#1B1E25`.
    - **Consequence to know:** the band is 1047px tall at 1920, so the headline
      ends below the first screen on tall desktop screens: at y=900 on 1536x864,
      and at y=1115 on 1920x1080 (a maximised 1920 browser shows only the top of
      the copy). At 1440x900 (847) and 1280x800 (760) it fits. Any fix needs a
      ruling, because each one crops, adds a band, or moves the copy.
    - The detail is the 1024px source's, so the photo is soft at 1920. The camera
      original is still owed.
18c. **Our Journey is ONE track in four frames, and the pictures share one band.**
    `3133:4460` plus `3070:1902`, `3070:2037` and `3070:2157` are four scroll
    positions of the same rail, not four sections — 2012, 2016 and 2026 each
    appear in two of them. Ten events, 361px cards, 100px gutter.
    - **Every card draws its picture at the same y** (698..960 in the section).
      Only the text moves, above the band or below it. Reproduce that by pinning
      the band (304px of space, then 262px of picture) and alternating the text
      around it — never by placing each card at its own offset, which does not
      survive a width change.
    - Below lg the rail stretches the cards to equal height and each card's copy
      wraps differently, so the bands drifted up to 52px apart. `flex-1` on the
      text block pushes every picture to the card bottom and re-aligns them.
    - **Each of the 13 fills has its own zoom crop** — 1.10x on 2006 against
      2.18x on 2011 — so each crop is baked into its file at the box aspect
      (361:262 single, 180:262 per half of a pair). Measured: `object-cover` is
      a no-op on all 13. Only `2012` misses 2x (1.68x); its source is 1244x794
      and the crop leaves 607px for a 722px slot. That original is owed.
    - The connector is a **1px dashed rule, `#C6C6C6`, dash 5/5**, at the text
      block's leading edge. A CSS `dashed` border uses the browser's own rhythm,
      so a repeating gradient reproduces the drawn lengths.
    - The 869px flower watermark (`opacity 0.04`, `#1F49BF`) belongs to the
      **section**, not the track: all four frames draw it in the same place.
    - A snap rail needs `scroll-padding` equal to its own padding. Without it a
      `snap-start` card aligns to the container edge, the gutter scrolls away and
      the rail rests at `scrollLeft` 24 instead of 0.
    - Figma draws no arrows and no scrollbar; the rail, its drag and its arrows
      are the build's own, following Proven Results.
    - **Motion, user 2026-09-24: the Proven Results animation, plus drag.** From
      lg with motion on, the rail pins under the header and the vertical scroll
      moves it sideways. The code is shared with Proven Results
      (`lib/pinnedTrack.ts`), so the hold, the scrub rate, the 0.3-viewport
      dwell, the card fade and lift, and the scale-to-fit are the same. **Only the
      rail pins, not the heading.** The heading is three lines at 50px, and a
      pinned heading would have scaled the cards far down on a laptop. Measured
      scale with the rail alone: 1.0 at 1440x900 and 1920x1080, 0.83 at 1024x768,
      and 0.76 at 1280x720. A drag moves the page scroll, not the track, so the
      pin stays the one source of the position: 1 track px = `(1-HOLD)/RATE` =
      0.8 scroll px, clamped to the moving range. The arrows go while the rail
      is pinned. Below lg, and with reduced motion, the swipe rail stays.
    - The pinned section is about 4,000px tall, so a plain `threshold: 0.3` never
      reported its `section_view`. `AboutPage.tsx` now counts a view at 30% of
      the section or 30% of the screen, whichever needs less.
    - Copy drawn as-is and worth a ruling: **2011's title is set entirely at
      36px** where every other event splits the year (36) from the name (24);
      **"OffyPlex" in the 2017 title is "Offyplex" in its body**; **2016's body
      has no full stop**.
18d. **Our Values is an accordion whose two panel states are MIRRORED.**
    `3489:3191`; the unclipped copy is in `3082:1777`, which is a **different
    colour variant** (coloured panels, white marks) — the section is what ships.
    - A closed panel puts the mark at its left (`left: -78`) and clips the
      407px text block to 214; an open panel puts the mark at its right
      (`left: 242`) and shows the text whole. So the mark **moves** between the
      states. A closed panel is not the left slice of an open one, and building
      it that way hides the mark completely.
    - Colours, read off both rendered states: closed sets title AND body in
      Text/Subtitle-2 `#A0A0A0`; open sets the title `#1F49BF` and the body
      `#0F1219`.
    - Each value owns a mark colour: Commitment `#FFF1F3`, Open & Sincerity
      `#FFEB97`, Merit `#FFBFC7`, Innovation `#CAF2E0`, Caring `#1F49BF`.
      **Unresolved:** the artboard opens Caring, whose colour is also the blue
      used for the active title, so it cannot show whether a mark turns blue
      when its panel opens. Built as five fixed colours; one line to change.
    - **Size the panels by SHARE, not by pixels.** 214/448 on four 20px gutters
      needs 1384px, which fits the column only above roughly 1432px; at 1024 the
      row ran 384px past the screen, clipped by `body { overflow-x: hidden }`
      and invisible to a leaf-based overflow probe, because each panel clips its
      own children. Shares reproduce the artboard exactly at 1440.
    - The five mark SVGs shipped once `get_design_context` recovered later in
      the 2026-09-08 session. Each is 284x284 and **clips itself**, because
      several petals are drawn past that frame. Their flat fills confirmed the
      per-value colours above independently of the screenshots.
    - A mark needs **`max-w-none`**: the global `img { max-width: 100% }` capped
      it to the panel width and squashed the 284 square to 215x284. The panel
      must CLIP the mark, never resize it.
    - **Card design of 2026-09-24 (Figma 3363:3591, user ruling).** The frame
      draws five equal 448x589 cards. The user kept the accordion and its
      animation, and chose "marks stay": each mark sits at the panel's top-left
      in both states, because the frame draws only that position. So these
      points above are **superseded**: the 523 height (now 589), the mark that
      moves from left to right, the grey closed text (every title is now
      Text/Primary and every body Text/Default, 16/26 weight 500), and the five
      pastel colours. The open panel is BG/Default (white), and a closed panel
      is BG/Secondary, the section's own fill. New marks, each with its own size
      and offset from the panel's top-left: Commitment `#FFBFC7` 347 at
      (-98,-121), Openness `#FFCE00` 306 at (-55,-62), Merit `#DD3C57` 310 at
      (-45,-86), Innovation `#22B573` 320 at (-71.43,-99.43) (a 336 box at
      (-76,-104) with the art 4.57 inside), Caring `#1F49BF` 284 at (-38,-65).
      The marks are inline (`components/about/ValueMarks.tsx`), not in the
      bucket, because each is a flat vector under 2 kB. Measured at 1440: all
      five at their drawn size and offset, the panel row 589 tall.
18e. **DIY Jam (`3133:4506`) shows its whole photograph, like the hero.**
    Figma draws the 1024x683 fill with `object-fit: fill` into an 856x711 box,
    which squeezes the group 1.25x. `object-contain` under ruling 18b instead:
    distortion 1.000 and the whole frame visible at every width.
    - **Both columns are sized by SHARE.** The artboard's 496 card, 40 gutter
      and 856 picture need 1392px, so the row starts at `xl`; below that they
      stack. A fixed 496 card against a fluid picture also drifted the drawn
      496:856 to 496:1256 at 1920, and letting the picture take `flex-1` at
      1024 flattened its box from 1.204 to 0.783. The share holds 0.3669 at
      1280/1440/1920 and reproduces 496x(856x711) exactly at 1440.
    - The source is 1024x683 for an 856x711 box: **1.20x at 1440 and 0.92x at
      1920**. Another original the team owes.
    - Figma gives **neither button a destination**. `DIY_JAM_CTAS` in
      `navigation.ts` records the two stand-ins and why.
    - **Amended 2026-09-24 (round 4).** `4140f3d` had changed the contained photo
      to a cover crop, which cut its sides. The team's node **3133:4525** holds the
      same 1024x683 file (difference 3.7/255) and squeezes it 1.25x into 856x711.
      The user chose **the whole photo at its own 3:2**: the picture box is
      `aspect-[1024/683]`, and no stretch, crop or band shows. The card and the
      picture share one row height, and the picture sets it. Measured: at 1440
      the copy wraps to 5 lines and the card needs 586px beside a 571px picture
      (9px of gap), at 1480 the gap is 26px, and at 1520 the copy takes 4 lines
      (79px). So the row starts at **2xl (1536)**, where the card and picture are
      611 = 611, and 740 = 740 at 1920. Below 2xl the section stacks, card first.
      **Ruled 2026-09-24: keep the stack below 1536** (user). The photo there is
      the full column width at 3:2 (928px tall at 1440). Do not bring the row
      back below 2xl.
    - "See the story" now opens the story page (ruling 18i).
    - **New photo, 2026-09-30.** The user sent an 856x711 file, the Figma box
      at 1x. The picture box is now `aspect-[856/711]`, as drawn, and the whole
      file shows (distortion 1.000 at 390/1440/1536/1920). The row still starts
      at 2xl, by the ruling above. Measured: 917x761 beside a 761 card at 1536,
      and 1109x921 at 1920. Stacked at 1440, the picture is 1392x1156. The file
      is 1x, so it upscales 1.07x at 1536 and 1.63x stacked at 1440.
18f. **Our Team's seven cards are drawn inconsistently and are NORMALISED.**
    `3133:4583` — the frame is named "Our Values" but its badge says "Our Team",
    and the badge is right. A 4x2 grid of 318px cards on a 40px gutter with 100
    between the rows; the eighth cell holds the "Join our team" CTA.
    - Six cards use a 4.386px radius, one uses 3.78. Card 1 carries
      `0 1px 2px #0F1219`, card 2 carries `0 4px 4px rgba(0,0,0,.25)`, and the
      other five carry none. Card 3 also sets its own `#f2f5f9` background.
      These are **siblings in one row**, where a difference reads as a defect
      rather than as intent, so the majority wins: 4px radius, no shadow, blue
      band. This is the `SectionBadge` precedent, not the ruling-10 one — that
      covered a difference between BREAKPOINTS, which nobody sees side by side.
    - Each portrait nests **two** transforms: a wrapper inside the 318px image
      box, then the picture scaled and offset inside that wrapper. Both are
      baked into the file at the card's box aspect. Measured: `object-cover` is
      a no-op on all seven, and every one carries 2x.
    - The names are **not** `whitespace-nowrap` as Figma sets them. A card clips
      its overflow, so a name that outgrew its box would be silently cut.
      "Nguyen Ngoc Ai Duyen" wraps to two lines at 1440 and makes the section
      20px taller than the artboard; Figma would have clipped it instead.
    - Four columns only from `xl`. At 1024 the artboard's four cards plus their
      gutters need 1392px against a 976px column.
    - **New portraits, 2026-09-24 (Figma 3214:4405, 3214:4430).** The old files
      had jagged edges, because `4140f3d` turned their black ground white with a
      flood-fill, which leaves a hard, aliased edge. The new sources are clean
      cut-outs (62-80% transparent, with a soft alpha edge). The bake puts each
      one on its drawn ground with alpha blending at the source resolution, then
      applies the frame's two nested transforms and crops to 318:356 (636x712,
      2x). Measured against the Figma render: mean difference 0.6-3.9/255.
      **Duc's ground is `#ECF4FF`**, as the frame draws it, where the other six
      are white. That is a sibling difference of the kind this ruling
      normalises, but here it is inside the photo, so it is reproduced and
      flagged (one line in the bake script).
18i. **The DIY Jam story page (Figma 3830:8872, 1440 only), added 2026-09-24.**
    Route `/about-us/diy-jam` (`ROUTES.diyJam`), lazy-loaded, in the sitemap, with
    `index, follow`. The "See the story" button opens it.
    - The top photo (3830:8873) is a different 1024x683 photo, which Figma
      stretches 1.14x into 1392x817. It shows whole at 3:2, the DIY Jam ruling
      (18e). It upscales 1.36x at 1440 and 1.75x at 1920, and the original is owed.
    - The Sparks photo carries Figma's crop (1117:593 of a 4096px frame), baked
      in. The poster is 16:9 into a 16:9 box.
    - The two marquee rows (3842:15308, 14 tiles at 3:2, three of them cropped
      and baked; 3842:15420, 5 tiles at 16:9) use `components/ui/PhotoMarquee.tsx`.
      Each tile is 461 tall from lg and 240 below, at its file's own ratio. The
      loop speed is one value (60 px/s) for both rows, so the duration comes from
      the set width (156s and 69.29s at desktop). The track ends with one gap of
      padding, or -50% stops half a gap early and the loop jumps.
    - **The Grand Finale poster ships without its play icon and its 62% grey dim**
      (user: "poster only for now"). The dim exists only to carry the icon.
    - Slips shipped as drawn and flagged: the last project, "O2B Automated
      Branding Assistant", has no colon after its name. The artboard puts 55px
      between the top block and the first text block where every other gap is
      64; the build uses 64. The Sparks photo has a 5.049px radius, built as 5.
    - Figma draws no 390 frame. Below lg: the home-page type steps, full-width
      images at their ratios, 240px tiles, 40px gaps.
    - **Round 1 changes its layout (user, 2026-09-30, Figma 4047:9480 and
      4047:9479).** The text (520) sits beside a 556x727 window, 40px apart, in
      the 1116 column, centred on the window. The window holds two 272px
      columns, 12px apart, of 7 photos each. The first column moves up and the
      second moves down, at 60 px/s (55s at 1440). `Marquee` gets a `reverse`
      prop for this. It is an inline style, because the `?motion=on` shorthand
      resets a class direction.
    - Each tile is Figma's crop of a 4096x2731 frame into 272x459, baked at 1x
      and 2x (`diy-story/round-1-cols/`). Figma draws some tiles 460 or 461
      tall. The bake keeps Figma's centre and uses one 272:459 box. The old
      3:2 row files are removed.
    - The 520:556 split holds from lg (a 483x632 window at 1024). Below lg the
      window goes under the text at full width, at 556:727. With reduced
      motion the loop stops and each column scrolls.
18g. **Our Working Life's marquee needs NO assets of its own.**
    `3133:4640`. A news list (403) beside a white panel (987.6) holding the
    anniversary banner, then two photo rows.
    - **Both marquee rows draw the same nine pictures as Our Journey, at the
      same crops**, and a tile's 330.222x239.663 box is the same 1.378 ratio as
      a Journey card — so the baked Journey files drop straight in. The rows are
      one set in two orders. Check this before exporting anything here.
    - Figma leaves a **dashed connector inside three marquee tiles**, copied
      from the timeline cards. They render behind the pictures and are invisible
      in the artboard, so they are dropped rather than reproduced.
    - The banner is **rebuilt from its layers, not flattened**: a blue ground,
      two 1024x417 photo textures at 38% on `mix-blend-overlay`, the vertical
      logo, the "20th" mark, and two lines of live text. Its type scales with
      the box through **container query units** (`container-type: inline-size`
      plus `6.14cqw`), because the banner's width follows the column. Measured:
      57.15px at 1440 against the artboard's 57.056, and 19.03px at 390.
    - The white panel insets the banner **28.8 left, 29.5 right, 28.8 top and
      bottom**. Only the right inset is stated in the export; the others come
      from 987.6 - 29.5 - 929.302 and 660 - 602.4.
    - Only `animate-marquee` survives in the config — cleanup removed the
      reverse keyframe — so the second row uses `animation-direction: reverse`
      rather than restoring one.
    - **The stories select the panel picture (user, 2026-09-30).** Hover frames
      4047:8972 (Virtual Race), 4047:8973 (Offy Friday) and 4047:8986 (The Real
      Secret). Hover, focus or a click selects a story. The white ground moves to
      that story, and the panel shows its photo. The selection stays when the
      pointer leaves, so a tap does the same thing. The first story shows the
      banner. Each title is a `button` (`aria-pressed`) whose hit area covers
      the story.
    - The hover frames draw a 941x631 panel with the photo 836x542 at 52/45
      insets, against the default frame's 987.6 panel. The photo has the
      banner's ratio (1.5424 against 1.5427), so **the photo takes the banner's
      box and the panel keeps its size**. A panel that changed size on hover
      would move the layout. Normalised and flagged.
    - Over each photo: a 40% Black/950 dim and a #F7F7F7 social mark (LinkedIn,
      Facebook, a play mark) 22px in from the lower right, scaled with the box.
      **The marks are not links**, because no post URL exists. The LinkedIn
      group is drawn twice in Figma, one on top of the other. It is drawn once.
    - Virtual Race (3840x2160) and Offy Friday (1672x1254) are cover crops,
      baked at the box ratio. The Real Secret has no object-fit, so Figma
      stretches its 1024x683 file 1.03x wide. The bake does the same (flagged).
      It is 1024px wide only, so it upscales above about 1400.
18h. **`Reveal`'s `amount` is a fraction of the CONTAINER, not of the screen.**
    Found on the About Us page's Our Team grid, 2026-09-08. Stacked into one
    column that list is about 3,900px tall, so the default `amount: 0.2` asked
    for **780px of it to be visible — more than any phone viewport** — and the
    seven cards plus the CTA never appeared at all on a phone.
    - A probe at a 1600px viewport passes, because 780 < 1600. **Probe a real
      phone height** (390x568 and 390x667) whenever a `Reveal` wraps a list that
      stacks.
    - For a long list use a small fraction (0.05 here), which fires as the top
      edge arrives. Keep the larger default for short rows.
19. **The footer's social glyphs come from Figma, not the bucket.** `3129:3568` draws
    each mark at its own size inside a shared 38x38 box (LinkedIn 13.89x14.79, TikTok
    16.51x19.05, Facebook and YouTube filling the frame). The earlier decision to
    reuse MenuOverlay's bucket set was overruled 2026-08-26: that set normalised every
    mark to one 45.385 square, which rendered LinkedIn small and Facebook oversized.
    They are inlined in `ui/FooterIcons.tsx`. **MenuOverlay keeps the bucket set** —
    its own frame draws those.
20. **Rizlum's partner tile, rebuilt twice on 2026-08-26.** The original was
    horizontally stretched 1.61x (artwork ratio 7.74 against the source's 4.80) and
    filled only 27% of its canvas height instead of 44%, almost certainly by the
    white-key background pass — the logo is white-on-transparent, so that pass had
    nothing to key and mangled it. **Do not run a white-key pass over this file.**

    Reproducing Figma's padded `object-cover` box was still not enough: it leaves the
    logo occupying 145x30 of a 203x69 canvas, i.e. only ~2x effective resolution for
    the artwork and a 73px-wide render, which reads as blurry. The file is now
    **tight-cropped to the artwork at 320x67** (every pixel is logo, ~3x the display
    size) and drawn at 105x21.9 rather than Figma's 73x15.2, to carry the same visual
    weight as its sibling tiles. The one source is a YouTube-thumbnail frame whose
    artwork tops out at 897x187, so that is the ceiling until a real logo arrives.

**The responsive lesson worth keeping (2026-08-26)**
21. **A fixed height on a fluid width is the bug.** Every fidelity complaint from the
    26 Aug device review traced back to one shape of mistake: a pixel value that is
    correct at one artboard width and silently wrong at every other.
    - **About photos.** `h-220` / `lg:h-860` made the box aspect a function of the
      viewport: 1.63 at 390 but **4.50 by 1023**, so an `object-cover` threw away 70%
      of the picture on a tablet; and 1.43 at 1280 against 2.08 at 1920, so the same
      photo looked horizontally squeezed on a scaled laptop. Fixed with two constant
      ratios — `aspect-[358/220]`, `lg:aspect-[1792/860]`.
    - **Overlay bands and nowrap headings.** The About caption band's insets are the
      artboard's fixed 200/60/176, which at 1024 leaves a 576px band whose copy needs
      288px of height — it spilled over the photo, so the overlay now starts at `xl`.
      Likewise three `lg:w-[600px] lg:shrink-0` blurbs and the 86px nowrap headings
      beside them needed ~1130px inside a 976px column: 235px of copy was being
      silently truncated by `body { overflow-x: hidden }`, with no scrollbar to show
      it. The blurbs now carry `lg:min-w-0` so they shrink, and Client Review's
      heading is `2xl:whitespace-nowrap` — Figma lets it overrun its column by 32px,
      which is safe at 1920 but ran it straight over the cards below 1440.
    - **Check for this by measuring, not looking.** Probe a real page in an iframe at
      375/768/1024/1280/1440/1536/1920 and assert three things: no leaf element's
      right edge exceeds the width once clipping ancestors are excluded, every
      aspect-ratio box reports the same ratio within a breakpoint, and no absolutely
      positioned band needs more height than it has. `body` clips the evidence, so a
      screenshot will not show you the overflow.
22. **Our Approach is a row from md, not lg.** Figma draws only 390 and 1920, and
    taking the 390 stack all the way to 1023 left three full-width steps on a tablet
    where three columns fit. The mark keeps a fixed slot at md as well as lg, because
    Engage's mark is 105px where the other two are 100 and the text blocks would
    otherwise start on different lines.

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
| legacy | `pub-e3bac769…` | Not used since the splash screen was removed (2026-10-09). The preconnect is gone too. |
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
  **2026-09-24: Pillow is no longer installed** (both Pythons on the machine lack it). Use `sharp` 0.34.5,
  which is in `node_modules`: run a node script from the worktree root and resolve it with
  `require(require.resolve('sharp', { paths: [process.cwd()] }))`. In one sharp pipeline, a second
  `resize` replaces the first, and an `extract` after a `resize` fails: write each step to a buffer.
  The round-4 bake script (team crops, story tiles) is `bake-about-r4.cjs` in that session's scratchpad.
  Its crop numbers are in rulings 18f and 18i.
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
  **The Sept-2026 footer rebuild dropped the Cookie Settings link and nobody noticed for
  six days**, which left `CookieConsent`'s `officience:cookie-settings` listener with no
  sender and made a stored consent choice impossible to withdraw. Restored 2026-08-26. If
  the footer is rebuilt again, grep for that event name before shipping — a dispatcher
  with no listener is a dead click, a listener with no dispatcher is a compliance defect.

**Behaviour Figma does not draw, added 2026-08-26 (do not "simplify" back):**

- **The survey is a real dialog.** It renders through `lib/modal.ts` like every other
  overlay — scroll lock, focus trap, Escape, focus restored, page behind it inert. It had
  none of that: Tab walked straight out of the modal into the page. `FOCUSABLE` in
  `modal.ts` now excludes `[tabindex="-1"]`, without which the survey's off-screen
  honeypot input is the first match and opening the dialog throws focus off the page.
- **The overlay menu is `inert` while closed.** Off-canvas is not out of the tab order:
  its ~15 links stayed reachable inside an `aria-hidden` subtree. The effect that sets it
  is declared *before* `useModalA11y` on purpose — effects run in declaration order, and
  focusing into a still-inert subtree fails silently.
- **Section links work from the legal routes.** `scrollToSection` only ever worked on `/`;
  off it, `getElementById` returns null and the click does nothing. The header CTA, the
  header logo and the menu's Work / About Us / Rizlum / HR / ITS items all did nothing on
  `/terms-of-use` and `/privacy-policy`. They now go through `useGoToSection` in
  `navigation.ts`, which scrolls on the home page and navigates to `/#id` elsewhere,
  letting `ScrollManager` land it once the page mounts.

**Rulings from the 2026-09-24 review (round 3):**

- **Our Services deck: one fill, no dim.** The stacked rows need an opaque fill to cover
  the row below. The fill is the section's own BG/Secondary `#F7F7F7`, so the deck shows no
  panels, as `3137:1931` draws. The user chose this over BG/Default `#FFFFFF`, which would
  show four white panels. The old `brightness()` dim is gone: it turned covered rows
  `#EFEFEF` and caused the colour mismatch when the last row arrived. The last row takes
  no scale, because nothing covers it.
- **Proven Results holds on its last card** for 0.3 of the viewport height (about three
  wheel notches) before the pin releases (`DWELL` in `ProvenResults.tsx`).
- **The milestone numbers roll again** each time they come back on screen (`Odometer.tsx`).
- **Contact** — see "Connect With Us (step 9)" for the stack below 1536px.

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
- **The heading changes from "Let's Build Together" to "Connect With Us"**. An older 1920
  frame broke it after "Connect". The current frame `3151:2444` (read 2026-09-24) draws it
  on one line, and the build follows it (user ruling). It is 672px of text in the 686px column.
- **Spacing and panel width follow `3151:2444` (user, 2026-09-24).** Badge → heading 16,
  heading → subtitle 32, text column 686, column → panel 100, panel 858 at 1920. The
  subtitle is capped at 686px, so it is 2 lines at every desktop width.
- **Below 1536px (2xl) the text block stacks above a full-width panel, 64px apart** (user
  ruling). The 686 + 100 layout needs 1536px of viewport: at 1280 it leaves the panel 318px,
  at 1024 only 62px. The old 624px column already left the panel only 200px at 1024.
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

#### Survey (step 11) — in progress

The July build was already made from an earlier cut of these same frames, so this is a
refinement, not a rebuild. Deltas applied: modal 800 -> 968; progress bar to 8/4 gaps with
two distinct greys (Text/Subtitle-2 `#A0A0A0` for the inactive word, Border/Outline-Field
`#C6C6C6` for the inactive rule — the July build used one grey for both); chips to Figma's
12/6 with Medium `#5A5A5A` text; no Cancel on the first step.

- **A required consent checkbox is new** and appears on the last input step of BOTH
  branches (2809:2247 and 2818:3232): "I confirm that I have read and accepted the Terms of
  Use and Privacy Policy of Officience." It gates submission and is recorded in the payload
  (`consent: 'Accepted Terms & Privacy'` added to `FIELD_LABELS`) — a consent nobody records
  is not worth collecting. Its links open in a new tab so a part-filled form survives.
- **Figma's category picker drops "Full-time career"**, one of the five cards, and the one
  that (with Internship) routes to `jobs@`. Dropping it would leave full-time applicants no
  path at all. **Kept, flagged** — the design's four rows are four *detail forms*, and
  Intern/Full-time have always shared one, so this reads as a lost card rather than a
  decision. Needs a ruling.
- **Figma's Internship card description is the wrong copy** — "Build or improve a
  website/app", lifted from the work flow's solve options. The build's own line is kept.
- **The completed screen carries two misspellings** — "Transmission competed!" and "3
  bussiness days" — plus a lowercase "officience" in its heading. The first two were
  already spelled correctly here; the **lowercase heading was not**, despite this note
  once claiming all three were. Corrected 2026-08-26 to "Work with Officience".
- **Figma labels the send button "Next step"** on the last input step, where the build says
  "Submit". Kept as "Submit": that click sends an email, and "Next step" understates an
  irreversible action. Same category as the typos — reproducing it would ship something
  worse for no design gain.
- **"What bring you here?"** on the picker is missing its "s", and duplicates the Contact
  section's own "What brings you here?".
- The chip keeps 12px of vertical padding at 390 (Figma draws 6) so it clears a 44px tap
  target — an accepted divergence, as elsewhere.

**Corrected 2026-08-26 after a fidelity re-read of the frames.** Four things the build had
carried over from the July survey rather than read off the Sept frames:

- **The question labels are not numbered.** `2809:2846` / `2809:2247` / `2818:2936` draw
  "I am a…\*", "Timeline\*", "Contact details" — the "1./2./3." prefixes were July's.
- **The selected chip is filled white**, not `#ECF4FF`. Figma's Form Input Chip
  (`3329:2505`, "Agency" selected) carries the state on the border and a bold blue label
  only. The *option cards* do fill pale blue — those were already right, and the two
  controls are deliberately different.
- **"University / School" is required** on `2818:3232` (red asterisk); it was optional
  here, and is now part of the talent gate.
- **The third progress word is "COMPLETE"**, not "Completed".

**Not yet verified, and not verifiable here.** `document.hidden` is true in this Chrome
profile, so rAF is frozen: framer's `AnimatePresence mode="wait"` never finishes the exit
animation, the incoming panel never mounts, and every screenshot comes back blank. Confirmed
working through the DOM: step-0 gate, the Back button appearing at step 1, the "Submit"
label, and the primary button disabled at step 1. **The consent checkbox's own rendering and
its isolated gate need a real, focused browser.** Live e2e additionally needs the Vercel
SMTP env re-scope and a preview deploy — `api/survey.ts` does not run under Vite.

#### Legal pages v2 (step 12)

Figma `2922:1887` (Terms) and `2927:3153` (Privacy) — **1440 artboards, and the only pages in
the redesign with no 390 frame**, so the mobile treatment is the build's own.

- **The section set already matched.** Figma's TOC lists twelve items and `TERMS_SECTIONS`
  already held exactly those twelve, in order, so the "transcription + diff vs legacy" the
  plan called for came out clean. The single difference is section 4: Figma's TOC abbreviates
  "Company Content **&** Media" where the transcribed draft says "**and**". The document's own
  wording is kept.
- **The heading is now "Terms of Use"**, not "Terms & Conditions", and a "Last updated: June
  2026" line joins the hero. The footer link was already relabelled in step 10.
- Type maps onto the scale with nothing new: hero `display-xl` 86/95, section headings
  `display-sm` 50/58, body `body-lg` 16/26 — all exact.
- The hero band is 478 tall around 147px of copy: **124 above, 207 below**. The slack under
  the title is deliberate in the artboard and is reproduced.
- **Figma stops the column rule after ~843px**, about the height of the contents card. With
  the panel sticky the rule runs the full column here, which is what a column divider is for.
- The contents panel is one list, not two. A separate mobile copy would have put twelve
  duplicate anchors in the document and let the two states disagree.
- **Clicking a contents row claims it immediately** rather than waiting for the scroll to
  settle: whether the click highlighted what you asked for otherwise depended on where the
  section landed against the spy's line, and one that stopped a pixel low highlighted its
  predecessor.
- Scroll position, not IntersectionObserver, decides the current row — legal sections run
  several screens each, so most of the time no boundary is intersecting anything and an
  observer simply stops reporting.

#### Cleanup (step 13)

Grep-zero confirmed for all ten legacy `.t-*` classes, `animate-fade-in`,
`animate-marquee-reverse`, the pre-Sept `max-w-content` token, and `ASSETS.hero` /
`.services` / `.approach` (their files stay in the bucket). `index.html` lost ~2 kB.

Verified: exactly one `h1` on `/` and it is the hero headline; H1→H2→H3 with no skips; 56
images with zero broken and zero missing `alt`; the only empty `alt`s are the decorative
flower and the marquee's duplicate logo copy, which is the intended pattern; JSON-LD
`sameAs` matches `SOCIALS` exactly; all four routes resolve with correct titles and the
unknown path redirects to `/`; `vercel.json` still sends `noindex, follow` for both legal
routes while `/` stays `index, follow`; the sitemap lists only `/`; the legal chunk is still
split out of the main bundle; canonical and `og:url` stay pinned to `/`.

**Two self-inflicted regressions found and fixed this session — both worth not repeating:**

1. **A colour token named the same as a fontSize token.** Adding `subtitle-2` to `colors`
   collided with the existing `subtitle-2` in `fontSize`; Tailwind feeds both scales from the
   `text-` prefix, so one class set a colour AND a 28px size, and the survey's progress
   labels shipped at 28px in a 40px bar. **Before adding any `colors` key, grep `fontSize`
   for the same name.** The colour is now `gray-fig-400`.
2. **A regex with `[^}]*` cannot delete a nested object.** Removing two keyframes that way
   chopped their middles out and left orphan fragments, which made `tailwind.config` a syntax
   error — so every custom utility silently died site-wide while core ones like `text-white`
   kept working. Brace-counting called it "balanced" because the orphans happened to pair up.
   **Validate the config by executing it (`node -e` on the object literal), not by counting
   braces.** That is how the repair was confirmed.

Also worth knowing: **injecting a probe element and reading its computed style is not a
reliable check** of whether a utility exists. The Play CDN generates on scan, and a
freshly-injected node is often not picked up — it reported 16px for `text-h1` on a page that
was rendering `text-h1` correctly. Read the real rendered element, or look for the rule in
`document.styleSheets`.


## Behaviour divergence — office addresses link to Google Maps (2026-08-26)

Each office row in Connect With Us is wrapped in a link to
`google.com/maps/search/?api=1&query=<address>`, opening in a new tab with an
`aria-label` naming the office. Figma draws no link here; this is a team request
carried out during the Sept-2026 motion pass, recorded in the same class as the
Cookie Settings entry. Hover underlines the address and tints the city.

## 19 — Services hub and the seven service pages (started 2026-09-29)

Spec and plan: `C:\Users\Admin\.claude\plans\what-is-the-latest-radiant-wall.md` (three phases: the template and the
Software pilot, the other six pages, the hub). Every frame is 1440 only. No page draws a 390 frame or a 1920 frame.

### Node map
- Hub `3109:1851` (1440x7440). The strong-colour grid `3530:3299` is the hover state of the hub grid `3530:3351`.
- The seven child pages are Figma "Brochure" frames on one template:
  - Design & Digital `3494:4864`, with extra work cards `3524:14458`.
  - Software & Web Development `3707:3568`, with the whole FV Hospital card `3707:6041`.
  - BI & Analytics `3707:6222`, with extra work cards `3707:9173/9184/9195` and the quote master `3707:8921`.
  - Data Engineering & Processing ("Crunch") `3716:11412`.
  - IT Operations & Support `3716:12297`.
  - People & Talent Solutions `3726:13016`.
  - Trusted AI Platform for Insurance `3738:3980`, with extra work cards `3738:4395/4406/4417` and a 4th team card
    `3739:4505`.
- Software, per section: the hero photo `3932:5198`, the copy `3716:12747`, the back button `3712:9440`, "What We Do"
  `3707:3581`, the strip `3707:6113`, "Selected Work" `3707:5974`, "People Trust Us" `3707:5502`, "Meet the Team"
  `3707:5524`.

### Rulings (user, 2026-09-29, unless marked "build")
19a. **Routes.** `/services` (the hub) and `/services/<slug>`. There is one template, `pages/ServicePage.tsx`, and one
    content file per page in `content/services/`. An unknown slug goes to `/services`. Until the hub exists (phase 3),
    `/services` falls to the catch-all and goes home.
19b. **Heroes show the whole photo at its own ratio**, as ruling 18b does for the About hero. From lg the copy sits
    116px above the bottom edge and the back link 60px below the top edge. Below lg the copy sits under the photo.
19c. **Selected Work pins, with drag,** on `lib/pinnedTrack.ts` (the Our Journey pattern). Only the row pins.
    - Build: a row that travels less than 140px does not pin.
    - Build: the card is 570 wide at 3xl, because Figma's 3 x 571 + 2 x 40 is 1px wider than the 1792 column.
19d. **The tool strip loops when its set is wider than the column,** on `components/ui/Marquee.tsx` at 60 px/s. A strip
    that fits is a fixed, centred row.
19e. **Quotes: three or more loop up** (the vertical `Marquee`) in a 548px box from lg with motion on. With one or two
    quotes, below lg, or with motion off, the cards are a fixed list.
19f. **Placeholders ship as drawn and are flagged.** The one exception: the three Design & Digital note-lines ("Framed
    by a very large, high-fidelity mood board image", and the others) do not show.
19g. **The hub list is a reveal only, with no deck.** Seven rows at a 248px peek would pin the last row at 1,601px.
19h. **The hub grid is pastel at rest and strong on hover.** The cards are not links, so there is no focus state.
19i. **The AI Insurance team takes four columns.**
19j. **The LinkedIn icon shows only when a URL exists.** The team gives no URLs yet.
19k. Build: **the badge label is Body-lg-medium (16/26) from lg** on these pages (`SectionBadge size="sm"`). The home
    page badge is 20/28.
19l. Build: **"People Trust Us" is Display-sm at lg and 86px from xl.** At lg the 86px nowrap line and the 545px
    column need 1,217px of a 976px column.
19m. Build: **the row pictures are fluid up to their drawn width.** A 699px picture does not fit beside the 549px text
    column at 1024.

### Assets (Software, phase 1)
- The bake uses `sharp` with a frame renderer (scratchpad `render-lib.cjs`): each layer is drawn where Figma draws
  it, at 2x, clipped to its node and its frame. The files are in `assets-src/services/software-web-development/`.
- **Two Figma fills are stretched.** The IOGA card image is stretched 1.095x, and the Mobile Apps tech panel 1.045x.
  The bake keeps Figma's anchor and crop area at one scale on both axes, so the distortion is 1.000.
- **The Figma files are small.** The hero is 1024x600, and it upscales 1.4x at 1440. The row and card files have 0.35
  to 1.05 source px per 2x px. The originals are owed (see the backlog).
- The Mobile Apps picture is a composite of two fills (the tech panel and the phone screen, with a 17.245px radius).
  `get_screenshot` gives only 1x (708px), so the bake builds the composite from the two source files.
- The team portraits have the Gray/200 `#D9D9D9` ground baked in. The quote avatars are square files, and the page
  rounds them.
- The three icons (Iconly "Arrow - Left 2" and "Arrow - Right", and the LinkedIn mark) are inline in
  `components/services/parts.tsx`, with the exact Figma paths.

### Slips shipped as drawn (Software)
- "Saas Platforms" (not "SaaS"). "Dr.Jean Marcel Guillon" has no space after "Dr.".
- The Mobile Apps picture group is drawn twice, one copy inside the other (3707:9251 holds 3707:9255). One copy is
  built.

### Phase 2 — the other six pages (2026-09-29)
Each page is one content file in `content/services/`. The bake scripts are `bake-<slug>.cjs` in the scratchpad.

**Template additions (build):**
19n. **The hero takes the drawn text-box widths per page** (`titleWidth` and `subtitleWidth`). Software is 684/461,
    D&D 763/566, Crunch and IT Ops 684/566, People 684/466, and AI 850/887.
19o. **A `\n` in a hero title or a row title is a drawn line break, from lg** (`whitespace-pre-line`). Two titles use
    it: IT Ops "IT Operations / & Support" and D&D "Branding & / Visual Identity".
19p. **The hero title is Display-md at lg and Display-xl from xl.** At 1024 a three-line title (BI, Crunch) at 86px
    needs about 613px of a 600px photo.
19q. **The team name plate ends at 450 of 478.66 and grows upward.** Linh Ngo's (IT Ops) 142px plate at y311 ends
    there too. The stat line keeps its drawn spaces (Crunch and BI use double spaces).

**Stretched Figma fills, and how each is baked:**
- People: the Nga Bui portrait is stretched 0.762x. It is unstretched at the top-left anchor.
- IT Ops:
  - The Linh Ngo portrait is stretched 1.675x (squeezed to 60% width). It is baked as a cover centred in its node box,
    because the unstretch at the anchor cut the face.
  - The Tuan Nho portrait (1.122x), row-monitor (0.777x), row-continuity (0.940x) and work-cassim (0.969x) are
    unstretched at the anchor.
- Crunch: row-support (0.844x) and work-cassim (0.969x) are unstretched at the anchor.
- D&D: the Branding leaf photo (0.727x), the Van Duong and Tien Ho portraits (0.747x), FINPIVOT (1.028x) and Offy
  (1.030x) are unstretched at the anchor.
- AI: the hero has the drawn navy scrim `rgba(5,8,70,0.42)` baked in. The file shows whole (1920x1277), so the AI hero
  is 958px tall at 1440, where Figma crops it to 839.

**1x assets (from `get_screenshot`, which caps at 1x):** D&D row-uxui (741), row-webdesign (751) and work-ecoeats (571).
These pictures are live layers and live text in Figma. They look soft on high-density screens.

**Slips shipped as drawn (phase 2):**
- **D&D:**
  - The three note-lines are omitted (ruling 19f). Only Web Design keeps its line.
  - The quote has straight double quotes in the text.
  - The quote author has no role.
- **BI:**
  - "Our A Team".
  - "See your business clearly - in real time" (a hyphen).
  - The strip has 25 logos. Logo 3 is identified by a best guess.
  - The Azure ML wordmark is white, so it does not show on the white strip.
- **Crunch:**
  - "Double" and "key QC" are two chips.
  - The quote line "Vendor Manager:" has a trailing colon, and it sits in the company slot.
  - The "Ads scraping / collection" card shows the FV Hospital photo (the same file as Software).
  - The team stat line says "Certified By Documation" (sic, 3716:12188). It ships as drawn.
- **IT Ops:**
  - Selected Work repeats the three Crunch cards.
  - "Tuan Nho" on the visible plate, where the hidden copy says "Tuan Ngo".
  - Linh Ngo's role is three roles with no separators.
  - Cong Chau's role is "ITs".
- **People:**
  - "Work habit" is in lower case.
  - "Soft power nurture caring" has no punctuation.
- **AI:**
  - The work tags look like placeholders, and card 4 repeats card 3's tags.
  - The card 2 title has its ellipsis typed into the text ("Intelligent document proces...").
  - The surnames use mixed capitals.
- **People and AI:** the middle team card hides a leftover "Tuan Ngo" plate, copied from Software. It is not built.

### Phase 3 — the Services hub (2026-09-29)
`pages/ServicesPage.tsx` at `/services`: the hero, `hub/HubServices`, `hub/TailorMade`, `hub/OurRoots`, and the
home `Contact` with the hub blurb (3257:2599) and no offices.

19r. Build: **the hub list is its own component, not a `Capabilities` variant.** It draws a 75px heading, no header
    button, 16px lists, a 349px rail and 253px buttons. The home page is unchanged, apart from its links.
19s. **The hub hero** shows the whole photo (1646x956), with the drawn 40% black scrim in CSS. The headline box is 1189
    wide and centred, so it starts at x126 at 1440 (at x366 at 1920). The two lines are Figma's own.
19t. **The Tailor-made marks** are inline SVGs with Figma's paths, placed in container units of the 684px card. The
    strong set is a second layer that cross-fades on hover (`hover: hover` only). The two clip masks of card 3 are
    full-bounds rectangles, so they are dropped. A card is at least 373/684 of its width tall and grows with its copy.
    At 1024 and 1280 the second row is 348px tall, because the five-cause list needs it.
19u. **Links.** The menu "Services", the footer "Services" and the home "View All Brochure" go to `/services`. All the
    `EXTERNAL.brochure*` URLs are removed, because nothing uses them. On `/services` the header's "Contact Us" scrolls
    to the hub's own contact band.
19v. **Slips shipped as drawn (hub):**
    - "Since 20 years" (a French construction).
    - "the faster tech hub" (not "fastest").
    - The hub row "AI Platform & Solutions" names the "Trusted AI Platform for Insurance" page.
    - The hidden 5th Roots logo slot is not built.
    - The contact band keeps the home layout (the text stacks above the panel below 2xl, ruling 2026-09-24), where the
      hub frame draws them side by side at 1440.

**Visual pass (2026-09-30, Chrome, iframe probe at 390 / 1024 / 1280 / 1440).** Four fixes:

19w. **A team statement aligns at the top.** D&D (3494:4864) draws the "Meet the Team" badge level with the first line
    of the statement. A title and its stat line still align at the bottom.
19x. **The swipe rail has `overflow-y-hidden`, and its cards start at any visible pixel.** Below lg, a card past the
    right edge waited for its entrance at y 28px. That offset gave the rail an 11px vertical scrollbar (`menu-scroll`
    shows scrollbars). With `amount: 0.3` the 78px edge of the next card also stayed at opacity 0, so the rail showed
    no sign that it scrolls. Now the edge shows, and each card enters when it comes into view.
19y. **From lg the hero title box is in em (`titleWidth / 86`).** At lg the Display-md title then keeps the artboard's
    line breaks. With the px box, BI broke as "Business Intelligence / & Analytics" at 1024 and covered a mascot's
    face. All 8 titles now have the same line count at 1024 and 1440. The smallest gap under the back link is 49px
    (BI, Crunch at 1024).
19z. **Four people take four columns only from xl** (the About rule). At 1024 a card was 203px wide, and the name plate
    covered most of the face. At lg the AI team takes two columns.
    - **Open, for the user:** at 1280 (268px cards) and 1440 (308px cards), "Dang Chuan NGUYEN" and "Guillaume
      SARKOZY" wrap to two lines at H2, and the taller plate covers the chin. The names fit on one line at H2 only
      from about 1800px. Figma draws three 428px cards with the fourth off the frame, so it does not show this case.

**User review (2026-09-30).**

19aa. **Some team source files are distorted, and Figma's stretch corrects them.** Tuan Ngo's IT Ops file
    (1024x1024) is 1.13 wider than the Software copy of the same photo (image registration). Figma stretches it into a
    427x479 box, which narrows it by 1.12. So the `unstretch` rule (use the file's own ratio) undid Figma's correction
    for Van, Tien (D&D), Tuan (IT Ops) and Nga (People), and they looked narrow. They now follow Figma's geometry. Their
    heads measure about 1.03 width to height, against 1.04 for the Software Tuan.
    - Linh Ngo (IT Ops): Figma stretches the 1024x1024 file into its 277x464.106 box (37:62) at x 76, y 15, a
      1.6755 squeeze. The first bake used a crop, and the second a 1/1.13 estimate. Both were wrong. The user's
      277x464 export of the layer matches the stretch (mean difference 1.61 of 255, against 53.88 for the crop). The
      file now follows the stretch. `ASSET_VERSION` is 22 for this re-upload (2 files).
    - All other portraits already follow Figma at the file's own ratio. Guillaume's file is 0.957, and Figma draws
      0.956.
    - `ASSET_VERSION` is 21 for this upload (10 files).
19ab. **Selected Work ends with a View All card, as Proven Results does (user).** The header keeps only the badge. The
    blue end card has the star mark and a white "View All Brochure" button to `/services`. Figma draws no such card.
    Without it, the three-card decks (Software, Crunch, IT Ops) did not pin at 1536x730, 1280x720 or 1920x1080: three
    cards scaled to fit the window height also fit the width. With it, Software travels 478px at 1280x720, 252px at
    1536x730 and about 600px at 1920x1080 (4 x 570 + 3 x 40 = 2400 against the 1792px column). All seven pages have the card.
19ac. **A four-person team takes a smaller name (user).** This closes the open item of 19z. At H2, "Dang Chuan NGUYEN"
    needs 307px, and at H4 it needs 217px. The plate gives 200px at 1280, 258px at 1536 and 325px at 1920. So the
    four cards take 18px/28px (weight 500) from xl, H4 from 2xl and H2 again from 3xl. All four names are on one line at
    1280, 1366, 1440, 1536 and 1920. The type scale has no 18px style, so this size is an exception. Three-person
    teams keep H2.

## 20 — The Work listing and the case studies (started 2026-10-09)

Spec and plan: `C:\Users\Admin\.claude\plans\figma-mcp-establish-implement-silly-cocoa.md` (the council verdict, the fit
table and the checkpoints). The ledger is `.superpowers/sdd/figma-mcp-establish-implement-silly-cocoa/progress.md`.
Every frame is 1440 only. No frame is drawn at 390 or 1920.

### Node map
- Listing `3353:3329` (hero `3770:4571`, filter bar `3353:3338`, cards 1-6 `3353:3341`, pagination `3426:3756`) and
  cards 7-12 `3403:3521`.
- IOGA case study `3770:4574` (the layer is named "Brochure Rizlum"): hero `3779:4995`, back link `3816:7991`, sidebar
  `3825:8852`, main column `3816:7969`, team `3816:8585` + `3816:8634`, "Discover Other Works" `3816:7868`, contact
  band `3816:8130`.

### Rulings (user, 2026-10-09, unless marked "build")
20a. **Only IOGA has a case study.** Only its listing card is a link. A new case study is one file in `content/work/`.
20b. **The filter bar works.** Category (the union of the card tags), Search (title and tags, no case, no accents) and
    six cards to a page. The state is in the URL (`?category=&q=&page=`). Typing replaces the history entry.
20c. **The IOGA team has six people** in a two-column grid in the main column.
20d. **"Discover Other Works" follows 19ab**: the three cards and a blue "View All Work" end card to `/work`. The header
    link is dropped.
20e. **The fact sidebar is sticky.** It stops at the end of the main column.
20f. Build: **routes** `/work` and `/work/:slug`. An unknown slug or a project without a case study goes to `/work`.
20g. **A card title row wraps per card.** The chips stay on the title line where they fit. At 1440 and wider every
    row is one line, as drawn. At 1280 only "Passerelles Numériques" wraps (it needs 671px of a 604px card).
20h. **The sidebar sits beside the column from xl** (amends 20e "from lg"). At 1024 its track is 267px, and "Corporates
    & SMEs" needs 230px of the 203px inside the padding. Below xl the facts are a grid above the column.
20i. **The type keeps the drawn sizes above 1440.** The boxes grow with the window (1.29x at a 1910 window).
20j. Build: **the case body uses shares.** From xl the tracks are `381fr 144fr 867fr` (24 + 381 + 144 + 867 + 24 =
    1440). From lg to xl the facts and the column keep the drawn 867px width, centred, so 1024-1279 shows the 1440
    column at its drawn size.
20k. Build: **Final Impact cards are as tall as their copy** (Figma draws no fixed height), three across from lg.
    The one-line label "Knowledge Consumed" needs 238px. A card is 273px at lg, 240px at 1280 and 229px at 768.
20l. Build: **the Tech Stack groups keep the drawn heights** (173 / 190 / 185px) as a minimum from lg.
20m. Build: **the case hero bake** is the 1440x840 part of Figma's 1443x960 box under the header (y 120-960), mirrored
    as drawn, with the drawn dark-left gradient baked in. The site header is solid, so the copy then sits 120px over
    the bottom edge and the back link 60px under the top edge, as drawn. The bake differs from the Figma render by a
    mean of 4.75/255.
20n. Build: **the query string does not scroll to the top.** `ScrollManager` skips a change of the query string only.

### Assets
- `assets-src/work-page/listing/` (12 cards at 700/1400, ECOEATS at 684, the hero at 800/1440/1920) and
  `assets-src/work-page/ioga/` (hero, challenge, three solution pictures, six portraits at 548/1096, two avatars, and
  `stack/` with 11 logos at 3x). Each file follows Figma's own crop and scale (19aa). The bake scripts are
  `bake-lib.cjs`, `bake-listing.cjs` and `bake-case.cjs` in the session scratchpad.
- "Discover Other Works" reuses the Crunch cards (`crunch.work`): the same files and crops.

### Slips shipped as drawn
- The back link says "Back to All Brochure" on a Work page. It goes to `/work`.
- The third team card has the "ThanhCong" photo with the plate "Cong Chau, ITs" (the IT Ops copy). The hidden "Tuan
  Ngo" plates in both team rows are not built.
- "Ads scraping / collection" is not a listing project, and its picture is the FV Hospital file (as on Crunch).
- The listing pagination draws five pages with page 2 current. The build shows two pages, with page 1 first.
- The IOGA hero chips ("SaaS", "E-Learning Platform") are not the listing chips ("Software Development", "Mobile App").
- Figma draws the header white on the listing and transparent on the case study. The build keeps the blue header.
- The 3403:3521 frame is #F7F7F7. The listing is white, as the main frame 3353:3329 draws it.
- The pagination numbers are #A0A0A0 on white (2.6:1).

### Placeholders and soft assets
- The empty filter state is not drawn: "No work matches your search." and "Clear filters" are placeholder copy.
- ECOEATS is live text in Figma, and `get_screenshot` gives 1x only, so its card is 684px wide. Phat Vo's portrait
  file is 400x400 and Figma stretches it into 427x479. The Rapide Tyres file is 512px wide. These look soft on
  high-density screens.

### Open for the design team — text contrast (UI/UX audit, 2026-10-09)
The build uses the drawn colours. These texts are below the WCAG AA contrast minimum. The design team must decide.
Do not change the colours without that decision.

| # | Text | Colours | Ratio | Minimum | Suggestion |
|---|---|---|---|---|---|
| 1 | Final Impact numbers ("100%", "40%", "50,000H+"), 36px | #FDA948 on #ECF4FF | 1.73:1 | 3:1 | #B45F00 (4.1:1) |
| 2 | Tech Stack headings ("1. Front-end" etc.), 24px | #FDA948 on white | 1.92:1 | 3:1 | #B45F00 (4.6:1) |
| 3 | Fact labels (Founded, Location, Industry, Market), 20px at 390, 24px from lg | #A0A0A0 on #F7F7F7 | 2.44:1 | 4.5:1 at 390 | #707070 (4.6:1) |
| 4 | Pagination numbers and the Search placeholder, 14-16px | #A0A0A0 on white | 2.6:1 | 4.5:1 | #707070 (4.9:1) |

Also open (site-wide, not Work): at 390 the footer legal links (Terms of Use, Privacy Policy, Cookie Settings) are
20px rows with no gap, below the 24px target minimum. A fix needs a 4px gap between the rows, which is a visual change.

### Accessibility fixes (build, 2026-10-09)
- ~~After Previous or Next turns off (first or last page), the focus goes to the current page button.~~ Superseded by 22d: every page change moves the focus to the top of the grid.
- After "Clear filters", the focus goes to the Search field (`#work-search`).
- A pagination button has an invisible 36x44 tap area. The drawn cell stays 30x30.
- The footer Company links have an invisible 30px-high tap area at 390. The text does not move.

### Verification
`.claude/probe-layout.js` (git-ignored dev tooling) loads a page in a same-origin iframe per width and reports leaf
overflow, clipped text, `data-fit` line counts, `data-aspect` drift, band fit and sticky health. Its `localAssets`
option serves files that are not uploaded yet. It ran clean at 375, 390, 768, 1023, 1024, 1279, 1280, 1440, 1535,
1536 and 1910 on both pages.

## 21 — Career hub, job pages and the apply form (started 2026-10-09)

Plan: `C:\Users\Admin\.claude\plans\figma-mcp-established-implement-soft-sparkle.md`. Spec with the per-width
derivation grid: `docs/superpowers/specs/2026-10-09-career-page-design.md`. Council review:
`docs/superpowers/council/`. Every frame is 1440 only. No page draws a 390 frame or a 1920 frame.

### Node map
- Hub `3297:2342` (1440x7691): hero `3310:2393`, Our Culture `3321:2570`, Job Openings `3325:2946`, Benefits
  `3387:3287`.
- Job page `3864:16770` (drawn for Senior PHP Developer): top row `3878:18802`, main column `3878:18827`, sidebar
  `3878:18908` (Overview `3878:18909`, Job Openings `3878:18931`).
- Apply form `3881:4477` (empty) and `3869:17497` (filled); success `3869:17432`.

### Rulings (user, 2026-10-09, unless marked "build")
21a. **Jobs are a TS file** (`content/careers/jobs.ts`). A new job is a commit and a deploy.
21b. **The CV is a real PDF upload**, emailed to jobs@ as an attachment (`api/apply.ts`), 4 MB at most. Figma says
    5 MB, which the 4.5 MB Vercel body limit does not allow.
21c. **No mobile artboards.** 390-1024 and 1910 come from the derivation grid in the spec.
21d. **Seed = the four drawn jobs.** Only Senior PHP has full copy; the other three are `placeholder: true`.
21e. **The job page sidebar lists the other open jobs**, not the drawn industry names.
21f. **"Save for later" is a drawn placeholder** with no behaviour (`aria-disabled`).
21g. **The role chip of the job is selected first** in the apply form. The visitor can change it.
21h. **The stacked benefit photos are static**: the top photo of each mask only.
21i. **Icons are Lucide** (the standing ruling holds over the drawn Iconly set).
21j. **The CV upload is a Career-only exception.** The contact survey stays links-only.
21k. **All four jobs ship on the preview; the merge is blocked** until HR replaces or removes the placeholders.
    `scripts/check-career-placeholders.mjs` warns on every `npm run build`.
21l. Build: **sections sit 120px apart** (top padding only; the last section adds the bottom padding).
21m. Build: **the hero is `CareerHero`, not a ServiceHero option.** Same rules as 18b (whole photo at its ratio; copy
    under the photo below lg), plus the drawn gradient over the lower 467/839 of the photo from lg.
21n. Build: **the culture band is 83.05% of the card, centred, 40px off the bottom, and hugs its text** from lg. Below
    lg it sits under the photo. Culture headline: Heading-H1 at lg, Display-sm from xl.
21o. Build: **job rows keep a 253px right column** and a fluid title column (Figma gap 442), so a row fits at 1024;
    rows stack below md.
21p. Build: **benefits are 3 columns from xl, 2 at md-lg, 1 below md.** At 1024 a 309px tile is too short for the
    text. A text tile's 447/367 ratio is a minimum, so at 320 it grows to fit. Below xl the wide photo is a single tile.
21q. Build: **the job page is 2 columns (849:463, 80 gap) from xl**; below, it stacks with Overview first, then the
    details, then the other openings. `grid-rows-[auto_1fr]` keeps the list card under the Overview.
21r. Build: **the apply form** is one 968px panel that scrolls inside on a short screen; no close cross (none drawn);
    square corners (none drawn); the error state (not drawn) is one line above the buttons.

### Assets (`assets-src/career/`, not uploaded yet)
- Fill modes measured against Figma renders, then baked at the box ratio: culture 1 top-anchored cover, culture 2
  full stretch, culture 3 offset crop; the job picture is Figma's stretch of an 842x1017 portrait into 461x398.
- Benefit tiles are rebuilt from the full-res sources by the mask geometry (diff 3-10 against Figma's 1x renders).
- Source limits: culture 1/2 top out at 1022/1024px, benefit-c at 447px, benefit-wide at 918px.
- The three placeholder jobs reuse the sidebar otter art (it / ecom / pr).

### Slips (flagged)
- "Summited!" ships as "Submitted!" (user may veto). "(06 jobs available)" over 3 rows: the count comes from the data.
- Culture card 2's band is 64px off the bottom (1 and 3: 40px); card 1's band is 200px for 216px of text.
- Benefit rows are 367/372/361px; all use 367. The row is ~1390 wide in a 1392 column.
- Benefit tiles are Be Vietnam Pro at 23.17/18.54px (a scaled component); the site fonts take their place.
- Sidebar titles are Inter; Lexend here. "Officier" ships as drawn. The Figma header/footer show the 20th logo.

### UX audit deviations (user-approved, 2026-10-09)
These differ from Figma on purpose. Do not set them back to the drawn values.
- 21s — Contrast. Small text that Figma draws in `#A0A0A0` (2.44-2.61:1) uses the token `gray-quiet` `#707070`
  (4.95:1 on white, 4.62:1 on `#F7F7F7`). This applies to the Overview term, the CV help text, "Choose File",
  "No file chosen", the input placeholders and the consent box edge. The grey half of the Our Culture headline uses
  `#8C8C8C` (3.36:1, large text). The sidebar tag is white on `#2D6DE0` (4.80:1), and the tag and the date are
  12px, not 11px and 10px.
- 21t — Apply form validation. Submit keeps the grey look while the form is not ready, but it is not `disabled`
  (it has `aria-disabled`). A click shows an error under each invalid field (`aria-describedby`, red border) and
  moves focus to the first invalid field. Figma draws no error state.
- 21u — Apply form drafts. The entries stay when the visitor closes the form and opens it again for the same job.
  A different job or a successful send gives a clean form (Layout keys the form on `apply.form`).
- Not changed: the red required `*` (`sec-500`, 4.32:1 at 14px) and the "Save for later" grey (disabled, ruling 21f).

### Verification
- `scripts/probe/career-probe.js`: `gate(section, widths)` per checkpoint (shell, hero, culture, openings, benefits,
  job, modal) at 320-1910, and `modalFlow(width)` for the form's behaviour. Probe at 1910, never 1920.
  `validateFlow(width)` and `draftFlow(width)` cover rulings 21t and 21u.
- `node scripts/probe/apply-harness.mjs`: 9 cases against `api/apply.ts` with a stub mail transport.
- Not yet verified: motion in a live browser (the pane runs 0 rAF), the apply form's exit fade, and a real send to
  jobs@ on a Vercel preview.

## 22 — Site-wide UI/UX E2E test (2026-10-09)

The full log is `.claude/uiux-e2e-2026-10-09/README.md` (git-ignored). The U-numbers refer to it. The code fixes
are in the log. This section records only the items that the drawn design causes. The build keeps the drawn
design until the design team decides.

### Open for the design team

| # | Item | Where | Measured | Suggestion |
|---|---|---|---|---|
| U-13 | The logo marquee and the service quote loops pause only on mouse hover. A keyboard user cannot pause them (WCAG 2.2.2). On touch, a tap latches `:hover` and pauses the loop. | Home client logos; Software, BI, D&D and Crunch quotes, from 1024 | 40 s infinite loop; no control | A small pause/play control on each loop |
| U-23 | The apply form fields are 14px. iOS Safari zooms in on a field below 16px. Not checked on a real iPhone. | `/career/*` apply form, below md | 7 fields at 14px | 16px below md (`text-[16px] md:text-body-md`) |
| U-24 | The hero headline is below the first screen. | Career hub at 1910x940 and 1536x730; About at 1280x720 (1536 and 1920 are in ruling 18b) | Career h1 at 821-1011px in a 940px screen | Cap the hero height from xl, or move the copy up. This changes rulings 21m and 18b. |
| U-25 | The survey "Next step" is disabled and gives no reason. | Contact survey, both steps | No message; white on #D9D9D9 | Keep the button active; on click, show which answer is missing |
| U-26 | The grey clause in the Our Journey intro is below the large-text minimum. | About, "shared vision turned into a global journey." | #A0A0A0 on #F7F7F7, 2.44:1, min 3:1 | #8A8A8A (3:1) or #707070 (4.6:1) |
| U-27 | Legal text lines are too long at 1920. Figma draws only 1440 for these pages. | `/terms-of-use`, `/privacy-policy` | 115-118 characters a line (good: 45-90) | Cap the text column at about 760px |
| U-30 | Mobile tap targets below 44px. | Header icons 32x32, footer social 29x29, splash X 36x36, apply chips 36px | Pass the 24px minimum | Invisible hit areas (code) or larger drawn targets |
| U-42 | Body copy is 12px on phones. | About paragraphs, Services lists, Contact, footer at 390 | 12px | 14px at 390 |
| U-43 | Pictures that are soft on 2x screens and are not on the earlier source-limit lists. | Home C.M.P and FunPass; Work hero; Career `hero-1643`, `culture-3-1392`; Services hub hero, `stationf-973`, AI and People heroes; About `offy-friday-1672` | 0.78-1.42 file px per CSS px at DPR 2 (target 1.5) | Originals at about 2x the displayed size |
| U-37 | The menu shows no current page. The code now sets `aria-current="page"` (NavLink); a visible state needs a design. | Menu overlay on every route | No visual difference | A drawn current state, e.g. the primary colour or an underline |
| U-46 | Apply form copy: the phone placeholder "+84" looks like a typed value; the school placeholder is cut at "Paris" at 375; the panel header and the first group repeat one sentence. The lone "*" is fixed in code (no-break space). | `/career/*` apply form at 375 | — | "e.g. +84 912 345 678"; a shorter school example; one of the two sentences |
| U-48 | The DIY Jam story page has no closing link. Figma 3830:8872 draws none. | `/about-us/diy-jam` | `main` has no link or button | "Back to About Us" or "Join our team" |
| U-49 | "Join our team" pulses with no end (deliberate in the code). | About, Our Team | Scale 1.00-1.02, 3 s loop | Stop after 2-3 cycles, or play once on view |
| U-50 | The D&D hero subtitle sits on a busy part of the photo, with no scrim. Check Figma 3494:4864 first. | `/services/design-digital` at 1440 | Visual judgement | A left gradient scrim from lg |

### Open for the content owners

| # | Item | Where | Suggestion |
|---|---|---|---|
| U-21 | Home, About, the Services hub, Career and the job pages keep the home meta description. The code takes a description per route. | `usePageView(title, description)` | One sentence for each page |
| U-28 | Three job pages show HR placeholder copy (rulings 21d, 21k). No placeholder job may ship to `main`. | `content/careers/jobs.ts` | HR replaces or removes the three jobs |
| U-44 | "Cassim's Brother" shows Data Scraping / Qualification on `/work` and Dashboard / WordPress on the IOGA "Discover Other Works" card. | `content/work/index.ts`, `content/services/data-engineering-processing.ts` | One pair in both places |
| U-45 | The Work Category list has 17 entries for 12 projects, with overlaps ("Branding" / "Logo & Branding"; "Development" / "Software Development" / "Application"). The "all" option reads "Category". | `/work` filter | A shorter list; "All categories" |
| U-47 | Job excerpts end in a cut word and four dots ("iter...."); one has "insights. automating". "About us" says "For over 15 years" against "since 2006". | `content/careers/jobs.ts` | Full excerpts; the correct year count |

### Rulings (user, 2026-10-09, from the E2E test)
22a. **The splash screen is removed** (U-9, U-11). Do not restore it. A new splash needs a new localStorage key.
22b. **Legal sections land directly under the header** (U-19). The 120px scroll margin is gone; the clicked contents row keeps its highlight.
22c. **The Work pages are indexed** (U-22): `/work` and `/work/ioga` are in `sitemap.xml` with `index, follow`.
22d. **A Work page change moves the focus to the top of the grid** (U-17). This replaces the aba51b1 rule ("focus goes to the current page button").
22e. **The Category select replaces the history entry**, as the search does (U-39). This extends ruling 20b.
22f. **Social cards per route are deferred** (U-51). A scraper sees the home head on every route until a prerender step or Edge Middleware exists.

## 23 — Design-team feedback round (2026-10-12)

Source: the "Feedback Bug Tracker" sheet in `Officience website_2026_Plan.xlsx` (rows 12, 13, 15, 21, 24-27) and a chat
note. The team tested before the 2026-10-09 fixes. Rows 12 and 21 wait for a re-test on the latest preview.

### Figma changed after the build
- **Logo band (row 26).** Frame 3137:2138 is now 240px tall around a 120px row (it was 312 / 140.5). The 390 frame
  3153:8647 did not change (160 / 58.2). `LogoMarquee.tsx`: `lg:h-[240px]`, `--logo-scale` 0.8541 (120 / 140.499).
- **Survey chips (row 15).** The step frames 2809:2846, 2809:2247, 3333:2525 and 2809:2567 draw a selected chip with a
  pale blue fill (#ECF4FF), a blue border and a bold blue label, like the option cards. The earlier white fill came
  from the Form Input Chip instance 3329:2505. The frames win.

### Rulings (user, 2026-10-12)
23a. **Testimonial cards fill the column** (row 25): 847px at 1920, as frame 3151:2378 draws. This replaces the 545px
     cap from frame 3129:3363. The design team's screenshot is the 1920 frame.
23b. **Testimonial slide-in starts from staggered offsets** (row 13): 230 / 540 / 840px, read from the team's sketch.
     Card 3 starts past the screen edge; the section's `overflow-x-clip` hides it. No rule behind the cards.
23c. **Services titles are one 36px line from lg** (row 27, the build's recommended option). The goal is all four
     titles on one screen. PEEK is 138 (64 padding + 44 title + 30 gap). The offering list is 16px on a 22px line,
     4px apart, so the band ends at the bottom of the third line. The promise is Subtitle-1, 30px under the title,
     and the rail gap is 40px. All are divergences from frame 3137:1931. Measured: at the landing point the four
     titles sit at 64 / 202 / 340 / 478 at 1024x768, 1280x720, 1440x900 and 1920x1080.
     Known limit: the last row has only the 28px runway (the 200px seam ruling), so the four-title state holds for
     about 60px of scroll before row 4 slides over row 3. A longer hold needs more runway, which widens the seam.
23d. **Rizlum footer logo at Figma's 73x15.2** (row 24). This reverses the 105x21.9 of item 20.
23e. **Survey body scrollbar** (row 15). `.survey-scroll` in index.html: the menu bar's shape (10px, rounded), blue
     thumb #3C8DFB on a #E6E6E6 track. Figma has no survey scrollbar node; the colours are a build choice.
23f. **Proven Results image zoom on hover** (row 12): 1.06 over 700ms, clipped by an image box. Off under reduced
     motion. The arrival keeps its "no zoom" rule.
23g. **Our Approach holds longer after the third card** (chat note). The steps keep their scroll lengths; the hold
     is 63vh (was 18vh). The runway is 235vh (was 190vh). Knob: `HOLD_VH` in `HowWeEngage.tsx`.

### Waiting for the design or content team
- Hero CTA wording (header and hero both say "Contact Us"), the logo-section colour change and showcase animation,
  the "20 years" KPI, and country flags on the offices. None is in Figma.
- Two slips in survey frame 2809:2567: "Transmission competed!" and "bussiness days". The build keeps its corrected text.

## 24 — Figma drift round (2026-10-12 check, 2026-10-13 fixes)

Source: the drift check in `.claude/drift-2026-10-12/` (README.md and seven reports) and the fix notes
`fix-{hero,nav,survey,legal,home}.md` there. Each fix note holds the full change table and the measured values.
User decisions of 2026-10-13: stick with Figma; the new hero banner; "Submit" in the survey; the legal .docx
is the source of truth for content; the 751px Proven Results cap stays; the Figma side margins; the survey
frames are final; the 1440 frames scale in **steps**, not fluid.

### Scale model
24a. **The `fhd` screen (1880px) is the large-desktop step.** A maximised 1920 browser reports about 1910px, so
     `3xl` (1920) never fires there. The 1440 values hold from lg (or the step the section names) up to below
     fhd. From fhd: the 1920 frame values where a 1920 frame exists, else the 1440 values x1.333 in fixed px.
     2560 keeps the fhd values. Type stays fixed px per step: no vw, no clamp. Do not put a desktop-critical
     value behind `3xl:` alone.
24b. **The survey does not step.** Its frames are 968px modal frames, not a 1440 page. They hold from 1000px up.

### Hero
24c. **Home hero = frame `3928:4916`** (user-confirmed 2026-10-13). The banner `3938:5217` fills the band. The
     copy sits top-left at x 24, y 192 at 1440. The hero CTA `3928:4887` is removed (the header CTA is the
     only "Contact Us"). The five 3D shapes are removed. **This replaces the 2026-08-27 headline-block ruling.**
24d. The band is `aspect-[1440/750]` from md, full width up to 2560, no crop. Copy steps: md / lg / xl / 1400
     (the 1440 frame) / fhd (x1.333). The table is in `fix-hero.md`. The 1400 step keeps 24px or more between
     the copy and the otter. The pull-up under the header is 60 / 80 / 100 at md / lg / xl, and `--header-h`
     from 1400. The copy stays in `Container`, so it is on the page column (x 64 at 1920, x 384 at 2560).
24e. Below md (no Figma frame, build choice): the copy on the blue band, then a pre-cropped 4:3 file of the
     otter group with a 12% top fade. Ask the design team for a 390 frame.
24f. Banner files `/hero/banner-{960,1440,1728}.webp` and `/hero/banner-mobile-{780,960}.webp` (staging bucket,
     uploaded and byte-checked 2026-10-13, new keys, no `ASSET_VERSION` bump). The Figma source is only
     1747x900, so the banner is soft at DPR 2 and at 2560. Ask the design team for the 2880px+ original.

### Header and menu
24g. **Header gutter 24px** at every desktop width (16 below lg), full bleed, no 1792 cap (D6). The bar does not
     use `Container`.
24h. The glass hairline is an inset box-shadow, so the bar is 69 / 113 / 119 in both states. The icons fill their
     drawn boxes (32 / 48 / 56). The 390 mail button is a bare 20px glyph with an invisible 44px tap area.
24i. The 1920 header applies from fhd. `--header-h` and `scroll-padding-top` step at fhd too. Keep the three in step.
24j. **Transparent header on `/`** at the page top, from 1400 (the banner frame draws the header on it). Below
     1400 it stays solid, because the hero pull-up is less than the bar height there. Other routes stay solid.
     The glass state after 69px does not change. The 1400 width belongs to the hero pull-up (24d).
24k. Menu overlay = `3275:2328` in fixed px from lg, x1.333 from fhd. Dim layer 60%, tracking -3%, nav top 80,
     2 x 1fr service columns with a 30px gap, close X 28px ink. `RollText` is `align-top`, because the baseline
     adds the descender to the line. The collapsed Services default (`f7864bf`) stays.
24l. **Scrollbars:** the `scrollbar-*` properties apply only inside `@supports not selector(::-webkit-scrollbar)`,
     because in Chrome 121+ they switch off the `::-webkit-scrollbar` rules. `.menu-scroll` takes its colours
     from `--sb-track` / `--sb-thumb`. The overlay sets the Figma 40% pair; other surfaces keep the opaque 10px bar.

### Survey (frames final, D7)
24m. The survey follows `2822:6528`: square modal, 5-layer shadow, 760 progress bar, H4 titles, H3 questions,
     36px chips and inputs, a 24px consent box (still a real checkbox), 168x56 buttons. Below 968 the bar scales
     in %. Below sm the build uses its own compact step (table in `fix-survey.md`).
24n. The last button says "Submit". The category complete step has its own copy: "Category inquiries: <flow>",
     "Submitted!", "We will reach out within 5 days." The Full-time career title is the build's own (no frame).
     The category name field is "Name" / "Full name".
24o. FIGMA-SLIPs: "Summited!" (built "Submitted!"); the 2px gap that clips the 60px option card (built without it).

### Legal (content = .docx, styling = Figma)
24p. Privacy keeps its 9 sections and the .docx wording. One date per page, in the hero ("1 June 2026" for
     Privacy; "June 2026" for Terms, because the Terms .docx has no date).
24q. The Privacy intro is a full-width lead block: 24/36 `#5A5A5A` from lg, at Figma's x 51 (a FIGMA-SLIP that
     aligns with nothing, reproduced). Body `#0F1219`, sub-headings Montserrat Bold 16/26, 26px paragraph gaps,
     120px body top gap, 784 column (1045 from fhd), rule `#C6C6C6`, hero copy at x 42.
24r. One list style: disc, 24px indent, plain term (Figma's majority style). Inline links stay underlined (WCAG 1.4.1).
24s. From fhd the legal page uses its own 1856 column (1392 x1.333), because the scaled layout does not fit 1792.
     The 1024 contents card stays 448 (a 387px text column).

### Homepage
24t. The Services offerings follow Figma. Software adds "Testing & QA" and writes "E-commerce" / "Enterprise auto"
     (the text node holds "Enterprise auto" in full; the content team must confirm it). Data Engineering is
     "Data entry / Data collect / Data process / Business support". Ruling 23c still holds (titles at
     64/202/340/478). The Services hub (`HubServices.tsx`) uses the same two lists (user, 2026-10-13), so those
     two hub rows do not follow the hub frame 3109:1869.
24u. About card 1 desktop crop = the crop of `3137:1917`, baked from the 3480x1957 original: window (494,707)
     2443x1098, resized to the 1792/860 box with Figma's 0.936 horizontal squeeze. Files
     `/about/card-1-lg-{1144,2288}.webp` (staging, uploaded and byte-checked 2026-10-13, new keys). Mean pixel
     difference against the Figma render of the node: 2.69/255. This replaces the tuned `object-position` of
     ruling 18. `card-1-900` / `card-1-1800` are no longer used.
24v. Proven Results: gutter 24 from lg, 40 from fhd (D6); gap 48 below fhd, 40 from fhd; radius 8 (both state
     frames); caption 48/14. The pinned scale turns on the gutter. **The 751 cap is replaced by 25a.**
24w. Client Review: the header column hugs the 632px heading (cards at x 842 at 1920), cards 200 tall. The curly
     apostrophe stays (Figma's straight one is a slip).
24x. Logo band at rest (reduced motion): hard clip, no edge fade, starts on the content column.
24y. Contact: "1-chome" never splits; option rows 104, panel 458; the Contact gutter steps at fhd.
24z. **Footer master = the 1440 frame `4028:6376`** (user, 2026-10-13): 1440 values from lg, x4/3 from fhd. The
     1920 footer frame `3151:2509` is retired. The rule and separators are solid white. OpenReal is 80 x 19.1.
24aa. The outline "View Brochure" buttons have no rest fill (the Figma instance). The variant's grey hover is the
     same grey as the section, so the hover is `pri-50` #ECF4FF (user, 2026-10-13). The pressed fill does not change.
24ac. **Rizlum footer logo at 0.92 of Figma's box: 67.16 x 13.98** (user, 2026-10-13). One scale applies to all
     five logos, but Figma's 73x15.2 drew the Rizlum letters about 10% larger than the others. Measured from the
     source files at 1440: cap R 12.62 against OpenReal's 11.53, x-height 9.6 against 9.06. At 0.92: cap 11.61,
     x-height 8.8. This replaces the size in 23d.
24ab. Stale note: step 7 "Shadow-sm rendered via shadow-fig-sm" is wrong since `c0c2e30` (no card shadows).

### Open after this round
- "Enterprise auto" (content team); a 390 hero frame and the 2880px banner original; the survey progress labels
  wrap on phones. The service pages for Software and Data Engineering were not checked against the new lists.
- With motion on, a legal contents click scrolls down, the header hides, and a blank band shows above the
  section. This is the hide-on-scroll ruling, not a new bug.

## 25 — Proven Results: exactly three cards (2026-10-14)

The design team asked for the exact layout of frame `3137:2069`: three equal cards that fill the content column
(3 x 586.67 + 2 x 40 = 1840 at 1920). The build showed 3.3 to 5 cards on common laptops, because the 2026-09-18
ruling sized the cards by height. The user chose option 1 of two (the other was a static row with no pin).

25a. **The cards are sized by width from lg.** `--card-w = (min(100vw, 1920px) - 2 gutters - 2 gaps) / 3`, and
     `--card-h` follows the frame aspect 586.67:800. Exactly three cards fill the column at every desktop width;
     above 1920 the cards stay 586.67 x 800. This **replaces the 2026-09-18 "fit wins" ruling and the 751 cap**
     (also D5 of 2026-10-13).
25b. **Only the card row pins.** The heading is outside the pinned column and scrolls away, so the row has the full
     window height. While pinned, the heading margin is `100px - (100vh - card) / 2`, so the gap is 100px when the
     pin starts. During the sideways scrub the heading is above the screen (the design team was told).
25c. **The fit check leaves the header out** (`usePinnedTrack({ ignoreHeader: true })`), because the bar hides on a
     scroll down. With a header budget, short windows shrank the row by 3-6% and a sliver of the fourth card showed.
     Trade: while the page scrolls back up through the pin, the bar returns and can cover the top ~15px of the row on
     a 1280x600 window. Our Journey and Selected Work keep the default budget (no change for them).
25d. **The caption keeps its height, the image gives way.** From md the card is a flex column: the caption takes its
     own height (at least 250/800 of the card from lg) and the image takes the rest. At 1920 the split is Figma's
     550 / 250. Below fhd the chip and title type steps down with the card: chips 12/16 (lg), 14/20 (xl), 16/24
     (fhd); title 28/36, 40/48, 50/58. The View All card steps its star (56/72/100) and blurb (14/22, 18/28,
     Subtitle-1) the same way.
25e. Measured at the pin start with motion on (1920x1080, 1910x940, 1536x730, 1440x790, 1366x650, 1280x600,
     1024x680): three full cards from the heading edge to the column edge, the fourth card off screen, gap 100.
     Static (reduced motion) the same at 1024-2560. No caption overflow at 375-2560 (768 clipped the title before).

## 26 — Services seam and office flags (2026-10-14)

26a. **Services → Our Approach seam = Figma's 100 + 100 = 200px**, from the last service row to the "How We Work"
     badge, with motion on and off (user sent the annotated 1920 frame). With motion on, the pinned Approach column
     was centred in a window-high frame, so the seam grew with the window: 300px at 1920x1080. The pinned column is
     now top-aligned, and 48px of section padding sits outside the pin (28 runway + 100 + 48 + 24 = 200). Measured
     200 at 1440x900 to 2560x1400; 188 at 1280x600 and 1024x680, where the column scales to fit. While pinned, the
     Approach column now sits at the top of the screen, so a tall window shows space under the steps. This
     replaces the 2026-09-18 note "200px to the heading" (it measured 248-348 in practice).
26b. **Country flags on the office list** (user, 2026-10-14; not in Figma). A 24x16 inline-SVG flag (`ui/Flags.tsx`,
     3:2, 2px corners, hairline ring) replaces the red location pin before the country name, centred on the name
     line. Inline SVG, because Windows shows flag emoji as letters. The detail is reduced for 24px (a dot grid for
     the US stars, simplified Singapore stars). The address underline on hover stays the Google Maps cue.

## 27 — Homepage re-layout to frame `4229:4651` (2026-10-15)

Source: the 1440 frame `4229:4651` ("OFFY NEW_1440 — optimized", 1440x8063) and the testimonial row `4366:9639`.
There is no 390 or 1920 frame. `get_design_context` on the whole frame works (145k chars); the components
"Section Header" `4247:5073`, "Eyebrow Tag" `4247:5020` and "Buttons" `4346:13744` carry usage notes.

### Node map (1440)
Hero `4285:7872` (760 tall, pt 113, 3D shapes `4285:7878`) · Who we are `4229:4669` (team photo `4291:12606`) ·
What we do `4317:13574` (grid `4317:13576`) · Success Stories `4382:7136` (cards `4382:7139/7151/7164`) ·
Logo slide `4382:7176` · How we work `4229:4871` · People Trust Us `4366:9639` · Why Us + Contact `4229:4962` ·
Footer under `4229:5076`. The sections stack with a 120px gap.

### Rulings (user, 2026-10-15)
27a. **Hero = the new frame.** The five 3D shapes return, and "Let's start!" opens the survey. This replaces 24c-24f
     (the otter banner). The header CTA stays.
27b. **Scale in steps (24a holds).** The 1440 values from xl/1400, x1.333 at fhd, x1.778 at 2560. Below that, an lg
     step, and a stacked tablet/mobile layout with the same proportions. All values are fixed px per step.
27c. **What we do = the new card text.** The four cards use the names, blurbs and lists that the frame draws. This
     replaces 24t and 23c for the home page. The Services hub keeps its own lists.
27d. **"Check Our FAQ" is hidden** until a FAQ page exists (content team). "Meet our Team" links to `/about-us#our-team`.
27e. **Kept motion:** the How we work pin, the logo marquee (Figma draws a static row), and the section reveals.
     The flower band under the hero goes (the frame has none).
27f. **Success Stories keeps the pinned sideways scrub** with the new 640px cards. This replaces the "exactly three
     cards" sizing of 25a. The cards: IOGA, C.M.P, LAB, then the View All end card. The date/author line
     ("23 Nov 2026 | Tram Anh" on all three) is hidden: it reads as placeholder text.
27g. **People Trust Us = a continuous downward loop** of the three cards, in a window about 1.6 cards tall with a
     soft fade at the top and bottom. It pauses on hover and on focus. Reduced motion shows a static stack.

### Slips reproduced as drawn (flag to the design team)
- The IOGA and C.M.P story images are **stretched** (Figma FILL mode on a box with another aspect): 1.23x and
  1.42x wider than the source. Measured: the stretched crop differs from the render by 7.6/255, a cover crop by
  34/255. The files in `assets-src/home/stories/` bake the drawn crop. Ask for originals at the box aspect.
- The story sources are small (600, 1024, 1024 px wide), so the 2x files are upscaled.
- "Engineer & drive worflows" (Data Processing blurb) — the build writes "workflows".

### Assets (`assets-src/home/`, new keys, uploaded to staging and byte-checked 2026-10-15)
`team-{768,1440,2160,2880}.webp`: the 1440x595 window (237,576 3667x1515) of the 4096x2731 original; diff
3.91/255 against the node render. `stories/{ioga,cmp,lab}-{640,1280}.webp`: the 640x360 box crops. The blue tint
is CSS (`#1F49BF`, `mix-blend-mode: color`), as the frame draws it.

### Build notes (2026-10-15, measured)
- **Hero shapes:** the old `assets-src/hero/*.webp` files are not turned. The build bakes the frame's crop, flip and
  turn from the 1080px sources into `assets-src/home/shapes/*.webp` (diff 0.4-2.4/255 against the render).
  FIGMA-SLIP: the leaf is stretched 1.13x vertically (FILL in a 140x158 box); the file keeps it. The ellipse
  goes past the frame edge and is clipped, as drawn. The hero moves up by the full `--header-h` at all widths.
- **What we do:** the card titles also link to the service pages (a hover underline that the frame does not draw).
  The outline button keeps the frame's white rest fill; hover `pri-50` (24aa).
- **How we work:** the pinned frame is the column height, not the window height, so the release leaves no empty
  band. FIGMA-SLIP: the three steps need 1350px in a 1344px row; the build shrinks each stack to 365px.
- **Success Stories:** the pinned row is centred in the window, so during the scrub empty space shows above and
  below it (176px each at 1440x900). Only IOGA has a case page; C.M.P and LAB have no link (20a). FIGMA-SLIPs:
  "Les Artisants Bâtisseur" (likely "Les Artisans Bâtisseurs"), "E - commerce".
- **Logo row:** the marquee now stops whenever `useMotionEnabled()` is false (also `?motion=off`).
- **People Trust Us loop:** window 480×u (340 phone, 380 md), card gap 24×u, `SECONDS_PER_CARD = 5`, CSS
  `marquee-y` in reverse, 15% mask fade, pauses on hover, focus and off screen. The window is a focusable region.
- **Why Us:** FIGMA-SLIPs: the crosshair is at x 531 of 1120 (29px left of centre at 1440); "strive" (likely
  "thrive"). Below lg the diagram is a 2x2 grid.
- **Contact** is shared: `/services` and `/work/:slug` now show the same card on the blue band.
- **Not changed, flagged:** `Header.tsx` "Contact Us" is wider than the frame and the frame draws a hairline under the
  header. The footer and header keep the 1792 cap, so at 2560 the home column (2475) is wider than they are.
- **Upload:** 15 new keys under `home/` (`team-*`, `stories/*`, `shapes/*`). A scoped script uploaded them to
  `redesignsept2026` on 2026-10-15. All 15 are byte-identical through a fresh `?cb=`. No `ASSET_VERSION` bump.

### Rulings after the E2E test (user, 2026-10-15; log `.claude/uiux-e2e-2026-10-15/`)
27h. **12px text floor.** On the step scale, frame text of 16px or less never goes below 12px, and the 16px body
     never goes below 14px: `max(<floor>, calc(N*var(--u)))`. Line heights keep the frame ratio at the floor
     (12/20, 14/20 -> 12/17, 16/26 -> 14/23). Headlines, layout and larger text keep the plain step. The pinned
     "How we work" fit does not keep space for the header, because the header hides on the forward scroll
     (as 25c does for Success Stories). This changes 27b for small text only.
27i. **The "Our Contact" eyebrow is 16/26 Medium** (the frame's Eyebrow Tag 4247:5020), on every page that shows the
     Contact card (`/`, `/services`, `/work/:slug`). This replaces 19k for the Contact card.
27j. U-1 hotfix pushed as `12c2376`: "Let's start!" calls `onOpenSurvey()` with no argument.

### Open for the design team and the content owners (E2E 2026-10-15)
- **U-10 contrast:** the grey part of the "Who we are" statement is `#A0A0A0` on `#F7F7F7`, 2.44:1 (large text needs
  3:1). The same pair as U-26 on About. A darker grey of `#8A8A8A` or less passes.
- **U-28 contrast:** the inactive carousel dots (below lg) are 1.3:1 against the background.
- **U-23:** at 1024-1279 the header CTA (224x56) is about twice the hero CTA (111x40), because the header has its own
  steps and does not follow `--u`. Ask whether the header must scale with the home page.
- **U-20:** on phones the team photo is a 155px strip (the 1440:595 aspect at 390). Ask for a phone crop (for
  example 4:3) if the team wants a taller picture.
- **U-14 asset:** the Mailjet logo file is light grey (luminance 158/255); the frame logo is near black (37).
- **U-16 / U-17 assets:** the testimonial portraits (112px files) and the footer logo are soft from fhd. Ask for
  larger originals.
- The slips of section 27 (stretched story images and leaf, "worflows", "Les Artisants Bâtisseur", "E - commerce",
  "strive", the crosshair 29px off centre) and the FAQ page for "Check Our FAQ".

### Build choices from the E2E fixes (2026-10-15)
- **Tablet hero (md, U-21):** the band is a row: the copy at the left, the shapes box 39% wide at the right,
  vertically centred, 24px apart. Band 621 at 768-834, 563 at 1000-1023, 573 at 1024. The 1023 -> 1024 step is +10px.
- **Contact eyebrow:** `SectionBadge size="step"` gives 16/26 Medium on the `--u` step with the 27h floor (27i).
- **Phone testimonial loop (U-18):** window 360, fade 10% below md, so one full card shows between the fades.
- **Footer below 360 (U-6):** Company stacks above Our friends; 375+ does not change.
- **Open, needs files:** U-26 — the footer banner (`footer/banner.png`, 2880x346, no srcset) is 2.68x its size at
  390; it needs 1080 and 1440 wide files. `team-2880.webp` saves about 213 KB only with a lower-quality re-encode,
  which overwrites a served key (bump `ASSET_VERSION`).
- **Service cards (U-7):** no grid height. Each card is `aspect-[688/428]` from lg as a minimum height, and the two
  cards in a row are equal. At 1024-1140 the 27h floor makes the content taller than the aspect (1.399 at 1024).
- **Service buttons (U-22):** aligned to the card bottom below lg only; from lg the frame's own gaps hold (29/53/29/29).
- **"How we work" `pinTop` (27h):** the pinned column top is `min(header-h × header-shown, 100vh − frame)`, so on a
  scroll up the returning header covers the heading, not the steps. User decision still open.
- **On-dark secondary button (U-24):** hover `pri-50`, pressed `pri-100`, label #1F49BF; also on the services pages'
  Selected Work.

### 27k — One pin rule for a scroll up (user, 2026-10-15)
27k. **Both home pins use a top-aligned frame that is the height of its column, with `pinTop`.** The sticky top is
     `min(header-h × header-shown, 100vh − frame)`. On a scroll up the returning header may cover the section
     heading, but it never pushes the cards or steps below the window or over the next section.
     - How we work: no change (`pinTop` of 27h). Measured on a scroll up: the heading is covered 44-81 px at
       1280x600-2560x1400 where the column fills the window, 0 at 1024x680, 1440x900, 1920x1200; no step text is
       under the header or below the window at any of 9 sizes.
     - Success Stories: `usePinnedTrack({ fitFrame: true })` (new opt-in option in `lib/pinnedTrack.ts`: the frame
       is the column, the wrapper is `frame + runway`, the progress ends at `end <frame>px`, and `useTrackDrag`
       uses `height − frame`). The `frameSpare` margins are gone. About and Work do not use the option.
     - Measured (wheel down and up, 1024x680 to 2560x1400, 9 sizes): the row never goes under the header, never
       below the window (0.1 px rounding at 1280x600), and the smallest row-to-logo gap on the scroll up equals the
       24×u gap (16.7 / 21.2 / 24 / 31.5 / 42.4) — before it overlapped the logos by up to 17 px at 1024. The flow
       gap from the heading to the row at the pin start is exactly 64×u (45.5 / 56.9 / 64 / 85.3 / 113.7). The pin
       reaches the View All card at all 9 sizes. U-2 keyboard focus: 0 failures (Tab and Shift+Tab, 1024x680-1920x1080);
       Selected Work on `/work/ioga` and `/services/design-digital`: 0 failures.
     - The cost: during the sideways scrub the row sits at the top of the window, not in the centre.
     - Re-run 2026-10-16 (one browser per width): page width = viewport at every scroll step and no visible
       element below opacity 0.5, at 320-2560, both reduced-motion states. tsc 0 errors, build OK.

### 27l — The pinned row keeps its gap; How we work fills its row (user, 2026-10-16)
The user reported two faults on the preview: the pinned Success Stories row stuck to the top edge of the screen,
and "How we work" leaned left and was scaled down.
27l. **Only the row pins, with the frame's gap above it.** The heading scrolls away in both sections.
     - Success Stories: from lg the 64×u gap is the pinned column's top padding (not the heading's margin), so the
       pinned frame is the gap plus the row. Below lg the 32/48 margins do not change.
     - How we work: the header is out of the pinned frame. The frame is the 80×u gap plus the step row (644×u).
       The section's 24×u bottom padding is outside the pin. Scale-to-fit stays as the fallback for very short windows.
     - The steps share the row equally from lg (the frame's row fills its width). Before, a fixed 368×u stack left
       up to 454px empty at the right (1879), and the pin scaled the whole block to 0.905 at 1522x704.
     - Measured (wheel down and up, 12 sizes from 1024x680 to 2560x1400, incl. 1522x704 and 1879x1000): the pinned
       row stops exactly 64×u / 80×u below the top of the screen; How we work has no scale at any size; the steps
       sit 48×u from both column edges at 1024-2560 (rules 48/517/986 at 1440; the frame has 48/519/990); the
       Success Stories row stays the 24×u gap from the logos on a scroll up; no step or card goes under the header
       or below the window. The overflow and opacity probe, keyboard focus, tsc and the build pass.

### 27m — Figma text and card update (user, 2026-10-16)
The design team updated frame 4229:4651. New nodes: About Intro `4229:4673`, Our Work grid `4459:5903` (replaces
`4317:13576`), Client Spotlights header `4428:5587` and track `4428:5588` (Success Stories `4382:7136` is gone),
Our Approach header `4249:5079`, People Trust Us subtitle `4366:9646`, Why Choose Us header `4426:5701`, Contact
card `4229:5008`.
27m. **Section names and texts follow the frame.** The section ids and heading ids do not change (analytics keys).
     - "Who we are" is "About Us". The button is "Discover our company" and opens `/about-us`. The statement has the
       scroll sweep again (`MOTION.manifesto`, the `.manifesto-char` ramp of c99efbc): each character goes from 0.2
       to full opacity, and back on a scroll up. With motion off, the statement shows the two tones of the frame.
     - "What we do" is "Our Work": subtitle "We build AI-first solutions tailored to you." (right-aligned from lg,
       `SectionHeader copyAlign="right"`), CTA "Discover our services". The new grid: 688x462 cards, 48 padding on all
       sides, a 440 text column, gaps 12/20/32, lists Montserrat Medium 16/26 with disc bullets, "Data / Processing"
       on two lines from lg. The button sits at the card bottom (`mt-auto`), so all four buttons are level (Figma
       pins the Data Processing button with space-between). Lists: BI ends with "Machine Learning"; Data Processing
       starts with "Data entry / collection / cleaning". The Software shape is now green `#22B573`.
     - "Success Stories" is "Client Spotlights": 5 cards (IOGA, C.M.P, LAB, FunPass, Finpivot), then the View All
       card (27f holds, user 2026-10-16). FunPass and Finpivot use the Work listing files on R2 in the frame's
       684x398 box (inset -5.28% / -3.44%), so no upload. The tag gap is 8 on all cards. The per-card date line has
       the Figma text but stays hidden (user 2026-10-16).
     - "How we work" is "Our Approach". "Check Our FAQ" stays hidden (27d, confirmed by the user 2026-10-16).
     - People Trust Us: the new subtitle (curly ’; FIGMA-SLIP: the frame writes a straight apostrophe).
     - Why Choose Us: the new CTA "Meet our teams" (on-blue primary, white) opens `/about-us#our-team`.
     - Contact: the "Our Contact" eyebrow is gone on the home page only (`showEyebrow={false}`); 27i holds elsewhere.
     - Build note: from 1400 to 1879 (`--u` = 1) the Our Work card grows with the width, and the extra height goes
       above the button.
