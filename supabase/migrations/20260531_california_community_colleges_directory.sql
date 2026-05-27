create table if not exists public.california_community_colleges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  district_name text,
  city text not null,
  state text not null default 'CA',
  region text not null,
  county text,
  website_url text not null,
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists california_community_colleges_slug_idx
  on public.california_community_colleges(slug);

create index if not exists california_community_colleges_region_idx
  on public.california_community_colleges(region);

create index if not exists california_community_colleges_city_idx
  on public.california_community_colleges(city);

alter table public.california_community_colleges enable row level security;

drop policy if exists "Public can read active California community colleges" on public.california_community_colleges;
create policy "Public can read active California community colleges"
on public.california_community_colleges
for select
to anon, authenticated
using (is_active = true);

drop policy if exists "Admins can manage California community colleges" on public.california_community_colleges;
create policy "Admins can manage California community colleges"
on public.california_community_colleges
for all
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