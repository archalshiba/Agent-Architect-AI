import HeaderAuthenticated from '@/components/HeaderAuthenticated';
import ProfileSettingsForm from '@/components/profile-settings-form';

export default function SettingsPage() {
  return (
    <>
      <HeaderAuthenticated />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Account Settings</h1>
        <ProfileSettingsForm />
      </main>
    </>
  );
}