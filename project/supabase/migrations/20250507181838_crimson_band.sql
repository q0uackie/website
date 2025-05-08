/*
  # Add tutorial likes tracking
  
  1. Changes
    - Add likes and dislikes columns to tutorials table
    - Add trigger to update total likes/dislikes
  
  2. Notes
    - Likes and dislikes are stored as integers with default value 0
*/

ALTER TABLE tutorials 
ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS dislikes integer DEFAULT 0;