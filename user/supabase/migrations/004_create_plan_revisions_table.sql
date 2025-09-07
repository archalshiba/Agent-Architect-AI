CREATE TABLE plan_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  build_plan_id uuid NOT NULL REFERENCES build_plans(id) ON DELETE CASCADE,
  revision_number integer NOT NULL,
  plan_content jsonb NOT NULL,
  generated_by_ai boolean NOT NULL,
  editor_user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (build_plan_id, revision_number)
);