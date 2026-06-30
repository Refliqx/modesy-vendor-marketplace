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
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      brands: {
        Row: {
          created_at: string | null
          id: number
          logo_path: string | null
          name: string
          slug: string
          status: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          logo_path?: string | null
          name: string
          slug: string
          status?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: never
          logo_path?: string | null
          name?: string
          slug?: string
          status?: boolean | null
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          created_at: string | null
          id: number
          product_id: number
          quantity: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          product_id: number
          quantity?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          product_id?: number
          quantity?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          id: number
          image_path: string | null
          parent_id: number | null
          slug: string
          status: boolean | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_path?: string | null
          parent_id?: number | null
          slug: string
          status?: boolean | null
        }
        Update: {
          created_at?: string | null
          id?: number
          image_path?: string | null
          parent_id?: number | null
          slug?: string
          status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      category_translations: {
        Row: {
          category_id: number | null
          id: number
          language_id: number | null
          name: string
        }
        Insert: {
          category_id?: number | null
          id?: number
          language_id?: number | null
          name: string
        }
        Update: {
          category_id?: number | null
          id?: number
          language_id?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "category_translations_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "category_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
      }
      currencies: {
        Row: {
          code: string
          created_at: string | null
          exchange_rate: number
          id: number
          is_default: boolean | null
          name: string
          status: boolean | null
          symbol: string
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          exchange_rate: number
          id?: number
          is_default?: boolean | null
          name: string
          status?: boolean | null
          symbol: string
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          exchange_rate?: number
          id?: number
          is_default?: boolean | null
          name?: string
          status?: boolean | null
          symbol?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      languages: {
        Row: {
          code: string
          created_at: string | null
          id: number
          is_default: boolean | null
          name: string
          status: boolean | null
          text_direction: string | null
          updated_at: string | null
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: number
          is_default?: boolean | null
          name: string
          status?: boolean | null
          text_direction?: string | null
          updated_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: number
          is_default?: boolean | null
          name?: string
          status?: boolean | null
          text_direction?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      order_items: {
        Row: {
          commission_amount: number | null
          created_at: string | null
          id: number
          order_id: number
          order_status: string | null
          price: number
          product_id: number
          quantity: number
          shipping_cost: number | null
          tracking_number: string | null
          updated_at: string | null
          vendor_earning: number | null
          vendor_id: number
        }
        Insert: {
          commission_amount?: number | null
          created_at?: string | null
          id?: number
          order_id: number
          order_status?: string | null
          price: number
          product_id: number
          quantity: number
          shipping_cost?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          vendor_earning?: number | null
          vendor_id: number
        }
        Update: {
          commission_amount?: number | null
          created_at?: string | null
          id?: number
          order_id?: number
          order_status?: string | null
          price?: number
          product_id?: number
          quantity?: number
          shipping_cost?: number | null
          tracking_number?: string | null
          updated_at?: string | null
          vendor_earning?: number | null
          vendor_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_history: {
        Row: {
          changed_by: string | null
          created_at: string | null
          from_status: string | null
          id: number
          note: string | null
          order_item_id: number
          to_status: string
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          from_status?: string | null
          id?: never
          note?: string | null
          order_item_id: number
          to_status: string
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          from_status?: string | null
          id?: never
          note?: string | null
          order_item_id?: number
          to_status?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_item_id_fkey"
            columns: ["order_item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: number
          order_number: string
          payment_intent_id: string | null
          payment_method: string | null
          payment_status: string | null
          session_id: string | null
          shipping_address: string
          snap_token: string | null
          total_price: number
          total_shipping_cost: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          order_number: string
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          session_id?: string | null
          shipping_address: string
          snap_token?: string | null
          total_price?: number
          total_shipping_cost?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          order_number?: string
          payment_intent_id?: string | null
          payment_method?: string | null
          payment_status?: string | null
          session_id?: string | null
          shipping_address?: string
          snap_token?: string | null
          total_price?: number
          total_shipping_cost?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          created_at: string | null
          id: number
          image_url: string
          is_main: boolean | null
          product_id: number
          row_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          image_url: string
          is_main?: boolean | null
          product_id: number
          row_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: never
          image_url?: string
          is_main?: boolean | null
          product_id?: number
          row_order?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_option_values: {
        Row: {
          id: number
          option_id: number
          price_modifier: number | null
          stock: number | null
          value: string
        }
        Insert: {
          id?: never
          option_id: number
          price_modifier?: number | null
          stock?: number | null
          value: string
        }
        Update: {
          id?: never
          option_id?: number
          price_modifier?: number | null
          stock?: number | null
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_option_values_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "product_options"
            referencedColumns: ["id"]
          },
        ]
      }
      product_options: {
        Row: {
          created_at: string | null
          id: number
          name: string
          product_id: number
        }
        Insert: {
          created_at?: string | null
          id?: never
          name: string
          product_id: number
        }
        Update: {
          created_at?: string | null
          id?: never
          name?: string
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "product_options_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_reviews: {
        Row: {
          created_at: string | null
          id: number
          product_id: number
          rating: number
          review: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          product_id: number
          rating: number
          review?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          product_id?: number
          rating?: number
          review?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_translations: {
        Row: {
          description: string
          id: number
          language_id: number | null
          product_id: number | null
          short_description: string | null
          title: string
        }
        Insert: {
          description: string
          id?: number
          language_id?: number | null
          product_id?: number | null
          short_description?: string | null
          title: string
        }
        Update: {
          description?: string
          id?: number
          language_id?: number | null
          product_id?: number | null
          short_description?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_translations_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_translations_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          brand_id: number | null
          category_id: number | null
          created_at: string | null
          discount_percent: number | null
          id: number
          is_draft: boolean | null
          is_featured: boolean | null
          price: number
          slug: string
          status: boolean | null
          stock: number
          type: Database["public"]["Enums"]["product_type"]
          updated_at: string | null
          vendor_id: number | null
          weight: number | null
        }
        Insert: {
          brand_id?: number | null
          category_id?: number | null
          created_at?: string | null
          discount_percent?: number | null
          id?: number
          is_draft?: boolean | null
          is_featured?: boolean | null
          price?: number
          slug: string
          status?: boolean | null
          stock?: number
          type?: Database["public"]["Enums"]["product_type"]
          updated_at?: string | null
          vendor_id?: number | null
          weight?: number | null
        }
        Update: {
          brand_id?: number | null
          category_id?: number | null
          created_at?: string | null
          discount_percent?: number | null
          id?: number
          is_draft?: boolean | null
          is_featured?: boolean | null
          price?: number
          slug?: string
          status?: boolean | null
          stock?: number
          type?: Database["public"]["Enums"]["product_type"]
          updated_at?: string | null
          vendor_id?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string
          id: string
          phone_number: string | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name: string
          id: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string
          id?: string
          phone_number?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vendors: {
        Row: {
          balance: number | null
          created_at: string | null
          custom_commission_rate: number | null
          id: number
          is_verified: boolean | null
          ship_from_country: string | null
          ship_from_state: string | null
          shop_description: string | null
          shop_logo: string | null
          shop_name: string
          shop_slug: string
          status: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string | null
          custom_commission_rate?: number | null
          id?: number
          is_verified?: boolean | null
          ship_from_country?: string | null
          ship_from_state?: string | null
          shop_description?: string | null
          shop_logo?: string | null
          shop_name: string
          shop_slug: string
          status?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string | null
          custom_commission_rate?: number | null
          id?: number
          is_verified?: boolean | null
          ship_from_country?: string | null
          ship_from_state?: string | null
          shop_description?: string | null
          shop_logo?: string | null
          shop_name?: string
          shop_slug?: string
          status?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          created_at: string | null
          id: number
          product_id: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: never
          product_id: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: never
          product_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      process_checkout: {
        Args: { p_payment_method: string; p_shipping_address: string }
        Returns: string
      }
      update_currency_rates: { Args: { rates: Json }; Returns: undefined }
    }
    Enums: {
      product_type: "physical" | "digital" | "license"
      user_role: "admin" | "vendor" | "customer"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      product_type: ["physical", "digital", "license"],
      user_role: ["admin", "vendor", "customer"],
    },
  },
} as const
