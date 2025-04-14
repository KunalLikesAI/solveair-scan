
import React from 'react';
import { RefreshCw, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraControlsProps {
  isCameraActive: boolean;
  capturedImage: string | null;
  isScanning: boolean;
  captureImage: () => void;
  resetCamera: () => void;
  confirmImage: () => void;
}

const CameraControls: React.FC<CameraControlsProps> = ({
  isCameraActive,
  capturedImage,
  isScanning,
  captureImage,
  resetCamera,
  confirmImage
}) => {
  if (isScanning && !capturedImage) {
    return (
      <div className="mt-6 flex justify-center">
        <div className="px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full text-white flex items-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
          <span>Scanning equation...</span>
        </div>
      </div>
    );
  }

  if (isCameraActive && !capturedImage && !isScanning) {
    return (
      <div className="absolute bottom-8 left-0 right-0 flex justify-center">
        <button 
          className="w-20 h-20 rounded-full bg-white shadow-lg focus:outline-none relative"
          onClick={captureImage}
          disabled={isScanning}
        >
          <div className="absolute inset-1 rounded-full bg-primary/10 border-4 border-primary"></div>
          <div className="absolute inset-3 rounded-full bg-primary"></div>
        </button>
      </div>
    );
  }

  if (capturedImage) {
    return (
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-8">
        <Button onClick={resetCamera} className="w-16 h-16 rounded-full bg-gray-800/80 text-white border border-gray-600">
          <RefreshCw className="w-6 h-6" />
        </Button>
        <Button onClick={confirmImage} className="w-16 h-16 rounded-full bg-primary text-white">
          <CheckCircle className="w-6 h-6" />
        </Button>
      </div>
    );
  }

  return null;
};

export default CameraControls;
