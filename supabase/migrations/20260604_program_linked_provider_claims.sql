alter table public.provider_claims
  add column if not exists program_id uuid references public.programs(id) on delete set null;

create index if not exists provider_claims_program_id_idx
  on public.provider_claims(program_id);

create index if not exists provider_claims_status_program_id_idx
  on public.provider_claims(status, program_id);

comment on column public.provider_claims.program_id is
  'Optional linked public program record when a provider claim is submitted from a specific program listing.';