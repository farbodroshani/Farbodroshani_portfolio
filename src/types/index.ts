// Component Props Interfaces
export interface GlitchTextProps {
  text: string;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export interface RetroFrameProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export interface NeonRainProps {
  isActive?: boolean;
  onToggle?: (isActive: boolean) => void;
}

export interface SpaceGameProps {
  onGameOver?: (score: number) => void;
  onGameStart?: () => void;
}

export interface TerminalProps {
  commands: Record<string, () => void>;
  initialMessage?: string;
}

// State Interfaces
export interface GameState {
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export interface RainDrop {
  id: number;
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

// Error Handling Types
export interface AppError {
  code: string;
  message: string;
  component: string;
  timestamp: Date;
}

// Analytics Types
export interface AnalyticsEvent {
  name: string;
  category: string;
  label?: string;
  value?: number;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: AppError;
  success: boolean;
}

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_GA_MEASUREMENT_ID?: string;
  }
} 