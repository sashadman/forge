create table if not exists public.training_provider_profiles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  website_url text,
  contact_email text,
  phone text,
  city text not null,
  state text not null,
  verification_status text not null default 'pending',
  source_claim_id uuid references public.provider_claims(id) on delete set null,
  is_active boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint training_provider_profiles_verification_status_check
    check (verification_status in ('pending', 'verified', 'rejected', 'needs_more_info'))
);

create table if not exists public.training_provider_memberships (
  id uuid primary key default gen_random_uuid(),
  provider_profile_id uuid not null references public.training_provider_profiles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'owner',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint training_provider_memberships_role_check
    check (role in ('owner', 'manager', 'viewer')),

  constraint training_provider_memberships_status_check
    check (status in ('active', 'inactive', 'pending')),

  constraint training_provider_memberships_unique_user_provider
    unique (provider_profile_id, user_id)
);

create index if not exists training_provider_profiles_slug_idx
  on public.training_provider_profiles(slug);

create index if not exists training_provider_profiles_source_claim_idx
  on public.training_provider_profiles(source_claim_id);

create index if not exists training_provider_memberships_user_idx
  on public.training_provider_memberships(user_id);

create index if not exists training_provider_memberships_provider_idx
  on public.training_provider_memberships(provider_profile_id);

alter table public.training_provider_profiles enable row level security;
alter table public.training_provider_memberships enable row level security;

drop policy if exists "Public can read active verified training providers" on public.training_provider_profiles;
create policy "Public can read active verified training providers"
on public.training_provider_profiles
for select
to anon, authenticated
using (
  is_active = true
  and verification_status = 'verified'
);

drop policy if exists "Provider members can read their provider profiles" on public.training_provider_profiles;
create policy "Provider members can read their provider profiles"
on public.training_provider_profiles
for select
to authenticated
using (
  exists (
    select 1
    from public.training_provider_memberships
    where training_provider_memberships.provider_profile_id = training_provider_profiles.id
      and training_provider_memberships.user_id = auth.uid()
      and training_provider_memberships.status = 'active'
  )
);

drop policy if exists "Admins can read training provider profiles" on public.training_provider_profiles;
create policy "Admins can read training provider profiles"
on public.training_provider_profiles
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

drop policy if exists "Admins can insert training provider profiles" on public.training_provider_profiles;
create policy "Admins can insert training provider profiles"
on public.training_provider_profiles
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can update training provider profiles" on public.training_provider_profiles;
create policy "Admins can update training provider profiles"
on public.training_provider_profiles
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

drop policy if exists "Provider members can update their provider profiles" on public.training_provider_profiles;
create policy "Provider members can update their provider profiles"
on public.training_provider_profiles
for update
to authenticated
using (
  exists (
    select 1
    from public.training_provider_memberships
    where training_provider_memberships.provider_profile_id = training_provider_profiles.id
      and training_provider_memberships.user_id = auth.uid()
      and training_provider_memberships.status = 'active'
      and training_provider_memberships.role in ('owner', 'manager')
  )
)
with check (
  exists (
    select 1
    from public.training_provider_memberships
    where training_provider_memberships.provider_profile_id = training_provider_profiles.id
      and training_provider_memberships.user_id = auth.uid()
      and training_provider_memberships.status = 'active'
      and training_provider_memberships.role in ('owner', 'manager')
  )
);

drop policy if exists "Users can read their own provider memberships" on public.training_provider_memberships;
create policy "Users can read their own provider memberships"
on public.training_provider_memberships
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Admins can read provider memberships" on public.training_provider_memberships;
create policy "Admins can read provider memberships"
on public.training_provider_memberships
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

drop policy if exists "Admins can insert provider memberships" on public.training_provider_memberships;
create policy "Admins can insert provider memberships"
on public.training_provider_memberships
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  )
);

drop policy if exists "Admins can update provider memberships" on public.training_provider_memberships;
create policy "Admins can update provider memberships"
on public.training_provider_memberships
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