import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Check, UploadCloud, AlertCircle } from 'lucide-react';
import type { SurveyBranch } from './Contact';

interface SurveyProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: Record<string, string>) => void;
  initialBranch?: SurveyBranch;
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

const CATEGORY_CARDS: Option[] = [
  { label: 'Internship', desc: 'Join the Offy team as a student or fresh grad' },
  { label: 'Full-time career', desc: "I'm looking for permanent role at Officience" },
  { label: 'Co-working space', desc: 'I need a desk or safe workspace in HCMC or Paris' },
  { label: 'Partnership & referral', desc: "Let's collaborate or referral or strategic partnership" },
  { label: 'Other inquiries', desc: 'Something else general questions' },
];

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
  General: { color: '#5a5a5a', background: '#f7f7f7' },
};

const PROGRESS_LABELS: Record<SurveyBranch, [string, string, string]> = {
  work: ['Requirements', 'Expectations', 'Completed'],
  category: ['Category', 'Detail', 'Completed'],
};

// ---------------------------------------------------------------------------
// PRIMITIVES
// ---------------------------------------------------------------------------
const ProgressBar: React.FC<{ labels: [string, string, string]; current: number }> = ({ labels, current }) => (
  <div className="flex gap-[12px] flex-1">
    {labels.map((label, i) => (
      <div key={label} className="flex-1 flex flex-col gap-[8px]">
        <span
          className={`font-body font-bold text-[10px] leading-[14px] uppercase tracking-[0.04em] ${
            i <= current ? 'text-primary' : 'text-subtitle'
          }`}
        >
          {i + 1}. {label}
        </span>
        <div className={`h-[4px] rounded-full transition-colors ${i <= current ? 'bg-primary' : 'bg-gray-fig-100'}`} />
      </div>
    ))}
  </div>
);

const QLabel: React.FC<{ children: React.ReactNode; required?: boolean; hint?: string }> = ({
  children,
  required,
  hint,
}) => (
  <h4 className="font-sans font-semibold text-[20px] leading-[28px] text-text-default mb-[12px]">
    {children}
    {required && <span className="text-off-red"> *</span>}
    {hint && <span className="font-body font-normal text-[16px] text-subtitle"> {hint}</span>}
  </h4>
);

