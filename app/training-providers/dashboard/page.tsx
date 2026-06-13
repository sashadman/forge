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
  FileText,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
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

type ProviderProfile = {
  id: string
  name: string
  slug: string
  city: string
  state: string
  verification_status: string
  contact_email: string | null
  website_url: string | null
}

type ProviderMembership = {
  id: string
  role: string
  status: string
  training_provider_profiles: ProviderProfile | ProviderProfile[] | null
}

type ConnectedProgram = {
  id: string
  slug: string
  name: string
  review_status: string
  is_active: boolean
  provider_profile_id: string | null
  updated_at: string
}

type ProgramUpdateRequest = {
  id: string
  provider_profile_id: string
  program_id: string
  request_type: string
  status: string
  created_at: string
}

type LooseQueryResult = Promise<{
  data: unknown
  error: { message: string } | null
}>

type LooseTable = {
  select: (columns: string) => {
    order: (
      column: string,
      options?: { ascending?: boolean }
    ) => LooseQueryResult
  }
}

type LooseSupabaseClient = {
  from: (table: string) => LooseTable
}

function asLooseSupabase(client: unknown) {
  return client as LooseSupabaseClient
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
        'Your request was approved. If an admin created your provider workspace, it appears below.',
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

function normalizeProviderProfile(
  membership: ProviderMembership
): ProviderProfile | null {
  const profile = membership.training_provider_profiles
  return Array.isArray(profile) ? profile[0] ?? null : profile
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
    .map(normalizeProviderProfile)
    .filter((profile): profile is ProviderProfile => Boolean(profile))

  const providerProfileIds = activeProviderProfiles.map((profile) => profile.id)

  const { data: connectedProgramsData, error: connectedProgramsError } =
    providerProfileIds.length > 0
      ? await supabase
          .from('programs')
          .select(
            `
            id,
            slug,
            name,
            review_status,
            is_active,
            provider_profile_id,
            updated_at
            `
          )
          .in('provider_profile_id', providerProfileIds)
          .order('updated_at', { ascending: false })
      : { data: [], error: null }

  if (connectedProgramsError) {
    console.error('Failed to load connected provider programs:', connectedProgramsError)
  }

  const { data: updateRequestsData, error: updateRequestsError } =
    await asLooseSupabase(supabase)
      .from('provider_program_update_requests')
      .select(
        `
        id,
        provider_profile_id,
        program_id,
        request_type,
        status,
        created_at
        `
      )
      .order('created_at', { ascending: false })

  if (updateRequestsError) {
    console.error('Failed to load provider program update requests:', updateRequestsError)
  }

  const connectedPrograms =
    ((connectedProgramsData ?? []) as unknown as ConnectedProgram[]).filter(
      (program) =>
        program.provider_profile_id &&
        providerProfileIds.includes(program.provider_profile_id)
    )

  const updateRequests =
    ((updateRequestsData ?? []) as unknown as ProgramUpdateRequest[]).filter(
      (request) => providerProfileIds.includes(request.provider_profile_id)
    )

  const publicProgramCount = connectedPrograms.filter(
    (program) => program.is_active
  ).length

  const pendingProgramCount = connectedPrograms.filter(
    (program) => program.review_status === 'pending'
  ).length

  const pendingUpdateRequestCount = updateRequests.filter(
    (request) => request.status === 'pending'
  ).length

  return (
    <ThemedPublicPage>
      <SiteNavbar />

      <section className="hero-dark">
        <div className="hero-fade" />

        <div className="section-shell relative py-20">
          <div className="max-w-4xl">
            <p className="eyebrow-dark">Training provider workspace</p>

            <h1 className="page-title-dark mt-6">
              Manage your provider operations.
            </h1>

            <p className="lead-text-dark mt-6 max-w-3xl">
              Track claims, connected programs, submitted updates, and next
              actions from one provider command center.
            </p>
          </div>
        </div>
      </section>

      <ThemedPublicSection className="pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <ProviderMetricCard
              icon={<Building2 className="h-7 w-7" />}
              label="Workspaces"
              value={`${activeProviderProfiles.length}`}
              description="Approved provider profiles connected to your account."
            />

            <ProviderMetricCard
              icon={<GraduationCap className="h-7 w-7" />}
              label="Connected programs"
              value={`${connectedPrograms.length}`}
              description={`${publicProgramCount} public listings connected.`}
            />

            <ProviderMetricCard
              icon={<FileText className="h-7 w-7" />}
              label="Update requests"
              value={`${updateRequests.length}`}
              description={`${pendingUpdateRequestCount} pending admin review.`}
            />

            <ProviderMetricCard
              icon={<Clock className="h-7 w-7" />}
              label="Pending programs"
              value={`${pendingProgramCount}`}
              description="Provider-submitted programs awaiting admin review."
            />
          </div>

          {activeProviderProfiles.length > 0 ? (
            <section className="mt-8 content-panel">
              <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                <div>
                  <p className="eyebrow">Approved provider workspace</p>

                  <h2 className="section-title mt-3">
                    Your provider workspace is active.
                  </h2>

                  <p className="muted-text mt-3 max-w-3xl">
                    You can now view connected programs, submit new programs,
                    and request corrections to claimed public listings. Public
                    changes still require admin review.
                  </p>
                </div>

              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-2">
                {activeProviderProfiles.map((providerProfile) => (
                  <div key={providerProfile.id} className="mini-card">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                        <Building2 className="h-6 w-6" />
                      </div>

                      <div>
                        <h3
                          className="text-xl font-bold"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {providerProfile.name}
                        </h3>

                        <p
                          className="mt-1 text-sm"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          {providerProfile.city}, {providerProfile.state} ·{' '}
                          {providerProfile.verification_status}
                        </p>

                        {providerProfile.contact_email && (
                          <p
                            className="mt-2 text-sm"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {providerProfile.contact_email}
                          </p>
                        )}

                        {providerProfile.website_url && (
                          <a
                            href={providerProfile.website_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-3 inline-flex text-sm font-semibold text-orange-700 hover:text-orange-800"
                          >
                            {providerProfile.website_url}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="mt-8 content-panel">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                  <FileCheck2 className="h-7 w-7" />
                </div>

                <div>
                  <p className="eyebrow">No active workspace yet</p>

                  <h2 className="section-title mt-3">
                    Submit or track a provider access request.
                  </h2>

                  <p className="muted-text mt-3 max-w-3xl">
                    Provider tools become available after admin review and
                    workspace creation. Submit a claim if you represent a real
                    provider or program.
                  </p>

                  <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                    <Link href="/training-providers/claim" className="btn-primary">
                      Submit provider claim
                      <ArrowRight className="h-4 w-4" />
                    </Link>

                    <Link href="/for-programs" className="btn-outline">
                      Learn provider workflow
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {latestClaim && (
            <section className="mt-8 content-panel">
              <p className="eyebrow">Latest provider request</p>

              <h2 className="section-title mt-3">
                {latestClaim.organization_name}
              </h2>

              <div className="mt-6">
                <ClaimStatusPanel claim={latestClaim} />
              </div>
            </section>
          )}

          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            <ProviderActionCard
              href="/training-providers/programs"
              icon={<GraduationCap className="h-7 w-7" />}
              title="Programs"
              description="View connected public listings and provider-submitted programs."
              action="Open programs"
            />

            <ProviderActionCard
              href="/training-providers/programs/new"
              icon={<FileText className="h-7 w-7" />}
              title="Submit program"
              description="Submit a new real training program for admin review."
              action="Submit program"
            />

            <ProviderActionCard
              href="/training-providers/profile"
              icon={<ShieldCheck className="h-7 w-7" />}
              title="Provider profile"
              description="Update your provider workspace profile information."
              action="Edit profile"
            />
          </section>
        </div>
      </ThemedPublicSection>
    </ThemedPublicPage>
  )
}

function ProviderMetricCard({
  icon,
  label,
  value,
  description,
}: {
  icon: React.ReactNode
  label: string
  value: string
  description: string
}) {
  return (
    <div className="content-panel">
      <div className="text-orange-600">{icon}</div>

      <p className="eyebrow mt-5">{label}</p>

      <p
        className="mt-3 text-3xl font-bold"
        style={{ color: 'var(--text-primary)' }}
      >
        {value}
      </p>

      <p className="muted-text mt-3">{description}</p>
    </div>
  )
}

function ClaimStatusPanel({ claim }: { claim: ProviderClaim }) {
  const statusConfig = getStatusConfig(claim.status)
  const StatusIcon = statusConfig.icon

  return (
    <div className={`rounded-3xl border p-5 ${statusConfig.panelClass}`}>
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${statusConfig.iconClass}`}
        >
          <StatusIcon className="h-6 w-6" />
        </div>

        <div>
          <p className="text-sm font-bold">{statusConfig.label}</p>

          <p className="mt-2 text-sm leading-6">{statusConfig.message}</p>

          <p className="mt-3 text-sm">
            Request type: {formatClaimType(claim.claim_type)}
          </p>

          {claim.program_names && (
            <p className="mt-2 whitespace-pre-line text-sm">
              Programs: {claim.program_names}
            </p>
          )}

          {claim.admin_notes && (
            <div className="mt-4 rounded-2xl bg-white/70 p-4 text-sm leading-6">
              <p className="font-bold">Admin notes</p>
              <p className="mt-1 whitespace-pre-line">{claim.admin_notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ProviderActionCard({
  href,
  icon,
  title,
  description,
  action,
}: {
  href: string
  icon: React.ReactNode
  title: string
  description: string
  action: string
}) {
  return (
    <Link
      href={href}
      className="group card card-hover p-6"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
        {icon}
      </div>

      <h2
        className="mt-5 text-2xl font-bold"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h2>

      <p className="muted-text mt-3">{description}</p>

      <span className="mt-6 inline-flex items-center gap-2 font-semibold text-orange-700 transition group-hover:text-orange-800">
        {action}
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </span>
    </Link>
  )
}
