
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Copy, Check, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface SolutionDisplayProps {
  equation: string;
  solution: string;
  steps: string[];
  isLoading?: boolean;
  progress?: number;
  processingPhase?: 'recognizing' | 'solving';
}

const SolutionDisplay: React.FC<SolutionDisplayProps> = ({ 
  equation, 
  solution,
  steps,
  isLoading = false,
  progress = 0,
  processingPhase = 'solving'
}) => {
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  const [showSteps, setShowSteps] = useState(true);
  
  const copyToClipboard = () => {
    const text = `Equation: ${equation}\n\nSolution: ${solution}\n\nSteps:\n${steps.join('\n')}`;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "The solution has been copied to your clipboard.",
      });
      
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  return (
    <div className="glass-card rounded-xl overflow-hidden">
      <div className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Equation</h3>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
            <p className="font-mono text-lg text-gray-900 dark:text-gray-100">{equation}</p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {processingPhase === 'recognizing' 
                ? 'Preprocessing and recognizing equation...' 
                : 'Solving equation...'}
            </p>
            {progress > 0 && (
              <div className="w-full max-w-xs">
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-gray-500 text-right mt-1">{progress}%</p>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-2">Solution</h3>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="font-mono text-xl font-bold text-primary dark:text-primary">{solution}</p>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium text-gray-700">Steps</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowSteps(!showSteps)}
                  className="flex items-center gap-1"
                >
                  {showSteps ? (
                    <>
                      <ChevronUp className="h-4 w-4" />
                      <span className="text-sm">Hide Steps</span>
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" />
                      <span className="text-sm">Show Steps</span>
                    </>
                  )}
                </Button>
              </div>
              
              {showSteps && (
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                  <ol className="space-y-4 font-mono text-gray-700 dark:text-gray-300">
                    {steps.map((step, index) => (
                      <li key={index} className="animate-fade-in p-3 bg-white dark:bg-gray-800 rounded-md shadow-sm" style={{ animationDelay: `${index * 100}ms` }}>
                        <div className="flex items-start">
                          <span className="bg-primary/10 text-primary w-6 h-6 flex items-center justify-center rounded-full text-sm mr-3">
                            {index + 1}
                          </span>
                          <div>{step}</div>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <Button variant="outline" onClick={copyToClipboard} className="space-x-2 w-full sm:w-auto">
                  {copied ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span>{copied ? "Copied" : "Copy Solution"}</span>
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-500">Was this solution helpful?</span>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                  <ThumbsUp className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                  <ThumbsDown className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SolutionDisplay;
