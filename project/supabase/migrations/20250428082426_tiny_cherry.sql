/*
  # Create software and categories tables

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text, unique)
    
    - `software`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `category` (text)
      - `publisher` (text)
      - `version` (text)
      - `size` (text)
      - `release_date` (timestamptz)
      - `download_url` (text, nullable)
      - `installer_path` (text, nullable)
      - `screenshots` (text[], nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for public read access
    - Add policies for authenticated users to modify data
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE
);

-- Create software table
CREATE TABLE IF NOT EXISTS software (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  publisher text NOT NULL,
  version text NOT NULL,
  size text NOT NULL,
  release_date timestamptz DEFAULT now(),
  download_url text,
  installer_path text,
  screenshots text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE software ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Anyone can read categories"
  ON categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can modify categories"
  ON categories
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Software policies
CREATE POLICY "Anyone can read software"
  ON software
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can modify software"
  ON software
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);