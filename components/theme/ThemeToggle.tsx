'use client'

import { Moon, SunMedium } from 'lucide-react'
import { useTheme } from '@/components/theme/ThemeProvider'

type ThemeToggleProps = {
  variant?: 'default' | 'mission'
}

export default function ThemeToggle({ variant = 'default' }: ThemeToggleProps) {
  const { isLight, toggleTheme } = useTheme()

  const size = variant === 'mission' ? 'h-11 w-11' : 'h-10 w-10'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center rounded-full transition-all ${size}`}
      style={{
        border: '1px solid var(--border-mid)',
        background: 'var(--bg-raised)',
        color: 'var(--text-secondary)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-cyan)'
        e.currentTarget.style.color = 'var(--cyan)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-mid)'
        e.currentTarget.style.color = 'var(--text-secondary)'
      }}
      aria-label={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
      title={isLight ? 'Switch to dark theme' : 'Switch to light theme'}
    >
      {isLight ? (
        <Moon className="h-4 w-4" aria-hidden="true" />
      ) : (
        <SunMedium className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  )
}