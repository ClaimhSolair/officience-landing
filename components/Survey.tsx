import React, { useState, useEffect, useId, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, AlertCircle } from 'lucide-react';
import { focusTarget } from '../lib/focus';
import { useModalA11y } from '../lib/modal';
import { ROUTES } from './navigation';
import type { SurveyBranch } from '../types';

interface SurveyProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: Record<string, string>) => void;
  initialBranch?: SurveyBranch;
  /** Everything behind the dialog, made inert while it is open. */
  backgroundRef?: React.RefObject<HTMLElement>;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * The message for an address that has been typed but is not an address. Silence
 * was the old behaviour: the Submit button greyed out and nothing anywhere said
 * why, which is indistinguishable from a broken form.
 */
const emailError = (value: unknown): string | undefined => {
  const typed = String(value ?? '');
  if (!typed || emailRegex.test(typed)) return undefined;
  return 'Enter a valid email address, e.g. name@domain.com';
};

// ---------------------------------------------------------------------------
// CONFIG (faithful to Figma frames 2195:2838 / 3012 / 3513 / 3809 / 2174 / 2309 / 2614)
// ---------------------------------------------------------------------------
type SolveTag = 'Product' | 'Design' | 'Data' | 'Operation' | 'General';
type Option = { label: string; desc?: string; tag?: SolveTag };

const WORK_OPTIONS = {
  iAm: ['Independent', 'Agency', 'Startup', 'SME', 'Enterprise', 'Social venture'],
  // 2-col grid, row-wise order to match Figma reading order.
  services: ['Design', 'IT & Dev', 'Data & BPO', 'AI / ML', 'Analytics / BI', 'Not sure yet'],
  solve: [
    { tag: 'Product', label: 'Build or improve a website/app' },
    { tag: 'Design', label: 'Brand identity or UI/UX design' },
    { tag: 'Product', label: 'QA & software testing' },
    { tag: 'Design', label: 'Image editing & retouching' },
    { tag: 'Data', label: 'Data collection & structuring' },
    { tag: 'Operation', label: 'Back-office & workflow support' },
    { tag: 'Data', label: 'Dashboard & BI report' },
    { tag: 'General', label: 'Not sure yet - I need advice' },
  ] as Option[],
  timeline: ['ASAP', 'Within 1 month', '1-3 months', 'Just exploring'],
  budget: ['< €1k', '€3–5K', '€10K', '€20K', '> €50K', 'Flexible'],
};

// The labels are the `category` value that CATEGORY_ROUTES in api/survey.ts
// keys on. Do not change a label without the same change in the API.
const CATEGORY_CARDS: Option[] = [
  { label: 'Internship', desc: 'Join the Offy team as a student or fresh grad' },
  { label: 'Full-time career', desc: 'I’m looking for a permanent role at Officience' },
  { label: 'Co-working space', desc: 'I need a desk or safe workspace in HCMC or Paris' },
  { label: 'Partnership & referral', desc: 'Let’s collaborate or referral or strategic partnership' },
  { label: 'Other inquiries', desc: 'Something else general questions' },
];

/**
 * The flow name in the title of the category complete step (Figma 2818:2756,
 * 2818:2828, 2818:2864, 2818:2900). Figma draws no complete frame for
 * "Full-time career", so that name is the build's own.
 */
const COMPLETE_FLOW_NAME: Record<string, string> = {
  Internship: 'Internship',
  'Full-time career': 'Full-time Career',
  'Co-working space': 'Coworking Space',
  'Partnership & referral': 'Partnership',
  'Other inquiries': 'Survey Other',
};

const DETAIL_OPTIONS = {
  positions: ['Design / UX', 'Front-end', 'Back-end', 'Data / AI', 'QA', 'BPO'],
  coworkLocation: ['HCMC', 'Paris', 'Either'],
  coworkDuration: ['Daily', 'Weekly', 'Monthly', 'Long-term'],
  coworkTeam: ['Just me', '2-5 peoples', '+5 peoples'],
  partnershipModel: ['Referral', 'Subcontracting', 'Co-delivery', 'Not sure yet'],
};

const TAG_STYLES: Record<SolveTag, { color: string; background: string }> = {
  Product: { color: '#dd3c57', background: '#fff1f3' },
  Design: { color: '#146d45', background: '#ddf9ec' },
  Data: { color: '#d77d17', background: '#fff1e0' },
  Operation: { color: '#1f49bf', background: '#ecf4ff' },
  General: { color: '#5a5a5a', background: '#e5e5e5' },
};

const PROGRESS_LABELS: Record<SurveyBranch, [string, string, string]> = {
  work: ['Requirements', 'Expectations', 'Complete'],
  category: ['Category', 'Detail', 'Complete'],
};

