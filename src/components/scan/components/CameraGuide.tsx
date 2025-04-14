
import React from 'react';
import { Scan, PenLine, KeyboardIcon, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CameraGuide: React.FC = () => {
  return (
    <>
      {/* Photomath-like camera guide frame */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-4/5 aspect-video border-2 border-primary/70 rounded-lg flex items-center justify-center">
          <div className="text-primary/70 text-xs backdrop-blur-sm bg-black/10 px-2 py-1 rounded">
            Position equation here
          </div>
        </div>
      </div>
      
      {/* Top navigation bar - Photomath style */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="flex gap-8 items-center">
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-transparent">
            <span className="bg-primary w-10 h-10 rounded-full flex items-center justify-center">
              <Scan size={20} />
            </span>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-transparent">
            <span className="bg-gray-700/50 w-10 h-10 rounded-full flex items-center justify-center">
              <PenLine size={20} />
            </span>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-transparent">
            <span className="bg-gray-700/50 w-10 h-10 rounded-full flex items-center justify-center">
              <KeyboardIcon size={20} />
            </span>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-transparent">
            <span className="bg-gray-700/50 w-10 h-10 rounded-full flex items-center justify-center">
              <History size={20} />
            </span>
          </Button>
        </div>
      </div>
      
      {/* Example equations that might appear in the viewfinder (Photomath-like) */}
      <div className="absolute top-1/3 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-transparent text-white/80 px-3 py-1 font-serif text-base">
          <span className="math-equation">3x² - 6x + 2 = 0</span>
        </div>
      </div>
      
      <div className="absolute top-1/2 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-primary/20 border border-primary/60 text-white px-3 py-1 font-serif text-base rounded">
          <span className="math-equation">∫sin(x)dx = -cos(x) + C</span>
        </div>
      </div>
      
      <div className="absolute bottom-1/3 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-transparent text-white/80 px-3 py-1 font-serif text-base">
          <span className="math-equation">lim(x→∞) (1 + 1/x)ˣ = e</span>
        </div>
      </div>
    </>
  );
};

export default CameraGuide;
