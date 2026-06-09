
import {
  BriefcaseBusiness,
  Database,
  FileCheck2,
  KeyRound,
  LockKeyhole,
  ServerCog,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'

export type ReadinessStatus = 'ready' | 'needs_review' | 'manual_check'

export type ReadinessItem = {
  title: string
  description: string
  status: ReadinessStatus
}

export type ReadinessSection = {
  title: string
  description: string
  iconName:
    | 'shield'
    | 'lock'
    | 'key'
    | 'database'
    | 'server'
    | 'users'
    | 'file'
    | 'briefcase'
  items: ReadinessItem[]
}

export function getReadinessIcon(iconName: ReadinessSection['iconName']) {
  if (iconName === 'shield') return ShieldCheck
  if (iconName === 'lock') return LockKeyhole
  if (iconName === 'key') return KeyRound
  if (iconName === 'database') return Database
  if (iconName === 'server') return ServerCog
  if (iconName === 'users') return UsersRound
  if (iconName === 'briefcase') return BriefcaseBusiness

  return FileCheck2
}

export const readinessSections: ReadinessSection[] = [
  {
    title: 'Authentication and role routing',
    description:
      'Confirm users land in the correct role-specific workspace after sign-in.',
    iconName: 'users',
    items: [
      {
        title: 'Career seekers route to seeker dashboard',
        description:
          'General users should land in the seeker dashboard or a safe next path after sign-in.',
        status: 'manual_check',
      },
      {
        title: 'Employers route to employer workspace',
        description:
          'Employer users should land in employer onboarding or employer dashboard based on whether an employer profile exists.',
        status: 'manual_check',
      },
      {
        title: 'Training providers route to provider workspace',
        description:
          'Approved providers should use provider dashboards and provider program/update workflows, not seeker pages.',
        status: 'manual_check',
      },
      {
        title: 'Admins route to admin command center',
        description:
          'Admin users should be able to access /admin and protected review queues. Non-admin users should be redirected away.',
        status: 'manual_check',
      },
    ],
  },
  {
    title: 'Authorization and RLS',
    description:
      'Confirm sensitive records are protected by role-specific policies and server-side checks.',
    iconName: 'lock',
    items: [
      {
        title: 'Admin-only review actions protected',
        description:
          'Candidate promotion, provider claim review, provider program review, update-apply actions, and employer opportunity approval all require admin role checks.',
        status: 'ready',
      },
      {
        title: 'Employer submissions stay private until review',
        description:
          'Employer-submitted opportunities go into employer_opportunity_submissions and do not appear publicly until admin approval promotes them into opportunities.',
        status: 'ready',
      },
      {
        title: 'Provider-only actions protected',
        description:
          'Provider program submissions and update requests require active provider membership and still require admin approval before public records change.',
        status: 'ready',
      },
      {
        title: 'Career seeker saved records are private',
        description:
          'Saved programs, saved opportunities, readiness items, applications, and planning notes should be visible only to the owning user unless intentionally exposed through employer/admin workflows.',
        status: 'needs_review',
      },
      {
        title: 'Public records remain read-only to public users',
        description:
          'Anonymous and non-admin authenticated users can read approved active records but cannot directly publish programs, employers, or opportunities.',
        status: 'needs_review',
      },
    ],
  },
  {
    title: 'Employer opportunity operations',
    description:
      'Confirm the employer-side trust workflow is complete before sharing with real employers.',
    iconName: 'briefcase',
    items: [
      {
        title: 'Employers submit opportunities for review',
        description:
          'Employer-created jobs, apprenticeships, trainee roles, internships, and pre-apprenticeships are submitted to the review queue instead of publishing directly.',
        status: 'ready',
      },
      {
        title: 'Employer dashboard shows review status',
        description:
          'Employers can see submitted, approved, rejected, draft, and archived opportunity states, including admin notes for rejected records.',
        status: 'ready',
      },
      {
        title: 'Admins approve and publish employer submissions',
        description:
          'Approved employer submissions are promoted into the public opportunities table and become visible in the public opportunity directory.',
        status: 'ready',
      },
      {
        title: 'Admins reject with useful feedback',
        description:
          'Rejected submissions keep admin notes visible to the employer so unclear or low-quality listings can be revised before publication.',
        status: 'ready',
      },
    ],
  },
  {
    title: 'Training data operations',
    description:
      'Confirm imported program records can be reviewed, promoted, attributed, and kept separate from raw candidate data.',
    iconName: 'database',
    items: [
      {
        title: 'Training sources visible in admin',
        description:
          'Admin can inspect source health, last crawl status, candidate counts, and trusted candidate counts.',
        status: 'ready',
      },
      {
        title: 'Program candidates can be reviewed',
        description:
          'Admin can promote, reject, or mark imported candidates as duplicates without directly exposing raw imported data publicly.',
        status: 'ready',
      },
      {
        title: 'Promoted candidates show source trust',
        description:
          'Public program pages display source, trust, and freshness information for promoted records.',
        status: 'ready',
      },
    ],
  },
  {
    title: 'Provider operations',
    description:
      'Confirm provider workflows stay separate from career seeker workflows.',
    iconName: 'file',
    items: [
      {
        title: 'Providers can claim program listings',
        description:
          'Program detail pages route providers to a provider claim/update flow instead of seeker dashboards.',
        status: 'ready',
      },
      {
        title: 'Provider workspace connects claimed programs',
        description:
          'Approved claims can create provider workspaces and connect linked programs.',
        status: 'ready',
      },
      {
        title: 'Providers request updates instead of editing public data directly',
        description:
          'Provider update requests go to admin review before public records change.',
        status: 'ready',
      },
      {
        title: 'Provider-submitted programs require admin approval',
        description:
          'Provider-created programs remain private/pending until admin review.',
        status: 'ready',
      },
    ],
  },
  {
    title: 'Environment and secret handling',
    description:
      'Confirm local and production environments do not leak private keys.',
    iconName: 'key',
    items: [
      {
        title: '.env.local is not committed',
        description:
          'Run git status and confirm .env.local does not appear in tracked changes.',
        status: 'manual_check',
      },
      {
        title: 'Supabase anon key only in client-safe variables',
        description:
          'NEXT_PUBLIC_SUPABASE_ANON_KEY may be public. Service-role keys must never be exposed to the browser.',
        status: 'manual_check',
      },
      {
        title: 'Production environment variables configured',
        description:
          'Production deployment needs Supabase URL and keys configured in Vercel or the hosting provider.',
        status: 'manual_check',
      },
      {
        title: 'Auth redirect URLs configured',
        description:
          'Supabase auth redirect URLs should include the local URL and the production deployment URL before real users are invited.',
        status: 'manual_check',
      },
    ],
  },
  {
    title: 'Deployment readiness',
    description:
      'Confirm the app can build, deploy, and operate without local-only assumptions.',
    iconName: 'server',
    items: [
      {
        title: 'Type-check passes',
        description: 'Run npm run type-check before every deploy.',
        status: 'manual_check',
      },
      {
        title: 'Production build passes',
        description: 'Run npm run build before every deploy.',
        status: 'manual_check',
      },
      {
        title: 'Supabase migrations are pushed',
        description:
          'Run npx supabase db push --linked or confirm all migrations are already applied before deployment.',
        status: 'manual_check',
      },
      {
        title: 'Git working tree is clean',
        description:
          'Run git status before deployment. Temporary files like supabase/.temp should not be committed.',
        status: 'manual_check',
      },
    ],
  },
]
