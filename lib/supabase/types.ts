export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          user_id: string
          ai_score: number | null
          created_at: string
          updated_at: string
          upvotes: number
          downvotes: number
        }
        Insert: {
          id?: string
          title: string
          description: string
          user_id: string
          ai_score?: number | null
          created_at?: string
          updated_at?: string
          upvotes?: number
          downvotes?: number
        }
        Update: {
          id?: string
          title?: string
          description?: string
          user_id?: string
          ai_score?: number | null
          created_at?: string
          updated_at?: string
          upvotes?: number
          downvotes?: number
        }
      }
      votes: {
        Row: {
          id: string
          project_id: string
          user_id: string
          vote_type: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          vote_type: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          vote_type?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          project_id: string
          user_id: string
          content: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          user_id: string
          content: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          user_id?: string
          content?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}