import { useState, useEffect, ReactNode } from 'react';

interface GlitchTextProps {
  children: ReactNode;
  text?: string;
  intensity?: 'subtle' | 'medium' | 'intense';
  component?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'div' | 'p';
  className?: string;
  triggerProbability?: number; // 0-1 chance of triggering on interval
  triggerInterval?: number; // ms
  disabled?: boolean; // New prop to disable glitch effect
}

export default function GlitchText({
  children,
  text,
  intensity = 'subtle',
  component: Component = 'span',
  className = '',
  triggerProbability = 0.3, // 30% chance by default
  triggerInterval = 6000, // Every 6 seconds by default
  disabled = false, // Default to enabled
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const displayText = text || (typeof children === 'string' ? children : '');
  
  // Choose appropriate class based on intensity
  const getGlitchClass = () => {
    if (disabled) {
      return className; // Return only the base className if disabled
    }
    
    if (isGlitching) {
      switch (intensity) {
        case 'subtle':
          return `glitch-heading glitch-active ${className}`;
        case 'medium':
          return `glitch-text-layers glitch-text-active ${className}`;
        case 'intense':
          return `glitch-heading glitch-active glitch-text-layers glitch-text-active ${className}`;
        default:
          return `glitch-heading glitch-active ${className}`;
      }
    } else {
      switch (intensity) {
        case 'subtle':
          return `glitch-heading ${className}`;
        case 'medium':
          return `glitch-text-layers ${className}`;
        case 'intense':
          return `glitch-heading glitch-text-layers ${className}`;
        default:
          return `glitch-heading ${className}`;
      }
    }
  };
  
  useEffect(() => {
    if (disabled) return; // Don't set up glitch effect if disabled
    
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
  }, [triggerProbability, triggerInterval, disabled]);
  
  return (
    <Component 
      className={getGlitchClass()}
      data-text={displayText}
    >
      {children}
    </Component>
  );
} 