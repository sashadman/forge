import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Provider Request Submitted — ${siteConfig.name}`,
  description: 'Your training provider request has been submitted for review.',
}

export default function TrainingProviderClaimSuccessPage() {
  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <ThemedPublicSection className="py-20">
        <div className="section-shell">
          <section className="content-panel mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <p className="eyebrow mt-8">Request submitted</p>

            <h1 className="section-title mt-4">
              Your provider request is in review.
            </h1>

            <p className="muted-text mt-5">
              An admin can now review your organization, evidence, and requested
              access. Provider tools are only enabled after a real review.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/training-providers/dashboard" className="btn-primary">
                Track request status
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link href="/for-programs" className="btn-outline">
                Return to provider overview
              </Link>
            </div>
          </section>
        </div>
      </ThemedPublicSection>
    </ThemedPublicPage>
  )
}