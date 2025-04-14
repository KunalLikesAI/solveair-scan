
import React from 'react';

const CameraGuide: React.FC = () => {
  return (
    <>
      <div className="absolute inset-0 border-2 border-primary/30 border-dashed pointer-events-none" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-4/5 h-1/3 border-2 border-primary rounded-lg"></div>
      </div>
    </>
  );
};

export default CameraGuide;
