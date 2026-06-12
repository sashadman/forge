import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Circle,
  Clock3,
  ExternalLink,
  FileCheck2,
  MapPin,
  ShieldCheck,
  UsersRound,
  XCircle,
} from 'lucide-react'
import SiteNavbar from '@/components/layout/SiteNavbar'
import PageHero from '@/components/ui/PageHero'
import EmptyState from '@/components/ui/EmptyState'
import NextStepPanel from '@/components/ui/NextStepPanel'
import { createClient } from '@/lib/supabase/server'
import { siteConfig } from '@/config/site'

export const metadata: Metadata = {
  title: `Employer Dashboard — ${siteConfig.name}`,
  description: 'Manage your employer profile, applicant reviews, and job listings.',
}

type EmployerSubmission = {
  id: string
  title: string
  opportunity_type: string
  trade_slug: string
  location: string
  state: string
  pay_range: string | null
  schedule: string | null
  description: string
  status: string
  admin_notes: string | null
  approved_opportunity_id: string | null
  created_at: string
  updated_at: string
}

function formatOpportunityType(type: string) {
  return type
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString()
}

function getSubmissionStatusMeta(status: string) {
  switch (status) {
    case 'approved':
      return {
        label: 'Approved',
        className: 'badge-orange',
        icon: <CheckCircle2 className="h-4 w-4" />,
        description: 'Approved by admin and ready to appear as a public listing.',
      }
    case 'rejected':
      return {
        label: 'Needs revision',
        className: 'rounded-full bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-red-700 ring-1 ring-red-200',
        icon: <XCircle className="h-4 w-4" />,
        description: 'Reviewed by admin. Check the note and submit an improved listing.',
      }
    case 'draft':
      return {
        label: 'Draft',
        className: 'badge-slate',
        icon: <Circle className="h-4 w-4" />,
        description: 'Saved but not submitted for admin review.',
      }
    case 'archived':
      return {
        label: 'Archived',
        className: 'badge-slate',
        icon: <Circle className="h-4 w-4" />,
        description: 'Archived and no longer part of the active review workflow.',
      }
    case 'submitted':
    default:
      return {
        label: 'Submitted',
        className: 'rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-blue-700 ring-1 ring-blue-200',
        icon: <Clock3 className="h-4 w-4" />,
        description: 'Waiting for admin review before it can appear publicly.',
      }
  }
}

