/*
  # Add logo field to software table
  
  1. Changes
    - Adds a new `logo` column to the software table for storing logo URLs
  
  2. Notes
    - The logo field is optional (nullable)
    - Existing records will have NULL as the logo value
*/

ALTER TABLE software ADD COLUMN IF NOT EXISTS logo text;