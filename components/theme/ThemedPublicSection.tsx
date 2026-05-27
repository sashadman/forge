'use client'

import type { ReactNode } from 'react'
import { useTheme } from '@/components/theme/ThemeProvider'

type ThemedPublicSectionProps = {
  children: ReactNode
  className?: string
}

export default function ThemedPublicSection({
  children,
  className = '',
}: ThemedPublicSectionProps) {
  const { isLight } = useTheme()

  return (
    <section
      className={
        isLight
          ? `bg-slate-50 ${className}`
          : `bg-slate-950 bg-[radial-gradient(circle_at_top,rgba(20,184,166,0.08),transparent_35%)] ${className}`
      }
    >
      {children}
    </section>
  )
}