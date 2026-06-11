import Link from 'next/link'
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Handshake,
  Sparkles,
} from 'lucide-react'

const employerPlans = [
  {
    name: 'Free',
    price: '$0',
    period: '/mo',
    description: 'For small employers testing the hiring workflow before upgrading.',
    features: [
      'Public employer profile',
      '1 active reviewed opportunity',
      'Basic applicant notifications',
      'Admin-reviewed listing quality',
    ],
    ctaLabel: 'Create employer account',
    ctaHref: '/employers/sign-up',
  },
  {
    name: 'Starter',
    price: '$99',
    period: '/mo',
    description: 'For trade businesses ready to post real jobs or apprenticeships.',
    features: [
      'Up to 3 active opportunities',
      'Applicant dashboard',
      'Basic readiness snapshot',
      'Employer profile management',
      'Email support',
    ],
    ctaLabel: 'Start employer plan',
    ctaHref: '/employers/sign-up',
    checkoutPlanId: 'employer-starter',
    featured: true,
  },
  {
    name: 'Pro',
    price: '$249',
    period: '/mo',
    description: 'For growing employers building a stronger skilled-trades pipeline.',
    features: [
      'Up to 10 active opportunities',
      'Featured listing eligibility',
      'Applicant pipeline tools',
      'Priority listing review',
      'Monthly performance summary',
    ],
    ctaLabel: 'Choose Pro',
    ctaHref: '/employers/sign-up',
    checkoutPlanId: 'employer-pro',
  },
  {
    name: 'Partner',
    price: 'Custom',
    period: '',
    description: 'For larger employers, associations, and regional hiring campaigns.',
    features: [
      'Expanded listing volume',
      'Custom hiring campaign',
      'Regional reporting',
      'Priority support',
      'Sponsored pathway options',
    ],
    ctaLabel: 'Discuss partnership',
    ctaHref: '/for-employers',
  },
]

const providerPlans = [
  {
    name: 'Claimed Profile',
    price: '$0',
    period: '/mo',
    description: 'For providers who want to claim and verify basic organization details.',
    features: [
      'Provider access request',
      'Admin-reviewed claim',
      'Basic public profile',
      'Basic program listings',
    ],
    ctaLabel: 'Request provider access',
    ctaHref: '/training-providers/claim',
  },
  {
    name: 'Growth',
    price: '$149',
    period: '/mo',
    description: 'For providers who want better visibility and tracked seeker interest.',
    features: [
      'Enhanced provider profile',
      'Program update tools',
      'Inquiry tracking',
      'Featured program eligibility',
      'Basic analytics',
    ],
    ctaLabel: 'Start provider plan',
    ctaHref: '/training-providers/claim',
    checkoutPlanId: 'provider-growth',
    featured: true,
  },
  {
    name: 'Pro',
    price: '$299',
    period: '/mo',
    description: 'For multi-program providers and workforce training organizations.',
    features: [
      'Multi-program management',
      'Priority review',
      'Inquiry export',
      'Program performance analytics',
      'Search visibility tools',
    ],
    ctaLabel: 'Choose Pro',
    ctaHref: '/training-providers/claim',
    checkoutPlanId: 'provider-pro',
  },
  {
    name: 'Regional Partner',
    price: 'Custom',
    period: '',
    description: 'For workforce boards, colleges, and regional pathway partners.',
    features: [
      'Regional pathway hub',
      'Sponsored landing pages',
      'Workforce reporting',
      'Multi-provider support',
      'Campaign support',
    ],
    ctaLabel: 'Discuss partnership',
    ctaHref: '/for-programs',
  },
]

type PricingPlan = {
  name: string
  price: string
  period: string
  description: string
  features: string[]
  ctaLabel: string
  ctaHref: string
  checkoutPlanId?: string
  featured?: boolean
}

type PricingCardProps = {
  plan: PricingPlan
}

