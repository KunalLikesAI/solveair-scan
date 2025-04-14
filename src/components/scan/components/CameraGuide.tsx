
import React from 'react';

const CameraGuide: React.FC = () => {
  return (
    <>
      <div className="absolute inset-0 border-2 border-primary/30 border-dashed pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-4/5 h-1/3 border-2 border-primary rounded-lg flex items-center justify-center">
          <div className="text-primary/70 text-xs backdrop-blur-sm bg-black/10 px-2 py-1 rounded">
            Position equation here
          </div>
        </div>
      </div>
      
      {/* Corner markers for better visual guidance */}
      <div className="absolute top-[33%] left-[10%] w-3 h-3 border-t-2 border-l-2 border-primary"></div>
      <div className="absolute top-[33%] right-[10%] w-3 h-3 border-t-2 border-r-2 border-primary"></div>
      <div className="absolute bottom-[33%] left-[10%] w-3 h-3 border-b-2 border-l-2 border-primary"></div>
      <div className="absolute bottom-[33%] right-[10%] w-3 h-3 border-b-2 border-r-2 border-primary"></div>
    </>
  );
};

export default CameraGuide;