// ---------------------------------------------------------------------------
// PRIMITIVES
// ---------------------------------------------------------------------------
/**
 * Figma "Bar Steps" 3316:2401. The inactive label and the inactive bar are two
 * different greys — Text/Subtitle-2 #A0A0A0 for the word, Border/Outline-Field
 * #C6C6C6 for the rule — where the July build used one for both. The colour is
 * `gray-fig-400`, not `subtitle-2`: that key is already a fontSize.
 *
 * The box is 760 of the 904 content width, with 7px above and below, so the
 * row is 40 tall. Each step is 245 wide (32.24% of 760) and 26 tall, so 9px
 * stay empty at the end of the box. Percentages keep these ratios when the
 * dialog is narrower than 968 (tablet and mobile), and a step can shrink.
 */
const ProgressBar: React.FC<{ labels: [string, string, string]; current: number }> = ({ labels, current }) => (
  <div className="flex shrink-0 basis-[84.07%] gap-[8px] py-[7px]">
    {labels.map((label, i) => (
      <div key={label} aria-current={i === current ? 'step' : undefined} className="flex min-h-[26px] min-w-0 flex-[0_1_32.24%] flex-col gap-[4px]">
        <span
          className={`font-body font-bold text-[10px] uppercase leading-[14px] ${
            i <= current ? 'text-primary' : 'text-gray-fig-400'
          }`}
        >
          {i + 1}. {label}
        </span>
        <div
          className={`h-[4px] rounded-full transition-colors motion-reduce:transition-none ${
            i <= current ? 'bg-primary' : 'bg-border-field'
          }`}
        />
      </div>
    ))}
  </div>
);

/**
 * The question label: Heading-H3, Lexend 600 24/28 from sm. The asterisk has a
 * 32px line, so a required label is 32 tall, as Figma draws it. The hint is
 * Body-xl-bold, Montserrat 700 20/28. Both sit 3px after the text. Below sm
 * the label is 20/28 and the hint 16px, so a long question does not take
 * three lines in the 286px panel. `gap` is the space to the control below
 * (12 for options and fields, 8 for a text area).
 * `id` lets the option group below name itself with this question (`labelledBy`).
 */
const QLabel: React.FC<{
  children: React.ReactNode;
  required?: boolean;
  hint?: string;
  id?: string;
  gap?: 8 | 12;
  /** Use a 32px line on the text too (the category question, 3341:2758). */
  tall?: boolean;
}> = ({ children, required, hint, id, gap = 12, tall }) => (
  <h3
    id={id}
    className={`font-sans font-semibold text-[20px] leading-[28px] text-text-default sm:text-h3 ${
      tall ? 'sm:leading-[32px]' : ''
    } ${gap === 8 ? 'mb-[8px]' : 'mb-[12px]'}`}
  >
    {children}
    {required && (
      <span className="ml-[3px] text-off-red sm:leading-[32px]">
        *
      </span>
    )}
    {hint && (
      <span className="ml-[3px] font-body font-bold text-[16px] leading-[24px] text-subtitle sm:text-[20px] sm:leading-[28px]">
        {hint}
      </span>
    )}
  </h3>
);

/**
 * The Form Input Chip (3329:2471). Figma draws it 36 tall with 12px side
 * padding. The default label is Montserrat 500 14/20 #5A5A5A on a #C6C6C6
 * border. The selected chip follows ruling 23 (row 15): #ECF4FF fill, primary
 * border, Montserrat 700 14/22 primary label. Below sm the chip is 46 tall so
 * it clears a 44px tap target (an accepted divergence, adapter Survey section).
 */
const chipClass = (isSel: boolean) =>
  `inline-flex h-[46px] items-center rounded-fig-xs border px-[12px] font-body text-[14px] transition-colors motion-reduce:transition-none sm:h-[36px] ${
    isSel
      ? 'border-primary bg-[#ecf4ff] font-bold leading-[22px] text-primary'
      : 'border-border-field bg-white font-medium leading-[20px] text-subtitle hover:border-primary'
  }`;

