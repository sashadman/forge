create table if not exists public.training_sources (
  id uuid primary key default gen_random_uuid(),

  source_name text not null,
  source_slug text not null unique,
  source_type text not null,
  source_authority text not null,
  trust_level text not null default 'review_required',

  base_url text not null,
  source_state text,
  source_country text not null default 'US',

  institution_name text,
  institution_unit_id text,
  ope_id text,
  provider_name text,

  crawler_strategy text not null default 'manual',
  allowed_domains text[] not null default '{}',
  program_index_url text,
  api_endpoint text,

  crawl_status text not null default 'not_started',
  last_crawled_at timestamptz,
  last_successful_crawl_at timestamptz,
  last_error text,

  is_active boolean not null default true,
  admin_notes text,

  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint training_sources_source_type_check
    check (
      source_type in (
        'community_college',
        'technical_college',
        'college_scorecard',
        'ipeds',
        'registered_apprenticeship',
        'state_etpl',
        'state_workforce',
        'workforce_board',
        'provider_submitted',
        'other_verified'
      )
    ),

  constraint training_sources_source_authority_check
    check (
      source_authority in (
        'edu',
        'federal_gov',
        'state_gov',
        'local_gov',
        'provider_verified',
        'manual_review'
      )
    ),

  constraint training_sources_trust_level_check
    check (
      trust_level in (
        'auto_trusted',
        'trusted_source_review',
        'review_required',
        'blocked'
      )
    ),

  constraint training_sources_crawler_strategy_check
    check (
      crawler_strategy in (
        'manual',
        'official_api',
        'official_csv',
        'official_page_crawl',
        'sitemap',
        'provider_submission'
      )
    ),

  constraint training_sources_crawl_status_check
    check (
      crawl_status in (
        'not_started',
        'queued',
        'running',
        'completed',
        'failed',
        'paused'
      )
    )
);

create table if not exists public.program_import_runs (
  id uuid primary key default gen_random_uuid(),

  source_id uuid references public.training_sources(id) on delete set null,
  run_type text not null default 'manual',
  status text not null default 'queued',

  started_at timestamptz,
  finished_at timestamptz,

  records_found integer not null default 0,
  records_created integer not null default 0,
  records_updated integer not null default 0,
  records_rejected integer not null default 0,

  error_message text,
  metadata jsonb not null default '{}'::jsonb,

  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),

  constraint program_import_runs_run_type_check
    check (run_type in ('manual', 'scheduled', 'api', 'csv', 'crawler')),

  constraint program_import_runs_status_check
    check (status in ('queued', 'running', 'completed', 'failed', 'cancelled'))
);

create table if not exists public.training_program_candidates (
  id uuid primary key default gen_random_uuid(),

  source_id uuid references public.training_sources(id) on delete set null,
  import_run_id uuid references public.program_import_runs(id) on delete set null,

  external_id text,
  source_url text not null,
  source_domain text not null,

  title text not null,
  provider_name text not null,
  institution_name text,

  program_type text not null default 'workforce_program',
  trade_slug text not null default 'other',

  location text,
  state text,
  country text not null default 'US',

  duration text,
  cost text,
  description text,
  requirements text[],
  outcomes text[],

  cip_code text,
  occupation_code text,
  apprenticeship_occupation text,

  verification_status text not null default 'candidate',
  source_authority text not null default 'manual_review',
  trust_level text not null default 'review_required',
  confidence_score numeric(5,2) not null default 0,

  normalized_slug text,
  duplicate_of_candidate_id uuid references public.training_program_candidates(id) on delete set null,
  published_program_id uuid references public.programs(id) on delete set null,

  review_notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,

  raw_payload jsonb not null default '{}'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint training_program_candidates_program_type_check
    check (
      program_type in (
        'apprenticeship',
        'trade_school',
        'community_college',
        'workforce_program',
        'employer_training'
      )
    ),

  constraint training_program_candidates_verification_status_check
    check (
      verification_status in (
        'candidate',
        'trusted_candidate',
        'needs_review',
        'approved',
        'rejected',
        'published',
        'duplicate'
      )
    ),

  constraint training_program_candidates_source_authority_check
    check (
      source_authority in (
        'edu',
        'federal_gov',
        'state_gov',
        'local_gov',
        'provider_verified',
        'manual_review'
      )
    ),

  constraint training_program_candidates_trust_level_check
    check (
      trust_level in (
        'auto_trusted',
        'trusted_source_review',
        'review_required',
        'blocked'
      )
    )
);

create unique index if not exists training_sources_source_slug_idx
  on public.training_sources(source_slug);

create index if not exists training_sources_type_state_idx
  on public.training_sources(source_type, source_state);

create index if not exists training_sources_authority_idx
  on public.training_sources(source_authority);

create index if not exists training_sources_crawl_status_idx
  on public.training_sources(crawl_status);

create index if not exists training_program_candidates_source_idx
  on public.training_program_candidates(source_id);

create index if not exists training_program_candidates_import_run_idx
  on public.training_program_candidates(import_run_id);

create index if not exists training_program_candidates_status_idx
  on public.training_program_candidates(verification_status);

create index if not exists training_program_candidates_state_idx
  on public.training_program_candidates(state);

create index if not exists training_program_candidates_trade_idx
  on public.training_program_candidates(trade_slug);

create index if not exists training_program_candidates_published_program_idx
  on public.training_program_candidates(published_program_id);

create unique index if not exists training_program_candidates_source_url_idx
  on public.training_program_candidates(source_url);

create index if not exists program_import_runs_source_idx
  on public.program_import_runs(source_id);

create index if not exists program_import_runs_status_idx
  on public.program_import_runs(status);

alter table public.training_sources enable row level security;
alter table public.training_program_candidates enable row level security;
alter table public.program_import_runs enable row level security;

drop policy if exists "Public can read active training sources" on public.training_sources;
create policy "Public can read active training sources"
on public.training_sources
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can manage training sources" on public.training_sources;
create policy "Admins can manage training sources"
on public.training_sources
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can manage training program candidates" on public.training_program_candidates;
create policy "Admins can manage training program candidates"
on public.training_program_candidates
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can manage program import runs" on public.program_import_runs;
create policy "Admins can manage program import runs"
on public.program_import_runs
for all
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);