import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'

export default function BillingSuccessPage() {
  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <ThemedPublicSection className="py-20">
        <div className="section-shell">
          <section className="content-panel mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <h1 className="section-title mt-6">Payment received.</h1>
            <p className="lead-text mt-5">
              Your subscription checkout completed. Stripe will notify the
              platform and activate the billing record through the webhook.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/pricing" className="btn-outline">
                Back to pricing
              </Link>
              <Link href="/employers/dashboard" className="btn-primary">
                Go to dashboard
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </ThemedPublicSection>

      <SiteFooter />
    </ThemedPublicPage>
  )
}
