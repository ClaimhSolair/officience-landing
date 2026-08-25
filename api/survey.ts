// Vercel Node Function: receives a survey submission (text fields only) and emails it to
// contact@officience.com via Google Workspace SMTP. Candidates share a CV/portfolio as links
// (LinkedIn, GitHub, etc.) in the "portfolio" field — no file uploads are accepted.
//
// Delivery model: the function logs in to Google Workspace SMTP AS contact@officience.com and
// sends the submission TO a recipient chosen by the survey flow (see CATEGORY_ROUTES): talent
// inquiries → jobs@, co-working → hr@, everything else (incl. Flow 1 "Work with Officience",
// partnership, and other inquiries) → contact@officience.com. Teams reply to the visitor
// directly (the visitor's address is set as reply-to). This keeps mail on Officience's own
// Google infra and needs NO DNS changes (Google handles SPF/DKIM for Workspace mail).
//
// Abuse hardening (all server-side, zero external dependency):
//   - Origin allowlist  — rejects POSTs that don't come from the site.
//   - Honeypot          — a hidden form field; if filled, we fake success and drop it.
//   - Rate limit        — best-effort per-IP throttle (in-memory, per-instance).
//
// Required env vars (Vercel → Project → Settings → Environment Variables):
//   SMTP_USER   — the sending mailbox, i.e. contact@officience.com
//   SMTP_PASS   — a Google App Password (16-char) for that mailbox (NOT the normal password;
//                 the account needs 2-Step Verification on, and the Workspace admin must allow
//                 app passwords)
// Optional overrides (defaults are fine):
//   SMTP_HOST   — default smtp.gmail.com
//   SMTP_PORT   — default 465 (SSL). For 587 (STARTTLS), set 587 (secure becomes false).
//   SURVEY_TO   — fallback recipient for flows not matched by CATEGORY_ROUTES,
//                 default contact@officience.com
//   MAIL_FROM   — From header, default "Officience Website <contact@officience.com>"

import { createTransport } from 'nodemailer';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const DEFAULT_TO = 'contact@officience.com';
const DEFAULT_FROM = 'Officience Website <contact@officience.com>';

// Per-flow recipient routing. Keys MUST match the CATEGORY_CARDS labels in
// components/Survey.tsx (they arrive verbatim in the "category" field). Categories
// not listed here — plus Flow 1 ("Work with Officience") which sends no category —
// fall through to SURVEY_TO / DEFAULT_TO (contact@officience.com).
const CATEGORY_ROUTES: Record<string, string> = {
  Internship: 'jobs@officience.com',
  'Full-time career': 'jobs@officience.com',
  'Co-working space': 'hr@officience.com',
  // 'Partnership & referral' and 'Other inquiries' → default (contact@officience.com)
};

// Honeypot field name — must match the hidden input rendered in components/Survey.tsx.
const HONEYPOT_FIELD = 'company_website';

