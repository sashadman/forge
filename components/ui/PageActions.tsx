import type { ReactNode } from 'react'

type PageActionsProps = {
  children: ReactNode
  align?: 'start' | 'end'
}

export default function PageActions({
  children,
  align = 'end',
}: PageActionsProps) {
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row ${
        align === 'end' ? 'sm:justify-end' : 'sm:justify-start'
      }`}
    >
      {children}
    </div>
  )
}