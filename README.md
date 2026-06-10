# Forge

Forge is a skilled-trades pathway platform for career seekers, employers, training providers, and administrators.

The MVP is designed around trust, role separation, and real records. Public pages should show active, reviewed, verified, or sourced programs and opportunities instead of fake listings or placeholder data.

## Purpose

Forge connects four workflows:

- Career seekers explore trades, compare programs, save opportunities, build readiness, and track applications.
- Employers create profiles, submit real opportunities for review, and manage applicants.
- Training providers request access, submit programs, and request updates.
- Admins review claims, programs, employer submissions, opportunities, applications, sources, and system readiness.

## Tech Stack

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Supabase Auth
- Supabase Postgres
- Supabase Row Level Security

## Core Roles

### Career Seeker

Career seekers can explore career paths, take the quiz, compare training programs, save jobs and apprenticeships, build readiness, and track applications.

### Employer

Employers can create an account, build a profile, submit jobs or apprenticeships for admin review, view submission status, and manage applications.

Employer-submitted opportunities do not become public automatically. Admin approval is required.

### Training Provider

Training providers can submit access claims, manage verified profiles, submit training programs, and request updates to public program records.

Provider-submitted changes require admin review.

### Admin

Admins can review provider claims, provider program submissions, provider update requests, imported program candidates, employer opportunity submissions, employers, opportunities, applications, sources, and system readiness.

## Public Trust Rules

Public opportunities should be active, reviewed, sourced, or employer verified.

Public programs should be active, approved or admin-created, and connected to a source, provider, or review workflow when possible.

Forge avoids fake listings, filler programs, and dead-end public records.

## Environment Variables

Create .env.local with:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000

Never expose Supabase service-role keys to the browser.

## Local Development

Install dependencies:

npm install

Run local dev server:

npm run dev

Open:

http://localhost:3000

Run checks:

npm run type-check
npm run build

## Supabase

Migrations are stored in:

supabase/migrations

Check migration status:

npx supabase migration list

Push migrations:

npx supabase db push

Generate types after schema changes:

npx supabase gen types typescript --linked > lib/supabase/types.ts

## Important Routes

Public:

- /
- /career-seeker
- /trades
- /programs
- /opportunities
- /for-employers
- /for-programs
- /training-providers/claim

Career seeker:

- /dashboard
- /dashboard/profile
- /dashboard/readiness
- /dashboard/training-programs
- /dashboard/jobs
- /dashboard/applications
- /dashboard/career-paths

Employer:

- /employers/sign-up
- /employers/sign-in
- /employers/new
- /employers/dashboard
- /employers/profile
- /employers/opportunities/new
- /employers/applications

Training provider:

- /training-providers/claim
- /training-providers/dashboard
- /training-providers/profile
- /training-providers/programs
- /training-providers/programs/new

Admin:

- /admin
- /admin/system-readiness
- /admin/employer-opportunity-submissions
- /admin/opportunities
- /admin/employers
- /admin/programs
- /admin/program-candidates
- /admin/provider-claims
- /admin/provider-programs
- /admin/program-update-requests
- /admin/training-sources
- /admin/opportunity-sources

## Production Readiness Checklist

Before sharing the MVP:

- Run git status
- Run npm run type-check
- Run npm run build
- Confirm Supabase migrations are applied
- Confirm .env.local is not committed
- Confirm production environment variables are set
- Confirm Supabase auth redirect URLs include production URL
- Confirm admin pages block non-admin users
- Confirm employer submissions require admin approval
- Confirm provider submissions require admin approval
- Confirm public pages do not show fake or unreviewed records

## MVP Status

Implemented:

- Career seeker workflow
- Employer profile and review workflow
- Training provider claim and program workflow
- Admin review queues
- Public trust filters
- System readiness dashboard
- Dark/light theme readability
- Passing type-check and build

## License

Private project owned by Shadman Consulting unless otherwise specified.