const ChipGroup: React.FC<{
  options: string[];
  value: any;
  onChange: (v: any) => void;
  multi?: boolean;
  /**
   * 2 draws the chips as a two-column grid of full-width chips, as the
   * "Service I’m interested in" options (2809:2924): 426 x 36, gap 12.
   */
  columns?: 2;
  /** The id of the question label. A screen reader reads it as the group name. */
  labelledBy?: string;
}> = ({ options, value, onChange, multi, columns, labelledBy }) => {
  const selected = (opt: string) => (multi ? (value || []).includes(opt) : value === opt);
  const toggle = (opt: string) => {
    if (multi) {
      const cur: string[] = value || [];
      onChange(cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]);
    } else {
      onChange(opt);
    }
  };
  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      className={columns === 2 ? 'grid grid-cols-2 gap-[12px]' : 'flex flex-wrap gap-[12px]'}
    >
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          // Colour and weight alone show the choice. This tells a screen reader.
          aria-pressed={selected(opt)}
          onClick={() => toggle(opt)}
          className={`${chipClass(selected(opt))} ${columns === 2 ? 'w-full text-left' : ''}`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

/**
 * The Form Option Card. Two kinds:
 * - With a tag (2809:2969): 36 tall, px 16. The tag is Montserrat 500 10/16
 *   with 4px side padding and no radius. The label is Montserrat 500 14/20
 *   #5A5A5A. From sm the cards are two columns of 342 in a 696 block.
 * - With a description (3341:2756): 60 tall, px 16, py 8. The title is
 *   Montserrat 700 14/22 #0F1219 and the description Montserrat 500 14/20
 *   #5A5A5A. Figma puts 2px between them in a 60 box that clips them. The
 *   build uses no gap, so the card is 60 tall and nothing is clipped.
 * Selected: #ECF4FF fill, primary border, primary text, and a bold
 * 14/22 label on a tag card. A card can grow when its text wraps.
 */
const CardOptions: React.FC<{
  options: Option[];
  value: any;
  onChange: (v: any) => void;
  multi?: boolean;
  columns?: 1 | 2;
  /** The id of the question label. A screen reader reads it as the group name. */
  labelledBy?: string;
}> = ({ options, value, onChange, multi, columns = 1, labelledBy }) => {
  const selected = (opt: string) => (multi ? (value || []).includes(opt) : value === opt);
  const toggle = (opt: string) => {
    if (multi) {
      const cur: string[] = value || [];
      onChange(cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]);
    } else {
      onChange(opt);
    }
  };
  return (
    <div
      role="group"
      aria-labelledby={labelledBy}
      className={`grid gap-[12px] ${columns === 2 ? 'sm:max-w-[696px] sm:grid-cols-2' : 'grid-cols-1'}`}
    >
      {options.map((opt) => {
        const isSel = selected(opt.label);
        return (
        <button
          key={opt.label}
          type="button"
          aria-pressed={isSel}
          onClick={() => toggle(opt.label)}
          className={`flex items-center gap-[8px] text-left rounded-fig-xs border px-[16px] transition-colors motion-reduce:transition-none ${
            opt.desc ? 'min-h-[60px] py-[8px]' : 'min-h-[44px] py-[6px] sm:min-h-[36px]'
          } ${isSel ? 'border-primary bg-[#ecf4ff]' : 'border-gray-fig-100 bg-white hover:border-primary'}`}
        >
          {opt.tag && (
            <span
              className="font-body font-medium text-[10px] leading-[16px] px-[4px] shrink-0"
              style={TAG_STYLES[opt.tag]}
            >
              {opt.tag}
            </span>
          )}
          {opt.desc ? (
            <span className="flex flex-col">
              <span className={`font-body font-bold text-[14px] leading-[22px] ${isSel ? 'text-primary' : 'text-text-default'}`}>{opt.label}</span>
              <span className={`font-body font-medium text-[14px] leading-[20px] ${isSel ? 'text-primary' : 'text-subtitle'}`}>{opt.desc}</span>
            </span>
          ) : (
            <span
              className={`font-body text-[14px] ${
                isSel ? 'font-bold leading-[22px] text-primary' : 'font-medium leading-[20px] text-subtitle'
              }`}
            >
              {opt.label}
            </span>
          )}
        </button>
        );
      })}
    </div>
  );
};

/** The browser autofill token for each answer key. A key not here gets none. */
const AUTOCOMPLETE: Record<string, string> = {
  name: 'name',
  email: 'email',
  company: 'organization',
  role: 'organization-title',
  phone: 'tel',
};

/**
 * The Form Text Input (3342:2814). The label is Montserrat 700 14/22 #5A5A5A,
 * and the asterisk is Montserrat 500 14/20, 4px after it. The field is 8px
 * below the label: 36 tall, px 16, a #E5E5E5 border, a Montserrat 500 14/20
 * value and a #A0A0A0 placeholder. Below sm the field is 48 tall with a 16px
 * value, so iOS does not zoom the page when the field gets the focus.
 */
const TextField: React.FC<{
  label: string;
  k: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  /** Shown under the field and announced; also reddens the border. */
  error?: string;
  answers: Record<string, any>;
  set: (k: string, v: any) => void;
}> = ({ label, k, placeholder, required, type = 'text', error, answers, set }) => {
  const errorId = useId();
  return (
  <label className="flex flex-col gap-[8px]">
    <span className="font-body font-bold text-[14px] leading-[22px] text-subtitle">
      {label}
      {required && <span className="ml-[4px] font-medium leading-[20px] text-off-red">*</span>}
    </span>
    <input
      type={type}
      placeholder={placeholder}
      value={answers[k] || ''}
      onChange={(e) => set(k, e.target.value)}
      autoComplete={AUTOCOMPLETE[k]}
      // The red "*" is visual only, so the required state goes to the screen reader here.
      aria-required={required || undefined}
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errorId : undefined}
      // A 1px border colour change was the only focus sign. The ring shows only for the keyboard.
      className={`h-[48px] w-full rounded-fig-xs border bg-white px-[16px] font-body font-medium text-[16px] leading-[20px] text-text-default placeholder:text-gray-fig-400 focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors sm:h-[36px] sm:text-[14px] ${
        error ? 'border-err' : 'border-gray-fig-100'
      }`}
    />
    {error && (
      <span id={errorId} role="alert" className="font-body text-[12px] leading-[16px] text-err">
        {error}
      </span>
    )}
  </label>
  );
};

