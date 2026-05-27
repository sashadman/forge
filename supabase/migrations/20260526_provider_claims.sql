create table if not exists public.provider_claims (
  id uuid primary key default gen_random_uuid(),
  submitted_by uuid references auth.users(id) on delete set null,
  contact_name text not null,
  contact_email text not null,
  organization_name text not null,
  website_url text,
  phone text,
  city text not null,
  state text not null,
  role_title text,
  claim_type text not null default 'provider_profile',
  program_names text,
  evidence_summary text not null,
  requested_access text,
  status text not null default 'pending',
  admin_notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint provider_claims_status_check
    check (status in ('pending', 'approved', 'rejected', 'needs_more_info')),

  constraint provider_claims_claim_type_check
    check (claim_type in ('provider_profile', 'program_listing', 'provider_and_programs'))
);

create index if not exists provider_claims_status_idx
  on public.provider_claims(status);

create index if not exists provider_claims_submitted_by_idx
  on public.provider_claims(submitted_by);

create index if not exists provider_claims_created_at_idx
  on public.provider_claims(created_at desc);

alter table public.provider_claims enable row level security;

drop policy if exists "Anyone can submit provider claims" on public.provider_claims;
create policy "Anyone can submit provider claims"
on public.provider_claims
for insert
to anon, authenticated
with check (true);

drop policy if exists "Users can read their own provider claims" on public.provider_claims;
create policy "Users can read their own provider claims"
on public.provider_claims
for select
to authenticated
using (submitted_by = auth.uid());

drop policy if exists "Admins can read provider claims" on public.provider_claims;
create policy "Admins can read provider claims"
on public.provider_claims
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can update provider claims" on public.provider_claims;
create policy "Admins can update provider claims"
on public.provider_claims
for update
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