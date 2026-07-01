# Contact Section Figma Fixes

## Context

Two small visual/copy bugs were reported against the redesigned Contact section, both traceable to specific Figma frames. All other elements in the affected components must remain unchanged.

## Issue 1: Contact header title/subtitle misaligned

**File:** `components/Contact.tsx`

At the `lg` breakpoint, the Contact card lays out the header (title + subtitle) and the survey-entry form side by side. The header column currently uses `justify-end`, which bottom-aligns "Let's Build Together" and its subtitle against the taller form panel — leaving a large empty gap above the title.

Figma reference: [node 2202-5139](https://www.figma.com/design/cplHg0LeeRaYKPdvSJK37E/Officience.com-2026?node-id=2202-5139&m=dev) shows the title top-aligned, level with the "What brings you here?" heading in the form panel.

**Fix:** change `justify-end` to `justify-start` on the header column (currently `components/Contact.tsx:85`).

**Scope note:** this only affects the desktop/`lg` row layout. On mobile the header and form stack vertically in a single column with no extra vertical space to redistribute, so `justify-content` has no visible effect there — mobile rendering is unaffected by this change.

## Issue 2: Survey Step 2 Question 4 missing number

**File:** `components/Survey.tsx`

In the "Work with Officience" branch, step 2 ("Timeline, Budget & Contact") renders four questions. The first three are labeled "1.", "2.", "3." but the fourth ("Anything else you'd like us to know?", currently `components/Survey.tsx:406`) has no number, breaking the pattern.

Figma reference: [node 2195-3171](https://www.figma.com/design/cplHg0LeeRaYKPdvSJK37E/Officience.com-2026?node-id=2195-3171&m=dev) shows this label as `"4. Anything else you'd like us to know?"`.

**Fix:** prepend `"4. "` to the label text. No other change — the field is not marked required in Figma, matching current behavior.

## Verification

- Run the dev server, open the Contact section at desktop width (≥1440px) and confirm the title/subtitle now top-align with "What brings you here?".
- Confirm mobile/stacked layout (< lg breakpoint) is visually unchanged.
- Open the survey ("Work with Officience" → step 2) and confirm question 4 reads "4. Anything else you'd like us to know?".
- No other copy, spacing, or component behavior should change.
