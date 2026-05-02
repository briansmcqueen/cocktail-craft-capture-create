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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      affiliate_conversions: {
        Row: {
          actual_total_cents: number | null
          commission_cents: number | null
          conversion_date: string | null
          id: string
          order_id: string | null
          shopping_session_id: string
        }
        Insert: {
          actual_total_cents?: number | null
          commission_cents?: number | null
          conversion_date?: string | null
          id?: string
          order_id?: string | null
          shopping_session_id: string
        }
        Update: {
          actual_total_cents?: number | null
          commission_cents?: number | null
          conversion_date?: string | null
          id?: string
          order_id?: string | null
          shopping_session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_conversions_shopping_session_id_fkey"
            columns: ["shopping_session_id"]
            isOneToOne: false
            referencedRelation: "shopping_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      article_comments: {
        Row: {
          article_id: string
          content: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          article_id: string
          content: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          article_id?: string
          content?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_comments_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      article_favorites: {
        Row: {
          article_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          article_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          article_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "article_favorites_article_id_fkey"
            columns: ["article_id"]
            isOneToOne: false
            referencedRelation: "articles"
            referencedColumns: ["id"]
          },
        ]
      }
      articles: {
        Row: {
          author_id: string
          content: string
          created_at: string
          excerpt: string | null
          featured_image_url: string | null
          id: string
          is_published: boolean | null
          published_at: string | null
          slug: string | null
          source_name: string | null
          source_url: string | null
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug?: string | null
          source_name?: string | null
          source_url?: string | null
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image_url?: string | null
          id?: string
          is_published?: boolean | null
          published_at?: string | null
          slug?: string | null
          source_name?: string | null
          source_url?: string | null
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blocked_users: {
        Row: {
          blocked_id: string
          blocker_id: string
          created_at: string
          id: string
        }
        Insert: {
          blocked_id: string
          blocker_id: string
          created_at?: string
          id?: string
        }
        Update: {
          blocked_id?: string
          blocker_id?: string
          created_at?: string
          id?: string
        }
        Relationships: []
      }
      content_reports: {
        Row: {
          created_at: string
          details: string | null
          id: string
          reason: string
          reporter_id: string
          review_notes: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_owner_id: string | null
          target_type: Database["public"]["Enums"]["report_target_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          details?: string | null
          id?: string
          reason: string
          reporter_id: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id: string
          target_owner_id?: string | null
          target_type: Database["public"]["Enums"]["report_target_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          details?: string | null
          id?: string
          reason?: string
          reporter_id?: string
          review_notes?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["report_status"]
          target_id?: string
          target_owner_id?: string | null
          target_type?: Database["public"]["Enums"]["report_target_type"]
          updated_at?: string
        }
        Relationships: []
      }
      custom_ingredients: {
        Row: {
          aliases: string[] | null
          category: string
          created_at: string
          description: string | null
          id: string
          name: string
          sub_category: string
          updated_at: string
          user_id: string
        }
        Insert: {
          aliases?: string[] | null
          category: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          sub_category: string
          updated_at?: string
          user_id: string
        }
        Update: {
          aliases?: string[] | null
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          sub_category?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string | null
          id: string
          is_public: boolean | null
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_public?: boolean | null
          recipe_id?: string
          user_id?: string
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          recipe_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          recipe_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          recipe_id?: string
          user_id?: string
        }
        Relationships: []
      }
      product_mappings: {
        Row: {
          affiliate_url: string
          created_at: string | null
          id: string
          in_stock: boolean | null
          ingredient_id: string
          price_cents: number | null
          priority: number | null
          product_id: string
          product_name: string
          product_url: string
          retailer_id: string
          size_description: string | null
          size_ml: number | null
          updated_at: string | null
        }
        Insert: {
          affiliate_url: string
          created_at?: string | null
          id?: string
          in_stock?: boolean | null
          ingredient_id: string
          price_cents?: number | null
          priority?: number | null
          product_id: string
          product_name: string
          product_url: string
          retailer_id: string
          size_description?: string | null
          size_ml?: number | null
          updated_at?: string | null
        }
        Update: {
          affiliate_url?: string
          created_at?: string | null
          id?: string
          in_stock?: boolean | null
          ingredient_id?: string
          price_cents?: number | null
          priority?: number | null
          product_id?: string
          product_name?: string
          product_url?: string
          retailer_id?: string
          size_description?: string | null
          size_ml?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_mappings_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          allow_follows: string | null
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          full_name: string | null
          id: string
          onboarding_completed: boolean | null
          profile_visibility: string | null
          recipe_visibility: string | null
          terms_accepted_at: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          allow_follows?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          onboarding_completed?: boolean | null
          profile_visibility?: string | null
          recipe_visibility?: string | null
          terms_accepted_at?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          allow_follows?: string | null
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          onboarding_completed?: boolean | null
          profile_visibility?: string | null
          recipe_visibility?: string | null
          terms_accepted_at?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      recipe_comments: {
        Row: {
          category: string
          content: string
          created_at: string
          id: string
          photo_url: string | null
          recipe_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string
          content: string
          created_at?: string
          id?: string
          photo_url?: string | null
          recipe_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          id?: string
          photo_url?: string | null
          recipe_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recipe_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          recipe_author_id: string
          recipe_id: string
          recipe_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipe_author_id: string
          recipe_id: string
          recipe_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          recipe_author_id?: string
          recipe_id?: string
          recipe_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      recipe_ratings: {
        Row: {
          created_at: string
          id: string
          rating: number
          recipe_id: string
          review: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          rating: number
          recipe_id: string
          review?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          rating?: number
          recipe_id?: string
          review?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      recipe_shares: {
        Row: {
          created_at: string
          id: string
          platform: string
          recipe_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          platform: string
          recipe_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          platform?: string
          recipe_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      recipes: {
        Row: {
          created_at: string | null
          default_servings: number | null
          description: string | null
          difficulty: string | null
          difficulty_rating: number | null
          id: string
          image_url: string | null
          ingredients: string[]
          instructions: string
          is_public: boolean | null
          max_servings: number | null
          min_servings: number | null
          name: string
          notes: string | null
          photo_credit: Json | null
          prep_time: number | null
          rating: number | null
          scaling_notes: string | null
          tags: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          default_servings?: number | null
          description?: string | null
          difficulty?: string | null
          difficulty_rating?: number | null
          id?: string
          image_url?: string | null
          ingredients: string[]
          instructions: string
          is_public?: boolean | null
          max_servings?: number | null
          min_servings?: number | null
          name: string
          notes?: string | null
          photo_credit?: Json | null
          prep_time?: number | null
          rating?: number | null
          scaling_notes?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          default_servings?: number | null
          description?: string | null
          difficulty?: string | null
          difficulty_rating?: number | null
          id?: string
          image_url?: string | null
          ingredients?: string[]
          instructions?: string
          is_public?: boolean | null
          max_servings?: number | null
          min_servings?: number | null
          name?: string
          notes?: string | null
          photo_credit?: Json | null
          prep_time?: number | null
          rating?: number | null
          scaling_notes?: string | null
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      retailers: {
        Row: {
          affiliate_id: string
          base_url: string
          commission_rate: number | null
          created_at: string | null
          delivery_fee_cents: number | null
          id: string
          logo_url: string | null
          min_order_for_delivery: number | null
          name: string
          supports_api: boolean | null
          updated_at: string | null
        }
        Insert: {
          affiliate_id: string
          base_url: string
          commission_rate?: number | null
          created_at?: string | null
          delivery_fee_cents?: number | null
          id: string
          logo_url?: string | null
          min_order_for_delivery?: number | null
          name: string
          supports_api?: boolean | null
          updated_at?: string | null
        }
        Update: {
          affiliate_id?: string
          base_url?: string
          commission_rate?: number | null
          created_at?: string | null
          delivery_fee_cents?: number | null
          id?: string
          logo_url?: string | null
          min_order_for_delivery?: number | null
          name?: string
          supports_api?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: unknown
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: unknown
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      shopping_list_items: {
        Row: {
          created_at: string
          id: string
          ingredient_id: string
          purchased: boolean
          quantity: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id: string
          purchased?: boolean
          quantity?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string
          purchased?: boolean
          quantity?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      shopping_sessions: {
        Row: {
          affiliate_url: string | null
          completed_at: string | null
          created_at: string | null
          estimated_total_cents: number | null
          id: string
          ingredient_ids: string[] | null
          recipe_ids: string[] | null
          retailer_id: string
          status: string | null
          user_id: string
        }
        Insert: {
          affiliate_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          estimated_total_cents?: number | null
          id?: string
          ingredient_ids?: string[] | null
          recipe_ids?: string[] | null
          retailer_id: string
          status?: string | null
          user_id: string
        }
        Update: {
          affiliate_url?: string | null
          completed_at?: string | null
          created_at?: string | null
          estimated_total_cents?: number | null
          id?: string
          ingredient_ids?: string[] | null
          recipe_ids?: string[] | null
          retailer_id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shopping_sessions_retailer_id_fkey"
            columns: ["retailer_id"]
            isOneToOne: false
            referencedRelation: "retailers"
            referencedColumns: ["id"]
          },
        ]
      }
      social_notifications: {
        Row: {
          actor_id: string
          comment_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          notification_type: string
          recipe_id: string | null
          user_id: string
        }
        Insert: {
          actor_id: string
          comment_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          notification_type: string
          recipe_id?: string | null
          user_id: string
        }
        Update: {
          actor_id?: string
          comment_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          notification_type?: string
          recipe_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_bar_presets: {
        Row: {
          created_at: string
          id: string
          ingredient_ids: string[]
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_ids: string[]
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_ids?: string[]
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_ingredients: {
        Row: {
          created_at: string
          id: string
          ingredient_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          ingredient_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          ingredient_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          difficulty_preference: number | null
          flavor_preferences: string[] | null
          id: string
          preferred_spirit_types: string[] | null
          preferred_unit: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          difficulty_preference?: number | null
          flavor_preferences?: string[] | null
          id?: string
          preferred_spirit_types?: string[] | null
          preferred_unit?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          difficulty_preference?: number | null
          flavor_preferences?: string[] | null
          id?: string
          preferred_spirit_types?: string[] | null
          preferred_unit?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      check_rate_limit: {
        Args: {
          p_action: string
          p_limit?: number
          p_user_id: string
          p_window_minutes?: number
        }
        Returns: boolean
      }
      get_batch_recipe_share_counts: {
        Args: { p_recipe_ids: string[] }
        Returns: {
          recipe_id: string
          share_count: number
        }[]
      }
      get_follower_count: { Args: { p_user_id: string }; Returns: number }
      get_following_count: { Args: { p_user_id: string }; Returns: number }
      get_public_profile_by_username: {
        Args: { p_username: string }
        Returns: {
          avatar_url: string
          bio: string
          full_name: string
          id: string
          username: string
        }[]
      }
      get_public_profiles: {
        Args: { user_ids: string[] }
        Returns: {
          avatar_url: string
          id: string
          username: string
        }[]
      }
      get_recipe_like_count: { Args: { p_recipe_id: string }; Returns: number }
      get_recipe_rating_stats: { Args: { p_recipe_id: string }; Returns: Json }
      get_recipe_rating_stats_batch: {
        Args: { p_recipe_ids: string[] }
        Returns: Json[]
      }
      get_recipe_share_stats: { Args: { p_recipe_id: string }; Returns: Json }
      get_safe_comment_data: {
        Args: { p_recipe_id: string }
        Returns: {
          category: string
          content: string
          created_at: string
          id: string
          photo_url: string
          recipe_id: string
          updated_at: string
          user_avatar_url: string
          user_display_name: string
          user_id: string
        }[]
      }
      get_safe_rating_stats: { Args: { p_recipe_id: string }; Returns: Json }
      get_suggested_users: {
        Args: { p_current_user_id: string; p_limit?: number }
        Returns: {
          avatar_url: string
          bio: string
          follower_count: number
          full_name: string
          recipe_count: number
          user_id: string
          username: string
        }[]
      }
      get_trending_users: {
        Args: { p_limit?: number }
        Returns: {
          avatar_url: string
          bio: string
          full_name: string
          recent_follower_count: number
          recipe_count: number
          total_follower_count: number
          user_id: string
          username: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_user_liked_recipe: {
        Args: { p_recipe_id: string; p_user_id: string }
        Returns: boolean
      }
      is_user_blocked: {
        Args: { p_blocked_id: string; p_blocker_id: string }
        Returns: boolean
      }
      validate_affiliate_url: { Args: { url: string }; Returns: boolean }
      verify_admin_access: { Args: { p_user_id?: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      report_status: "pending" | "reviewed" | "dismissed" | "actioned"
      report_target_type: "recipe" | "comment" | "profile"
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
      report_status: ["pending", "reviewed", "dismissed", "actioned"],
      report_target_type: ["recipe", "comment", "profile"],
    },
  },
} as const
