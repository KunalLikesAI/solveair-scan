import React, { useRef, useState, useEffect } from 'react';
import { RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DrawingCanvasProps {
  onDrawingComplete: (imageData: string) => void;
}

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onDrawingComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  
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
        context.strokeStyle = 'black';
        context.lineWidth = 3;
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
            context.strokeStyle = 'black';
            context.lineWidth = 3;
            
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
  
  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const context = contextRef.current;
    const canvas = canvasRef.current;
    
    if (context && canvas) {
      context.beginPath();
      
      const rect = canvas.getBoundingClientRect();
      let x, y;
      
      if ('touches' in event) {
        const touch = event.touches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      } else {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      }
      
      context.moveTo(x, y);
      setIsDrawing(true);
      setHasDrawing(true);
    }
  };
  
  const draw = (event: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    
    const context = contextRef.current;
    const canvas = canvasRef.current;
    
    if (context && canvas) {
      const rect = canvas.getBoundingClientRect();
      let x, y;
      
      if ('touches' in event) {
        const touch = event.touches[0];
        x = touch.clientX - rect.left;
        y = touch.clientY - rect.top;
      } else {
        x = event.clientX - rect.left;
        y = event.clientY - rect.top;
      }
      
      context.lineTo(x, y);
      context.stroke();
    }
  };
  
  const stopDrawing = () => {
    if (isDrawing && contextRef.current) {
      contextRef.current.closePath();
      setIsDrawing(false);
    }
  };
  
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
      const imageData = canvas.toDataURL('image/png', 1.0);
      onDrawingComplete(imageData);
    }
  };
  
  return (
    <div className="w-full">
      <div className="glass-card rounded-xl overflow-hidden relative">
        <div className="aspect-[4/3] bg-white relative">
          <canvas
            ref={canvasRef}
            className="w-full h-full drawing-canvas"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <div className="absolute top-0 left-0 right-0 p-4 text-center">
            <div className="inline-block px-3 py-1 bg-blue-50 rounded-full text-blue-600 text-sm">
              Draw your equation here
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-center space-x-4">
        <Button variant="outline" onClick={clearCanvas} disabled={!hasDrawing}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Clear
        </Button>
        <Button onClick={completeDrawing} disabled={!hasDrawing}>
          <Check className="w-4 h-4 mr-2" />
          Solve
        </Button>
      </div>
    </div>
  );
};

export default DrawingCanvas;
