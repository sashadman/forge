import type { Enums } from '@/lib/supabase/types'

export type ProgramType = Enums<'program_type'>

export type OpportunityType = Enums<'opportunity_type'>

export type OpportunityPipelineStatus = Enums<'opportunity_pipeline_status'>

export type ProgramPipelineStatus = Enums<'program_pipeline_status'>

export type ReadinessItemType = Enums<'readiness_item_type'>

export type ReadinessItemStatus = Enums<'readiness_item_status'>
export type ApplicationStatus = Enums<'application_status'>
export type OpportunitySourceType = Enums<'opportunity_source_type'>

export type SourceReliabilityLevel = Enums<'source_reliability_level'>

export type ImportBatchStatus = Enums<'import_batch_status'>

export type OpportunityVerificationStatus =
  Enums<'opportunity_verification_status'>