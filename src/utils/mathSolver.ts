
// This is a mock implementation of a math solver API
// In a real application, this would connect to an actual math solving service or AI API

export interface SolveResult {
  equation: string;
  solution: string;
  steps: string[];
}

// Mock function to simulate equation solving
export const solveEquation = async (equation: string): Promise<SolveResult> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Basic equation parser and solver (DEMO ONLY)
  const sanitizedEquation = equation.replace(/\s+/g, '');
  let solution = '';
  let steps: string[] = [];
  
  // For demo purposes, we'll handle a few equation types
  if (sanitizedEquation.includes('=')) {
    // Linear equation, e.g., 2x+5=13
    if (sanitizedEquation.match(/\d*x[\+\-\*\/]?\d+\=\d+/) || 
        sanitizedEquation.match(/\d+[\+\-\*\/]?\d*x\=\d+/)) {
      
      // Very simplified solver just for demo
      try {
        const sides = sanitizedEquation.split('=');
        const rightSide = parseFloat(sides[1]);
        
        // Extract coefficient and constant from left side
        const leftSide = sides[0];
        let coefficient = 1;
        let constant = 0;
        
        if (leftSide.includes('x+')) {
          coefficient = leftSide.split('x+')[0] ? parseFloat(leftSide.split('x+')[0]) : 1;
          constant = parseFloat(leftSide.split('x+')[1]);
        } else if (leftSide.includes('x-')) {
          coefficient = leftSide.split('x-')[0] ? parseFloat(leftSide.split('x-')[0]) : 1;
          constant = -parseFloat(leftSide.split('x-')[1]);
        } else if (leftSide.includes('x')) {
          coefficient = leftSide.split('x')[0] ? parseFloat(leftSide.split('x')[0]) : 1;
        } else if (leftSide.includes('+x')) {
          constant = parseFloat(leftSide.split('+x')[0]);
          coefficient = 1;
        } else if (leftSide.includes('-x')) {
          constant = parseFloat(leftSide.split('-x')[0]);
          coefficient = -1;
        }
        
        solution = `x = ${((rightSide - constant) / coefficient).toFixed(2)}`;
        steps = [
          `Start with the equation: ${sanitizedEquation}`,
          `Isolate the variable term on the left: ${coefficient}x = ${rightSide} - ${constant}`,
          `Subtract ${constant} from both sides: ${coefficient}x = ${rightSide - constant}`,
          `Divide both sides by ${coefficient}: x = ${((rightSide - constant) / coefficient).toFixed(2)}`
        ];
      } catch (e) {
        solution = "Couldn't parse this equation format";
        steps = ["Try a different equation format or check your input"];
      }
    } 
    // Quadratic equation, e.g., x^2+5x+6=0
    else if (sanitizedEquation.match(/x\^2[\+\-]\d+x[\+\-]\d+\=0/) ||
             sanitizedEquation.match(/\d+x\^2[\+\-]\d+x[\+\-]\d+\=0/)) {
      
      try {
        // Very basic parser for quadratic equations (for demo)
        const sides = sanitizedEquation.split('=');
        if (sides[1] !== '0') {
          throw new Error('Please rewrite the equation with 0 on the right side');
        }
        
        let a = 1, b = 0, c = 0;
        const leftSide = sides[0];
        
        // Extremely simplified coefficient extraction (just for demo)
        if (leftSide.includes('x^2')) {
          a = leftSide.split('x^2')[0] ? parseFloat(leftSide.split('x^2')[0]) : 1;
          
          const rest = leftSide.split('x^2')[1];
          if (rest.includes('x')) {
            b = rest.startsWith('+') ? 
              parseFloat(rest.split('+')[1].split('x')[0]) : 
              -parseFloat(rest.split('-')[1].split('x')[0]);
            
            c = rest.split('x')[1].startsWith('+') ?
              parseFloat(rest.split('x')[1].split('+')[1]) :
              -parseFloat(rest.split('x')[1].split('-')[1]);
          }
        }
        
        // Calculate discriminant
        const discriminant = b * b - 4 * a * c;
        
        steps = [
          `Standard form: ${a}x^2 + ${b}x + ${c} = 0`,
          `Using the quadratic formula: x = (-b ± √(b² - 4ac)) / 2a`,
          `a = ${a}, b = ${b}, c = ${c}`,
          `Discriminant = b² - 4ac = ${b}² - 4(${a})(${c}) = ${discriminant}`
        ];
        
        if (discriminant < 0) {
          solution = `No real solutions (discriminant < 0)`;
          steps.push(`Since discriminant < 0, there are no real solutions`);
        } else if (discriminant === 0) {
          const x = -b / (2 * a);
          solution = `x = ${x}`;
          steps.push(`x = ${-b} / (2 * ${a}) = ${x}`);
        } else {
          const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
          const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
          solution = `x₁ = ${x1.toFixed(2)}, x₂ = ${x2.toFixed(2)}`;
          steps.push(`x₁ = (${-b} + √${discriminant}) / ${2 * a} = ${x1.toFixed(2)}`);
          steps.push(`x₂ = (${-b} - √${discriminant}) / ${2 * a} = ${x2.toFixed(2)}`);
        }
      } catch (e) {
        solution = "Couldn't parse this quadratic equation";
        steps = ["Try a different equation format or check your input"];
      }
    } else {
      // Generic response for unsupported equation types
      solution = "Equation type not supported in demo";
      steps = [
        "This is a demo with limited equation solving capabilities.",
        "Try a simple linear equation like '2x+5=13' or a quadratic equation like 'x^2+5x+6=0'"
      ];
    }
  } 
  // Expressions like 2+3*4
  else if (/[\d\+\-\*\/\(\)\^]+/.test(sanitizedEquation)) {
    try {
      // WARNING: eval is used here only for demo purposes
      // In a real app, you should use a proper math expression parser
      const result = Function('"use strict";return (' + sanitizedEquation + ')')();
      solution = result.toString();
      
      steps = [
        `Evaluate the expression: ${sanitizedEquation}`,
        `Apply order of operations (PEMDAS)`,
        `Result: ${solution}`
      ];
    } catch (e) {
      solution = "Couldn't evaluate this expression";
      steps = ["Check the syntax of your expression"];
    }
  } else {
    solution = "Unrecognized format";
    steps = ["Please enter a valid mathematical equation or expression"];
  }
  
  return {
    equation: equation,
    solution: solution,
    steps: steps
  };
};

// Process image (mock function)
export const processEquationImage = async (imageData: string): Promise<string> => {
  // In a real application, this would send the image to an OCR service
  // For the demo, we'll just return a sample equation
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Randomly return different sample equations for demo purposes
  const samples = [
    '2x+5=13',
    'x^2+5x+6=0',
    '3x-7=8',
    'x^2-4=0'
  ];
  
  return samples[Math.floor(Math.random() * samples.length)];
};
