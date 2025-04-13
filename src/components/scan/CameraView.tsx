
import React, { useState, useRef, useEffect } from 'react';
import { Camera, X, Image, RefreshCw, ScanLine, Focus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';

interface CameraViewProps {
  onCapture: (imageData: string) => void;
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture }) => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [flashMode, setFlashMode] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanLineRef = useRef<HTMLDivElement>(null);

  // Check if running in Capacitor (mobile)
  useEffect(() => {
    const checkPlatform = async () => {
      try {
        // Simple check if we're running on mobile
        const isMobile = 'capacitor' in window || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        setIsMobileDevice(isMobile);
      } catch (error) {
        console.log('Not running in Capacitor environment');
        setIsMobileDevice(false);
      }
    };
    
    checkPlatform();
  }, []);

  // Start web camera
  const startWebCamera = async () => {
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

  // Use Capacitor Camera on mobile devices
  const takePictureWithCapacitor = async () => {
    try {
      setCameraError(null);
      setIsScanning(true);
      
      const image = await CapacitorCamera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 1280,
        height: 720,
        correctOrientation: true,
      });
      
      if (image && image.dataUrl) {
        setCapturedImage(image.dataUrl);
        setIsScanning(false);
        setIsCameraActive(false);
      }
    } catch (error) {
      console.error('Error taking picture with Capacitor:', error);
      setCameraError('Unable to capture image. Please try again.');
      setIsScanning(false);
    }
  };

  // Start camera based on platform
  const startCamera = async () => {
    if (isMobileDevice) {
      // On mobile, we'll set isCameraActive to true but use takePictureWithCapacitor when needed
      setIsCameraActive(true);
    } else {
      // On web, use the web camera API
      await startWebCamera();
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  // Capture image on web
  const captureWebImage = () => {
    if (videoRef.current && canvasRef.current) {
      // Start scanning animation
      setIsScanning(true);
      
      // Simulate ML Kit processing delay
      setTimeout(() => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        
        if (video && canvas) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // Apply contrast enhancement and auto-crop simulation
            // In a real app, this would use actual image processing algorithms
            
            const imageData = canvas.toDataURL('image/jpeg');
            setCapturedImage(imageData);
            stopCamera();
            setIsScanning(false);
          }
        }
      }, 1500);
    }
  };

  // Capture image (handles both web and mobile)
  const captureImage = () => {
    if (isMobileDevice) {
      takePictureWithCapacitor();
    } else {
      captureWebImage();
    }
  };

  // Toggle flash - Modified to handle browsers that don't support torch
  const toggleFlash = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getVideoTracks();
      if (tracks.length > 0) {
        try {
          // Try to access advanced features if available
          const capabilities = tracks[0].getCapabilities();
          const hasFlash = 'torch' in capabilities;
          
          if (hasFlash) {
            const newFlashMode = !flashMode;
            // Use advanced constraints with torch if supported
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

  // Animate scan line
  useEffect(() => {
    if (isScanning && scanLineRef.current) {
      // Simple animation for scan line
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full">
      <div className="glass-card rounded-xl overflow-hidden relative">
        {/* Camera view - Web only */}
        {isCameraActive && !capturedImage && !isMobileDevice && (
          <div className="aspect-[4/3] bg-gray-900 relative">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            
            {/* Scanning guide */}
            <div className="absolute inset-0 border-2 border-primary/30 border-dashed pointer-events-none" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-4/5 h-1/3 border-2 border-primary rounded-lg"></div>
            </div>
            
            {/* Scanning animation */}
            {isScanning && (
              <div 
                ref={scanLineRef}
                className="absolute left-0 right-0 h-0.5 bg-primary pointer-events-none"
                style={{
                  boxShadow: '0 0 8px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6)'
                }}
              ></div>
            )}
            
            {/* Camera controls - Web only */}
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
                onClick={() => stopCamera()}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
        
        {/* Mobile camera placeholder - shows when camera would be active on mobile */}
        {isCameraActive && !capturedImage && isMobileDevice && !isScanning && (
          <div className="aspect-[4/3] bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white p-4">
              <Camera className="w-12 h-12 mx-auto mb-2 text-primary" />
              <p>Tap the button below to take a picture</p>
            </div>
          </div>
        )}
        
        {/* Mobile scanning indicator */}
        {isScanning && isMobileDevice && (
          <div className="aspect-[4/3] bg-gray-900 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p>Processing image...</p>
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
      {isCameraActive && !capturedImage && !isScanning && (
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
      )}
      
      {/* Scanning indicator */}
      {isScanning && !isMobileDevice && (
        <div className="mt-6 flex justify-center">
          <div className="px-4 py-2 bg-black/20 backdrop-blur-sm rounded-full text-white flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
            <span>Scanning equation...</span>
          </div>
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
            <Focus className="w-4 h-4 mr-2" />
            Process Equation
          </Button>
        </div>
      )}
    </div>
  );
};

export default CameraView;
