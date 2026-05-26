import Link from 'next/link'
import { ArrowRight, CheckCircle2, Home, Sparkles } from 'lucide-react'

type MissionNextStepProps = {
  eyebrow?: string
  title: string
  description: string
  primaryHref: string
  primaryLabel: string
  secondaryHref?: string
  secondaryLabel?: string
}

export default function MissionNextStep({
  eyebrow = 'Next mission',
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref = '/dashboard',
  secondaryLabel = 'Return to mission hub',
}: MissionNextStepProps) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-emerald-500/10 to-cyan-500/10" />
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-orange-500/20 blur-3xl" />
      <div className="absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="relative grid gap-6 lg:grid-cols-[auto_1fr_auto] lg:items-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-orange-300 ring-1 ring-white/15">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div>
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-orange-300">
            <Sparkles className="h-4 w-4" />
            {eyebrow}
          </div>

          <h2 className="mt-3 text-3xl font-black tracking-tight">{title}</h2>

          <p className="mt-3 max-w-3xl leading-7 text-slate-300">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
          <Link href={primaryHref} className="btn-light whitespace-nowrap">
            {primaryLabel}
            <ArrowRight className="h-4 w-4" />
          </Link>

          <Link
            href={secondaryHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 font-bold text-white transition hover:border-cyan-300/40 hover:bg-white/15"
          >
            <Home className="h-4 w-4" />
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  )
}