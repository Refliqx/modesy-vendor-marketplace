export interface Database {
  public: {
    Tables: {
      languages: {
        Row: {
          id: number;
          name: string;
          code: string;
          text_direction: string | null;
          is_default: boolean | null;
          status: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['languages']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['languages']['Row']>;
      };
      currencies: {
        Row: {
          id: number;
          name: string;
          code: string;
          symbol: string;
          exchange_rate: number;
          is_default: boolean | null;
          status: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['currencies']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['currencies']['Row']>;
      };
      categories: {
        Row: {
          id: number;
          slug: string;
          image_path: string | null;
          status: boolean | null;
          created_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['categories']['Row']>;
      };
      category_translations: {
        Row: {
          id: number;
          category_id: number | null;
          language_id: number | null;
          name: string;
        };
        Insert: Omit<Database['public']['Tables']['category_translations']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['category_translations']['Row']>;
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          role: 'buyer' | 'vendor' | 'admin' | null;
          avatar_url: string | null;
          phone_number: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          full_name?: string;
          role?: 'buyer' | 'vendor' | 'admin' | null;
          avatar_url?: string | null;
          phone_number?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      products: {
        Row: {
          id: number;
          vendor_id: number | null;
          category_id: number | null;
          type: 'physical' | 'digital';
          slug: string;
          price: number;
          discount_percent: number | null;
          is_featured: boolean | null;
          stock: number;
          weight: number | null;
          is_draft: boolean | null;
          status: boolean | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['products']['Row']>;
      };
      product_translations: {
        Row: {
          id: number;
          product_id: number | null;
          language_id: number | null;
          title: string;
          description: string;
          short_description: string | null;
        };
        Insert: Omit<Database['public']['Tables']['product_translations']['Row'], 'id'>;
        Update: Partial<Database['public']['Tables']['product_translations']['Row']>;
      };
    };
  };
}
