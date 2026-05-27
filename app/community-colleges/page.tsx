import type { Metadata } from 'next'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import CommunityCollegeExplorer from '@/components/community-colleges/CommunityCollegeExplorer'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `California Community Colleges — ${siteConfig.name}`,
  description:
    'Explore California community colleges as potential skilled-trades training providers.',
}

export default async function CommunityCollegesPage() {
  const supabase = createClient()

  const { data: colleges, error } = await supabase
    .from('california_community_colleges')
    .select(
      `
      id,
      slug,
      name,
      district_name,
      city,
      state,
      region,
      county,
      website_url,
      notes
      `
    )
    .eq('is_active', true)
    .order('region', { ascending: true })
    .order('name', { ascending: true })

  if (error) {
    console.error('Failed to load California community colleges:', error)
  }

  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">California community colleges</p>

            <h1 className="page-title-dark mt-6">
              Explore public community colleges across California.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              This directory helps career seekers discover colleges that may
              offer workforce, career education, or skilled-trades pathways.
              Program details are added separately after verification.
            </p>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <div className="-mt-12">
            <CommunityCollegeExplorer colleges={colleges ?? []} />
          </div>
        </div>
      </ThemedPublicSection>

      <SiteFooter />
    </ThemedPublicPage>
  )
}