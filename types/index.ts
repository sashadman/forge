// ─────────────────────────────────────────────
// FORGE PLATFORM — Global Types
// ─────────────────────────────────────────────

// ── User & Auth ──────────────────────────────

export type UserRole = 'seeker' | 'employer' | 'program' | 'admin'

export interface UserProfile {
  id: string
  email: string
  role: UserRole
  full_name: string
  avatar_url?: string
  phone?: string
  location?: string
  created_at: string
  updated_at: string
}

// ── Seeker Profile ────────────────────────────

export type ExperienceLevel = 'no_experience' | 'some_experience' | 'experienced'
export type EducationLevel = 'some_high_school' | 'high_school' | 'some_college' | 'associate' | 'bachelor'
export type AvailabilityType = 'full_time' | 'part_time' | 'apprenticeship' | 'flexible'

export interface SeekerProfile {
  id: string
  user_id: string
  bio?: string
  experience_level: ExperienceLevel
  education_level: EducationLevel
  availability: AvailabilityType
  willing_to_relocate: boolean
  interests: string[]        // trade slugs
  saved_programs: string[]   // program IDs
  saved_employers: string[]  // employer IDs
  quiz_completed: boolean
  quiz_results?: QuizResults
  credentials: Credential[]
  resume_url?: string
  created_at: string
  updated_at: string
}

// ── Trade ─────────────────────────────────────

export type TradeCategory =
  | 'electrical'
  | 'hvac'
  | 'plumbing'
  | 'welding'
  | 'solar'
  | 'construction'
  | 'carpentry'
  | 'masonry'
  | 'roofing'
  | 'painting'
  | 'landscaping'
  | 'automotive'

export interface Trade {
  id: string
  slug: TradeCategory
  name: string
  tagline: string
  description: string
  icon: string                // lucide icon name
  color: string               // tailwind color class
  median_salary: number       // annual USD
  salary_range: { min: number; max: number }
  job_growth_rate: number     // percentage
  training_duration: string   // e.g. "4-5 years apprenticeship"
  key_skills: string[]
  day_in_life: string
  pros: string[]
  cons: string[]
  certifications: string[]
  top_employers: string[]
  is_featured: boolean
}

// ── Quiz ──────────────────────────────────────

export type QuizQuestionType = 'single' | 'multi' | 'scale' | 'preference'

export interface QuizQuestion {
  id: string
  text: string
  subtext?: string
  type: QuizQuestionType
  options: QuizOption[]
  weight: number
}

export interface QuizOption {
  id: string
  text: string
  emoji?: string
  trade_weights: Partial<Record<TradeCategory, number>>
}

export interface QuizAnswer {
  question_id: string
  selected_options: string[]
}

export interface QuizResults {
  completed_at: string
  answers: QuizAnswer[]
  top_trades: Array<{
    trade: TradeCategory
    score: number
    rank: number
  }>
}

// ── Program ───────────────────────────────────

export type ProgramType =
  | 'trade_school'
  | 'community_college'
  | 'apprenticeship'
  | 'union'
  | 'nonprofit'
  | 'bootcamp'
  | 'workforce_dev'

export interface Program {
  id: string
  org_id: string
  name: string
  slug: string
  description: string
  type: ProgramType
  trades: TradeCategory[]
  location: ProgramLocation
  duration: string
  cost: ProgramCost
  schedule: ProgramSchedule
  requirements: string[]
  certifications_offered: string[]
  contact: ContactInfo
  website?: string
  logo_url?: string
  cover_url?: string
  is_verified: boolean
  is_featured: boolean
  accepts_gi_bill: boolean
  financial_aid: boolean
  application_deadline?: string
  next_start_date?: string
  capacity?: number
  spots_remaining?: number
  created_at: string
  updated_at: string
  // computed
  applications_count?: number
  rating?: number
}

export interface ProgramLocation {
  address: string
  city: string
  state: string
  zip: string
  county: string
  coordinates?: { lat: number; lng: number }
  is_remote: boolean
  is_hybrid: boolean
}

export interface ProgramCost {
  total: number
  is_free: boolean
  is_paid_apprenticeship: boolean
  starting_wage?: number  // hourly, if earn-while-learn
  notes?: string
}

export interface ProgramSchedule {
  type: 'full_time' | 'part_time' | 'evenings' | 'weekends' | 'flexible'
  hours_per_week?: number
  notes?: string
}

// ── Employer ──────────────────────────────────

export type CompanySize = 'solo' | 'small' | 'medium' | 'large'

export interface Employer {
  id: string
  org_id: string
  company_name: string
  slug: string
  description: string
  trades: TradeCategory[]
  size: CompanySize
  location: EmployerLocation
  contact: ContactInfo
  website?: string
  logo_url?: string
  cover_url?: string
  is_verified: boolean
  is_featured: boolean
  subscription_tier: SubscriptionTier
  created_at: string
  updated_at: string
  // computed
  open_jobs_count?: number
  rating?: number
}

export interface EmployerLocation {
  city: string
  state: string
  zip: string
  county: string
  service_radius_miles?: number
}

// ── Job / Listing ─────────────────────────────

export type JobType = 'full_time' | 'part_time' | 'apprenticeship' | 'internship' | 'contract'
export type ExperienceRequired = 'entry' | 'junior' | 'mid' | 'senior'

