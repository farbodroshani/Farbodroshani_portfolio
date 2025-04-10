import { useEffect, useState, ReactNode } from 'react';

interface EffectsProviderProps {
  children: ReactNode;
}

export default function EffectsProvider({ children }: EffectsProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    // Initialize effects after component mounts
    setIsInitialized(true);
    
    // Set up timer for VHS tracking effect
    const trackingInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of triggering effect
        triggerVHSTracking();
      }
    }, 10000); // Check every 10 seconds
    
    // Set up timer for data transmission effect
    const dataTransmissionInterval = setInterval(() => {
      if (Math.random() > 0.6) { // 40% chance of triggering effect
        triggerDataTransmission();
      }
    }, 15000); // Check every 15 seconds
    
    return () => {
      clearInterval(trackingInterval);
      clearInterval(dataTransmissionInterval);
    };
  }, []);
  
  // Function to trigger VHS tracking effect
  const triggerVHSTracking = () => {
    // Create top tracking line
    const trackingTop = document.createElement('div');
    trackingTop.className = 'vhs-tracking-top';
    document.body.appendChild(trackingTop);
    
    // Create bottom tracking line (optional)
    if (Math.random() > 0.5) {
      const trackingBottom = document.createElement('div');
      trackingBottom.className = 'vhs-tracking-bottom';
      document.body.appendChild(trackingBottom);
      
      // Activate with slight delay for bottom
      setTimeout(() => {
        trackingBottom.classList.add('vhs-tracking-active');
        
        // Remove after animation completes
        setTimeout(() => {
          trackingBottom.remove();
        }, 2500);
      }, 200);
    }
    
    // Activate top tracking
    trackingTop.classList.add('vhs-tracking-active');
    
    // Remove after animation completes
    setTimeout(() => {
      trackingTop.remove();
    }, 2500);
    
    // Add screen distortion effect occasionally
    if (Math.random() > 0.7) {
      const wrapper = document.querySelector('main');
      if (wrapper) {
        wrapper.classList.add('screen-distortion');
        setTimeout(() => {
          wrapper.classList.remove('screen-distortion');
        }, 500);
      }
    }
  };
  
  // Function to trigger data transmission effect
  const triggerDataTransmission = () => {
    // Create data transmission overlay
    const dataTransmission = document.createElement('div');
    dataTransmission.className = 'data-transmission';
    document.body.appendChild(dataTransmission);
    
    // Activate effect
    setTimeout(() => {
      dataTransmission.classList.add('data-transmission-active');
      
      // Remove after animation completes
      setTimeout(() => {
        dataTransmission.remove();
      }, 2000);
    }, 10);
  };
  
  return (
    <>
      {children}
      
      {/* Always present effect containers */}
      <div id="effects-container" className="pointer-events-none"></div>
    </>
  );
} 