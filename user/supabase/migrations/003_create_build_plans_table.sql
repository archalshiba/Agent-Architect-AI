CREATE TABLE build_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_idea_id uuid NOT NULL REFERENCES app_ideas(id) ON DELETE CASCADE,
  plan_name text NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  current_revision_id uuid REFERENCES plan_revisions(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (app_idea_id, plan_name)
);