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
  provider_profile_id,
  submitted_by,
  published_at,
  created_at,
  updated_at
)
values
  (
    'grossmont-college-career-education',
    'Career Education Pathways',
    'Grossmont College',
    'community_college',
    'construction',
    'El Cajon',
    'CA',
    'See provider',
    'See provider',
    'A San Diego-area community college pathway for students exploring career education and applied workforce programs. This starter record should be refined after a provider claim or verified program source review.',
    array[
      'Review current Grossmont College catalog requirements',
      'Confirm the specific certificate or degree pathway with the college',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore applied career education pathways',
      'Prepare for continued training or workforce entry',
      'Use the college catalog to choose a specific program direction'
    ],
    'https://www.grossmont.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'cuyamaca-college-automotive-technology',
    'Automotive Technology',
    'Cuyamaca College',
    'community_college',
    'automotive',
    'Rancho San Diego',
    'CA',
    'See provider',
    'See provider',
    'A San Diego-area community college pathway for students exploring automotive technology, vehicle systems, and applied technical training.',
    array[
      'Review current Cuyamaca College catalog requirements',
      'Confirm current program and course availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore automotive systems and service concepts',
      'Prepare for continued technical training',
      'Build applied workforce skills through community college coursework'
    ],
    'https://www.cuyamaca.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'cuyamaca-college-water-wastewater-technology',
    'Water and Wastewater Technology',
    'Cuyamaca College',
    'community_college',
    'construction',
    'Rancho San Diego',
    'CA',
    'See provider',
    'See provider',
    'A San Diego-area community college pathway for students exploring water, wastewater, utilities, and infrastructure-related technical careers.',
    array[
      'Review current Cuyamaca College catalog requirements',
      'Confirm current program and course availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore water and wastewater system fundamentals',
      'Prepare for infrastructure and utility-related technical pathways',
      'Build awareness of public-service skilled technical work'
    ],
    'https://www.cuyamaca.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  )
on conflict (slug) do update
set
  name = excluded.name,
  provider_name = excluded.provider_name,
  program_type = excluded.program_type,
  trade_slug = excluded.trade_slug,
  location = excluded.location,
  state = excluded.state,
  duration = excluded.duration,
  cost = excluded.cost,
  description = excluded.description,
  requirements = excluded.requirements,
  outcomes = excluded.outcomes,
  website_url = excluded.website_url,
  is_active = excluded.is_active,
  review_status = excluded.review_status,
  updated_at = now();