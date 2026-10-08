# Deltacon Security Group: website

Marketing website and admin area for **Deltacon Security Group**, a licensed private
security company in Sugar Land, Texas.

- **Public site:** services, industries, training courses, about, blog, gallery,
  a security self-assessment, and three forms (Request Service, Apply Now,
  training enquiries).
- **Admin area** (`/admin`): dashboard, submissions inbox with CSV export, blog
  editor, gallery manager, and admin user management.

Built with Next.js 16 (App Router, TypeScript), Tailwind CSS 4, shadcn/ui,
Supabase (Postgres, Storage, Auth), Drizzle ORM, Zod, TipTap, Resend and
Cloudflare Turnstile. Hosted on Vercel.

---

## Contents

1. [Run it locally](#run-it-locally)
2. [Environment variables](#environment-variables)
3. [Set up Supabase](#set-up-supabase)
4. [Deploy to Vercel](#deploy-to-vercel)
5. [Using the admin area](#using-the-admin-area)
6. [Tests](#tests)
7. [How it's built](#how-its-built)
8. [Security](#security)
9. [Editing site content](#editing-site-content)
10. [Troubleshooting](#troubleshooting)

---

## Run it locally

Requirements: **Node.js 20.9 or newer** (22 LTS recommended) and npm.

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

On Windows PowerShell use `Copy-Item .env.example .env.local`. If PowerShell
blocks `npm`, run `npm.cmd run dev` instead, or allow scripts once with
`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.

If `.env.local` is missing in development, the site still runs with stand-in
values and prints a warning. Pages work, but saving forms, email and sign-in
don't.

### Commands

| Command                                                                | What it does                                               |
| ---------------------------------------------------------------------- | ---------------------------------------------------------- |
| `npm run dev`                                                          | Development server on port 3000                            |
| `npm run build` / `npm start`                                          | Production build / run it                                  |
| `npm run lint`                                                         | ESLint                                                     |
| `npm run typecheck`                                                    | TypeScript check (also generates route types)              |
| `npm run format`                                                       | Format every file with Prettier                            |
| `npm test`                                                             | Unit tests (Vitest), about 5 seconds, no network needed    |
| `npm run test:e2e`                                                     | Browser tests (Playwright) against a real Supabase project |
| `npm run test:e2e:report`                                              | Open the report from the last browser test run             |
| `npm run db:migrate`                                                   | Apply the database migrations in `/drizzle`                |
| `npm run db:seed`                                                      | Add default settings, gallery categories and blog tags     |
| `npm run admin:create -- --email you@deltacon1.com --name "Full Name"` | Create an admin account (prints a temporary password)      |

---

## Environment variables

Every variable is listed, with where to find it, in
[`.env.example`](.env.example). `NEXT_PUBLIC_` variables are visible in the
browser; all others are server-only secrets and must never be shared.
Production builds stop with a clear message if a variable is missing or
malformed.

| Variable                               | Where it comes from                                                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | The live address, e.g. `https://deltacon1.com`. Used for canonical links, the sitemap, share links and email links. |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase → Project Settings → API → Project URL (`https://<ref>.supabase.co`)                                       |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Project Settings → API keys → publishable key                                                            |
| `DATABASE_URL`                         | Supabase → Connect → **Transaction pooler** (port 6543). Used by the website.                                       |
| `DATABASE_DIRECT_URL`                  | Supabase → Connect → **Session pooler** (port 5432). Used by migrations, scripts and tests.                         |
| `SUPABASE_SECRET_KEY`                  | Supabase → Project Settings → API keys → secret key                                                                 |
| `RESEND_API_KEY`                       | Resend → API Keys                                                                                                   |
| `EMAIL_FROM_ADDRESS`                   | `Deltacon Security Group <noreply@deltacon1.com>` (the domain must be verified in Resend)                           |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`       | Cloudflare → Turnstile → your widget → site key                                                                     |
| `TURNSTILE_SECRET_KEY`                 | Cloudflare → Turnstile → your widget → secret key                                                                   |
| `IP_HASH_SECRET`                       | Random, 32+ characters. Visitor IP addresses are stored only as a hash made with it.                                |
| `CRON_SECRET`                          | Random, 16+ characters. Reserved for scheduled jobs.                                                                |

Generate the two random secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Cloudflare's always-pass test keys (`1x00000000000000000000AA` and
`1x0000000000000000000000000000000AA`) are handy for local development. Never
use them in production.

---

## Set up Supabase

1. Create a project (the current one is in **us-west-1**; `vercel.json` keeps
   Vercel's functions nearby in `sfo1`).
2. Fill in `.env.local` as described above.
3. Run `npm run db:migrate`. This creates the tables, the Row Level Security
   rules and the two storage buckets:
   - `site-media` (public): blog and gallery images
   - `cv-uploads` (private): applicants' CVs
4. Run `npm run db:seed` to add the default settings, gallery categories and blog
   tags. Form notifications go to the company email (`info@deltacon1.com`) by
   default.
5. Create the first admin:
   `npm run admin:create -- --email you@deltacon1.com --name "Your Name"`.
   Sign in at `/admin/login` with the temporary password it prints, then change
   it under **My account**. Further admins can be invited from **Admin users**.
6. In Supabase → Authentication → Sign In / Providers, **turn off "Allow new
   users to sign up"**. Admins are only ever created by invitation.
7. In Supabase → Authentication → URL Configuration, set the Site URL to the
   live address.

---

## Deploy to Vercel

1. Import the GitHub repository in Vercel (framework: Next.js, no other settings).
2. In **Project → Settings → Environment Variables**, add every variable from
   `.env.example` with its real value. Set `NEXT_PUBLIC_SITE_URL` to the live
   domain.
3. Deploy. **After changing any environment variable, redeploy** so the change
   takes effect.
4. Once the domain is live, submit `https://<domain>/sitemap.xml` in Google
   Search Console.

Preview deployments tell search engines not to index them (see
`src/app/robots.ts`), so they never compete with the live site.

---

## Using the admin area

| Section         | What you can do                                                                                                                                                                                   |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Dashboard**   | New submissions per form, the last 30 days, and recent submissions and posts.                                                                                                                     |
| **Submissions** | Filter by form, status and search; open a submission to change its status, add internal notes, download the CV or delete it. **Export CSV** downloads what the inbox is currently showing.        |
| **Posts**       | Write posts with the editor (headings, lists, links, images, YouTube). Drafts save automatically. Publish now, schedule for later, unpublish or delete. Changes appear on the site straight away. |
| **Gallery**     | Upload up to 20 photos at once (each needs a short description), set captions and categories, rearrange the order, and edit or delete photos.                                                     |
| **Admin users** | Invite or remove admins.                                                                                                                                                                          |
| **My account**  | See your details and change your password.                                                                                                                                                        |

Form notifications go to the address in the `admin_settings` table
(`notification_email`). Until a Settings page is added, change it in the
Supabase table editor.

---

## Tests

### Unit tests: `npm test`

128 tests in `tests/unit`. They check the rules and helpers on their own, with
fake settings and no network:

- form validation, including phone numbers, CV file types and sizes, and start dates
- the blog HTML cleaner (scripts, `javascript:` links and outside images are removed)
- CSV export (Excel formula injection is neutralised)
- self-assessment scoring
- CV upload tickets (forged or expired tickets are refused)
- photo checks (fake images and oversized "decompression bomb" files are refused)
- security headers, structured data and environment checks

### Browser tests: `npm run test:e2e`

These are in `tests/end-to-end`. They build the site, run it on
<http://localhost:3100>, and use Chrome to click through it as a visitor and as
an admin:

- **Every page in the sitemap** loads without errors or blocked content and
  passes an automated **WCAG 2.1 AA** accessibility check (axe-core).
- **Navigation:** the menu, the skip link, the phone menu, no sideways
  scrolling on phones, and the 404 page.
- **Forms:** all three forms are submitted for real and checked in the database,
  including a CV upload. They also check the validation messages, and that a
  CV that isn't a PDF or Word file is refused.
- **Self-assessment:** scoring, the Back button, and booking a site survey with
  the pre-filled message.
- **Admin:**
  - sign-in, including a wrong password
  - write → publish → view on the blog → delete a post
  - work a submission: status, note, CSV export, delete
  - upload → view → delete a gallery photo

Before the first run, install the browser once:

```bash
npx playwright install chromium
```

**Important:** the browser tests use the Supabase project in `.env.local`,
because that's the only database. To keep that safe:

- A temporary admin account is created at the start and deleted at the end.
- Everything they create is labelled (`e2e-…@example.com` emails, `e2e-…`
  post addresses, photo descriptions starting with "E2E"). It's all deleted at
  the end, and again at the start of the next run if a run was interrupted.
- The test server uses Cloudflare's test keys and a deliberately invalid
  Resend key, so **no emails are sent** to the company inbox or anyone else.

For extra peace of mind, point `.env.local` at a separate Supabase project for
testing.

---

## How it's built

```
src/
  app/(site)/            Public pages
  app/admin/             Admin area: (auth) sign-in pages, (dashboard) signed-in pages
  app/sitemap.ts, robots.ts, opengraph-image.tsx   Search engine files and share picture
  components/            Layout, page sections, forms, admin and blog components (+ shadcn/ui)
  config/                Editable content: services, industries, courses, company details…
  lib/                   Database schema, validation rules, email, SEO, security headers
  server/actions/        Server actions: public forms and admin changes
  server/queries/        Data reads (cached for public pages)
  proxy.ts               Sends signed-out visitors away from /admin (Next.js 16's "middleware")
drizzle/                 SQL migrations, including Row Level Security rules
scripts/                 Seeding and admin creation
tests/unit/              Vitest unit tests
tests/end-to-end/        Playwright browser tests
```

**Pages are fast and cheap to serve.** Public pages are built ahead of time and
refreshed in the background:

- The blog refreshes every 5 minutes.
- The home page refreshes every 15 minutes.
- Publishing a post or changing the gallery refreshes the affected pages
  immediately.
- A scheduled post appears on its own within about 5 minutes of its publish time.

**Images:**

- Uploaded images go to Supabase Storage, and `next/image` serves them resized
  (AVIF/WebP).
- The home page hero video is served from jsDelivr (`src/config/hero-video.ts`).
- Fonts are self-hosted.

---

## Security

- **Admin access is checked three times:**
  1. The proxy turns away anyone signed out.
  2. Every admin page and action calls `requireAdmin()`.
  3. The database's Row Level Security only lets admins read or change private
     data.
- **There is no public sign-up.** Invite and password-reset links only work
  after pressing a button, so email link scanners can't use them up.
- **Forms** are checked twice, in the browser and on the server, with the same
  Zod rules. Spam protection:
  - Cloudflare Turnstile
  - a hidden honeypot field
  - a limit of 5 submissions per form per 10 minutes for each visitor

  IP addresses are stored only as a keyed hash.

- **CVs:**
  - They're uploaded straight to a private bucket through one-time links.
  - The server checks each file's real contents (not just its name), and
    deletes anything that isn't a genuine PDF or Word file.
  - Admins download CVs through links that expire after 60 seconds.
- **Blog content** is rebuilt and cleaned on the server through an allowlist.
  Only the site's own images and YouTube embeds are allowed.
- **Gallery photos** are opened and measured on the server, and anything that
  isn't a real image is deleted.
- **CSV exports** neutralise anything that would run as a spreadsheet formula.
- **Security headers** (`src/lib/security/security-headers.ts`):
  - a Content Security Policy that allows only Supabase, Cloudflare Turnstile,
    jsDelivr and YouTube
  - HSTS, no framing by other sites, `nosniff`, a strict referrer policy, and
    camera, microphone and location access turned off

  Inline scripts are allowed so that pages can stay pre-built and cached.

---

## Editing site content

Most text and lists live in `src/config/` and can be edited without touching
page code:

| File                                   | Controls                                                 |
| -------------------------------------- | -------------------------------------------------------- |
| `company-details.ts`                   | Name, slogan, phone, email, office address, social links |
| `services.ts`, `industries.ts`         | Service and industry pages                               |
| `training-courses.ts`                  | Academies, courses and the licensing pathway             |
| `about-content.ts`                     | About page text and the statistics band                  |
| `affiliations.ts`                      | Recognitions and affiliations logos                      |
| `security-assessment.ts`               | Self-assessment questions, scores and advice             |
| `navigation.ts`, `admin-navigation.ts` | Site and admin menus                                     |
| `hero-video.ts`                        | Home page video address                                  |

Social links still point at the bare facebook.com, instagram.com and similar
home pages. Replace them with the real profile addresses in
`company-details.ts`. They're left out of search-engine data until then.

---

## Troubleshooting

| Problem                                            | Fix                                                                                                                                                                       |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build fails with "Invalid … environment variables" | A variable is missing or malformed; the message names it. Add it in Vercel and redeploy.                                                                                  |
| Forms say the security check failed                | The Turnstile site key and secret key must come from the same widget, and the live domain must be added to that widget in Cloudflare.                                     |
| No notification emails arrive                      | Check the Resend dashboard's logs, that `deltacon1.com` is still verified, and `admin_settings.notification_email`. Submissions are always saved in the inbox either way. |
| Uploaded images don't show                         | `NEXT_PUBLIC_SUPABASE_URL` must be the project URL (`https://<ref>.supabase.co`), then redeploy.                                                                          |
| "read ECONNRESET" while testing locally            | The connection to Supabase dropped (often on mobile hotspots). Run the command again.                                                                                     |
| A browser test run was interrupted                 | Just run `npm run test:e2e` again. It removes the leftovers first.                                                                                                        |
