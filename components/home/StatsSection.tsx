const stats = [
  { label: 'Trade career paths', value: '25+' },
  { label: 'Starting region', value: 'San Diego' },
  { label: 'Main focus', value: 'Apprenticeships' },
  { label: 'Goal', value: 'Career discovery' },
]

export default function StatsSection() {
  return (
    <section className="bg-slate-950 py-20 text-white">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}