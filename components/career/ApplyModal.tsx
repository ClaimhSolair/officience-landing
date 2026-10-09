import React, { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, CircleCheck, Square, SquareCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { APPLY_ROLES, jobBySlug, type ApplyRole } from '../../content/careers/jobs';
import { useModalA11y } from '../../lib/modal';
import { ROUTES } from '../navigation';

/**
 * The Career apply form — Figma 3881:4477 (empty) and 3869:17497 (filled), and
 * the success panel 3869:17432.
 *
 * A 968px panel on BG/Secondary with 32px of padding: the "Apply Form" header,
 * one white panel with the fields, then "Back" and "Submit" under it. Figma
 * draws no close cross; "Back", Escape and the backdrop close the form.
 *
 * - The role chip of the job is selected first (ruling 21g).
 * - The CV is one PDF of 4 MB or less (ruling 21b; Figma says 5 MB, which the
 *   Vercel body limit does not allow). The file is checked when it is chosen,
 *   and again by api/apply.ts.
 * - Submit is grey until every required field is valid, as Figma draws it in
 *   the empty state. It stays clickable: a click on a form that is not ready
 *   shows an error under each invalid field and moves focus to the first one.
 * - The error state is not drawn. The field errors and the line for a failed
 *   send use the house error red.
 * - The entries stay when the visitor closes the form and opens it again for
 *   the same job. Layout clears them after a successful send.
 * - On a short screen the fields scroll inside the panel, and the buttons stay
 *   in view.
 *
 * The field names must match api/apply.ts.
 */

export const MAX_CV_BYTES = 4 * 1024 * 1024;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Tells Layout that the send succeeded, so the next open gets a clean form. */
  onSent: () => void;
  jobSlug?: string;
  backgroundRef: RefObject<HTMLElement>;
}

interface Fields {
  name: string;
  email: string;
  school: string;
  phone: string;
  position: ApplyRole | '';
  linkedin: string;
  location: string;
  notes: string;
  consent: boolean;
}

const EMPTY: Fields = {
  name: '',
  email: '',
  school: '',
  phone: '',
  position: '',
  linkedin: '',
  location: '',
  notes: '',
  consent: false,
};

const LABEL = 'font-sans text-h3 leading-[32px] text-text-default';
const INPUT =
  'w-full rounded-fig-xs border border-border-frame bg-white px-fig-16 font-body text-body-md text-text-default placeholder:text-gray-quiet aria-[invalid=true]:border-err focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30';

const Required = () => (
  <span className="text-sec-500" aria-hidden="true">
    *
  </span>
);

const checkCv = (file: File | null): string => {
  if (!file) return '';
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
  if (!isPdf) return 'The file must be a PDF.';
  if (file.size > MAX_CV_BYTES) return 'The file is too large. The limit is 4 MB.';
  return '';
};

type FieldKey = 'name' | 'email' | 'school' | 'phone' | 'position' | 'location' | 'cv' | 'consent';

/** The order of the fields on screen. Focus goes to the first invalid one. */
const FIELD_ORDER: FieldKey[] = ['name', 'email', 'school', 'phone', 'position', 'location', 'cv', 'consent'];

const findErrors = (f: Fields, cv: File | null, cvError: string): Partial<Record<FieldKey, string>> => {
  const out: Partial<Record<FieldKey, string>> = {};
  const email = f.email.trim();
  if (!f.name.trim()) out.name = 'Enter your full name.';
  if (!email) out.email = 'Enter your email address.';
  else if (!EMAIL_RE.test(email)) out.email = 'Enter a correct email address, for example name@domain.com.';
  if (!f.school.trim()) out.school = 'Enter your university or school.';
  if (!f.phone.trim()) out.phone = 'Enter your phone number.';
  if (!f.position) out.position = 'Select a position.';
  if (!f.location.trim()) out.location = 'Enter your city and country.';
  if (cvError) out.cv = cvError;
  else if (!cv) out.cv = 'Attach your CV as a PDF.';
  if (!f.consent) out.consent = 'Accept the Terms of Use and the Privacy Policy.';
  return out;
};

