# Survey email setup (Resend)

The contact survey (`components/Survey.tsx`) submits to a Vercel Edge function
(`api/survey.ts`), which emails the submission to the team via **Resend** with the
CV PDF attached. This replaces the old FormSubmit.co integration.

## What you need to do once

### 1. Create a Resend account + API key
1. Sign up at https://resend.com (free tier: 100 emails/day, 3,000/month).
2. Create an **API key** (Dashboard → API Keys → Create).
3. Add it to Vercel: Project → **Settings → Environment Variables**:
   - `RESEND_API_KEY` = `re_...` (your key) — for **Production** (and Preview, if you want previews to send).

### 2. Verify your domain so it can email the whole team
Without a verified domain, Resend only delivers to the **email that owns the Resend
account** (good enough for a first test, not for the team).

To email everyone:
1. Resend → **Domains → Add Domain** → enter `officience.com` (or a subdomain like
   `mail.officience.com`).
2. Add the **DNS records** Resend shows (SPF + DKIM) to your DNS provider. Wait for
   "Verified".
3. Set the sender env var on Vercel:
   - `RESEND_FROM` = `Officience Website <website@officience.com>` (any address at the
     verified domain).

Until `RESEND_FROM` is set, the function uses Resend's test sender
`onboarding@resend.dev`, which only reaches the Resend account owner.

### 3. (Optional) Override recipients without code changes
Defaults are baked into `api/survey.ts`, but you can override via env vars:
- `SURVEY_TO` = comma-separated primary recipients (default: `duykhang.le@officience.com`)
- `SURVEY_CC` = comma-separated CC list (default: the 6 current team addresses)

## How it behaves
- **All** survey submissions (work + every category) go through this one function.
- The email has: an HTML table of every answer, the candidate's address as `reply_to`
  (so HR can reply straight to them), and the **CV PDF attached** when one was uploaded.
- The CV upload is capped at **4 MB** (Vercel Edge request-body limit) — enforced both
  in the UI and the function. Files larger than that are rejected with a clear message.
- On success the user sees the "Transmission completed!" screen; on failure they see an
  error banner and can retry.

## Testing
- **Local UI only:** `npm run dev` exercises the form, but the `/api/survey` function is
  NOT served by Vite, so a real submit returns 404. (The function runs only on Vercel,
  or under `vercel dev`.)
- **Full end-to-end:** after setting `RESEND_API_KEY` (and ideally `RESEND_FROM`), deploy
  a preview (push to `redesign/2026`) or run `vercel dev`, then submit a real
  Internship/Full-time application with a small PDF. Confirm the email arrives in Gmail
  **with the PDF attached** and that Reply goes to the candidate.

## Privacy note
CVs are personal data. They are sent only to your team addresses via Resend (a processor
with an EU region + DPA available) and are **not stored** anywhere by this app — they live
only in the resulting emails. If you later want a durable CV archive, the alternative is
uploading to your Cloudflare R2 bucket and emailing a link instead.
