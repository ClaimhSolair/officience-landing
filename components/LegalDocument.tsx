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

const Block: React.FC<{ block: LegalBlock; muted?: boolean }> = ({ block, muted }) => {
  if (block.kind === 'ul') {
    return (
      <ul className="list-disc pl-[22px] space-y-[6px] t-body-lg text-text-muted">
        {block.items.map((item, i) => (
          <li key={i}>{linkify(item)}</li>
        ))}
      </ul>
    );
  }
  if (block.kind === 'address') {
    return (
      <div className="bg-bg-default rounded-fig-m p-[16px] t-body-lg text-text-default">
        {block.lines.map((line, i) => (
          <p key={i} className={i === 0 ? 'font-semibold' : ''}>
            {linkify(line)}
          </p>
        ))}
      </div>
    );
  }
  return (
    <p className={`t-body-lg leading-relaxed ${muted ? 'text-subtitle italic' : 'text-text-muted'}`}>
      {block.lead && <strong className="text-text-default">{block.lead} </strong>}
      {linkify(block.text)}
    </p>
  );
};

/** Stable anchor id for a section, so the table of contents can deep-link to it. */
export const sectionAnchor = (section: LegalSection, index: number): string =>
  section.id ? `s-${section.id}` : `s-${index}`;

/** Heading text as rendered: "12. Governing Law", or a bare title, or nothing. */
export const sectionHeading = (section: LegalSection): string =>
  section.title ? (section.id ? `${section.id}. ${section.title}` : section.title) : '';

/**
 * Renders a legal document from the structured copy in `legalContent.ts`.
 * Used by the /terms-of-use and /privacy-policy pages.
 */
const LegalDocument: React.FC<{ sections: LegalSection[] }> = ({ sections }) => (
  <div className="flex flex-col gap-[28px]">
    {sections.map((section, si) => {
      const heading = sectionHeading(section);
      const isClosing = !section.id && !section.title;
      return (
        <section
          key={si}
          id={heading ? sectionAnchor(section, si) : undefined}
          className="flex flex-col gap-[12px] scroll-mt-[120px]"
        >
          {heading && <h2 className="t-h3 text-text-default">{heading}</h2>}
          {section.clauses.map((clause, ci) => (
            <div key={ci} className="flex flex-col gap-[10px]">
              {clause.heading && <h3 className="t-h4 text-text-default">{clause.heading}</h3>}
              {clause.blocks.map((block, bi) => (
                <Block key={bi} block={block} muted={isClosing} />
              ))}
            </div>
          ))}
        </section>
      );
    })}
  </div>
);

export default LegalDocument;
