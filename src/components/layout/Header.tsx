
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calculator, Camera, PenTool } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-4 px-6 sm:px-8 flex items-center justify-between border-b border-gray-100 backdrop-blur-md bg-white/70 fixed top-0 left-0 right-0 z-50">
      <Link to="/" className="flex items-center space-x-2 text-primary font-medium">
        <Calculator className="h-5 w-5" />
        <span className="text-xl font-semibold tracking-tight">SolveAir</span>
      </Link>
      
      <nav className="hidden md:flex items-center space-x-8">
        <Link to="/" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
          Home
        </Link>
        <Link to="/scan" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
          Scan & Solve
        </Link>
        <Link to="/draw" className="text-sm font-medium text-gray-700 hover:text-primary transition-colors">
          Draw Math
        </Link>
      </nav>
      
      <div className="flex items-center space-x-3">
        <Link to="/scan">
          <Button variant="outline" size="sm" className="flex items-center space-x-1 h-9">
            <Camera className="h-4 w-4 mr-1" />
            <span>Scan</span>
          </Button>
        </Link>
        <Link to="/draw">
          <Button size="sm" className="flex items-center space-x-1 h-9">
            <PenTool className="h-4 w-4 mr-1" />
            <span>Draw</span>
          </Button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