const ApplyModal: React.FC<ApplyModalProps> = ({ isOpen, onClose, onSent, jobSlug, backgroundRef }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const job = jobBySlug(jobSlug);
  // Layout keys this component per job, and again after each successful send.
  // The component stays mounted while the form is closed, so the entries stay
  // for the next open. No reset effect: a reset after mount would replace the
  // content that the modal hook has just put focus in.
  const [fields, setFields] = useState<Fields>(() => ({ ...EMPTY, position: job?.applyRole ?? '' }));
  const [cv, setCv] = useState<File | null>(null);
  const [cvError, setCvError] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');
  // True after the first click on Submit. From then on, the field errors show
  // and update as the visitor types.
  const [tried, setTried] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useModalA11y({ isOpen, onClose, containerRef: panelRef, backgroundRef });

  // The focused Submit button unmounts when the send succeeds. Move focus to
  // "Close", so a keyboard user does not land on the page body.
  useEffect(() => {
    if (status === 'sent') closeRef.current?.focus({ preventScroll: true });
  }, [status]);

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => setFields((f) => ({ ...f, [k]: v }));

  const errors = findErrors(fields, cv, cvError);
  const valid = Object.keys(errors).length === 0;
  // A field shows its error after the first Submit. A refused file shows at once.
  const shown = (k: FieldKey) => (tried || (k === 'cv' && cvError) ? errors[k] : undefined);
  const errorId = (k: FieldKey) => `${titleId}-${k}-error`;
  const invalidProps = (k: FieldKey) =>
    shown(k) ? { 'aria-invalid': true as const, 'aria-describedby': errorId(k) } : {};
  const fieldError = (k: FieldKey) =>
    shown(k) ? (
      <span id={errorId(k)} data-field-error className="block font-body text-caption leading-[16px] text-err">
        {shown(k)}
      </span>
    ) : null;

  const onCv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    const problem = checkCv(file);
    setCvError(problem);
    setCv(problem ? null : file);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    if (!valid || !cv) {
      setTried(true);
      const first = FIELD_ORDER.find((k) => errors[k]);
      // The selected chip, or the first one, takes focus for the position group.
      const target =
        first === 'position'
          ? formRef.current?.querySelector<HTMLInputElement>('input[name="position"]')
          : formRef.current?.querySelector<HTMLInputElement>(`[name="${first}"]`);
      target?.focus();
      return;
    }
    setStatus('sending');
    setError('');

    const body = new FormData();
    body.append('name', fields.name.trim());
    body.append('email', fields.email.trim());
    body.append('school', fields.school.trim());
    body.append('phone', fields.phone.trim());
    body.append('position', fields.position);
    body.append('linkedin', fields.linkedin.trim());
    body.append('location', fields.location.trim());
    body.append('notes', fields.notes.trim());
    body.append('consent', String(fields.consent));
    if (job) {
      body.append('job', job.slug);
      body.append('jobTitle', job.title);
    }
    body.append('company_website', honeypot);
    body.append('cv', cv, cv.name);

    try {
      const res = await fetch('/api/apply', { method: 'POST', body });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || `Request failed (${res.status})`);
      }
      setStatus('sent');
      onSent();
    } catch (err) {
      console.error('Application error:', err);
      setStatus('idle');
      setError(
        `${err instanceof Error && !/^Request failed/.test(err.message) ? err.message : 'Something went wrong.'} Try again, or email your CV to jobs@officience.com.`,
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-fig-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            ref={panelRef}
            data-probe="apply-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            tabIndex={-1}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            className="relative flex max-h-[calc(100dvh-32px)] w-full max-w-[968px] flex-col bg-bg-secondary p-fig-16 shadow-[0_3px_3px_rgba(24,24,27,0.06),0_10px_5px_rgba(24,24,27,0.05),0_23px_7px_rgba(24,24,27,0.03)] md:p-fig-32"
          >
            {status === 'sent' ? (
              <div className="flex flex-col items-end gap-fig-16">
                <div className="flex w-full flex-col gap-fig-16 bg-white p-fig-20" role="status">
                  <h2 id={titleId} className="flex items-center gap-[3px] font-sans text-h3 leading-[32px] text-text-default">
                    <CircleCheck className="h-[40px] w-[40px] shrink-0 text-[#22B573]" strokeWidth={1.75} aria-hidden="true" />
                    Submitted!
                  </h2>
                  <p className="font-body text-body-md text-text-default">
                    We&apos;ve received your application and we will get back to you within 5 business days.
                  </p>
                </div>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  className="flex h-[56px] w-full items-center justify-center bg-primary font-sans text-btn-md text-white transition-colors hover:bg-[#000086] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary motion-reduce:transition-none md:w-[168px]"
                >
                  Close
                </button>
              </div>
            ) : (
              <form ref={formRef} onSubmit={submit} noValidate className="flex min-h-0 flex-col gap-fig-16">
                {/* Bots fill this hidden field; api/apply.ts drops what they send. */}
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

                {/* data-lenis-prevent lets the wheel scroll this area natively. */}
                <div data-probe="apply-scroll" data-lenis-prevent className="flex min-h-0 flex-col gap-fig-16 overflow-y-auto">
                  <div>
                    <h2 id={titleId} className="font-sans text-h4 text-text-default">
                      Apply Form
                    </h2>
                    <p className="font-body text-body-md text-subtitle">
                      Tell us about yourself. We read every application carefully.
                      {job && <span className="sr-only"> Position: {job.title}.</span>}
                    </p>
                  </div>

                  <div className="flex flex-col gap-fig-32 bg-white p-fig-20">
                    <fieldset className="flex flex-col gap-fig-12">
                      {/* Figma draws the heading and the subtitle in one 54px frame with no gap. */}
                      <legend className="contents">
                        <span className="block pb-fig-6">
                          <span className="block font-sans text-h3 leading-[28px] text-text-default">Tell us about yourself</span>
                          <span className="block font-body text-body-md text-subtitle">We read every application carefully</span>
                        </span>
                      </legend>
                      <div className="grid grid-cols-1 gap-x-fig-12 gap-y-fig-8 md:grid-cols-2">
                        {(
                          [
                            ['name', 'Full Name', 'text', 'Full name', 'name'],
                            ['email', 'Email', 'email', 'name@domain.com', 'email'],
                            ['school', 'University / School', 'text', 'e.g. Foreign Trade University, Paris...', 'organization'],
                            ['phone', 'Phone number', 'tel', '+84', 'tel'],
                          ] as const
                        ).map(([k, label, type, placeholder, auto]) => (
                          <label key={k} data-probe="text-field" className="flex flex-col gap-fig-8">
                            <span className="font-body text-body-md font-bold leading-[22px] text-subtitle">
                              {label} <Required />
                            </span>
                            <input
                              name={k}
                              type={type}
                              required
                              autoComplete={auto}
                              placeholder={placeholder}
                              value={fields[k]}
                              onChange={(e) => set(k, e.target.value)}
                              {...invalidProps(k)}
                              className={`${INPUT} h-[36px]`}
                            />
                            {fieldError(k)}
                          </label>
                        ))}
                      </div>
                    </fieldset>

                    <fieldset className="flex flex-col gap-fig-12" {...invalidProps('position')}>
                      <legend className={`${LABEL} mb-fig-12`}>
                        {/* A no-break space, so the "*" never wraps onto a line of its own at 375. */}
                        Position interested in{' '}<Required />
                      </legend>
                      <div className="flex flex-wrap gap-fig-12">
                        {APPLY_ROLES.map((role) => {
                          const on = fields.position === role;
                          return (
                            <label
                              key={role}
                              className={`flex h-[36px] cursor-pointer items-center rounded-fig-xs border px-fig-12 font-body text-body-md has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary ${
                                on
                                  ? 'border-primary bg-pri-50 font-bold leading-[22px] text-text-primary'
                                  : 'border-border-field bg-white text-subtitle hover:border-primary'
                              }`}
                            >
                              <input
                                type="radio"
                                name="position"
                                value={role}
                                checked={on}
                                onChange={() => set('position', role)}
                                // The visible "*" is hidden from screen readers. The form is
                                // noValidate, so this only tells them the group is required.
                                required
                                className="sr-only"
                              />
                              {role}
                            </label>
                          );
                        })}
                      </div>
                      {fieldError('position')}
                    </fieldset>

                    <label className="flex flex-col gap-fig-8">
                      <span className={LABEL}>LinkedIn URL</span>
                      <input
                        name="linkedin"
                        type="url"
                        inputMode="url"
                        placeholder="https://linkedin.com/in/ ..."
                        value={fields.linkedin}
                        onChange={(e) => set('linkedin', e.target.value)}
                        autoComplete="url"
                        className={`${INPUT} h-[43px]`}
                      />
                    </label>

                    <label className="flex flex-col gap-fig-8">
                      <span className={LABEL}>
                        Where are you located? <Required />
                      </span>
                      <input
                        name="location"
                        type="text"
                        required
                        autoComplete="address-level2"
                        placeholder="City, Country"
                        value={fields.location}
                        onChange={(e) => set('location', e.target.value)}
                        {...invalidProps('location')}
                        className={`${INPUT} h-[50px]`}
                      />
                      {fieldError('location')}
                    </label>

                    <div className="flex flex-col gap-fig-20">
                      <label htmlFor={`${titleId}-cv`} className={LABEL}>
                        Attach CV or Portfolio <Required />
                      </label>
                      <div className="flex flex-col gap-fig-6">
                        <label className="flex h-[50px] cursor-pointer items-center gap-fig-12 rounded-fig-xs border border-border-frame bg-white pl-fig-16 pr-fig-16 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary md:pr-[50px]">
                          <input
                            id={`${titleId}-cv`}
                            name="cv"
                            type="file"
                            accept="application/pdf,.pdf"
                            required
                            onChange={onCv}
                            aria-describedby={shown('cv') ? `${titleId}-cv-help ${errorId('cv')}` : `${titleId}-cv-help`}
                            aria-invalid={shown('cv') ? true : undefined}
                            className="sr-only"
                          />
                          <span className="shrink-0 rounded-fig-xs border border-border-field px-[5px] py-fig-2 font-body text-body-md text-gray-quiet">
                            Choose File
                          </span>
                          <span className={`truncate font-body text-body-md ${cv ? 'text-text-default' : 'text-gray-quiet'}`}>
                            {cv ? cv.name : 'No file chosen'}
                          </span>
                        </label>
                        <p id={`${titleId}-cv-help`} className="font-body text-caption leading-[16px] text-gray-quiet">
                          File upload PDF · Max 4MB
                        </p>
                        {/* role="alert" reads a refused file at once. */}
                        {shown('cv') && (
                          <p id={errorId('cv')} data-probe="cv-error" data-field-error role="alert" className="font-body text-body-md text-err">
                            {shown('cv')}
                          </p>
                        )}
                      </div>
                    </div>

                    <label className="flex flex-col gap-fig-8">
                      <span className={LABEL}>Additional information</span>
                      <textarea
                        name="notes"
                        rows={3}
                        placeholder="Write here"
                        value={fields.notes}
                        onChange={(e) => set('notes', e.target.value)}
                        className={`${INPUT} h-[87px] resize-none py-fig-12`}
                      />
                    </label>

                    <div className="flex flex-col gap-fig-6">
                      <label className="flex cursor-pointer items-start gap-fig-8 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-primary">
                        <input
                          name="consent"
                          type="checkbox"
                          checked={fields.consent}
                          onChange={(e) => set('consent', e.target.checked)}
                          required
                          {...invalidProps('consent')}
                          className="sr-only"
                        />
                        {fields.consent ? (
                          <SquareCheck className="h-[24px] w-[24px] shrink-0 text-primary" strokeWidth={1.75} aria-hidden="true" />
                        ) : (
                          // The box edge needs 3:1 against white (WCAG 1.4.11). #A0A0A0 gives 2.61:1.
                          <Square className="h-[24px] w-[24px] shrink-0 text-gray-quiet" strokeWidth={1.75} aria-hidden="true" />
                        )}
                        <span className="font-body text-body-md text-subtitle">
                          I confirm that I have read and accepted the{' '}
                          <Link to={ROUTES.terms} target="_blank" className="text-text-primary underline">
                            Terms of Use
                          </Link>{' '}
                          and{' '}
                          <Link to={ROUTES.privacy} target="_blank" className="text-text-primary underline">
                            Privacy Policy
                          </Link>{' '}
                          of Officience.
                        </span>
                      </label>
                      {fieldError('consent')}
                    </div>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="font-body text-body-md text-err">
                    {error}
                  </p>
                )}

                <div className="flex shrink-0 items-center justify-between gap-fig-16">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex h-[36px] items-center px-fig-24 font-sans text-btn-md text-text-primary hover:bg-pri-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    Back
                  </button>
                  {/* Not `disabled`: a click on a form that is not ready shows the
                      field errors. aria-disabled tells assistive tech that the
                      form is not ready yet. */}
                  <button
                    type="submit"
                    data-probe="apply-submit"
                    data-ready={valid}
                    aria-disabled={!valid || undefined}
                    disabled={status === 'sending'}
                    className={`flex h-[56px] w-[168px] items-center justify-center gap-fig-8 font-sans text-btn-md text-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait motion-reduce:transition-none ${
                      valid ? 'bg-primary hover:bg-[#000086]' : 'bg-gray-fig-100'
                    }`}
                  >
                    {status === 'sending' ? 'Sending…' : 'Submit'}
                    <ArrowRight className="h-[20px] w-[20px] shrink-0" strokeWidth={2} aria-hidden="true" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ApplyModal;
