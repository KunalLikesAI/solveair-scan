
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import DrawingCanvas from '@/components/draw/DrawingCanvas';
import SolutionDisplay from '@/components/shared/SolutionDisplay';
import { processEquationImage, solveEquation, SolveResult } from '@/utils/mathSolver';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DrawPage = () => {
  const [drawnImage, setDrawnImage] = useState<string | null>(null);
  const [extractedEquation, setExtractedEquation] = useState<string | null>(null);
  const [solution, setSolution] = useState<SolveResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  const { toast } = useToast();
  
  // Handle drawing completion
  const handleDrawingComplete = async (imageData: string) => {
    setDrawnImage(imageData);
    setIsProcessing(true);
    
    try {
      // Process image to extract equation
      const equation = await processEquationImage(imageData);
      setExtractedEquation(equation);
      
      // Solve the extracted equation
      setIsSolving(true);
      setIsProcessing(false);
      
      const result = await solveEquation(equation);
      setSolution(result);
    } catch (error) {
      toast({
        title: "Error processing drawing",
        description: "Failed to extract equation from drawing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setIsSolving(false);
    }
  };
  
  // Reset state to start over
  const handleReset = () => {
    setDrawnImage(null);
    setExtractedEquation(null);
    setSolution(null);
  };
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Draw & Solve
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Draw your math equation on the canvas and get an instant solution with step-by-step explanations.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {!solution ? (
              <DrawingCanvas onDrawingComplete={handleDrawingComplete} />
            ) : (
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="aspect-[4/3] bg-white relative">
                  {drawnImage && (
                    <img 
                      src={drawnImage} 
                      alt="Drawn equation" 
                      className="w-full h-full object-contain"
                    />
                  )}
                  
                  {extractedEquation && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4">
                      <p className="text-white font-mono">
                        Detected: <span className="text-primary">{extractedEquation}</span>
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="p-4 flex justify-center">
                  <Button variant="outline" onClick={handleReset}>
                    Draw Another Equation
                  </Button>
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
                    <History className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Solution Will Appear Here
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    Draw a math equation on the canvas to see its solution and step-by-step explanation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DrawPage;
