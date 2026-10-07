CREATE TYPE "public"."post_category" AS ENUM('blog', 'news', 'press');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'scheduled');--> statement-breakpoint
CREATE TYPE "public"."submission_form_type" AS ENUM('service_request', 'job_application', 'training_enquiry');--> statement-breakpoint
CREATE TYPE "public"."submission_status" AS ENUM('new', 'in_progress', 'contacted', 'closed');--> statement-breakpoint
CREATE TABLE "admin_users" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"display_name" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "admin_users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "job_application_details" (
	"submission_id" uuid PRIMARY KEY NOT NULL,
	"position_slug" text NOT NULL,
	"years_of_experience" integer NOT NULL,
	"location" text NOT NULL,
	"availability" text NOT NULL,
	"cover_note" text NOT NULL,
	"cv_storage_path" text NOT NULL,
	"cv_original_file_name" text NOT NULL,
	"cv_file_size_in_bytes" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "job_application_details" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "service_request_details" (
	"submission_id" uuid PRIMARY KEY NOT NULL,
	"company_name" text,
	"service_slug" text NOT NULL,
	"industry_slug" text NOT NULL,
	"site_location" text NOT NULL,
	"estimated_scope" text NOT NULL,
	"preferred_start_date" date,
	"message" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "service_request_details" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "submission_notes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"submission_id" uuid NOT NULL,
	"author_user_id" uuid,
	"body" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "submission_notes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"form_type" "submission_form_type" NOT NULL,
	"status" "submission_status" DEFAULT 'new' NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"ip_address_hash" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "submissions" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "training_enquiry_details" (
	"submission_id" uuid PRIMARY KEY NOT NULL,
	"course_slug" text NOT NULL,
	"number_of_trainees" integer NOT NULL,
	"message" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "training_enquiry_details" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "post_tags" (
	"post_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	CONSTRAINT "post_tags_post_id_tag_id_pk" PRIMARY KEY("post_id","tag_id")
);
--> statement-breakpoint
ALTER TABLE "post_tags" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"excerpt" text DEFAULT '' NOT NULL,
	"content_json" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"content_html" text DEFAULT '' NOT NULL,
	"content_plain_text" text DEFAULT '' NOT NULL,
	"cover_image_path" text,
	"cover_image_alt_text" text,
	"category" "post_category" DEFAULT 'blog' NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp with time zone,
	"seo_title" text,
	"meta_description" text,
	"reading_time_in_minutes" integer DEFAULT 1 NOT NULL,
	"author_user_id" uuid,
	"author_name" text DEFAULT 'Deltacon Security' NOT NULL,
	"search_vector" "tsvector" GENERATED ALWAYS AS (setweight(to_tsvector('english', coalesce("posts"."title", '')), 'A') || setweight(to_tsvector('english', coalesce("posts"."excerpt", '')), 'B') || setweight(to_tsvector('english', coalesce("posts"."content_plain_text", '')), 'C')) STORED,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "posts_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "posts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	CONSTRAINT "tags_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "tags" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "gallery_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "gallery_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "gallery_categories" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"storage_path" text NOT NULL,
	"width_in_pixels" integer NOT NULL,
	"height_in_pixels" integer NOT NULL,
	"blur_placeholder" text,
	"alt_text" text NOT NULL,
	"caption" text,
	"category_id" uuid,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gallery_images" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "admin_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"notification_email" text NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_settings_single_row" CHECK ("admin_settings"."id" = 1)
);
--> statement-breakpoint
ALTER TABLE "admin_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "site_settings" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"company_email" text NOT NULL,
	"phone_display" text NOT NULL,
	"phone_international" text NOT NULL,
	"social_links" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "site_settings_single_row" CHECK ("site_settings"."id" = 1)
);
--> statement-breakpoint
ALTER TABLE "site_settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"window_started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"request_count" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "rate_limits" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "admin_users" ADD CONSTRAINT "admin_users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_application_details" ADD CONSTRAINT "job_application_details_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_request_details" ADD CONSTRAINT "service_request_details_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_notes" ADD CONSTRAINT "submission_notes_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submission_notes" ADD CONSTRAINT "submission_notes_author_user_id_admin_users_user_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."admin_users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "training_enquiry_details" ADD CONSTRAINT "training_enquiry_details_submission_id_submissions_id_fk" FOREIGN KEY ("submission_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_user_id_admin_users_user_id_fk" FOREIGN KEY ("author_user_id") REFERENCES "public"."admin_users"("user_id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_category_id_gallery_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."gallery_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "submission_notes_by_submission_index" ON "submission_notes" USING btree ("submission_id","created_at");--> statement-breakpoint
CREATE INDEX "submissions_inbox_index" ON "submissions" USING btree ("form_type","status","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "post_tags_by_tag_index" ON "post_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "posts_public_listing_index" ON "posts" USING btree ("status","category","published_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "posts_search_index" ON "posts" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "gallery_images_display_order_index" ON "gallery_images" USING btree ("sort_order","created_at");--> statement-breakpoint
CREATE POLICY "admins can read admin users" ON "admin_users" AS PERMISSIVE FOR SELECT TO "authenticated" USING ((select public.is_admin()));--> statement-breakpoint
CREATE POLICY "visitors can create job application details" ON "job_application_details" AS PERMISSIVE FOR INSERT TO "anon", "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "admins can manage job application details" ON "job_application_details" AS PERMISSIVE FOR ALL TO "authenticated" USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));--> statement-breakpoint
CREATE POLICY "visitors can create service request details" ON "service_request_details" AS PERMISSIVE FOR INSERT TO "anon", "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "admins can manage service request details" ON "service_request_details" AS PERMISSIVE FOR ALL TO "authenticated" USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));--> statement-breakpoint
CREATE POLICY "admins can manage submission notes" ON "submission_notes" AS PERMISSIVE FOR ALL TO "authenticated" USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));--> statement-breakpoint
CREATE POLICY "visitors can create new submissions" ON "submissions" AS PERMISSIVE FOR INSERT TO "anon", "authenticated" WITH CHECK ("submissions"."status" = 'new');--> statement-breakpoint
CREATE POLICY "admins can manage submissions" ON "submissions" AS PERMISSIVE FOR ALL TO "authenticated" USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));--> statement-breakpoint
CREATE POLICY "visitors can create training enquiry details" ON "training_enquiry_details" AS PERMISSIVE FOR INSERT TO "anon", "authenticated" WITH CHECK (true);--> statement-breakpoint
CREATE POLICY "admins can manage training enquiry details" ON "training_enquiry_details" AS PERMISSIVE FOR ALL TO "authenticated" USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));--> statement-breakpoint
CREATE POLICY "anyone can read tags of visible posts" ON "post_tags" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (exists (select 1 from public.posts where posts.id = "post_tags"."post_id"));--> statement-breakpoint
CREATE POLICY "admins can manage post tags" ON "post_tags" AS PERMISSIVE FOR ALL TO "authenticated" USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));--> statement-breakpoint
CREATE POLICY "anyone can read visible posts" ON "posts" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (status in ('published', 'scheduled') and published_at is not null and published_at <= now());--> statement-breakpoint
CREATE POLICY "admins can manage posts" ON "posts" AS PERMISSIVE FOR ALL TO "authenticated" USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));--> statement-breakpoint
CREATE POLICY "anyone can read tags" ON "tags" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "admins can manage tags" ON "tags" AS PERMISSIVE FOR ALL TO "authenticated" USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));--> statement-breakpoint
CREATE POLICY "anyone can read gallery categories" ON "gallery_categories" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "admins can manage gallery categories" ON "gallery_categories" AS PERMISSIVE FOR ALL TO "authenticated" USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));--> statement-breakpoint
CREATE POLICY "anyone can read gallery images" ON "gallery_images" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "admins can manage gallery images" ON "gallery_images" AS PERMISSIVE FOR ALL TO "authenticated" USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));--> statement-breakpoint
CREATE POLICY "admins can manage admin settings" ON "admin_settings" AS PERMISSIVE FOR ALL TO "authenticated" USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));--> statement-breakpoint
CREATE POLICY "anyone can read site settings" ON "site_settings" AS PERMISSIVE FOR SELECT TO "anon", "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "admins can manage site settings" ON "site_settings" AS PERMISSIVE FOR ALL TO "authenticated" USING ((select public.is_admin())) WITH CHECK ((select public.is_admin()));