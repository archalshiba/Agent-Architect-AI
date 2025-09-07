# Agent Architect AI - User Guide

This guide provides instructions on how to set up, run, and interact with the Agent Architect AI platform, both as a human user and as an AI coding agent.

## Table of Contents
1.  [Local Development Setup](#local-development-setup)
    *   [Prerequisites](#prerequisites)
    *   [Installation](#installation)
    *   [Environment Variables](#environment-variables)
    *   [Running the Application](#running-the-application)
2.  [Database Setup (Supabase)](#database-setup-supabase)
    *   [Supabase Project Creation](#supabase-project-creation)
    *   [Schema Migration](#schema-migration)
3.  [How to Use This Package with an AI Agent](#how-to-use-this-package-with-an-ai-agent)
4.  [Deployment](#deployment)

## Local Development Setup

### Prerequisites
Before you begin, ensure you have the following installed:
*   Node.js (v18 or higher)
*   npm or Yarn
*   Git
*   A Supabase account and project
*   An OpenAI API Key

### Installation
1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/agent-architect-ai.git
    cd agent-architect-ai/user
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or yarn install
    ```

### Environment Variables
Create a `.env.local` file in the `/user` directory based on the `.env.example` (or the content below) and fill in your details:

```env
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SUPABASE_SERVICE_ROLE_KEY
OPENAI_API_KEY=YOUR_OPENAI_API_KEY
JWT_SECRET=YOUR_RANDOM_SECRET_KEY
```

*   `NEXT_PUBLIC_SUPABASE_URL`: Found in your Supabase project settings -> API.
*   `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Found in your Supabase project settings -> API (Project API key `anon` public).
*   `SUPABASE_SERVICE_ROLE_KEY`: Found in your Supabase project settings -> API (Project API key `service_role` secret). **Keep this key secure!**
*   `OPENAI_API_KEY`: Your API key from OpenAI for AI plan generation.
*   `JWT_SECRET`: A strong, random string used for signing JWTs. You can generate one with `openssl rand -base64 32`.

### Running the Application
To start the development server:
```bash
npm run dev
# or yarn dev
```
The application will be accessible at `http://localhost:3000`.

## Database Setup (Supabase)

### Supabase Project Creation
1.  Go to [Supabase](https://supabase.com/) and create a new project.
2.  Note down your Project URL and `anon` key, and `service_role` key from the project settings -> API.

### Schema Migration
Run the following SQL commands in your Supabase SQL Editor to set up the necessary tables.

**1. `User` Table**
```sql
CREATE TABLE public.User (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text NOT NULL UNIQUE,
    password_hash text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.User ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile." ON public.User FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile." ON public.User FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Set up trigger for updated_at
CREATE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_User_updated_at BEFORE UPDATE ON public.User FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**2. `AppIdea` Table**
```sql
CREATE TABLE public.AppIdea (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.User(id) ON DELETE CASCADE,
    title text NOT NULL,
    purpose text,
    target_audience text,
    core_features_desc text,
    desired_tech_stack_desc text,
    existing_resources_desc text,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.AppIdea ENABLE ROW LEVEL SECURITY;

CREATE POLICY "App Ideas are visible to their creators." ON public.AppIdea FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create App Ideas." ON public.AppIdea FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own App Ideas." ON public.AppIdea FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own App Ideas." ON public.AppIdea FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_AppIdea_updated_at BEFORE UPDATE ON public.AppIdea FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**3. `BuildPlan` Table**
```sql
CREATE TABLE public.BuildPlan (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    app_idea_id uuid NOT NULL REFERENCES public.AppIdea(id) ON DELETE CASCADE,
    plan_name text NOT NULL,
    status text NOT NULL DEFAULT 'draft',
    current_revision_id uuid REFERENCES public.PlanRevision(id) ON DELETE SET NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (app_idea_id, plan_name)
);

ALTER TABLE public.BuildPlan ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Build Plans are visible to the App Idea creator." ON public.BuildPlan FOR SELECT USING ((EXISTS ( SELECT 1 FROM public.AppIdea WHERE (AppIdea.id = BuildPlan.app_idea_id) AND (AppIdea.user_id = auth.uid()))));
CREATE POLICY "Users can create Build Plans for their App Ideas." ON public.BuildPlan FOR INSERT WITH CHECK ((EXISTS ( SELECT 1 FROM public.AppIdea WHERE (AppIdea.id = BuildPlan.app_idea_id) AND (AppIdea.user_id = auth.uid()))));
CREATE POLICY "Users can update their Build Plans." ON public.BuildPlan FOR UPDATE USING ((EXISTS ( SELECT 1 FROM public.AppIdea WHERE (AppIdea.id = BuildPlan.app_idea_id) AND (AppIdea.user_id = auth.uid()))));
CREATE POLICY "Users can delete their Build Plans." ON public.BuildPlan FOR DELETE USING ((EXISTS ( SELECT 1 FROM public.AppIdea WHERE (AppIdea.id = BuildPlan.app_idea_id) AND (AppIdea.user_id = auth.uid()))));

CREATE TRIGGER update_BuildPlan_updated_at BEFORE UPDATE ON public.BuildPlan FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**4. `PlanRevision` Table**
```sql
CREATE TABLE public.PlanRevision (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    build_plan_id uuid NOT NULL REFERENCES public.BuildPlan(id) ON DELETE CASCADE,
    revision_number integer NOT NULL,
    plan_content jsonb NOT NULL,
    generated_by_ai boolean NOT NULL,
    editor_user_id uuid REFERENCES public.User(id) ON DELETE SET NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (build_plan_id, revision_number)
);

ALTER TABLE public.PlanRevision ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Plan Revisions are visible to the App Idea creator." ON public.PlanRevision FOR SELECT USING ((EXISTS ( SELECT 1 FROM public.AppIdea, public.BuildPlan WHERE (AppIdea.id = BuildPlan.app_idea_id) AND (BuildPlan.id = PlanRevision.build_plan_id) AND (AppIdea.user_id = auth.uid()))));
CREATE POLICY "Users can create Plan Revisions for their Build Plans." ON public.PlanRevision FOR INSERT WITH CHECK ((EXISTS ( SELECT 1 FROM public.AppIdea, public.BuildPlan WHERE (AppIdea.id = BuildPlan.app_idea_id) AND (BuildPlan.id = PlanRevision.build_plan_id) AND (AppIdea.user_id = auth.uid()))));
CREATE POLICY "Users can update their Plan Revisions." ON public.PlanRevision FOR UPDATE USING ((EXISTS ( SELECT 1 FROM public.AppIdea, public.BuildPlan WHERE (AppIdea.id = BuildPlan.app_idea_id) AND (BuildPlan.id = PlanRevision.build_plan_id) AND (AppIdea.user_id = auth.uid()))));
CREATE POLICY "Users can delete their Plan Revisions." ON public.PlanRevision FOR DELETE USING ((EXISTS ( SELECT 1 FROM public.AppIdea, public.BuildPlan WHERE (AppIdea.id = BuildPlan.app_idea_id) AND (BuildPlan.id = PlanRevision.build_plan_id) AND (AppIdea.user_id = auth.uid()))));

CREATE TRIGGER update_PlanRevision_updated_at BEFORE UPDATE ON public.PlanRevision FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

**5. `NewTable` Table (Generated from manifest - potentially to be removed/renamed)**
```sql
CREATE TABLE public.NewTable (
    id UUID PRIMARY KEY
);

ALTER TABLE public.NewTable ENABLE ROW LEVEL SECURITY;
-- Add appropriate RLS policies for NewTable if it's meant to be a permanent table.
```

## How to Use This Package with an AI Agent
This project is structured for iterative development by AI coding agents. Follow these steps:

1.  **Read the Master Plan**: The AI agent first reads `/machine/manifest.json` to understand the project's overall architecture, data models, UI flows, and the complete, sequential build plan.
2.  **Check Current State**: The agent then reads `/machine/state.json` to determine which build stages have already been completed. This file tracks the `completedStages` array.
3.  **Process Incomplete Stages**: For each stage not listed in `completedStages`, the agent opens the corresponding build plan file (e.g., `/machine/build_plan/000_project_setup.jsonl`).
4.  **Execute Tasks Sequentially**: The agent executes each task within the `.jsonl` file one by one. For each task, the content of the `prompt_template` field **MUST** be used as the complete and direct prompt for the AI model to generate the required code or documentation.
5.  **Update State**: After successfully completing all tasks within a stage, the AI agent **MUST** update `/machine/state.json` by adding the completed stage's `id` to the `completedStages` array. This change, along with all generated code, should then be committed.

This process ensures that agents build the project incrementally, maintain a clear record of progress, and consistently use the specified prompts for each task.

## Deployment

A GitHub Actions workflow (`.github/workflows/deploy.yml`) has been created to automatically deploy this application to Vercel on every push to the `main` branch. To enable this:

1.  Go to your GitHub repository settings.
2.  Navigate to 'Secrets and variables' -> 'Actions' -> 'Repository secrets'.
3.  Add the following secrets:
    *   `VERCEL_TOKEN`: Your Vercel API token. You can generate one from your Vercel Account Settings -> Tokens.
    *   `VERCEL_ORG_ID`: Your Vercel Organization ID. You can find this in your Vercel dashboard URL (e.g., `vercel.com/<YOUR_ORG_ID>/<YOUR_PROJECT_ID>`).
    *   `VERCEL_PROJECT_ID`: Your Vercel Project ID. Also found in your Vercel dashboard URL.

Once these secrets are configured, pushes to the `main` branch will automatically trigger a deployment to Vercel.







  You can now run the application.

  To get started:

   1. Set up your Supabase project:
       * Go to Supabase (https://supabase.com/) and create a new project.
       * In your Supabase project, navigate to "Settings" -> "API" to find your
         NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
       * For SUPABASE_SERVICE_ROLE_KEY and SUPABASE_JWT_SECRET, you'll find them under "Project
         Settings" -> "API Keys".
       * Update the placeholder values in /root/agent-architect-ai/user/.env.local with your
         actual Supabase credentials.

   2. Set up your OpenAI API Key:
       * Go to OpenAI (https://platform.openai.com/account/api-keys) and create a new API key.
       * Update the placeholder value for OPENAI_API_KEY in
         /root/agent-architect-ai/user/.env.local with your actual OpenAI API key.

   3. Run database migrations:
       * You will need to use the Supabase CLI to apply the migrations.
       * Install the Supabase CLI: npm install -g supabase
       * Log in to Supabase CLI: supabase login
       * Link your local project to your Supabase project: supabase link --project-ref 
         your-project-ref (replace your-project-ref with your Supabase project ID)
       * Apply the migrations: supabase db push

   4. Start the development server:
       * Navigate to the user directory: cd /root/agent-architect-ai/user
       * Install dependencies: npm install
       * Start the development server: npm run dev

  The application should then be accessible in your browser, usually at http://localhost:3000.



  
