do $$
begin
  if not exists (
    select 1
    from pg_type
    where typname = 'program_pipeline_status'
  ) then
    create type public.program_pipeline_status as enum (
      'saved',
      'researching',
      'contacted',
      'applying',
      'enrolled',
      'completed',
      'closed'
    );
  end if;
end $$;

alter table public.saved_programs
  add column if not exists pipeline_status public.program_pipeline_status not null default 'saved',
  add column if not exists notes text,
  add column if not exists priority text not null default 'medium',
  add column if not exists target_start_date date,
  add column if not exists last_contacted_at date,
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'saved_programs_priority_check'
  ) then
    alter table public.saved_programs
      add constraint saved_programs_priority_check
      check (priority in ('low', 'medium', 'high'));
  end if;
end $$;

create index if not exists saved_programs_user_status_idx
  on public.saved_programs(user_id, pipeline_status);

create index if not exists saved_programs_user_priority_idx
  on public.saved_programs(user_id, priority);

create index if not exists saved_programs_target_start_date_idx
  on public.saved_programs(target_start_date);