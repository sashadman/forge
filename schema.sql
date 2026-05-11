-- ─────────────────────────────────────────────
-- FORGE PLATFORM — Supabase Database Schema
-- Run this in your Supabase SQL Editor
-- ─────────────────────────────────────────────

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for full-text search

-- ── Enums ────────────────────────────────────

create type user_role as enum ('seeker', 'employer', 'program', 'admin');
create type trade_category as enum (
  'electrical', 'hvac', 'plumbing', 'welding', 'solar',
  'construction', 'carpentry', 'masonry', 'roofing',
  'painting', 'landscaping', 'automotive'
);
create type program_type as enum (
  'trade_school', 'community_college', 'apprenticeship',
  'union', 'nonprofit', 'bootcamp', 'workforce_dev'
);
create type job_type as enum ('full_time', 'part_time', 'apprenticeship', 'internship', 'contract');
create type experience_level as enum ('no_experience', 'some_experience', 'experienced');
create type experience_required as enum ('entry', 'junior', 'mid', 'senior');
create type application_status as enum (
  'submitted', 'viewed', 'interested', 'contacted',
  'interview_scheduled', 'hired', 'rejected', 'withdrawn'
);
create type subscription_tier as enum ('free', 'starter', 'pro', 'enterprise');
create type org_type as enum ('employer', 'program');
create type credential_type as enum ('certification', 'license', 'training', 'apprenticeship', 'degree');
create type pay_type as enum ('hourly', 'salary', 'negotiable');

-- ── Core Tables ───────────────────────────────

-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  email         text not null,
  role          user_role not null default 'seeker',
  full_name     text,
  avatar_url    text,
  phone         text,
  location      text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Seeker profiles
create table public.seeker_profiles (
  id                   uuid primary key default uuid_generate_v4(),
  user_id              uuid not null references public.profiles(id) on delete cascade,
  bio                  text,
  experience_level     experience_level not null default 'no_experience',
  education_level      text,
  availability         text not null default 'full_time',
  willing_to_relocate  boolean not null default false,
  interests            trade_category[] not null default '{}',
  saved_programs       uuid[] not null default '{}',
  saved_employers      uuid[] not null default '{}',
  quiz_completed       boolean not null default false,
  quiz_results         jsonb,
  resume_url           text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now(),
  unique(user_id)
);

-- Organizations (shared by employers and programs)
create table public.organizations (
  id         uuid primary key default uuid_generate_v4(),
  type       org_type not null,
  name       text not null,
  owner_id   uuid not null references public.profiles(id),
  created_at timestamptz not null default now()
);

-- Org members
create table public.organization_members (
  id          uuid primary key default uuid_generate_v4(),
  org_id      uuid not null references public.organizations(id) on delete cascade,
  user_id     uuid not null references public.profiles(id) on delete cascade,
  role        text not null default 'member', -- 'owner' | 'admin' | 'member'
  joined_at   timestamptz not null default now(),
  unique(org_id, user_id)
);

