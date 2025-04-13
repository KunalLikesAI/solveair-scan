
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
      
      // Apply high contrast black and white filter
      for (let i = 0; i < data.length; i += 4) {
        const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
        // Adjust threshold for better contrast
        const threshold = 140;
        const newValue = avg > threshold ? 255 : 0;
        
        data[i] = newValue;     // R
        data[i + 1] = newValue; // G
        data[i + 2] = newValue; // B
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
      tessedit_char_whitelist: '0123456789+-*/()=xyzabcXYZ√^.<>≤≥∫∑∏!',
    });
    
    console.log('Recognizing text...');
    const { data } = await worker.recognize(processedImage);
    
    console.log('OCR completed. Result:', data.text);
    
    // Clean up the recognized text
    let equation = data.text
      .replace(/\s+/g, '') // Remove all whitespace
      .replace(/[^\d+\-*/()=xyzXYZ√^.<>≤≥∫∑∏!]/g, ''); // Keep only math symbols
    
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
