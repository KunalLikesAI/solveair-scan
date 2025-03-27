
import React from 'react';
import TestimonialCard from './TestimonialCard';

const testimonials = [
  {
    quote: "SolveAir has been a game-changer for helping my students visualize and solve complex equations. The scanning feature saves so much time!",
    author: "Sarah Johnson",
    role: "Math Teacher",
    rating: 5
  },
  {
    quote: "As an engineering student, I deal with complex equations daily. The drawing feature is intuitive and the step-by-step solutions help me understand concepts better.",
    author: "Michael Chen",
    role: "Engineering Student",
    rating: 5
  },
  {
    quote: "I've tried many math solver apps, but SolveAir's accuracy and clear explanations are unmatched. It's become an essential tool for my studies.",
    author: "Emma Rodriguez",
    role: "High School Student",
    rating: 4
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">What Users Say</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover how SolveAir is helping students, teachers, and professionals solve math problems with ease.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index}
              quote={testimonial.quote}
              author={testimonial.author}
              role={testimonial.role}
              rating={testimonial.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
