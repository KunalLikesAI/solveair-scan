
import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Check, Hand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { detectHandGesture } from '@/utils/handGestureDetector';

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
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Set canvas dimensions with higher resolution for better quality
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.scale(2, 2); // Scale to match the increased resolution
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.strokeStyle = '#8B5CF6'; // Vibrant purple color
        context.lineWidth = 5;
        contextRef.current = context;
      }
    }
    
    // Handle resize
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas && contextRef.current) {
        // Save current drawing
        const currentDrawing = canvas.toDataURL();
        const img = new Image();
        
        img.onload = () => {
          // Resize canvas
          const rect = canvas.getBoundingClientRect();
          const prevWidth = canvas.width / 2;
          const prevHeight = canvas.height / 2;
          canvas.width = rect.width * 2;
          canvas.height = rect.height * 2;
          
          // Restore context properties
          const context = contextRef.current;
          if (context) {
            context.scale(2, 2);
            context.lineCap = 'round';
            context.lineJoin = 'round';
            context.strokeStyle = '#8B5CF6';
            context.lineWidth = 5;
            
            // Draw previous content scaled to new size
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
  
  // Start camera
  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } // Use front camera for hand detection
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
  
  // Process hand gestures
  useEffect(() => {
    if (!isCameraActive) return;
    
    let lastPosition: { x: number, y: number } | null = null;
    let isCurrentlyDrawing = false;
    
    const processFrame = () => {
      if (!isCameraActive || !videoRef.current) return;
      
      const gesture = detectHandGesture(videoRef.current);
      
      // Update gesture display
      if (gesture.isDrawing) {
        setCurrentGesture("Drawing (Index finger)");
      } else if (gesture.isPausing) {
        setCurrentGesture("Paused (Two fingers)");
      } else if (gesture.isSolving) {
        setCurrentGesture("Solving (Three fingers)");
      } else {
        setCurrentGesture("No gesture detected");
      }
      
      // Handle drawing position
      if (gesture.isDrawing && gesture.drawingPosition) {
        const canvas = canvasRef.current;
        const context = contextRef.current;
        
        if (canvas && context) {
          // Scale drawing position to canvas size
          const canvasRect = canvas.getBoundingClientRect();
          const videoWidth = videoRef.current?.videoWidth || 640;
          const videoHeight = videoRef.current?.videoHeight || 480;
          
          const scaledX = (gesture.drawingPosition.x / videoWidth) * canvasRect.width;
          const scaledY = (gesture.drawingPosition.y / videoHeight) * canvasRect.height;
          
          if (!isCurrentlyDrawing) {
            // Start a new line
            context.beginPath();
            context.moveTo(scaledX, scaledY);
            isCurrentlyDrawing = true;
          } else if (lastPosition) {
            // Continue line
            context.lineTo(scaledX, scaledY);
            context.stroke();
          }
          
          lastPosition = { x: scaledX, y: scaledY };
          setHasDrawing(true);
        }
      } else {
        // Not drawing
        isCurrentlyDrawing = false;
        lastPosition = null;
        
        // If solving gesture detected, complete the drawing
        if (gesture.isSolving) {
          completeDrawing();
        }
      }
      
      // Continue processing frames
      requestAnimationFrame(processFrame);
    };
    
    const frameId = requestAnimationFrame(processFrame);
    return () => cancelAnimationFrame(frameId);
  }, [isCameraActive]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => stopCamera();
  }, []);
  
  // Clear canvas
  const clearCanvas = () => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    
    if (context && canvas) {
      context.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
      setHasDrawing(false);
    }
  };
  
  // Complete drawing
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
        {/* Drawing canvas */}
        <div className="aspect-[4/3] bg-white relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full drawing-canvas absolute top-0 left-0 z-10"
          />
          
          {/* Camera feed */}
          {isCameraActive && (
            <div className="absolute top-0 left-0 w-full h-full bg-black z-0">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted
                className="w-full h-full object-cover opacity-75"
              />
            </div>
          )}
          
          {/* Gesture indicator */}
          {isCameraActive && (
            <div className="absolute top-4 left-0 right-0 p-4 text-center z-20">
              <div className="inline-block px-3 py-1 bg-purple-100 rounded-full text-purple-600 text-sm">
                <Hand className="w-4 h-4 inline-block mr-1" /> {currentGesture}
              </div>
            </div>
          )}
          
          {/* Startup view */}
          {!isCameraActive && !hasDrawing && (
            <div className="absolute top-0 left-0 right-0 p-4 text-center z-20">
              <div className="inline-block px-3 py-1 bg-blue-50 rounded-full text-blue-600 text-sm">
                Start air drawing with your camera
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-6 flex justify-center space-x-4">
        {!isCameraActive && !hasDrawing ? (
          <Button onClick={startCamera}>
            Start Air Drawing
          </Button>
        ) : (
          <>
            <Button variant="outline" onClick={clearCanvas} disabled={!hasDrawing}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button onClick={completeDrawing} disabled={!hasDrawing}>
              <Check className="w-4 h-4 mr-2" />
              Solve
            </Button>
            {isCameraActive && (
              <Button variant="destructive" onClick={stopCamera}>
                Stop Camera
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AirDrawingCanvas;