function PricingCard({ plan }: PricingCardProps) {
  return (
    <article className={plan.featured ? 'card card-hover highlight-card relative p-7' : 'card card-hover relative p-7'}>
      {plan.featured && (
        <div className="absolute right-5 top-5">
          <span className="level-badge">
            <Sparkles className="h-3.5 w-3.5" />
            Best value
          </span>
        </div>
      )}

      <div className="pr-24">
        <h3 className="font-display text-2xl font-black tracking-tight text-[var(--text-primary)]">
          {plan.name}
        </h3>
      </div>

      <div className="mt-6 flex items-end gap-1">
        <span className="font-display text-4xl font-black tracking-tight text-[var(--text-primary)]">
          {plan.price}
        </span>
        {plan.period ? (
          <span className="pb-1 text-sm font-bold uppercase tracking-wide text-[var(--text-secondary)]">
            {plan.period}
          </span>
        ) : null}
      </div>

      <p className="mt-4 min-h-[4.5rem] text-sm leading-6 text-[var(--text-secondary)]">
        {plan.description}
      </p>

      <ul className="mt-7 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-6 text-[var(--text-secondary)]">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--cyan)]" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      {plan.checkoutPlanId ? (
        <form action="/api/billing/checkout" method="POST" className="mt-8">
          <input type="hidden" name="planId" value={plan.checkoutPlanId} />
          <button type="submit" className={plan.featured ? 'btn-primary w-full' : 'btn-outline w-full'}>
            {plan.ctaLabel}
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <Link href={plan.ctaHref} className={plan.featured ? 'btn-primary mt-8 w-full' : 'btn-outline mt-8 w-full'}>
          {plan.ctaLabel}
          <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </article>
  )
}

function PricingSection({
  eyebrow,
  title,
  description,
  plans,
}: {
  eyebrow: string
  title: string
  description: string
  plans: PricingPlan[]
}) {
  return (
    <section>
      <div className="max-w-3xl">
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="section-title mt-6">{title}</h2>
        <p className="lead-text mt-5">{description}</p>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => (
          <PricingCard key={`${eyebrow}-${plan.name}`} plan={plan} />
        ))}
      </div>
    </section>
  )
}

export default function PricingCards() {
  return (
    <div className="space-y-20">
      <PricingSection
        eyebrow="Employer pricing"
        title="Post reviewed opportunities and manage a stronger applicant pipeline."
        description="Employers can start free, then upgrade when they need more active listings, applicant review tools, readiness snapshots, and priority visibility."
        plans={employerPlans}
      />

      <PricingSection
        eyebrow="Provider pricing"
        title="Keep training programs accurate, visible, and connected to seekers."
        description="Training providers can claim a profile, manage program information, and upgrade for enhanced visibility, inquiry tracking, analytics, and regional partnership support."
        plans={providerPlans}
      />

      <section className="dark-panel p-8 md:p-12">
        <div className="dark-panel-content grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="eyebrow-dark">Workforce partnerships</p>
            <h2 className="section-title-dark mt-6">
              Need a local skilled-trades pathway hub or sponsored campaign?
            </h2>
            <p className="lead-text-dark mt-5">
              Workforce boards, associations, schools, and regional employers can sponsor pathway pages, local reporting, and hiring or training campaigns.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="mini-card flex gap-3">
              <Handshake className="mt-0.5 h-5 w-5 shrink-0 text-[var(--cyan)]" />
              <p className="text-sm leading-6 text-[var(--text-secondary)]">Regional pathway sponsorships</p>
            </div>
            <div className="mini-card flex gap-3">
              <BarChart3 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--cyan)]" />
              <p className="text-sm leading-6 text-[var(--text-secondary)]">Workforce reporting and insights</p>
            </div>
            <div className="mini-card flex gap-3">
              <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[var(--cyan)]" />
              <p className="text-sm leading-6 text-[var(--text-secondary)]">Verified employer and provider campaigns</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
