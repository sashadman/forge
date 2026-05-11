const testimonials = [
  {
    quote: 'Make trade careers easier to understand and easier to enter.',
    name: 'Career seeker focus',
  },
  {
    quote: 'Help employers connect with motivated future workers.',
    name: 'Employer focus',
  },
  {
    quote: 'Help training programs become more visible to the community.',
    name: 'Program focus',
  },
]

export default function Testimonials() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Built around real workforce needs.
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            The first version focuses on clarity, access, and connection.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
              <p className="text-slate-700">“{item.quote}”</p>
              <p className="mt-5 text-sm font-semibold text-slate-950">
                {item.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}