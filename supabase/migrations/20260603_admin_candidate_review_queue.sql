create or replace function public.is_current_user_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.id = auth.uid()
      and profiles.role = 'admin'
  );
$$;

create or replace function public.list_training_program_candidates_for_review(
  requested_status text default 'trusted_candidate',
  requested_trade_slug text default null,
  search_text text default null,
  result_limit integer default 50,
  result_offset integer default 0
)
returns table (
  id uuid,
  title text,
  provider_name text,
  institution_name text,
  program_type text,
  trade_slug text,
  location text,
  state text,
  country text,
  cip_code text,
  source_url text,
  verification_status text,
  trust_level text,
  confidence_score numeric,
  published_program_id uuid,
  created_at timestamptz,
  updated_at timestamptz
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_user_admin() then
    raise exception 'Only admins can view training program candidates.';
  end if;

  return query
  select
    c.id,
    c.title,
    c.provider_name,
    c.institution_name,
    c.program_type,
    c.trade_slug,
    c.location,
    c.state,
    c.country,
    c.cip_code,
    c.source_url,
    c.verification_status,
    c.trust_level,
    c.confidence_score,
    c.published_program_id,
    c.created_at,
    c.updated_at
  from public.training_program_candidates c
  where
    (
      requested_status is null
      or c.verification_status = requested_status
    )
    and (
      requested_trade_slug is null
      or c.trade_slug = requested_trade_slug
    )
    and (
      search_text is null
      or search_text = ''
      or c.title ilike '%' || search_text || '%'
      or c.provider_name ilike '%' || search_text || '%'
      or c.institution_name ilike '%' || search_text || '%'
      or c.cip_code ilike '%' || search_text || '%'
    )
  order by
    c.confidence_score desc,
    c.provider_name asc,
    c.title asc
  limit least(greatest(result_limit, 1), 100)
  offset greatest(result_offset, 0);
end;
$$;

create or replace function public.reject_training_program_candidate(
  candidate_id uuid,
  notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_published_program_id uuid;
begin
  if not public.is_current_user_admin() then
    raise exception 'Only admins can reject training program candidates.';
  end if;

  select published_program_id
  into existing_published_program_id
  from public.training_program_candidates
  where id = candidate_id;

  if not found then
    raise exception 'Training program candidate not found.';
  end if;

  if existing_published_program_id is not null then
    raise exception 'Published candidates cannot be rejected.';
  end if;

  update public.training_program_candidates
  set
    verification_status = 'rejected',
    review_notes = notes,
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    updated_at = now()
  where id = candidate_id;

  return candidate_id;
end;
$$;

create or replace function public.mark_training_program_candidate_duplicate(
  candidate_id uuid,
  duplicate_candidate_id uuid,
  notes text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_current_user_admin() then
    raise exception 'Only admins can mark candidate duplicates.';
  end if;

  if candidate_id = duplicate_candidate_id then
    raise exception 'A candidate cannot be marked as a duplicate of itself.';
  end if;

  if not exists (
    select 1
    from public.training_program_candidates
    where id = candidate_id
  ) then
    raise exception 'Training program candidate not found.';
  end if;

  if not exists (
    select 1
    from public.training_program_candidates
    where id = duplicate_candidate_id
  ) then
    raise exception 'Duplicate target candidate not found.';
  end if;

  update public.training_program_candidates
  set
    verification_status = 'duplicate',
    duplicate_of_candidate_id = duplicate_candidate_id,
    review_notes = notes,
    reviewed_by = auth.uid(),
    reviewed_at = now(),
    updated_at = now()
  where id = candidate_id;

  return candidate_id;
end;
$$;

create index if not exists training_program_candidates_review_queue_idx
  on public.training_program_candidates (
    verification_status,
    trade_slug,
    confidence_score desc,
    provider_name,
    title
  );

create index if not exists training_program_candidates_provider_search_idx
  on public.training_program_candidates using gin (
    to_tsvector(
      'english',
      coalesce(provider_name, '') || ' ' ||
      coalesce(institution_name, '') || ' ' ||
      coalesce(title, '') || ' ' ||
      coalesce(cip_code, '')
    )
  );