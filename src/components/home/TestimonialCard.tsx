
import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  rating: number;
  image?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  quote, 
  author, 
  role, 
  rating,
  image 
}) => {
  return (
    <div className="glass-card rounded-xl p-6 h-full flex flex-col transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center space-x-1 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
          />
        ))}
      </div>
      
      <blockquote className="text-gray-700 dark:text-gray-300 mb-6 flex-grow">
        "{quote}"
      </blockquote>
      
      <div className="flex items-center mt-auto">
        {image ? (
          <img 
            src={image} 
            alt={author} 
            className="w-10 h-10 rounded-full object-cover mr-3" 
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-3">
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              {author.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{author}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