-- Employers
create table public.employers (
  id               uuid primary key default uuid_generate_v4(),
  org_id           uuid not null references public.organizations(id) on delete cascade,
  company_name     text not null,
  slug             text not null unique,
  description      text,
  trades           trade_category[] not null default '{}',
  size             text not null default 'small',
  city             text,
  state            text,
  zip              text,
  county           text,
  service_radius   integer,
  contact_email    text not null,
  contact_phone    text,
  website          text,
  logo_url         text,
  cover_url        text,
  is_verified      boolean not null default false,
  is_featured      boolean not null default false,
  subscription_tier subscription_tier not null default 'free',
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Programs (trade schools, apprenticeships, unions, etc.)
create table public.programs (
  id                      uuid primary key default uuid_generate_v4(),
  org_id                  uuid not null references public.organizations(id) on delete cascade,
  name                    text not null,
  slug                    text not null unique,
  description             text,
  type                    program_type not null,
  trades                  trade_category[] not null default '{}',
  address                 text,
  city                    text not null,
  state                   text not null,
  zip                     text,
  county                  text,
  is_remote               boolean not null default false,
  is_hybrid               boolean not null default false,
  duration                text,
  cost_total              integer default 0,
  is_free                 boolean not null default false,
  is_paid_apprenticeship  boolean not null default false,
  starting_wage           numeric(6,2),
  schedule_type           text not null default 'full_time',
  hours_per_week          integer,
  requirements            text[] not null default '{}',
  certifications_offered  text[] not null default '{}',
  contact_email           text not null,
  contact_phone           text,
  website                 text,
  logo_url                text,
  cover_url               text,
  is_verified             boolean not null default false,
  is_featured             boolean not null default false,
  accepts_gi_bill         boolean not null default false,
  financial_aid           boolean not null default false,
  application_deadline    date,
  next_start_date         date,
  capacity                integer,
  spots_remaining         integer,
  subscription_tier       subscription_tier not null default 'free',
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- Jobs
create table public.jobs (
  id                       uuid primary key default uuid_generate_v4(),
  employer_id              uuid not null references public.employers(id) on delete cascade,
  title                    text not null,
  slug                     text not null unique,
  description              text not null,
  trade                    trade_category not null,
  type                     job_type not null default 'full_time',
  experience_required      experience_required not null default 'entry',
  city                     text not null,
  state                    text not null,
  zip                      text,
  is_remote                boolean not null default false,
  pay_type                 pay_type not null default 'hourly',
  pay_min                  numeric(8,2),
  pay_max                  numeric(8,2),
  pay_display_string       text,
  benefits                 text[] not null default '{}',
  requirements             text[] not null default '{}',
  responsibilities         text[] not null default '{}',
  certifications_required  text[] not null default '{}',
  is_active                boolean not null default true,
  is_featured              boolean not null default false,
  applications_count       integer not null default 0,
  views_count              integer not null default 0,
  expires_at               timestamptz not null default (now() + interval '60 days'),
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);

-- Applications / Leads
create table public.applications (
  id            uuid primary key default uuid_generate_v4(),
  seeker_id     uuid not null references public.seeker_profiles(id),
  job_id        uuid references public.jobs(id),
  program_id    uuid references public.programs(id),
  status        application_status not null default 'submitted',
  cover_letter  text,
  notes         text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- must apply to either a job or program, not both
  check (
    (job_id is not null and program_id is null) or
    (job_id is null and program_id is not null)
  )
);

-- Credentials
create table public.credentials (
  id                uuid primary key default uuid_generate_v4(),
  seeker_id         uuid not null references public.seeker_profiles(id),
  type              credential_type not null,
  name              text not null,
  issuer            text not null,
  issued_date       date,
  expiry_date       date,
  verification_url  text,
  document_url      text,
  is_verified       boolean not null default false,
  trade             trade_category,
  created_at        timestamptz not null default now()
);

-- Subscriptions
create table public.subscriptions (
  id                         uuid primary key default uuid_generate_v4(),
  org_id                     uuid not null references public.organizations(id),
  tier                       subscription_tier not null default 'free',
  stripe_subscription_id     text unique,
  stripe_customer_id         text,
  current_period_start       timestamptz,
  current_period_end         timestamptz,
  is_active                  boolean not null default true,
  created_at                 timestamptz not null default now(),
  updated_at                 timestamptz not null default now()
);

-- Quiz answers (raw storage)
create table public.quiz_sessions (
  id           uuid primary key default uuid_generate_v4(),
  user_id      uuid references public.profiles(id),
  session_id   text not null, -- for anonymous users pre-signup
  answers      jsonb not null default '[]',
  results      jsonb,
  completed    boolean not null default false,
  created_at   timestamptz not null default now()
);

-- AI conversations
create table public.ai_conversations (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id),
  messages    jsonb not null default '[]',
  context     text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Saved items
create table public.saved_items (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid not null references public.profiles(id),
  item_type   text not null, -- 'job' | 'program' | 'employer'
  item_id     uuid not null,
  created_at  timestamptz not null default now(),
  unique(user_id, item_type, item_id)
);

-- Audit logs
create table public.audit_logs (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id),
  action      text not null,
  table_name  text,
  record_id   uuid,
  old_data    jsonb,
  new_data    jsonb,
  ip_address  text,
  created_at  timestamptz not null default now()
);

-- ── Indexes ──────────────────────────────────

create index idx_employers_state on public.employers(state);
create index idx_employers_trades on public.employers using gin(trades);
create index idx_employers_featured on public.employers(is_featured) where is_featured = true;

create index idx_programs_state on public.programs(state);
create index idx_programs_trades on public.programs using gin(trades);
create index idx_programs_featured on public.programs(is_featured) where is_featured = true;
create index idx_programs_type on public.programs(type);

create index idx_jobs_trade on public.jobs(trade);
create index idx_jobs_employer on public.jobs(employer_id);
create index idx_jobs_active on public.jobs(is_active) where is_active = true;
create index idx_jobs_state on public.jobs(state);

create index idx_applications_seeker on public.applications(seeker_id);
create index idx_applications_job on public.applications(job_id);
create index idx_applications_program on public.applications(program_id);
create index idx_applications_status on public.applications(status);

-- Full-text search
create index idx_employers_fts on public.employers using gin(
  to_tsvector('english', company_name || ' ' || coalesce(description, ''))
);
create index idx_programs_fts on public.programs using gin(
  to_tsvector('english', name || ' ' || coalesce(description, ''))
);
create index idx_jobs_fts on public.jobs using gin(
  to_tsvector('english', title || ' ' || description)
);

-- ── Row Level Security ────────────────────────

alter table public.profiles enable row level security;
alter table public.seeker_profiles enable row level security;
alter table public.employers enable row level security;
alter table public.programs enable row level security;
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
alter table public.credentials enable row level security;
alter table public.saved_items enable row level security;
alter table public.ai_conversations enable row level security;

-- Profiles: users see their own, public sees basic info
create policy "Profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Seeker profiles: seekers manage their own
create policy "Seekers manage own profile" on public.seeker_profiles
  for all using (auth.uid() = user_id);

create policy "Employers can view seeker profiles who applied" on public.seeker_profiles
  for select using (
    exists (
      select 1 from public.applications a
      join public.jobs j on a.job_id = j.id
      join public.employers e on j.employer_id = e.id
      join public.organization_members om on e.org_id = om.org_id
      where a.seeker_id = public.seeker_profiles.id
        and om.user_id = auth.uid()
    )
  );

-- Employers/Programs: public read, org members write
create policy "Employers are publicly readable" on public.employers for select using (true);
create policy "Programs are publicly readable" on public.programs for select using (true);
create policy "Jobs are publicly readable" on public.jobs for select using (is_active = true);

create policy "Org members can manage employer" on public.employers
  for all using (
    exists (
      select 1 from public.organization_members
      where org_id = public.employers.org_id and user_id = auth.uid()
    )
  );

create policy "Org members can manage program" on public.programs
  for all using (
    exists (
      select 1 from public.organization_members
      where org_id = public.programs.org_id and user_id = auth.uid()
    )
  );

-- Applications: seekers see own, employers see their job apps
create policy "Seekers see own applications" on public.applications
  for select using (
    seeker_id in (
      select id from public.seeker_profiles where user_id = auth.uid()
    )
  );

create policy "Seekers create applications" on public.applications
  for insert with check (
    seeker_id in (
      select id from public.seeker_profiles where user_id = auth.uid()
    )
  );

create policy "Employers see applications to their jobs" on public.applications
  for select using (
    job_id in (
      select j.id from public.jobs j
      join public.employers e on j.employer_id = e.id
      join public.organization_members om on e.org_id = om.org_id
      where om.user_id = auth.uid()
    )
  );

-- Credentials, saved items, AI conversations: own only
create policy "Own credentials only" on public.credentials
  for all using (
    seeker_id in (select id from public.seeker_profiles where user_id = auth.uid())
  );

create policy "Own saved items only" on public.saved_items
  for all using (auth.uid() = user_id);

create policy "Own AI conversations only" on public.ai_conversations
  for all using (auth.uid() = user_id);

-- ── Triggers ─────────────────────────────────

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger handle_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();
create trigger handle_updated_at before update on public.seeker_profiles
  for each row execute function public.handle_updated_at();
create trigger handle_updated_at before update on public.employers
  for each row execute function public.handle_updated_at();
create trigger handle_updated_at before update on public.programs
  for each row execute function public.handle_updated_at();
create trigger handle_updated_at before update on public.jobs
  for each row execute function public.handle_updated_at();

-- Increment job view count (called from API)
create or replace function public.increment_job_views(job_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.jobs set views_count = views_count + 1 where id = job_id;
end;
$$;

-- Increment job application count
create or replace function public.increment_application_count()
returns trigger language plpgsql as $$
begin
  if new.job_id is not null then
    update public.jobs set applications_count = applications_count + 1
    where id = new.job_id;
  end if;
  return new;
end;
$$;

create trigger on_application_created
  after insert on public.applications
  for each row execute function public.increment_application_count();