import HeaderAuthenticated from '@/components/HeaderAuthenticated';
import AppIdeaList from '@/components/AppIdeaList';

export default function DashboardPage() {
  return (
    <>
      <HeaderAuthenticated />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Dashboard</h1>
        <AppIdeaList />
      </main>
    </>
  );
}