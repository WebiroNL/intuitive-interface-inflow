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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          client_id: string
          created_at: string
          description: string | null
          id: string
          occurred_at: string
          title: string
          type: string
        }
        Insert: {
          client_id: string
          created_at?: string
          description?: string | null
          id?: string
          occurred_at?: string
          title: string
          type?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          description?: string | null
          id?: string
          occurred_at?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_log_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          excerpt: string | null
          id: string
          image_url: string | null
          published: boolean
          published_at: string | null
          read_time: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string
          category?: string
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string | null
          read_time?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          published_at?: string | null
          read_time?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      client_files: {
        Row: {
          category: string
          client_id: string
          created_at: string
          file_size: number | null
          file_url: string
          id: string
          mime_type: string | null
          name: string
        }
        Insert: {
          category?: string
          client_id: string
          created_at?: string
          file_size?: number | null
          file_url: string
          id?: string
          mime_type?: string | null
          name: string
        }
        Update: {
          category?: string
          client_id?: string
          created_at?: string
          file_size?: number | null
          file_url?: string
          id?: string
          mime_type?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_files_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          active: boolean
          company_name: string
          contact_person: string | null
          contract_duration: string | null
          created_at: string
          email: string
          id: string
          logo_url: string | null
          monthly_fee: number | null
          phone: string | null
          slug: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          active?: boolean
          company_name: string
          contact_person?: string | null
          contract_duration?: string | null
          created_at?: string
          email: string
          id?: string
          logo_url?: string | null
          monthly_fee?: number | null
          phone?: string | null
          slug: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          active?: boolean
          company_name?: string
          contact_person?: string | null
          contract_duration?: string | null
          created_at?: string
          email?: string
          id?: string
          logo_url?: string | null
          monthly_fee?: number | null
          phone?: string | null
          slug?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      contracts: {
        Row: {
          client_id: string
          created_at: string
          end_date: string | null
          file_url: string | null
          id: string
          start_date: string | null
          title: string
        }
        Insert: {
          client_id: string
          created_at?: string
          end_date?: string | null
          file_url?: string | null
          id?: string
          start_date?: string | null
          title: string
        }
        Update: {
          client_id?: string
          created_at?: string
          end_date?: string | null
          file_url?: string | null
          id?: string
          start_date?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "contracts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          description: string | null
          due_date: string | null
          file_url: string | null
          id: string
          invoice_date: string
          invoice_number: string
          status: string
        }
        Insert: {
          amount?: number
          client_id: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          file_url?: string | null
          id?: string
          invoice_date?: string
          invoice_number: string
          status?: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          description?: string | null
          due_date?: string | null
          file_url?: string | null
          id?: string
          invoice_date?: string
          invoice_number?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "invoices_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          bedrijfsnaam: string | null
          bericht: string | null
          bron: string | null
          created_at: string
          email: string
          id: string
          naam: string
          notities: string | null
          status: string | null
          telefoon: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          bedrijfsnaam?: string | null
          bericht?: string | null
          bron?: string | null
          created_at?: string
          email: string
          id?: string
          naam: string
          notities?: string | null
          status?: string | null
          telefoon?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          bedrijfsnaam?: string | null
          bericht?: string | null
          bron?: string | null
          created_at?: string
          email?: string
          id?: string
          naam?: string
          notities?: string | null
          status?: string | null
          telefoon?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      monthly_data: {
        Row: {
          client_id: string
          cpa: number | null
          created_at: string
          google_clicks: number | null
          google_conversions: number | null
          google_cpc: number | null
          google_ctr: number | null
          google_spend: number | null
          id: string
          insights: string | null
          meta_clicks: number | null
          meta_conversions: number | null
          meta_cpc: number | null
          meta_ctr: number | null
          meta_spend: number | null
          month: number
          roas: number | null
          tiktok_clicks: number | null
          tiktok_conversions: number | null
          tiktok_cpc: number | null
          tiktok_ctr: number | null
          tiktok_spend: number | null
          total_leads: number | null
          updated_at: string
          webiro_fee: number | null
          year: number
        }
        Insert: {
          client_id: string
          cpa?: number | null
          created_at?: string
          google_clicks?: number | null
          google_conversions?: number | null
          google_cpc?: number | null
          google_ctr?: number | null
          google_spend?: number | null
          id?: string
          insights?: string | null
          meta_clicks?: number | null
          meta_conversions?: number | null
          meta_cpc?: number | null
          meta_ctr?: number | null
          meta_spend?: number | null
          month: number
          roas?: number | null
          tiktok_clicks?: number | null
          tiktok_conversions?: number | null
          tiktok_cpc?: number | null
          tiktok_ctr?: number | null
          tiktok_spend?: number | null
          total_leads?: number | null
          updated_at?: string
          webiro_fee?: number | null
          year: number
        }
        Update: {
          client_id?: string
          cpa?: number | null
          created_at?: string
          google_clicks?: number | null
          google_conversions?: number | null
          google_cpc?: number | null
          google_ctr?: number | null
          google_spend?: number | null
          id?: string
          insights?: string | null
          meta_clicks?: number | null
          meta_conversions?: number | null
          meta_cpc?: number | null
          meta_ctr?: number | null
          meta_spend?: number | null
          month?: number
          roas?: number | null
          tiktok_clicks?: number | null
          tiktok_conversions?: number | null
          tiktok_cpc?: number | null
          tiktok_ctr?: number | null
          tiktok_spend?: number | null
          total_leads?: number | null
          updated_at?: string
          webiro_fee?: number | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "monthly_data_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      moodboard_results: {
        Row: {
          ai_result: Json | null
          bedrijfsnaam: string | null
          created_at: string
          email: string | null
          id: string
          lead_id: string | null
          naam: string | null
          notities: string | null
          quiz_answers: Json
          status: string | null
          telefoon: string | null
        }
        Insert: {
          ai_result?: Json | null
          bedrijfsnaam?: string | null
          created_at?: string
          email?: string | null
          id?: string
          lead_id?: string | null
          naam?: string | null
          notities?: string | null
          quiz_answers?: Json
          status?: string | null
          telefoon?: string | null
        }
        Update: {
          ai_result?: Json | null
          bedrijfsnaam?: string | null
          created_at?: string
          email?: string | null
          id?: string
          lead_id?: string | null
          naam?: string | null
          notities?: string | null
          quiz_answers?: Json
          status?: string | null
          telefoon?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "moodboard_results_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          add_ons: Json | null
          briefing: Json | null
          btw: number | null
          cms_hosting: string | null
          contract_duur: string | null
          created_at: string
          id: string
          lead_id: string | null
          maandelijks: number | null
          marketing_services: Json | null
          order_number: string | null
          pakket: string | null
          status: string | null
          subtotaal: number | null
          totaal: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          add_ons?: Json | null
          briefing?: Json | null
          btw?: number | null
          cms_hosting?: string | null
          contract_duur?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          maandelijks?: number | null
          marketing_services?: Json | null
          order_number?: string | null
          pakket?: string | null
          status?: string | null
          subtotaal?: number | null
          totaal?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          add_ons?: Json | null
          briefing?: Json | null
          btw?: number | null
          cms_hosting?: string | null
          contract_duur?: string | null
          created_at?: string
          id?: string
          lead_id?: string | null
          maandelijks?: number | null
          marketing_services?: Json | null
          order_number?: string | null
          pakket?: string | null
          status?: string | null
          subtotaal?: number | null
          totaal?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_client_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
      app_role: ["admin", "moderator", "user"],
    },
  },
} as const
