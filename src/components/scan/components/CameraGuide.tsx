
import React from 'react';
import { Scan, PenLine, KeyboardIcon, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CameraGuide: React.FC = () => {
  return (
    <>
      {/* Main camera guide frame */}
      <div className="absolute inset-0 border-2 border-primary/30 border-dashed pointer-events-none" />
      
      {/* Top navigation bar */}
      <div className="absolute top-0 left-0 right-0 h-14 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="flex gap-6 items-center">
          <Button variant="ghost" size="icon" className="text-white/80 hover:text-white hover:bg-transparent">
            <span className="bg-gray-700 w-8 h-8 rounded-full flex items-center justify-center">
              <Scan size={18} />
            </span>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-transparent">
            <span className="bg-gray-700/50 w-8 h-8 rounded-full flex items-center justify-center">
              <PenLine size={18} />
            </span>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-transparent">
            <span className="bg-gray-700/50 w-8 h-8 rounded-full flex items-center justify-center">
              <KeyboardIcon size={18} />
            </span>
          </Button>
          
          <Button variant="ghost" size="icon" className="text-white/60 hover:text-white hover:bg-transparent">
            <span className="bg-gray-700/50 w-8 h-8 rounded-full flex items-center justify-center">
              <Settings size={18} />
            </span>
          </Button>
        </div>
      </div>
      
      {/* Equation capture area - highlighted in the middle */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-4/5 h-16 border-2 border-primary rounded-lg flex items-center justify-center">
          <div className="text-primary/70 text-xs backdrop-blur-sm bg-black/10 px-2 py-1 rounded">
            Position equation here
          </div>
        </div>
      </div>
      
      {/* Corner markers for better visual guidance */}
      <div className="absolute top-1/3 left-[10%] w-3 h-3 border-t-2 border-l-2 border-primary"></div>
      <div className="absolute top-1/3 right-[10%] w-3 h-3 border-t-2 border-r-2 border-primary"></div>
      <div className="absolute bottom-1/3 left-[10%] w-3 h-3 border-b-2 border-l-2 border-primary"></div>
      <div className="absolute bottom-1/3 right-[10%] w-3 h-3 border-b-2 border-r-2 border-primary"></div>
      
      {/* Example equations that might appear in the viewfinder (for demo purposes) */}
      <div className="absolute top-1/4 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-transparent text-white/80 px-3 py-1 font-serif text-sm">
          <span className="math-equation">3/n² = (n-4)/2 = 2/3n²</span>
        </div>
      </div>
      
      <div className="absolute top-2/5 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-transparent text-white/80 px-3 py-1 font-serif text-sm">
          <span className="math-equation">-6 log₃(x-3) = -24</span>
        </div>
      </div>
      
      <div className="absolute top-1/2 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-primary/20 border border-primary text-white px-3 py-1 font-serif text-sm rounded">
          <span className="math-equation">x² - 4x - 5 = 0</span>
        </div>
      </div>
      
      <div className="absolute bottom-2/5 left-0 right-0 flex justify-center pointer-events-none">
        <div className="bg-transparent text-white/80 px-3 py-1 font-serif text-sm">
          <span className="math-equation">{ "{ 8x + 2y = 46, 7x + 37 = 47 }" }</span>
        </div>
      </div>
    </>
  );
};

export default CameraGuide;
