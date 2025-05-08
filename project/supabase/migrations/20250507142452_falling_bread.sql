/*
  # Add statistics tracking tables
  
  1. New Tables
    - `page_views`
      - `id` (uuid, primary key)
      - `page` (text)
      - `created_at` (timestamptz)
    
    - `software_downloads`
      - `id` (uuid, primary key)
      - `software_id` (uuid, foreign key)
      - `created_at` (timestamptz)
    
    - `tutorial_views`
      - `id` (uuid, primary key)
      - `tutorial_id` (uuid, foreign key)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public insert
    - Add policies for authenticated users to read
*/

-- Create page views table
CREATE TABLE IF NOT EXISTS page_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create software downloads table
CREATE TABLE IF NOT EXISTS software_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  software_id uuid REFERENCES software(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Create tutorial views table
CREATE TABLE IF NOT EXISTS tutorial_views (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tutorial_id uuid REFERENCES tutorials(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE software_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutorial_views ENABLE ROW LEVEL SECURITY;

-- Page views policies
CREATE POLICY "Anyone can insert page views"
  ON page_views
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read page views"
  ON page_views
  FOR SELECT
  TO authenticated
  USING (true);

-- Software downloads policies
CREATE POLICY "Anyone can insert software downloads"
  ON software_downloads
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read software downloads"
  ON software_downloads
  FOR SELECT
  TO authenticated
  USING (true);

-- Tutorial views policies
CREATE POLICY "Anyone can insert tutorial views"
  ON tutorial_views
  FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read tutorial views"
  ON tutorial_views
  FOR SELECT
  TO authenticated
  USING (true);