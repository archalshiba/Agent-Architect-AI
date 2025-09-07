'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import HeaderAuthenticated from '@/components/HeaderAuthenticated';
import BuildPlanDetailsHeader from '@/components/BuildPlanDetailsHeader';
import InteractiveBuildPlanVisualization from '@/components/InteractiveBuildPlanVisualization';
import TaskDetailsSidebar from '@/components/TaskDetailsSidebar';

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

interface BuildPlanData {
  id: string;
  app_idea_id: string;
  plan_name: string;
  status: string;
  current_revision_id: string;
  created_at: string;
  updated_at: string;
  current_revision: {
    plan_content: BuildPlanContent;
  };
}

export default function BuildPlanViewPage() {
  const { id } = useParams();
  const [buildPlan, setBuildPlan] = useState<BuildPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (id) {
      const fetchBuildPlan = async () => {
        try {
          const response = await fetch(`/api/plans/${id}`);
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
          const data: BuildPlanData = await response.json();
          setBuildPlan(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBuildPlan();
    }
  }, [id]);

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
  };

  const handleCloseSidebar = () => {
    setSelectedTask(null);
  };

  if (loading) {
    return <div className="text-center py-8">Loading build plan...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  if (!buildPlan) {
    return <div className="text-center py-8">Build plan not found.</div>;
  }

  const appIdeaTitle = 'Your App Idea'; // Placeholder, ideally fetched from app_idea_id

  return (
    <>
      <HeaderAuthenticated />
      <main className="container mx-auto px-4 py-8 flex">
        <div className="flex-grow">
          <BuildPlanDetailsHeader
            appIdeaTitle={appIdeaTitle}
            planName={buildPlan.plan_name}
            planStatus={buildPlan.status}
          />
          <InteractiveBuildPlanVisualization
            buildPlanContent={buildPlan.current_revision.plan_content}
            onTaskClick={handleTaskClick}
          />
        </div>
        <TaskDetailsSidebar selectedTask={selectedTask} onClose={handleCloseSidebar} />
      </main>
    </>
  );
}