
import React from 'react';
import { Calculator, Github, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t border-gray-100 bg-white/80 backdrop-blur-sm py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <div className="flex items-center space-x-2 text-primary font-medium mb-4">
              <Calculator className="h-5 w-5" />
              <span className="text-xl font-semibold tracking-tight">AIRMATH</span>
            </div>
            <p className="text-gray-500 text-sm">
              Solve math problems using camera scanning or drawing equations in the air.
              Powered by advanced AI for accurate solutions.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Features</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/scan" className="text-gray-500 hover:text-primary text-sm transition-colors">
                  Scan & Solve
                </Link>
              </li>
              <li>
                <Link to="/draw" className="text-gray-500 hover:text-primary text-sm transition-colors">
                  Draw Math
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-primary text-sm transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} AIRMATH. All rights reserved.
          </p>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
              <span className="sr-only">Github</span>
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500 transition-colors">
              <span className="sr-only">Twitter</span>
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
