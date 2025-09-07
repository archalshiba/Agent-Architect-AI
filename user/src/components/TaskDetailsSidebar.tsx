import { Task } from './InteractiveBuildPlanVisualization';

interface TaskDetailsSidebarProps {
  selectedTask: Task | null;
  onClose: () => void;
}

export default function TaskDetailsSidebar({
  selectedTask,
  onClose,
}: TaskDetailsSidebarProps) {
  if (!selectedTask) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-lg p-6 overflow-y-auto z-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{selectedTask.title}</h3>
          <p className="text-gray-600">{selectedTask.description}</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Estimated Effort</p>
            <p className="text-gray-900">{selectedTask.estimated_effort_hours} hours</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Suggested Tech</p>
            <p className="text-gray-900">{selectedTask.suggested_tech || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Dependencies</p>
            <p className="text-gray-900">
              {selectedTask.dependencies.length > 0
                ? selectedTask.dependencies.join(', ')
                : 'None'}
            </p>
          </div>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">AI Agent Prompt Hint</p>
          <p className="text-gray-900">{selectedTask.ai_agent_prompt_hint || 'N/A'}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">No-Code Platform Hint</p>
          <p className="text-gray-900">{selectedTask.no_code_platform_hint || 'N/A'}</p>
        </div>
      </div>

      <div className="mt-8 flex justify-end space-x-3">
        <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          Edit
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Mark Complete
        </button>
      </div>
    </div>
  );
}
