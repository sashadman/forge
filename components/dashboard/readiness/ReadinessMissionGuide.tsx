import {
  AlertCircle,
  CheckCircle2,
  FileText,
  Lock,
  ShieldCheck,
  Sparkles,
} from 'lucide-react'
import {
  ALL_READINESS_ITEMS,
  REQUIRED_READINESS_ITEMS,
} from '@/lib/readiness/readiness-config'

export default function ReadinessMissionGuide() {
  const optionalItems = ALL_READINESS_ITEMS.filter((item) => !item.isRequired)
  const sensitiveItems = ALL_READINESS_ITEMS.filter((item) => item.isSensitive)

  const guideCards = [
    {
      title: 'Required items',
      value: REQUIRED_READINESS_ITEMS.length,
      description:
        'Complete these first. They build the core application package employers care about most.',
      icon: ShieldCheck,
    },
    {
      title: 'Optional boosters',
      value: optionalItems.length,
      description:
        'These can strengthen your profile, but they should not block your early progress.',
      icon: Sparkles,
    },
    {
      title: 'Private items',
      value: sensitiveItems.length,
      description:
        'Sensitive items stay private unless a future workflow clearly explains sharing and consent.',
      icon: Lock,
    },
  ]

  return (
    <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-8 text-white shadow-2xl shadow-slate-950/20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/8 via-slate-700/10 to-slate-700/8" />
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-indigo-500/8 blur-xl" />

        <div className="relative">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-indigo-300">
            <FileText className="h-4 w-4" />
            Readiness strategy
          </div>

          <h2 className="mt-4 text-3xl font-black tracking-tight">
            Build the package before you apply.
          </h2>

          <p className="mt-4 leading-7 text-slate-300">
            This mission is about reducing friction before you submit real job
            or apprenticeship applications. Start with the required items, then
            add optional boosters when they make sense.
          </p>

          <div className="mt-6 rounded-2xl border border-indigo-300/20 bg-orange-500/10 p-5">
            <div className="flex gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-indigo-300" />

              <p className="text-sm leading-6 text-orange-100">
                Do not wait for a perfect profile forever. The goal is to become
                ready enough to apply, then keep improving as you learn what
                employers and programs expect.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {guideCards.map((card) => {
          const Icon = card.icon

          return (
            <div
              key={card.title}
              className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <Icon className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-black text-slate-950">
                      {card.title}
                    </h3>

                    <span className="rounded-full bg-slate-950 px-3 py-1 text-sm font-black text-white">
                      {card.value}
                    </span>
                  </div>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {card.description}
                  </p>
                </div>
              </div>
            </div>
          )
        })}

        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-6">
          <div className="flex gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />

            <div>
              <p className="font-black text-emerald-900">Best path</p>
              <p className="mt-1 text-sm leading-6 text-emerald-800">
                Resume → intro message → experience summary → work authorization.
                After that, complete optional items that match the jobs or
                apprenticeships you are targeting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}