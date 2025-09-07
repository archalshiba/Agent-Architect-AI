import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <p>&copy; {new Date().getFullYear()} Agent Architect AI. All rights reserved.</p>
        </div>
        <div className="flex space-x-6">
          <Link href="/privacy" className="hover:text-gray-300">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-gray-300">
            Terms of Service
          </Link>
          {/* Placeholder for social media icons */}
          <Link href="#" className="hover:text-gray-300">
            Facebook
          </Link>
          <Link href="#" className="hover:text-gray-300">
            Twitter
          </Link>
        </div>
      </div>
    </footer>
  );
}
