'use client'

import { Moon, SunMedium } from 'lucide-react'
import { useTheme } from '@/components/theme/ThemeProvider'

type ThemeToggleProps = {
  variant?: 'default' | 'mission'
}

export default function ThemeToggle({ variant = 'default' }: ThemeToggleProps) {
  const { isLight, toggleTheme } = useTheme()

  const buttonClass =
    variant === 'mission'
      ? isLight
        ? 'inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-slate-700 shadow-sm transition hover:border-teal-300 hover:text-teal-700'
        : 'inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 text-slate-200 shadow-sm transition hover:border-cyan-300/40 hover:text-cyan-200'
      : isLight
        ? 'inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700'
        : 'inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-slate-900 text-slate-100 shadow-sm transition hover:border-cyan-300/40 hover:bg-slate-800 hover:text-cyan-200'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={buttonClass}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {isLight ? (
        <Moon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <SunMedium className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  )
}