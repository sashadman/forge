import type { Metadata } from 'next'
import { BriefcaseBusiness, GraduationCap, Send, ShieldCheck } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import NextStepPanel from '@/components/ui/NextStepPanel'
import OpportunityHero from '@/components/opportunities/detail/OpportunityHero'
import OpportunityOverview from '@/components/opportunities/detail/OpportunityOverview'
import OpportunityRequirements from '@/components/opportunities/detail/OpportunityRequirements'
import EmployerSummaryCard from '@/components/opportunities/detail/EmployerSummaryCard'
import OpportunityDetailsCard from '@/components/opportunities/detail/OpportunityDetailsCard'
import OpportunityApplicationPanel from '@/components/opportunities/detail/OpportunityApplicationPanel'
import OpportunityPreparationCard from '@/components/opportunities/detail/OpportunityPreparationCard'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
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
      title: `Job or Apprenticeship Not Found — ${siteConfig.name}`,
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
        title: 'You already submitted an application for this listing.',
        description:
          'Track your application from the dashboard and keep your readiness profile current while the employer reviews your submission.',
        primaryHref: '/dashboard',
        primaryLabel: 'Track application',
        secondaryHref: '/opportunities',
        secondaryLabel: 'Find more jobs & apprenticeships',
        icon: <Send className="h-6 w-6" />,
      }
    }

    if (
      opportunity.verification_status === 'source_verified' ||
      opportunity.verification_status === 'admin_reviewed'
    ) {
      return {
        title: 'This external opportunity opens on the original application site.',
        description:
          'Ara Skills helps you discover it, but the application happens through the employer or partner hiring page. Review the source and apply details before leaving the platform.',
        primaryHref: '#apply',
        primaryLabel: 'Review apply details',
        secondaryHref: '/opportunities',
        secondaryLabel: 'Compare more jobs & apprenticeships',
        icon: <BriefcaseBusiness className="h-6 w-6" />,
      }
    }

    if (!user) {
      return {
        title: 'Sign in before applying so your progress is saved.',
        description:
          'A signed-in account lets you save jobs or apprenticeships, submit an application, and track your application status from your dashboard.',
        primaryHref: '/auth/sign-in',
        primaryLabel: 'Sign in to apply',
        secondaryHref: '/opportunities',
        secondaryLabel: 'Back to jobs & apprenticeships',
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
        secondaryLabel: 'Compare training programs',
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
      secondaryLabel: 'Compare more jobs & apprenticeships',
      icon: <BriefcaseBusiness className="h-6 w-6" />,
    }
  })()

  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <OpportunityHero opportunity={opportunity} employer={employer} />

      <ThemedPublicSection className="pb-20">
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
                  externalUrl={opportunity.external_url}
                  sourceName={opportunity.source_name}
                  verificationStatus={opportunity.verification_status}
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
      </ThemedPublicSection>
    </ThemedPublicPage>
  )
}
