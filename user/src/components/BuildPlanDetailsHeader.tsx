import Link from 'next/link';

interface BuildPlanDetailsHeaderProps {
  appIdeaTitle: string;
  planName: string;
  planStatus: string;
  buildPlanId: string;
}

export default function BuildPlanDetailsHeader({
  appIdeaTitle,
  planName,
  planStatus,
  buildPlanId,
}: BuildPlanDetailsHeaderProps) {
  const handleExportAgentTasks = async () => {
    try {
      const response = await fetch('/api/plans/export-agent-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildPlanId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `agent-tasks-${buildPlanId}.jsonl`; // Or .md if you change the backend
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export agent tasks:', error);
      alert('Failed to export agent tasks. Please try again.');
    }
  };

  const handleGenerateNoCodeBlueprint = async () => {
    try {
      const response = await fetch('/api/plans/export-no-code-blueprint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buildPlanId }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `no-code-blueprint-${buildPlanId}.json`; // Or .md if you change the backend
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate no-code blueprint:', error);
      alert('Failed to generate no-code blueprint. Please try again.');
    }
  };

  return (
    <div className="bg-white shadow-sm p-6 rounded-lg mb-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{appIdeaTitle}</h1>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xl text-gray-700">
          Plan: <span className="font-semibold">{planName}</span>
        </p>
        <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
          {planStatus}
        </span>
      </div>
      <div className="flex space-x-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
          Refine Plan
        </button>
        <button
          onClick={handleExportAgentTasks}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Export Tasks
        </button>
        <button
          onClick={handleGenerateNoCodeBlueprint}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
        >
          Generate No-Code Blueprints
        </button>
      </div>
    </div>
  );
}
