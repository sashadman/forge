'use client'

import Link from 'next/link'
import { Hammer } from 'lucide-react'
import { siteConfig } from '@/config/site'

const footerLinks = [
  {
    heading: 'Career Seekers',
    links: [
      { href: '/trades', label: 'Career Paths' },
      { href: '/programs', label: 'Training Programs' },
      { href: '/opportunities', label: 'Jobs & Apprenticeships' },
      { href: '/quiz', label: 'Career Quiz' },
    ],
  },
  {
    heading: 'Employers',
    links: [
      { href: '/for-employers', label: 'Employers Overview' },
      { href: '/employers/sign-up', label: 'Create Account' },
      { href: '/employers/sign-in', label: 'Sign In' },
    ],
  },
  {
    heading: 'Training Providers',
    links: [
      { href: '/for-programs', label: 'Provider Overview' },
      { href: '/training-providers/claim', label: 'Request Access' },
      { href: '/for-programs#provider-workflow', label: 'Provider Workflow' },
    ],
  },
]

export default function SiteFooter() {
  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-base)' }}>
      <div className="section-shell py-12">
        <div className="grid gap-10 md:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
          {/* Brand column */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: 'var(--cyan)', color: 'var(--text-on-cyan)' }}
              >
                <Hammer className="h-4 w-4" />
              </div>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 800,
                  fontSize: '16px',
                  color: 'var(--text-primary)',
                }}
              >
                {siteConfig.name}
              </span>
            </Link>

            <p className="mt-4 max-w-xs text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
              Skilled-trades pathway platform for career seekers, employers, and verified training providers.
            </p>
          </div>

          {/* Link columns */}
          {footerLinks.map((group) => (
            <div key={group.heading}>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}
              >
                {group.heading}
              </p>
              <div className="mt-4 grid gap-3">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-medium transition-colors"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-10 pt-6 text-sm"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-muted)' }}
        >
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}