import { ReactNode } from 'react';

interface RetroFrameProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'dark';
}

export default function RetroFrame({ 
  children, 
  className = '',
  variant = 'default'
}: RetroFrameProps) {
  // Determine background color based on variant
  const bgColor = variant === 'dark' ? 'bg-cyberpunk-black/80' : 'bg-gunmetal/80';
  
  return (
    <div className={`relative p-1 ${className}`}>
      {/* Border design */}
      <div className="absolute inset-0 bg-gradient-to-r from-dusty-pink via-light-purple to-dusty-pink opacity-50" />
      <div className="absolute inset-0 bg-gradient-to-b from-dusty-pink via-light-purple to-dusty-pink opacity-50" />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-dusty-pink" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-dusty-pink" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-dusty-pink" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-dusty-pink" />
      
      {/* Content */}
      <div className={`relative ${bgColor} backdrop-blur-sm p-4`}>
        {children}
      </div>
    </div>
  );
}