import Link from 'next/link'
import { Hammer, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react'

const FOOTER_LINKS = {
  'For Job Seekers': [
    { label: 'Explore Trades', href: '/trades' },
    { label: 'Career Quiz', href: '/quiz' },
    { label: 'Find Programs', href: '/programs' },
    { label: 'Apprenticeships', href: '/programs?type=apprenticeship' },
    { label: 'Trade Schools', href: '/programs?type=trade_school' },
    { label: 'Career Guide (AI)', href: '/dashboard/seeker/guide' },
  ],
  'For Employers': [
    { label: 'Post a Job', href: '/for-employers' },
    { label: 'Browse Talent', href: '/for-employers#talent' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Employer Login', href: '/login?role=employer' },
  ],
  'For Programs': [
    { label: 'List Your Program', href: '/for-programs' },
    { label: 'Program Dashboard', href: '/dashboard/program' },
    { label: 'Partner with Forge', href: '/partnerships' },
  ],
  'Company': [
    { label: 'About Forge', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/jobs' },
    { label: 'Press', href: '/press' },
    { label: 'Contact', href: '/contact' },
  ],
}

const SOCIAL_LINKS = [
  { icon: Twitter, href: 'https://twitter.com/getforge', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com/getforge', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com/company/getforge', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com/@getforge', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="bg-forge-navy text-white">
      <div className="section-container py-16">

        {/* Top row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-forge-orange rounded-lg flex items-center justify-center">
                <Hammer size={18} className="text-white" />
              </div>
              <span className="font-display text-xl font-bold">Forge</span>
            </Link>
            <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-xs">
              The career platform for America&apos;s skilled trades. Discover your path, find training, and land the job.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Icon size={16} className="text-white/60" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-bold tracking-widest uppercase text-white/40 mb-4">
                {section}
              </h4>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Forge Platform, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="text-xs text-white/40 hover:text-white/70 transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}