export default function FeatureShowcase() {
  const features = [
    {
      title: 'Intuitive Idea Input',
      description: 'Easily articulate your app concepts with a guided, multi-step input process.',
      icon: '💡',
    },
    {
      title: 'AI-Powered Generation',
      description: 'Automatically transform your ideas into structured, actionable build plans using advanced AI.',
      icon: '🤖',
    },
    {
      title: 'Interactive Visualization',
      description: 'Visualize your project roadmap with interactive timelines and task breakdowns.',
      icon: '📊',
    },
    {
      title: 'Agent Export',
      description: 'Export tasks directly to AI coding agents or generate blueprints for no-code platforms.',
      icon: '🚀',
    },
  ];

  return (
    <section className="py-20 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">
          Features Designed for Your Success
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md flex flex-col items-center text-center"
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}