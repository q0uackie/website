export interface Tutorial {
  id: string;
  title: string;
  content: string;
  category_id: string | null;
  created_at: string;
  updated_at: string;
  likes?: number;
  dislikes?: number;
  tutorial_categories?: {
    name: string;
  };
}