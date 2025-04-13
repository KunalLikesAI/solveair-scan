
import React, { useRef, useEffect, useState } from 'react';
import { RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'myscript/dist/myscript.min.css';

// We need to import MyScript dynamically since it's a browser-only library
let MyScriptJS: any = null;

interface MathScriptCanvasProps {
  onDrawingComplete: (latexFormula: string) => void;
}

const MathScriptCanvas: React.FC<MathScriptCanvasProps> = ({ onDrawingComplete }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstance = useRef<any>(null);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);
  const [latexResult, setLatexResult] = useState<string>('');

  // Load MyScript dynamically
  useEffect(() => {
    const loadMyScript = async () => {
      if (typeof window !== 'undefined') {
        try {
          MyScriptJS = await import('myscript');
          setIsEditorLoaded(true);
        } catch (error) {
          console.error('Failed to load MyScript:', error);
        }
      }
    };
    
    loadMyScript();
  }, []);

  // Initialize editor after MyScript is loaded
  useEffect(() => {
    if (isEditorLoaded && editorRef.current && !editorInstance.current && MyScriptJS) {
      // You need to register and get API keys from MyScript
      // For demo purposes, we'll use placeholder values
      const applicationConfig = {
        recognitionParams: {
          type: 'MATH',
          protocol: 'WEBSOCKET',
          apiVersion: 'V4',
          server: {
            scheme: 'https',
            host: 'webdemoapi.myscript.com',
            applicationKey: '1463c06b-251c-47b8-ad0b-ba05b9a3bd01',
            hmacKey: '60ca101a-5e6d-4159-abc5-2efcbecce059',
          },
        },
      };

      const editorConfig = {
        math: {
          mimeTypes: ['application/x-latex'],
        },
      };

      try {
        editorInstance.current = MyScriptJS.register(editorRef.current, applicationConfig);
        
        // Configure editor
        const editor = editorInstance.current;
        editor.addEventListener('exported', (event: any) => {
          const exports = event.detail.exports;
          if (exports && exports['application/x-latex']) {
            const latex = exports['application/x-latex'];
            setLatexResult(latex);
            setHasDrawing(true);
          }
        });

        editor.addEventListener('changed', () => {
          setHasDrawing(true);
        });

        // Set editor configuration
        editor.configuration = editorConfig;
      } catch (error) {
        console.error('Failed to initialize MyScript editor:', error);
      }
    }

    return () => {
      if (editorInstance.current) {
        editorInstance.current.close();
      }
    };
  }, [isEditorLoaded]);

  const clearCanvas = () => {
    if (editorInstance.current) {
      editorInstance.current.clear();
      setHasDrawing(false);
      setLatexResult('');
    }
  };

  const completeDrawing = () => {
    if (hasDrawing && latexResult) {
      onDrawingComplete(latexResult);
    }
  };

  return (
    <div className="w-full">
      <div className="glass-card rounded-xl overflow-hidden relative">
        <div className="aspect-[4/3] bg-white relative">
          {!isEditorLoaded ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div 
              ref={editorRef} 
              className="h-full w-full myscript-editor"
              style={{ touchAction: 'none' }}
            />
          )}
          
          <div className="absolute top-0 left-0 right-0 p-4 text-center">
            <div className="inline-block px-3 py-1 bg-blue-50 rounded-full text-blue-600 text-sm">
              Draw your equation here
            </div>
          </div>
          
          {latexResult && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-4">
              <p className="text-white font-mono">
                LaTeX: <span className="text-primary">{latexResult}</span>
              </p>
            </div>
          )}
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

export default MathScriptCanvas;
