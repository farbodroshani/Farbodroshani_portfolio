import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RetroFrame from './RetroFrame';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import GlitchText from './GlitchText';

// Project data
const projects = [
  {
    title: "Cosmic Fortune",
    description: "Interactive fortune-telling experience",
    details: "A mystical web application that provides cosmic insights and fortune readings. Built with modern web technologies and featuring an engaging user interface.",
    imageUrl: "https://cosmicfortune.netlify.app/",
    year: "2025",
    link: "https://cosmicfortune.netlify.app/"
  },
  {
    title: "Quantum Chat",
    description: "Real-time messaging app with end-to-end encryption",
    details: "Built with React, Firebase, and WebRTC. Features include video calls, file sharing, and disappearing messages.",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    year: "2023",
    link: "#"
  },
  {
    title: "Neural Canvas",
    description: "AI-powered digital art creation platform",
    details: "Leverages machine learning to transform text prompts into stunning visual art. Built with Python, React, and TensorFlow.",
    imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4",
    year: "2022",
    link: "#"
  },
  {
    title: "Cyber Beats",
    description: "Synthesizer and music production suite",
    details: "A browser-based music studio with virtual instruments, beat sequencing, and live performance capabilities.",
    imageUrl: "https://images.unsplash.com/photo-1635070036544-40c0b66b2e34",
    year: "2021",
    link: "#"
  }
];

export default function ProjectCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rewindEffect, setRewindEffect] = useState(false);
  
  // Navigation functions
  const nextProject = () => {
    setRewindEffect(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length);
      setRewindEffect(false);
    }, 500);
  };
  
  const prevProject = () => {
    setRewindEffect(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length);
      setRewindEffect(false);
    }, 500);
  };
  
  // Toggle play state
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Auto-advance carousel when playing
  useEffect(() => {
    let interval: number | undefined;
    
    if (isPlaying) {
      interval = window.setInterval(() => {
        nextProject();
      }, 5000);
    }
    
    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isPlaying, currentIndex]);
  
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <RetroFrame variant="dark">
          <div className="text-center mb-8">
            <h2 className="font-vt323 text-4xl text-neon-cyan mb-4 tracking-widest glow-text-cyan">
              <GlitchText disabled>
                PROJECT ARCHIVE
              </GlitchText>
            </h2>
            <div className="h-[2px] bg-gradient-to-r from-transparent via-neon-pink to-transparent"></div>
          </div>
          
          <div className="relative">
            {/* VHS Display Area */}
            <div className={`relative bg-cyberpunk-black aspect-video rounded-lg overflow-hidden border-2 border-neon-cyan ${rewindEffect ? 'vhs-rewind' : ''}`}>
              <div className="absolute inset-0 scanline pointer-events-none"></div>
              
              {/* VHS Tracking effect */}
              <div className="absolute inset-0 vhs-tracking pointer-events-none"></div>
              
              {/* Color adjustment lines at top */}
              <div className="absolute top-0 left-0 right-0 h-6 flex">
                <div className="w-1/6 h-full bg-white"></div>
                <div className="w-1/6 h-full bg-yellow-400"></div>
                <div className="w-1/6 h-full bg-cyan-500"></div>
                <div className="w-1/6 h-full bg-green-500"></div>
                <div className="w-1/6 h-full bg-pink-500"></div>
                <div className="w-1/6 h-full bg-blue-500"></div>
              </div>
              
              {/* Timecode */}
              <div className="absolute top-8 right-4 bg-black/50 px-2 font-vt323 text-white text-sm">
                00:{currentIndex < 10 ? `0${currentIndex}` : currentIndex}:00
              </div>
              
              {/* Project content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 pt-8 flex flex-col md:flex-row"
                >
                  {/* Project image */}
                  <div className="w-full md:w-1/2 h-full p-4">
                    <div className="relative h-full w-full">
                      <img 
                        src={projects[currentIndex].imageUrl} 
                        alt={projects[currentIndex].title}
                        className="h-full w-full object-cover rounded"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-cyberpunk-black via-transparent to-transparent"></div>
                    </div>
                  </div>
                  
                  {/* Project info */}
                  <div className="w-full md:w-1/2 p-4 flex flex-col text-left">
                    <div className="font-vt323 text-2xl text-neon-pink mb-2 tracking-wider glow-text-pink">
                      {projects[currentIndex].title}
                    </div>
                    <div className="font-vt323 text-neon-cyan mb-4 text-sm">
                      RELEASED: {projects[currentIndex].year}
                    </div>
                    <p className="font-vt323 text-white mb-2">
                      {projects[currentIndex].description}
                    </p>
                    <p className="font-vt323 text-white/70 text-sm mb-4">
                      {projects[currentIndex].details}
                    </p>
                    <a 
                      href={projects[currentIndex].link}
                      className="mt-auto bg-neon-pink/20 hover:bg-neon-pink/40 text-neon-pink font-vt323 py-2 px-4 rounded self-start border border-neon-pink transition-colors"
                    >
                      ACCESS PROJECT
                    </a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* VHS Controls */}
            <div className="mt-6 bg-cyberpunk-black/80 rounded-lg p-4 border border-neon-cyan flex items-center justify-between">
              <button 
                onClick={prevProject}
                className="text-neon-cyan hover:text-neon-pink transition-colors"
                aria-label="Previous project"
              >
                <ChevronLeft size={24} />
              </button>
              
              <div className="flex items-center space-x-4">
                <button 
                  onClick={togglePlay}
                  className={`font-vt323 px-4 py-1 rounded transition-colors ${
                    isPlaying 
                      ? 'bg-neon-pink text-cyberpunk-black' 
                      : 'bg-cyberpunk-black text-neon-pink border border-neon-pink'
                  }`}
                >
                  {isPlaying ? 'PAUSE' : 'PLAY'}
                </button>
                
                <div className="font-vt323 text-neon-green">
                  TAPE {currentIndex + 1} OF {projects.length}
                </div>
              </div>
              
              <button 
                onClick={nextProject}
                className="text-neon-cyan hover:text-neon-pink transition-colors"
                aria-label="Next project"
              >
                <ChevronRight size={24} />
              </button>
            </div>
            
            {/* VHS Label */}
            <div className="absolute -bottom-4 left-8 transform rotate-6 bg-white py-1 px-3 font-bold text-xs text-black uppercase rounded-sm shadow-md">
              VHS-PRO
            </div>
          </div>
        </RetroFrame>
      </div>
    </section>
  );
} 