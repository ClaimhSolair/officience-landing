# Career page — design spec (2026-10-09)

Figma: hub 3297:2342, job page 3864:16770, apply modal 3881:4477 (empty) and 3869:17497 (filled), success 3869:17432. All are 1440 artboards. Mobile and tablet are derived.

The plan of record is `C:\Users\Admin\.claude\plans\figma-mcp-established-implement-soft-sparkle.md`. The LLM council review of that plan is in `docs/superpowers/council/`. This file adds the per-width derivation grid that the plan's CP0 asks for.

## Rulings

User rulings 21a-21k are listed in the plan and are copied to `.claude/figma-adapter.md` section 21.

## Derivation grid

Legend: **S** = scales with the content box (aspect or % of the parent). **F** = fixed px. **L** = layout change. The content width is 358 at 390, 736 at 768, 976 at 1024, 1232 at 1280, 1392 at 1440 and 1792 at 1910 (the `xl` values apply at 1910, because `3xl` does not fire).

| Section | 390 | 768 | 1024 | 1280 | 1440 | 1910 |
|---|---|---|---|---|---|---|
| Hero photo | S: whole photo at 1440/839 (ruling 18b, as ServiceHero) | S | S | S | S | S |
| Hero copy | L: under the photo on the dark ground; h1 `text-h1`, subtitle `body-xl` | L: same | on the photo, 120px off the bottom; h1 `display-md` | h1 `display-xl` | as drawn | as 1440 |
| Hero scrim | none (copy is under the photo) | none | S: 467/839 of the photo height | S | S | S |
| Culture header | L: badge over headline; headline `text-h1` | L: same | badge left, headline right 801/1392 of the column; `display-sm` | S | as drawn | S |
| Culture card photo | S: 1392/860 | S | S | S | S | S |
| Culture band | L: under the photo, full width, `h4` title + body | L: same | overlays: 83.05% wide, centred, F 40px off the bottom, F padding 40/48 | F padding 40/64 | as drawn | as 1440 |
| Card gap | F 48 | F 48 | F 100 | F 100 | F 100 | F 100 |
| Openings header | L: badge, headline `text-h1`, count under it | L | badge + `display-lg` headline left, count right | S | as drawn | S |
| Job row | L: one column: title `text-h1`, excerpt, tags, Apply full width | L: two columns: fluid title + F 253 right column | F 253 right column, ≥48 gap, title `display-md` | S | as drawn | S |
| Benefits | L: 1 column; tiles keep 447/367 | L: 2 columns | 3 columns, F 24 gaps, S tiles 447/367; the wide photo spans 2 | S | as drawn | S |
| Job page | L: one column, Overview card first | L: same | L: same | 2 columns, 849:463 with F gap 80 | as drawn | S, 849:463 |
| Apply modal | L: full width minus 16px each side, 1 column fields, scrolls inside | 2 column fields | 968 max, 2 columns | as 1024 | as drawn | as drawn |

## Figma slips

| Slip | Ships as |
|---|---|
| "Summited!" | "Submitted!" (user may veto) |
| "(06 jobs available)" with 3 rows | count from the data, zero-padded |
| Sidebar lists industries | other jobs (21e) |
| "Max 5MB" | "Max 4MB" (21b) |
| Benefits row about 1390 wide in a 1392 column | full width (hug artifact) |
| Culture card 2 band is 64px off the bottom; cards 1 and 3 are 40px | 40px on all three |
| Culture card 1 band is a fixed 200px with a two-line title (content 216px) | band hugs its content |
| Benefit tiles are set in Be Vietnam Pro at 23.17/18.54px (a scaled component) | Lexend SemiBold 24 for the title, Montserrat 18/28 for items (site fonts) |
| Job title "Business Intelligence & Analytics Officier" | ships as drawn ("Officier"), flagged |
| Header and footer show the 20th-anniversary logo | the site's current Header and Footer |
| No error state for the form | inline message, derived |
