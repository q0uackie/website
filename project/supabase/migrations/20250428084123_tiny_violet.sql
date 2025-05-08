/*
  # Create storage bucket for software installers
  
  1. Changes
    - Creates a new storage bucket named 'installers' for storing software installation files
    - Sets up appropriate security policies for the bucket
  
  2. Security
    - Enables public read access to installer files
    - Restricts write access to authenticated users only
*/

-- Create the storage bucket for installers
insert into storage.buckets (id, name, public)
values ('installers', 'installers', true);

-- Policy to allow public read access to installer files
create policy "Public can read installer files"
on storage.objects for select
to public
using (bucket_id = 'installers');

-- Policy to allow authenticated users to upload installer files
create policy "Authenticated users can upload installer files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'installers');

-- Policy to allow authenticated users to update their own installer files
create policy "Authenticated users can update installer files"
on storage.objects for update
to authenticated
using (bucket_id = 'installers');

-- Policy to allow authenticated users to delete installer files
create policy "Authenticated users can delete installer files"
on storage.objects for delete
to authenticated
using (bucket_id = 'installers');