import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import CameraView from '@/components/scan/CameraView';
import SolutionDisplay from '@/components/shared/SolutionDisplay';
import { analyzeEquationImage, solveEquation, SolveResult } from '@/utils/mathSolver';
import { Button } from '@/components/ui/button';
import { History, Scan, ScanText, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle 
} from "@/components/ui/dialog";

const ScanPage = () => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [extractedEquation, setExtractedEquation] = useState<string | null>(null);
  const [solution, setSolution] = useState<SolveResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const [processingProgress, setProcessingProgress] = useState<number>(0);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [showOriginal, setShowOriginal] = useState(false);
  const { toast } = useToast();
  
  const handleImageCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setProcessedImage(null);
    setIsProcessing(true);
    setProcessingProgress(10);
    setIsCameraOpen(false);
    
    try {
      setProcessingProgress(30);
      
      const analysisResult = await analyzeEquationImage(imageData);
      setProcessedImage(analysisResult.processedImage);
      setExtractedEquation(analysisResult.extractedEquation);
      setProcessingProgress(80);
      
      setIsSolving(true);
      setIsProcessing(false);
      
      const result = await solveEquation(analysisResult.extractedEquation);
      setSolution(result);
      
      toast({
        title: "Equation processed successfully",
        description: `Extracted: ${analysisResult.extractedEquation}`,
      });
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
    setShowOriginal(false);
  };

  const openCamera = () => {
    setIsCameraOpen(true);
  };
  
  const toggleImageView = () => {
    setShowOriginal(!showOriginal);
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Scan & Solve
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Take a photo of any math equation and get an instant solution with step-by-step explanations.
          </p>
          
          {!solution && !capturedImage && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 max-w-xl mx-auto">
              <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Scanning Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Good Lighting</p>
                  <p className="text-gray-600 dark:text-gray-400">Ensure equation is well-lit</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Steady Camera</p>
                  <p className="text-gray-600 dark:text-gray-400">Hold still for best results</p>
                </div>
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
                  <p className="font-semibold text-gray-900 dark:text-gray-100">Clear Writing</p>
                  <p className="text-gray-600 dark:text-gray-400">Avoid messy handwriting</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {!solution ? (
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="aspect-[4/3] bg-gray-900 relative">
                  {capturedImage ? (
                    <img 
                      src={showOriginal ? capturedImage : (processedImage || capturedImage)} 
                      alt="Captured equation" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <Scan className="w-12 h-12 text-primary mb-4" />
                      <p className="text-white text-lg mb-4">Ready to scan an equation?</p>
                      <Button 
                        onClick={openCamera}
                        size="lg"
                        className="bg-primary hover:bg-primary/90"
                      >
                        Open Camera
                      </Button>
                    </div>
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
                
                {capturedImage && (
                  <div className="p-4 flex justify-between items-center">
                    <Button variant="outline" onClick={handleReset}>
                      Scan Another Equation
                    </Button>
                    
                    {processedImage && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={toggleImageView} 
                        className="flex items-center gap-1 text-xs"
                      >
                        <ImageIcon size={14} />
                        {showOriginal ? "Show Processed" : "Show Original"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="aspect-[4/3] bg-gray-900 relative">
                  {capturedImage && (
                    <img 
                      src={showOriginal ? capturedImage : (processedImage || capturedImage)} 
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
                
                <div className="p-4 flex justify-between items-center">
                  <Button variant="outline" onClick={handleReset}>
                    Scan Another Equation
                  </Button>
                  
                  {processedImage && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={toggleImageView} 
                      className="flex items-center gap-1 text-xs"
                    >
                      <ImageIcon size={14} />
                      {showOriginal ? "Show Processed" : "Show Original"}
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div>
            {(isProcessing || isSolving) && (
              <SolutionDisplay 
                equation={isProcessing ? "Extracting equation..." : (extractedEquation || "")}
                solution=""
                steps={[]}
                isLoading={true}
                progress={processingProgress}
                processingPhase={isProcessing ? "recognizing" : "solving"}
              />
            )}
            
            {solution && !isProcessing && !isSolving && (
              <SolutionDisplay 
                equation={solution.equation}
                solution={solution.solution}
                steps={solution.steps}
              />
            )}
            
            {!solution && !isProcessing && !isSolving && (
              <div className="glass-card rounded-xl overflow-hidden h-full">
                <div className="p-8 flex flex-col items-center justify-center h-full">
                  <div className="feature-icon mb-6">
                    <Scan className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Solution Will Appear Here
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    Take a photo of a math equation using the camera to see its solution and step-by-step explanation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Dialog open={isCameraOpen} onOpenChange={setIsCameraOpen}>
        <DialogContent className="max-w-full w-full sm:max-w-[95vw] h-[90vh] p-0 sm:p-0 border-none bg-black">
          <DialogTitle className="sr-only">Camera Scanner</DialogTitle>
          <DialogDescription className="sr-only">
            Take a photo of a math equation to solve
          </DialogDescription>
          <div className="w-full h-full flex flex-col">
            <CameraView onCapture={handleImageCapture} />
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default ScanPage;
