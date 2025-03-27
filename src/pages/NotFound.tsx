
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import Layout from '@/components/layout/Layout';

const NotFound = () => {
  return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-8xl font-bold text-primary mb-6">404</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Page Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link to="/">
            <Button className="glass-button">
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
