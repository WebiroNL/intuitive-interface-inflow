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
      ads_campaigns: {
        Row: {
          client_id: string
          contract_duration: string | null
          contract_start_date: string | null
          created_at: string
          deposit_percentage: number | null
          discount_months: number | null
          discount_percentage: number | null
          discount_start_date: string | null
          id: string
          name: string
          platform_costs: Json
          platforms: string[]
          updated_at: string
        }
        Insert: {
          client_id: string
          contract_duration?: string | null
          contract_start_date?: string | null
          created_at?: string
          deposit_percentage?: number | null
          discount_months?: number | null
          discount_percentage?: number | null
          discount_start_date?: string | null
          id?: string
          name: string
          platform_costs?: Json
          platforms?: string[]
          updated_at?: string
        }
        Update: {
          client_id?: string
          contract_duration?: string | null
          contract_start_date?: string | null
          created_at?: string
          deposit_percentage?: number | null
          discount_months?: number | null
          discount_percentage?: number | null
          discount_start_date?: string | null
          id?: string
          name?: string
          platform_costs?: Json
          platforms?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      app_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: string | null
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value?: string | null
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: string | null
        }
        Relationships: []
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
      client_services: {
        Row: {
          category: string | null
          client_id: string
          created_at: string
          id: string
          monthly_price: number | null
          note: string | null
          one_time_price: number | null
          quantity: number | null
          service_id: string | null
          service_name: string
          service_type: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          client_id: string
          created_at?: string
          id?: string
          monthly_price?: number | null
          note?: string | null
          one_time_price?: number | null
          quantity?: number | null
          service_id?: string | null
          service_name: string
          service_type: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          client_id?: string
          created_at?: string
          id?: string
          monthly_price?: number | null
          note?: string | null
          one_time_price?: number | null
          quantity?: number | null
          service_id?: string | null
          service_name?: string
          service_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_services_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          activated_at: string | null
          activation_expires_at: string | null
          activation_token: string | null
          active: boolean
          address_city: string | null
          address_country: string | null
          address_postal: string | null
          address_street: string | null
          btw_number: string | null
          company_name: string
          contact_person: string | null
          contract_duration: string | null
          contract_start_date: string | null
          created_at: string
          deposit_percentage: number | null
          discount_months: number | null
          discount_percentage: number | null
          discount_start_date: string | null
          email: string | null
          first_name: string | null
          id: string
          intake_labels: Json
          intake_sections: Json
          kvk_number: string | null
          last_name: string | null
          logo_url: string | null
          monthly_fee: number | null
          phone: string | null
          show_intake_form: boolean
          show_onboarding_form: boolean
          show_website_intake_form: boolean
          slug: string
          updated_at: string
          user_id: string | null
          visible_menus: Json
          website_intake_labels: Json
          website_intake_sections: Json
        }
        Insert: {
          activated_at?: string | null
          activation_expires_at?: string | null
          activation_token?: string | null
          active?: boolean
          address_city?: string | null
          address_country?: string | null
          address_postal?: string | null
          address_street?: string | null
          btw_number?: string | null
          company_name: string
          contact_person?: string | null
          contract_duration?: string | null
          contract_start_date?: string | null
          created_at?: string
          deposit_percentage?: number | null
          discount_months?: number | null
          discount_percentage?: number | null
          discount_start_date?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          intake_labels?: Json
          intake_sections?: Json
          kvk_number?: string | null
          last_name?: string | null
          logo_url?: string | null
          monthly_fee?: number | null
          phone?: string | null
          show_intake_form?: boolean
          show_onboarding_form?: boolean
          show_website_intake_form?: boolean
          slug: string
          updated_at?: string
          user_id?: string | null
          visible_menus?: Json
          website_intake_labels?: Json
          website_intake_sections?: Json
        }
        Update: {
          activated_at?: string | null
          activation_expires_at?: string | null
          activation_token?: string | null
          active?: boolean
          address_city?: string | null
          address_country?: string | null
          address_postal?: string | null
          address_street?: string | null
          btw_number?: string | null
          company_name?: string
          contact_person?: string | null
          contract_duration?: string | null
          contract_start_date?: string | null
          created_at?: string
          deposit_percentage?: number | null
          discount_months?: number | null
          discount_percentage?: number | null
          discount_start_date?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          intake_labels?: Json
          intake_sections?: Json
          kvk_number?: string | null
          last_name?: string | null
          logo_url?: string | null
          monthly_fee?: number | null
          phone?: string | null
          show_intake_form?: boolean
          show_onboarding_form?: boolean
          show_website_intake_form?: boolean
          slug?: string
          updated_at?: string
          user_id?: string | null
          visible_menus?: Json
          website_intake_labels?: Json
          website_intake_sections?: Json
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
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
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
          payment_url: string | null
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
          payment_url?: string | null
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
          payment_url?: string | null
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
      legal_pages: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          published: boolean
          slug: string
          sort_order: number
          subtitle: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          published?: boolean
          slug: string
          sort_order?: number
          subtitle?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          published?: boolean
          slug?: string
          sort_order?: number
          subtitle?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      marketing_intakes: {
        Row: {
          client_id: string
          created_at: string
          data: Json
          id: string
          status: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          data?: Json
          id?: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          data?: Json
          id?: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "marketing_intakes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      monthly_data: {
        Row: {
          ai_benchmark_text: string | null
          ai_plain_language: Json | null
          ai_reach_text: string | null
          benchmark_ctr: number | null
          benchmark_lpv_cost: number | null
          client_id: string
          cpa: number | null
          created_at: string
          facebook_growth: number | null
          google_clicks: number | null
          google_conversions: number | null
          google_cpc: number | null
          google_cpm: number | null
          google_ctr: number | null
          google_frequency: number | null
          google_impressions: number | null
          google_link_clicks: number | null
          google_lpv: number | null
          google_reach: number | null
          google_spend: number | null
          id: string
          insights: string | null
          instagram_growth: number | null
          linkedin_clicks: number | null
          linkedin_conversions: number | null
          linkedin_cpc: number | null
          linkedin_cpm: number | null
          linkedin_ctr: number | null
          linkedin_frequency: number | null
          linkedin_impressions: number | null
          linkedin_link_clicks: number | null
          linkedin_lpv: number | null
          linkedin_reach: number | null
          linkedin_spend: number | null
          meta_clicks: number | null
          meta_conversions: number | null
          meta_cpc: number | null
          meta_cpm: number | null
          meta_ctr: number | null
          meta_frequency: number | null
          meta_impressions: number | null
          meta_link_clicks: number | null
          meta_lpv: number | null
          meta_reach: number | null
          meta_spend: number | null
          month: number
          pinterest_clicks: number | null
          pinterest_conversions: number | null
          pinterest_cpc: number | null
          pinterest_cpm: number | null
          pinterest_ctr: number | null
          pinterest_frequency: number | null
          pinterest_impressions: number | null
          pinterest_link_clicks: number | null
          pinterest_lpv: number | null
          pinterest_reach: number | null
          pinterest_spend: number | null
          recommendation_bullets: Json | null
          roas: number | null
          snapchat_clicks: number | null
          snapchat_conversions: number | null
          snapchat_cpc: number | null
          snapchat_cpm: number | null
          snapchat_ctr: number | null
          snapchat_frequency: number | null
          snapchat_impressions: number | null
          snapchat_link_clicks: number | null
          snapchat_lpv: number | null
          snapchat_reach: number | null
          snapchat_spend: number | null
          summary_bullets: Json | null
          tiktok_clicks: number | null
          tiktok_conversions: number | null
          tiktok_cpc: number | null
          tiktok_cpm: number | null
          tiktok_ctr: number | null
          tiktok_frequency: number | null
          tiktok_impressions: number | null
          tiktok_link_clicks: number | null
          tiktok_lpv: number | null
          tiktok_reach: number | null
          tiktok_spend: number | null
          total_leads: number | null
          updated_at: string
          webiro_fee: number | null
          year: number
          youtube_clicks: number | null
          youtube_conversions: number | null
          youtube_cpc: number | null
          youtube_cpm: number | null
          youtube_ctr: number | null
          youtube_frequency: number | null
          youtube_impressions: number | null
          youtube_link_clicks: number | null
          youtube_lpv: number | null
          youtube_reach: number | null
          youtube_spend: number | null
        }
        Insert: {
          ai_benchmark_text?: string | null
          ai_plain_language?: Json | null
          ai_reach_text?: string | null
          benchmark_ctr?: number | null
          benchmark_lpv_cost?: number | null
          client_id: string
          cpa?: number | null
          created_at?: string
          facebook_growth?: number | null
          google_clicks?: number | null
          google_conversions?: number | null
          google_cpc?: number | null
          google_cpm?: number | null
          google_ctr?: number | null
          google_frequency?: number | null
          google_impressions?: number | null
          google_link_clicks?: number | null
          google_lpv?: number | null
          google_reach?: number | null
          google_spend?: number | null
          id?: string
          insights?: string | null
          instagram_growth?: number | null
          linkedin_clicks?: number | null
          linkedin_conversions?: number | null
          linkedin_cpc?: number | null
          linkedin_cpm?: number | null
          linkedin_ctr?: number | null
          linkedin_frequency?: number | null
          linkedin_impressions?: number | null
          linkedin_link_clicks?: number | null
          linkedin_lpv?: number | null
          linkedin_reach?: number | null
          linkedin_spend?: number | null
          meta_clicks?: number | null
          meta_conversions?: number | null
          meta_cpc?: number | null
          meta_cpm?: number | null
          meta_ctr?: number | null
          meta_frequency?: number | null
          meta_impressions?: number | null
          meta_link_clicks?: number | null
          meta_lpv?: number | null
          meta_reach?: number | null
          meta_spend?: number | null
          month: number
          pinterest_clicks?: number | null
          pinterest_conversions?: number | null
          pinterest_cpc?: number | null
          pinterest_cpm?: number | null
          pinterest_ctr?: number | null
          pinterest_frequency?: number | null
          pinterest_impressions?: number | null
          pinterest_link_clicks?: number | null
          pinterest_lpv?: number | null
          pinterest_reach?: number | null
          pinterest_spend?: number | null
          recommendation_bullets?: Json | null
          roas?: number | null
          snapchat_clicks?: number | null
          snapchat_conversions?: number | null
          snapchat_cpc?: number | null
          snapchat_cpm?: number | null
          snapchat_ctr?: number | null
          snapchat_frequency?: number | null
          snapchat_impressions?: number | null
          snapchat_link_clicks?: number | null
          snapchat_lpv?: number | null
          snapchat_reach?: number | null
          snapchat_spend?: number | null
          summary_bullets?: Json | null
          tiktok_clicks?: number | null
          tiktok_conversions?: number | null
          tiktok_cpc?: number | null
          tiktok_cpm?: number | null
          tiktok_ctr?: number | null
          tiktok_frequency?: number | null
          tiktok_impressions?: number | null
          tiktok_link_clicks?: number | null
          tiktok_lpv?: number | null
          tiktok_reach?: number | null
          tiktok_spend?: number | null
          total_leads?: number | null
          updated_at?: string
          webiro_fee?: number | null
          year: number
          youtube_clicks?: number | null
          youtube_conversions?: number | null
          youtube_cpc?: number | null
          youtube_cpm?: number | null
          youtube_ctr?: number | null
          youtube_frequency?: number | null
          youtube_impressions?: number | null
          youtube_link_clicks?: number | null
          youtube_lpv?: number | null
          youtube_reach?: number | null
          youtube_spend?: number | null
        }
        Update: {
          ai_benchmark_text?: string | null
          ai_plain_language?: Json | null
          ai_reach_text?: string | null
          benchmark_ctr?: number | null
          benchmark_lpv_cost?: number | null
          client_id?: string
          cpa?: number | null
          created_at?: string
          facebook_growth?: number | null
          google_clicks?: number | null
          google_conversions?: number | null
          google_cpc?: number | null
          google_cpm?: number | null
          google_ctr?: number | null
          google_frequency?: number | null
          google_impressions?: number | null
          google_link_clicks?: number | null
          google_lpv?: number | null
          google_reach?: number | null
          google_spend?: number | null
          id?: string
          insights?: string | null
          instagram_growth?: number | null
          linkedin_clicks?: number | null
          linkedin_conversions?: number | null
          linkedin_cpc?: number | null
          linkedin_cpm?: number | null
          linkedin_ctr?: number | null
          linkedin_frequency?: number | null
          linkedin_impressions?: number | null
          linkedin_link_clicks?: number | null
          linkedin_lpv?: number | null
          linkedin_reach?: number | null
          linkedin_spend?: number | null
          meta_clicks?: number | null
          meta_conversions?: number | null
          meta_cpc?: number | null
          meta_cpm?: number | null
          meta_ctr?: number | null
          meta_frequency?: number | null
          meta_impressions?: number | null
          meta_link_clicks?: number | null
          meta_lpv?: number | null
          meta_reach?: number | null
          meta_spend?: number | null
          month?: number
          pinterest_clicks?: number | null
          pinterest_conversions?: number | null
          pinterest_cpc?: number | null
          pinterest_cpm?: number | null
          pinterest_ctr?: number | null
          pinterest_frequency?: number | null
          pinterest_impressions?: number | null
          pinterest_link_clicks?: number | null
          pinterest_lpv?: number | null
          pinterest_reach?: number | null
          pinterest_spend?: number | null
          recommendation_bullets?: Json | null
          roas?: number | null
          snapchat_clicks?: number | null
          snapchat_conversions?: number | null
          snapchat_cpc?: number | null
          snapchat_cpm?: number | null
          snapchat_ctr?: number | null
          snapchat_frequency?: number | null
          snapchat_impressions?: number | null
          snapchat_link_clicks?: number | null
          snapchat_lpv?: number | null
          snapchat_reach?: number | null
          snapchat_spend?: number | null
          summary_bullets?: Json | null
          tiktok_clicks?: number | null
          tiktok_conversions?: number | null
          tiktok_cpc?: number | null
          tiktok_cpm?: number | null
          tiktok_ctr?: number | null
          tiktok_frequency?: number | null
          tiktok_impressions?: number | null
          tiktok_link_clicks?: number | null
          tiktok_lpv?: number | null
          tiktok_reach?: number | null
          tiktok_spend?: number | null
          total_leads?: number | null
          updated_at?: string
          webiro_fee?: number | null
          year?: number
          youtube_clicks?: number | null
          youtube_conversions?: number | null
          youtube_cpc?: number | null
          youtube_cpm?: number | null
          youtube_ctr?: number | null
          youtube_frequency?: number | null
          youtube_impressions?: number | null
          youtube_link_clicks?: number | null
          youtube_lpv?: number | null
          youtube_reach?: number | null
          youtube_spend?: number | null
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
          address_city: string | null
          address_country: string | null
          address_postal: string | null
          address_street: string | null
          approved_at: string | null
          briefing: Json | null
          btw: number | null
          btw_number: string | null
          client_id: string | null
          cms_hosting: string | null
          company_name: string | null
          contract_duur: string | null
          created_at: string
          delivered_at: string | null
          delivery_status: string | null
          deposit_paid_at: string | null
          email: string | null
          final_paid_at: string | null
          first_name: string | null
          id: string
          kvk_number: string | null
          last_name: string | null
          lead_id: string | null
          maandelijks: number | null
          marketing_services: Json | null
          order_number: string | null
          pakket: string | null
          payment_mode: string | null
          phone: string | null
          quote_status: string | null
          status: string | null
          subtotaal: number | null
          totaal: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          add_ons?: Json | null
          address_city?: string | null
          address_country?: string | null
          address_postal?: string | null
          address_street?: string | null
          approved_at?: string | null
          briefing?: Json | null
          btw?: number | null
          btw_number?: string | null
          client_id?: string | null
          cms_hosting?: string | null
          company_name?: string | null
          contract_duur?: string | null
          created_at?: string
          delivered_at?: string | null
          delivery_status?: string | null
          deposit_paid_at?: string | null
          email?: string | null
          final_paid_at?: string | null
          first_name?: string | null
          id?: string
          kvk_number?: string | null
          last_name?: string | null
          lead_id?: string | null
          maandelijks?: number | null
          marketing_services?: Json | null
          order_number?: string | null
          pakket?: string | null
          payment_mode?: string | null
          phone?: string | null
          quote_status?: string | null
          status?: string | null
          subtotaal?: number | null
          totaal?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          add_ons?: Json | null
          address_city?: string | null
          address_country?: string | null
          address_postal?: string | null
          address_street?: string | null
          approved_at?: string | null
          briefing?: Json | null
          btw?: number | null
          btw_number?: string | null
          client_id?: string | null
          cms_hosting?: string | null
          company_name?: string | null
          contract_duur?: string | null
          created_at?: string
          delivered_at?: string | null
          delivery_status?: string | null
          deposit_paid_at?: string | null
          email?: string | null
          final_paid_at?: string | null
          first_name?: string | null
          id?: string
          kvk_number?: string | null
          last_name?: string | null
          lead_id?: string | null
          maandelijks?: number | null
          marketing_services?: Json | null
          order_number?: string | null
          pakket?: string | null
          payment_mode?: string | null
          phone?: string | null
          quote_status?: string | null
          status?: string | null
          subtotaal?: number | null
          totaal?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_assets: {
        Row: {
          active: boolean
          asset_type: string
          category: string
          created_at: string
          description: string | null
          download_count: number
          external_url: string | null
          file_size: number | null
          file_url: string | null
          id: string
          mime_type: string | null
          min_tier: Database["public"]["Enums"]["partner_tier_name"]
          sort_order: number
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          asset_type?: string
          category?: string
          created_at?: string
          description?: string | null
          download_count?: number
          external_url?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          mime_type?: string | null
          min_tier?: Database["public"]["Enums"]["partner_tier_name"]
          sort_order?: number
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          asset_type?: string
          category?: string
          created_at?: string
          description?: string | null
          download_count?: number
          external_url?: string | null
          file_size?: number | null
          file_url?: string | null
          id?: string
          mime_type?: string | null
          min_tier?: Database["public"]["Enums"]["partner_tier_name"]
          sort_order?: number
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      partner_commissions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          commission_amount: number
          commission_percentage: number
          conversion_source: Database["public"]["Enums"]["partner_conversion_source"]
          created_at: string
          customer_email: string | null
          customer_name: string | null
          id: string
          is_recurring: boolean
          notes: string | null
          order_id: string | null
          partner_id: string
          payout_id: string | null
          product_id: string | null
          product_name: string
          product_type: Database["public"]["Enums"]["partner_product_type"]
          recurring_months: number | null
          sale_amount: number
          shopify_order_id: string | null
          status: Database["public"]["Enums"]["partner_commission_status"]
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          commission_amount?: number
          commission_percentage?: number
          conversion_source?: Database["public"]["Enums"]["partner_conversion_source"]
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          is_recurring?: boolean
          notes?: string | null
          order_id?: string | null
          partner_id: string
          payout_id?: string | null
          product_id?: string | null
          product_name: string
          product_type: Database["public"]["Enums"]["partner_product_type"]
          recurring_months?: number | null
          sale_amount?: number
          shopify_order_id?: string | null
          status?: Database["public"]["Enums"]["partner_commission_status"]
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          commission_amount?: number
          commission_percentage?: number
          conversion_source?: Database["public"]["Enums"]["partner_conversion_source"]
          created_at?: string
          customer_email?: string | null
          customer_name?: string | null
          id?: string
          is_recurring?: boolean
          notes?: string | null
          order_id?: string | null
          partner_id?: string
          payout_id?: string | null
          product_id?: string | null
          product_name?: string
          product_type?: Database["public"]["Enums"]["partner_product_type"]
          recurring_months?: number | null
          sale_amount?: number
          shopify_order_id?: string | null
          status?: Database["public"]["Enums"]["partner_commission_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_commissions_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_payouts: {
        Row: {
          admin_notes: string | null
          amount: number
          bank_reference: string | null
          commission_count: number
          created_at: string
          iban: string | null
          id: string
          invoice_number: string | null
          invoice_url: string | null
          paid_at: string | null
          paid_by: string | null
          partner_id: string
          partner_notes: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["partner_payout_status"]
          updated_at: string
        }
        Insert: {
          admin_notes?: string | null
          amount?: number
          bank_reference?: string | null
          commission_count?: number
          created_at?: string
          iban?: string | null
          id?: string
          invoice_number?: string | null
          invoice_url?: string | null
          paid_at?: string | null
          paid_by?: string | null
          partner_id: string
          partner_notes?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["partner_payout_status"]
          updated_at?: string
        }
        Update: {
          admin_notes?: string | null
          amount?: number
          bank_reference?: string | null
          commission_count?: number
          created_at?: string
          iban?: string | null
          id?: string
          invoice_number?: string | null
          invoice_url?: string | null
          paid_at?: string | null
          paid_by?: string | null
          partner_id?: string
          partner_notes?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["partner_payout_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "partner_payouts_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_referrals: {
        Row: {
          converted: boolean
          converted_at: string | null
          converted_order_id: string | null
          created_at: string
          id: string
          ip_hash: string | null
          landing_page: string | null
          partner_id: string
          referral_code: string
          referrer: string | null
          user_agent: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          converted?: boolean
          converted_at?: string | null
          converted_order_id?: string | null
          created_at?: string
          id?: string
          ip_hash?: string | null
          landing_page?: string | null
          partner_id: string
          referral_code: string
          referrer?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          converted?: boolean
          converted_at?: string | null
          converted_order_id?: string | null
          created_at?: string
          id?: string
          ip_hash?: string | null
          landing_page?: string | null
          partner_id?: string
          referral_code?: string
          referrer?: string | null
          user_agent?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "partner_referrals_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      partner_tiers: {
        Row: {
          benefits: Json
          color: string
          commission_addon: number
          commission_marketing: number
          commission_shop: number
          commission_website: number
          created_at: string
          customer_discount: number
          description: string | null
          display_name: string
          id: string
          max_revenue: number | null
          min_revenue: number
          sort_order: number
          tier: Database["public"]["Enums"]["partner_tier_name"]
          updated_at: string
        }
        Insert: {
          benefits?: Json
          color?: string
          commission_addon?: number
          commission_marketing?: number
          commission_shop?: number
          commission_website?: number
          created_at?: string
          customer_discount?: number
          description?: string | null
          display_name: string
          id?: string
          max_revenue?: number | null
          min_revenue?: number
          sort_order?: number
          tier: Database["public"]["Enums"]["partner_tier_name"]
          updated_at?: string
        }
        Update: {
          benefits?: Json
          color?: string
          commission_addon?: number
          commission_marketing?: number
          commission_shop?: number
          commission_website?: number
          created_at?: string
          customer_discount?: number
          description?: string | null
          display_name?: string
          id?: string
          max_revenue?: number | null
          min_revenue?: number
          sort_order?: number
          tier?: Database["public"]["Enums"]["partner_tier_name"]
          updated_at?: string
        }
        Relationships: []
      }
      partners: {
        Row: {
          address_city: string | null
          address_country: string | null
          address_postal: string | null
          address_street: string | null
          agreed_terms_at: string | null
          approved_at: string | null
          approved_by: string | null
          available_balance: number
          avatar_url: string | null
          bank_name: string | null
          btw_number: string | null
          company_name: string
          contact_person: string
          created_at: string
          discount_code: string
          email: string
          iban: string | null
          id: string
          kvk_number: string | null
          notes: string | null
          pending_balance: number
          phone: string | null
          referral_code: string
          status: Database["public"]["Enums"]["partner_status"]
          tier: Database["public"]["Enums"]["partner_tier_name"]
          total_commission: number
          total_conversions: number
          total_paid: number
          total_referrals: number
          total_revenue: number
          updated_at: string
          user_id: string | null
          website: string | null
        }
        Insert: {
          address_city?: string | null
          address_country?: string | null
          address_postal?: string | null
          address_street?: string | null
          agreed_terms_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          available_balance?: number
          avatar_url?: string | null
          bank_name?: string | null
          btw_number?: string | null
          company_name: string
          contact_person: string
          created_at?: string
          discount_code: string
          email: string
          iban?: string | null
          id?: string
          kvk_number?: string | null
          notes?: string | null
          pending_balance?: number
          phone?: string | null
          referral_code: string
          status?: Database["public"]["Enums"]["partner_status"]
          tier?: Database["public"]["Enums"]["partner_tier_name"]
          total_commission?: number
          total_conversions?: number
          total_paid?: number
          total_referrals?: number
          total_revenue?: number
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Update: {
          address_city?: string | null
          address_country?: string | null
          address_postal?: string | null
          address_street?: string | null
          agreed_terms_at?: string | null
          approved_at?: string | null
          approved_by?: string | null
          available_balance?: number
          avatar_url?: string | null
          bank_name?: string | null
          btw_number?: string | null
          company_name?: string
          contact_person?: string
          created_at?: string
          discount_code?: string
          email?: string
          iban?: string | null
          id?: string
          kvk_number?: string | null
          notes?: string | null
          pending_balance?: number
          phone?: string | null
          referral_code?: string
          status?: Database["public"]["Enums"]["partner_status"]
          tier?: Database["public"]["Enums"]["partner_tier_name"]
          total_commission?: number
          total_conversions?: number
          total_paid?: number
          total_referrals?: number
          total_revenue?: number
          updated_at?: string
          user_id?: string | null
          website?: string | null
        }
        Relationships: []
      }
      payment_links: {
        Row: {
          amount_cents: number
          client_id: string | null
          created_at: string | null
          environment: string
          expires_at: string | null
          id: string
          link_type: string
          metadata: Json | null
          order_id: string | null
          paid: boolean | null
          paid_at: string | null
          stripe_payment_link_url: string | null
          stripe_session_id: string | null
        }
        Insert: {
          amount_cents: number
          client_id?: string | null
          created_at?: string | null
          environment?: string
          expires_at?: string | null
          id?: string
          link_type?: string
          metadata?: Json | null
          order_id?: string | null
          paid?: boolean | null
          paid_at?: string | null
          stripe_payment_link_url?: string | null
          stripe_session_id?: string | null
        }
        Update: {
          amount_cents?: number
          client_id?: string | null
          created_at?: string | null
          environment?: string
          expires_at?: string | null
          id?: string
          link_type?: string
          metadata?: Json | null
          order_id?: string | null
          paid?: boolean | null
          paid_at?: string | null
          stripe_payment_link_url?: string | null
          stripe_session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payment_links_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_links_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount_cents: number
          client_id: string | null
          created_at: string | null
          currency: string
          description: string | null
          environment: string
          id: string
          metadata: Json | null
          order_id: string | null
          payment_type: string
          receipt_url: string | null
          status: string
          stripe_invoice_id: string | null
          stripe_payment_intent_id: string | null
          stripe_session_id: string | null
          subscription_id: string | null
          tax_cents: number | null
          total_cents: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount_cents: number
          client_id?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          environment?: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          payment_type?: string
          receipt_url?: string | null
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subscription_id?: string | null
          tax_cents?: number | null
          total_cents: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount_cents?: number
          client_id?: string | null
          created_at?: string | null
          currency?: string
          description?: string | null
          environment?: string
          id?: string
          metadata?: Json | null
          order_id?: string | null
          payment_type?: string
          receipt_url?: string | null
          status?: string
          stripe_invoice_id?: string | null
          stripe_payment_intent_id?: string | null
          stripe_session_id?: string | null
          subscription_id?: string | null
          tax_cents?: number | null
          total_cents?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payments_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
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
      service_onboardings: {
        Row: {
          admin_notes: string | null
          client_id: string | null
          company_name: string
          contact_person: string
          created_at: string
          data: Json
          email: string
          id: string
          partner_id: string | null
          phone: string | null
          service_type: string
          status: string
          submitted_at: string | null
          submitted_by_user_id: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          admin_notes?: string | null
          client_id?: string | null
          company_name: string
          contact_person: string
          created_at?: string
          data?: Json
          email: string
          id?: string
          partner_id?: string | null
          phone?: string | null
          service_type: string
          status?: string
          submitted_at?: string | null
          submitted_by_user_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          admin_notes?: string | null
          client_id?: string | null
          company_name?: string
          contact_person?: string
          created_at?: string
          data?: Json
          email?: string
          id?: string
          partner_id?: string | null
          phone?: string | null
          service_type?: string
          status?: string
          submitted_at?: string | null
          submitted_by_user_id?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "service_onboardings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "service_onboardings_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "partners"
            referencedColumns: ["id"]
          },
        ]
      }
      showcase_items: {
        Row: {
          category: string
          created_at: string
          description: string
          id: string
          published: boolean
          services: string[]
          sort_order: number
          tint: string
          title: string
          updated_at: string
          url: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string
          id?: string
          published?: boolean
          services?: string[]
          sort_order?: number
          tint?: string
          title: string
          updated_at?: string
          url: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string
          id?: string
          published?: boolean
          services?: string[]
          sort_order?: number
          tint?: string
          title?: string
          updated_at?: string
          url?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean | null
          canceled_at: string | null
          client_id: string | null
          commitment_end_date: string | null
          contract_duration: string
          created_at: string | null
          current_period_end: string | null
          current_period_start: string | null
          environment: string
          id: string
          metadata: Json | null
          price_id: string
          product_id: string
          status: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          client_id?: string | null
          commitment_end_date?: string | null
          contract_duration?: string
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          metadata?: Json | null
          price_id: string
          product_id: string
          status?: string
          stripe_customer_id: string
          stripe_subscription_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          cancel_at_period_end?: boolean | null
          canceled_at?: string | null
          client_id?: string | null
          commitment_end_date?: string | null
          contract_duration?: string
          created_at?: string | null
          current_period_end?: string | null
          current_period_start?: string | null
          environment?: string
          id?: string
          metadata?: Json | null
          price_id?: string
          product_id?: string
          status?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          assignee: Database["public"]["Enums"]["task_assignee"] | null
          category: string
          client_id: string
          client_label: string | null
          completed_at: string | null
          completed_by: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          notes: string | null
          position: number
          service_onboarding_id: string | null
          service_type: string | null
          status: Database["public"]["Enums"]["task_status"]
          template_key: string | null
          title: string
          updated_at: string
          visible_to_client: boolean
        }
        Insert: {
          assignee?: Database["public"]["Enums"]["task_assignee"] | null
          category?: string
          client_id: string
          client_label?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          position?: number
          service_onboarding_id?: string | null
          service_type?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          template_key?: string | null
          title: string
          updated_at?: string
          visible_to_client?: boolean
        }
        Update: {
          assignee?: Database["public"]["Enums"]["task_assignee"] | null
          category?: string
          client_id?: string
          client_label?: string | null
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          notes?: string | null
          position?: number
          service_onboarding_id?: string | null
          service_type?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          template_key?: string | null
          title?: string
          updated_at?: string
          visible_to_client?: boolean
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
      website_intakes: {
        Row: {
          client_id: string
          created_at: string
          data: Json
          id: string
          status: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          client_id: string
          created_at?: string
          data?: Json
          id?: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          client_id?: string
          created_at?: string
          data?: Json
          id?: string
          status?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      generate_partner_code: { Args: { prefix?: string }; Returns: string }
      get_active_subscription_count: {
        Args: { p_client_id: string }
        Returns: number
      }
      get_my_client_id: { Args: never; Returns: string }
      get_my_partner_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      recalculate_partner_balance: {
        Args: { p_partner_id: string }
        Returns: undefined
      }
      seed_task: {
        Args: {
          p_category: string
          p_client_id: string
          p_client_label: string
          p_desc: string
          p_key: string
          p_onb_id: string
          p_pos: number
          p_service_type: string
          p_title: string
          p_visible: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      partner_commission_status: "pending" | "approved" | "paid" | "cancelled"
      partner_conversion_source: "link" | "code" | "manual"
      partner_payout_status: "requested" | "approved" | "paid" | "rejected"
      partner_product_type:
        | "website_package"
        | "marketing_service"
        | "shop_product"
        | "addon"
        | "cms_hosting"
        | "other"
      partner_status: "pending" | "approved" | "suspended" | "rejected"
      partner_tier_name: "bronze" | "silver" | "gold"
      task_assignee: "even" | "mihran"
      task_status:
        | "todo"
        | "in_progress"
        | "waiting_client"
        | "blocked"
        | "done"
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
      partner_commission_status: ["pending", "approved", "paid", "cancelled"],
      partner_conversion_source: ["link", "code", "manual"],
      partner_payout_status: ["requested", "approved", "paid", "rejected"],
      partner_product_type: [
        "website_package",
        "marketing_service",
        "shop_product",
        "addon",
        "cms_hosting",
        "other",
      ],
      partner_status: ["pending", "approved", "suspended", "rejected"],
      partner_tier_name: ["bronze", "silver", "gold"],
      task_assignee: ["even", "mihran"],
      task_status: ["todo", "in_progress", "waiting_client", "blocked", "done"],
    },
  },
} as const
