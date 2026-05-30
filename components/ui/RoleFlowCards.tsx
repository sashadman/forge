import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { PlatformRole } from '@/lib/role-flow'
import { getRoleFlowItems } from '@/lib/role-flow'

type RoleFlowCardsProps = {
  role: PlatformRole
  title: string
  description: string
}

export default function RoleFlowCards({
  role,
  title,
  description,
}: RoleFlowCardsProps) {
  const items = getRoleFlowItems(role)

  return (
    <section className="content-panel">
      <p className="eyebrow">Role flow</p>

      <h2 className="section-title mt-3">{title}</h2>

      <p className="muted-text mt-3 max-w-3xl">{description}</p>

      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group rounded-3xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-1 hover:border-orange-200 hover:bg-orange-50 hover:shadow-lg"
          >
            <h3 className="text-xl font-bold text-slate-950">{item.label}</h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {item.description}
            </p>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-orange-700">
              Open
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}