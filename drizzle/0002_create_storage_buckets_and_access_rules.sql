-- Storage buckets ------------------------------------------------------------
--
-- site-media  : PUBLIC bucket for blog cover images, inline post images and
--               gallery photos. Anyone can view; only admins can change.
-- cv-uploads  : PRIVATE bucket for job applicants' CVs. Nobody can read files
--               through the API; the server hands admins short-lived signed
--               URLs instead. Applicants upload through one-time signed upload
--               URLs created by the server, so no visitor policy is needed.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'site-media',
    'site-media',
    true,
    10485760, -- 10 MB
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
  ),
  (
    'cv-uploads',
    'cv-uploads',
    false,
    5242880, -- 5 MB
    array[
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ]
  )
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
--> statement-breakpoint

-- site-media: admins can list, upload, replace and delete --------------------
create policy "admins can read site media"
on storage.objects for select to authenticated
using (bucket_id = 'site-media' and (select public.is_admin()));
--> statement-breakpoint

create policy "admins can upload site media"
on storage.objects for insert to authenticated
with check (bucket_id = 'site-media' and (select public.is_admin()));
--> statement-breakpoint

create policy "admins can update site media"
on storage.objects for update to authenticated
using (bucket_id = 'site-media' and (select public.is_admin()))
with check (bucket_id = 'site-media' and (select public.is_admin()));
--> statement-breakpoint

create policy "admins can delete site media"
on storage.objects for delete to authenticated
using (bucket_id = 'site-media' and (select public.is_admin()));
--> statement-breakpoint

-- cv-uploads: admins can read and delete; nobody else has any access ---------
create policy "admins can read cv uploads"
on storage.objects for select to authenticated
using (bucket_id = 'cv-uploads' and (select public.is_admin()));
--> statement-breakpoint

create policy "admins can delete cv uploads"
on storage.objects for delete to authenticated
using (bucket_id = 'cv-uploads' and (select public.is_admin()));
