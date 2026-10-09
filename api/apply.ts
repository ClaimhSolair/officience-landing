// Vercel Node Function: receives a Career application (multipart form with one
// PDF) and emails it to jobs@officience.com with the PDF attached.
//
// This is the one form on the site that accepts a file (ruling 21j: a
// Career-only exception; the contact survey stays links-only). The PDF is not
// stored anywhere. It goes into the email and nowhere else.
//
// Limits:
//   - Vercel rejects a request body above 4.5 MB, so the file cap is 4 MB
//     (ruling 21b). The multipart framing and the text fields use the rest.
//   - The file must start with the PDF signature "%PDF". The browser's MIME
//     type is not trusted.
//
// The origin allowlist, the honeypot and the rate limit are copies of the ones
// in api/survey.ts. They are copies on purpose: survey.ts is shipped, and it
// cannot run under Vite, so this feature does not refactor it. Extracting a
// shared module is a follow-up.
//
// Same env vars as api/survey.ts: SMTP_USER, SMTP_PASS (required), SMTP_HOST,
// SMTP_PORT, MAIL_FROM (optional). APPLY_TO overrides the recipient.

import { createTransport } from 'nodemailer';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const DEFAULT_TO = 'jobs@officience.com';
const DEFAULT_FROM = 'Officience Website <contact@officience.com>';

export const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_BODY_BYTES = 4.5 * 1024 * 1024;

// Must match the hidden input in components/career/ApplyModal.tsx.
const HONEYPOT_FIELD = 'company_website';

// The fields the form sends. The names must match ApplyModal.tsx.
const REQUIRED = ['name', 'email', 'school', 'phone', 'position', 'location'] as const;
const OPTIONAL = ['linkedin', 'notes', 'job', 'jobTitle'] as const;

const LABELS: Record<string, string> = {
  jobTitle: 'Job',
  name: 'Full name',
  email: 'Email',
  school: 'University / School',
  phone: 'Phone number',
  position: 'Position interested in',
  linkedin: 'LinkedIn URL',
  location: 'Location',
  notes: 'Additional information',
};
const ORDER = ['jobTitle', 'name', 'email', 'phone', 'school', 'position', 'location', 'linkedin', 'notes'];

const ALLOWED_ORIGINS = ['https://officience.com', 'https://www.officience.com'];
const isAllowedOrigin = (origin: string | undefined): boolean => {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    return new URL(origin).hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

// Best-effort, per instance. See the note in api/survey.ts.
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
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

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Reads the raw body. Vercel has already buffered it and replays it through
 * `data`/`end`, so the stream is read that way. Returns null when the body
 * passes the cap.
 */
const readBody = (req: VercelRequest): Promise<Buffer | null> =>
  new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    let over = false;
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) over = true;
      else chunks.push(chunk);
    });
    req.on('end', () => resolve(over ? null : Buffer.concat(chunks)));
    req.on('error', reject);
  });

interface MailTransport {
  sendMail: (mail: {
    from: string;
    to: string;
    replyTo?: string;
    subject: string;
    html: string;
    attachments: { filename: string; content: Buffer; contentType: string }[];
  }) => Promise<unknown>;
}

interface Deps {
  makeTransport: () => MailTransport;
}

