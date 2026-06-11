import type { ReactNode } from 'react'

type ThemedPublicPageProps = {
  children: ReactNode
}

export default function ThemedPublicPage({ children }: ThemedPublicPageProps) {
  return (
    <main
      className="min-h-screen"
      style={{ background: 'var(--bg-void)', color: 'var(--text-primary)' }}
    >
      {children}
    </main>
  )
}