/**
 * The Form Textarea box (3342:2927): 87 tall, px 16, py 12, a #E5E5E5 border,
 * Montserrat 500 14/20 and a #A0A0A0 placeholder. The question label above it
 * is the accessible name (`labelledBy`), because a placeholder is not a label
 * and the portfolio box has no placeholder in Figma (3342:3038).
 */
const TextArea: React.FC<{
  placeholder?: string;
  k: string;
  /** The id of the question label above the box. */
  labelledBy: string;
  required?: boolean;
  answers: Record<string, any>;
  set: (k: string, v: any) => void;
}> = ({ placeholder, k, labelledBy, required, answers, set }) => (
  <textarea
    placeholder={placeholder}
    aria-labelledby={labelledBy}
    aria-required={required || undefined}
    value={answers[k] || ''}
    onChange={(e) => set(k, e.target.value)}
    className="block h-[87px] w-full rounded-fig-xs border border-gray-fig-100 bg-white px-[16px] py-[12px] font-body font-medium text-[16px] leading-[20px] text-text-default placeholder:text-gray-fig-400 focus:outline-none focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40 transition-colors resize-none sm:text-[14px]"
  />
);

/**
 * The consent row, drawn on the last input step of both branches (Figma
 * 2809:2247 and 2818:3232). It gates submission, and it is stored in `answers`
 * like any other field so it travels in the payload — a consent nobody records
 * is not worth collecting.
 *
 * Figma 3451:3387 draws a 24px box (an 18px square with a 2px #A0A0A0 line and
 * a 2px radius), 8px before Montserrat 500 14/20 #5A5A5A text. The box is the
 * real checkbox with `appearance-none`, so the keyboard and a screen reader
 * use it as before. Figma does not draw the checked state: the build fills the
 * box with the primary blue and shows a white tick.
 */
const ConsentCheck: React.FC<{ checked: boolean; onChange: (v: boolean) => void }> = ({
  checked,
  onChange,
}) => (
  <label className="flex min-h-[44px] cursor-pointer items-start gap-[8px] sm:min-h-0 sm:items-center">
    <span className="relative -mt-[2px] h-[24px] w-[24px] shrink-0 sm:mt-0">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer absolute left-[3px] top-[3px] m-0 h-[18px] w-[18px] cursor-pointer appearance-none rounded-[2px] border-2 border-gray-fig-400 bg-white checked:border-primary checked:bg-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-1"
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 18 18"
        className="pointer-events-none absolute left-[3px] top-[3px] hidden h-[18px] w-[18px] text-white peer-checked:block"
      >
        <path d="M4.5 9.5l3 3 6-6.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
    <span className="font-body font-medium text-[14px] leading-[20px] text-subtitle">
      I confirm that I have read and accepted the{' '}
      {/* Deliberately a new tab: navigating in place would discard a part-filled form. */}
      <a href={ROUTES.terms} target="_blank" rel="noopener noreferrer" className="text-primary underline">
        Terms of Use
      </a>{' '}
      and{' '}
      <a href={ROUTES.privacy} target="_blank" rel="noopener noreferrer" className="text-primary underline">
        Privacy Policy
      </a>{' '}
      of Officience.
    </span>
  </label>
);

/**
 * The green check of the complete step: Iconly Light-Outline "Check" (Figma
 * 2818:2787), 40px, #22B573. The path is the Figma export, unchanged. It is
 * inline because the brief allows no new bucket asset for one small glyph.
 */
const CompleteCheck: React.FC = () => (
  <svg aria-hidden="true" width="40" height="40" viewBox="0 0 40 40" fill="none" className="shrink-0">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      fill="#22B573"
      d="M20 3.33333C10.7953 3.33333 3.33333 10.7953 3.33333 20C3.33333 29.2047 10.7953 36.6667 20 36.6667C29.2047 36.6667 36.6667 29.2047 36.6667 20C36.6667 15.5797 34.9107 11.3405 31.7851 8.21489C28.6595 5.08928 24.4203 3.33333 20 3.33333ZM20 33.3333C12.6362 33.3333 6.66667 27.3638 6.66667 20C6.66667 12.6362 12.6362 6.66667 20 6.66667C27.3638 6.66667 33.3333 12.6362 33.3333 20C33.3333 23.5362 31.9286 26.9276 29.4281 29.4281C26.9276 31.9286 23.5362 33.3333 20 33.3333ZM25.2 14.15C25.524 13.8324 26.0426 13.8324 26.3667 14.15L27.2 15.0333C27.3578 15.1898 27.4465 15.4028 27.4465 15.625C27.4465 15.8472 27.3578 16.0602 27.2 16.2167L17.8333 25.5833C17.6821 25.7445 17.471 25.8359 17.25 25.8359C17.029 25.8359 16.8179 25.7445 16.6667 25.5833L12.75 21.6333C12.5922 21.4769 12.5035 21.2639 12.5035 21.0417C12.5035 20.8195 12.5922 20.6065 12.75 20.45L13.6333 19.5667C13.7846 19.4055 13.9957 19.3141 14.2167 19.3141C14.4376 19.3141 14.6488 19.4055 14.8 19.5667L17.3 22.05L25.2 14.15Z"
    />
  </svg>
);

