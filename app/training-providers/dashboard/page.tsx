import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  AlertCircle,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  FileCheck2,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import SiteFooter from '@/components/layout/SiteFooter'
import ThemedPublicPage from '@/components/theme/ThemedPublicPage'
import ThemedPublicSection from '@/components/theme/ThemedPublicSection'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Training Provider Dashboard — ${siteConfig.name}`,
  description:
    'Review training provider request status and manage approved provider workspace access.',
}

type ProviderClaimStatus =
  | 'pending'
  | 'approved'
  | 'rejected'
  | 'needs_more_info'

type ProviderClaim = {
  id: string
  organization_name: string
  contact_name: string
  contact_email: string
  city: string
  state: string
  claim_type: string
  program_names: string | null
  evidence_summary: string
  requested_access: string | null
  status: ProviderClaimStatus
  admin_notes: string | null
  created_at: string
  reviewed_at: string | null
}

type ProviderMembership = {
  id: string
  role: string
  status: string
  training_provider_profiles:
    | {
        id: string
        name: string
        slug: string
        city: string
        state: string
        verification_status: string
        contact_email: string | null
        website_url: string | null
      }
    | {
        id: string
        name: string
        slug: string
        city: string
        state: string
        verification_status: string
        contact_email: string | null
        website_url: string | null
      }[]
    | null
}

function formatClaimType(value: string) {
  return value
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function getStatusConfig(status: ProviderClaimStatus) {
  if (status === 'approved') {
    return {
      label: 'Approved',
      icon: CheckCircle2,
      panelClass: 'border-emerald-200 bg-emerald-50 text-emerald-800',
      iconClass: 'bg-emerald-100 text-emerald-700',
      message:
        'Your request was approved. If an admin created your provider workspace, it will appear on this dashboard.',
    }
  }

  if (status === 'needs_more_info') {
    return {
      label: 'Needs more information',
      icon: AlertCircle,
      panelClass: 'border-orange-200 bg-orange-50 text-orange-800',
      iconClass: 'bg-orange-100 text-orange-700',
      message:
        'An admin needs more information before approving this provider request. Review the admin notes and submit a clearer request if needed.',
    }
  }

  if (status === 'rejected') {
    return {
      label: 'Rejected',
      icon: AlertCircle,
      panelClass: 'border-red-200 bg-red-50 text-red-800',
      iconClass: 'bg-red-100 text-red-700',
      message:
        'This request was not approved. You can review the notes and submit a new request with stronger evidence if appropriate.',
    }
  }

  return {
    label: 'Pending review',
    icon: Clock,
    panelClass: 'border-slate-200 bg-slate-50 text-slate-700',
    iconClass: 'bg-slate-100 text-slate-700',
    message:
      'Your request is waiting for admin review. Provider tools are not enabled until review is complete.',
  }
}

export default async function TrainingProviderDashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/sign-in')
  }

  const { data: memberships, error: membershipsError } = await supabase
    .from('training_provider_memberships')
    .select(
      `
      id,
      role,
      status,
      training_provider_profiles (
        id,
        name,
        slug,
        city,
        state,
        verification_status,
        contact_email,
        website_url
      )
      `
    )
    .eq('user_id', user.id)
    .eq('status', 'active')

  if (membershipsError) {
    console.error('Failed to load provider memberships:', membershipsError)
  }

  const { data: claims, error: claimsError } = await supabase
    .from('provider_claims')
    .select(
      `
      id,
      organization_name,
      contact_name,
      contact_email,
      city,
      state,
      claim_type,
      program_names,
      evidence_summary,
      requested_access,
      status,
      admin_notes,
      created_at,
      reviewed_at
      `
    )
    .eq('submitted_by', user.id)
    .order('created_at', { ascending: false })

  if (claimsError) {
    console.error('Failed to load provider claims:', claimsError)
  }

  const providerMemberships = (memberships ?? []) as ProviderMembership[]
  const providerClaims = (claims ?? []) as ProviderClaim[]
  const latestClaim = providerClaims[0]

  const activeProviderProfiles = providerMemberships
    .map((membership) => {
      const profile = membership.training_provider_profiles
      return Array.isArray(profile) ? profile[0] : profile
    })
    .filter(Boolean)

  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Training provider workspace</p>

            <h1 className="page-title-dark mt-6">
              Manage your provider access.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Track provider requests, view approved provider workspaces, and
              prepare for program-management tools.
            </p>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          {activeProviderProfiles.length > 0 && (
            <section className="-mt-12 content-panel">
              <p className="eyebrow">Approved provider workspace</p>

              <h2 className="section-title mt-3">
                Your verified provider profile is active.
              </h2>

              <p className="muted-text mt-3 max-w-3xl">
                Provider profile management is now available. Program submission
                and editing will come next.
              </p>

              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {activeProviderProfiles.map((providerProfile) => (
                  <div key={providerProfile.id} className="mini-card">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                        <Building2 className="h-6 w-6" />
                      </div>

                      <div>
                        <h3 className="text-xl font-bold text-slate-950">
                          {providerProfile.name}
                        </h3>

                        <p className="mt-1 text-sm text-slate-600">
                          {providerProfile.city}, {providerProfile.state} ·{' '}
                          {providerProfile.verification_status}
                        </p>

                        {providerProfile.contact_email && (
                          <p className="mt-2 text-sm text-slate-600">
                            {providerProfile.contact_email}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                      <Link
                        href="/training-providers/profile"
                        className="btn-primary"
                      >
                        Manage provider profile
                        <ArrowRight className="h-4 w-4" />
                      </Link>

                      <Link href="/for-programs#program-data" className="btn-outline">
                        Review program data
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {latestClaim ? (
            <div
              className={
                activeProviderProfiles.length > 0
                  ? 'mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]'
                  : '-mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]'
              }
            >
              <LatestClaimPanel claim={latestClaim} />
              <ProviderNextSteps
                claim={latestClaim}
                hasProviderWorkspace={activeProviderProfiles.length > 0}
              />
            </div>
          ) : (
            activeProviderProfiles.length === 0 && (
              <section className="-mt-12 content-panel text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <GraduationCap className="h-8 w-8" />
                </div>

                <p className="eyebrow mt-8">No provider request yet</p>

                <h2 className="section-title mt-4">
                  Start by requesting provider access.
                </h2>

                <p className="muted-text mx-auto mt-5 max-w-2xl">
                  Training providers need a verified request before program tools
                  are enabled. Submit organization details and evidence of
                  connection to begin.
                </p>

                <div className="mt-8 flex justify-center">
                  <Link href="/training-providers/claim" className="btn-primary">
                    Request provider access
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </section>
            )
          )}

          {providerClaims.length > 1 && (
            <section className="mt-8 content-panel">
              <p className="eyebrow">Request history</p>

              <h2 className="section-title mt-3">
                Previous provider requests
              </h2>

              <div className="mt-6 grid gap-4">
                {providerClaims.slice(1).map((claim) => (
                  <ClaimHistoryCard key={claim.id} claim={claim} />
                ))}
              </div>
            </section>
          )}
        </div>
      </ThemedPublicSection>

      <SiteFooter />
    </ThemedPublicPage>
  )
}

function LatestClaimPanel({ claim }: { claim: ProviderClaim }) {
  const statusConfig = getStatusConfig(claim.status)
  const StatusIcon = statusConfig.icon

  return (
    <section className="content-panel">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${statusConfig.iconClass}`}
        >
          <StatusIcon className="h-7 w-7" />
        </div>

        <div>
          <p className="eyebrow">Latest provider request</p>

          <h2 className="section-title mt-3">{claim.organization_name}</h2>

          <p className="muted-text mt-3">
            Submitted by {claim.contact_name} for {claim.city}, {claim.state}.
          </p>
        </div>
      </div>

      <div className={`mt-8 rounded-2xl border p-5 ${statusConfig.panelClass}`}>
        <p className="font-bold">{statusConfig.label}</p>
        <p className="mt-2 text-sm leading-6">{statusConfig.message}</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <DetailCard label="Request type" value={formatClaimType(claim.claim_type)} />
        <DetailCard
          label="Submitted"
          value={new Date(claim.created_at).toLocaleDateString()}
        />
        <DetailCard label="Contact email" value={claim.contact_email} />
        <DetailCard
          label="Reviewed"
          value={
            claim.reviewed_at
              ? new Date(claim.reviewed_at).toLocaleDateString()
              : 'Not reviewed yet'
          }
        />
      </div>

      {claim.program_names && (
        <div className="mt-6 mini-card">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Program names
          </p>

          <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
            {claim.program_names}
          </p>
        </div>
      )}

      {claim.requested_access && (
        <div className="mt-6 mini-card">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
            Requested access
          </p>

          <p className="mt-2 whitespace-pre-line leading-7 text-slate-700">
            {claim.requested_access}
          </p>
        </div>
      )}

      {claim.admin_notes && (
        <div className="mt-6 rounded-2xl border border-orange-200 bg-orange-50 p-5">
          <p className="text-sm font-bold text-orange-900">Admin notes</p>

          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-orange-800">
            {claim.admin_notes}
          </p>
        </div>
      )}
    </section>
  )
}

