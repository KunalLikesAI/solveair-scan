
import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CameraGuide from './CameraGuide';
import CameraScanLine from './CameraScanLine';

interface WebCameraViewProps {
  isScanning: boolean;
  flashMode: boolean;
  toggleFlash: () => void;
  stopCamera: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const WebCameraView: React.FC<WebCameraViewProps> = ({ 
  isScanning, 
  flashMode, 
  toggleFlash, 
  stopCamera, 
  videoRef 
}) => {
  return (
    <div className="aspect-[4/3] bg-gray-900 relative w-full h-full">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-full object-cover"
        style={{ display: 'block' }}
      />
      
      {/* Scanning guide */}
      <CameraGuide />
      
      {/* Scanning animation */}
      <CameraScanLine isScanning={isScanning} />
      
      {/* Camera controls */}
      <div className="absolute top-4 right-4 flex space-x-2">
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full bg-black/20 backdrop-blur-sm border-white/10 text-white hover:bg-black/30"
          onClick={toggleFlash}
        >
          <div className={`w-3 h-3 rounded-full ${flashMode ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-black/20 backdrop-blur-sm border-white/10 text-white hover:bg-black/30"
          onClick={stopCamera}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default WebCameraView;
