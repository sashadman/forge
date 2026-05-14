export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'seeker' | 'employer' | 'program' | 'admin'

export type ProgramType =
  | 'apprenticeship'
  | 'trade_school'
  | 'community_college'
  | 'workforce_program'
  | 'employer_training'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: UserRole
          location: string | null
          experience_level: string | null
          quiz_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          role?: UserRole
          location?: string | null
          experience_level?: string | null
          quiz_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          role?: UserRole
          location?: string | null
          experience_level?: string | null
          quiz_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      quiz_results: {
        Row: {
          id: string
          user_id: string
          answers: Json
          results: Json
          completed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          answers: Json
          results: Json
          completed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          answers?: Json
          results?: Json
          completed_at?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'quiz_results_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }

      saved_trades: {
        Row: {
          id: string
          user_id: string
          trade_slug: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trade_slug: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trade_slug?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'saved_trades_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }

      programs: {
        Row: {
          id: string
          slug: string
          name: string
          provider_name: string
          program_type: ProgramType
          trade_slug: string
          location: string
          state: string
          duration: string | null
          cost: string | null
          description: string
          requirements: string[] | null
          outcomes: string[] | null
          website_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slug: string
          name: string
          provider_name: string
          program_type: ProgramType
          trade_slug: string
          location: string
          state: string
          duration?: string | null
          cost?: string | null
          description: string
          requirements?: string[] | null
          outcomes?: string[] | null
          website_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          slug?: string
          name?: string
          provider_name?: string
          program_type?: ProgramType
          trade_slug?: string
          location?: string
          state?: string
          duration?: string | null
          cost?: string | null
          description?: string
          requirements?: string[] | null
          outcomes?: string[] | null
          website_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }

      saved_programs: {
        Row: {
          id: string
          user_id: string
          program_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          program_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          program_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'saved_programs_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'saved_programs_program_id_fkey'
            columns: ['program_id']
            isOneToOne: false
            referencedRelation: 'programs'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
      program_type: ProgramType
    }
    CompositeTypes: Record<string, never>
  }
}