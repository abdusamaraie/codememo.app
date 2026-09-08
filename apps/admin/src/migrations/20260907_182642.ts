import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_languages_slug" AS ENUM('python', 'javascript', 'typescript', 'rust', 'go', 'sql', 'sql2', 'jcr-sql2', 'bash', 'java', 'cpp');
  CREATE TYPE "public"."enum_sections_difficulty" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum_flashcards_question_type" AS ENUM('free_recall', 'multiple_choice', 'code_completion', 'fill_blank', 'spot_error', 'explain_output');
  CREATE TYPE "public"."enum_flashcards_difficulty" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum_exercises_type" AS ENUM('fill_blank', 'multiple_choice', 'arrange_code', 'spot_error');
  CREATE TYPE "public"."enum_exercises_difficulty" AS ENUM('beginner', 'intermediate', 'advanced');
  CREATE TYPE "public"."enum_site_settings_app_data_source" AS ENUM('real', 'mock');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "languages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" "enum_languages_slug" NOT NULL,
  	"description" varchar,
  	"color" varchar NOT NULL,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"is_published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"language_id" integer NOT NULL,
  	"description" varchar,
  	"order" numeric DEFAULT 0 NOT NULL,
  	"difficulty" "enum_sections_difficulty" NOT NULL,
  	"is_published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "flashcards_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "flashcards" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_id" integer NOT NULL,
  	"question_type" "enum_flashcards_question_type" NOT NULL,
  	"front_prompt" varchar NOT NULL,
  	"front_code" varchar,
  	"front_language" varchar,
  	"back_prompt" varchar NOT NULL,
  	"back_code" varchar,
  	"back_language" varchar,
  	"difficulty" "enum_flashcards_difficulty" NOT NULL,
  	"order" numeric DEFAULT 0,
  	"is_published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "exercises_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "exercises" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"section_id" integer NOT NULL,
  	"type" "enum_exercises_type" NOT NULL,
  	"question" varchar NOT NULL,
  	"code" varchar,
  	"language" varchar,
  	"correct_answer" varchar NOT NULL,
  	"explanation" varchar NOT NULL,
  	"difficulty" "enum_exercises_difficulty" NOT NULL,
  	"order" numeric DEFAULT 0,
  	"is_published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "cheat_sheet_entries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"language_id" integer NOT NULL,
  	"category" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"syntax" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"example" varchar,
  	"order" numeric DEFAULT 0,
  	"is_published" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"languages_id" integer,
  	"sections_id" integer,
  	"flashcards_id" integer,
  	"exercises_id" integer,
  	"cheat_sheet_entries_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"allow_theme_switch" boolean DEFAULT false,
  	"maintenance_mode" boolean DEFAULT false,
  	"app_data_source" "enum_site_settings_app_data_source" DEFAULT 'real' NOT NULL,
  	"announcement_banner_enabled" boolean DEFAULT false,
  	"announcement_banner_message" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sections" ADD CONSTRAINT "sections_language_id_languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "flashcards_tags" ADD CONSTRAINT "flashcards_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."flashcards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "flashcards" ADD CONSTRAINT "flashcards_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "exercises_options" ADD CONSTRAINT "exercises_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "exercises" ADD CONSTRAINT "exercises_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cheat_sheet_entries" ADD CONSTRAINT "cheat_sheet_entries_language_id_languages_id_fk" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_languages_fk" FOREIGN KEY ("languages_id") REFERENCES "public"."languages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sections_fk" FOREIGN KEY ("sections_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_flashcards_fk" FOREIGN KEY ("flashcards_id") REFERENCES "public"."flashcards"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_exercises_fk" FOREIGN KEY ("exercises_id") REFERENCES "public"."exercises"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_cheat_sheet_entries_fk" FOREIGN KEY ("cheat_sheet_entries_id") REFERENCES "public"."cheat_sheet_entries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "languages_updated_at_idx" ON "languages" USING btree ("updated_at");
  CREATE INDEX "languages_created_at_idx" ON "languages" USING btree ("created_at");
  CREATE UNIQUE INDEX "sections_slug_idx" ON "sections" USING btree ("slug");
  CREATE INDEX "sections_language_idx" ON "sections" USING btree ("language_id");
  CREATE INDEX "sections_updated_at_idx" ON "sections" USING btree ("updated_at");
  CREATE INDEX "sections_created_at_idx" ON "sections" USING btree ("created_at");
  CREATE INDEX "flashcards_tags_order_idx" ON "flashcards_tags" USING btree ("_order");
  CREATE INDEX "flashcards_tags_parent_id_idx" ON "flashcards_tags" USING btree ("_parent_id");
  CREATE INDEX "flashcards_section_idx" ON "flashcards" USING btree ("section_id");
  CREATE INDEX "flashcards_updated_at_idx" ON "flashcards" USING btree ("updated_at");
  CREATE INDEX "flashcards_created_at_idx" ON "flashcards" USING btree ("created_at");
  CREATE INDEX "exercises_options_order_idx" ON "exercises_options" USING btree ("_order");
  CREATE INDEX "exercises_options_parent_id_idx" ON "exercises_options" USING btree ("_parent_id");
  CREATE INDEX "exercises_section_idx" ON "exercises" USING btree ("section_id");
  CREATE INDEX "exercises_updated_at_idx" ON "exercises" USING btree ("updated_at");
  CREATE INDEX "exercises_created_at_idx" ON "exercises" USING btree ("created_at");
  CREATE INDEX "cheat_sheet_entries_language_idx" ON "cheat_sheet_entries" USING btree ("language_id");
  CREATE INDEX "cheat_sheet_entries_updated_at_idx" ON "cheat_sheet_entries" USING btree ("updated_at");
  CREATE INDEX "cheat_sheet_entries_created_at_idx" ON "cheat_sheet_entries" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_languages_id_idx" ON "payload_locked_documents_rels" USING btree ("languages_id");
  CREATE INDEX "payload_locked_documents_rels_sections_id_idx" ON "payload_locked_documents_rels" USING btree ("sections_id");
  CREATE INDEX "payload_locked_documents_rels_flashcards_id_idx" ON "payload_locked_documents_rels" USING btree ("flashcards_id");
  CREATE INDEX "payload_locked_documents_rels_exercises_id_idx" ON "payload_locked_documents_rels" USING btree ("exercises_id");
  CREATE INDEX "payload_locked_documents_rels_cheat_sheet_entries_id_idx" ON "payload_locked_documents_rels" USING btree ("cheat_sheet_entries_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "languages" CASCADE;
  DROP TABLE "sections" CASCADE;
  DROP TABLE "flashcards_tags" CASCADE;
  DROP TABLE "flashcards" CASCADE;
  DROP TABLE "exercises_options" CASCADE;
  DROP TABLE "exercises" CASCADE;
  DROP TABLE "cheat_sheet_entries" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_languages_slug";
  DROP TYPE "public"."enum_sections_difficulty";
  DROP TYPE "public"."enum_flashcards_question_type";
  DROP TYPE "public"."enum_flashcards_difficulty";
  DROP TYPE "public"."enum_exercises_type";
  DROP TYPE "public"."enum_exercises_difficulty";
  DROP TYPE "public"."enum_site_settings_app_data_source";`)
}
