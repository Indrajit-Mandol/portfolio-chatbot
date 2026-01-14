'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, Sparkles, Code, Brain } from 'lucide-react';

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const roles = ['AI Engineer', 'Full Stack Developer', 'MLOps Specialist', 'Open Source Contributor'];

  useEffect(() => {
    const interval = setInterval(() => {
      setTextIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const scrollToAbout = () => {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50" />
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      
      <div className="section-container relative z-10 text-center">
        <div className="inline-flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-6">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">AI-Powered Portfolio</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
          Swoyam Siddharth
          <span className="block text-blue-600 mt-2">Nayak</span>
        </h1>
        
        <div className="h-12 mb-8">
          <div className="text-2xl md:text-3xl text-gray-700 font-medium transition-all duration-500">
            <span className="inline-flex items-center">
              <Brain className="w-8 h-8 mr-3 text-blue-500" />
              {roles[textIndex]}
            </span>
          </div>
        </div>
        
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
          Building India's sovereign AI at Sarvam AI | Former AI Intern at Oracle NetSuite | 
          Passionate about creating intelligent systems that solve real-world problems
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            Let's Collaborate
          </button>
          <button
            onClick={() => document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-white text-blue-600 px-8 py-3 rounded-full text-lg font-medium border-2 border-blue-600 hover:bg-blue-50 transition-colors"
          >
            View Experience
          </button>
        </div>
        
        <div className="flex justify-center space-x-8 text-gray-500">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">2+</div>
            <div className="text-sm">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">50+</div>
            <div className="text-sm">Projects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">10+</div>
            <div className="text-sm">Hackathons</div>
          </div>
        </div>
        
        <button
          onClick={scrollToAbout}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
          aria-label="Scroll down"
        >
          <ArrowDown className="w-6 h-6 text-gray-400" />
        </button>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000" />
    </section>
  );
}