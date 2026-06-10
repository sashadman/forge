create or replace view public.seeker_readiness_scores
with (security_invoker = on)
as
select
  profiles.id as user_id,
  count(items.id) as total_items,
  count(items.id) filter (
    where items.status = any (
      array[
        'uploaded'::readiness_item_status,
        'complete'::readiness_item_status,
        'verified'::readiness_item_status
      ]
    )
  ) as completed_items,
  count(items.id) filter (
    where items.type = any (
      array[
        'resume'::readiness_item_type,
        'work_authorization'::readiness_item_type,
        'experience_summary'::readiness_item_type,
        'cover_letter_template'::readiness_item_type
      ]
    )
  ) as required_total,
  count(items.id) filter (
    where items.type = any (
      array[
        'resume'::readiness_item_type,
        'work_authorization'::readiness_item_type,
        'experience_summary'::readiness_item_type,
        'cover_letter_template'::readiness_item_type
      ]
    )
    and items.status = any (
      array[
        'uploaded'::readiness_item_status,
        'complete'::readiness_item_status,
        'verified'::readiness_item_status
      ]
    )
  ) as required_completed,
  case
    when count(items.id) filter (
      where items.type = any (
        array[
          'resume'::readiness_item_type,
          'work_authorization'::readiness_item_type,
          'experience_summary'::readiness_item_type,
          'cover_letter_template'::readiness_item_type
        ]
      )
    ) = 0 then 0::numeric
    else round(
      count(items.id) filter (
        where items.type = any (
          array[
            'resume'::readiness_item_type,
            'work_authorization'::readiness_item_type,
            'experience_summary'::readiness_item_type,
            'cover_letter_template'::readiness_item_type
          ]
        )
        and items.status = any (
          array[
            'uploaded'::readiness_item_status,
            'complete'::readiness_item_status,
            'verified'::readiness_item_status
          ]
        )
      )::numeric
      /
      count(items.id) filter (
        where items.type = any (
          array[
            'resume'::readiness_item_type,
            'work_authorization'::readiness_item_type,
            'experience_summary'::readiness_item_type,
            'cover_letter_template'::readiness_item_type
          ]
        )
      )::numeric
      * 100::numeric
    )
  end as score_pct
from public.profiles
left join public.seeker_readiness_items items
  on items.user_id = profiles.id
group by profiles.id;

grant select on public.seeker_readiness_scores to authenticated;