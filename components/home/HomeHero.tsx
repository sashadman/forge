import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  UserRound,
} from 'lucide-react'
import { siteConfig } from '@/config/site'

const audiencePaths = [
  {
    title: 'Career Seeker',
    description:
      'Explore career paths, compare training programs, build readiness, and find jobs or apprenticeships.',
    href: '/trades',
    action: 'Start exploring',
    icon: UserRound,
  },
  {
    title: 'Employer',
    description:
      'Create an employer profile, publish real jobs or apprenticeships, and review applicants.',
    href: '/for-employers',
    action: 'Employer overview',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Training Provider',
    description:
      'Help future skilled workers understand your program, requirements, and outcomes.',
    href: '/for-programs',
    action: 'Provider overview',
    icon: GraduationCap,
  },
]

export default function HomeHero() {
  return (
    <section className="hero-dark">
      <div className="hero-fade" />

      <div className="section-shell relative grid gap-12 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-28">
        <div>
          <p className="eyebrow-dark items-center gap-2">
            <Sparkles className="h-4 w-4" />
            Skilled-trades pathway platform
          </p>

          <h1 className="mt-6 max-w-4xl text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Choose the right path into skilled-trades work.
          </h1>

          <p className="lead-text-dark mt-6 max-w-3xl">
            {siteConfig.name} organizes the journey for career seekers,
            employers, and training providers so each user sees the next step
            that matches their role.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/trades" className="btn-primary px-7 py-4">
              I am a career seeker
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link href="/for-employers" className="btn-outline-dark px-7 py-4">
              I am an employer
            </Link>
          </div>
        </div>

        <div className="rounded-[2.25rem] border border-white/10 bg-white/[0.08] p-5 shadow-2xl shadow-black/30 backdrop-blur">
          <div className="rounded-[1.75rem] bg-white/95 p-6 text-slate-950 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 ring-1 ring-slate-200">
                <Image
                  src="/AraSkills-Logo.png"
                  alt={`${siteConfig.name} logo`}
                  width={48}
                  height={48}
                  className="h-full w-full object-contain"
                />
              </div>

              <div>
                <p className="font-bold">Choose your path</p>
                <p className="text-sm text-slate-500">
                  Career seeker · employer · training provider
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              {audiencePaths.map((path) => {
                const Icon = path.icon

                return (
                  <Link
                    key={path.title}
                    href={path.href}
                    className="mini-card group block transition hover:border-orange-200 hover:bg-orange-50"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-1 h-5 w-5 shrink-0 text-orange-600" />

                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-semibold text-slate-950">
                            {path.title}
                          </p>

                          <ArrowRight className="h-4 w-4 text-orange-600 transition group-hover:translate-x-1" />
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {path.description}
                        </p>

                        <p className="mt-3 text-sm font-semibold text-orange-700">
                          {path.action}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />

                <p className="text-sm leading-6 text-slate-600">
                  Each role has a separate journey. Career seekers see career
                  tools, employers see hiring tools, and training providers see
                  program-focused information.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