export default async function EmployerDashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/employers/sign-in')
  }

  const { data: employer } = await supabase
    .from('employers')
    .select(
      `
      id,
      name,
      slug,
      description,
      industry,
      location,
      state,
      website_url,
      contact_email,
      linkedin_url,
      instagram_url,
      facebook_url,
      x_url,
      youtube_url,
      tiktok_url,
      other_social_url,
      is_verified,
      is_active,
      opportunities (
        id,
        title,
        slug,
        opportunity_type,
        trade_slug,
        location,
        state,
        schedule,
        pay_range,
        description,
        is_active,
        created_at
      )
    `
    )
    .eq('owner_id', user.id)
    .eq('is_active', true)
    .maybeSingle()

  if (!employer) {
    redirect('/employers/new')
  }

  const [{ count: applicationCount }, { data: submissionData }] =
    await Promise.all([
      supabase
        .from('applications')
        .select('id', { count: 'exact', head: true })
        .eq('employer_id', employer.id),

      supabase
        .from('employer_opportunity_submissions')
        .select(
          `
          id,
          title,
          opportunity_type,
          trade_slug,
          location,
          state,
          pay_range,
          schedule,
          description,
          status,
          admin_notes,
          approved_opportunity_id,
          created_at,
          updated_at
          `
        )
        .eq('employer_id', employer.id)
        .order('created_at', { ascending: false }),
    ])

  const submissions = (submissionData ?? []) as EmployerSubmission[]

  const activeOpportunities =
    employer.opportunities?.filter((opportunity) => opportunity.is_active) ?? []

  const inactiveOpportunities =
    employer.opportunities?.filter((opportunity) => !opportunity.is_active) ?? []

  const pendingSubmissions = submissions.filter(
    (submission) => submission.status === 'submitted'
  )

  const rejectedSubmissions = submissions.filter(
    (submission) => submission.status === 'rejected'
  )

  const approvedSubmissions = submissions.filter(
    (submission) => submission.status === 'approved'
  )

  const hasSocialLink = Boolean(
    employer.linkedin_url ||
      employer.instagram_url ||
      employer.facebook_url ||
      employer.x_url ||
      employer.youtube_url ||
      employer.tiktok_url ||
      employer.other_social_url
  )

  const completenessItems = [
    {
      label: 'Company description',
      complete: employer.description.trim().length >= 80,
      helpText: 'Add a clear company description so seekers understand who you are.',
    },
    {
      label: 'Website',
      complete: Boolean(employer.website_url),
      helpText: 'Add your company website for credibility.',
    },
    {
      label: 'Contact email',
      complete: Boolean(employer.contact_email),
      helpText: 'Add a contact email for follow-up.',
    },
    {
      label: 'Location',
      complete: Boolean(employer.location && employer.state),
      helpText: 'Confirm your city and state.',
    },
    {
      label: 'Social link',
      complete: hasSocialLink,
      helpText: 'Add at least one active social or professional link.',
    },
    {
      label: 'Verification',
      complete: employer.is_verified,
      helpText: 'Admin verification improves trust.',
    },
    {
      label: 'Active jobs & apprenticeships',
      complete: activeOpportunities.length > 0,
      helpText: 'Add a real job or apprenticeship when available.',
    },
  ]

  const completedItems = completenessItems.filter((item) => item.complete).length
  const completenessScore = Math.round(
    (completedItems / completenessItems.length) * 100
  )

  return (
    <main className="page-shell">
      <SiteNavbar />

      <PageHero
        eyebrow="Employer dashboard"
        title="Manage your employer presence with a clear hiring workflow."
        description={`Review ${employer.name}, manage submitted opportunities, and follow up with applicants through one employer workspace.`}
      />

      <section className="section-light pb-20">
        <div className="section-shell">
          <div className="-mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <EmployerMetricCard
              label="Active listings"
              value={activeOpportunities.length}
              icon={<BriefcaseBusiness className="h-7 w-7" />}
            />

            <EmployerMetricCard
              label="Pending review"
              value={pendingSubmissions.length}
              icon={<Clock3 className="h-7 w-7" />}
            />

            <EmployerMetricCard
              label="Applications"
              value={applicationCount ?? 0}
              icon={<UsersRound className="h-7 w-7" />}
            />

            <EmployerMetricCard
              label="Profile quality"
              value={`${completenessScore}%`}
              icon={<ShieldCheck className="h-7 w-7" />}
            />
          </div>

          <div className="mt-8">
            <NextStepPanel
              title={
                rejectedSubmissions.length > 0
                  ? 'Revise rejected submissions before adding more listings.'
                  : pendingSubmissions.length > 0
                    ? 'Your submitted opportunities are waiting for review.'
                    : applicationCount && applicationCount > 0
                      ? 'Review applicants and keep your hiring pipeline moving.'
                      : 'Submit a real opportunity when you are ready to receive applicants.'
              }
              description={
                rejectedSubmissions.length > 0
                  ? 'Admin feedback is available below. Improve the submission, then resubmit a stronger listing for review.'
                  : pendingSubmissions.length > 0
                    ? 'Submitted listings do not appear publicly until admin approval. You can continue improving your employer profile while review is pending.'
                    : applicationCount && applicationCount > 0
                      ? 'Applications are waiting for review. Start there before adding more listings.'
                      : 'A strong employer profile and one real job or apprenticeship submission are the best next steps for attracting serious applicants.'
              }
              primaryHref={
                applicationCount && applicationCount > 0
                  ? '/employers/applications'
                  : '/employers/opportunities/new'
              }
              primaryLabel={
                applicationCount && applicationCount > 0
                  ? 'Review applications'
                  : 'Submit opportunity'
              }
              secondaryHref="/employers/profile"
              secondaryLabel="Improve profile"
              icon={<UsersRound className="h-6 w-6" />}
            />
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <aside className="space-y-6">
              <section className="content-panel">
                <p className="eyebrow">Employer profile</p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                  {employer.name}
                </h2>

                {employer.industry && (
                  <p className="mt-2 font-semibold text-slate-600">
                    {employer.industry}
                  </p>
                )}

                <p className="muted-text mt-5 line-clamp-4">
                  {employer.description}
                </p>

                <div className="mt-6 space-y-4">
                  <DetailItem
                    icon={<MapPin className="h-5 w-5" />}
                    label="Location"
                    value={`${employer.location}, ${employer.state}`}
                  />

                  <DetailItem
                    icon={<ShieldCheck className="h-5 w-5" />}
                    label="Verification"
                    value={employer.is_verified ? 'Verified' : 'Not verified yet'}
                  />

                  <DetailItem
                    icon={<BriefcaseBusiness className="h-5 w-5" />}
                    label="Public listings"
                    value={`${activeOpportunities.length}`}
                  />

                  <DetailItem
                    icon={<FileCheck2 className="h-5 w-5" />}
                    label="Review submissions"
                    value={`${submissions.length}`}
                  />
                </div>

                <div className="mt-8 grid gap-3">
                  <Link href={`/employers/${employer.slug}`} className="btn-dark w-full">
                    View public profile
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  <Link href="/employers/opportunities/new" className="btn-primary w-full">
                    Submit opportunity
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link href="/employers/profile" className="btn-outline w-full">
                    Edit employer profile
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link href="/employers/applications" className="btn-outline w-full">
                    Review applications
                    <UsersRound className="h-4 w-4" />
                  </Link>
                </div>
              </section>

              <section className="content-panel">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Profile quality</p>

                    <h3 className="mt-3 text-2xl font-bold tracking-tight text-slate-950">
                      {completenessScore}% complete
                    </h3>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-lg font-bold text-orange-700">
                    {completenessScore}%
                  </div>
                </div>

                <p className="muted-text mt-4">
                  Strong employer profiles build trust with career seekers and make
                  listings easier to evaluate.
                </p>

                <div className="mt-6 space-y-3">
                  {completenessItems.map((item) => (
                    <CompletenessItem
                      key={item.label}
                      label={item.label}
                      helpText={item.helpText}
                      complete={item.complete}
                    />
                  ))}
                </div>

                <Link href="/employers/profile" className="btn-outline mt-6 w-full">
                  Improve profile
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </section>
            </aside>

            <div className="space-y-8">
              <section className="content-panel">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="eyebrow">Review queue</p>

                    <h2 className="section-title mt-3">
                      Submitted opportunities
                    </h2>

                    <p className="muted-text mt-3 max-w-2xl">
                      Employer-submitted opportunities appear here first. They
                      become public only after admin approval.
                    </p>
                  </div>

                  <Link href="/employers/opportunities/new" className="btn-primary">
                    Submit opportunity
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                {submissions.length > 0 ? (
                  <div className="mt-8 grid gap-5">
                    {submissions.map((submission) => (
                      <EmployerSubmissionCard
                        key={submission.id}
                        submission={submission}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mt-8">
                    <EmptyState
                      icon={<FileCheck2 className="h-6 w-6" />}
                      title="No submitted opportunities yet"
                      description="Submit your first real job, apprenticeship, trainee role, or pre-apprenticeship for admin review. It will stay private until approved."
                      primaryHref="/employers/opportunities/new"
                      primaryLabel="Submit opportunity"
                      secondaryHref="/employers/profile"
                      secondaryLabel="Improve profile first"
                    />
                  </div>
                )}
              </section>

              <section className="content-panel">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <p className="eyebrow">Public listings</p>

                    <h2 className="section-title mt-3">
                      Approved jobs & apprenticeships
                    </h2>

                    <p className="muted-text mt-3 max-w-2xl">
                      These listings appear in the public Jobs & Apprenticeships
                      directory. Keep them real, current, and easy for applicants
                      to understand.
                    </p>
                  </div>
                </div>

                {activeOpportunities.length > 0 ? (
                  <div className="mt-8 grid gap-5">
                    {activeOpportunities.map((opportunity) => (
                      <div key={opportunity.id} className="card bg-slate-50">
                        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                          <div>
                            <span className="badge-orange">
                              {formatOpportunityType(opportunity.opportunity_type)}
                            </span>

                            <h3 className="mt-4 text-2xl font-bold text-slate-950">
                              {opportunity.title}
                            </h3>

                            <p className="mt-2 font-semibold text-slate-600">
                              {opportunity.trade_slug}
                            </p>
                          </div>

                          <span className="badge-slate">Public</span>
                        </div>

                        <p className="muted-text mt-5 line-clamp-3">
                          {opportunity.description}
                        </p>

                        <div className="mt-6 grid gap-3 sm:grid-cols-3">
                          <MiniDetail
                            label="Location"
                            value={`${opportunity.location}, ${opportunity.state}`}
                          />

                          <MiniDetail
                            label="Schedule"
                            value={opportunity.schedule || 'See listing'}
                          />

                          <MiniDetail
                            label="Pay range"
                            value={opportunity.pay_range || 'See listing'}
                          />
                        </div>

                        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                          <Link
                            href={`/opportunities/${opportunity.slug}`}
                            className="btn-dark px-5 py-3 text-sm"
                          >
                            View public listing
                            <ExternalLink className="h-4 w-4" />
                          </Link>

                          <Link
                            href={`/employers/opportunities/${opportunity.id}/edit`}
                            className="btn-outline px-5 py-3 text-sm"
                          >
                            Edit listing
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-8">
                    <EmptyState
                      icon={<BriefcaseBusiness className="h-6 w-6" />}
                      title={
                        approvedSubmissions.length > 0
                          ? 'Approved listings will appear here soon'
                          : 'No approved public listings yet'
                      }
                      description={
                        approvedSubmissions.length > 0
                          ? 'You have approved submissions. Once they are connected to public listings, they will show here.'
                          : 'Submit a real opportunity for review. Once approved, it will become a public listing.'
                      }
                      primaryHref="/employers/opportunities/new"
                      primaryLabel="Submit opportunity"
                      secondaryHref="/employers/profile"
                      secondaryLabel="Improve profile first"
                    />
                  </div>
                )}
              </section>

              {inactiveOpportunities.length > 0 && (
                <section className="content-panel">
                  <p className="eyebrow">Inactive listings</p>

                  <h2 className="section-title mt-3">Hidden job listings</h2>

                  <p className="muted-text mt-3 max-w-2xl">
                    These listings are not currently active in the public directory.
                    Edit a listing if it should be made useful and public again.
                  </p>

                  <div className="mt-8 grid gap-4">
                    {inactiveOpportunities.map((opportunity) => (
                      <div key={opportunity.id} className="mini-card">
                        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                          <div>
                            <p className="font-bold text-slate-950">
                              {opportunity.title}
                            </p>
                            <p className="mt-1 text-sm text-slate-600">
                              {formatOpportunityType(opportunity.opportunity_type)} ·{' '}
                              {opportunity.trade_slug}
                            </p>
                          </div>

                          <Link
                            href={`/employers/opportunities/${opportunity.id}/edit`}
                            className="btn-outline px-5 py-3 text-sm"
                          >
                            Review listing
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

function EmployerSubmissionCard({
  submission,
}: {
  submission: EmployerSubmission
}) {
  const statusMeta = getSubmissionStatusMeta(submission.status)

  return (
    <article className="card bg-slate-50">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="badge-orange">
              {formatOpportunityType(submission.opportunity_type)}
            </span>

            <span className={statusMeta.className}>
              <span className="inline-flex items-center gap-2">
                {statusMeta.icon}
                {statusMeta.label}
              </span>
            </span>
          </div>

          <h3 className="mt-4 text-2xl font-bold text-slate-950">
            {submission.title}
          </h3>

          <p className="mt-2 font-semibold text-slate-600">
            {submission.trade_slug}
          </p>
        </div>

        <p className="text-sm font-semibold text-slate-500">
          Submitted {formatDate(submission.created_at)}
        </p>
      </div>

      <p className="muted-text mt-5 line-clamp-3">{submission.description}</p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <MiniDetail
          label="Location"
          value={`${submission.location}, ${submission.state}`}
        />

        <MiniDetail
          label="Schedule"
          value={submission.schedule || 'See listing'}
        />

        <MiniDetail
          label="Pay range"
          value={submission.pay_range || 'See listing'}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4">
        <p className="font-semibold text-slate-950">{statusMeta.description}</p>

        {submission.admin_notes && (
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Admin note: {submission.admin_notes}
          </p>
        )}
      </div>
    </article>
  )
}

function EmployerMetricCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number | string
  icon: React.ReactNode
}) {
  return (
    <div className="content-panel">
      <div className="text-orange-600">{icon}</div>
      <p className="eyebrow mt-5">{label}</p>
      <h2 className="mt-3 text-3xl font-bold text-slate-950">{value}</h2>
    </div>
  )
}

function DetailItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="mini-card">
      <div className="flex items-center gap-2 text-slate-500">
        {icon}
        <p className="text-xs font-semibold uppercase tracking-wide">{label}</p>
      </div>

      <p className="mt-2 font-semibold text-slate-950">{value}</p>
    </div>
  )
}

function MiniDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="mini-card-white">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 font-bold text-slate-950">{value}</p>
    </div>
  )
}

function CompletenessItem({
  label,
  helpText,
  complete,
}: {
  label: string
  helpText: string
  complete: boolean
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex items-start gap-3">
        {complete ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-600" />
        ) : (
          <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
        )}

        <div>
          <p className="font-semibold text-slate-950">{label}</p>
          <p className="mt-1 text-sm leading-6 text-slate-500">{helpText}</p>
        </div>
      </div>
    </div>
  )
}
