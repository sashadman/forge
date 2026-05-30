import {
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
  items: ReadinessItem[]
}

export function getReadinessIcon(iconName: ReadinessSection['iconName']) {
  if (iconName === 'shield') return ShieldCheck
  if (iconName === 'lock') return LockKeyhole
  if (iconName === 'key') return KeyRound
  if (iconName === 'database') return Database
  if (iconName === 'server') return ServerCog
  if (iconName === 'users') return UsersRound

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
          'General users should land in the seeker dashboard or a safe next path.',
        status: 'manual_check',
      },
      {
        title: 'Training providers route to provider workspace',
        description:
          'Approved providers should use provider dashboards, not seeker pages.',
        status: 'manual_check',
      },
      {
        title: 'Employers route to employer workspace',
        description:
          'Employer users should land in employer onboarding or employer dashboard based on profile status.',
        status: 'manual_check',
      },
      {
        title: 'Admins route to admin command center',
        description:
          'Admin users should be able to access /admin and protected review queues.',
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
          'Candidate promotion, provider claim review, program review, and update-apply actions require admin role checks.',
        status: 'needs_review',
      },
      {
        title: 'Provider-only actions protected',
        description:
          'Provider program submissions and update requests require active provider membership.',
        status: 'needs_review',
      },
      {
        title: 'Career seeker saved programs are private',
        description:
          'Saved program planning status, notes, dates, and priority should be visible only to the owning user.',
        status: 'needs_review',
      },
      {
        title: 'Public program records remain read-only to public users',
        description:
          'Anonymous and authenticated non-admin users can read approved active records but cannot directly publish edits.',
        status: 'needs_review',
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
        title: 'Vercel environment variables configured',
        description:
          'Production deployment needs Supabase URL and keys configured in Vercel project settings.',
        status: 'manual_check',
      },
    ],
  },
  {
    title: 'Training data operations',
    description:
      'Confirm imported program records can be reviewed, promoted, and attributed.',
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
          'Admin can promote or reject imported candidates without directly exposing raw imported data publicly.',
        status: 'ready',
      },
      {
        title: 'Promoted candidates show source trust',
        description:
          'Public program pages display source/trust/freshness information for promoted records.',
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
          'Run npx supabase db push --linked --dry-run, then npx supabase db push --linked when ready.',
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