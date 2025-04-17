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
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          created_at?: string
          updated_at?: string
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
    }
  }
}
