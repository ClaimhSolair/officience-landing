// Vercel Edge Function: receives a survey submission (text fields only) and emails it
// to the Officience team via Resend. Candidates share a CV/portfolio as links (LinkedIn,
// GitHub, etc.) in the "portfolio" field — no file uploads are accepted.
//
// Abuse hardening (all server-side, zero external dependency):
//   - Origin allowlist  — rejects POSTs that don't come from the site.
//   - Honeypot          — a hidden form field; if filled, we fake success and drop it.
//   - Rate limit        — best-effort per-IP throttle (in-memory, per-instance).
//
// Required env var (set in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY   — your Resend API key
// Optional overrides:
//   SURVEY_TO   — primary recipient(s), comma-separated (default below)
//   SURVEY_CC   — CC recipients, comma-separated (default below)
//   RESEND_FROM — verified sender, e.g. "Officience Website <website@notify.officience.com>"
//                 (falls back to Resend's test sender, which only delivers to the
//                  Resend account owner until you verify a domain)
//
// Going live (one-time, done out-of-band — makes mail actually reach the team's inbox):
//   DNS for officience.com is managed at OVH (nameservers ns/dns200.anycast.me) — NOT
//   Cloudflare (R2/images) and NOT Vercel (website hosting). The records below go in OVH.
//   The "notify." subdomain isolates this from the existing Google Workspace email on the
//   root domain, so that mail setup stays untouched.
//   1. Resend → Domains → add "notify.officience.com". Resend lists the exact DNS rows
//      (Type / Name / Value) for SPF, DKIM, and DMARC — don't invent them, copy them.
//   2. OVH → DNS Zone for officience.com → add each row Resend gave you, e.g.:
//        TXT  send.notify              (SPF)
//        TXT/CNAME  resend._domainkey.notify  (DKIM)
//        MX   send.notify              (bounce handling — value from Resend)
//        TXT  _dmarc.notify            (DMARC)
//      Use the precise Name/Value Resend shows; the names above are illustrative.
//   3. Back in Resend, click Verify and wait for the domain to show "Verified".
//   4. In Vercel, set RESEND_FROM to the notify.officience.com address (and confirm
//      RESEND_API_KEY is set), then redeploy.

export const config = { runtime: 'edge' };

// Honeypot field name — must match the hidden input rendered in components/Survey.tsx.
const HONEYPOT_FIELD = 'company_website';

// Allowed request origins. Foreign origins are rejected before any work is done.
const ALLOWED_ORIGINS = [
  'https://officience.com',
  'https://www.officience.com',
];
// Vercel preview/deploy origins (e.g. *.vercel.app) are also allowed.
const isAllowedOrigin = (origin: string | null): boolean => {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  try {
    return new URL(origin).hostname.endsWith('.vercel.app');
  } catch {
    return false;
  }
};

// Best-effort in-memory rate limit. Per-instance and ephemeral on Edge (instances are
// distributed and recycled), so it won't stop a determined attacker hitting many regions —
// it pairs with the honeypot + origin check to blunt typical floods. Swap in a durable store
// (e.g. Upstash) here if abuse shows up.
const RATE_LIMIT_MAX = 5; // requests…
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // …per 10 minutes, per IP
const hits = new Map<string, { count: number; resetAt: number }>();

const clientIp = (req: Request): string => {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip')?.trim() || 'unknown';
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

const DEFAULT_TO = 'duykhang.le@officience.com';
const DEFAULT_CC =
  'huycanh.duong@officience.com,steven.duyminhnguyen@officience.com,tructien.ho@officience.com,thanhlong.le@officience.com,minhquyen.tranha@officience.com,quynhnhu.trannguyen@officience.com';
const DEFAULT_FROM = 'Officience Website <onboarding@resend.dev>';

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

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  // Origin allowlist — drop cross-site / direct-to-API bots before any work.
  if (!isAllowedOrigin(req.headers.get('origin'))) {
    return json({ error: 'Forbidden' }, 403);
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('RESEND_API_KEY is not set');
    return json({ error: 'Email service not configured' }, 500);
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json({ error: 'Invalid form data' }, 400);
  }

  // Honeypot: bots fill this hidden field; humans never see it. If present, fake success
  // (200) and silently drop the submission so bots get no signal.
  if (String(form.get(HONEYPOT_FIELD) || '').trim() !== '') {
    return json({ ok: true }, 200);
  }

  // Best-effort per-IP rate limit (see note above).
  if (rateLimited(clientIp(req), Date.now())) {
    return json({ error: 'Too many submissions. Please try again later.' }, 429);
  }

  const fields = new Map<string, string>();
  for (const [key, value] of form.entries()) {
    if (key === HONEYPOT_FIELD) continue; // never email the honeypot
    if (!(value instanceof File) && String(value).trim() !== '') {
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

  const to = (process.env.SURVEY_TO || DEFAULT_TO).split(',').map((s) => s.trim()).filter(Boolean);
  const cc = (process.env.SURVEY_CC || DEFAULT_CC).split(',').map((s) => s.trim()).filter(Boolean);
  const from = process.env.RESEND_FROM || DEFAULT_FROM;

  const payload: Record<string, unknown> = {
    from,
    to,
    cc,
    subject: `New survey: ${inquiry}`,
    html,
  };
  if (candidateEmail) payload.reply_to = candidateEmail;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error('Resend error', res.status, detail);
      return json({ error: 'Failed to send email' }, 502);
    }
  } catch (err) {
    console.error('Resend request failed', err);
    return json({ error: 'Failed to send email' }, 502);
  }

  return json({ ok: true }, 200);
}
