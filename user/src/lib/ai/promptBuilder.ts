import { AppIdea } from '../../types';

export async function buildPlanGenerationPrompt(appIdea: AppIdea): Promise<string> {
  const prompt = `You are an expert software architect and project manager. Your task is to generate a detailed, multi-phase build plan for a software application based on the provided app idea. The plan should be structured in JSON format, adhering strictly to the schema provided below.

App Idea Details:
Title: ${appIdea.title}
Purpose: ${appIdea.purpose || 'N/A'}
Target Audience: ${appIdea.target_audience || 'N/A'}
Core Features: ${appIdea.core_features_desc || 'N/A'}
Desired Tech Stack: ${appIdea.desired_tech_stack_desc || 'N/A'}
Existing Resources: ${appIdea.existing_resources_desc || 'N/A'}

JSON Output Schema:
```json

{
  "plan_name": "string", // A concise name for the generated plan
  "phases": [
    {
      "id": "string", // Unique ID for the phase (e.g., "phase-001")
      "title": "string", // Title of the phase (e.g., "Project Setup")
      "description": "string", // Brief description of the phase
      "tasks": [
        {
          "id": "string", // Unique ID for the task (e.g., "task-001-001")
          "title": "string", // Title of the task
          "description": "string", // Detailed description of the task
          "estimated_effort_hours": "number", // Estimated effort in hours
          "dependencies": "string[]", // Array of task IDs this task depends on
          "suggested_tech": "string", // Suggested technology or framework for this task
          "ai_agent_prompt_hint": "string", // Hint for an AI coding agent (e.g., "Implement user authentication using NextAuth.js")
          "no_code_platform_hint": "string" // Hint for no-code platform (e.g., "Use Webflow's CMS for blog posts")
        }
      ]
    }
  ]
}
```

Instructions:
- Generate a comprehensive plan with logical phases and detailed tasks.
- Ensure all core features mentioned in the app idea are covered.
- Provide realistic estimated effort in hours for each task.
- Clearly define dependencies between tasks.
- Suggest appropriate technologies for each task, considering the desired tech stack.
- Include specific hints for AI coding agents and no-code platforms where applicable.
- The entire output must be a valid JSON object, and nothing else. Do not include any conversational text or markdown outside the JSON.

Begin the JSON output:
```json
{
  "plan_name": "${appIdea.title} Build Plan",
  "phases": [
    {
      "id": "phase-001",
      "title": "Discovery and Planning",
      "description": "Initial phase for understanding requirements and outlining the project structure.",
      "tasks": [
        {
          "id": "task-001-001",
          "title": "Define detailed user stories",
          "description": "Collaborate with stakeholders to define comprehensive user stories for all core features.",
          "estimated_effort_hours": 16,
          "dependencies": [],
          "suggested_tech": "Jira, Trello",
          "ai_agent_prompt_hint": "N/A",
          "no_code_platform_hint": "N/A"
        },
        {
          "id": "task-001-002",
          "title": "Design database schema",
          "description": "Based on user stories, design the database schema for all entities (users, app ideas, build plans, etc.).",
          "estimated_effort_hours": 24,
          "dependencies": ["task-001-001"],
          "suggested_tech": "Supabase, PostgreSQL",
          "ai_agent_prompt_hint": "Generate SQL migration for user and app idea tables.",
          "no_code_platform_hint": "N/A"
        }
      ]
    },
    {
      "id": "phase-002",
      "title": "Backend Development",
      "description": "Developing the server-side logic and API endpoints.",
      "tasks": [
        {
          "id": "task-002-001",
          "title": "Implement user authentication API",
          "description": "Develop API endpoints for user registration, login, and session management using Supabase Auth.",
          "estimated_effort_hours": 40,
          "dependencies": ["task-001-002"],
          "suggested_tech": "Next.js API Routes, Supabase Auth",
          "ai_agent_prompt_hint": "Create Next.js API routes for /api/auth/signup, /api/auth/login, /api/auth/logout.",
          "no_code_platform_hint": "N/A"
        },
        {
          "id": "task-002-002",
          "title": "Develop App Idea management API",
          "description": "Create API endpoints for creating, retrieving, updating, and deleting app ideas.",
          "estimated_effort_hours": 30,
          "dependencies": ["task-002-001"],
          "suggested_tech": "Next.js API Routes, Supabase",
          "ai_agent_prompt_hint": "Implement CRUD operations for app ideas in /api/ideas.",
          "no_code_platform_hint": "N/A"
        }
      ]
    },
    {
      "id": "phase-003",
      "title": "Frontend Development",
      "description": "Building the user interface and connecting it to the backend APIs.",
      "tasks": [
        {
          "id": "task-003-001",
          "title": "Setup core Next.js project and Tailwind CSS",
          "description": "Initialize Next.js project, configure Tailwind CSS, and create basic layout and homepage.",
          "estimated_effort_hours": 20,
          "dependencies": [],
          "suggested_tech": "Next.js, React, Tailwind CSS",
          "ai_agent_prompt_hint": "Scaffold Next.js project with Tailwind CSS configuration.",
          "no_code_platform_hint": "N/A"
        },
        {
          "id": "task-003-002",
          "title": "Develop authentication pages (Login/Signup)",
          "description": "Create UI for user login and registration, integrating with authentication API.",
          "estimated_effort_hours": 25,
          "dependencies": ["task-002-001", "task-003-001"],
          "suggested_tech": "Next.js, React, Supabase Auth Helpers",
          "ai_agent_prompt_hint": "Build login and signup forms and integrate with Supabase auth.",
          "no_code_platform_hint": "N/A"
        },
        {
          "id": "task-003-003",
          "title": "Build App Idea submission form",
          "description": "Create a multi-step form for users to input their app idea details.",
          "estimated_effort_hours": 35,
          "dependencies": ["task-002-002", "task-003-001"],
          "suggested_tech": "Next.js, React, React Hook Form",
          "ai_agent_prompt_hint": "Develop a multi-step form for app idea input.",
          "no_code_platform_hint": "N/A"
        }
      ]
    },
    {
      "id": "phase-004",
      "title": "AI Integration and Plan Generation",
      "description": "Integrating OpenAI for generating build plans.",
      "tasks": [
        {
          "id": "task-004-001",
          "title": "Implement AI prompt builder",
          "description": "Create a function to dynamically construct prompts for OpenAI based on app idea details.",
          "estimated_effort_hours": 15,
          "dependencies": ["task-001-001"],
          "suggested_tech": "TypeScript",
          "ai_agent_prompt_hint": "Develop prompt generation logic for OpenAI.",
          "no_code_platform_hint": "N/A"
        },
        {
          "id": "task-004-002",
          "title": "Develop AI plan generation service",
          "description": "Create a service to call OpenAI API, parse response, and return structured build plan.",
          "estimated_effort_hours": 20,
          "dependencies": ["task-004-001"],
          "suggested_tech": "OpenAI API, TypeScript",
          "ai_agent_prompt_hint": "Implement OpenAI API call and response parsing.",
          "no_code_platform_hint": "N/A"
        },
        {
          "id": "task-004-003",
          "title": "Create API endpoint for plan generation",
          "description": "Implement a Next.js API route to trigger AI plan generation and save to database.",
          "estimated_effort_hours": 25,
          "dependencies": ["task-002-002", "task-004-002"],
          "suggested_tech": "Next.js API Routes, Supabase",
          "ai_agent_prompt_hint": "Build /api/ai/generate-plan endpoint.",
          "no_code_platform_hint": "N/A"
        }
      ]
    }
  ]
}
```