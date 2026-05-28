alter table public.programs
  add column if not exists source_id uuid references public.training_sources(id) on delete set null,
  add column if not exists source_candidate_id uuid references public.training_program_candidates(id) on delete set null,
  add column if not exists external_id text,
  add column if not exists source_url text,
  add column if not exists source_metadata jsonb not null default '{}'::jsonb,
  add column if not exists data_origin text not null default 'manual';

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'programs_data_origin_check'
  ) then
    alter table public.programs
      add constraint programs_data_origin_check
      check (
        data_origin in (
          'manual',
          'provider_submitted',
          'candidate_promoted',
          'official_source_import'
        )
      );
  end if;
end $$;

create unique index if not exists programs_source_candidate_id_key
  on public.programs(source_candidate_id)
  where source_candidate_id is not null;

create index if not exists programs_source_id_idx
  on public.programs(source_id);

create index if not exists programs_source_url_idx
  on public.programs(source_url);

create or replace function public.slugify_program_text(input_text text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(lower(coalesce(input_text, 'program')), '[^a-z0-9]+', '-', 'g'));
$$;

create or replace function public.promote_training_program_candidate(candidate_id uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  candidate_record public.training_program_candidates%rowtype;
  new_program_id uuid;
  base_slug text;
  final_slug text;
  suffix integer := 1;
begin
  if not exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  ) then
    raise exception 'Only admins can promote training program candidates.';
  end if;

  select *
  into candidate_record
  from public.training_program_candidates
  where id = candidate_id
  for update;

  if not found then
    raise exception 'Training program candidate not found.';
  end if;

  if candidate_record.verification_status not in ('trusted_candidate', 'approved') then
    raise exception 'Candidate must be trusted or approved before promotion.';
  end if;

  if candidate_record.published_program_id is not null then
    return candidate_record.published_program_id;
  end if;

  base_slug := public.slugify_program_text(
    candidate_record.provider_name || '-' || candidate_record.title
  );

  final_slug := base_slug;

  while exists (
    select 1
    from public.programs
    where slug = final_slug
  ) loop
    suffix := suffix + 1;
    final_slug := base_slug || '-' || suffix::text;
  end loop;

  insert into public.programs (
    slug,
    name,
    provider_name,
    program_type,
    trade_slug,
    location,
    state,
    duration,
    cost,
    description,
    requirements,
    outcomes,
    website_url,
    is_active,
    review_status,
    published_at,
    source_id,
    source_candidate_id,
    external_id,
    source_url,
    source_metadata,
    data_origin
  )
  values (
    final_slug,
    candidate_record.title,
    candidate_record.provider_name,
    candidate_record.program_type::public.program_type,
    candidate_record.trade_slug,
    coalesce(nullif(candidate_record.location, ''), 'See provider'),
    coalesce(nullif(candidate_record.state, ''), 'US'),
    candidate_record.duration,
    coalesce(candidate_record.cost, 'See provider'),
    coalesce(
      nullif(candidate_record.description, ''),
      'Program information imported from a trusted public training source. Review provider details before enrollment.'
    ),
    candidate_record.requirements,
    candidate_record.outcomes,
    candidate_record.source_url,
    true,
    'admin_created',
    now(),
    candidate_record.source_id,
    candidate_record.id,
    candidate_record.external_id,
    candidate_record.source_url,
    jsonb_build_object(
      'candidate_raw_payload', candidate_record.raw_payload,
      'candidate_confidence_score', candidate_record.confidence_score,
      'candidate_trust_level', candidate_record.trust_level,
      'candidate_source_authority', candidate_record.source_authority
    ),
    'candidate_promoted'
  )
  returning id into new_program_id;

  update public.training_program_candidates
  set
    verification_status = 'published',
    published_program_id = new_program_id,
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    updated_at = now()
  where id = candidate_record.id;

  return new_program_id;
end;
$$;