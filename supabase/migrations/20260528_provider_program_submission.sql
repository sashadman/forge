alter table public.programs
  add column if not exists provider_profile_id uuid references public.training_provider_profiles(id) on delete set null,
  add column if not exists submitted_by uuid references auth.users(id) on delete set null,
  add column if not exists review_status text not null default 'admin_created',
  add column if not exists review_notes text,
  add column if not exists reviewed_by uuid references auth.users(id) on delete set null,
  add column if not exists reviewed_at timestamptz,
  add column if not exists published_at timestamptz;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'programs_review_status_check'
  ) then
    alter table public.programs
      add constraint programs_review_status_check
      check (
        review_status in (
          'admin_created',
          'pending',
          'approved',
          'rejected',
          'needs_more_info'
        )
      );
  end if;
end $$;

create index if not exists programs_provider_profile_idx
  on public.programs(provider_profile_id);

create index if not exists programs_submitted_by_idx
  on public.programs(submitted_by);

create index if not exists programs_review_status_idx
  on public.programs(review_status);

alter table public.programs enable row level security;

drop policy if exists "Public can read active approved programs" on public.programs;
create policy "Public can read active approved programs"
on public.programs
for select
to anon, authenticated
using (
  is_active = true
  and review_status in ('approved', 'admin_created')
);

drop policy if exists "Admins can read all programs" on public.programs;
create policy "Admins can read all programs"
on public.programs
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

drop policy if exists "Provider members can read their programs" on public.programs;
create policy "Provider members can read their programs"
on public.programs
for select
to authenticated
using (
  provider_profile_id is not null
  and exists (
    select 1
    from public.training_provider_memberships
    where training_provider_memberships.provider_profile_id = programs.provider_profile_id
      and training_provider_memberships.user_id = auth.uid()
      and training_provider_memberships.status = 'active'
  )
);

drop policy if exists "Provider owners can insert their programs" on public.programs;
create policy "Provider owners can insert their programs"
on public.programs
for insert
to authenticated
with check (
  submitted_by = auth.uid()
  and provider_profile_id is not null
  and review_status = 'pending'
  and is_active = false
  and exists (
    select 1
    from public.training_provider_memberships
    where training_provider_memberships.provider_profile_id = programs.provider_profile_id
      and training_provider_memberships.user_id = auth.uid()
      and training_provider_memberships.status = 'active'
      and training_provider_memberships.role in ('owner', 'manager')
  )
);

drop policy if exists "Provider owners can update their draft programs" on public.programs;
create policy "Provider owners can update their draft programs"
on public.programs
for update
to authenticated
using (
  provider_profile_id is not null
  and review_status in ('pending', 'needs_more_info', 'rejected')
  and exists (
    select 1
    from public.training_provider_memberships
    where training_provider_memberships.provider_profile_id = programs.provider_profile_id
      and training_provider_memberships.user_id = auth.uid()
      and training_provider_memberships.status = 'active'
      and training_provider_memberships.role in ('owner', 'manager')
  )
)
with check (
  provider_profile_id is not null
  and submitted_by = auth.uid()
  and is_active = false
  and review_status = 'pending'
  and exists (
    select 1
    from public.training_provider_memberships
    where training_provider_memberships.provider_profile_id = programs.provider_profile_id
      and training_provider_memberships.user_id = auth.uid()
      and training_provider_memberships.status = 'active'
      and training_provider_memberships.role in ('owner', 'manager')
  )
);

drop policy if exists "Admins can insert programs" on public.programs;
create policy "Admins can insert programs"
on public.programs
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

drop policy if exists "Admins can update programs" on public.programs;
create policy "Admins can update programs"
on public.programs
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