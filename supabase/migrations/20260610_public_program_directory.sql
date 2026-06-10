create or replace view public.public_program_directory as
select
  p.id::text as directory_id,
  'program'::text as record_kind,
  p.id as program_id,
  null::uuid as candidate_id,
  p.slug,
  p.name,
  p.provider_name,
  p.program_type,
  p.trade_slug,
  p.location,
  p.state,
  p.duration,
  p.cost,
  p.description,
  p.website_url,
  p.source_url,
  p.review_status,
  p.data_origin,
  p.source_candidate_id,
  p.provider_profile_id,
  p.published_at,
  p.updated_at,
  case
    when p.provider_profile_id is not null then 1
    when p.review_status in ('approved', 'admin_created') then 2
    else 3
  end as verification_rank
from public.programs p
where p.is_active = true
  and p.review_status in ('approved', 'admin_created')

union all

select
  c.id::text as directory_id,
  'candidate'::text as record_kind,
  null::uuid as program_id,
  c.id as candidate_id,
  null::text as slug,
  coalesce(
    nullif(row_to_json(c)->>'title', ''),
    nullif(row_to_json(c)->>'name', ''),
    'Untitled training program'
  ) as name,
  coalesce(
    nullif(row_to_json(c)->>'provider_name', ''),
    'Unknown provider'
  ) as provider_name,
  coalesce(
    nullif(row_to_json(c)->>'program_type', ''),
    'workforce_program'
  ) as program_type,
  coalesce(
    nullif(row_to_json(c)->>'trade_slug', ''),
    'general'
  ) as trade_slug,
  coalesce(
    nullif(row_to_json(c)->>'location', ''),
    nullif(row_to_json(c)->>'city', ''),
    'See provider'
  ) as location,
  coalesce(
    nullif(row_to_json(c)->>'state', ''),
    'US'
  ) as state,
  nullif(row_to_json(c)->>'duration', '') as duration,
  coalesce(
    nullif(row_to_json(c)->>'cost', ''),
    'See provider'
  ) as cost,
  coalesce(
    nullif(row_to_json(c)->>'description', ''),
    'Program information imported from a public training source. Confirm details directly with the provider before making enrollment decisions.'
  ) as description,
  coalesce(
    nullif(row_to_json(c)->>'website_url', ''),
    nullif(row_to_json(c)->>'program_url', ''),
    nullif(row_to_json(c)->>'source_url', '')
  ) as website_url,
  coalesce(
    nullif(row_to_json(c)->>'source_url', ''),
    nullif(row_to_json(c)->>'program_url', ''),
    nullif(row_to_json(c)->>'website_url', '')
  ) as source_url,
  coalesce(
    nullif(row_to_json(c)->>'review_status', ''),
    nullif(row_to_json(c)->>'status', ''),
    'source_candidate'
  ) as review_status,
  'candidate_import'::text as data_origin,
  c.id as source_candidate_id,
  null::uuid as provider_profile_id,
  null::timestamptz as published_at,
  coalesce(
    nullif(row_to_json(c)->>'updated_at', '')::timestamptz,
    nullif(row_to_json(c)->>'created_at', '')::timestamptz,
    now()
  ) as updated_at,
  3 as verification_rank
from public.training_program_candidates c
where coalesce(row_to_json(c)->>'published_program_id', '') = ''
  and coalesce(
    nullif(row_to_json(c)->>'review_status', ''),
    nullif(row_to_json(c)->>'status', ''),
    'active'
  ) not in ('rejected', 'archived');

grant select on public.public_program_directory to anon;
grant select on public.public_program_directory to authenticated;