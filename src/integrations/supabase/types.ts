export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          activity_type: string | null
          created_at: string | null
          description: string | null
          details: Json | null
          hours: number | null
          id: string
          image_key: string | null
          image_url: string | null
          site_id: string | null
          user_id: string | null
        }
        Insert: {
          activity_type?: string | null
          created_at?: string | null
          description?: string | null
          details?: Json | null
          hours?: number | null
          id?: string
          image_key?: string | null
          image_url?: string | null
          site_id?: string | null
          user_id?: string | null
        }
        Update: {
          activity_type?: string | null
          created_at?: string | null
          description?: string | null
          details?: Json | null
          hours?: number | null
          id?: string
          image_key?: string | null
          image_url?: string | null
          site_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activities_site_id_sites_id_fk"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      authorized_persons: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string
          phone: string
          position: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          phone: string
          position: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          phone?: string
          position?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string | null
          customer_name: string | null
          customer_phone: string | null
          duration_minutes: number | null
          id: string
          notes: string | null
          slot_time: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          slot_time?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_name?: string | null
          customer_phone?: string | null
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          slot_time?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customer_inquiries: {
        Row: {
          created_at: string | null
          email: string | null
          expected_price_range: string | null
          full_name: string | null
          id: string
          notes: string | null
          occupation: string | null
          office_space_requirement: string | null
          office_space_use: string | null
          phone: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          expected_price_range?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          occupation?: string | null
          office_space_requirement?: string | null
          office_space_use?: string | null
          phone: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          expected_price_range?: string | null
          full_name?: string | null
          id?: string
          notes?: string | null
          occupation?: string | null
          office_space_requirement?: string | null
          office_space_use?: string | null
          phone?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      employee_otps: {
        Row: {
          attempts: number | null
          created_at: string | null
          expires_at: string
          otp_hash: string
          phone: string
        }
        Insert: {
          attempts?: number | null
          created_at?: string | null
          expires_at: string
          otp_hash: string
          phone: string
        }
        Update: {
          attempts?: number | null
          created_at?: string | null
          expires_at?: string
          otp_hash?: string
          phone?: string
        }
        Relationships: []
      }
      inventory_items: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string | null
          gujarati_category: string | null
          gujarati_name: string | null
          gujarati_unit: string | null
          id: string
          item_code: string | null
          name: string
          status: string | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          gujarati_category?: string | null
          gujarati_name?: string | null
          gujarati_unit?: string | null
          id?: string
          item_code?: string | null
          name: string
          status?: string | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string | null
          gujarati_category?: string | null
          gujarati_name?: string | null
          gujarati_unit?: string | null
          id?: string
          item_code?: string | null
          name?: string
          status?: string | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_created_by_users_id_fk"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_transactions: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          image_key: string | null
          image_url: string | null
          item_id: string
          new_stock: number
          notes: string | null
          previous_stock: number
          quantity: number
          site_id: string | null
          transaction_type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_key?: string | null
          image_url?: string | null
          item_id: string
          new_stock: number
          notes?: string | null
          previous_stock: number
          quantity: number
          site_id?: string | null
          transaction_type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_key?: string | null
          image_url?: string | null
          item_id?: string
          new_stock?: number
          notes?: string | null
          previous_stock?: number
          quantity?: number
          site_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_created_by_users_id_fk"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_item_id_inventory_items_id_fk"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "inventory_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_site_id_sites_id_fk"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          company_name: string
          created_at: string | null
          currency: string | null
          id: string
          image_key: string | null
          image_url: string | null
          invoice_date: string
          invoice_description: string
          notes: string | null
          site_id: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          company_name: string
          created_at?: string | null
          currency?: string | null
          id?: string
          image_key?: string | null
          image_url?: string | null
          invoice_date: string
          invoice_description: string
          notes?: string | null
          site_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          company_name?: string
          created_at?: string | null
          currency?: string | null
          id?: string
          image_key?: string | null
          image_url?: string | null
          invoice_date?: string
          invoice_description?: string
          notes?: string | null
          site_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_site_id_sites_id_fk"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "invoices_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      material_requests: {
        Row: {
          created_at: string | null
          id: string
          image_key: string | null
          image_url: string | null
          material_name: string | null
          notes: string | null
          quantity: number | null
          requested_date: string | null
          site_id: string | null
          status: string | null
          unit: string | null
          urgency: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          image_key?: string | null
          image_url?: string | null
          material_name?: string | null
          notes?: string | null
          quantity?: number | null
          requested_date?: string | null
          site_id?: string | null
          status?: string | null
          unit?: string | null
          urgency?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          image_key?: string | null
          image_url?: string | null
          material_name?: string | null
          notes?: string | null
          quantity?: number | null
          requested_date?: string | null
          site_id?: string | null
          status?: string | null
          unit?: string | null
          urgency?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "material_requests_site_id_sites_id_fk"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_requests_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      materials: {
        Row: {
          code: string
          created_at: string | null
          id: string
          is_active: boolean | null
          material_group: string
          name: string
          terms: string | null
          unit: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          material_group: string
          name: string
          terms?: string | null
          unit: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          material_group?: string
          name?: string
          terms?: string | null
          unit?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      message_logs: {
        Row: {
          content: string | null
          created_at: string | null
          direction: string | null
          id: string
          message_type: string | null
          metadata: Json | null
          phone: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          direction?: string | null
          id?: string
          message_type?: string | null
          metadata?: Json | null
          phone?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          direction?: string | null
          id?: string
          message_type?: string | null
          metadata?: Json | null
          phone?: string | null
        }
        Relationships: []
      }
      purchase_order_items: {
        Row: {
          created_at: string | null
          id: string
          item_order: number
          material_id: string
          purchase_order_id: string
          quantity: number
          rate: number
          total: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          item_order: number
          material_id: string
          purchase_order_id: string
          quantity: number
          rate: number
          total: number
        }
        Update: {
          created_at?: string | null
          id?: string
          item_order?: number
          material_id?: string
          purchase_order_id?: string
          quantity?: number
          rate?: number
          total?: number
        }
        Relationships: [
          {
            foreignKeyName: "purchase_order_items_material_id_fkey"
            columns: ["material_id"]
            isOneToOne: false
            referencedRelation: "materials"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_order_items_purchase_order_id_fkey"
            columns: ["purchase_order_id"]
            isOneToOne: false
            referencedRelation: "purchase_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_orders: {
        Row: {
          confirmed_by_id: string | null
          contact_person_id: string | null
          created_at: string | null
          created_by: string
          delivery_date: string | null
          delivery_time: string | null
          id: string
          material_terms: string | null
          ordered_by_id: string | null
          po_date: string
          po_number: string
          status: string | null
          total_amount: number | null
          updated_at: string | null
          vendor_id: string
        }
        Insert: {
          confirmed_by_id?: string | null
          contact_person_id?: string | null
          created_at?: string | null
          created_by: string
          delivery_date?: string | null
          delivery_time?: string | null
          id?: string
          material_terms?: string | null
          ordered_by_id?: string | null
          po_date: string
          po_number: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vendor_id: string
        }
        Update: {
          confirmed_by_id?: string | null
          contact_person_id?: string | null
          created_at?: string | null
          created_by?: string
          delivery_date?: string | null
          delivery_time?: string | null
          id?: string
          material_terms?: string | null
          ordered_by_id?: string | null
          po_date?: string
          po_number?: string
          status?: string | null
          total_amount?: number | null
          updated_at?: string | null
          vendor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_orders_confirmed_by_id_fkey"
            columns: ["confirmed_by_id"]
            isOneToOne: false
            referencedRelation: "authorized_persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_contact_person_id_fkey"
            columns: ["contact_person_id"]
            isOneToOne: false
            referencedRelation: "authorized_persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_ordered_by_id_fkey"
            columns: ["ordered_by_id"]
            isOneToOne: false
            referencedRelation: "authorized_persons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_orders_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          data: Json | null
          intent: string | null
          phone: string
          step: string | null
          updated_at: string | null
        }
        Insert: {
          data?: Json | null
          intent?: string | null
          phone: string
          step?: string | null
          updated_at?: string | null
        }
        Update: {
          data?: Json | null
          intent?: string | null
          phone?: string
          step?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      sites: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          image_key: string | null
          image_url: string | null
          location: string | null
          name: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          image_key?: string | null
          image_url?: string | null
          location?: string | null
          name: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          image_key?: string | null
          image_url?: string | null
          location?: string | null
          name?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_site_assignments: {
        Row: {
          assigned_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          permissions: Json | null
          role: string | null
          site_id: string
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          permissions?: Json | null
          role?: string | null
          site_id: string
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          permissions?: Json | null
          role?: string | null
          site_id?: string
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_site_assignments_assigned_by_users_id_fk"
            columns: ["assigned_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_site_assignments_site_id_sites_id_fk"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "sites"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_site_assignments_user_id_users_id_fk"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          introduction_sent: boolean | null
          introduction_sent_at: string | null
          is_verified: boolean | null
          name: string | null
          phone: string
          role: string
          updated_at: string | null
          verified_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          introduction_sent?: boolean | null
          introduction_sent_at?: string | null
          is_verified?: boolean | null
          name?: string | null
          phone: string
          role: string
          updated_at?: string | null
          verified_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          introduction_sent?: boolean | null
          introduction_sent_at?: string | null
          is_verified?: boolean | null
          name?: string | null
          phone?: string
          role?: string
          updated_at?: string | null
          verified_at?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          address: string
          contact_person: string
          created_at: string | null
          gst_number: string
          id: string
          is_active: boolean | null
          material_groups: string[]
          name: string
          phone: string
          updated_at: string | null
        }
        Insert: {
          address: string
          contact_person: string
          created_at?: string | null
          gst_number: string
          id?: string
          is_active?: boolean | null
          material_groups: string[]
          name: string
          phone: string
          updated_at?: string | null
        }
        Update: {
          address?: string
          contact_person?: string
          created_at?: string | null
          gst_number?: string
          id?: string
          is_active?: boolean | null
          material_groups?: string[]
          name?: string
          phone?: string
          updated_at?: string | null
        }
        Relationships: []
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
