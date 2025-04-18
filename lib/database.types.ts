export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          created_at: string
          updated_at: string
          default_role_id: number | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
          default_role_id?: number | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
          default_role_id?: number | null
        }
      }
      youtube_videos: {
        Row: {
          id: number
          youtube_id: string
          title: string
          description: string | null
          thumbnail_url: string | null
          start_time: number | null
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          youtube_id: string
          title: string
          description?: string | null
          thumbnail_url?: string | null
          start_time?: number | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          youtube_id?: string
          title?: string
          description?: string | null
          thumbnail_url?: string | null
          start_time?: number | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      linkedin_posts: {
        Row: {
          id: number
          linkedin_url: string
          title: string | null
          description: string | null
          thumbnail_url: string | null
          user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          linkedin_url: string
          title?: string | null
          description?: string | null
          thumbnail_url?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          linkedin_url?: string
          title?: string | null
          description?: string | null
          thumbnail_url?: string | null
          user_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      video_categories: {
        Row: {
          video_id: number
          category_id: number
        }
        Insert: {
          video_id: number
          category_id: number
        }
        Update: {
          video_id?: number
          category_id?: number
        }
      }
      post_categories: {
        Row: {
          post_id: number
          category_id: number
        }
        Insert: {
          post_id: number
          category_id: number
        }
        Update: {
          post_id?: number
          category_id?: number
        }
      }
      favorites: {
        Row: {
          id: number
          user_id: string
          video_id: number | null
          post_id: number | null
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          video_id?: number | null
          post_id?: number | null
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          video_id?: number | null
          post_id?: number | null
          created_at?: string
        }
      }
      // Nuevas tablas para el sistema de roles
      roles: {
        Row: {
          id: number
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: number
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: number
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      user_roles: {
        Row: {
          id: number
          user_id: string
          role_id: number
          created_at: string
        }
        Insert: {
          id?: number
          user_id: string
          role_id: number
          created_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          role_id?: number
          created_at?: string
        }
      }
    }
    Functions: {
      user_has_role: {
        Args: {
          user_id: string
          role_name: string
        }
        Returns: boolean
      }
      get_user_roles: {
        Args: {
          user_id: string
        }
        Returns: {
          id: number
          name: string
          description: string | null
          created_at: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]
export type Functions<T extends keyof Database["public"]["Functions"]> = Database["public"]["Functions"][T]

// Tipos de ayuda para roles
export type Role = Database["public"]["Tables"]["roles"]["Row"]
export type UserRole = Database["public"]["Tables"]["user_roles"]["Row"]