function ProviderNextSteps({
  claim,
  hasProviderWorkspace,
}: {
  claim: ProviderClaim
  hasProviderWorkspace: boolean
}) {
  const isApproved = claim.status === 'approved'
  const needsMoreInfo = claim.status === 'needs_more_info'
  const isRejected = claim.status === 'rejected'

  return (
    <aside className="space-y-6">
      <section className="content-panel">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
          <ShieldCheck className="h-7 w-7" />
        </div>

        <h2 className="section-title mt-6">What happens next?</h2>

        <div className="mt-6 grid gap-4">
          <StepItem
            complete
            title="Provider request submitted"
            description="Your organization and evidence were sent for review."
          />

          <StepItem
            complete={isApproved}
            title="Admin review"
            description="An admin checks whether the provider or program request is legitimate."
          />

          <StepItem
            complete={hasProviderWorkspace}
            title="Provider workspace"
            description="Approved providers get a secured profile and membership before program editing begins."
          />
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {hasProviderWorkspace ? (
            <Link href="/training-providers/profile" className="btn-primary">
              Manage provider profile
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : isApproved ? (
            <Link href="/for-programs#provider-insights" className="btn-primary">
              Review future provider tools
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : needsMoreInfo || isRejected ? (
            <Link href="/training-providers/claim" className="btn-primary">
              Submit a new request
              <ArrowRight className="h-4 w-4" />
            </Link>
          ) : (
            <Link href="/for-programs" className="btn-outline">
              Review provider workflow
            </Link>
          )}
        </div>
      </section>

      <section className="dark-panel p-6">
        <div className="dark-panel-content">
          <FileCheck2 className="h-8 w-8 text-orange-300" />

          <h3 className="mt-5 text-2xl font-bold">
            Program editing comes next
          </h3>

          <p className="mt-3 leading-7 text-slate-300">
            This sprint creates verified provider ownership. Program submission
            and editing should be built on top of this membership foundation.
          </p>
        </div>
      </section>
    </aside>
  )
}

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-card">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function StepItem({
  complete,
  title,
  description,
}: {
  complete: boolean
  title: string
  description: string
}) {
  return (
    <div className="flex gap-3">
      <div
        className={
          complete
            ? 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700'
            : 'flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500'
        }
      >
        {complete ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Clock className="h-4 w-4" />
        )}
      </div>

      <div>
        <p className="font-bold text-slate-950">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </div>
  )
}

function ClaimHistoryCard({ claim }: { claim: ProviderClaim }) {
  const statusConfig = getStatusConfig(claim.status)

  return (
    <div className="mini-card">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="font-bold text-slate-950">{claim.organization_name}</p>

          <p className="mt-1 text-sm text-slate-600">
            {formatClaimType(claim.claim_type)} ·{' '}
            {new Date(claim.created_at).toLocaleDateString()}
          </p>
        </div>

        <span
          className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${statusConfig.panelClass}`}
        >
          {statusConfig.label}
        </span>
      </div>
    </div>
  )
}