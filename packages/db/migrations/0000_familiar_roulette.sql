CREATE TYPE "public"."cadence" AS ENUM('weekly', 'biweekly', 'monthly', 'quarterly');--> statement-breakpoint
CREATE TYPE "public"."delivery_status" AS ENUM('scheduled', 'on_track', 'at_risk', 'upload_failed', 'blocked', 'missing', 'delivered');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('delivery_engineer', 'delivery_manager', 'csm', 'integration');--> statement-breakpoint
CREATE TYPE "public"."scrape_type" AS ENUM('full_site', 'targeted', 'category', 'search_pages');--> statement-breakpoint
CREATE TYPE "public"."client_segment" AS ENUM('brand', 'retail');--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" uuid,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" text,
	"details" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "baseline_changes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain_id" uuid NOT NULL,
	"store_id" integer,
	"previous_value" integer,
	"new_value" integer NOT NULL,
	"reason" text NOT NULL,
	"ticket_key" text NOT NULL,
	"changed_by" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"segment" "client_segment" NOT NULL,
	"csm_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deliveries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain_id" uuid NOT NULL,
	"run_id" text,
	"iso_week" integer NOT NULL,
	"iso_year" integer NOT NULL,
	"due_at" timestamp with time zone NOT NULL,
	"status" "delivery_status" DEFAULT 'scheduled' NOT NULL,
	"delivered_at" timestamp with time zone,
	"destination" text,
	"file_name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domain_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain_id" uuid NOT NULL,
	"delivery_engineer_id" uuid,
	"assigned_by" uuid NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domain_blocks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"domain_id" uuid NOT NULL,
	"scope" text NOT NULL,
	"cause" text NOT NULL,
	"workaround" text,
	"expected_recovery" text,
	"client_impact" text,
	"ticket_key" text,
	"blocked_since" timestamp with time zone NOT NULL,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "domains" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"banner_id" integer,
	"base_url" text NOT NULL,
	"scrape_type" "scrape_type" NOT NULL,
	"cadence" "cadence" DEFAULT 'weekly' NOT NULL,
	"run_window" text NOT NULL,
	"config_ident" text,
	"delivery_engineer_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"role" "role" NOT NULL,
	"manager_id" uuid,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "audit_log" ADD CONSTRAINT "audit_log_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "baseline_changes" ADD CONSTRAINT "baseline_changes_domain_id_domains_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."domains"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "baseline_changes" ADD CONSTRAINT "baseline_changes_changed_by_users_id_fk" FOREIGN KEY ("changed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_csm_user_id_users_id_fk" FOREIGN KEY ("csm_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deliveries" ADD CONSTRAINT "deliveries_domain_id_domains_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."domains"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domain_assignments" ADD CONSTRAINT "domain_assignments_domain_id_domains_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."domains"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domain_assignments" ADD CONSTRAINT "domain_assignments_delivery_engineer_id_users_id_fk" FOREIGN KEY ("delivery_engineer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domain_assignments" ADD CONSTRAINT "domain_assignments_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domain_blocks" ADD CONSTRAINT "domain_blocks_domain_id_domains_id_fk" FOREIGN KEY ("domain_id") REFERENCES "public"."domains"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domains" ADD CONSTRAINT "domains_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "domains" ADD CONSTRAINT "domains_delivery_engineer_id_users_id_fk" FOREIGN KEY ("delivery_engineer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "baseline_changes_domain_idx" ON "baseline_changes" USING btree ("domain_id");--> statement-breakpoint
CREATE INDEX "deliveries_due_idx" ON "deliveries" USING btree ("due_at");--> statement-breakpoint
CREATE INDEX "domains_client_idx" ON "domains" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "domains_engineer_idx" ON "domains" USING btree ("delivery_engineer_id");