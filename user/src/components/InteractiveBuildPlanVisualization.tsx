import { useState } from 'react';

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

interface BuildPlanContent {
  plan_name: string;
  phases: Phase[];
}

interface InteractiveBuildPlanVisualizationProps {
  buildPlanContent: BuildPlanContent;
  onTaskClick: (task: Task) => void;
}

export default function InteractiveBuildPlanVisualization({
  buildPlanContent,
  onTaskClick,
}: InteractiveBuildPlanVisualizationProps) {
  const [expandedPhases, setExpandedPhases] = useState<string[]>([]);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases((prev) =>
      prev.includes(phaseId) ? prev.filter((id) => id !== phaseId) : [...prev, phaseId]
    );
  };

  return (
    <div className="bg-white shadow-sm p-6 rounded-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Build Plan Overview</h2>
      {buildPlanContent.phases.map((phase) => (
        <div key={phase.id} className="mb-6 border-b pb-4 last:border-b-0 last:pb-0">
          <div
            className="flex justify-between items-center cursor-pointer mb-2"
            onClick={() => togglePhase(phase.id)}
          >
            <h3 className="text-xl font-semibold text-gray-800">{phase.title}</h3>
            <span className="text-gray-500">
              {expandedPhases.includes(phase.id) ? '▼' : '►'}
            </span>
          </div>
          <p className="text-gray-600 mb-4">{phase.description}</p>

          {expandedPhases.includes(phase.id) && (
            <div className="ml-4 border-l pl-4">
              {phase.tasks.map((task) => (
                <div
                  key={task.id}
                  className="mb-4 p-4 bg-gray-50 rounded-md shadow-sm cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onTaskClick(task)}
                >
                  <h4 className="text-lg font-medium text-gray-900">{task.title}</h4>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-2">
                    <span>Effort: {task.estimated_effort_hours}h</span>
                    {task.suggested_tech && <span>Tech: {task.suggested_tech}</span>}
                    {task.dependencies.length > 0 && (
                      <span>Depends on: {task.dependencies.join(', ')}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
