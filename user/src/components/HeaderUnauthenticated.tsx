import Link from 'next/link';

export default function HeaderUnauthenticated() {
  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/#" className="text-2xl font-bold text-gray-900">
          Agent Architect AI
        </Link>
      </div>
      <nav className="hidden md:flex space-x-8">
        <Link href="/#" className="text-gray-600 hover:text-gray-900">
          Home
        </Link>
        <Link href="/#features" className="text-gray-600 hover:text-gray-900">
          Features
        </Link>
        <Link href="/#pricing" className="text-gray-600 hover:text-gray-900">
          Pricing
        </Link>
      </nav>
      <div className="flex items-center space-x-4">
        <Link href="/auth/login" className="text-gray-600 hover:text-gray-900">
          Login
        </Link>
        <Link
          href="/auth/signup"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign Up
        </Link>
      </div>
    </header>
  );
}
