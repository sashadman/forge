'use client'

import Link from 'next/link'
import { ArrowRight, Play, Zap, Wind, Droplets, Flame, Sun, HardHat } from 'lucide-react'

const TRADE_ICONS = [
  { Icon: Zap,     label: 'Electrician', delay: 'animate-delay-100' },
  { Icon: Wind,    label: 'HVAC',        delay: 'animate-delay-200' },
  { Icon: Droplets,label: 'Plumbing',    delay: 'animate-delay-300' },
  { Icon: Flame,   label: 'Welding',     delay: 'animate-delay-400' },
  { Icon: Sun,     label: 'Solar',       delay: 'animate-delay-500' },
  { Icon: HardHat, label: 'Construction',delay: 'animate-delay-100' },
]

const STATS = [
  { value: '530K+', label: 'Trade jobs open now' },
  { value: '$62K',  label: 'Avg starting salary' },
  { value: '$0',    label: 'College debt' },
  { value: '85%',   label: 'AI-proof careers' },
]

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-forge-navy overflow-hidden flex items-center">

      {/* Background grid pattern */}
      <div className="absolute inset-0 bg-forge-grid opacity-100" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forge-navy/20 to-forge-navy" />

      {/* Orange glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px]
                      bg-forge-orange/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Trade icons — floating background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {TRADE_ICONS.map(({ Icon, delay }, i) => (
          <div
            key={i}
            className={`absolute opacity-5 animate-fade-in ${delay}`}
            style={{
              left: `${10 + (i % 3) * 30 + Math.random() * 10}%`,
              top:  `${10 + Math.floor(i / 3) * 40 + Math.random() * 20}%`,
              transform: `rotate(${(i * 23) % 45 - 22}deg)`,
            }}
          >
            <Icon size={80} className="text-white" />
          </div>
        ))}
      </div>

      <div className="section-container relative z-10 pt-24 pb-20">
        <div className="max-w-4xl mx-auto text-center">

          {/* Label */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-forge-orange animate-pulse" />
            <span className="text-sm text-white/80 font-medium">
              530,000 skilled trade jobs open right now
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-display-2xl text-white mb-6 animate-fade-up animate-delay-100">
            Your trade career{' '}
            <br className="hidden sm:block" />
            starts{' '}
            <span className="text-gradient-orange">here.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-white/70 font-body leading-relaxed mb-10 max-w-2xl mx-auto animate-fade-up animate-delay-200">
            Discover the trade that fits you, find local apprenticeships,
            and connect with employers hiring right now.
            No college degree required.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up animate-delay-300">
            <Link href="/quiz" className="btn-primary text-base px-8 py-4 shadow-forge animate-pulse-orange">
              Find your trade
              <ArrowRight size={18} />
            </Link>
            <Link
              href="/trades"
              className="inline-flex items-center gap-2.5 text-white/80 hover:text-white text-base font-medium transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                <Play size={16} className="text-white ml-0.5" />
              </div>
              Explore trades
            </Link>
          </div>

          {/* Stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto animate-fade-up animate-delay-400">
            {STATS.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="font-display text-3xl font-bold text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-white/50 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trade icon row */}
        <div className="mt-20 flex flex-wrap items-center justify-center gap-4 animate-fade-up animate-delay-500">
          {TRADE_ICONS.map(({ Icon, label }) => (
            <Link
              key={label}
              href={`/trades/${label.toLowerCase()}`}
              className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-forge-orange/40
                         rounded-full px-5 py-2.5 transition-all duration-200 group"
            >
              <Icon size={16} className="text-forge-orange" />
              <span className="text-sm text-white/70 group-hover:text-white transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}