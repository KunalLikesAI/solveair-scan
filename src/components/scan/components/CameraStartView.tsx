
import React from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CameraStartViewProps {
  cameraError: string | null;
  startCamera: () => void;
}

const CameraStartView: React.FC<CameraStartViewProps> = ({ cameraError, startCamera }) => {
  return (
    <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-8">
      {cameraError ? (
        <div className="text-center">
          <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-4 rounded-lg mb-4">
            {cameraError}
          </div>
          <Button onClick={startCamera}>Try Again</Button>
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
          <Button onClick={startCamera}>Start Camera</Button>
        </div>
      )}
    </div>
  );
};

export default CameraStartView;
