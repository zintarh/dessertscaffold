"use client";
import { useEffect, useState } from 'react';

interface PageAnimationProps {
  children: React.ReactNode;
}

export default function PageAnimation({ children }: PageAnimationProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div 
      className={`transition-all duration-1200 ease-out ${
        isLoaded 
          ? 'opacity-100 transform translate-y-0' 
          : 'opacity-0 transform translate-y-12'
      }`}
    >
      <div className="animate-fade-in">
        {children}
      </div>
    </div>
  );
}
