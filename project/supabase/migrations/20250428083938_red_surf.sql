/*
  # Add more software categories
  
  This migration adds additional software categories to better organize the applications.
*/

-- Insert new categories if they don't exist
INSERT INTO categories (name)
VALUES 
  ('Audio & Musik'),
  ('Bildbearbeitung'),
  ('Büro & Office'),
  ('Cloud & Backup'),
  ('Datenbanken'),
  ('E-Mail & Messaging'),
  ('Entwicklung'),
  ('Finanzen'),
  ('Gaming'),
  ('Grafik & Design'),
  ('Internet & Netzwerk'),
  ('Multimedia'),
  ('PDF & Dokumente'),
  ('Produktivität'),
  ('Remote & Teamwork'),
  ('Sicherheit'),
  ('System & Tools'),
  ('Video & Animation'),
  ('Virtualisierung'),
  ('Web & Browser')
ON CONFLICT (name) DO NOTHING;