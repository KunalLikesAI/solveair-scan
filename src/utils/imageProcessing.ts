
import { createWorker } from 'tesseract.js';

/**
 * Pre-processes an image for better OCR results
 * Converts to black and white with high contrast
 */
export const preprocessImage = async (imageData: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Create canvas for image processing
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        console.error('Could not get canvas context');
        resolve(imageData);
        return;
      }
      
      // Set canvas dimensions
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Get image data for manipulation
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      
      // Apply high contrast black and white filter with adaptive thresholding
      const getAdaptiveThreshold = (i: number, width: number, range: number = 9) => {
        let sum = 0;
        let count = 0;
        
        // Calculate average of surrounding pixels
        for (let y = -range; y <= range; y++) {
          for (let x = -range; x <= range; x++) {
            const pixelIndex = i + (y * width + x) * 4;
            if (pixelIndex >= 0 && pixelIndex < data.length) {
              sum += (data[pixelIndex] + data[pixelIndex + 1] + data[pixelIndex + 2]) / 3;
              count++;
            }
          }
        }
        
        return count > 0 ? (sum / count) - 10 : 128; // Subtract 10 to make it more sensitive
      };
      
      // Process each pixel with adaptive thresholding
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        const threshold = getAdaptiveThreshold(i, canvas.width * 4, 5);
        const newValue = avg > threshold ? 255 : 0;
        
        data[i] = newValue;     // R
        data[i + 1] = newValue; // G
        data[i + 2] = newValue; // B
      }
      
      // Optional: Apply noise reduction
      // Simple despeckle filter (remove isolated pixels)
      for (let y = 1; y < canvas.height - 1; y++) {
        for (let x = 1; x < canvas.width - 1; x++) {
          const idx = (y * canvas.width + x) * 4;
          const surroundingWhite = 
            data[idx - canvas.width * 4] === 255 && // top
            data[idx + canvas.width * 4] === 255 && // bottom
            data[idx - 4] === 255 && // left
            data[idx + 4] === 255;   // right
          
          // If pixel is black but surrounded by white, make it white (remove noise)
          if (data[idx] === 0 && surroundingWhite) {
            data[idx] = 255;
            data[idx + 1] = 255;
            data[idx + 2] = 255;
          }
        }
      }
      
      // Put processed image data back to canvas
      ctx.putImageData(imgData, 0, 0);
      
      // Return processed image as data URL
      resolve(canvas.toDataURL('image/png'));
    };
    
    img.src = imageData;
  });
};

/**
 * Extract mathematical text from an image using Tesseract.js
 */
export const extractMathEquation = async (imageData: string): Promise<string> => {
  try {
    console.log('Preprocessing image for OCR...');
    const processedImage = await preprocessImage(imageData);
    
    console.log('Creating Tesseract worker...');
    const worker = await createWorker({
      logger: progress => {
        console.log('OCR Progress:', progress);
      }
    });
    
    console.log('Loading OCR model...');
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    
    // Configure Tesseract for math recognition
    await worker.setParameters({
      tessedit_char_whitelist: '0123456789+-*/()=xyzabcXYZ√^.<>≤≥∫∑∏![]{}',
      tessjs_create_hocr: '0',
      tessjs_create_tsv: '0',
      tessjs_create_box: '0',
      tessjs_create_unlv: '0',
      tessjs_create_osd: '0',
    });
    
    console.log('Recognizing text...');
    const { data } = await worker.recognize(processedImage);
    
    console.log('OCR completed. Result:', data.text);
    
    // Clean up the recognized text
    let equation = data.text
      .replace(/\s+/g, '') // Remove all whitespace
      .replace(/[^\d+\-*/()=xyzXYZ√^.<>≤≥∫∑∏![\]{}]/g, ''); // Keep only math symbols
    
    // If equation is empty or too short, return default
    if (!equation || equation.length < 2) {
      equation = '0=0';
    }
    
    await worker.terminate();
    return equation;
  } catch (error) {
    console.error('OCR Error:', error);
    return '0=0'; // Default fallback
  }
};
