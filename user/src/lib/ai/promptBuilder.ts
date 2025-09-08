import { AppIdea } from '@/types';
import { BuildPlan } from '@/types';
import { PlanRevision } from '@/types';
import { User } from '@/types';
import { Task } from '@/types';
import { Agent } from '@/types';
import { NoCodeBlueprint } from '@/types';

export function buildPrompt(
  appIdea: AppIdea,
  existingPlan?: BuildPlan,
  planRevision?: PlanRevision
): string {
  let prompt = `You are an AI assistant specialized in generating detailed, actionable build plans for software development projects. Your goal is to break down a high-level app idea into a comprehensive, step-by-step plan that a development team can follow.

When generating a plan, consider the following:
- **Clarity and Detail**: Each step should be clear, concise, and provide enough detail for a developer to understand what needs to be done.
- **Actionability**: Every item should be an actionable task.
- **Logical Flow**: Steps should follow a logical progression, with dependencies clearly implied or stated.
- **Modularity**: Break down complex features into smaller, manageable modules or components.
- **Technology Agnostic**: Unless specified, assume standard web development practices. Do not suggest specific libraries or frameworks unless explicitly requested or if it's a widely accepted best practice for a particular task (e.g., React for a SPA frontend).
- **Comprehensive**: Cover all aspects from backend to frontend, database, deployment, and testing.
- **Estimation (Optional but Recommended)**: Provide a rough estimate of effort (e.g., "Small", "Medium", "Large") for each major task.

Here's the app idea you need to generate a build plan for:

**App Idea Title**: ${appIdea.title}
**App Idea Purpose**: ${appIdea.purpose || 'N/A'}
**Core Features Description**: ${appIdea.core_features_desc || 'N/A'}
**Target Audience**: ${appIdea.target_audience || 'N/A'}
**Desired Tech Stack**: ${appIdea.desired_tech_stack_desc || 'N/A'}
**Existing Resources**: ${appIdea.existing_resources_desc || 'N/A'}

`;

  if (existingPlan) {
    prompt += `
You are revising an existing build plan. Here's the current plan:

**Existing Plan ID**: ${existingPlan.id}
**Existing Plan Title**: ${existingPlan.title}
**Existing Plan Description**: ${existingPlan.description}
**Existing Plan Status**: ${existingPlan.status}
**Existing Plan Created At**: ${existingPlan.createdAt}
**Existing Plan Updated At**: ${existingPlan.updatedAt}

**Existing Plan Tasks**:
`;
    existingPlan.tasks.forEach((task: { status: any; title: any; effort: any; description: any; dependencies: any[]; }, index: number) => {
      prompt += `  ${index + 1}. [${task.status}] ${task.title} (Effort: ${task.effort || 'N/A'})
      Description: ${task.description}
      Dependencies: ${task.dependencies.length > 0 ? task.dependencies.join(', ') : 'None'}
`;
    });
  }

  if (planRevision) {
    prompt += `
This revision is based on the following feedback/changes:

**Revision ID**: ${planRevision.id}
**Revision Created At**: ${planRevision.createdAt}
**Revision Notes**: ${planRevision.notes}

`;
  }

  prompt += `
Please generate or revise the build plan in a structured, markdown-friendly format. The plan should be organized into logical sections (e.g., "Backend Development", "Frontend Development", "Database", "Deployment", "Testing"). Each section should contain a list of actionable tasks.

Example format for a task:
- [Status] Task Title (Effort: [Small/Medium/Large])
  Description: Detailed description of the task.
  Dependencies: [Task 1, Task 2] (Optional)

Start with the first major section.
`;

  return prompt;
}

export function buildAgentExportPrompt(
  plan: BuildPlan,
  tasks: Task[]
): string {
  let prompt = `You are an AI assistant specialized in converting a software development build plan into a structured list of agent tasks. Each task should be clearly defined, actionable, and include all necessary information for an autonomous agent to execute it.

Here's the build plan you need to convert into agent tasks:

**Build Plan Title**: ${plan.title}
**Build Plan Description**: ${plan.description}
**Build Plan Status**: ${plan.status}

Here are the tasks from the build plan:
`;

  tasks.forEach((task, index) => {
    prompt += `  ${index + 1}. ${task.title} (Effort: ${task.effort || 'N/A'})
    Description: ${task.description}
    Dependencies: ${task.dependencies.length > 0 ? task.dependencies.join(', ') : 'None'}
`;
  });

  prompt += `
Please convert these build plan tasks into a list of agent tasks. Each agent task should be a self-contained unit of work. For each agent task, provide the following:

- **Task Name**: A concise name for the agent task.
- **Description**: A detailed description of what the agent needs to do, including any specific requirements or constraints.
- **Dependencies**: A list of other agent tasks that must be completed before this task can start.
- **Expected Output**: What the agent should produce upon successful completion of the task (e.g., "A new API endpoint for user registration", "A React component for the login form").
- **Verification Steps**: How to verify that the task has been successfully completed (e.g., "Run unit tests for the new endpoint", "Manually test the login form in the browser").

Format the output as a clear, readable list.
`;

  return prompt;
}

export function buildNoCodeBlueprintPrompt(
  plan: BuildPlan,
  tasks: Task[]
): string {
  let prompt = `You are an AI assistant specialized in generating no-code/low-code blueprints from a software development build plan. Your goal is to translate the technical tasks into configurations, workflows, and components that can be implemented using no-code or low-code platforms (e.g., Bubble, Webflow, Adalo, Zapier, Airtable, etc.).

Here's the build plan you need to convert into a no-code blueprint:

**Build Plan Title**: ${plan.title}
**Build Plan Description**: ${plan.description}
**Build Plan Status**: ${plan.status}

Here are the tasks from the build plan:
`;

  tasks.forEach((task, index) => {
    prompt += `  ${index + 1}. ${task.title} (Effort: ${task.effort || 'N/A'})
    Description: ${task.description}
    Dependencies: ${task.dependencies.length > 0 ? task.dependencies.join(', ') : 'None'}
`;
  });

  prompt += `
Please convert these build plan tasks into a no-code/low-code blueprint. For each major feature or task, describe how it would be implemented using no-code principles. Focus on:

- **Platform/Tool Suggestions**: Suggest appropriate no-code/low-code platforms or tools for each part (e.g., "For user authentication, consider using Auth0 or the built-in authentication of Bubble").
- **Data Model**: Describe the necessary data structures (tables, fields) for each feature.
- **Workflows/Logic**: Outline the step-by-step logic or workflows required.
- **UI/UX Components**: Describe the necessary UI elements and how they would interact.
- **Integrations**: Mention any necessary third-party integrations.

Organize the blueprint by feature or logical module.
`;

  return prompt;
}