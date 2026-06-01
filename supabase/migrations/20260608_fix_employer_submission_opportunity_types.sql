alter table public.employer_opportunity_submissions
drop constraint if exists employer_opportunity_submissions_opportunity_type_check;

alter table public.employer_opportunity_submissions
add constraint employer_opportunity_submissions_opportunity_type_check
check (
  opportunity_type in (
    'job',
    'apprenticeship',
    'trainee',
    'internship',
    'pre_apprenticeship'
  )
);
