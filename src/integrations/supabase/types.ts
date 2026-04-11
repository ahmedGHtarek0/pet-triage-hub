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
      activity_log: {
        Row: {
          action: string
          created_at: string
          details: string | null
          id: string
          patient_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          details?: string | null
          id?: string
          patient_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          details?: string | null
          id?: string
          patient_id?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          created_at: string
          customer_address: string
          customer_name: string
          customer_phone: string
          id: string
          payment_method: string
          payment_screenshot_url: string | null
          product_id: string | null
          product_name: string
          quantity: number | null
          status: string
          updated_at: string
          weight_option: string | null
        }
        Insert: {
          created_at?: string
          customer_address: string
          customer_name: string
          customer_phone: string
          id?: string
          payment_method?: string
          payment_screenshot_url?: string | null
          product_id?: string | null
          product_name: string
          quantity?: number | null
          status?: string
          updated_at?: string
          weight_option?: string | null
        }
        Update: {
          created_at?: string
          customer_address?: string
          customer_name?: string
          customer_phone?: string
          id?: string
          payment_method?: string
          payment_screenshot_url?: string | null
          product_id?: string | null
          product_name?: string
          quantity?: number | null
          status?: string
          updated_at?: string
          weight_option?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          animal_age: string | null
          animal_diagnosis: string | null
          animal_sex: string
          animal_species: string
          animal_weight: string | null
          case_category: string | null
          case_sub_type: string[] | null
          case_type: string[] | null
          created_at: string
          id: string
          owner_name: string
          owner_national_id: string | null
          owner_phone: string
          photos: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          animal_age?: string | null
          animal_diagnosis?: string | null
          animal_sex?: string
          animal_species?: string
          animal_weight?: string | null
          case_category?: string | null
          case_sub_type?: string[] | null
          case_type?: string[] | null
          created_at?: string
          id?: string
          owner_name: string
          owner_national_id?: string | null
          owner_phone: string
          photos?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          animal_age?: string | null
          animal_diagnosis?: string | null
          animal_sex?: string
          animal_species?: string
          animal_weight?: string | null
          case_category?: string | null
          case_sub_type?: string[] | null
          case_type?: string[] | null
          created_at?: string
          id?: string
          owner_name?: string
          owner_national_id?: string | null
          owner_phone?: string
          photos?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          in_stock: boolean
          name: string
          price: number
          price_per_kg: number | null
          quantity_type: string
          updated_at: string
          weight_options: string[] | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean
          name: string
          price?: number
          price_per_kg?: number | null
          quantity_type?: string
          updated_at?: string
          weight_options?: string[] | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          in_stock?: boolean
          name?: string
          price?: number
          price_per_kg?: number | null
          quantity_type?: string
          updated_at?: string
          weight_options?: string[] | null
        }
        Relationships: []
      }
      site_content: {
        Row: {
          about_images: string[] | null
          about_text: string
          gallery: Json
          hero_subtitle: string
          hero_title: string
          hero_video_url: string
          id: string
          services: Json
          updated_at: string
        }
        Insert: {
          about_images?: string[] | null
          about_text?: string
          gallery?: Json
          hero_subtitle?: string
          hero_title?: string
          hero_video_url?: string
          id?: string
          services?: Json
          updated_at?: string
        }
        Update: {
          about_images?: string[] | null
          about_text?: string
          gallery?: Json
          hero_subtitle?: string
          hero_title?: string
          hero_video_url?: string
          id?: string
          services?: Json
          updated_at?: string
        }
        Relationships: []
      }
      treatments: {
        Row: {
          created_at: string
          date: string
          drugs: string[] | null
          id: string
          notes: string | null
          patient_id: string
          photos: string[] | null
          staff: string | null
          times: string[] | null
        }
        Insert: {
          created_at?: string
          date: string
          drugs?: string[] | null
          id?: string
          notes?: string | null
          patient_id: string
          photos?: string[] | null
          staff?: string | null
          times?: string[] | null
        }
        Update: {
          created_at?: string
          date?: string
          drugs?: string[] | null
          id?: string
          notes?: string | null
          patient_id?: string
          photos?: string[] | null
          staff?: string | null
          times?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "treatments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
        ]
      }
      vital_signs: {
        Row: {
          created_at: string
          date: string
          drink: string | null
          food: string | null
          id: string
          notes: string | null
          patient_id: string
          stool: string | null
          temp: string | null
          time: string
          urine: string | null
        }
        Insert: {
          created_at?: string
          date: string
          drink?: string | null
          food?: string | null
          id?: string
          notes?: string | null
          patient_id: string
          stool?: string | null
          temp?: string | null
          time: string
          urine?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          drink?: string | null
          food?: string | null
          id?: string
          notes?: string | null
          patient_id?: string
          stool?: string | null
          temp?: string | null
          time?: string
          urine?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vital_signs_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