// Card wrapper for each step's content. MUST be module-scope: defining it inside
// Survey makes it a new component type on every keystroke, which remounts the whole
// panel (inputs included) and drops focus after a single character.
// Figma: a white box with 20px padding and no radius. The question groups are
// 32 apart from sm, and 24 apart below sm.
const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-bg-default p-[20px] flex flex-col gap-[24px] sm:gap-[32px]">{children}</div>
);

/** The grid of text fields: two columns from sm, 12 between columns, 8 between rows. */
const FIELD_GRID = 'grid gap-x-[12px] gap-y-[8px] sm:grid-cols-2';

// ---------------------------------------------------------------------------
// SURVEY
// ---------------------------------------------------------------------------
const Survey: React.FC<SurveyProps> = ({
  isOpen,
  onClose,
  onComplete,
  initialBranch = 'work',
  backgroundRef,
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const [branch, setBranch] = useState<SurveyBranch>(initialBranch);
  const [step, setStep] = useState(0); // 0 = first input step, 1 = second input step
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Honeypot: a hidden field humans never fill. The server drops any submission that has it set.
  const [honeypot, setHoneypot] = useState('');

  // Scroll lock, focus trap, Escape to close, focus restored on close. The
  // survey was the one overlay on the site not using this — Tab walked straight
  // out of the dialog into the page behind it.
  useModalA11y({ isOpen, onClose, containerRef: panelRef, backgroundRef });

  // A step change removes the button that had the focus: "Back" goes on step
  // 0, and "Next step" becomes a disabled "Submit". The focus then falls to the
  // body. So each step change asks for the focus on the new step title. The
  // ref callback runs when that title mounts, which is after the exit
  // animation of the old step. The screen reader then reads the new step.
  const focusTitle = useRef(false);
  const titleRef = useCallback((node: HTMLHeadingElement | null) => {
    if (!node || !focusTitle.current) return;
    focusTitle.current = false;
    const body = node.closest<HTMLElement>('[data-lenis-prevent]');
    if (body) body.scrollTop = 0;
    focusTarget(node);
  }, []);
  const goToStep = (next: number) => {
    focusTitle.current = true;
    setStep(next);
  };

  useEffect(() => {
    if (isOpen) {
      setBranch(initialBranch);
      setStep(0);
      setAnswers({});
      setIsCompleted(false);
      setIsSubmitting(false);
      setError(null);
      setHoneypot('');
    }
  }, [isOpen, initialBranch]);

  if (!isOpen) return null;

  const set = (k: string, v: any) => setAnswers((prev) => ({ ...prev, [k]: v }));

  const category = answers['category'] as string | undefined;
  const isTalent = category === 'Internship' || category === 'Full-time career';
  const isCoworking = category === 'Co-working space';
  const isPartnership = category === 'Partnership & referral';

  // ---- validation / gating ----
  const validEmail = (k = 'email') => emailRegex.test(String(answers[k] || ''));
  const filled = (k: string) => Boolean(String(answers[k] || '').trim());
  const hasMulti = (k: string) => Array.isArray(answers[k]) && answers[k].length > 0;

  const isStepValid = (): boolean => {
    // Drawn on the last input step of both branches, so it gates both. Checked
    // up front rather than in each of the five step bodies — a per-branch check
    // is one edit away from a flow that submits without consent.
    if (step === 1 && answers['consent'] !== 'Yes') return false;
    if (branch === 'work') {
      if (step === 0) return filled('iAm') && hasMulti('services') && hasMulti('solve');
      return filled('timeline') && filled('budget') && filled('name') && validEmail() && filled('company');
    }
    // category
    if (step === 0) return filled('category');
    // step 1 detail
    if (isTalent)
      return (
        filled('name') &&
        validEmail() &&
        filled('school') &&
        hasMulti('positions') &&
        filled('portfolio')
      );
    if (isCoworking)
      return filled('name') && validEmail() && filled('location') && filled('duration') && filled('teamSize');
    if (isPartnership)
      return filled('name') && validEmail() && filled('company') && filled('role') && filled('partnershipModel');
    // other
    return filled('name') && validEmail() && filled('company') && filled('role') && filled('mind');
  };

  const isLastInputStep = step === 1;

  const submitSurvey = async () => {
    setIsSubmitting(true);
    setError(null);

    const payload: Record<string, string> = {};
    payload['Inquiry Type'] = branch === 'work' ? 'Work with Officience' : `Category inquiry: ${category || ''}`;
    Object.entries(answers).forEach(([key, value]) => {
      if (Array.isArray(value)) payload[key] = value.join(', ');
      else if (value != null && String(value).trim() !== '') payload[key] = String(value);
    });
    payload['company_website'] = honeypot; // honeypot — empty for real users

    try {
      const res = await fetch('/api/survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      focusTitle.current = true;
      setIsCompleted(true);
      onComplete(answers as Record<string, string>);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Something went wrong sending your submission. Please try again, or email us at contact@officience.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (!isStepValid() || isSubmitting) return;
    if (!isLastInputStep) goToStep(step + 1);
    else submitSurvey();
  };

  // ---- step content ----
  const stepHeader = (): { title: string; subtitle: string } => {
    if (branch === 'work') {
      return step === 0
        ? {
            title: 'Business Requirements',
            subtitle: 'Tell us about your business. A great partnership starts with good understanding.',
          }
        : {
            title: 'Timeline, Budget & Contact',
            subtitle: 'Business expectations + contact details. We keep details fully secure.',
          };
    }
    return step === 0
      ? {
          title: 'Category inquiries',
          subtitle: 'What are you looking for? Tell us more so we can point you in the right direction',
        }
      : { title: 'Inquiry Details', subtitle: 'Tell us about yourself. We read every application carefully.' };
  };

  const renderStep = () => {
    if (branch === 'work' && step === 0) {
      return (
        <Panel>
          <div>
            <QLabel id="survey-q-iAm" required>I am a...</QLabel>
            <ChipGroup labelledBy="survey-q-iAm" options={WORK_OPTIONS.iAm} value={answers['iAm']} onChange={(v) => set('iAm', v)} />
          </div>
          <div>
            <QLabel id="survey-q-services" required hint="(Multi-Select)">Service I’m interested in</QLabel>
            {/* Figma 2809:2924 draws Form Input Chips here, not option cards. */}
            <ChipGroup
              labelledBy="survey-q-services"
              options={WORK_OPTIONS.services}
              value={answers['services']}
              onChange={(v) => set('services', v)}
              multi
              columns={2}
            />
          </div>
          <div>
            <QLabel id="survey-q-solve" required hint="(Multi-Select)">What are you trying to solve ?</QLabel>
            <CardOptions
              labelledBy="survey-q-solve"
              options={WORK_OPTIONS.solve}
              value={answers['solve']}
              onChange={(v) => set('solve', v)}
              multi
              columns={2}
            />
          </div>
        </Panel>
      );
    }

    if (branch === 'work' && step === 1) {
      return (
        <Panel>
          <div>
            <QLabel id="survey-q-timeline" required>Timeline</QLabel>
            <ChipGroup labelledBy="survey-q-timeline" options={WORK_OPTIONS.timeline} value={answers['timeline']} onChange={(v) => set('timeline', v)} />
          </div>
          <div>
            <QLabel id="survey-q-budget" required>Budget Expected</QLabel>
            <ChipGroup labelledBy="survey-q-budget" options={WORK_OPTIONS.budget} value={answers['budget']} onChange={(v) => set('budget', v)} />
          </div>
          <div>
            <QLabel>Contact details</QLabel>
            <div className={FIELD_GRID}>
              <TextField label="Name" k="name" placeholder="Full name" required answers={answers} set={set} />
              <TextField label="Work Email" k="email" type="email" placeholder="name@business.com" required error={emailError(answers['email'])} answers={answers} set={set} />
              <TextField label="Company" k="company" placeholder="Organisation name" required answers={answers} set={set} />
              <TextField label="Phone (Optional)" k="phone" type="tel" placeholder="+84...." answers={answers} set={set} />
            </div>
          </div>
          <div>
            <QLabel id="survey-q-notes" gap={8}>Anything else you’d like us to know?</QLabel>
            <TextArea labelledBy="survey-q-notes" placeholder="Tell us about your project requirements..." k="notes" answers={answers} set={set} />
          </div>
        </Panel>
      );
    }

    if (branch === 'category' && step === 0) {
      return (
        <Panel>
          <div>
            <QLabel id="survey-q-category" tall>What bring you here? We will tailor your next questions just for you</QLabel>
            <CardOptions labelledBy="survey-q-category" options={CATEGORY_CARDS} value={answers['category']} onChange={(v) => set('category', v)} columns={1} />
          </div>
        </Panel>
      );
    }

    // category step 1 — detail variants. Every flow labels the name field
    // "Name" with the placeholder "Full name" (3342:2968, 3342:3438,
    // 3342:3568, 3342:3760).
    return (
      <Panel>
        {isTalent && (
          <>
            <div>
              {/* Figma 2818:3259: Heading-H3 24/32, then Body-md, then the fields 12px lower. */}
              <div className="mb-[14px]">
                <h3 className="font-sans font-semibold text-[20px] leading-[28px] text-text-default sm:text-h3 sm:leading-[32px]">Tell us about yourself</h3>
                <p className="font-body font-medium text-[14px] leading-[20px] text-subtitle">We read every application carefully</p>
              </div>
              <div className={FIELD_GRID}>
                <TextField label="Name" k="name" placeholder="Full name" required answers={answers} set={set} />
                <TextField label="Email" k="email" type="email" placeholder="name@domain.com" required error={emailError(answers['email'])} answers={answers} set={set} />
                <TextField label="University / School" k="school" placeholder="e.g. Foreign Trade University, Paris..." required answers={answers} set={set} />
                <TextField label="Expected Graduation" k="graduation" placeholder="e.g. 2027" answers={answers} set={set} />
              </div>
            </div>
            <div>
              <QLabel id="survey-q-positions" required>Position interested in</QLabel>
              <ChipGroup labelledBy="survey-q-positions" options={DETAIL_OPTIONS.positions} value={answers['positions']} onChange={(v) => set('positions', v)} multi />
            </div>
            <div>
              {/* Figma 3342:3038 draws this box with no placeholder. */}
              <QLabel id="survey-q-portfolio" required gap={8}>Portfolio, CV or LinkedIn</QLabel>
              <TextArea labelledBy="survey-q-portfolio" required k="portfolio" answers={answers} set={set} />
            </div>
          </>
        )}

        {isCoworking && (
          <>
            {/* Figma 2818:2122 draws this row with a 16 gap and 424 fields, every
                other frame with 12 and 426. The build uses 12 everywhere. */}
            <div className={FIELD_GRID}>
              <TextField label="Name" k="name" placeholder="Full name" required answers={answers} set={set} />
              <TextField label="Email" k="email" type="email" placeholder="name@domain.com" required error={emailError(answers['email'])} answers={answers} set={set} />
            </div>
            <div>
              <QLabel id="survey-q-location" required>Location</QLabel>
              <ChipGroup labelledBy="survey-q-location" options={DETAIL_OPTIONS.coworkLocation} value={answers['location']} onChange={(v) => set('location', v)} />
            </div>
            <div>
              <QLabel id="survey-q-duration" required>Duration</QLabel>
              <ChipGroup labelledBy="survey-q-duration" options={DETAIL_OPTIONS.coworkDuration} value={answers['duration']} onChange={(v) => set('duration', v)} />
            </div>
            <div>
              <QLabel id="survey-q-teamSize" required>Team size</QLabel>
              <ChipGroup labelledBy="survey-q-teamSize" options={DETAIL_OPTIONS.coworkTeam} value={answers['teamSize']} onChange={(v) => set('teamSize', v)} />
            </div>
          </>
        )}

        {isPartnership && (
          <>
            <div className={FIELD_GRID}>
              <TextField label="Name" k="name" placeholder="Full name" required answers={answers} set={set} />
              <TextField label="Email" k="email" type="email" placeholder="name@domain.com" required error={emailError(answers['email'])} answers={answers} set={set} />
              <TextField label="Company / Org" k="company" placeholder="Company name" required answers={answers} set={set} />
              <TextField label="Role / Job Title" k="role" placeholder="e.g. Partner Representative" required answers={answers} set={set} />
            </div>
            <div>
              <QLabel id="survey-q-partnershipModel" required>What partnership model ?</QLabel>
              <ChipGroup labelledBy="survey-q-partnershipModel" options={DETAIL_OPTIONS.partnershipModel} value={answers['partnershipModel']} onChange={(v) => set('partnershipModel', v)} />
            </div>
          </>
        )}

        {!isTalent && !isCoworking && !isPartnership && (
          <>
            <div className={FIELD_GRID}>
              <TextField label="Name" k="name" placeholder="Full name" required answers={answers} set={set} />
              <TextField label="Email" k="email" type="email" placeholder="name@domain.com" required error={emailError(answers['email'])} answers={answers} set={set} />
              <TextField label="Company / Org" k="company" placeholder="Company name" required answers={answers} set={set} />
              <TextField label="Role / Job Title" k="role" placeholder="e.g. Partner Representative" required answers={answers} set={set} />
            </div>
            <div>
              <QLabel id="survey-q-mind" required gap={8}>What’s on your mind ?</QLabel>
              <TextArea labelledBy="survey-q-mind" required placeholder="Please share any custom ideas, questions, or comments..." k="mind" answers={answers} set={set} />
            </div>
          </>
        )}
      </Panel>
    );
  };

  const { title, subtitle } = stepHeader();
  const progressCurrent = isCompleted ? 2 : step;
  const valid = isStepValid();

  // The complete step has its own copy per branch. Work: frame 2809:2567.
  // Category: frames 2818:2756 / 2828 / 2864 / 2900. Figma writes "competed",
  // "bussiness" and "Summited"; the build writes the correct words.
  const complete =
    branch === 'work'
      ? {
          title: 'Work with Officience',
          heading: 'Transmission completed!',
          message: 'We’ve got your message! Our engager will reach out within 3 business days.',
        }
      : {
          title: `Category inquiries: ${COMPLETE_FLOW_NAME[category ?? ''] ?? category ?? ''}`,
          heading: 'Submitted!',
          message: 'We’ve got your message! We will reach out within 5 days.',
        };

  /* The primary button (2809:3150, 3333:2674): 168 x 56, square corners,
     Shadow/xs, Lexend 500 16/24, a 20px arrow 8px after the label. */
  const primaryBtn =
    'flex h-[56px] w-[168px] shrink-0 items-center justify-center gap-[8px] px-[14px] font-sans text-btn-md shadow-fig-xs transition-colors';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Figma 2818:2756: square corners and a five-layer drop shadow. */}
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        className="relative bg-bg-secondary w-full max-w-[968px] shadow-[0_64px_9px_rgba(24,24,27,0),0_41px_8px_rgba(24,24,27,0.01),0_23px_7px_rgba(24,24,27,0.03),0_10px_5px_rgba(24,24,27,0.05),0_3px_3px_rgba(24,24,27,0.06)] overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Honeypot: hidden from humans; bots that fill it get silently dropped server-side. */}
        <input
          type="text"
          name="company_website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
          style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', opacity: 0 }}
        />

        {/* Header: progress + close. The progress row is 40 tall; the X sits at
            its top, 32px from the top and right edges of the dialog. */}
        <div className="flex items-start justify-between px-[16px] sm:px-[32px] pt-[24px] sm:pt-[32px]">
          <ProgressBar labels={PROGRESS_LABELS[branch]} current={progressCurrent} />
          <button onClick={onClose} aria-label="Close" className="text-text-default hover:text-primary transition-colors shrink-0 p-3 -m-1 sm:p-0 sm:m-0">
            <X size={24} />
          </button>
        </div>

        {/* Body. data-lenis-prevent lets the wheel scroll this panel natively.
            .survey-scroll shows a scrollbar, so the reader knows that more
            questions and the consent line are below (tracker row 15).
            The title starts 32 below the progress row. The white panel ends
            16 above the footer. From sm the scrollbar gutter is always kept
            and the right padding is 22, so the 10px bar plus 22 equals the 32
            of the left side. The panel is then 904 wide with or without a bar. */}
        <div data-lenis-prevent className="survey-scroll px-[16px] sm:pl-[32px] sm:pr-[22px] sm:[scrollbar-gutter:stable] pt-[24px] sm:pt-[32px] pb-[16px] overflow-y-auto">
          {isCompleted ? (
            <div className="flex flex-col gap-[16px]">
              <h2 id={titleId} ref={titleRef} className="font-sans text-h4 text-text-default">
                {complete.title}
              </h2>
              <div className="bg-bg-default p-[20px] flex flex-col gap-[16px]">
                <div className="flex items-center gap-[3px]">
                  <CompleteCheck />
                  <h3 className="font-sans font-semibold text-[24px] leading-[32px] text-text-default">{complete.heading}</h3>
                </div>
                <p className="font-body text-body-md text-text-default">{complete.message}</p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${branch}-${step}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="flex flex-col gap-[16px]"
              >
                {/* Heading-H4 (Lexend 500 20/28), then Body-md #5A5A5A right below it. */}
                <div className="flex flex-col">
                  <h2 id={titleId} ref={titleRef} className="font-sans text-h4 text-text-default">{title}</h2>
                  <p className="font-body text-body-md text-subtitle">{subtitle}</p>
                </div>
                {(() => {
                  const content = renderStep();
                  if (!isLastInputStep || !React.isValidElement(content)) return content;
                  // Every step body returns a <Panel>, and Figma puts the consent
                  // row inside that white card. Appending it to the panel's
                  // children keeps one definition of a required legal control.
                  const el = content as React.ReactElement<{ children?: React.ReactNode }>;
                  return React.cloneElement(
                    el,
                    {},
                    ...React.Children.toArray(el.props.children),
                    <ConsentCheck
                      key="consent"
                      checked={answers['consent'] === 'Yes'}
                      onChange={(v) => set('consent', v ? 'Yes' : '')}
                    />,
                  );
                })()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Error banner */}
        {error && !isCompleted && (
          <div
            role="alert"
            className="mx-[16px] sm:mx-[32px] mb-[8px] flex items-center gap-[8px] rounded-fig-xs border border-[#f5c2cb] bg-[#fff1f3] px-[16px] py-[10px] text-[#b8253e]"
          >
            <AlertCircle size={16} className="shrink-0" />
            <span className="font-body text-[14px] leading-[20px]">{error}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center px-[16px] sm:px-[32px] pb-[24px] sm:pb-[32px]">
          {isCompleted ? (
            <>
              <span />
              <button onClick={onClose} className={`${primaryBtn} bg-primary text-white hover:bg-blue-700`}>
                Close
              </button>
            </>
          ) : (
            <>
              {/* Figma shows no Cancel on the first step — the close X is the way
                  out there — and only draws Back once there is somewhere to go.
                  Back (3333:2574) is 36 tall with 24px side padding, so its label
                  starts 24 in from the panel edge. Below sm it is 48 tall. */}
              {step === 0 ? (
                <span />
              ) : (
                <button
                  onClick={() => goToStep(step - 1)}
                  disabled={isSubmitting}
                  className="inline-flex h-[48px] items-center px-[24px] font-sans text-btn-md text-primary hover:opacity-70 transition-opacity disabled:opacity-50 sm:h-[36px]"
                >
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={!valid || isSubmitting}
                className={`${primaryBtn} ${
                  valid && !isSubmitting
                    ? 'bg-primary text-white hover:bg-blue-700'
                    : 'bg-[#d9d9d9] text-white cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Sending...' : isLastInputStep ? 'Submit' : 'Next step'}
                <ArrowRight size={20} />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Survey;
