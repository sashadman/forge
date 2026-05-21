import type { Metadata } from 'next'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
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

  return (
    <main className="page-shell">
      <SiteNavbar />

      <OpportunityHero opportunity={opportunity} employer={employer} />

      <section className="section-light pb-20">
        <div className="section-shell grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="-mt-12 space-y-8">
            <OpportunityOverview opportunity={opportunity} />

            <OpportunityRequirements opportunity={opportunity} />

            <EmployerSummaryCard employer={employer} />
          </div>

          <aside className="-mt-12 space-y-6">
            <OpportunityDetailsCard
              opportunity={opportunity}
              employer={employer}
            />

            <OpportunityApplicationPanel
              opportunityId={opportunity.id}
              applicationUrl={opportunity.application_url}
              userIsSignedIn={Boolean(user)}
              readinessScore={readinessScore}
              introMessageTemplate={introMessageTemplate}
              existingApplication={existingApplication}
            />

            <OpportunityPreparationCard />
          </aside>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}