import type { Metadata } from 'next'
import { BriefcaseBusiness, GraduationCap, Send, ShieldCheck } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import NextStepPanel from '@/components/ui/NextStepPanel'
import OpportunityHero from '@/components/opportunities/detail/OpportunityHero'
import OpportunityOverview from '@/components/opportunities/detail/OpportunityOverview'
import OpportunityRequirements from '@/components/opportunities/detail/OpportunityRequirements'
import EmployerSummaryCard from '@/components/opportunities/detail/EmployerSummaryCard'
import OpportunityDetailsCard from '@/components/opportunities/detail/OpportunityDetailsCard'
import OpportunityApplicationPanel from '@/components/opportunities/detail/OpportunityApplicationPanel'
import OpportunityPreparationCard from '@/components/opportunities/detail/OpportunityPreparationCard'
import {
  getOpportunityDetailPageData,
  getOpportunityMetadataData,
} from '@/lib/opportunities/get-opportunity-detail-data'
import { siteConfig } from '@/config/site'

type PageProps = {
  params: {
    slug: string
  }
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const metadata = await getOpportunityMetadataData(params.slug)

  if (!metadata) {
    return {
      title: `Opportunity Not Found — ${siteConfig.name}`,
    }
  }

  return {
    title: `${metadata.title} — ${siteConfig.name}`,
    description: `${metadata.employerName}: ${metadata.description}`,
  }
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const {
    user,
    opportunity,
    employer,
    existingApplication,
    readinessScore,
    introMessageTemplate,
  } = await getOpportunityDetailPageData(params.slug)

  const hasActiveApplication = Boolean(
    existingApplication && existingApplication.status !== 'withdrawn'
  )

  const nextStep = (() => {
    if (hasActiveApplication) {
      return {
        title: 'You already submitted an application for this opportunity.',
        description:
          'Track your application from the dashboard and keep your readiness profile current while the employer reviews your submission.',
        primaryHref: '/dashboard',
        primaryLabel: 'Track application',
        secondaryHref: '/opportunities',
        secondaryLabel: 'Find more opportunities',
        icon: <Send className="h-6 w-6" />,
      }
    }

    if (!user) {
      return {
        title: 'Sign in before applying so your progress is saved.',
        description:
          'A signed-in account lets you save opportunities, submit an application, and track your application status from your dashboard.',
        primaryHref: '/auth/sign-in',
        primaryLabel: 'Sign in to apply',
        secondaryHref: '/opportunities',
        secondaryLabel: 'Back to opportunities',
        icon: <ShieldCheck className="h-6 w-6" />,
      }
    }

    if (readinessScore < 80) {
      return {
        title: 'Improve your readiness before submitting a serious application.',
        description:
          'You can still apply, but completing your readiness profile first will create a stronger application snapshot.',
        primaryHref: '/dashboard/readiness',
        primaryLabel: 'Improve readiness',
        secondaryHref: '/programs',
        secondaryLabel: 'Explore training',
        icon: <GraduationCap className="h-6 w-6" />,
      }
    }

    return {
      title: 'Review the details, then apply when this is a real fit.',
      description:
        'You look ready to apply. Confirm the requirements, employer, location, and application details before submitting.',
      primaryHref: '#apply',
      primaryLabel: 'Go to application panel',
      secondaryHref: '/opportunities',
      secondaryLabel: 'Compare more listings',
      icon: <BriefcaseBusiness className="h-6 w-6" />,
    }
  })()

  return (
    <main className="page-shell">
      <SiteNavbar />

      <OpportunityHero opportunity={opportunity} employer={employer} />

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <NextStepPanel
              title={nextStep.title}
              description={nextStep.description}
              primaryHref={nextStep.primaryHref}
              primaryLabel={nextStep.primaryLabel}
              secondaryHref={nextStep.secondaryHref}
              secondaryLabel={nextStep.secondaryLabel}
              icon={nextStep.icon}
            />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-8">
              <OpportunityOverview opportunity={opportunity} />

              <OpportunityRequirements opportunity={opportunity} />

              <EmployerSummaryCard employer={employer} />
            </div>

            <aside className="space-y-6">
              <OpportunityDetailsCard
                opportunity={opportunity}
                employer={employer}
              />

              <div id="apply">
                <OpportunityApplicationPanel
                  opportunityId={opportunity.id}
                  applicationUrl={opportunity.application_url}
                  userIsSignedIn={Boolean(user)}
                  readinessScore={readinessScore}
                  introMessageTemplate={introMessageTemplate}
                  existingApplication={existingApplication}
                />
              </div>

              <OpportunityPreparationCard />
            </aside>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}