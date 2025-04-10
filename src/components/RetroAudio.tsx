import { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export default function RetroAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    // Create audio context and elements when component mounts
    const audioElement = new Audio();
    audioElement.loop = true;
    audioElement.volume = volume;
    audioElement.src = 'https://cdn.freesound.org/previews/647/647748_5674468-lq.mp3'; // Retro synth ambient sound
    audioRef.current = audioElement;
    
    // Clean up on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Update volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Play/pause audio based on isPlaying state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        // Handle potential play() promise rejection (e.g., on mobile browsers)
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Audio playback was prevented:", error);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);
  
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-cyberpunk-black/80 backdrop-blur-sm p-2 rounded-lg border border-neon-cyan flex items-center space-x-3">
      <button 
        onClick={togglePlay}
        className={`text-neon-cyan hover:text-neon-pink transition-colors p-2 rounded-full ${isPlaying ? 'bg-neon-cyan/20' : ''}`}
        aria-label={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
        title={isPlaying ? "Mute ambient sound" : "Play ambient sound"}
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>
      
      {isPlaying && (
        <div className="flex items-center space-x-2">
          <span className="text-neon-cyan font-vt323 text-xs animate-pulse">SYNTH.FM</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-1 appearance-none bg-neon-cyan/30 rounded-full"
            style={{
              background: `linear-gradient(to right, #0ff ${volume * 100}%, rgba(0, 255, 255, 0.3) ${volume * 100}%)`
            }}
          />
        </div>
      )}
    </div>
  );
} 