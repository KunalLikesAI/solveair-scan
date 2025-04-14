
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
      <div className="absolute bottom-10 left-0 right-0 flex justify-center">
        <button 
          className="w-16 h-16 rounded-full bg-white border-4 border-primary shadow-lg focus:outline-none relative"
          onClick={captureImage}
          disabled={isScanning}
        >
          <div className="absolute inset-2 rounded-full bg-primary/10"></div>
          <div className="absolute inset-4 rounded-full bg-primary"></div>
        </button>
      </div>
    );
  }

  if (capturedImage) {
    return (
      <div className="absolute bottom-10 left-0 right-0 flex justify-center space-x-6">
        <Button variant="outline" onClick={resetCamera} className="bg-gray-800/80 text-white border-gray-600">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retake
        </Button>
        <Button onClick={confirmImage} className="bg-primary/90 hover:bg-primary text-white">
          <CheckCircle className="w-4 h-4 mr-2" />
          Use Photo
        </Button>
      </div>
    );
  }

  return null;
};

export default CameraControls;
