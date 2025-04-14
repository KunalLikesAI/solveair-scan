
import React from 'react';
import { RefreshCw, Focus } from 'lucide-react';
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
      <div className="mt-6 flex justify-center">
        <Button 
          size="lg" 
          className="rounded-full w-16 h-16 p-0 flex items-center justify-center shadow-lg"
          onClick={captureImage}
          disabled={isScanning}
        >
          <div className="w-12 h-12 rounded-full border-2 border-white" />
        </Button>
      </div>
    );
  }

  if (capturedImage) {
    return (
      <div className="mt-6 flex justify-center space-x-4">
        <Button variant="outline" onClick={resetCamera}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Retake
        </Button>
        <Button onClick={confirmImage}>
          <Focus className="w-4 h-4 mr-2" />
          Process Equation
        </Button>
      </div>
    );
  }

  return null;
};

export default CameraControls;