export interface Job {
  id: string
  employer_id: string
  employer?: Employer
  title: string
  slug: string
  description: string
  trade: TradeCategory
  type: JobType
  experience_required: ExperienceRequired
  location: JobLocation
  pay: JobPay
  benefits: string[]
  requirements: string[]
  responsibilities: string[]
  certifications_required: string[]
  is_active: boolean
  is_featured: boolean
  applications_count: number
  views_count: number
  expires_at: string
  created_at: string
  updated_at: string
}

export interface JobLocation {
  city: string
  state: string
  zip: string
  is_remote: boolean
}

export interface JobPay {
  type: 'hourly' | 'salary' | 'negotiable'
  min?: number
  max?: number
  display_string: string
}

// ── Application / Lead ────────────────────────

export type ApplicationStatus =
  | 'submitted'
  | 'viewed'
  | 'interested'
  | 'contacted'
  | 'interview_scheduled'
  | 'hired'
  | 'rejected'
  | 'withdrawn'

export interface Application {
  id: string
  seeker_id: string
  seeker?: SeekerProfile
  job_id?: string
  job?: Job
  program_id?: string
  program?: Program
  status: ApplicationStatus
  cover_letter?: string
  notes?: string
  created_at: string
  updated_at: string
}

// ── Credential ────────────────────────────────

export type CredentialType = 'certification' | 'license' | 'training' | 'apprenticeship' | 'degree'

export interface Credential {
  id: string
  seeker_id: string
  type: CredentialType
  name: string
  issuer: string
  issued_date?: string
  expiry_date?: string
  verification_url?: string
  document_url?: string
  is_verified: boolean
  trade?: TradeCategory
}

// ── Organization ──────────────────────────────

export type OrgType = 'employer' | 'program'

export interface Organization {
  id: string
  type: OrgType
  name: string
  owner_id: string
  members: OrgMember[]
  subscription: Subscription
  created_at: string
}

export interface OrgMember {
  user_id: string
  role: 'owner' | 'admin' | 'member'
  joined_at: string
}

// ── Subscription ──────────────────────────────

export type SubscriptionTier = 'free' | 'starter' | 'pro' | 'enterprise'

export interface Subscription {
  id: string
  org_id: string
  tier: SubscriptionTier
  stripe_subscription_id?: string
  stripe_customer_id?: string
  current_period_start: string
  current_period_end: string
  is_active: boolean
  features: SubscriptionFeatures
}

export interface SubscriptionFeatures {
  max_listings: number
  max_leads_per_month: number
  featured_listing: boolean
  priority_placement: boolean
  ai_writing_assistant: boolean
  analytics_dashboard: boolean
  applicant_tracking: boolean
  csv_export: boolean
}

// ── Subscription Plans ────────────────────────

export const SUBSCRIPTION_PLANS: Record<SubscriptionTier, {
  name: string
  price: number
  description: string
  features: SubscriptionFeatures
  stripe_price_id?: string
}> = {
  free: {
    name: 'Free',
    price: 0,
    description: 'Get started with basic listings',
    features: {
      max_listings: 1,
      max_leads_per_month: 5,
      featured_listing: false,
      priority_placement: false,
      ai_writing_assistant: false,
      analytics_dashboard: false,
      applicant_tracking: false,
      csv_export: false,
    },
  },
  starter: {
    name: 'Starter',
    price: 99,
    description: 'For small contractors hiring 1–3 people',
    features: {
      max_listings: 3,
      max_leads_per_month: 30,
      featured_listing: true,
      priority_placement: false,
      ai_writing_assistant: true,
      analytics_dashboard: false,
      applicant_tracking: true,
      csv_export: false,
    },
  },
  pro: {
    name: 'Pro',
    price: 299,
    description: 'For growing companies with active hiring needs',
    features: {
      max_listings: 10,
      max_leads_per_month: 150,
      featured_listing: true,
      priority_placement: true,
      ai_writing_assistant: true,
      analytics_dashboard: true,
      applicant_tracking: true,
      csv_export: true,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 499,
    description: 'For large companies and multi-location operations',
    features: {
      max_listings: 999,
      max_leads_per_month: 999,
      featured_listing: true,
      priority_placement: true,
      ai_writing_assistant: true,
      analytics_dashboard: true,
      applicant_tracking: true,
      csv_export: true,
    },
  },
}

// ── Messaging ─────────────────────────────────

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
}

export interface Conversation {
  id: string
  participants: string[]
  subject?: string
  last_message?: Message
  created_at: string
}

// ── AI ────────────────────────────────────────

export interface AiMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AiConversation {
  id: string
  user_id: string
  messages: AiMessage[]
  context?: string
  created_at: string
  updated_at: string
}

// ── Shared ────────────────────────────────────

export interface ContactInfo {
  name?: string
  email: string
  phone?: string
}

export interface ApiResponse<T = unknown> {
  data: T | null
  error: string | null
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  per_page: number
  total_pages: number
}

export interface SearchFilters {
  query?: string
  trades?: TradeCategory[]
  location?: string
  radius_miles?: number
  type?: string[]
  is_free?: boolean
  accepts_gi_bill?: boolean
  is_featured?: boolean
  page?: number
  per_page?: number
}