const ChipGroup: React.FC<{
  options: string[];
  value: any;
  onChange: (v: any) => void;
  multi?: boolean;
}> = ({ options, value, onChange, multi }) => {
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
    <div className="flex flex-wrap gap-[12px]">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`px-[14px] py-[6px] rounded-fig-xs border font-body text-[14px] leading-[20px] transition-colors ${
            selected(opt)
              ? 'border-primary bg-[#ecf4ff] text-primary font-medium'
              : 'border-[#c6c6c6] text-text-default hover:border-primary'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
};

const CardOptions: React.FC<{
  options: Option[];
  value: any;
  onChange: (v: any) => void;
  multi?: boolean;
  columns?: 1 | 2;
}> = ({ options, value, onChange, multi, columns = 1 }) => {
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
    <div className={`grid gap-[12px] ${columns === 2 ? 'sm:grid-cols-2' : 'grid-cols-1'}`}>
      {options.map((opt) => (
        <button
          key={opt.label}
          type="button"
          onClick={() => toggle(opt.label)}
          className={`flex items-center gap-[8px] text-left rounded-fig-xs border px-[16px] py-[10px] transition-colors ${
            selected(opt.label) ? 'border-primary bg-[#ecf4ff]' : 'border-gray-fig-100 hover:border-primary'
          }`}
        >
          {opt.tag && (
            <span
              className="font-body font-bold text-[12px] leading-[22px] px-[6px] rounded-fig-xs shrink-0"
              style={TAG_STYLES[opt.tag]}
            >
              {opt.tag}
            </span>
          )}
          {opt.desc ? (
            <span className="flex flex-col">
              <span className="font-sans font-semibold text-[16px] leading-[24px] text-text-default">{opt.label}</span>
              <span className="font-body text-[14px] leading-[20px] text-subtitle">{opt.desc}</span>
            </span>
          ) : (
            <span className="font-body text-[14px] leading-[20px] text-text-default">{opt.label}</span>
          )}
        </button>
      ))}
    </div>
  );
};

const TextField: React.FC<{
  label: string;
  k: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  answers: Record<string, any>;
  set: (k: string, v: any) => void;
}> = ({ label, k, placeholder, required, type = 'text', answers, set }) => (
  <label className="flex flex-col gap-[6px]">
    <span className="font-body font-bold text-[14px] leading-[20px] text-text-default">
      {label}
      {required && <span className="text-off-red"> *</span>}
    </span>
    <input
      type={type}
      placeholder={placeholder}
      value={answers[k] || ''}
      onChange={(e) => set(k, e.target.value)}
      className="w-full rounded-fig-xs border border-[#c6c6c6] px-[14px] py-[10px] font-body text-[14px] leading-[20px] text-text-default placeholder:text-subtitle focus:outline-none focus:border-primary transition-colors"
    />
  </label>
);

const TextArea: React.FC<{
  placeholder: string;
  k: string;
  rows?: number;
  answers: Record<string, any>;
  set: (k: string, v: any) => void;
}> = ({ placeholder, k, rows = 4, answers, set }) => (
  <textarea
    rows={rows}
    placeholder={placeholder}
    value={answers[k] || ''}
    onChange={(e) => set(k, e.target.value)}
    className="w-full rounded-fig-xs border border-[#c6c6c6] px-[14px] py-[10px] font-body text-[14px] leading-[20px] text-text-default placeholder:text-subtitle focus:outline-none focus:border-primary transition-colors resize-none"
  />
);

// ---------------------------------------------------------------------------
// SURVEY
// ---------------------------------------------------------------------------
const Survey: React.FC<SurveyProps> = ({ isOpen, onClose, onComplete, initialBranch = 'work' }) => {
  const [branch, setBranch] = useState<SurveyBranch>(initialBranch);
  const [step, setStep] = useState(0); // 0 = first input step, 1 = second input step
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [file, setFile] = useState<File | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setBranch(initialBranch);
      setStep(0);
      setAnswers({});
      setFile(null);
      setIsCompleted(false);
      setIsSubmitting(false);
      setError(null);
    }
  }, [isOpen, initialBranch]);

  if (!isOpen) return null;

  const set = (k: string, v: any) => setAnswers((prev) => ({ ...prev, [k]: v }));

  const MAX_CV_BYTES = 4 * 1024 * 1024;
  const handleFile = (f?: File) => {
    if (!f) return;
    if (f.size > MAX_CV_BYTES) {
      setError('Your CV is too large (max 4 MB). Please upload a smaller PDF.');
      return;
    }
    setError(null);
    setFile(f);
  };

  const category = answers['category'] as string | undefined;
  const isTalent = category === 'Internship' || category === 'Full-time career';
  const isCoworking = category === 'Co-working space';
  const isPartnership = category === 'Partnership & referral';

  // ---- validation / gating ----
  const validEmail = (k = 'email') => emailRegex.test(String(answers[k] || ''));
  const filled = (k: string) => Boolean(String(answers[k] || '').trim());
  const hasMulti = (k: string) => Array.isArray(answers[k]) && answers[k].length > 0;

  const isStepValid = (): boolean => {
    if (branch === 'work') {
      if (step === 0) return filled('iAm') && hasMulti('services') && hasMulti('solve');
      return filled('timeline') && filled('budget') && filled('name') && validEmail() && filled('company');
    }
    // category
    if (step === 0) return filled('category');
    // step 1 detail
    if (isTalent)
      return filled('name') && validEmail() && hasMulti('positions') && (Boolean(file) || filled('portfolio'));
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

    const formData = new FormData();
    formData.append('Inquiry Type', branch === 'work' ? 'Work with Officience' : `Category inquiry: ${category || ''}`);
    Object.entries(answers).forEach(([key, value]) => {
      if (Array.isArray(value)) formData.append(key, value.join(', '));
      else if (value != null && String(value).trim() !== '') formData.append(key, String(value));
    });
    if (file) formData.append('cv', file);

    try {
      const res = await fetch('/api/survey', { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
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
    if (!isLastInputStep) setStep((p) => p + 1);
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

  const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="bg-bg-default rounded-fig-xs p-[20px] md:p-[24px] flex flex-col gap-[20px]">{children}</div>
  );

  const renderStep = () => {
    if (branch === 'work' && step === 0) {
      return (
        <Panel>
          <div>
            <QLabel required>1. I am a…</QLabel>
            <ChipGroup options={WORK_OPTIONS.iAm} value={answers['iAm']} onChange={(v) => set('iAm', v)} />
          </div>
          <div>
            <QLabel required hint="(Multi-Select)">2. Service I'm interested in</QLabel>
            <CardOptions
              options={WORK_OPTIONS.services.map((s) => ({ label: s }))}
              value={answers['services']}
              onChange={(v) => set('services', v)}
              multi
              columns={2}
            />
          </div>
          <div>
            <QLabel required hint="(Multi-Select)">3. What are you trying to solve ?</QLabel>
            <CardOptions
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
            <QLabel required>1. Timeline</QLabel>
            <ChipGroup options={WORK_OPTIONS.timeline} value={answers['timeline']} onChange={(v) => set('timeline', v)} />
          </div>
          <div>
            <QLabel required>2. Budget Expected</QLabel>
            <ChipGroup options={WORK_OPTIONS.budget} value={answers['budget']} onChange={(v) => set('budget', v)} />
          </div>
          <div className="flex flex-col gap-[16px]">
            <QLabel>3. Contact details</QLabel>
            <div className="grid sm:grid-cols-2 gap-[16px]">
              <TextField label="Name" k="name" placeholder="Full name" required answers={answers} set={set} />
              <TextField label="Work Email" k="email" type="email" placeholder="name@business.com" required answers={answers} set={set} />
              <TextField label="Company" k="company" placeholder="Organisation name" required answers={answers} set={set} />
              <TextField label="Phone (Optional)" k="phone" type="tel" placeholder="+84...." answers={answers} set={set} />
            </div>
          </div>
          <div>
            <QLabel>Anything else you'd like us to know?</QLabel>
            <TextArea placeholder="Tell us about your project requirements..." k="notes" rows={3} answers={answers} set={set} />
          </div>
        </Panel>
      );
    }

    if (branch === 'category' && step === 0) {
      return (
        <Panel>
          <QLabel>1. What bring you here? We will tailor your next questions just for you</QLabel>
          <CardOptions options={CATEGORY_CARDS} value={answers['category']} onChange={(v) => set('category', v)} columns={1} />
        </Panel>
      );
    }

    // category step 1 — detail variants
    return (
      <Panel>
        {isTalent && (
          <>
            <div>
              <h4 className="font-sans font-semibold text-[20px] leading-[28px] text-text-default">Tell us about yourself</h4>
              <p className="font-body text-[14px] leading-[20px] text-subtitle">We read every application carefully</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-[16px]">
              <TextField label="Full Name" k="name" placeholder="Your full name" required answers={answers} set={set} />
              <TextField label="Email" k="email" type="email" placeholder="name@domain.com" required answers={answers} set={set} />
              <TextField label="University / School" k="school" placeholder="e.g. Foreign Trade University, Paris..." answers={answers} set={set} />
              <TextField label="Expected Graduation" k="graduation" placeholder="e.g. 2027" answers={answers} set={set} />
            </div>
            <div>
              <QLabel required>Position interested in</QLabel>
              <ChipGroup options={DETAIL_OPTIONS.positions} value={answers['positions']} onChange={(v) => set('positions', v)} multi />
            </div>
            <div>
              <QLabel required>Portfolio, CV or LinkedIn</QLabel>
              <div className="grid sm:grid-cols-2 gap-[16px]">
                <label className="flex flex-col items-center justify-center text-center gap-[6px] rounded-fig-xs border border-dashed border-[#c6c6c6] px-[16px] py-[24px] cursor-pointer hover:border-primary transition-colors text-subtitle">
                  <input
                    type="file"
                    accept=".pdf"
                    className="hidden"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                  />
                  <UploadCloud size={20} />
                  <span className="font-body font-bold text-[14px] leading-[20px] text-text-default">
                    {file ? file.name : 'Upload CV (PDF only)'}
                  </span>
                  <span className="font-body text-[12px] leading-[18px]">Drag & drop or click</span>
                  <span className="font-body text-[12px] leading-[18px] text-subtitle/70">PDF, max 4 MB</span>
                </label>
                <TextArea
                  placeholder="Paste your Linkedin, portfolio links, GitHub, or briefly introduce yourself here..."
                  k="portfolio"
                  rows={4}
                  answers={answers}
                  set={set}
                />
              </div>
            </div>
          </>
        )}

        {isCoworking && (
          <>
            <div className="grid sm:grid-cols-2 gap-[16px]">
              <TextField label="Full Name" k="name" placeholder="Your full name" required answers={answers} set={set} />
              <TextField label="Email" k="email" type="email" placeholder="name@domain.com" required answers={answers} set={set} />
            </div>
            <div>
              <QLabel required>Location</QLabel>
              <ChipGroup options={DETAIL_OPTIONS.coworkLocation} value={answers['location']} onChange={(v) => set('location', v)} />
            </div>
            <div>
              <QLabel required>Duration</QLabel>
              <ChipGroup options={DETAIL_OPTIONS.coworkDuration} value={answers['duration']} onChange={(v) => set('duration', v)} />
            </div>
            <div>
              <QLabel required>Team size</QLabel>
              <ChipGroup options={DETAIL_OPTIONS.coworkTeam} value={answers['teamSize']} onChange={(v) => set('teamSize', v)} />
            </div>
          </>
        )}

        {isPartnership && (
          <>
            <div className="grid sm:grid-cols-2 gap-[16px]">
              <TextField label="Full Name" k="name" placeholder="Your full name" required answers={answers} set={set} />
              <TextField label="Email" k="email" type="email" placeholder="name@domain.com" required answers={answers} set={set} />
              <TextField label="Company / Org" k="company" placeholder="Company name" required answers={answers} set={set} />
              <TextField label="Role / Job Title" k="role" placeholder="e.g. Partner Representative" required answers={answers} set={set} />
            </div>
            <div>
              <QLabel required>What partnership model ?</QLabel>
              <ChipGroup options={DETAIL_OPTIONS.partnershipModel} value={answers['partnershipModel']} onChange={(v) => set('partnershipModel', v)} />
            </div>
          </>
        )}

        {!isTalent && !isCoworking && !isPartnership && (
          <>
            <div className="grid sm:grid-cols-2 gap-[16px]">
              <TextField label="Full Name" k="name" placeholder="Your full name" required answers={answers} set={set} />
              <TextField label="Email" k="email" type="email" placeholder="name@domain.com" required answers={answers} set={set} />
              <TextField label="Company / Org" k="company" placeholder="Company name" required answers={answers} set={set} />
              <TextField label="Role / Job Title" k="role" placeholder="e.g. Partner Representative" required answers={answers} set={set} />
            </div>
            <div>
              <QLabel required>What's on your mind ?</QLabel>
              <TextArea placeholder="Please share any custom ideas, questions, or comments..." k="mind" rows={4} answers={answers} set={set} />
            </div>
          </>
        )}
      </Panel>
    );
  };

  const { title, subtitle } = stepHeader();
  const progressCurrent = isCompleted ? 2 : step;
  const valid = isStepValid();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 16 }}
        className="relative bg-bg-secondary w-full max-w-[800px] rounded-fig-m shadow-fig-xs overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header: progress + close */}
        <div className="flex items-start gap-[16px] px-[32px] pt-[32px]">
          <ProgressBar labels={PROGRESS_LABELS[branch]} current={progressCurrent} />
          <button onClick={onClose} aria-label="Close" className="text-text-default hover:text-primary transition-colors shrink-0">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="px-[32px] py-[24px] overflow-y-auto">
          {isCompleted ? (
            <div className="flex flex-col gap-[24px]">
              <h2 className="font-sans font-semibold text-[24px] leading-[32px] text-text-default">
                {branch === 'work' ? 'Work with officience' : 'Category inquiries'}
              </h2>
              <div className="bg-bg-default rounded-fig-xs p-[24px] flex flex-col gap-[12px]">
                <div className="flex items-center gap-[12px]">
                  <span className="w-[32px] h-[32px] rounded-full bg-[#ddf9ec] text-[#146d45] flex items-center justify-center shrink-0">
                    <Check size={20} strokeWidth={3} />
                  </span>
                  <h3 className="font-sans font-bold text-[24px] leading-[32px] text-text-default">Transmission completed!</h3>
                </div>
                <p className="font-body text-[16px] leading-[24px] text-subtitle">
                  We've got your message! Our engager will reach out within 3 business days.
                </p>
              </div>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${branch}-${step}`}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                className="flex flex-col gap-[24px]"
              >
                <div className="flex flex-col gap-[4px]">
                  <h2 className="font-sans font-semibold text-[24px] leading-[32px] text-text-default">{title}</h2>
                  <p className="font-body text-[14px] leading-[20px] text-subtitle">{subtitle}</p>
                </div>
                {renderStep()}
              </motion.div>
            </AnimatePresence>
          )}
        </div>

        {/* Error banner */}
        {error && !isCompleted && (
          <div className="mx-[32px] mb-[8px] flex items-center gap-[8px] rounded-fig-xs border border-[#f5c2cb] bg-[#fff1f3] px-[16px] py-[10px] text-[#b8253e]">
            <AlertCircle size={16} className="shrink-0" />
            <span className="font-body text-[14px] leading-[20px]">{error}</span>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center px-[32px] pb-[32px] pt-[8px]">
          {isCompleted ? (
            <>
              <span />
              <button
                onClick={onClose}
                className="h-[40px] px-[24px] rounded-fig-xs bg-primary text-white font-sans font-medium text-[16px] leading-[24px] hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </>
          ) : (
            <>
              <button
                onClick={step === 0 ? onClose : () => setStep((p) => p - 1)}
                disabled={isSubmitting}
                className="font-sans font-medium text-[16px] leading-[24px] text-primary hover:opacity-70 transition-opacity disabled:opacity-50"
              >
                {step === 0 ? 'Cancel' : 'Back'}
              </button>
              <button
                onClick={handleNext}
                disabled={!valid || isSubmitting}
                className={`h-[40px] px-[24px] rounded-fig-xs font-sans font-medium text-[16px] leading-[24px] flex items-center gap-[8px] transition-colors ${
                  valid && !isSubmitting
                    ? 'bg-primary text-white hover:bg-blue-700'
                    : 'bg-[#d9d9d9] text-white cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Sending...' : isLastInputStep ? 'Submit' : 'Next step'}
                <ArrowRight size={18} />
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Survey;
