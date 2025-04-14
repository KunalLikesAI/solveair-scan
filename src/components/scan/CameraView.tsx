
import React, { useState, useRef, useEffect } from 'react';
import { Camera as CapacitorCamera, CameraResultType, CameraSource } from '@capacitor/camera';
import WebCameraView from './components/WebCameraView';
import MobileCameraView from './components/MobileCameraView';
import CapturedImageView from './components/CapturedImageView';
import CameraStartView from './components/CameraStartView';
import CameraControls from './components/CameraControls';

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
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => {
            console.error("Error playing video:", e);
            setCameraError("Failed to start video stream. Please check permissions.");
          });
        };
        streamRef.current = stream;
        setIsCameraActive(true);
        console.log("Camera started successfully");
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="w-full h-full">
      <div className="glass-card rounded-xl overflow-hidden relative w-full h-full">
        {/* Camera view - Web only */}
        {isCameraActive && !capturedImage && !isMobileDevice && (
          <WebCameraView 
            isScanning={isScanning}
            flashMode={flashMode}
            toggleFlash={toggleFlash}
            stopCamera={stopCamera}
            videoRef={videoRef}
          />
        )}
        
        {/* Mobile camera placeholder - shows when camera would be active on mobile */}
        {isCameraActive && !capturedImage && isMobileDevice && (
          <MobileCameraView isScanning={isScanning} />
        )}
        
        {/* Captured image view */}
        {capturedImage && (
          <CapturedImageView 
            imageUrl={capturedImage} 
            onReset={() => setCapturedImage(null)} 
          />
        )}
        
        {/* Camera start view */}
        {!isCameraActive && !capturedImage && (
          <CameraStartView cameraError={cameraError} startCamera={startCamera} />
        )}
        
        {/* Hidden canvas for capturing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      {/* Camera controls */}
      <CameraControls 
        isCameraActive={isCameraActive}
        capturedImage={capturedImage}
        isScanning={isScanning}
        captureImage={captureImage}
        resetCamera={resetCamera}
        confirmImage={confirmImage}
      />
    </div>
  );
};

export default CameraView;
