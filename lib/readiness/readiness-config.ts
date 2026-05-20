import type {
  ReadinessItemStatus,
  ReadinessItemType,
} from '@/lib/supabase/app-types'

export type ReadinessInputMethod =
  | 'file_upload'
  | 'text_editor'
  | 'checkbox'
  | 'external'

export type ReadinessItemConfig = {
  type: ReadinessItemType
  label: string
  description: string
  whyItMatters: string
  inputMethod: ReadinessInputMethod
  isRequired: boolean
  isSensitive: boolean
  allowedFormats?: string[]
  maxSizeMb?: number
  placeholder?: string
  expires: boolean
  employerLabel: string
  order: number
}

export const READINESS_CONFIG: Record<ReadinessItemType, ReadinessItemConfig> = {
  resume: {
    type: 'resume',
    label: 'Resume',
    description: 'Upload your current resume showing work history and skills.',
    whyItMatters:
      'Employers usually review your resume before deciding whether to contact you. A strong trade resume should highlight hands-on experience, tools, certifications, reliability, and relevant work history.',
    inputMethod: 'file_upload',
    isRequired: true,
    isSensitive: false,
    allowedFormats: ['pdf', 'doc', 'docx', 'txt'],
    maxSizeMb: 10,
    expires: false,
    employerLabel: 'Resume',
    order: 1,
  },

  cover_letter_template: {
    type: 'cover_letter_template',
    label: 'Intro message template',
    description:
      'Write a short reusable message you can customize for applications.',
    whyItMatters:
      'A short, honest intro message can help you stand out when applying to programs or entry-level trade roles.',
    inputMethod: 'text_editor',
    isRequired: true,
    isSensitive: false,
    placeholder:
      "Write a short introduction: who you are, which trade you're pursuing, why you're interested, and what kind of opportunity you're looking for.",
    expires: false,
    employerLabel: 'Intro message',
    order: 2,
  },

  experience_summary: {
    type: 'experience_summary',
    label: 'Experience summary',
    description:
      'Summarize your hands-on experience, projects, military experience, or related skills.',
    whyItMatters:
      'Many people have useful trade-related experience that does not fit neatly on a resume. This helps capture informal, military, school, volunteer, or personal project experience.',
    inputMethod: 'text_editor',
    isRequired: true,
    isSensitive: false,
    placeholder:
      'Describe any relevant experience: tools used, projects completed, military/logistics work, safety experience, school projects, or helping someone in a trade.',
    expires: false,
    employerLabel: 'Experience summary',
    order: 3,
  },

  work_authorization: {
    type: 'work_authorization',
    label: 'Work authorization',
    description: 'Confirm that you are authorized to work in the United States.',
    whyItMatters:
      'Employers need to know that a candidate can legally work before moving forward. This reduces friction later in the hiring process.',
    inputMethod: 'checkbox',
    isRequired: true,
    isSensitive: false,
    expires: false,
    employerLabel: 'Work authorization confirmed',
    order: 4,
  },

  certifications: {
    type: 'certifications',
    label: 'Certifications',
    description:
      'Track trade certifications, safety training, licenses, or courses.',
    whyItMatters:
      'Certifications such as OSHA 10, CPR/First Aid, trade school certificates, or licenses can make a seeker more competitive.',
    inputMethod: 'external',
    isRequired: false,
    isSensitive: false,
    expires: true,
    employerLabel: 'Certifications and licenses',
    order: 5,
  },

  drivers_license: {
    type: 'drivers_license',
    label: "Driver's license",
    description:
      'Confirm whether you have a valid driver’s license for job-site travel.',
    whyItMatters:
      'Many skilled-trades jobs require travel between job sites. A driver’s license can be an important eligibility factor.',
    inputMethod: 'checkbox',
    isRequired: false,
    isSensitive: false,
    expires: true,
    employerLabel: "Driver's license",
    order: 6,
  },

  references: {
    type: 'references',
    label: 'References',
    description: 'Add references who can speak to your reliability and work ethic.',
    whyItMatters:
      'References can help employers or program coordinators verify reliability, attitude, and readiness.',
    inputMethod: 'text_editor',
    isRequired: false,
    isSensitive: false,
    placeholder:
      'List 2–3 references. Include name, relationship, phone/email, and why they can speak about your reliability or work ethic.',
    expires: false,
    employerLabel: 'References',
    order: 7,
  },

  physical_ability_statement: {
    type: 'physical_ability_statement',
    label: 'Physical readiness',
    description:
      'Confirm that you understand trade work may involve lifting, standing, climbing, and physical activity.',
    whyItMatters:
      'Many trades require physical stamina and safety awareness. This helps users think honestly about job fit.',
    inputMethod: 'checkbox',
    isRequired: false,
    isSensitive: false,
    expires: false,
    employerLabel: 'Physical readiness confirmed',
    order: 8,
  },

  background_check_consent: {
    type: 'background_check_consent',
    label: 'Background check consent',
    description:
      'Optional consent placeholder for future employer onboarding workflows.',
    whyItMatters:
      'Some employers require background checks. For now, this is private and not shared with employers.',
    inputMethod: 'checkbox',
    isRequired: false,
    isSensitive: true,
    expires: false,
    employerLabel: 'Background check consent',
    order: 9,
  },

  drug_test_consent: {
    type: 'drug_test_consent',
    label: 'Drug test consent',
    description:
      'Optional consent placeholder for future safety-sensitive hiring workflows.',
    whyItMatters:
      'Some safety-sensitive trade roles may require drug testing. For now, this is private and not shared with employers.',
    inputMethod: 'checkbox',
    isRequired: false,
    isSensitive: true,
    expires: false,
    employerLabel: 'Drug test consent',
    order: 10,
  },
}

export const REQUIRED_READINESS_ITEMS = Object.values(READINESS_CONFIG)
  .filter((item) => item.isRequired)
  .sort((a, b) => a.order - b.order)

export const ALL_READINESS_ITEMS = Object.values(READINESS_CONFIG).sort(
  (a, b) => a.order - b.order
)

export function isReadinessItemComplete(status: ReadinessItemStatus) {
  return ['uploaded', 'complete', 'verified'].includes(status)
}

export function getReadinessStatusLabel(status: ReadinessItemStatus) {
  const labels: Record<ReadinessItemStatus, string> = {
    missing: 'Not started',
    in_progress: 'In progress',
    uploaded: 'Uploaded',
    complete: 'Complete',
    verified: 'Verified',
  }

  return labels[status]
}

export type ReadinessLevel =
  | 'not_started'
  | 'getting_ready'
  | 'almost_ready'
  | 'ready'
  | 'standout'

export function getReadinessLevel(score: number): ReadinessLevel {
  if (score === 0) return 'not_started'
  if (score < 40) return 'getting_ready'
  if (score < 80) return 'almost_ready'
  if (score < 100) return 'ready'
  return 'standout'
}

export const READINESS_LEVEL_CONFIG: Record<
  ReadinessLevel,
  {
    label: string
    description: string
  }
> = {
  not_started: {
    label: 'Not started',
    description: 'Complete your readiness profile before applying.',
  },
  getting_ready: {
    label: 'Getting ready',
    description: 'Good start. Keep completing the required items.',
  },
  almost_ready: {
    label: 'Almost ready',
    description: 'You are close to being ready to apply.',
  },
  ready: {
    label: 'Ready to apply',
    description: 'Your required readiness items are mostly complete.',
  },
  standout: {
    label: 'Standout profile',
    description: 'Your required readiness items are complete.',
  },
}