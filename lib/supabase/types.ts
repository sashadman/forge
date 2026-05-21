export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      application_events: {
        Row: {
          actor_id: string | null
          application_id: string
          created_at: string
          id: string
          new_status: Database["public"]["Enums"]["application_status"] | null
          note: string | null
          old_status: Database["public"]["Enums"]["application_status"] | null
        }
        Insert: {
          actor_id?: string | null
          application_id: string
          created_at?: string
          id?: string
          new_status?: Database["public"]["Enums"]["application_status"] | null
          note?: string | null
          old_status?: Database["public"]["Enums"]["application_status"] | null
        }
        Update: {
          actor_id?: string | null
          application_id?: string
          created_at?: string
          id?: string
          new_status?: Database["public"]["Enums"]["application_status"] | null
          note?: string | null
          old_status?: Database["public"]["Enums"]["application_status"] | null
        }
        Relationships: [
          {
            foreignKeyName: "application_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_events_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "seeker_readiness_scores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "application_events_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      application_readiness_snapshots: {
        Row: {
          application_id: string
          captured_at: string
          file_mime_type: string | null
          file_name: string | null
          file_path: string | null
          file_size_kb: number | null
          id: string
          label: string
          notes: string | null
          status: Database["public"]["Enums"]["readiness_item_status"]
          text_content: string | null
          type: Database["public"]["Enums"]["readiness_item_type"]
        }
        Insert: {
          application_id: string
          captured_at?: string
          file_mime_type?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size_kb?: number | null
          id?: string
          label: string
          notes?: string | null
          status: Database["public"]["Enums"]["readiness_item_status"]
          text_content?: string | null
          type: Database["public"]["Enums"]["readiness_item_type"]
        }
        Update: {
          application_id?: string
          captured_at?: string
          file_mime_type?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size_kb?: number | null
          id?: string
          label?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["readiness_item_status"]
          text_content?: string | null
          type?: Database["public"]["Enums"]["readiness_item_type"]
        }
        Relationships: [
          {
            foreignKeyName: "application_readiness_snapshots_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
        ]
      }
      applications: {
        Row: {
          contacted_at: string | null
          created_at: string
          employer_id: string
          employer_notes: string | null
          experience_summary: string | null
          id: string
          intro_message: string | null
          opportunity_id: string
          readiness_required_completed_at_apply: number
          readiness_required_total_at_apply: number
          readiness_score_at_apply: number
          reviewed_at: string | null
          seeker_notes: string | null
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string
          updated_at: string
          user_id: string
          withdrawn_at: string | null
        }
        Insert: {
          contacted_at?: string | null
          created_at?: string
          employer_id: string
          employer_notes?: string | null
          experience_summary?: string | null
          id?: string
          intro_message?: string | null
          opportunity_id: string
          readiness_required_completed_at_apply?: number
          readiness_required_total_at_apply?: number
          readiness_score_at_apply?: number
          reviewed_at?: string | null
          seeker_notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          updated_at?: string
          user_id: string
          withdrawn_at?: string | null
        }
        Update: {
          contacted_at?: string | null
          created_at?: string
          employer_id?: string
          employer_notes?: string | null
          experience_summary?: string | null
          id?: string
          intro_message?: string | null
          opportunity_id?: string
          readiness_required_completed_at_apply?: number
          readiness_required_total_at_apply?: number
          readiness_score_at_apply?: number
          reviewed_at?: string | null
          seeker_notes?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          submitted_at?: string
          updated_at?: string
          user_id?: string
          withdrawn_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "seeker_readiness_scores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      employers: {
        Row: {
          contact_email: string | null
          created_at: string
          description: string
          facebook_url: string | null
          id: string
          industry: string | null
          instagram_url: string | null
          is_active: boolean
          is_verified: boolean
          linkedin_url: string | null
          location: string
          name: string
          other_social_url: string | null
          owner_id: string
          slug: string
          state: string
          tiktok_url: string | null
          updated_at: string
          website_url: string | null
          x_url: string | null
          youtube_url: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          description: string
          facebook_url?: string | null
          id?: string
          industry?: string | null
          instagram_url?: string | null
          is_active?: boolean
          is_verified?: boolean
          linkedin_url?: string | null
          location: string
          name: string
          other_social_url?: string | null
          owner_id: string
          slug: string
          state: string
          tiktok_url?: string | null
          updated_at?: string
          website_url?: string | null
          x_url?: string | null
          youtube_url?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          description?: string
          facebook_url?: string | null
          id?: string
          industry?: string | null
          instagram_url?: string | null
          is_active?: boolean
          is_verified?: boolean
          linkedin_url?: string | null
          location?: string
          name?: string
          other_social_url?: string | null
          owner_id?: string
          slug?: string
          state?: string
          tiktok_url?: string | null
          updated_at?: string
          website_url?: string | null
          x_url?: string | null
          youtube_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employers_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employers_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "seeker_readiness_scores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      opportunities: {
        Row: {
          application_url: string | null
          benefits: string[] | null
          content_hash: string | null
          created_at: string
          description: string
          employer_id: string
          expires_at: string | null
          external_id: string | null
          external_url: string | null
          id: string
          import_batch_id: string | null
          imported_at: string | null
          is_active: boolean
          last_verified_at: string | null
          location: string
          opportunity_type: Database["public"]["Enums"]["opportunity_type"]
          pay_range: string | null
          requirements: string[] | null
          reviewed_at: string | null
          reviewed_by: string | null
          schedule: string | null
          slug: string
          source_attribution: string | null
          source_id: string | null
          source_name: string | null
          source_payload: Json | null
          state: string
          title: string
          trade_slug: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["opportunity_verification_status"]
        }
        Insert: {
          application_url?: string | null
          benefits?: string[] | null
          content_hash?: string | null
          created_at?: string
          description: string
          employer_id: string
          expires_at?: string | null
          external_id?: string | null
          external_url?: string | null
          id?: string
          import_batch_id?: string | null
          imported_at?: string | null
          is_active?: boolean
          last_verified_at?: string | null
          location: string
          opportunity_type: Database["public"]["Enums"]["opportunity_type"]
          pay_range?: string | null
          requirements?: string[] | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          schedule?: string | null
          slug: string
          source_attribution?: string | null
          source_id?: string | null
          source_name?: string | null
          source_payload?: Json | null
          state: string
          title: string
          trade_slug: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["opportunity_verification_status"]
        }
        Update: {
          application_url?: string | null
          benefits?: string[] | null
          content_hash?: string | null
          created_at?: string
          description?: string
          employer_id?: string
          expires_at?: string | null
          external_id?: string | null
          external_url?: string | null
          id?: string
          import_batch_id?: string | null
          imported_at?: string | null
          is_active?: boolean
          last_verified_at?: string | null
          location?: string
          opportunity_type?: Database["public"]["Enums"]["opportunity_type"]
          pay_range?: string | null
          requirements?: string[] | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          schedule?: string | null
          slug?: string
          source_attribution?: string | null
          source_id?: string | null
          source_name?: string | null
          source_payload?: Json | null
          state?: string
          title?: string
          trade_slug?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["opportunity_verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_import_batch_id_fkey"
            columns: ["import_batch_id"]
            isOneToOne: false
            referencedRelation: "opportunity_import_batches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunities_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "seeker_readiness_scores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "opportunities_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "opportunity_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity_import_batches: {
        Row: {
          completed_at: string | null
          created_at: string
          error_count: number
          error_summary: string | null
          id: string
          imported_count: number
          notes: string | null
          skipped_count: number
          source_id: string | null
          started_at: string | null
          started_by: string | null
          status: Database["public"]["Enums"]["import_batch_status"]
          updated_at: string
          updated_count: number
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          error_count?: number
          error_summary?: string | null
          id?: string
          imported_count?: number
          notes?: string | null
          skipped_count?: number
          source_id?: string | null
          started_at?: string | null
          started_by?: string | null
          status?: Database["public"]["Enums"]["import_batch_status"]
          updated_at?: string
          updated_count?: number
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          error_count?: number
          error_summary?: string | null
          id?: string
          imported_count?: number
          notes?: string | null
          skipped_count?: number
          source_id?: string | null
          started_at?: string | null
          started_by?: string | null
          status?: Database["public"]["Enums"]["import_batch_status"]
          updated_at?: string
          updated_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_import_batches_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "opportunity_sources"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_import_batches_started_by_fkey"
            columns: ["started_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_import_batches_started_by_fkey"
            columns: ["started_by"]
            isOneToOne: false
            referencedRelation: "seeker_readiness_scores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      opportunity_pipeline: {
        Row: {
          created_at: string
          follow_up_on: string | null
          id: string
          last_action_at: string | null
          next_action: string | null
          notes: string | null
          opportunity_id: string
          status: Database["public"]["Enums"]["opportunity_pipeline_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          follow_up_on?: string | null
          id?: string
          last_action_at?: string | null
          next_action?: string | null
          notes?: string | null
          opportunity_id: string
          status?: Database["public"]["Enums"]["opportunity_pipeline_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          follow_up_on?: string | null
          id?: string
          last_action_at?: string | null
          next_action?: string | null
          notes?: string | null
          opportunity_id?: string
          status?: Database["public"]["Enums"]["opportunity_pipeline_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_pipeline_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_pipeline_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_pipeline_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "seeker_readiness_scores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      opportunity_sources: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          last_checked_at: string | null
          name: string
          next_review_at: string | null
          notes: string | null
          region: string | null
          reliability_level: Database["public"]["Enums"]["source_reliability_level"]
          reviewed_at: string | null
          reviewed_by: string | null
          search_url: string | null
          slug: string
          source_type: Database["public"]["Enums"]["opportunity_source_type"]
          state: string | null
          trade_focus: string[] | null
          updated_at: string
          website_url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          last_checked_at?: string | null
          name: string
          next_review_at?: string | null
          notes?: string | null
          region?: string | null
          reliability_level?: Database["public"]["Enums"]["source_reliability_level"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          search_url?: string | null
          slug: string
          source_type: Database["public"]["Enums"]["opportunity_source_type"]
          state?: string | null
          trade_focus?: string[] | null
          updated_at?: string
          website_url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          last_checked_at?: string | null
          name?: string
          next_review_at?: string | null
          notes?: string | null
          region?: string | null
          reliability_level?: Database["public"]["Enums"]["source_reliability_level"]
          reviewed_at?: string | null
          reviewed_by?: string | null
          search_url?: string | null
          slug?: string
          source_type?: Database["public"]["Enums"]["opportunity_source_type"]
          state?: string | null
          trade_focus?: string[] | null
          updated_at?: string
          website_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_sources_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_sources_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "seeker_readiness_scores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "opportunity_sources_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_sources_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "seeker_readiness_scores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          experience_level: string | null
          full_name: string | null
          id: string
          location: string | null
          quiz_completed: boolean
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          experience_level?: string | null
          full_name?: string | null
          id: string
          location?: string | null
          quiz_completed?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          experience_level?: string | null
          full_name?: string | null
          id?: string
          location?: string | null
          quiz_completed?: boolean
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      program_pipeline: {
        Row: {
          created_at: string
          follow_up_on: string | null
          id: string
          last_action_at: string | null
          next_action: string | null
          notes: string | null
          program_id: string
          status: Database["public"]["Enums"]["program_pipeline_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          follow_up_on?: string | null
          id?: string
          last_action_at?: string | null
          next_action?: string | null
          notes?: string | null
          program_id: string
          status?: Database["public"]["Enums"]["program_pipeline_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          follow_up_on?: string | null
          id?: string
          last_action_at?: string | null
          next_action?: string | null
          notes?: string | null
          program_id?: string
          status?: Database["public"]["Enums"]["program_pipeline_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "program_pipeline_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_pipeline_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "program_pipeline_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "seeker_readiness_scores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      programs: {
        Row: {
          cost: string | null
          created_at: string
          description: string
          duration: string | null
          id: string
          is_active: boolean
          location: string
          name: string
          outcomes: string[] | null
          program_type: Database["public"]["Enums"]["program_type"]
          provider_name: string
          requirements: string[] | null
          slug: string
          state: string
          trade_slug: string
          updated_at: string
          website_url: string | null
        }
        Insert: {
          cost?: string | null
          created_at?: string
          description: string
          duration?: string | null
          id?: string
          is_active?: boolean
          location: string
          name: string
          outcomes?: string[] | null
          program_type: Database["public"]["Enums"]["program_type"]
          provider_name: string
          requirements?: string[] | null
          slug: string
          state: string
          trade_slug: string
          updated_at?: string
          website_url?: string | null
        }
        Update: {
          cost?: string | null
          created_at?: string
          description?: string
          duration?: string | null
          id?: string
          is_active?: boolean
          location?: string
          name?: string
          outcomes?: string[] | null
          program_type?: Database["public"]["Enums"]["program_type"]
          provider_name?: string
          requirements?: string[] | null
          slug?: string
          state?: string
          trade_slug?: string
          updated_at?: string
          website_url?: string | null
        }
        Relationships: []
      }
      quiz_results: {
        Row: {
          answers: Json
          completed_at: string
          created_at: string
          id: string
          results: Json
          user_id: string
        }
        Insert: {
          answers: Json
          completed_at?: string
          created_at?: string
          id?: string
          results: Json
          user_id: string
        }
        Update: {
          answers?: Json
          completed_at?: string
          created_at?: string
          id?: string
          results?: Json
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "seeker_readiness_scores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      saved_opportunities: {
        Row: {
          created_at: string
          id: string
          opportunity_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          opportunity_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          opportunity_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_opportunities_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_opportunities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_opportunities_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "seeker_readiness_scores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      saved_programs: {
        Row: {
          created_at: string
          id: string
          program_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          program_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          program_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_programs_program_id_fkey"
            columns: ["program_id"]
            isOneToOne: false
            referencedRelation: "programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_programs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_programs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "seeker_readiness_scores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      saved_trades: {
        Row: {
          created_at: string
          id: string
          trade_slug: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          trade_slug: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          trade_slug?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_trades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_trades_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "seeker_readiness_scores"
            referencedColumns: ["user_id"]
          },
        ]
      }
      seeker_readiness_items: {
        Row: {
          created_at: string
          expires_at: string | null
          file_mime_type: string | null
          file_name: string | null
          file_path: string | null
          file_size_kb: number | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["readiness_item_status"]
          text_content: string | null
          type: Database["public"]["Enums"]["readiness_item_type"]
          updated_at: string
          user_id: string
          verified_at: string | null
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          expires_at?: string | null
          file_mime_type?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size_kb?: number | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["readiness_item_status"]
          text_content?: string | null
          type: Database["public"]["Enums"]["readiness_item_type"]
          updated_at?: string
          user_id: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          expires_at?: string | null
          file_mime_type?: string | null
          file_name?: string | null
          file_path?: string | null
          file_size_kb?: number | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["readiness_item_status"]
          text_content?: string | null
          type?: Database["public"]["Enums"]["readiness_item_type"]
          updated_at?: string
          user_id?: string
          verified_at?: string | null
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seeker_readiness_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seeker_readiness_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "seeker_readiness_scores"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "seeker_readiness_items_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seeker_readiness_items_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "seeker_readiness_scores"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      seeker_readiness_scores: {
        Row: {
          completed_items: number | null
          required_completed: number | null
          required_total: number | null
          score_pct: number | null
          total_items: number | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      initialize_user_readiness: {
        Args: { p_user_id: string }
        Returns: undefined
      }
      mark_stale_opportunities: { Args: never; Returns: number }
    }
    Enums: {
      application_status:
        | "submitted"
        | "reviewed"
        | "contacted"
        | "interviewing"
        | "offered"
        | "rejected"
        | "withdrawn"
      import_batch_status:
        | "draft"
        | "running"
        | "completed"
        | "completed_with_errors"
        | "failed"
        | "cancelled"
      opportunity_pipeline_status:
        | "saved"
        | "interested"
        | "preparing"
        | "applied"
        | "interviewing"
        | "offer"
        | "closed"
      opportunity_source_type:
        | "public_job_board"
        | "apprenticeship_directory"
        | "workforce_board"
        | "union_training_center"
        | "employer_career_page"
        | "school_program_page"
        | "government_resource"
        | "community_partner"
        | "manual_research"
        | "other"
      opportunity_type:
        | "job"
        | "apprenticeship"
        | "trainee"
        | "internship"
        | "pre_apprenticeship"
      opportunity_verification_status:
        | "unverified"
        | "source_verified"
        | "admin_reviewed"
        | "employer_verified"
        | "stale"
        | "expired"
        | "rejected"
      program_pipeline_status:
        | "saved"
        | "researching"
        | "contacted"
        | "applying"
        | "enrolled"
        | "completed"
        | "closed"
      program_type:
        | "apprenticeship"
        | "trade_school"
        | "community_college"
        | "workforce_program"
        | "employer_training"
      readiness_item_status:
        | "missing"
        | "in_progress"
        | "uploaded"
        | "complete"
        | "verified"
      readiness_item_type:
        | "resume"
        | "cover_letter_template"
        | "work_authorization"
        | "drivers_license"
        | "certifications"
        | "experience_summary"
        | "references"
        | "background_check_consent"
        | "drug_test_consent"
        | "physical_ability_statement"
      source_reliability_level:
        | "official"
        | "trusted"
        | "needs_review"
        | "experimental"
      user_role: "seeker" | "employer" | "program" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_status: [
        "submitted",
        "reviewed",
        "contacted",
        "interviewing",
        "offered",
        "rejected",
        "withdrawn",
      ],
      import_batch_status: [
        "draft",
        "running",
        "completed",
        "completed_with_errors",
        "failed",
        "cancelled",
      ],
      opportunity_pipeline_status: [
        "saved",
        "interested",
        "preparing",
        "applied",
        "interviewing",
        "offer",
        "closed",
      ],
      opportunity_source_type: [
        "public_job_board",
        "apprenticeship_directory",
        "workforce_board",
        "union_training_center",
        "employer_career_page",
        "school_program_page",
        "government_resource",
        "community_partner",
        "manual_research",
        "other",
      ],
      opportunity_type: [
        "job",
        "apprenticeship",
        "trainee",
        "internship",
        "pre_apprenticeship",
      ],
      opportunity_verification_status: [
        "unverified",
        "source_verified",
        "admin_reviewed",
        "employer_verified",
        "stale",
        "expired",
        "rejected",
      ],
      program_pipeline_status: [
        "saved",
        "researching",
        "contacted",
        "applying",
        "enrolled",
        "completed",
        "closed",
      ],
      program_type: [
        "apprenticeship",
        "trade_school",
        "community_college",
        "workforce_program",
        "employer_training",
      ],
      readiness_item_status: [
        "missing",
        "in_progress",
        "uploaded",
        "complete",
        "verified",
      ],
      readiness_item_type: [
        "resume",
        "cover_letter_template",
        "work_authorization",
        "drivers_license",
        "certifications",
        "experience_summary",
        "references",
        "background_check_consent",
        "drug_test_consent",
        "physical_ability_statement",
      ],
      source_reliability_level: [
        "official",
        "trusted",
        "needs_review",
        "experimental",
      ],
      user_role: ["seeker", "employer", "program", "admin"],
    },
  },
} as const
