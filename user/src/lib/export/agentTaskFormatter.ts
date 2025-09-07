interface Task {
  id: string;
  title: string;
  description: string;
  estimated_effort_hours: number;
  dependencies: string[];
  suggested_tech: string;
  ai_agent_prompt_hint: string;
  no_code_platform_hint: string;
}

interface Phase {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
}

interface PlanContent {
  plan_name: string;
  phases: Phase[];
}

export function formatAgentTasks(planContent: PlanContent): string {
  let markdown = `# Build Plan: ${planContent.plan_name}

`;

  planContent.phases.forEach((phase) => {
    markdown += `## Phase: ${phase.title}

`;
    markdown += `${phase.description}

`;

    phase.tasks.forEach((task) => {
      markdown += `### Task: ${task.title}
`;
      markdown += `- **Description**: ${task.description}
`;
      markdown += `- **Estimated Effort**: ${task.estimated_effort_hours} hours
`;
      if (task.dependencies && task.dependencies.length > 0) {
        markdown += `- **Dependencies**: ${task.dependencies.join(', ')}
`;
      }
      if (task.suggested_tech) {
        markdown += `- **Suggested Technology**: ${task.suggested_tech}
`;
      }
      if (task.ai_agent_prompt_hint) {
        markdown += `- **AI Agent Prompt Hint**: ${task.ai_agent_prompt_hint}
`;
      }
      markdown += `
`;
    });
  });

  return markdown;
}
