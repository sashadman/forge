create table if not exists public.provider_program_update_requests (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  provider_profile_id uuid not null references public.training_provider_profiles(id) on delete cascade,
  submitted_by uuid references auth.users(id) on delete set null,

  request_type text not null default 'correction',
  requested_changes jsonb not null default '{}'::jsonb,
  change_summary text not null,

  status text not null default 'pending',
  admin_notes text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint provider_program_update_requests_request_type_check
    check (request_type in ('correction', 'content_update', 'availability_update', 'cost_update', 'general_update')),

  constraint provider_program_update_requests_status_check
    check (status in ('pending', 'approved', 'rejected', 'needs_more_info'))
);

create index if not exists provider_program_update_requests_program_idx
  on public.provider_program_update_requests(program_id);

create index if not exists provider_program_update_requests_provider_idx
  on public.provider_program_update_requests(provider_profile_id);

create index if not exists provider_program_update_requests_status_idx
  on public.provider_program_update_requests(status);

create index if not exists provider_program_update_requests_created_at_idx
  on public.provider_program_update_requests(created_at desc);

alter table public.provider_program_update_requests enable row level security;

drop policy if exists "Provider members can submit program update requests" on public.provider_program_update_requests;
create policy "Provider members can submit program update requests"
on public.provider_program_update_requests
for insert
to authenticated
with check (
  submitted_by = auth.uid()
  and exists (
    select 1
    from public.training_provider_memberships
    where training_provider_memberships.provider_profile_id = provider_program_update_requests.provider_profile_id
      and training_provider_memberships.user_id = auth.uid()
      and training_provider_memberships.status = 'active'
      and training_provider_memberships.role in ('owner', 'manager')
  )
  and exists (
    select 1
    from public.programs
    where programs.id = provider_program_update_requests.program_id
      and programs.provider_profile_id = provider_program_update_requests.provider_profile_id
  )
);

drop policy if exists "Provider members can read their program update requests" on public.provider_program_update_requests;
create policy "Provider members can read their program update requests"
on public.provider_program_update_requests
for select
to authenticated
using (
  exists (
    select 1
    from public.training_provider_memberships
    where training_provider_memberships.provider_profile_id = provider_program_update_requests.provider_profile_id
      and training_provider_memberships.user_id = auth.uid()
      and training_provider_memberships.status = 'active'
  )
);

drop policy if exists "Admins can read program update requests" on public.provider_program_update_requests;
create policy "Admins can read program update requests"
on public.provider_program_update_requests
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

drop policy if exists "Admins can update program update requests" on public.provider_program_update_requests;
create policy "Admins can update program update requests"
on public.provider_program_update_requests
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