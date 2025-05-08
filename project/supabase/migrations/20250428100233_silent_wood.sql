/*
  # Add tutorials functionality
  
  1. New Tables
    - `tutorial_categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `tutorials`
      - `id` (uuid, primary key)
      - `title` (text)
      - `content` (text)
      - `category_id` (uuid, foreign key)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to modify data
*/

-- Create tutorial categories table
CREATE TABLE IF NOT EXISTS tutorial_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create tutorials table
CREATE TABLE IF NOT EXISTS tutorials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL,
  category_id uuid REFERENCES tutorial_categories(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE tutorial_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorials ENABLE ROW LEVEL SECURITY;

-- Tutorial categories policies
CREATE POLICY "Anyone can read tutorial categories"
  ON tutorial_categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can modify tutorial categories"
  ON tutorial_categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Tutorials policies
CREATE POLICY "Anyone can read tutorials"
  ON tutorials
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can modify tutorials"
  ON tutorials
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default tutorial categories
INSERT INTO tutorial_categories (name, description) VALUES 
  ('Office', 'Tutorials für Microsoft Office und andere Büro-Anwendungen'),
  ('Windows', 'Windows-Betriebssystem und Systemverwaltung'),
  ('Produktivität', 'Tipps und Tricks für effizienteres Arbeiten'),
  ('Sicherheit', 'IT-Sicherheit und Best Practices'),
  ('Kommunikation', 'E-Mail, Teams und andere Kommunikationstools')
ON CONFLICT (name) DO NOTHING;