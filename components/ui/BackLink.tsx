import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type BackLinkProps = {
  href: string
  label: string
  variant?: 'light' | 'dark'
}

export default function BackLink({
  href,
  label,
  variant = 'dark',
}: BackLinkProps) {
  const className =
    variant === 'light'
      ? 'inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition hover:text-white'
      : 'inline-flex items-center gap-2 text-sm font-semibold text-orange-700 transition hover:text-orange-800'

  return (
    <Link href={href} className={className}>
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Link>
  )
}