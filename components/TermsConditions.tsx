import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import {
  TERMS_SECTIONS,
  PRIVACY_SECTIONS,
  type LegalSection,
  type LegalBlock,
} from './legalContent';

interface TermsConditionsProps {
  isOpen: boolean;
  onClose: () => void;
  /** Tab shown when the modal opens (defaults to Terms). */
  initialTab?: Tab;
}

type Tab = 'terms' | 'privacy';

const TABS: { key: Tab; label: string; sections: LegalSection[] }[] = [
  { key: 'terms', label: 'Terms & Conditions', sections: TERMS_SECTIONS },
  { key: 'privacy', label: 'Privacy Policy', sections: PRIVACY_SECTIONS },
];

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

const LegalDocument: React.FC<{ sections: LegalSection[] }> = ({ sections }) => (
  <div className="flex flex-col gap-[28px]">
    {sections.map((section, si) => {
      const heading = section.title
        ? section.id
          ? `${section.id}. ${section.title}`
          : section.title
        : '';
      const isClosing = !section.id && !section.title;
      return (
        <section key={si} className="flex flex-col gap-[12px]">
          {heading && <h3 className="t-h3 text-text-default">{heading}</h3>}
          {section.clauses.map((clause, ci) => (
            <div key={ci} className="flex flex-col gap-[10px]">
              {clause.heading && <h4 className="t-h4 text-text-default">{clause.heading}</h4>}
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

const TermsConditions: React.FC<TermsConditionsProps> = ({ isOpen, onClose, initialTab = 'terms' }) => {
  const [tab, setTab] = useState<Tab>(initialTab);

  // Reset to the requested tab on open, lock background scroll, close on Esc.
  useEffect(() => {
    if (!isOpen) return;
    setTab(initialTab);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose, initialTab]);

  const active = TABS.find((t) => t.key === tab) ?? TABS[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 20 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={active.label}
            className="relative bg-bg-secondary w-full max-w-[900px] max-h-[90vh] rounded-fig-m shadow-fig-xs overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-bg-primary px-[clamp(24px,5vw,40px)] py-[20px] flex justify-between items-center">
              <h2 className="t-h2 text-white">{active.label}</h2>
              <button
                onClick={onClose}
                aria-label="Close"
                className="p-2 text-white hover:bg-white/20 rounded-fig-xs transition-colors"
              >
                <X size={28} />
              </button>
            </div>

            {/* Tabs */}
            <div role="tablist" aria-label="Legal documents" className="flex bg-bg-default border-b border-gray-fig-100 px-[clamp(16px,4vw,32px)]">
              {TABS.map((t) => {
                const selected = t.key === tab;
                return (
                  <button
                    key={t.key}
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setTab(t.key)}
                    className={`px-[16px] py-[14px] -mb-px border-b-2 t-h4 transition-colors whitespace-nowrap ${
                      selected
                        ? 'border-primary text-text-primary font-semibold'
                        : 'border-transparent text-subtitle hover:text-text-default'
                    }`}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Body — keyed by tab so switching documents resets scroll to top */}
            <div key={tab} className="flex-1 overflow-y-auto px-[clamp(24px,5vw,40px)] py-[32px]">
              <div className="max-w-[760px] mx-auto">
                <LegalDocument sections={active.sections} />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-bg-default border-t border-gray-fig-100 px-[clamp(24px,5vw,40px)] py-[16px] flex justify-end">
              <button
                onClick={onClose}
                className="h-[40px] px-[24px] rounded-fig-xs bg-primary text-white font-sans font-medium text-[16px] leading-[24px] hover:bg-blue-800 transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TermsConditions;
