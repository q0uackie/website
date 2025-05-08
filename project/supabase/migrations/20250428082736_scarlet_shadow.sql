/*
  # Create software table

  1. New Tables
    - `software`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `description` (text)
      - `category` (text)
      - `publisher` (text)
      - `version` (text)
      - `size` (text)
      - `release_date` (date)
      - `download_url` (text)
      - `installer_path` (text)
      - `screenshots` (text array)
      - `created_at` (timestamp with timezone)
      - `updated_at` (timestamp with timezone)

  2. Security
    - Enable RLS on `software` table
    - Add policies for:
      - Public read access to all software
      - Authenticated admin users can create/update/delete software
*/

CREATE TABLE IF NOT EXISTS software (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  category text,
  publisher text,
  version text,
  size text,
  release_date date,
  download_url text,
  installer_path text,
  screenshots text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE software ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access"
  ON software
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage software
CREATE POLICY "Allow authenticated users to manage software"
  ON software
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_software_updated_at
  BEFORE UPDATE ON software
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();