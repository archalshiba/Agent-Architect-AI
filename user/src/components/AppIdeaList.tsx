'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AppIdea } from '@/types';

export default function AppIdeaList() {
  const [appIdeas, setAppIdeas] = useState<AppIdea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppIdeas = async () => {
      try {
        const response = await fetch('/api/ideas');
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data: AppIdea[] = await response.json();
        setAppIdeas(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppIdeas();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading app ideas...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  if (appIdeas.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-lg text-gray-600 mb-4">No app ideas yet? Start a new one!</p>
        <Link
          href="/new-idea"
          className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-lg"
        >
          Create New Idea
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-8">
      {appIdeas.map((idea) => (
        <Link key={idea.id} href={`/plan/${idea.id}`}>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{idea.title}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Status: <span className="font-medium text-blue-700">Draft</span> {/* Placeholder status */}
            </p>
            <p className="text-xs text-gray-500">
              Last Updated: {new Date(idea.updated_at).toLocaleDateString()}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
