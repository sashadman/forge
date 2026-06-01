create table if not exists public.employer_opportunity_submissions (
  id uuid primary key default gen_random_uuid(),

  employer_id uuid not null references public.employers(id) on delete cascade,
  submitted_by uuid not null references auth.users(id) on delete cascade,

  title text not null,
  slug text,
  opportunity_type text not null default 'job',
  trade_slug text not null,

  location text not null,
  state text not null,

  pay_range text,
  schedule text,

  description text not null,
  requirements text[],
  benefits text[],

  application_url text,
  external_url text,

  contact_email text,
  contact_phone text,

  status text not null default 'submitted',
  admin_notes text,

  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,

  approved_opportunity_id uuid references public.opportunities(id) on delete set null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint employer_opportunity_submissions_status_check
    check (status in ('draft', 'submitted', 'approved', 'rejected', 'archived')),

  constraint employer_opportunity_submissions_opportunity_type_check
    check (opportunity_type in ('job', 'apprenticeship', 'internship', 'training', 'event')),

  constraint employer_opportunity_submissions_title_length_check
    check (char_length(trim(title)) >= 4),

  constraint employer_opportunity_submissions_description_length_check
    check (char_length(trim(description)) >= 80),

  constraint employer_opportunity_submissions_state_length_check
    check (char_length(trim(state)) = 2)
);

create index if not exists employer_opportunity_submissions_employer_idx
  on public.employer_opportunity_submissions(employer_id);

create index if not exists employer_opportunity_submissions_submitted_by_idx
  on public.employer_opportunity_submissions(submitted_by);

create index if not exists employer_opportunity_submissions_status_idx
  on public.employer_opportunity_submissions(status);

create index if not exists employer_opportunity_submissions_created_at_idx
  on public.employer_opportunity_submissions(created_at desc);

create index if not exists employer_opportunity_submissions_approved_opportunity_idx
  on public.employer_opportunity_submissions(approved_opportunity_id);

alter table public.employer_opportunity_submissions enable row level security;

drop policy if exists "Admins can read employer opportunity submissions"
on public.employer_opportunity_submissions;

create policy "Admins can read employer opportunity submissions"
on public.employer_opportunity_submissions
for select
using (public.is_current_user_admin());

drop policy if exists "Admins can update employer opportunity submissions"
on public.employer_opportunity_submissions;

create policy "Admins can update employer opportunity submissions"
on public.employer_opportunity_submissions
for update
using (public.is_current_user_admin())
with check (public.is_current_user_admin());

drop policy if exists "Users can read their own employer opportunity submissions"
on public.employer_opportunity_submissions;

create policy "Users can read their own employer opportunity submissions"
on public.employer_opportunity_submissions
for select
using (submitted_by = auth.uid());

drop policy if exists "Users can create their own employer opportunity submissions"
on public.employer_opportunity_submissions;

create policy "Users can create their own employer opportunity submissions"
on public.employer_opportunity_submissions
for insert
with check (
  submitted_by = auth.uid()
  and status in ('draft', 'submitted')
  and approved_opportunity_id is null
  and reviewed_by is null
  and reviewed_at is null
);

drop policy if exists "Users can update their own draft or rejected employer opportunity submissions"
on public.employer_opportunity_submissions;

create policy "Users can update their own draft or rejected employer opportunity submissions"
on public.employer_opportunity_submissions
for update
using (
  submitted_by = auth.uid()
  and status in ('draft', 'rejected')
  and approved_opportunity_id is null
)
with check (
  submitted_by = auth.uid()
  and status in ('draft', 'submitted')
  and approved_opportunity_id is null
  and reviewed_by is null
  and reviewed_at is null
);

create or replace function public.set_employer_opportunity_submission_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_employer_opportunity_submission_updated_at
on public.employer_opportunity_submissions;

create trigger set_employer_opportunity_submission_updated_at
before update on public.employer_opportunity_submissions
for each row
execute function public.set_employer_opportunity_submission_updated_at();
