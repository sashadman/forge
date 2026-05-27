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
    'san-diego-city-college-air-conditioning-refrigeration',
    'Air Conditioning, Refrigeration, and Environmental Control Technology',
    'San Diego City College',
    'community_college',
    'hvac',
    'San Diego',
    'CA',
    'See provider',
    'See provider',
    'A community college pathway for students exploring heating, cooling, refrigeration, and environmental control technology careers.',
    array[
      'Review current college catalog requirements',
      'Confirm course availability with the provider',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore HVAC and refrigeration fundamentals',
      'Prepare for entry-level technical training or continued study',
      'Build familiarity with systems used in residential and commercial environments'
    ],
    'https://www.sdcity.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'san-diego-city-college-machine-technology',
    'Machine Technology',
    'San Diego City College',
    'community_college',
    'construction',
    'San Diego',
    'CA',
    'See provider',
    'See provider',
    'A community college technical pathway for students interested in machining, manufacturing basics, tools, and applied production skills.',
    array[
      'Review current college catalog requirements',
      'Confirm course sequence with the provider',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Develop applied technical skills',
      'Prepare for manufacturing or shop-based roles',
      'Build a foundation for continued technical education'
    ],
    'https://www.sdcity.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'palomar-college-electrical-technology',
    'Electrical Technology',
    'Palomar College',
    'community_college',
    'electrical',
    'San Marcos',
    'CA',
    'See provider',
    'See provider',
    'A North San Diego County community college pathway for students exploring electrical technology and related skilled-trades work.',
    array[
      'Review current college catalog requirements',
      'Confirm current program availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore electrical technology concepts',
      'Prepare for entry-level training or continued skilled-trades education',
      'Build a foundation for electrical career pathways'
    ],
    'https://www.palomar.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'palomar-college-welding-technology',
    'Welding Technology',
    'Palomar College',
    'community_college',
    'welding',
    'San Marcos',
    'CA',
    'See provider',
    'See provider',
    'A community college welding pathway for students interested in metal joining, fabrication basics, and hands-on technical training.',
    array[
      'Review current college catalog requirements',
      'Confirm safety and lab requirements',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore welding and fabrication fundamentals',
      'Prepare for entry-level welding-related opportunities',
      'Build practical shop and safety awareness'
    ],
    'https://www.palomar.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'southwestern-college-automotive-technology',
    'Automotive Technology',
    'Southwestern College',
    'community_college',
    'automotive',
    'Chula Vista',
    'CA',
    'See provider',
    'See provider',
    'A South Bay community college pathway for students exploring automotive systems, diagnostics, and vehicle service careers.',
    array[
      'Review current college catalog requirements',
      'Confirm tool, lab, or safety expectations',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore automotive systems and service fundamentals',
      'Prepare for entry-level automotive training or employment',
      'Build technical confidence through applied coursework'
    ],
    'https://www.swccd.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'southwestern-college-welding-technology',
    'Welding Technology',
    'Southwestern College',
    'community_college',
    'welding',
    'Chula Vista',
    'CA',
    'See provider',
    'See provider',
    'A community college welding pathway serving students in the South Bay and San Diego region.',
    array[
      'Review current college catalog requirements',
      'Confirm current course and lab availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Build welding and fabrication awareness',
      'Prepare for continued technical training',
      'Explore skilled-trades career options connected to metal work'
    ],
    'https://www.swccd.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'miracosta-college-automotive-technology',
    'Automotive Technology',
    'MiraCosta College',
    'community_college',
    'automotive',
    'Oceanside',
    'CA',
    'See provider',
    'See provider',
    'A North County San Diego community college pathway for students exploring automotive technology and vehicle service skills.',
    array[
      'Review current college catalog requirements',
      'Confirm current program and course availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore automotive service fundamentals',
      'Prepare for continued study or entry-level automotive pathways',
      'Build technical knowledge through community college coursework'
    ],
    'https://www.miracosta.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'imperial-valley-college-automotive-technology',
    'Automotive Technology',
    'Imperial Valley College',
    'community_college',
    'automotive',
    'Imperial',
    'CA',
    'See provider',
    'See provider',
    'A community college pathway for Imperial Valley students exploring automotive technology and related skilled-trades careers.',
    array[
      'Review current college catalog requirements',
      'Confirm current program availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore vehicle systems and applied technical skills',
      'Prepare for automotive training or entry-level work',
      'Build a local pathway into skilled technical careers'
    ],
    'https://www.imperial.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),

  (
    'los-angeles-trade-tech-automotive-technology',
    'Automotive Technology',
    'Los Angeles Trade-Technical College',
    'community_college',
    'automotive',
    'Los Angeles',
    'CA',
    'See provider',
    'See provider',
    'A Los Angeles trade-focused community college pathway for students exploring automotive technology and vehicle service careers.',
    array[
      'Review current LATTC catalog requirements',
      'Confirm program sequence and lab expectations',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore automotive systems and diagnostics',
      'Prepare for entry-level automotive roles or continued training',
      'Build hands-on technical awareness'
    ],
    'https://www.lattc.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'los-angeles-trade-tech-construction-technology',
    'Construction Technology',
    'Los Angeles Trade-Technical College',
    'community_college',
    'construction',
    'Los Angeles',
    'CA',
    'See provider',
    'See provider',
    'A trade-focused community college pathway for students exploring construction technology and building trades.',
    array[
      'Review current LATTC catalog requirements',
      'Confirm current course availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore construction tools, materials, and jobsite concepts',
      'Prepare for continued building-trades training',
      'Build a foundation for construction career pathways'
    ],
    'https://www.lattc.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'los-angeles-trade-tech-electrical-construction-maintenance',
    'Electrical Construction and Maintenance',
    'Los Angeles Trade-Technical College',
    'community_college',
    'electrical',
    'Los Angeles',
    'CA',
    'See provider',
    'See provider',
    'A trade-focused community college pathway for students exploring electrical construction, maintenance, and related skilled work.',
    array[
      'Review current LATTC catalog requirements',
      'Confirm program sequence with the provider',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore electrical construction and maintenance concepts',
      'Prepare for continued electrical training',
      'Build a foundation for entry-level skilled-trades pathways'
    ],
    'https://www.lattc.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'los-angeles-trade-tech-welding',
    'Welding',
    'Los Angeles Trade-Technical College',
    'community_college',
    'welding',
    'Los Angeles',
    'CA',
    'See provider',
    'See provider',
    'A Los Angeles community college pathway for students interested in welding, fabrication, and hands-on metal work.',
    array[
      'Review current LATTC catalog requirements',
      'Confirm safety and lab requirements',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore welding processes and fabrication basics',
      'Prepare for continued welding education',
      'Build awareness of skilled metal-trades pathways'
    ],
    'https://www.lattc.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'rio-hondo-college-automotive-technology',
    'Automotive Technology',
    'Rio Hondo College',
    'community_college',
    'automotive',
    'Whittier',
    'CA',
    'See provider',
    'See provider',
    'A Los Angeles County community college pathway for students exploring automotive technology and vehicle service careers.',
    array[
      'Review current Rio Hondo catalog requirements',
      'Confirm course and program availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore automotive technology fundamentals',
      'Prepare for continued automotive education',
      'Build technical awareness connected to vehicle systems'
    ],
    'https://www.riohondo.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'rio-hondo-college-alternative-fuels-transportation',
    'Alternative Fuels and Transportation Technology',
    'Rio Hondo College',
    'community_college',
    'automotive',
    'Whittier',
    'CA',
    'See provider',
    'See provider',
    'A transportation-focused pathway for students exploring vehicle technology, alternative fuels, and related automotive systems.',
    array[
      'Review current Rio Hondo catalog requirements',
      'Confirm current program availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore transportation and vehicle technology concepts',
      'Prepare for continued study in automotive-related systems',
      'Build awareness of emerging transportation career pathways'
    ],
    'https://www.riohondo.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'mt-sac-air-conditioning-refrigeration',
    'Air Conditioning and Refrigeration',
    'Mt. San Antonio College',
    'community_college',
    'hvac',
    'Walnut',
    'CA',
    'See provider',
    'See provider',
    'A San Gabriel Valley community college pathway for students exploring HVAC, air conditioning, and refrigeration careers.',
    array[
      'Review current Mt. SAC catalog requirements',
      'Confirm current course availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore air conditioning and refrigeration fundamentals',
      'Prepare for continued HVAC training',
      'Build technical awareness for climate-control systems'
    ],
    'https://www.mtsac.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'mt-sac-welding',
    'Welding',
    'Mt. San Antonio College',
    'community_college',
    'welding',
    'Walnut',
    'CA',
    'See provider',
    'See provider',
    'A community college welding pathway for students exploring fabrication, shop safety, and metalworking skills.',
    array[
      'Review current Mt. SAC catalog requirements',
      'Confirm lab and safety requirements',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore welding and fabrication fundamentals',
      'Prepare for continued technical training',
      'Build practical awareness of welding career pathways'
    ],
    'https://www.mtsac.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),

  (
    'santa-ana-college-automotive-technology',
    'Automotive Technology',
    'Santa Ana College',
    'community_college',
    'automotive',
    'Santa Ana',
    'CA',
    'See provider',
    'See provider',
    'An Orange County community college pathway for students exploring automotive systems, service, and repair careers.',
    array[
      'Review current college catalog requirements',
      'Confirm program availability with Santa Ana College',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore automotive systems fundamentals',
      'Prepare for continued training or entry-level pathways',
      'Build technical confidence through applied coursework'
    ],
    'https://www.sac.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'saddleback-college-automotive-technology',
    'Automotive Technology',
    'Saddleback College',
    'community_college',
    'automotive',
    'Mission Viejo',
    'CA',
    'See provider',
    'See provider',
    'An Orange County community college pathway for students exploring automotive technology and related technical careers.',
    array[
      'Review current college catalog requirements',
      'Confirm current program availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore automotive technology fundamentals',
      'Prepare for additional training or entry-level pathways',
      'Build foundational vehicle service knowledge'
    ],
    'https://www.saddleback.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'golden-west-college-automotive-technology',
    'Automotive Technology',
    'Golden West College',
    'community_college',
    'automotive',
    'Huntington Beach',
    'CA',
    'See provider',
    'See provider',
    'An Orange County community college pathway for students exploring automotive technology and vehicle service careers.',
    array[
      'Review current college catalog requirements',
      'Confirm current program availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore automotive systems and technical service concepts',
      'Prepare for continued technical training',
      'Build awareness of automotive career pathways'
    ],
    'https://www.goldenwestcollege.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),

  (
    'riverside-city-college-automotive-technology',
    'Automotive Technology',
    'Riverside City College',
    'community_college',
    'automotive',
    'Riverside',
    'CA',
    'See provider',
    'See provider',
    'An Inland Empire community college pathway for students exploring automotive technology and technical vehicle service.',
    array[
      'Review current college catalog requirements',
      'Confirm current course availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore vehicle systems and diagnostics',
      'Prepare for automotive training or entry-level pathways',
      'Build applied technical awareness'
    ],
    'https://www.rcc.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'san-bernardino-valley-college-welding',
    'Welding',
    'San Bernardino Valley College',
    'community_college',
    'welding',
    'San Bernardino',
    'CA',
    'See provider',
    'See provider',
    'An Inland Empire community college pathway for students exploring welding, fabrication, and shop-based technical skills.',
    array[
      'Review current college catalog requirements',
      'Confirm current program and lab availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore welding fundamentals',
      'Prepare for continued welding training',
      'Build technical confidence in shop environments'
    ],
    'https://www.valleycollege.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'chaffey-college-industrial-electrical-technology',
    'Industrial Electrical Technology',
    'Chaffey College',
    'community_college',
    'electrical',
    'Rancho Cucamonga',
    'CA',
    'See provider',
    'See provider',
    'An Inland Empire community college pathway for students exploring industrial electrical technology and related skilled technical work.',
    array[
      'Review current college catalog requirements',
      'Confirm current course availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore industrial electrical concepts',
      'Prepare for continued electrical or maintenance training',
      'Build awareness of industrial skilled-trades pathways'
    ],
    'https://www.chaffey.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),

  (
    'bakersfield-college-welding',
    'Welding',
    'Bakersfield College',
    'community_college',
    'welding',
    'Bakersfield',
    'CA',
    'See provider',
    'See provider',
    'A Central Valley community college pathway for students exploring welding and fabrication careers.',
    array[
      'Review current college catalog requirements',
      'Confirm lab and course availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore welding and fabrication fundamentals',
      'Prepare for technical training or entry-level pathways',
      'Build hands-on awareness of welding careers'
    ],
    'https://www.bakersfieldcollege.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'fresno-city-college-automotive-technology',
    'Automotive Technology',
    'Fresno City College',
    'community_college',
    'automotive',
    'Fresno',
    'CA',
    'See provider',
    'See provider',
    'A Central Valley community college pathway for students exploring automotive technology and vehicle service careers.',
    array[
      'Review current college catalog requirements',
      'Confirm current program availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore automotive technology fundamentals',
      'Prepare for entry-level or continued training pathways',
      'Build technical awareness of vehicle systems'
    ],
    'https://www.fresnocitycollege.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'modesto-junior-college-welding',
    'Welding',
    'Modesto Junior College',
    'community_college',
    'welding',
    'Modesto',
    'CA',
    'See provider',
    'See provider',
    'A Central Valley community college pathway for students exploring welding, fabrication, and technical shop skills.',
    array[
      'Review current college catalog requirements',
      'Confirm current program availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore welding and fabrication concepts',
      'Prepare for continued technical training',
      'Build awareness of skilled metal-trades work'
    ],
    'https://www.mjc.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'cosumnes-river-college-automotive-technology',
    'Automotive Technology',
    'Cosumnes River College',
    'community_college',
    'automotive',
    'Sacramento',
    'CA',
    'See provider',
    'See provider',
    'A Sacramento-area community college pathway for students exploring automotive technology and transportation-related technical careers.',
    array[
      'Review current college catalog requirements',
      'Confirm current course availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore automotive systems fundamentals',
      'Prepare for continued training or entry-level pathways',
      'Build technical awareness through applied coursework'
    ],
    'https://crc.losrios.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),

  (
    'college-of-san-mateo-automotive-technology',
    'Automotive Technology',
    'College of San Mateo',
    'community_college',
    'automotive',
    'San Mateo',
    'CA',
    'See provider',
    'See provider',
    'A Bay Area community college pathway for students exploring automotive technology and vehicle service careers.',
    array[
      'Review current college catalog requirements',
      'Confirm current program availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore automotive systems and service concepts',
      'Prepare for continued training or entry-level pathways',
      'Build foundational technical knowledge'
    ],
    'https://collegeofsanmateo.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'de-anza-college-automotive-technology',
    'Automotive Technology',
    'De Anza College',
    'community_college',
    'automotive',
    'Cupertino',
    'CA',
    'See provider',
    'See provider',
    'A Silicon Valley community college pathway for students exploring automotive technology and applied technical careers.',
    array[
      'Review current college catalog requirements',
      'Confirm current program availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore automotive technology fundamentals',
      'Prepare for continued training or entry-level pathways',
      'Build technical awareness in applied transportation systems'
    ],
    'https://www.deanza.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'laney-college-welding-technology',
    'Welding Technology',
    'Laney College',
    'community_college',
    'welding',
    'Oakland',
    'CA',
    'See provider',
    'See provider',
    'A Bay Area community college pathway for students exploring welding, metal work, fabrication, and applied shop skills.',
    array[
      'Review current college catalog requirements',
      'Confirm current course and lab availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore welding and fabrication fundamentals',
      'Prepare for continued skilled-trades training',
      'Build awareness of metalworking career pathways'
    ],
    'https://laney.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'city-college-of-san-francisco-automotive-technology',
    'Automotive Technology',
    'City College of San Francisco',
    'community_college',
    'automotive',
    'San Francisco',
    'CA',
    'See provider',
    'See provider',
    'A Bay Area community college pathway for students exploring automotive technology and vehicle service careers.',
    array[
      'Review current college catalog requirements',
      'Confirm current program availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore automotive service and technology concepts',
      'Prepare for continued training or entry-level pathways',
      'Build foundational technical knowledge'
    ],
    'https://www.ccsf.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),

  (
    'cuesta-college-automotive-technology',
    'Automotive Technology',
    'Cuesta College',
    'community_college',
    'automotive',
    'San Luis Obispo',
    'CA',
    'See provider',
    'See provider',
    'A Central Coast community college pathway for students exploring automotive technology and transportation-related skilled work.',
    array[
      'Review current college catalog requirements',
      'Confirm current program availability',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore automotive systems and service concepts',
      'Prepare for continued training or entry-level pathways',
      'Build technical awareness through applied coursework'
    ],
    'https://www.cuesta.edu/',
    true,
    'admin_created',
    null,
    null,
    now(),
    now(),
    now()
  ),
  (
    'allan-hancock-college-welding-technology',
    'Welding Technology',
    'Allan Hancock College',
    'community_college',
    'welding',
    'Santa Maria',
    'CA',
    'See provider',
    'See provider',
    'A Central Coast community college pathway for students exploring welding, fabrication, and technical shop work.',
    array[
      'Review current college catalog requirements',
      'Confirm lab and safety requirements',
      'Meet college admissions and placement requirements'
    ],
    array[
      'Explore welding and fabrication fundamentals',
      'Prepare for continued skilled-trades training',
      'Build practical technical awareness'
    ],
    'https://www.hancockcollege.edu/',
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