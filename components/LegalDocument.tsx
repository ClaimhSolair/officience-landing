import React from 'react';
import type { LegalSection, LegalBlock } from './legalContent';

// Turn email addresses and bare URLs inside legal copy into clickable links,
// keeping the source data as plain strings.
const LINK_RE = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|(?:https?:\/\/|www\.)[^\s]+)/g;

const linkify = (text: string): React.ReactNode[] => {
  const out: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  LINK_RE.lastIndex = 0;
  while ((m = LINK_RE.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    let token = m[0];
    // peel trailing sentence punctuation back out of the link
    let trail = '';
    while (/[.,;:)]$/.test(token)) {
      trail = token.slice(-1) + trail;
      token = token.slice(0, -1);
    }
    const isEmail = token.includes('@');
    const href = isEmail ? `mailto:${token}` : token.startsWith('http') ? token : `https://${token}`;
    out.push(
      <a
        key={`${m.index}-${token}`}
        href={href}
        {...(isEmail ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
        className="text-text-primary underline hover:text-blue-800 transition-colors break-words"
      >
        {token}
      </a>,
    );
    if (trail) out.push(trail);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
};

// Body-lg 16/26. From fhd it steps up x1.333 to 21/35 (no 1920 frame exists).
const BODY = 'font-body text-body-lg text-text-default fhd:text-[21px] fhd:leading-[35px]';

// Figma 2927:3195 draws every list the same way: a disc marker, a 1.5em (24px)
// indent, and the items on the 26px line with no space between them.
const LIST = `list-disc pl-[24px] fhd:pl-[32px] ${BODY}`;

/** The rendered blocks of a clause. Adjacent `bullet` blocks join into one list. */
type Run = { kind: 'block'; block: LegalBlock } | { kind: 'bullets'; items: { lead?: string; text: string }[] };

const toRuns = (blocks: LegalBlock[]): Run[] => {
  const runs: Run[] = [];
  for (const block of blocks) {
    if (block.kind === 'p' && block.bullet) {
      const last = runs[runs.length - 1];
      if (last?.kind === 'bullets') last.items.push(block);
      else runs.push({ kind: 'bullets', items: [block] });
    } else runs.push({ kind: 'block', block });
  }
  return runs;
};

const isList = (run: Run) => run.kind === 'bullets' || run.block.kind === 'ul';

const RunView: React.FC<{ run: Run; className: string }> = ({ run, className }) => {
  if (run.kind === 'bullets') {
    // Most Figma sections set the term in a list as plain text ("Account means …"),
    // so the lead is not bold here.
    return (
      <ul className={`${LIST} ${className}`}>
        {run.items.map((item, i) => (
          <li key={i}>
            {item.lead && `${item.lead} `}
            {linkify(item.text)}
          </li>
        ))}
      </ul>
    );
  }
  const { block } = run;
  if (block.kind === 'ul') {
    return (
      <ul className={`${LIST} ${className}`}>
        {block.items.map((item, i) => (
          <li key={i}>{linkify(item)}</li>
        ))}
      </ul>
    );
  }
  if (block.kind === 'address') {
    return (
      <div className={`rounded-fig-m bg-bg-default p-[16px] ${BODY} ${className}`}>
        {block.lines.map((line, i) => (
          <p key={i} className={i === 0 ? 'font-semibold' : ''}>
            {linkify(line)}
          </p>
        ))}
      </div>
    );
  }
  return (
    <p className={`${BODY} ${className}`}>
      {block.lead && <strong className="font-bold">{block.lead} </strong>}
      {linkify(block.text)}
    </p>
  );
};

/**
 * Figma separates blocks with one empty 26px line. A list sits directly under the
 * sentence that leads into it, so a list after a paragraph gets no gap.
 */
const gapBefore = (runs: Run[], i: number) => {
  if (i === 0) return '';
  const prev = runs[i - 1];
  const prevIsLeadIn = prev.kind === 'block' && prev.block.kind === 'p';
  return isList(runs[i]) && prevIsLeadIn ? '' : 'mt-[26px] fhd:mt-[35px]';
};

/** Lower case, no accents, words joined by "-": "Governing Law" -> "governing-law". */
const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

/**
 * Stable anchor id for a section, so the table of contents can deep-link to it.
 * It comes from the title, so a link reads "#governing-law" and stays right when
 * a section is added before it. The old ids were "#s-0" to "#s-11".
 */
export const sectionAnchor = (section: LegalSection, index: number): string =>
  section.title ? slugify(section.title) : `s-${index}`;

/** Heading text as rendered: "12. Governing Law", or a bare title, or nothing. */
export const sectionHeading = (section: LegalSection): string =>
  section.title ? (section.id ? `${section.id}. ${section.title}` : section.title) : '';

/**
 * Renders a legal document from the structured copy in `legalContent.ts`.
 * Used by the /terms-of-use and /privacy-policy pages.
 *
 * Figma 2922:1887 and 2927:3153: 80px between sections, 24px from a heading to
 * its copy, and one empty 26px line between clauses. A clause heading is
 * Montserrat Bold 16/26 and sits directly on its copy. Every text block is
 * `Text/Default` #0F1219. The column is 784 wide. From fhd every value is
 * x1.333: a 1045 column, 67/77 headings, 21/35 copy, and 107 / 32 / 35 gaps.
 */
const LegalDocument: React.FC<{ sections: LegalSection[] }> = ({ sections }) => (
  <div className="flex max-w-[784px] flex-col gap-fig-40 lg:gap-fig-80 fhd:max-w-[1045px] fhd:gap-[107px]">
    {sections.map((section, si) => {
      const heading = sectionHeading(section);
      return (
        // No scroll margin: the global `scroll-padding-top` (index.html) already
        // clears the header. A 120px margin added to it and stopped each section
        // 119px low, below the contents spy line, so a clicked row lost its
        // highlight to the row above (UI/UX E2E test U-19).
        <section
          key={si}
          id={heading ? sectionAnchor(section, si) : undefined}
          className="flex flex-col gap-fig-16 lg:gap-fig-24 fhd:gap-[32px]"
        >
          {heading && (
            <h2 className="font-sans text-h2 text-text-default lg:text-display-sm fhd:text-[67px] fhd:leading-[77px]">
              {heading}
            </h2>
          )}
          <div className="flex flex-col gap-[26px] fhd:gap-[35px]">
            {section.clauses.map((clause, ci) => {
              const runs = toRuns(clause.blocks);
              return (
                <div key={ci} className="flex flex-col">
                  {clause.heading && (
                    <h3 className={`${BODY} font-bold`}>{clause.heading}</h3>
                  )}
                  {runs.map((run, ri) => (
                    <RunView key={ri} run={run} className={gapBefore(runs, ri)} />
                  ))}
                </div>
              );
            })}
          </div>
        </section>
      );
    })}
  </div>
);

export default LegalDocument;
