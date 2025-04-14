
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CapturedImageViewProps {
  imageUrl: string;
  onReset: () => void;
}

const CapturedImageView: React.FC<CapturedImageViewProps> = ({ imageUrl, onReset }) => {
  return (
    <div className="aspect-[4/3] bg-gray-900 relative">
      <img 
        src={imageUrl} 
        alt="Captured equation" 
        className="w-full h-full object-contain"
      />
      
      <div className="absolute top-4 right-4">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-full bg-black/20 backdrop-blur-sm border-white/10 text-white hover:bg-black/30"
          onClick={onReset}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CapturedImageView;
