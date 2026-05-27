'use client'

import type { ReactNode } from 'react'
import { useTheme } from '@/components/theme/ThemeProvider'

type ThemedPublicPageProps = {
  children: ReactNode
}

export default function ThemedPublicPage({ children }: ThemedPublicPageProps) {
  const { isLight } = useTheme()

  return (
    <main
      className={
        isLight
          ? 'min-h-screen bg-white text-slate-950'
          : 'min-h-screen bg-slate-950 text-white'
      }
    >
      {children}
    </main>
  )
}