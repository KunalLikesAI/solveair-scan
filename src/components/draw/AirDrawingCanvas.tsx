import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Check, Hand, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { detectHandGesture } from '@/utils/handGestureDetector';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AirDrawingCanvasProps {
  onDrawingComplete: (imageData: string) => void;
}

const AirDrawingCanvas: React.FC<AirDrawingCanvasProps> = ({ onDrawingComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [currentGesture, setCurrentGesture] = useState<string>("None");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");

  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setAvailableCameras(videoDevices);
        
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Error enumerating devices:', error);
        setCameraError('Unable to list available cameras.');
      }
    };
    
    getCameras();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.scale(2, 2);
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = '#8B5CF6';
        context.lineWidth = 5;
        contextRef.current = context;
      }
    }
    
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && contextRef.current) {
        const currentDrawing = canvas.toDataURL();
        const img = new Image();
        
        img.onload = () => {
          const rect = canvas.getBoundingClientRect();
          const prevWidth = canvas.width / 2;
          const prevHeight = canvas.height / 2;
          canvas.width = rect.width * 2;
          canvas.height = rect.height * 2;
          
          const context = contextRef.current;
          if (context) {
            context.scale(2, 2);
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.strokeStyle = '#8B5CF6';
            context.lineWidth = 5;
            
            if (hasDrawing) {
              const scaleFactor = Math.min(
                rect.width / prevWidth,
                rect.height / prevHeight
              );
              
              const newWidth = prevWidth * scaleFactor;
              const newHeight = prevHeight * scaleFactor;
              const x = (rect.width - newWidth) / 2;
              const y = (rect.height - newHeight) / 2;
              
              context.drawImage(img, x, y, newWidth, newHeight);
            }
          }
        };
        
        if (hasDrawing) {
          img.src = currentDrawing;
        }
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [hasDrawing]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      
      if (!selectedCamera) {
        setCameraError('No camera selected. Please select a camera.');
        return;
      }
      
      const constraints = {
        video: { 
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
        }
      };
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setCameraError('Unable to access the selected camera. Please try another camera or check permissions.');
    }
  };

  const handleCameraChange = (deviceId: string) => {
    setSelectedCamera(deviceId);
    
    if (isCameraActive) {
      stopCamera();
      setTimeout(() => {
        if (deviceId) {
          setSelectedCamera(deviceId);
          startCamera();
        }
      }, 500);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (!isCameraActive) return;
    
    let lastPosition: { x: number, y: number } | null = null;
    let isCurrentlyDrawing = false;
    
    const processFrame = () => {
      if (!isCameraActive || !videoRef.current) return;
      
      const gesture = detectHandGesture(videoRef.current);
      
      if (gesture.isDrawing) {
        setCurrentGesture("Drawing (Index finger)");
      } else if (gesture.isPausing) {
        setCurrentGesture("Paused (Two fingers)");
      } else if (gesture.isSolving) {
        setCurrentGesture("Solving (Three fingers)");
      } else {
        setCurrentGesture("No gesture detected");
      }
      
      if (gesture.isDrawing && gesture.drawingPosition) {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        
        if (canvas && context) {
          const canvasRect = canvas.getBoundingClientRect();
          const videoWidth = videoRef.current?.videoWidth || 640;
          const videoHeight = videoRef.current?.videoHeight || 480;
          
          const scaledX = (gesture.drawingPosition.x / videoWidth) * canvasRect.width;
          const scaledY = (gesture.drawingPosition.y / videoHeight) * canvasRect.height;
          
          if (!isCurrentlyDrawing) {
            context.beginPath();
            context.moveTo(scaledX, scaledY);
            isCurrentlyDrawing = true;
          } else if (lastPosition) {
            context.lineTo(scaledX, scaledY);
            context.stroke();
          }
          
          lastPosition = { x: scaledX, y: scaledY };
          setHasDrawing(true);
        }
      } else {
        isCurrentlyDrawing = false;
        lastPosition = null;
        
        if (gesture.isSolving) {
          completeDrawing();
        }
      }
      
      requestAnimationFrame(processFrame);
    };
    
    const frameId = requestAnimationFrame(processFrame);
    return () => cancelAnimationFrame(frameId);
  }, [isCameraActive]);

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const clearCanvas = () => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    
    if (context && canvas) {
      context.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      setHasDrawing(false);
    }
  };

  const completeDrawing = () => {
    const canvas = canvasRef.current;
    if (canvas && hasDrawing) {
      const imageData = canvas.toDataURL('image/png');
      onDrawingComplete(imageData);
    }
  };

  return (
    <div className="w-full">
      <div className="glass-card rounded-xl overflow-hidden relative">
        <div className="aspect-[4/3] bg-white relative">
          {isCameraActive && (
            <div className="absolute top-0 left-0 w-full h-full z-0">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-contain"
              />
            </div>
          )}
          
          <canvas
            ref={canvasRef}
            className="w-full h-full drawing-canvas absolute top-0 left-0 z-10"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
          />
          
          {isCameraActive && (
            <div className="absolute top-4 left-0 right-0 p-4 text-center z-20">
              <div className="inline-block px-3 py-1 bg-purple-100 rounded-full text-purple-600 text-sm">
                <Hand className="w-4 h-4 inline-block mr-1" /> {currentGesture}
              </div>
            </div>
          )}
          
          {!isCameraActive && !hasDrawing && (
            <div className="absolute top-0 left-0 right-0 p-4 text-center z-20">
              <div className="inline-block px-3 py-1 bg-blue-50 rounded-full text-blue-600 text-sm">
                Start air drawing with your camera
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 space-y-4">
        {!isCameraActive && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="w-full sm:w-auto">
              <Select value={selectedCamera} onValueChange={handleCameraChange}>
                <SelectTrigger className="w-full sm:w-[220px]">
                  <SelectValue placeholder="Select camera" />
                </SelectTrigger>
                <SelectContent>
                  {availableCameras.length === 0 ? (
                    <SelectItem value="no-cameras">No cameras found</SelectItem>
                  ) : (
                    availableCameras.map((camera) => (
                      <SelectItem key={camera.deviceId} value={camera.deviceId}>
                        {camera.label || `Camera ${availableCameras.indexOf(camera) + 1}`}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={startCamera} disabled={!selectedCamera}>
              <Camera className="w-4 h-4 mr-2" />
              Start Air Drawing
            </Button>
          </div>
        )}
        
        {cameraError && (
          <div className="text-red-500 text-center p-2 bg-red-50 rounded-md">
            {cameraError}
          </div>
        )}
        
        {isCameraActive && (
          <div className="flex justify-center space-x-4">
            <Button variant="outline" onClick={clearCanvas} disabled={!hasDrawing}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button onClick={completeDrawing} disabled={!hasDrawing}>
              <Check className="w-4 h-4 mr-2" />
              Solve
            </Button>
            <Button variant="destructive" onClick={stopCamera}>
              Stop Camera
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AirDrawingCanvas;
