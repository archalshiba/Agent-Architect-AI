import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-20 px-6 text-center">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
          Transform Your Ideas into Actionable AI Build Plans
        </h1>
        <p className="text-xl mb-8 opacity-90">
          Leverage the power of AI to structure, manage, and accelerate your software development projects.
        </p>
        <Link
          href="/auth/signup"
          className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow-lg hover:bg-gray-100 transition-colors text-lg"
        >
          Get Started - It's Free
        </Link>
        <div className="mt-12">
          {/* Placeholder for illustrative graphic/animation */}
          <div className="w-full h-64 bg-blue-400 rounded-lg flex items-center justify-center text-blue-900 text-xl font-bold">
            [Illustrative Graphic Placeholder]
          </div>
        </div>
      </div>
    </section>
  );
}