// Allowed request origins. Foreign origins are rejected before any work is done.
const ALLOWED_ORIGINS = [
  'https://officience.com',
  'https://www.officience.com',
];
// Vercel preview/deploy origins (e.g. *.vercel.app) are also allowed.
const isAllowedOrigin = (origin: string | undefined): boolean => {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    return new URL(origin).hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

// Best-effort in-memory rate limit. Per-instance and ephemeral (instances are recycled), so it
// won't stop a determined attacker hitting many instances — it pairs with the honeypot + origin
// check to blunt typical floods. Swap in a durable store (e.g. Upstash) here if abuse shows up.
const RATE_LIMIT_MAX = 5; // requests…
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // …per 10 minutes, per IP
const hits = new Map<string, { count: number; resetAt: number }>();

const clientIp = (req: VercelRequest): string => {
  const fwd = req.headers['x-forwarded-for'];
  const raw = Array.isArray(fwd) ? fwd[0] : fwd;
  if (raw) return raw.split(',')[0].trim();
  const real = req.headers['x-real-ip'];
  return (Array.isArray(real) ? real[0] : real)?.trim() || 'unknown';
};

const rateLimited = (ip: string, now: number): boolean => {
  const entry = hits.get(ip);
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
};

// Human-readable labels for the email table, keyed by the form field name.
const FIELD_LABELS: Record<string, string> = {
  'Inquiry Type': 'Inquiry Type',
  category: 'Category',
  iAm: 'I am a',
  services: 'Services interested in',
  solve: 'What they want to solve',
  timeline: 'Timeline',
  budget: 'Budget expected',
  name: 'Name',
  email: 'Email',
  company: 'Company / Org',
  role: 'Role / Job title',
  phone: 'Phone',
  school: 'University / School',
  graduation: 'Expected graduation',
  positions: 'Positions interested in',
  portfolio: 'Portfolio / links',
  location: 'Location',
  duration: 'Duration',
  teamSize: 'Team size',
  partnershipModel: 'Partnership model',
  consent: 'Accepted Terms & Privacy',
  notes: 'Additional notes',
  mind: 'Message',
};

// Preferred display order; unknown keys are appended after these.
const FIELD_ORDER = [
  'Inquiry Type',
  'category',
  'name',
  'email',
  'company',
  'role',
  'phone',
  'iAm',
  'services',
  'solve',
  'timeline',
  'budget',
  'school',
  'graduation',
  'positions',
  'portfolio',
  'location',
  'duration',
  'teamSize',
  'partnershipModel',
  'notes',
  'mind',
];

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Origin allowlist — drop cross-site / direct-to-API bots before any work.
  if (!isAllowedOrigin(req.headers.origin)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) {
    console.error('SMTP_USER / SMTP_PASS are not set');
    res.status(500).json({ error: 'Email service not configured' });
    return;
  }

  // Vercel auto-parses a JSON body into req.body; be defensive if it arrives as a string.
  let body: Record<string, unknown>;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body ?? {});
  } catch {
    res.status(400).json({ error: 'Invalid request body' });
    return;
  }

  // Honeypot: bots fill this hidden field; humans never see it. If present, fake success (200)
  // and silently drop the submission so bots get no signal.
  if (String(body[HONEYPOT_FIELD] ?? '').trim() !== '') {
    res.status(200).json({ ok: true });
    return;
  }

  // Best-effort per-IP rate limit (see note above).
  if (rateLimited(clientIp(req), Date.now())) {
    res.status(429).json({ error: 'Too many submissions. Please try again later.' });
    return;
  }

  const fields = new Map<string, string>();
  for (const [key, value] of Object.entries(body)) {
    if (key === HONEYPOT_FIELD) continue; // never email the honeypot
    if (value != null && String(value).trim() !== '') {
      fields.set(key, String(value));
    }
  }

  const inquiry = fields.get('Inquiry Type') || 'Website Survey';
  const candidateEmail = fields.get('email');

  // Build the ordered table rows.
  const orderedKeys = [
    ...FIELD_ORDER.filter((k) => fields.has(k)),
    ...[...fields.keys()].filter((k) => !FIELD_ORDER.includes(k)),
  ];
  const rows = orderedKeys
    .map((k) => {
      const label = FIELD_LABELS[k] || k;
      return `<tr>
        <td style="padding:8px 12px;border:1px solid #e5e5e5;background:#f7f7f7;font-weight:600;vertical-align:top;white-space:nowrap;">${escapeHtml(
          label,
        )}</td>
        <td style="padding:8px 12px;border:1px solid #e5e5e5;">${escapeHtml(fields.get(k) || '')}</td>
      </tr>`;
    })
    .join('');

  const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#0f1219;">
    <h2 style="color:#1f49bf;margin:0 0 16px;">New survey submission</h2>
    <p style="margin:0 0 16px;color:#5a5a5a;">${escapeHtml(inquiry)}</p>
    <table style="border-collapse:collapse;font-size:14px;">${rows}</table>
  </div>`;

  const to = CATEGORY_ROUTES[fields.get('category') ?? ''] || process.env.SURVEY_TO || DEFAULT_TO;
  const from = process.env.MAIL_FROM || DEFAULT_FROM;
  const port = Number(process.env.SMTP_PORT) || 465;

  const transporter = createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port,
    secure: port === 465, // 465 = SSL; 587 = STARTTLS
    auth: { user, pass },
  });

  try {
    await transporter.sendMail({
      from,
      to,
      replyTo: candidateEmail || undefined,
      subject: `New survey: ${inquiry}`,
      html,
    });
  } catch (err) {
    console.error('SMTP send failed', err);
    res.status(502).json({ error: 'Failed to send email' });
    return;
  }

  res.status(200).json({ ok: true });
}
