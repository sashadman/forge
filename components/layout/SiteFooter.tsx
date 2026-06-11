'use client'

import Link from 'next/link'
import { Hammer } from 'lucide-react'
import { siteConfig } from '@/config/site'

export default function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-void)]">
      <div className="section-shell py-12">
        <div className="grid gap-10 md:grid-cols-[1.25fr_0.85fr_0.85fr_0.85fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-[var(--radius-lg)] bg-[var(--cyan)] text-[var(--text-on-cyan)] shadow-[var(--cyan-glow)]">
                <Hammer className="h-5 w-5" />
              </div>

              <div>
                <p className="font-display text-xl font-black tracking-tight text-[var(--text-primary)]">
                  {siteConfig.name}
                </p>
                <p className="mt-1 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-muted)]">
                  Workforce pathways
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[var(--text-secondary)]">
              Skilled-trades pathway platform for career seekers, employers, and
              verified training providers.
            </p>
          </div>

          <FooterGroup
            title="Career Seekers"
            links={[
              { href: '/trades', label: 'Career Paths' },
              { href: '/programs', label: 'Training Programs' },
              { href: '/opportunities', label: 'Jobs & Apprenticeships' },
              { href: '/quiz', label: 'Career Quiz' },
              { href: '/pricing', label: 'Pricing' },
            ]}
          />

          <FooterGroup
            title="Employers"
            links={[
              { href: '/for-employers', label: 'Overview' },
              { href: '/employers/sign-up', label: 'Create Account' },
              { href: '/employers/sign-in', label: 'Sign In' },
              { href: '/pricing', label: 'Pricing' },
            ]}
          />

          <FooterGroup
            title="Providers"
            links={[
              { href: '/for-programs', label: 'Provider Overview' },
              { href: '/training-providers/claim', label: 'Request Access' },
              { href: '/for-programs#provider-workflow', label: 'Provider Workflow' },
              { href: '/pricing', label: 'Pricing' },
            ]}
          />
        </div>

        <div className="mt-10 border-t border-[var(--border)] pt-6 text-sm text-[var(--text-muted)]">
          © {currentYear} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

function FooterGroup({
  title,
  links,
}: {
  title: string
  links: { href: string; label: string }[]
}) {
  return (
    <div>
      <p className="font-display text-sm font-black uppercase tracking-[0.28em] text-[var(--text-primary)]">
        {title}
      </p>

      <div className="mt-5 grid gap-3 text-sm font-semibold text-[var(--text-secondary)]">
        {links.map((link) => (
          <Link
            key={`${title}-${link.href}-${link.label}`}
            href={link.href}
            className="transition hover:text-[var(--cyan)]"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  )
}
