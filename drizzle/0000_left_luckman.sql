CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."contact_status" AS ENUM('pending', 'resolved');--> statement-breakpoint
CREATE TYPE "public"."interest_type" AS ENUM('interest', 'register');--> statement-breakpoint
CREATE TABLE "activity_interests" (
	"id" text PRIMARY KEY NOT NULL,
	"activity_slug" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"type" "interest_type" NOT NULL,
	"locale" text NOT NULL,
	"message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" text PRIMARY KEY NOT NULL,
	"idempotency_key" text NOT NULL,
	"check_in" text NOT NULL,
	"check_out" text NOT NULL,
	"adults" integer NOT NULL,
	"children" integer DEFAULT 0 NOT NULL,
	"rooms" integer DEFAULT 1 NOT NULL,
	"has_pet" boolean DEFAULT false NOT NULL,
	"pet_count" integer,
	"room_preference" text NOT NULL,
	"accept_alternative" boolean DEFAULT true NOT NULL,
	"pet_info" jsonb,
	"contact" jsonb NOT NULL,
	"agreements" jsonb NOT NULL,
	"source" jsonb NOT NULL,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_idempotency_key_unique" UNIQUE("idempotency_key")
);
--> statement-breakpoint
CREATE TABLE "contacts" (
	"id" text PRIMARY KEY NOT NULL,
	"subject" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"message" text NOT NULL,
	"locale" text NOT NULL,
	"routed_to" text NOT NULL,
	"status" "contact_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscribers" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"interests" text[] DEFAULT '{}' NOT NULL,
	"locale" text NOT NULL,
	"subscribed_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscribers_email_unique" UNIQUE("email")
);
