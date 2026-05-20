import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

type DashboardSectionHeaderProps = {
  eyebrow: string
  title: string
  description?: string
  href: string
  action: string
}

export default function DashboardSectionHeader({
  eyebrow,
  title,
  description,
  href,
  action,
}: DashboardSectionHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
      <div>
        <p className="eyebrow">{eyebrow}</p>

        <h2 className="section-title mt-3">{title}</h2>

        {description && <p className="muted-text mt-3 max-w-2xl">{description}</p>}
      </div>

      <Link href={href} className="btn-outline px-5 py-2 text-sm">
        {action}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  )
}