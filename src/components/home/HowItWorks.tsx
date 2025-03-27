
import React from 'react';
import { Camera, PenTool, Calculator, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: <Camera className="w-6 h-6" />,
    title: "Capture or Draw",
    description: "Scan equations with your camera or draw them directly on your device screen.",
    color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
  },
  {
    icon: <ArrowRight className="w-6 h-6" />,
    title: "AI Processing",
    description: "Our advanced AI analyzes the equation, recognizing symbols and mathematical expressions.",
    color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400"
  },
  {
    icon: <Calculator className="w-6 h-6" />,
    title: "Get Solutions",
    description: "Receive instant, step-by-step solutions that help you understand the problem-solving process.",
    color: "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            SolveAir makes math problem-solving simple with an intuitive three-step process.
          </p>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
          {/* Connection line */}
          <div className="hidden md:block absolute top-1/2 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2 z-0"></div>
          
          {steps.map((step, index) => (
            <div key={index} className="w-full md:w-1/3 relative z-10 glass-card rounded-xl p-6 text-center transition-all duration-300 hover:shadow-lg">
              <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${step.color}`}>
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
