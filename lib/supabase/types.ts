export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'seeker' | 'employer' | 'program' | 'admin'

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
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: UserRole
    }
    CompositeTypes: Record<string, never>
  }
}