export const createHandler = ({ makeTransport }: Deps) =>
  async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method not allowed' });
      return;
    }
    if (!isAllowedOrigin(req.headers.origin)) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP_USER / SMTP_PASS are not set');
      res.status(500).json({ error: 'Email service not configured' });
      return;
    }

    const contentType = String(req.headers['content-type'] ?? '');
    if (!contentType.startsWith('multipart/form-data')) {
      res.status(400).json({ error: 'Invalid request body' });
      return;
    }

    const raw = await readBody(req);
    if (!raw) {
      res.status(413).json({ error: 'The file is too large. The limit is 4 MB.', field: 'cv' });
      return;
    }

    let form: FormData;
    try {
      form = await new Request('http://apply.local/', {
        method: 'POST',
        headers: { 'content-type': contentType },
        body: raw,
      }).formData();
    } catch {
      res.status(400).json({ error: 'Invalid request body' });
      return;
    }

    const text = (k: string) => {
      const v = form.get(k);
      return typeof v === 'string' ? v.trim() : '';
    };

    // Bots fill the hidden field. Fake success so they get no signal.
    if (text(HONEYPOT_FIELD) !== '') {
      res.status(200).json({ ok: true });
      return;
    }
    if (rateLimited(clientIp(req), Date.now())) {
      res.status(429).json({ error: 'Too many submissions. Please try again later.' });
      return;
    }

    for (const k of REQUIRED) {
      if (!text(k)) {
        res.status(400).json({ error: `Missing field: ${LABELS[k] ?? k}`, field: k });
        return;
      }
    }
    if (!EMAIL_RE.test(text('email'))) {
      res.status(400).json({ error: 'The email address is not valid.', field: 'email' });
      return;
    }
    if (text('consent') !== 'true') {
      res.status(400).json({ error: 'Accept the Terms of Use and the Privacy Policy.', field: 'consent' });
      return;
    }

    const cv = form.get('cv');
    if (!cv || typeof cv === 'string') {
      res.status(400).json({ error: 'Attach your CV or portfolio as a PDF.', field: 'cv' });
      return;
    }
    if (cv.size > MAX_FILE_BYTES) {
      res.status(400).json({ error: 'The file is too large. The limit is 4 MB.', field: 'cv' });
      return;
    }
    const bytes = Buffer.from(await cv.arrayBuffer());
    if (bytes.subarray(0, 4).toString('latin1') !== '%PDF') {
      res.status(400).json({ error: 'The file must be a PDF.', field: 'cv' });
      return;
    }

    const fields = new Map<string, string>();
    for (const k of [...REQUIRED, ...OPTIONAL]) if (text(k)) fields.set(k, text(k));

    const rows = ORDER.filter((k) => fields.has(k))
      .map(
        (k) => `<tr>
        <td style="padding:8px 12px;border:1px solid #e5e5e5;background:#f7f7f7;font-weight:600;vertical-align:top;white-space:nowrap;">${escapeHtml(LABELS[k] ?? k)}</td>
        <td style="padding:8px 12px;border:1px solid #e5e5e5;">${escapeHtml(fields.get(k) ?? '')}</td>
      </tr>`,
      )
      .join('');

    const role = fields.get('jobTitle') || fields.get('position') || 'Open application';
    const html = `<div style="font-family:Arial,Helvetica,sans-serif;color:#0f1219;">
    <h2 style="color:#1f49bf;margin:0 0 16px;">New job application</h2>
    <p style="margin:0 0 16px;color:#5a5a5a;">${escapeHtml(role)} — the CV is attached.</p>
    <table style="border-collapse:collapse;font-size:14px;">${rows}</table>
  </div>`;

    // Keep the candidate's file name readable but safe for a mail header.
    const safeName = (cv.name || 'cv.pdf').replace(/[^\w.\- ]+/g, '_').slice(0, 120);
    const filename = safeName.toLowerCase().endsWith('.pdf') ? safeName : `${safeName}.pdf`;

    try {
      await makeTransport().sendMail({
        from: process.env.MAIL_FROM || DEFAULT_FROM,
        to: process.env.APPLY_TO || DEFAULT_TO,
        replyTo: fields.get('email'),
        subject: `Application — ${role} — ${fields.get('name')}`,
        html,
        attachments: [{ filename, content: bytes, contentType: 'application/pdf' }],
      });
    } catch (err) {
      console.error('SMTP send failed', err);
      res.status(502).json({ error: 'Failed to send email' });
      return;
    }

    res.status(200).json({ ok: true });
  };

export default createHandler({
  makeTransport: () => {
    const port = Number(process.env.SMTP_PORT) || 465;
    return createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port,
      secure: port === 465,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
  },
});
