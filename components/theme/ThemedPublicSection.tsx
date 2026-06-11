import type { ReactNode } from 'react'

type ThemedPublicSectionProps = {
  children: ReactNode
  className?: string
}

export default function ThemedPublicSection({
  children,
  className = '',
}: ThemedPublicSectionProps) {
  return (
    <section
      className={className}
      style={{ background: 'var(--bg-void)', color: 'var(--text-primary)' }}
    >
      {children}
    </section>
  )
}
