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
      software: {
        Row: {
          id: string
          name: string
          description: string
          category: string
          publisher: string
          version: string
          size: string
          release_date: string
          download_url: string | null
          installer_path: string | null
          screenshots: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: string
          publisher: string
          version: string
          size: string
          release_date?: string
          download_url?: string | null
          installer_path?: string | null
          screenshots?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: string
          publisher?: string
          version?: string
          size?: string
          release_date?: string
          download_url?: string | null
          installer_path?: string | null
          screenshots?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
      }
    }
  }
}