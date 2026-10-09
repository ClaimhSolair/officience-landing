// Node harness for api/apply.ts. The function does not run under Vite, so this
// is the local proof of the multipart path before any UI uses it.
//
// Run from the worktree root:
//   node scripts/probe/apply-harness.mjs
//
// It builds real multipart bodies with the platform FormData, replays them
// through a stream the way Vercel does (`req.on('data')`), and swaps the SMTP
// transport for a stub that records the mail.

import { Readable } from 'node:stream';

const { createHandler, MAX_FILE_BYTES } = await import('../../api/apply.ts');

process.env.SMTP_USER = 'contact@officience.com';
process.env.SMTP_PASS = 'test-only';

const PDF = (bytes) => {
  const head = Buffer.from('%PDF-1.4\n');
  return Buffer.concat([head, Buffer.alloc(Math.max(0, bytes - head.length), 0x20)]);
};

const VALID = {
  name: 'Alex Van Daang',
  email: 'alex@example.com',
  school: 'Foreign Trade University',
  phone: '+84 1234 566',
  position: 'Back-end',
  linkedin: 'https://linkedin.com/in/alex',
  location: 'Ho Chi Minh City, Viet Nam',
  notes: 'Hello',
  consent: 'true',
  job: 'senior-php-developer',
  jobTitle: 'Senior PHP Developer',
  company_website: '',
};

let ipSeq = 0;
const call = async ({ fields = VALID, file = PDF(2048), fileName = 'cv.pdf', fileType = 'application/pdf', origin = 'https://officience.com' } = {}) => {
  const fd = new FormData();
  for (const [k, v] of Object.entries(fields)) fd.append(k, v);
  if (file) fd.append('cv', new Blob([file], { type: fileType }), fileName);
  const encoded = new Request('http://local/api/apply', { method: 'POST', body: fd });
  const body = Buffer.from(await encoded.arrayBuffer());
  const req = Readable.from([body]);
  req.method = 'POST';
  ipSeq += 1;
  req.headers = {
    origin,
    'content-type': encoded.headers.get('content-type'),
    'content-length': String(body.length),
    'x-forwarded-for': `10.0.0.${ipSeq}`,
  };
  const res = {
    code: 0,
    payload: null,
    status(c) {
      this.code = c;
      return this;
    },
    json(p) {
      this.payload = p;
      return this;
    },
  };
  const sent = [];
  const handler = createHandler({ makeTransport: () => ({ sendMail: async (m) => sent.push(m) }) });
  await handler(req, res);
  return { code: res.code, payload: res.payload, sent };
};

const cases = [
  ['valid PDF → 200 + 1 attachment to jobs@', async () => {
    const r = await call();
    const m = r.sent[0];
    return r.code === 200 && r.sent.length === 1 && m.to === 'jobs@officience.com' && m.attachments?.length === 1 && m.replyTo === 'alex@example.com' && /Senior PHP Developer/.test(m.subject);
  }],
  ['non-PDF bytes → 400', async () => {
    const r = await call({ file: Buffer.from('just text'), fileName: 'cv.pdf' });
    return r.code === 400 && r.sent.length === 0;
  }],
  ['file over 4 MB (body under 4.5 MB) → 400', async () => {
    const r = await call({ file: PDF(MAX_FILE_BYTES + 100 * 1024) });
    return r.code === 400 && r.sent.length === 0;
  }],
  ['body over 4.5 MB → 413', async () => {
    const r = await call({ file: PDF(4.6 * 1024 * 1024) });
    return r.code === 413 && r.sent.length === 0;
  }],
  ['honeypot filled → fake 200, no mail', async () => {
    const r = await call({ fields: { ...VALID, company_website: 'spam.example' } });
    return r.code === 200 && r.sent.length === 0;
  }],
  ['foreign origin → 403', async () => {
    const r = await call({ origin: 'https://evil.example' });
    return r.code === 403 && r.sent.length === 0;
  }],
  ['no consent → 400', async () => {
    const r = await call({ fields: { ...VALID, consent: '' } });
    return r.code === 400 && r.sent.length === 0;
  }],
  ['missing CV → 400', async () => {
    const r = await call({ file: null });
    return r.code === 400 && r.sent.length === 0;
  }],
  ['HTML in a field is escaped in the mail', async () => {
    const r = await call({ fields: { ...VALID, notes: '<script>x</script>' } });
    return r.code === 200 && !r.sent[0].html.includes('<script>') && r.sent[0].html.includes('&lt;script&gt;');
  }],
];

let pass = 0;
for (const [name, fn] of cases) {
  let ok = false;
  let err = '';
  try {
    ok = await fn();
  } catch (e) {
    err = ` (${e.message})`;
  }
  if (ok) pass += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${err}`);
}
console.log(`${pass}/${cases.length} passed`);
process.exit(pass === cases.length ? 0 : 1);
