# LLM Council transcript — Career plan (2026-10-09)

## Original question

"Council this plan. Focus on how we can adopt the figma design proportionally and faithfully. Include in-browser test after each implementation checkpoint."

## Framed question

Review the Career plan (hub `/career`, job page `/career/:slug`, apply and success modals, `api/apply.ts`). Figma has 1440 artboards only. How should the build adopt the design proportionally and faithfully at 390 / 768 / 1024 / 1920, and how should an in-browser test gate each checkpoint? Context given: the project's Responsive Rules, Verification Procedure and Figma Fidelity Rules; the frozen-pane and iframe-probe quirks; the user's rulings; two standing rulings that the plan conflicted with (Lucide icons; no CV upload in the survey).

## Advisor responses (summaries of the full text)

**Contrarian.** The fatal flaw is one verification block at the end: one broken mechanism gets copied into four sections. Save one probe at CP0. The hero needs `aspect-[1440/839]`. At 1024 the culture band overflows because the type is fixed; make it % at `xl:` and stack it below. The job page (1312) cannot fit 1024. The 1170px modal needs internal scroll on a ~730px laptop viewport. Decide a 1920 rule once. Use Lucide. Do not refactor the shipped `survey.ts`; duplicate the guards. Prove `Request.formData()` against Vercel's `(req, res)` handler before UI work.

**First Principles.** The plan answers "how to test" before "test against what". Write a derivation table (scales / fixed / changes layout, per section and width) for the user to sign off, then one probe that reads it. Do the 1024 arithmetic first. If 1024 breaks, change the table row, not a px value. Iconly vs Lucide and the CV exception need answers before CP0.

**Expansionist.** Make fidelity machine-checked: a `geometry.ts` from `get_metadata`, `data-fig` tags, a committed `fidelity.js` probe. Use % insets (`left-[8.48%] bottom-[4.65%] w-[83.05%]`). Promote the pattern to CLAUDE.md.

**Outsider.** Define "proportional" first. Name the job-page stacking width and the mobile position of Overview. Say what the modal becomes below 768. Checkpoints C0-C9. A no-op "Save for later" looks broken; placeholder jobs attract real CVs; ask about "Summited!"; get sign-off on Iconly and the upload before C1.

**Executor.** Build the harness first, then gate every section with numeric thresholds (band/card 0.83 ±1%, scrim 467/839, line counts, 1024 fit, modal focus, 5 MB and .txt rejection). Motion goes to a real Chrome tab or a named user check. Fails twice → change the approach.

## Peer reviews (A=Executor, B=Contrarian, C=Outsider, D=First Principles, E=Expansionist)

1. Strongest D (defines "correct" first). Blind spot C. All missed: a flagged-mistakes list per gate; CV storage and consent; the 4.5 MB body limit.
2. Strongest B (arithmetic). Correction: 697 + 253 = 950 fits 976 with a gap ≤ 26, so "stack at 1024" is wrong. E's "% insets cannot fail at 1024" is false. Missed: the 1389 vs 1392 benefits slip.
3. Strongest A (runnable here). C9 "submit to local API" cannot run under Vite. Missed: test the upload with `DataTransfer`; probe at 1910, not 1920.
4. Strongest A (keeps the drawn 40px bottom). E's 4.65% moves the band. Missed: `object-position` must come from the Figma fill crop; compare the 1440 render with `get_screenshot`; keep a mistakes list.
5. Strongest A. E is over-engineered for one page. Missed: the 4.5 MB limit, CV storage, honeypot, the file picker in the pane.

## Chairman verdict

**Agrees:** test after each section with one saved probe; boxes scale as fractions of the content box, type stays fixed and swaps; do the 1024 arithmetic first; settle Iconly/Lucide and the CV exception first; motion and the real API go outside the pane.

**Clash rulings:** keep the 40px band bottom, `w-[83.05%] mx-auto`, height from the text. Job rows fit at 1024 (Figma gap 442; fluid title, 253 right column, ≥48 gap); stack below `md`. The job page has 2 columns from `xl` only, Overview first when stacked. Skip `geometry.ts`/`data-fig`. Duplicate the guards. Text tolerance +6% width with the same line count. The Outsider's sheet modal, hidden "Save for later" and gated jobs are redesigns: flag, do not build.

**Blind spots:** probe at 1910; keep a slips list; `object-position` from the fill; compare with `get_screenshot`; test the upload with `DataTransfer`; prove `formData()`; the modal scrolls inside; placeholder jobs need the user's call.

**Recommendation:** checkpoints CP0-CP9 as written into the plan file.

**First thing:** ask the user the open rulings (Iconly vs Lucide, the CV exception, the placeholder jobs). Answered 2026-10-09: Lucide; Career-only exception; ship all 4 on the preview and block the merge.

## Corrections made by the session after the verdict

- "The wide photo is 919 vs 918" is false; Figma draws 918.98.
- The plan already had the 4 MB cap, the honeypot, the consent box and the jobs@ routing; the reviewers who listed them as missing lacked the full plan.
