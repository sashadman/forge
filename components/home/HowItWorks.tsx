import { ClipboardList, MapPin, Handshake, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const STEPS = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'Take the quiz',
    description:
      'Answer 6 questions about your personality, interests, and goals. Our matching engine recommends the trades best suited for you — based on real data, not guesses.',
    cta: { label: 'Start quiz', href: '/quiz' },
    color: 'bg-amber-50 text-amber-600',
  },
  {
    number: '02',
    icon: MapPin,
    title: 'Explore your options',
    description:
      'Browse local trade schools, apprenticeship programs, and union pathways. See real costs, timelines, certifications offered, and actual student reviews.',
    cta: { label: 'Find programs', href: '/programs' },
    color: 'bg-blue-50 text-blue-600',
  },
  {
    number: '03',
    icon: Handshake,
    title: 'Connect with employers',
    description:
      'Apply directly to contractors, construction companies, and trade businesses who are actively hiring beginners and apprentices right now.',
    cta: { label: 'Browse jobs', href: '/employers' },
    color: 'bg-green-50 text-green-600',
  },
]

export default function HowItWorks() {
  return (
    <section className="section-padding bg-white">
      <div className="section-container">

        <div className="text-center mb-16">
          <p className="section-label mb-3">How it works</p>
          <h2 className="section-title mb-4">
            From curious to employed{' '}
            <span className="text-gradient-orange">in 3 steps</span>
          </h2>
          <p className="section-subtitle max-w-xl mx-auto">
            The average person goes from discovering Forge to their first trade interview in under 30 days.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((step, idx) => (
            <div key={step.number} className="relative">
              {/* Connector line (desktop only) */}
              {idx < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-slate-100 z-0" style={{ width: 'calc(100% - 3rem)' }} />
              )}

              <div className="relative z-10 bg-white rounded-2xl border border-slate-100 p-8 hover:shadow-card-hover transition-shadow duration-200">
                {/* Step number */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.color}`}>
                    <step.icon size={22} />
                  </div>
                  <span className="font-display text-5xl font-bold text-slate-100">
                    {step.number}
                  </span>
                </div>

                <h3 className="font-display text-display-sm text-forge-navy mb-3">
                  {step.title}
                </h3>
                <p className="text-forge-steel text-sm leading-relaxed mb-6">
                  {step.description}
                </p>

                <Link href={step.cta.href} className="inline-flex items-center gap-1.5 text-sm font-semibold text-forge-orange hover:gap-2.5 transition-all">
                  {step.cta.label}
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}