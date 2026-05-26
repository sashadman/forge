'use client'
import Link from 'next/link'
import { useEffect, useState, type ReactNode } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Moon,
  SunMedium,
  TerminalSquare,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import MissionNav from '@/components/dashboard/mission/MissionNav'

type MissionPageFrameProps = {
  eyebrow: string
  title: string
  description: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
  children: ReactNode
}

type MissionTheme = 'night' | 'day'

export default function MissionPageFrame({
  eyebrow,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  children,
}: MissionPageFrameProps) {
  const [theme, setTheme] = useState<MissionTheme>('night')

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('mission-theme')

    if (savedTheme === 'day' || savedTheme === 'night') {
      setTheme(savedTheme)
    }
  }, [])

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === 'night' ? 'day' : 'night'
      window.localStorage.setItem('mission-theme', nextTheme)
      return nextTheme
    })
  }

  const isDay = theme === 'day'

  return (
    <main
      className={
        isDay
          ? 'min-h-screen bg-stone-100 text-slate-950'
          : 'min-h-screen bg-slate-950 text-white'
      }
    >
      <SiteNavbar />

      <section
        className={
          isDay
            ? 'relative overflow-hidden bg-gradient-to-br from-stone-100 via-orange-50 to-teal-50'
            : 'relative overflow-hidden bg-slate-950'
        }
      >
        <div
          className={
            isDay
              ? 'absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.25),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(20,184,166,0.18),transparent_35%)]'
              : 'absolute inset-0 bg-gradient-to-br from-orange-500/16 via-emerald-500/8 to-cyan-500/10'
          }
        />

        <div
          className={
            isDay
              ? 'absolute left-1/3 top-0 h-80 w-80 rounded-full bg-orange-300/25 blur-3xl'
              : 'absolute left-1/3 top-0 h-80 w-80 rounded-full bg-orange-500/15 blur-3xl'
          }
        />

        <div
          className={
            isDay
              ? 'absolute bottom-0 right-0 h-80 w-80 rounded-full bg-teal-300/20 blur-3xl'
              : 'absolute bottom-0 right-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl'
          }
        />

        <div className="section-shell relative py-20">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <Link
              href="/dashboard"
              className={
                isDay
                  ? 'inline-flex w-fit items-center gap-2 rounded-full border border-slate-300 bg-white/70 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-orange-300 hover:text-orange-700'
                  : 'inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-200 shadow-sm transition hover:border-orange-300/40 hover:text-orange-200'
              }
            >
              <ArrowLeft className="h-4 w-4" />
              Back to mission hub
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className={
                isDay
                  ? 'inline-flex w-fit items-center gap-2 rounded-full border border-slate-300 bg-white/80 px-4 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-teal-300 hover:text-teal-700'
                  : 'inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-bold text-slate-200 shadow-sm transition hover:border-cyan-300/40 hover:text-cyan-200'
              }
              aria-label="Toggle dashboard mission theme"
            >
              {isDay ? (
                <>
                  <Moon className="h-4 w-4" />
                  Night mode
                </>
              ) : (
                <>
                  <SunMedium className="h-4 w-4" />
                  Day mode
                </>
              )}
            </button>
          </div>

          <div className="mt-12 max-w-4xl">
            <div
              className={
                isDay
                  ? 'inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-sm font-black uppercase tracking-[0.25em] text-orange-700 shadow-sm'
                  : 'inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-black uppercase tracking-[0.25em] text-orange-200 shadow-lg shadow-orange-950/20 backdrop-blur'
              }
            >
              <TerminalSquare className="h-4 w-4" />
              {eyebrow}
            </div>

            <h1
              className={
                isDay
                  ? 'mt-6 text-5xl font-black tracking-tight text-slate-950 md:text-6xl'
                  : 'mt-6 text-5xl font-black tracking-tight text-white md:text-6xl'
              }
            >
              {title}
            </h1>

            <p
              className={
                isDay
                  ? 'mt-6 max-w-3xl text-lg leading-8 text-slate-700'
                  : 'mt-6 max-w-3xl text-lg leading-8 text-slate-300'
              }
            >
              {description}
            </p>

            {(primaryHref || secondaryHref) && (
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                {primaryHref && primaryLabel && (
                  <Link
                    href={primaryHref}
                    className={
                      isDay
                        ? 'inline-flex items-center justify-center gap-2 rounded-full bg-slate-950 px-6 py-3 font-bold text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-orange-700'
                        : 'inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-slate-950 shadow-lg shadow-black/20 transition hover:-translate-y-0.5 hover:bg-orange-100'
                    }
                  >
                    {primaryLabel}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                )}

                {secondaryHref && secondaryLabel && (
                  <Link
                    href={secondaryHref}
                    className={
                      isDay
                        ? 'inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white/70 px-6 py-3 font-bold text-slate-800 transition hover:border-teal-300 hover:bg-teal-50'
                        : 'inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/10 px-6 py-3 font-bold text-white transition hover:border-cyan-300/40 hover:bg-white/15'
                    }
                  >
                    {secondaryLabel}
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
           </section>

      <MissionNav isDay={isDay} />

      <section
        className={
          isDay
            ? 'bg-stone-100 pb-20'
            : 'bg-slate-950 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.08),transparent_35%)] pb-20'
        }
      >
        <div className="section-shell pt-8">{children}</div>
      </section>

      <SiteFooter />
    </main>
  )
}