
import React from 'react';
import { Camera } from 'lucide-react';

interface MobileCameraViewProps {
  isScanning: boolean;
}

const MobileCameraView: React.FC<MobileCameraViewProps> = ({ isScanning }) => {
  if (isScanning) {
    return (
      <div className="aspect-[4/3] bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Processing image...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="aspect-[4/3] bg-gray-900 flex items-center justify-center">
      <div className="text-center text-white p-4">
        <Camera className="w-12 h-12 mx-auto mb-2 text-primary" />
        <p>Tap the button below to take a picture</p>
      </div>
    </div>
  );
};

export default MobileCameraView;
