import { useState, useEffect, ReactNode } from 'react';

interface GlitchTextProps {
  children: ReactNode;
  text?: string;
  intensity?: 'subtle' | 'medium' | 'intense';
  component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div' | 'p';
  className?: string;
  triggerProbability?: number; // 0-1 chance of triggering on interval
  triggerInterval?: number; // ms
}

export default function GlitchText({
  children,
  text,
  intensity = 'subtle',
  component: Component = 'span',
  className = '',
  triggerProbability = 0.3, // 30% chance by default
  triggerInterval = 6000, // Every 6 seconds by default
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const displayText = text || (typeof children === 'string' ? children : '');
  
  // Choose appropriate class based on intensity
  const getGlitchClass = () => {
    if (isGlitching) {
      switch (intensity) {
        case 'subtle':
          return 'glitch-heading glitch-active';
        case 'medium':
          return 'glitch-text-layers glitch-text-active';
        case 'intense':
          return 'glitch-heading glitch-active glitch-text-layers glitch-text-active';
        default:
          return 'glitch-heading glitch-active';
      }
    } else {
      switch (intensity) {
        case 'subtle':
          return 'glitch-heading';
        case 'medium':
          return 'glitch-text-layers';
        case 'intense':
          return 'glitch-heading glitch-text-layers';
        default:
          return 'glitch-heading';
      }
    }
  };
  
  useEffect(() => {
    // Function to randomly trigger glitch effect
    const triggerGlitch = () => {
      if (Math.random() < triggerProbability) {
        setIsGlitching(true);
        
        // Reset glitch after a short duration
        setTimeout(() => {
          setIsGlitching(false);
        }, Math.random() * 600 + 400); // Random duration between 400-1000ms
      }
    };
    
    // Set interval to periodically check if glitch should be triggered
    const intervalId = setInterval(triggerGlitch, triggerInterval);
    
    // Clean up interval on unmount
    return () => clearInterval(intervalId);
  }, [triggerProbability, triggerInterval]);
  
  return (
    <Component 
      className={`${getGlitchClass()} ${className}`}
      data-text={displayText}
    >
      {children}
    </Component>
  );
} 