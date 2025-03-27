
import React from 'react';
import { Camera, PenTool, Zap, History, PanelRight, CloudLightning } from 'lucide-react';

const features = [
  {
    icon: <Camera />,
    title: "Camera Scanning",
    description: "Instantly capture and solve any printed or handwritten math equation using your device camera."
  },
  {
    icon: <PenTool />,
    title: "Draw Equations",
    description: "Sketch your math problems directly on screen and get immediate solutions with clear explanations."
  },
  {
    icon: <Zap />,
    title: "Instant Solutions",
    description: "Advanced AI algorithms provide step-by-step solutions to even the most complex equations."
  },
  {
    icon: <PanelRight />,
    title: "Step-by-Step Breakdown",
    description: "Learn how problems are solved with detailed explanations for each step of the solution."
  },
  {
    icon: <History />,
    title: "Solution History",
    description: "Review your previously solved equations to track your progress and revisit solutions."
  },
  {
    icon: <CloudLightning />,
    title: "Offline Capability",
    description: "Solve basic equations even without an internet connection for uninterrupted problem-solving."
  }
];

const Features = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Powerful Features</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            SolveAir combines cutting-edge technology with an intuitive interface to make solving math problems effortless.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]"
            >
              <div className="feature-icon">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
