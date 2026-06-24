# Survey email setup (Google Workspace SMTP)

The contact survey (`components/Survey.tsx`) POSTs the submission as JSON to a Vercel Node
function (`api/survey.ts`), which emails it to **`contact@officience.com`** via **Google
Workspace SMTP**. That mailbox is configured by IT to auto-forward to the relevant teams, who
reply to the visitor directly.

This replaces the earlier Resend integration (IT rejected third-party email senders). Mail now
stays on Officience's own Google infrastructure and needs **no DNS changes** — Google already
handles SPF/DKIM for Workspace mail.

## What you need to do once

### 1. Get the sending mailbox + an app password
1. IT provides the login for **`contact@officience.com`**.
2. On that account, turn on **2-Step Verification**, then generate a **Google App Password**
   (Google Account → Security → App passwords) — a 16-character code. Use this, **not** the
   normal account password (plain-password SMTP login is blocked by Google).
   - If "App passwords" is missing, the Workspace admin has disabled it — ask IT to allow app
     passwords (this is an admin toggle, **not** a DNS/OVH task).

### 2. Set the environment variables on Vercel
Project → **Settings → Environment Variables** (tick **Production** and **Preview**):
- `SMTP_USER` = `contact@officience.com`
- `SMTP_PASS` = the 16-char app password

Optional (defaults are fine, only set to override):
- `SMTP_HOST` = `smtp.gmail.com`
- `SMTP_PORT` = `465` (SSL). Use `587` if 465 is blocked (the function switches to STARTTLS).
- `SURVEY_TO` = `contact@officience.com`
- `MAIL_FROM` = `Officience Website <contact@officience.com>`

Redeploy after setting them (env vars load on the next deploy).

## How it behaves
- **All** survey submissions (work + every category) go through this one function.
- The email is an HTML table of every answer, sent from and to `contact@officience.com`, with the
  visitor's address as **reply-to** so the team can reply straight to them.
- No files are accepted — candidates paste CV/portfolio **links** (LinkedIn, GitHub, etc.).
- Abuse hardening runs server-side: an **origin allowlist** (rejects off-site POSTs), a hidden
  **honeypot** field (silently dropped if filled), and a best-effort per-IP **rate limit**
  (5 / 10 min).
- On success the user sees the "Transmission completed!" screen; on failure an error banner with
  a retry.

## Testing
- **Local UI only:** `npm run dev` exercises the form, but `/api/survey` is **not** served by
  Vite, so a real submit won't send. (The function runs only on Vercel, or under `vercel dev`.)
- **End-to-end:** after setting `SMTP_USER` + `SMTP_PASS`, deploy a preview (push to
  `redesign/2026`) or run `vercel dev`, then submit a real application. Confirm:
  - the email lands in the **`contact@officience.com` inbox**, reply-to = the visitor;
  - IT's **forward rule fires** to the team (a filter scoped to "from: not me" could skip a
    self-addressed message — confirm with IT);
  - a foreign `Origin` is rejected (403), a filled honeypot is silently accepted (200, no mail),
    and >5 submits/10 min from one IP returns 429.

## Privacy note
Submissions are personal data. They travel only between the website (Vercel) and Officience's own
Google Workspace mailbox over authenticated TLS, and are **not stored** anywhere by this app — they
live only in the resulting emails.
