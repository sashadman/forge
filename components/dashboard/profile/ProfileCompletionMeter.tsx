import {
  CheckCircle2,
  Circle,
  MapPin,
  Sparkles,
  Trophy,
  UserRound,
  Wrench,
} from 'lucide-react'

type ProfileCompletionMeterProps = {
  fullName: string
  location: string
  experienceLevel: string
  quizCompleted: boolean
}

export default function ProfileCompletionMeter({
  fullName,
  location,
  experienceLevel,
  quizCompleted,
}: ProfileCompletionMeterProps) {
  const items = [
    {
      label: 'Name',
      detail: 'Identity added',
      complete: Boolean(fullName.trim()),
      icon: UserRound,
    },
    {
      label: 'Location',
      detail: 'Service area added',
      complete: Boolean(location.trim()),
      icon: MapPin,
    },
    {
      label: 'Experience',
      detail: 'Level selected',
      complete: Boolean(experienceLevel.trim()),
      icon: Wrench,
    },
    {
      label: 'Career Quiz',
      detail: 'Matches generated',
      complete: quizCompleted,
      icon: Sparkles,
    },
  ]

  const completedCount = items.filter((item) => item.complete).length
  const completionPercent = Math.round((completedCount / items.length) * 100)

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-950/20">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/15 via-emerald-500/10 to-cyan-500/10" />
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-orange-500/20 blur-3xl" />

      <div className="relative">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-orange-300">
              <Trophy className="h-4 w-4" />
              Profile status
            </div>

            <h2 className="mt-3 text-3xl font-black tracking-tight">
              {completionPercent}% complete
            </h2>

            <p className="mt-2 max-w-2xl leading-7 text-slate-300">
              Complete your basic profile mission before moving deeper into
              readiness, career paths, training, and applications.
            </p>
          </div>

          <div className="w-fit rounded-2xl border border-white/10 bg-white/10 px-5 py-4 text-center">
            <p className="text-4xl font-black">{completedCount}/4</p>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Items
            </p>
          </div>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange-400 to-cyan-300 transition-all"
            style={{ width: `${completionPercent}%` }}
          />
        </div>

        <div className="mt-6 grid auto-rows-fr gap-3 sm:grid-cols-2">
          {items.map((item) => {
            const Icon = item.icon

            return (
              <div
                key={item.label}
                className="flex min-h-[150px] flex-col justify-between rounded-2xl border border-white/10 bg-white/10 p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={
                      item.complete
                        ? 'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-300'
                        : 'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-slate-400'
                    }
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <div
                    className={
                      item.complete
                        ? 'rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-emerald-300'
                        : 'rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-slate-400'
                    }
                  >
                    {item.complete ? 'Done' : 'Open'}
                  </div>
                </div>

                <div className="mt-5">
                  <p className="text-xl font-black tracking-tight">
                    {item.label}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-slate-400">
                    {item.detail}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-2 text-sm font-bold">
                  {item.complete ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                      <span className="text-emerald-300">Mission item complete</span>
                    </>
                  ) : (
                    <>
                      <Circle className="h-4 w-4 text-slate-400" />
                      <span className="text-slate-400">Still needed</span>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}