// Vercel Edge Function: receives a survey submission (text fields + optional PDF CV),
// and emails it to the Officience team via Resend, with the CV attached.
//
// Required env var (set in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY   — your Resend API key
// Optional overrides:
//   SURVEY_TO   — primary recipient(s), comma-separated (default below)
//   SURVEY_CC   — CC recipients, comma-separated (default below)
//   RESEND_FROM — verified sender, e.g. "Officience Website <website@officience.com>"
//                 (falls back to Resend's test sender, which only delivers to the
//                  Resend account owner until you verify a domain)

export const config = { runtime: 'edge' };

const DEFAULT_TO = 'duykhang.le@officience.com';
const DEFAULT_CC =
  'huycanh.duong@officience.com,steven.duyminhnguyen@officience.com,tructien.ho@officience.com,thanhlong.le@officience.com,minhquyen.tranha@officience.com,quynhnhu.trannguyen@officience.com';
const DEFAULT_FROM = 'Officience Website <onboarding@resend.dev>';

const MAX_FILE_BYTES = 4 * 1024 * 1024; // keep within Vercel Edge request body limits

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

// Chunked base64 encode (avoids call-stack blowups on larger files; no Buffer in Edge).
function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

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

  const fields = new Map<string, string>();
  let file: File | null = null;
  for (const [key, value] of form.entries()) {
    if (value instanceof File) {
      if (key === 'cv' && value.size > 0) file = value;
    } else if (String(value).trim() !== '') {
      fields.set(key, String(value));
    }
  }

  if (file && file.size > MAX_FILE_BYTES) {
    return json({ error: 'CV file is too large (max 4 MB).' }, 413);
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
    <p style="margin:16px 0 0;color:#5a5a5a;">${
      file ? 'CV is attached to this email.' : 'No CV was attached.'
    }</p>
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
  if (file) {
    payload.attachments = [
      { filename: file.name || 'cv.pdf', content: toBase64(await file.arrayBuffer()) },
    ];
  }

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
