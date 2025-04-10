import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LoadingScreenProps {
  onLoadingComplete?: () => void;
  loadingText?: string;
}

export default function LoadingScreen({ onLoadingComplete, loadingText = "SYSTEM BOOTING" }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING");
  
  useEffect(() => {
    const statusMessages = [
      "INITIALIZING",
      "LOADING CORE MODULES",
      "ESTABLISHING CONNECTION",
      "RENDERING INTERFACE",
      "FINALIZING"
    ];
    
    // Simulate loading progress with faster speed
    let currentProgress = 0;
    const interval = setInterval(() => {
      if (currentProgress >= 100) {
        clearInterval(interval);
        if (onLoadingComplete) onLoadingComplete();
        return;
      }
      
      // Larger increments for faster loading
      const increment = Math.floor(Math.random() * 10) + 5;
      currentProgress = Math.min(currentProgress + increment, 100);
      setProgress(currentProgress);
      
      // Update status message at certain progress points
      const messageIndex = Math.floor(currentProgress / (100 / statusMessages.length));
      setStatusText(statusMessages[Math.min(messageIndex, statusMessages.length - 1)]);
    }, 80); // Shorter interval time
    
    return () => clearInterval(interval);
  }, [onLoadingComplete]);
  
  return (
    <motion.div 
      className="loading-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loading-text glitch-text">{loadingText}</div>
      
      <div className="loading-bar-container">
        <div 
          className="loading-bar"
          style={{ width: `${progress}%` }}
        />
        <div className="loading-status">
          {statusText} [{progress}%]
        </div>
      </div>
      
      {/* Retro scanlines and visual effects */}
      <div className="scanline" />
      <div className="grain animate-grain" />
      
      {/* Random binary data in background */}
      <div className="binary-background">
        {Array.from({ length: 20 }).map((_, index) => (
          <div 
            key={index}
            className="binary-line"
            style={{ 
              left: `${Math.random() * 100}%`, 
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.4 + 0.1,
              animationDuration: `${Math.random() * 5 + 3}s`
            }}
          >
            {Array.from({ length: 16 }).map(() => 
              Math.random() > 0.5 ? '1' : '0'
            ).join('')}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// Add this CSS to your effects.css file
/*
.binary-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.binary-line {
  position: absolute;
  font-family: 'VT323', monospace;
  font-size: 12px;
  color: rgba(0, 255, 255, 0.3);
  animation: binary-float linear infinite;
  white-space: nowrap;
}

@keyframes binary-float {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50px);
  }
}

.glitch-text {
  position: relative;
  animation: glitch 2s infinite;
}

@keyframes glitch {
  0%, 90%, 100% {
    transform: translate(0);
    text-shadow: 0 0 8px rgba(0, 255, 255, 0.8);
  }
  91% {
    transform: translate(-2px, 1px);
    text-shadow: -2px 0 red;
  }
  93% {
    transform: translate(2px, -1px);
    text-shadow: 2px 0 blue;
  }
  95% {
    transform: translate(-2px, -1px);
    text-shadow: 2px 0 green;
  }
  97% {
    transform: translate(2px, 1px);
    text-shadow: -2px 0 yellow;
  }
}
*/ 