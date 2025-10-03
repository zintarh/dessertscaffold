"use client";
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  animationType?: 'fadeInUp' | 'fadeInLeft' | 'fadeInRight' | 'fadeIn' | 'scaleIn';
  delay?: number;
  duration?: number;
  className?: string;
}

export default function AnimatedSection({ 
  children, 
  animationType = 'fadeInUp',
  delay = 0,
  duration = 800,
  className = ''
}: AnimatedSectionProps) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    triggerOnce: true
  });

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all ease-out';
    
    if (!isVisible) {
      switch (animationType) {
        case 'fadeInUp':
          return `${baseClasses} opacity-0 translate-y-8`;
        case 'fadeInLeft':
          return `${baseClasses} opacity-0 -translate-x-8`;
        case 'fadeInRight':
          return `${baseClasses} opacity-0 translate-x-8`;
        case 'fadeIn':
          return `${baseClasses} opacity-0`;
        case 'scaleIn':
          return `${baseClasses} opacity-0 scale-95`;
        default:
          return `${baseClasses} opacity-0 translate-y-8`;
      }
    }
    
    switch (animationType) {
      case 'fadeInUp':
        return `${baseClasses} opacity-100 translate-y-0`;
      case 'fadeInLeft':
        return `${baseClasses} opacity-100 translate-x-0`;
      case 'fadeInRight':
        return `${baseClasses} opacity-100 translate-x-0`;
      case 'fadeIn':
        return `${baseClasses} opacity-100`;
      case 'scaleIn':
        return `${baseClasses} opacity-100 scale-100`;
      default:
        return `${baseClasses} opacity-100 translate-y-0`;
    }
  };

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${getAnimationClasses()} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
}
