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
      branches: {
        Row: {
          address: string | null
          capacity: number
          city: string
          code: string
          created_at: string
          current_load: number
          id: string
          lat: number | null
          lng: number | null
          phone: string | null
          region: string
        }
        Insert: {
          address?: string | null
          capacity?: number
          city: string
          code: string
          created_at?: string
          current_load?: number
          id?: string
          lat?: number | null
          lng?: number | null
          phone?: string | null
          region: string
        }
        Update: {
          address?: string | null
          capacity?: number
          city?: string
          code?: string
          created_at?: string
          current_load?: number
          id?: string
          lat?: number | null
          lng?: number | null
          phone?: string | null
          region?: string
        }
        Relationships: []
      }
      parcels: {
        Row: {
          category: Database["public"]["Enums"]["parcel_category"]
          created_at: string
          declared_value: number | null
          delivered_at: string | null
          destination_branch_id: string
          fragile: boolean
          id: string
          notes: string | null
          origin_branch_id: string
          price_etb: number
          qr_token: string
          receiver_name: string
          receiver_phone: string
          secret_code: string
          sender_id: string | null
          sender_name: string
          sender_phone: string
          status: Database["public"]["Enums"]["parcel_status"]
          tracking_code: string
          updated_at: string
          weight_kg: number
        }
        Insert: {
          category?: Database["public"]["Enums"]["parcel_category"]
          created_at?: string
          declared_value?: number | null
          delivered_at?: string | null
          destination_branch_id: string
          fragile?: boolean
          id?: string
          notes?: string | null
          origin_branch_id: string
          price_etb?: number
          qr_token: string
          receiver_name: string
          receiver_phone: string
          secret_code: string
          sender_id?: string | null
          sender_name: string
          sender_phone: string
          status?: Database["public"]["Enums"]["parcel_status"]
          tracking_code: string
          updated_at?: string
          weight_kg?: number
        }
        Update: {
          category?: Database["public"]["Enums"]["parcel_category"]
          created_at?: string
          declared_value?: number | null
          delivered_at?: string | null
          destination_branch_id?: string
          fragile?: boolean
          id?: string
          notes?: string | null
          origin_branch_id?: string
          price_etb?: number
          qr_token?: string
          receiver_name?: string
          receiver_phone?: string
          secret_code?: string
          sender_id?: string | null
          sender_name?: string
          sender_phone?: string
          status?: Database["public"]["Enums"]["parcel_status"]
          tracking_code?: string
          updated_at?: string
          weight_kg?: number
        }
        Relationships: [
          {
            foreignKeyName: "parcels_destination_branch_id_fkey"
            columns: ["destination_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "parcels_origin_branch_id_fkey"
            columns: ["origin_branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          branch_id: string | null
          created_at: string
          fan_number: string | null
          full_name: string | null
          id: string
          language: Database["public"]["Enums"]["lang"]
          phone: string | null
        }
        Insert: {
          branch_id?: string | null
          created_at?: string
          fan_number?: string | null
          full_name?: string | null
          id: string
          language?: Database["public"]["Enums"]["lang"]
          phone?: string | null
        }
        Update: {
          branch_id?: string | null
          created_at?: string
          fan_number?: string | null
          full_name?: string | null
          id?: string
          language?: Database["public"]["Enums"]["lang"]
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      tracking_events: {
        Row: {
          actor_id: string | null
          branch_id: string | null
          created_at: string
          id: string
          note: string | null
          parcel_id: string
          status: Database["public"]["Enums"]["parcel_status"]
        }
        Insert: {
          actor_id?: string | null
          branch_id?: string | null
          created_at?: string
          id?: string
          note?: string | null
          parcel_id: string
          status: Database["public"]["Enums"]["parcel_status"]
        }
        Update: {
          actor_id?: string | null
          branch_id?: string | null
          created_at?: string
          id?: string
          note?: string | null
          parcel_id?: string
          status?: Database["public"]["Enums"]["parcel_status"]
        }
        Relationships: [
          {
            foreignKeyName: "tracking_events_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracking_events_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          branch_id: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          branch_id?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          branch_id?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_branch_id_fkey"
            columns: ["branch_id"]
            isOneToOne: false
            referencedRelation: "branches"
            referencedColumns: ["id"]
          },
        ]
      }
      verifications: {
        Row: {
          agent_id: string | null
          created_at: string
          id: string
          ip: string | null
          parcel_id: string
          qr_ok: boolean
          released: boolean
          secret_ok: boolean
        }
        Insert: {
          agent_id?: string | null
          created_at?: string
          id?: string
          ip?: string | null
          parcel_id: string
          qr_ok: boolean
          released?: boolean
          secret_ok: boolean
        }
        Update: {
          agent_id?: string | null
          created_at?: string
          id?: string
          ip?: string | null
          parcel_id?: string
          qr_ok?: boolean
          released?: boolean
          secret_ok?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "verifications_parcel_id_fkey"
            columns: ["parcel_id"]
            isOneToOne: false
            referencedRelation: "parcels"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role:
        | "super_admin"
        | "branch_manager"
        | "agent"
        | "driver"
        | "customer"
      lang: "en" | "am"
      parcel_category:
        | "documents"
        | "electronics"
        | "clothing"
        | "food"
        | "fragile"
        | "medical"
        | "other"
      parcel_status:
        | "registered"
        | "stored"
        | "in_transit"
        | "arrived_hub"
        | "ready_for_pickup"
        | "out_for_delivery"
        | "delivered"
        | "returned"
        | "lost"
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
      app_role: [
        "super_admin",
        "branch_manager",
        "agent",
        "driver",
        "customer",
      ],
      lang: ["en", "am"],
      parcel_category: [
        "documents",
        "electronics",
        "clothing",
        "food",
        "fragile",
        "medical",
        "other",
      ],
      parcel_status: [
        "registered",
        "stored",
        "in_transit",
        "arrived_hub",
        "ready_for_pickup",
        "out_for_delivery",
        "delivered",
        "returned",
        "lost",
      ],
    },
  },
} as const
