
import React from 'react';
import { Camera, PenTool, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative px-6 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-50 to-transparent opacity-70 dark:from-blue-950 dark:to-transparent dark:opacity-20" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-block mb-4 px-3 py-1 bg-blue-50 rounded-full text-blue-600 text-sm font-medium animate-fade-in">
            Intelligent Math Solutions
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6 animate-slide-up">
            Solve Math Problems <br className="hidden sm:block" />
            with <span className="text-primary">Camera</span> or <span className="text-primary">Air Drawing</span>
          </h1>
          
          <p className="text-lg text-gray-600 mb-8 animate-slide-up" style={{ animationDelay: '100ms' }}>
            AIRMATH makes math easy by letting you scan equations with your camera 
            or draw them in the air. Get instant solutions with step-by-step explanations.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link to="/scan">
              <Button size="lg" className="w-full sm:w-auto glass-button hover:shadow-md transition-all space-x-2">
                <Camera className="h-4 w-4" />
                <span>Scan Equation</span>
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </Link>
            <Link to="/draw">
              <Button size="lg" variant="outline" className="w-full sm:w-auto space-x-2">
                <PenTool className="h-4 w-4" />
                <span>Draw Equation</span>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Hero image/mockup */}
        <div className="mt-16 md:mt-20 max-w-4xl mx-auto animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="glass-card rounded-2xl shadow-xl overflow-hidden p-4 sm:p-6">
            <div className="w-full bg-gray-50 dark:bg-gray-800 rounded-xl p-4 sm:p-6 relative overflow-hidden">
              <div className="flex flex-col space-y-4">
                <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm">
                  <p className="text-gray-900 dark:text-gray-200 font-mono">2x² + 5x - 3 = 0</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">Solution:</p>
                  <div className="space-y-2 font-mono text-sm">
                    <p>Using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a</p>
                    <p>a = 2, b = 5, c = -3</p>
                    <p>x = (-5 ± √(25 - 4(2)(-3))) / 2(2)</p>
                    <p>x = (-5 ± √(25 + 24)) / 4</p>
                    <p>x = (-5 ± √49) / 4</p>
                    <p>x = (-5 ± 7) / 4</p>
                    <p>x₁ = (-5 + 7) / 4 = 2 / 4 = 0.5</p>
                    <p>x₂ = (-5 - 7) / 4 = -12 / 4 = -3</p>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-conic from-blue-100 to-transparent opacity-50 rounded-full -translate-y-1/2 translate-x-1/3"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-conic from-primary to-transparent opacity-20 rounded-full translate-y-1/2 -translate-x-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
