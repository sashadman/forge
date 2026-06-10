import type { Metadata } from 'next'
import Link from 'next/link'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  Hammer,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserRound,
} from 'lucide-react'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `${siteConfig.name} — Skilled-Trades Pathway Platform`,
 description:
  'Ara Skills helps career seekers discover training programs, apprenticeships, workforce pathways, and verified opportunities by location and category.',
}

const rolePaths = [
  {
    title: 'Career Seeker',
    label: 'Main player path',
    description:
      'Explore skilled-trades careers, build readiness, compare training programs, save jobs or apprenticeships, and track applications.',
    href: '/career-seeker',
    icon: UserRound,
    accent: 'orange',
    size: 'large',
    steps: [
      'Explore career paths',
      'Build readiness',
      'Compare training',
      'Apply to real listings',
    ],
  },
  {
    title: 'Employer',
    label: 'Hiring path',
    description:
      'Create an employer profile, post real jobs or apprenticeships, and review applicants through a dedicated employer workspace.',
    href: '/for-employers',
    icon: BriefcaseBusiness,
    accent: 'emerald',
    size: 'small',
    steps: ['Create profile', 'Post listings', 'Review applicants'],
  },
  {
    title: 'Training Provider',
    label: 'Program path',
    description:
      'Request provider access, manage verified provider information, and submit real training programs for admin review.',
    href: '/for-programs',
    icon: GraduationCap,
    accent: 'cyan',
    size: 'small',
    steps: ['Request access', 'Verify profile', 'Submit programs'],
  },
]

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-1/2 top-[-8rem] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-indigo-500/8 blur-xl" />
        <div className="absolute bottom-[-8rem] right-[-4rem] h-[30rem] w-[30rem] rounded-full bg-cyan-400/10 blur-xl" />
        <div className="absolute bottom-[18rem] left-[-6rem] h-[26rem] w-[26rem] rounded-full bg-emerald-400/10 blur-xl" />
      </div>

      <section className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-slate-950/10">
              <Hammer className="h-6 w-6" />
            </div>

            <div>
              <p className="text-lg font-black tracking-tight">
                {siteConfig.name}
              </p>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
                Skilled-trades platform
              </p>
            </div>
          </Link>

        </header>

        <section className="grid flex-1 content-center gap-8 py-12">
          <div className="relative overflow-hidden rounded-[2.75rem] border border-white/10 bg-white/[0.06] p-7 shadow-2xl shadow-black/25 backdrop-blur md:p-10 lg:p-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.08),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(15,23,42,0.12),transparent_30%)]" />

            <div className="relative grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-indigo-300/20 bg-indigo-500/8 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-indigo-200">
                  <Sparkles className="h-4 w-4" />
                  Welcome
                </div>

                <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-5xl">
                  Choose your path. Build what’s next.
                </h1>

                <p className="mt-6 max-w-3xl text-xl leading-8 text-slate-300">
                  Skilled trades should feel easier to explore, not harder to understand. 
                  Choose your role, enter the right path, and move through a focused experience built around careers, training, hiring, and workforce connections.
                </p>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-slate-950/60 p-6">
                <p className="text-sm font-black uppercase tracking-[0.25em] text-slate-500">
                  Platform logic
                </p>

                <div className="mt-5 grid gap-4">
                  {[
                    'Career seekers explore and prepare.',
                    'Employers post and review applicants.',
                    'Training providers verify and submit programs.',
                  ].map((item) => (
                    <div key={item} className="flex gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-indigo-300" />
                      <p className="leading-7 text-slate-300">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-cyan-300" />
                    <p className="text-sm leading-6 text-slate-400">
                      Each path is kept separate so users do not cross into the
                      wrong dashboard or workflow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <RoleCard role={rolePaths[0]} />

            <div className="grid gap-6">
              <RoleCard role={rolePaths[1]} />
              <RoleCard role={rolePaths[2]} />
            </div>
          </div>
        </section>

        <footer className="relative flex flex-col justify-between gap-3 border-t border-white/10 py-5 text-xs font-semibold text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Shadman Consulting.</p>
          <p>Career Seeker · Employer · Training Provider</p>
        </footer>
      </section>
    </main>
  )
}

function RoleCard({
  role,
}: {
  role: {
    title: string
    label: string
    description: string
    href: string
    icon: typeof UserRound
    accent: string
    size: string
    steps: string[]
  }
}) {
  const Icon = role.icon

  const accentClasses =
    role.accent === 'orange'
      ? {
          border: 'hover:border-orange-300/50',
          glow: 'bg-indigo-500/8',
          icon: 'bg-indigo-500/8 text-indigo-200 ring-orange-400/20',
          text: 'text-indigo-200',
          button: 'group-hover:bg-orange-100',
        }
      : role.accent === 'emerald'
        ? {
            border: 'hover:border-emerald-300/40',
            glow: 'bg-emerald-500/15',
            icon: 'bg-emerald-500/15 text-emerald-200 ring-emerald-400/20',
            text: 'text-emerald-200',
            button: 'group-hover:bg-emerald-100',
          }
        : {
            border: 'hover:border-cyan-300/40',
            glow: 'bg-cyan-500/15',
            icon: 'bg-cyan-500/15 text-cyan-200 ring-cyan-400/20',
            text: 'text-cyan-200',
            button: 'group-hover:bg-cyan-100',
          }

  return (
    <Link
      href={role.href}
      className={`group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1 ${accentClasses.border} ${
        role.size === 'large' ? 'min-h-[31rem] md:p-8 lg:p-10' : 'md:p-7'
      }`}
    >
      <div
        className={`absolute right-[-6rem] top-[-6rem] h-56 w-56 rounded-full ${accentClasses.glow} blur-xl`}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_32%)]" />

      <div className="relative flex h-full flex-col">
        <div className="flex items-start justify-between gap-5">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ring-1 ${accentClasses.icon}`}
          >
            <Icon className="h-7 w-7" />
          </div>

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-full bg-white text-slate-950 transition ${accentClasses.button}`}
          >
            <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </div>
        </div>

        <div className={role.size === 'large' ? 'mt-10' : 'mt-7'}>
          <p
            className={`text-xs font-black uppercase tracking-[0.25em] ${accentClasses.text}`}
          >
            {role.label}
          </p>

          <h2
            className={
              role.size === 'large'
                ? 'mt-4 text-5xl font-black tracking-tight text-white'
                : 'mt-3 text-3xl font-black tracking-tight text-white'
            }
          >
            {role.title}
          </h2>

          <p
            className={
              role.size === 'large'
                ? 'mt-5 max-w-2xl text-lg leading-8 text-slate-300'
                : 'mt-4 leading-7 text-slate-400'
            }
          >
            {role.description}
          </p>
        </div>

        <div className="mt-8 grid gap-3">
          {role.steps.map((step) => (
            <div
              key={step}
              className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3"
            >
              <p className="text-sm font-bold text-slate-200">{step}</p>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-8">
          <div className="inline-flex items-center gap-2 text-sm font-black text-white">
            Enter {role.title} path
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  )
}