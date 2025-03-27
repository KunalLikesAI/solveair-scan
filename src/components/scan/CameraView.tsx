
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Image, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Unable to access camera. Please make sure you have granted camera permissions.');
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  };

  // Capture image
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  // Reset camera
  const resetCamera = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Confirm captured image
  const confirmImage = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full">
      <div className="glass-card rounded-xl overflow-hidden relative">
        {/* Camera view */}
        {isCameraActive && !capturedImage && (
          <div className="aspect-[4/3] bg-gray-900 relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 border-2 border-white/30 border-dashed pointer-events-none" />
            
            <div className="absolute top-4 right-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-black/20 backdrop-blur-sm border-white/10 text-white hover:bg-black/30"
                onClick={() => stopCamera()}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Captured image view */}
        {capturedImage && (
          <div className="aspect-[4/3] bg-gray-900 relative">
            <img 
              src={capturedImage} 
              alt="Captured equation" 
              className="w-full h-full object-contain"
            />
            
            <div className="absolute top-4 right-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full bg-black/20 backdrop-blur-sm border-white/10 text-white hover:bg-black/30"
                onClick={() => setCapturedImage(null)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Camera start view */}
        {!isCameraActive && !capturedImage && (
          <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-8">
            {cameraError ? (
              <div className="text-center">
                <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-lg mb-4">
                  {cameraError}
                </div>
                <Button onClick={() => startCamera()}>Try Again</Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Camera className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-2">Scan Math Equation</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Position your camera to clearly capture the handwritten or printed math equation.
                </p>
                <Button onClick={() => startCamera()}>Start Camera</Button>
              </div>
            )}
          </div>
        )}
        
        {/* Hidden canvas for capturing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {/* Camera controls */}
      {isCameraActive && !capturedImage && (
        <div className="mt-6 flex justify-center">
          <Button 
            size="lg" 
            className="rounded-full w-16 h-16 p-0 flex items-center justify-center shadow-lg"
            onClick={captureImage}
          >
            <div className="w-12 h-12 rounded-full border-2 border-white" />
          </Button>
        </div>
      )}
      
      {/* Captured image controls */}
      {capturedImage && (
        <div className="mt-6 flex justify-center space-x-4">
          <Button variant="outline" onClick={resetCamera}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Retake
          </Button>
          <Button onClick={confirmImage}>
            <Image className="w-4 h-4 mr-2" />
            Use Image
          </Button>
        </div>
      )}
    </div>
  );
};

export default CameraView;
