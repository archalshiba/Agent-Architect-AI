interface User {
  id: string;
  email: string;
  password_hash: string;
  created_at: string;
  updated_at: string;
}

interface AppIdea {
  id: string;
  user_id: string;
  title: string;
  purpose?: string;
  target_audience?: string;
  core_features_desc?: string;
  desired_tech_stack_desc?: string;
  existing_resources_desc?: string;
  created_at: string;
  updated_at: string;
}

interface BuildPlan {
  id: string;
  app_idea_id: string;
  plan_name: string;
  status: string;
  current_revision_id?: string;
  created_at: string;
  updated_at: string;
}

interface PlanRevision {
  id: string;
  build_plan_id: string;
  revision_number: number;
  plan_content: any; // jsonb type, so can be any
  generated_by_ai: boolean;
  editor_user_id?: string;
  created_at: string;
  updated_at: string;
}