
import React from 'react';
import { X, Zap } from 'lucide-react'; // Replace 'Flash' with 'Zap'
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
    <div className="aspect-[9/16] bg-gray-900 relative w-full h-full">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className="w-full h-full object-cover"
        style={{ display: 'block' }}
      />
      
      {/* Scanning guide overlay */}
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
          <Zap className={`w-4 h-4 ${flashMode ? 'text-yellow-400' : 'text-white/70'}`} />
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
