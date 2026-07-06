# Design: `figma-to-code` skill (Figma MCP → web translation workflow)

Date: 2026-07-07 · Branch: `redesign/2026` · Status: approved by user, implemented same day

## Context

Over ~40 commits of the 2026 redesign, a repeatable Figma→code workflow emerged — along with a set of expensive, repeatedly re-learned traps (vw-sized elements looking like "local vs Vercel differences", `get_metadata` token blowups, `get_design_context` timeouts, preview rAF/reduced-motion freezes, R2 cache races, unapproved uploads). The user asked for a Claude skill that codifies the workflow so future sessions translate Figma designs "with minimal friction": read a node fully via MCP, extract/download assets and push to the Cloudflare bucket, translate faithfully and responsively, flag design limitations immediately, and run a user verification loop.

## Decisions (user-confirmed)

1. **Scope:** generic core + per-project adapter. The skill teaches the universal workflow; a small `.claude/figma-adapter.md` in each project supplies bucket/upload/tokens/quirks. Officience is the first adapter instance.
2. **Location:** core skill is personal (`C:\Users\ADMIN\.claude\skills\figma-to-code\`); the Officience adapter is committed in this repo (`.claude/figma-adapter.md`) so teammates get it via clone.
3. **Assets:** MCP-first extraction; when the MCP can't deliver export quality (logos, photos), Claude hands the user a precise export checklist (node name/ID/format/scale), the user drops files into a drop folder, Claude processes (Pillow trim/transparency) and uploads.
4. **R2 upload gating:** approval-gated like git push — show file list + before/after, upload only on explicit go, every time.
5. **Feedback loop:** per-section checkpoint — self-verify (eval geometry vs Figma values at standard widths + build check), report measured-vs-Figma with risks, wait for user approval before the next section.
6. **Structure:** compact `SKILL.md` (mandatory workflow, hard gates, risk-flagging duty) + four per-phase reference files loaded on demand.

## Deliverables

```
C:\Users\ADMIN\.claude\skills\figma-to-code\
  SKILL.md                       # preflight (MCP ping, adapter load, mode check), 5-phase
                                 # checklist, hard gates, risk-flagging duty, scope discipline
  references/reading-figma.md    # node-id conversion; tool order get_metadata(node-only, grep
                                 # spilled output)→get_screenshot→get_design_context(-32001 retry
                                 # + fallback)→get_variable_defs; walk all children; design-facts sheet
  references/assets.md           # inventory; MCP-first + quality boundaries; export-checklist format;
                                 # Pillow recipe (RGBA, soft white-key 236→250, getbbox crop);
                                 # gated upload + cache-bust + ?cb verify; adapter template
  references/translation.md      # fidelity rules (fixed px not vw; aspect-[w/h]; tokens first;
                                 # clamp caps keep desktop identical; flex-axis literacy);
                                 # desktop→tablet→mobile order; real mobile patterns scoped via
                                 # base+md: reset or max-md:!; limitations protocol (assume+flag,
                                 # usability conflicts, standing divergences)
  references/verification.md     # eval geometry not screenshots; clientWidth not innerWidth;
                                 # widths 320–1440(+artboard); preview traps (rAF freeze,
                                 # reduced-motion, AnimatePresence step-0); checkpoint report format

<repo>\.claude\figma-adapter.md  # Officience instance: file key + node map, R2 redesign bucket +
                                 # upload-assets + ASSET_VERSION, t-*/fig tokens + palette,
                                 # drop folders, verification widths + preview quirks,
                                 # standing divergences (compact header, static icon band, no CV
                                 # upload), project hard rules recap
```

## Hard gates baked into the skill

- Plan Mode signal = hard stop on all mutating actions, at any point in a session (mirrors `CLAUDE.md`).
- Bucket upload and git commit/push each require explicit user approval, every time.
- Per-section user checkpoint — self-verification alone never advances to the next section.
- Fidelity risks flagged the moment they're found, never batched into the final report; no silent "improvements" over Figma.

## Verification

- Skill loads: invoking `figma-to-code` (or matching a Figma-URL request) reads SKILL.md; each phase reads its reference file.
- Adapter resolves: on this repo the skill finds `.claude/figma-adapter.md` and uses the R2 `redesign` bucket, `npm run upload-assets`, `ASSET_VERSION`, and the preview-quirk list instead of guessing.
- Dry-run acceptance: next Figma-referenced fix on this repo should proceed through READ→ASSETS→TRANSLATE→VERIFY→HANDOFF with a measured-vs-Figma checkpoint report and no ungated upload/commit.
