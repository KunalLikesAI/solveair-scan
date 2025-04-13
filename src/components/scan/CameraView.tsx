
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, RefreshCw, Focus, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [flashMode, setFlashMode] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
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

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      setIsScanning(true);
      
      setTimeout(() => {
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
          setIsScanning(false);
        }
      }, 1500);
    }
  };

  const toggleFlash = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getVideoTracks();
      if (tracks.length > 0) {
        try {
          const capabilities = tracks[0].getCapabilities();
          const hasFlash = 'torch' in capabilities;
          
          if (hasFlash) {
            const newFlashMode = !flashMode;
            tracks[0].applyConstraints({
              advanced: [{ torch: newFlashMode } as any]
            }).then(() => {
              setFlashMode(newFlashMode);
            }).catch(e => {
              console.error('Error toggling flash:', e);
            });
          } else {
            console.log('Flash not supported on this device');
          }
        } catch (error) {
          console.log('Flash control not supported in this browser');
        }
      }
    }
  };

  const resetCamera = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmImage = () => {
    if (capturedImage) {
      onCapture(capturedImage);
    }
  };

  useEffect(() => {
    if (isScanning && scanLineRef.current) {
      let position = 0;
      const height = scanLineRef.current.parentElement?.clientHeight || 300;
      const interval = setInterval(() => {
        position += 5;
        if (position > height) {
          position = 0;
        }
        if (scanLineRef.current) {
          scanLineRef.current.style.top = `${position}px`;
        }
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [isScanning]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="relative w-full h-full overflow-hidden">
        {isCameraActive && (
          <div className="absolute inset-0 bg-black z-10">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            
            {/* Highlighted equation area */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4/5 h-16 border-2 border-cyan-400 rounded-lg shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
            </div>
            
            {isScanning && (
              <div 
                ref={scanLineRef}
                className="absolute left-0 right-0 h-0.5 bg-cyan-400 pointer-events-none"
                style={{
                  boxShadow: '0 0 8px rgba(56, 189, 248, 0.8), 0 0 20px rgba(56, 189, 248, 0.6)'
                }}
              ></div>
            )}
            
            {/* Top toolbar with icons */}
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center p-4 bg-black/30">
              <Button 
                variant="ghost" 
                size="icon"
                className="text-white"
                onClick={() => stopCamera()}
              >
                <X className="w-5 h-5" />
              </Button>
              
              <div className="flex space-x-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white"
                  onClick={toggleFlash}
                >
                  <div className={`w-3 h-3 rounded-full ${flashMode ? 'bg-yellow-400' : 'bg-gray-400'}`}></div>
                </Button>
              </div>
            </div>
            
            {/* Camera controls */}
            <div className="absolute bottom-6 left-0 right-0 flex justify-center z-10">
              <Button 
                size="lg" 
                className="rounded-full w-16 h-16 p-0 flex items-center justify-center shadow-lg bg-white"
                onClick={captureImage}
                disabled={isScanning}
              >
                <div className="w-12 h-12 rounded-full border-2 border-cyan-400" />
              </Button>
            </div>
          </div>
        )}
        
        {capturedImage && (
          <div className="absolute inset-0 bg-black z-10">
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
            
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-4 z-10">
              <Button variant="outline" onClick={resetCamera} className="bg-white/10 text-white border-white/20">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retake
              </Button>
              <Button onClick={confirmImage} className="bg-cyan-500 hover:bg-cyan-600">
                <Focus className="w-4 h-4 mr-2" />
                Process Equation
              </Button>
            </div>
          </div>
        )}
        
        {!isCameraActive && !capturedImage && (
          <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-8">
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
        
        {isScanning && (
          <div className="absolute bottom-6 left-0 right-0 flex justify-center z-20">
            <div className="px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full text-white flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
              <span>Scanning equation...</span>
            </div>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

export default CameraView;
