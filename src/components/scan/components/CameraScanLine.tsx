
import React, { useRef, useEffect } from 'react';

interface CameraScanLineProps {
  isScanning: boolean;
}

const CameraScanLine: React.FC<CameraScanLineProps> = ({ isScanning }) => {
  const scanLineRef = useRef<HTMLDivElement>(null);

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

  if (!isScanning) return null;

  return (
    <div 
      ref={scanLineRef}
      className="absolute left-0 right-0 h-0.5 bg-primary pointer-events-none"
      style={{
        boxShadow: '0 0 8px rgba(59, 130, 246, 0.8), 0 0 20px rgba(59, 130, 246, 0.6)'
      }}
    ></div>
  );
};

export default CameraScanLine;
