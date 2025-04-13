
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import CameraView from '@/components/scan/CameraView';
import SolutionDisplay from '@/components/shared/SolutionDisplay';
import { processEquationImage, solveEquation, SolveResult } from '@/utils/mathSolver';
import { Button } from '@/components/ui/button';
import { History, Scan, ScanText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ScanPage = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [extractedEquation, setExtractedEquation] = useState<string | null>(null);
  const [solution, setSolution] = useState<SolveResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const { toast } = useToast();
  
  const handleImageCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setIsProcessing(true);
    setProcessingProgress(10);
    
    try {
      setProcessingProgress(30);
      
      setProcessedImage(imageData);
      setProcessingProgress(50);
      
      const equation = await processEquationImage(imageData);
      setExtractedEquation(equation);
      setProcessingProgress(80);
      
      setIsSolving(true);
      setIsProcessing(false);
      
      const result = await solveEquation(equation);
      setSolution(result);
    } catch (error) {
      toast({
        title: "Error processing image",
        description: "Failed to extract equation from image. Please try again with clearer handwriting or better lighting.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsSolving(false);
      setProcessingProgress(100);
    }
  };
  
  const handleReset = () => {
    setCapturedImage(null);
    setProcessedImage(null);
    setExtractedEquation(null);
    setSolution(null);
    setProcessingProgress(0);
  };
  
  return (
    <Layout>
      <div className="w-full h-[calc(100vh-64px)]">
        {!solution ? (
          <div className="w-full h-full">
            <CameraView onCapture={handleImageCapture} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-6 py-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                Solution
              </h1>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="aspect-[4/3] bg-gray-900 relative">
                  {capturedImage && (
                    <img 
                      src={processedImage || capturedImage} 
                      alt="Captured equation" 
                      className="w-full h-full object-contain"
                    />
                  )}
                  
                  {extractedEquation && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4">
                      <div className="flex items-center space-x-2">
                        <ScanText className="w-4 h-4 text-primary" />
                        <p className="text-white font-mono">
                          Detected: <span className="text-primary">{extractedEquation}</span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex justify-center">
                  <Button variant="outline" onClick={handleReset}>
                    Scan Another Equation
                  </Button>
                </div>
              </div>
              
              <div>
                <SolutionDisplay 
                  equation={solution.equation}
                  solution={solution.solution}
                  steps={solution.steps}
                />
              </div>
            </div>
          </div>
        )}
        
        {(isProcessing || isSolving) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
              <SolutionDisplay 
                equation={isProcessing ? "Extracting equation..." : (extractedEquation || "")}
                solution=""
                steps={[]}
                isLoading={true}
                progress={processingProgress}
                processingPhase={isProcessing ? "recognizing" : "solving"}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ScanPage;
