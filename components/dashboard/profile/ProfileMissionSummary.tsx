import { Mail, MapPin, UserRound, Wrench } from 'lucide-react'

type ProfileMissionSummaryProps = {
  fullName: string
  email?: string | null
  location: string
  experienceLevel: string
}

export default function ProfileMissionSummary({
  fullName,
  email,
  location,
  experienceLevel,
}: ProfileMissionSummaryProps) {
  const items = [
    {
      label: 'Name',
      value: fullName || 'Not added yet',
      icon: UserRound,
    },
    {
      label: 'Email',
      value: email || 'Not available',
      icon: Mail,
    },
    {
      label: 'Location',
      value: location || 'Not added yet',
      icon: MapPin,
    },
    {
      label: 'Experience',
      value: experienceLevel || 'Not selected yet',
      icon: Wrench,
    },
  ]

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white/95 p-6 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.25em] text-orange-700">
        Current profile loadout
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex items-center gap-2 text-slate-500">
                <Icon className="h-4 w-4" />
                <p className="text-xs font-bold uppercase tracking-wide">
                  {item.label}
                </p>
              </div>

              <p className="mt-2 font-bold text-slate-950">{item.value}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}