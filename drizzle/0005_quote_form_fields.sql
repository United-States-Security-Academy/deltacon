ALTER TABLE "service_request_details" ALTER COLUMN "service_slug" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "service_request_details" ALTER COLUMN "industry_slug" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "service_request_details" ALTER COLUMN "estimated_scope" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "service_request_details" ADD COLUMN "primary_service_type" text;--> statement-breakpoint
ALTER TABLE "service_request_details" ADD COLUMN "officer_classification" text;--> statement-breakpoint
ALTER TABLE "service_request_details" ADD COLUMN "additional_services" text[];--> statement-breakpoint
ALTER TABLE "service_request_details" ADD COLUMN "officers_required" integer;--> statement-breakpoint
ALTER TABLE "service_request_details" ADD COLUMN "coverage_type" text;--> statement-breakpoint
ALTER TABLE "service_request_details" ADD COLUMN "coverage_hours" text;--> statement-breakpoint
ALTER TABLE "service_request_details" ADD COLUMN "contract_duration" text;