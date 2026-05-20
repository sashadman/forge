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
        ]
      }
      opportunities: {
        Row: {
          application_url: string | null
          benefits: string[] | null
          created_at: string
          description: string
          employer_id: string
          id: string
          is_active: boolean
          location: string
          opportunity_type: Database["public"]["Enums"]["opportunity_type"]
          pay_range: string | null
          requirements: string[] | null
          schedule: string | null
          slug: string
          state: string
          title: string
          trade_slug: string
          updated_at: string
        }
        Insert: {
          application_url?: string | null
          benefits?: string[] | null
          created_at?: string
          description: string
          employer_id: string
          id?: string
          is_active?: boolean
          location: string
          opportunity_type: Database["public"]["Enums"]["opportunity_type"]
          pay_range?: string | null
          requirements?: string[] | null
          schedule?: string | null
          slug: string
          state: string
          title: string
          trade_slug: string
          updated_at?: string
        }
        Update: {
          application_url?: string | null
          benefits?: string[] | null
          created_at?: string
          description?: string
          employer_id?: string
          id?: string
          is_active?: boolean
          location?: string
          opportunity_type?: Database["public"]["Enums"]["opportunity_type"]
          pay_range?: string | null
          requirements?: string[] | null
          schedule?: string | null
          slug?: string
          state?: string
          title?: string
          trade_slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunities_employer_id_fkey"
            columns: ["employer_id"]
            isOneToOne: false
            referencedRelation: "employers"
            referencedColumns: ["id"]
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
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      opportunity_pipeline_status:
        | "saved"
        | "interested"
        | "preparing"
        | "applied"
        | "interviewing"
        | "offer"
        | "closed"
      opportunity_type:
        | "job"
        | "apprenticeship"
        | "trainee"
        | "internship"
        | "pre_apprenticeship"
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
      opportunity_pipeline_status: [
        "saved",
        "interested",
        "preparing",
        "applied",
        "interviewing",
        "offer",
        "closed",
      ],
      opportunity_type: [
        "job",
        "apprenticeship",
        "trainee",
        "internship",
        "pre_apprenticeship",
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
      user_role: ["seeker", "employer", "program", "admin"],
    },
  },
} as const
