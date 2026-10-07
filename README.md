# Deltacon Security — website

Marketing website and admin area for **Deltacon Security**, a licensed private
security company in Texas.

Built with Next.js 16 (App Router, TypeScript), Tailwind CSS 4 and shadcn/ui,
Supabase (Postgres, Storage, Auth), Drizzle ORM, Zod, Resend and Cloudflare
Turnstile. Deployed on Vercel.

> **Status:** the public website and the three forms are built. The admin area
> (sign-in, dashboard, blog editor, submissions inbox, gallery manager) is in
> progress. A full setup guide will be added when the build is complete.

---

## Run it locally

Requirements: Node.js 20.9 or newer (22 LTS recommended) and npm.

```bash
npm install
cp .env.example .env.local   # then fill in the values (see below)
npm run dev                  # http://localhost:3000
```

On Windows PowerShell, use `Copy-Item .env.example .env.local`. If PowerShell
blocks `npm`, run `npm.cmd run dev`, or allow scripts once with
`Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.

In development the site still runs if `.env.local` is missing: stand-in values
are used and a warning is printed. Pages work; saving forms, email and sign-in
do not.

### Useful commands

| Command                                                              | What it does                                           |
| -------------------------------------------------------------------- | ------------------------------------------------------ |
| `npm run dev`                                                        | Start the development server                           |
| `npm run build` / `npm start`                                        | Production build / run it                              |
| `npm run lint`                                                       | ESLint                                                 |
| `npm run typecheck`                                                  | TypeScript type check                                  |
| `npm run format`                                                     | Format all files with Prettier                         |
| `npm run db:migrate`                                                 | Apply database migrations (in `/drizzle`) to Supabase  |
| `npm run db:seed`                                                    | Add default settings, gallery categories and blog tags |
| `npm run admin:create -- --email you@example.com --name "Full Name"` | Create the first admin account                         |

---

## Environment variables

All variables are listed in [`.env.example`](.env.example). `NEXT_PUBLIC_`
variables are visible in the browser; everything else is a server-only secret.
Production builds stop with a clear error if any variable is missing or
malformed.

## Deploy to Vercel

1. Push the repository to GitHub and import it in Vercel (framework: Next.js;
   no other settings needed).
2. In **Project → Settings → Environment Variables**, add every variable from
   `.env.example`.
3. Deploy. After changing environment variables, redeploy so the change takes
   effect.

### Deploying before Supabase, Resend and Turnstile are set up

The values only need to be well-formed, so the site can go live with
placeholders. Pages work normally; the forms show an error until real keys are
added and the site is redeployed.

| Variable                               | Placeholder value                                                 |
| -------------------------------------- | ----------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | Your Vercel URL, e.g. `https://deltacon.vercel.app`               |
| `NEXT_PUBLIC_SUPABASE_URL`             | `https://placeholder.supabase.co`                                 |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `placeholder`                                                     |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY`       | `1x00000000000000000000AA` (Cloudflare test key)                  |
| `DATABASE_URL`                         | `postgresql://placeholder:placeholder@127.0.0.1:5432/placeholder` |
| `DATABASE_DIRECT_URL`                  | Same as `DATABASE_URL`                                            |
| `SUPABASE_SECRET_KEY`                  | `placeholder`                                                     |
| `RESEND_API_KEY`                       | `re_placeholder`                                                  |
| `EMAIL_FROM_ADDRESS`                   | `Deltacon Security <onboarding@resend.dev>`                       |
| `TURNSTILE_SECRET_KEY`                 | `1x0000000000000000000000000000000AA` (Cloudflare test key)       |
| `IP_HASH_SECRET`                       | A random string of 32+ characters (see below)                     |
| `CRON_SECRET`                          | A random string of 16+ characters (see below)                     |

Generate the two random secrets with:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

These two can stay as they are when the real service keys are added.

---

## Project structure

```
src/
  app/(site)/        Public pages (home, about, services, industries, training, forms…)
  components/        Layout, page sections, forms and shadcn/ui components
  config/            Editable site content: services, industries, training courses,
                     company details, affiliations, navigation
  lib/               Database schema and access, validation, email, environment, SEO
  server/            Server actions (form handling) and data queries
  assets/            Images bundled with the site (optimized automatically)
public/              Files served as-is: master logo, hero videos
drizzle/             Database migrations, including Row Level Security policies
scripts/             Database seeding and admin creation
```

Most wording and lists on the site (services, industries, courses, statistics,
affiliations) live in `src/config/` and can be edited without touching the
page code.
