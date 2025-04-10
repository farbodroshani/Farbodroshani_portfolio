import { useEffect } from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import ProjectCard from './components/ProjectCard';
import SpaceGame from './components/SpaceGame';
import Bio from './components/Bio';
import './styles/effects.css';
import '@fontsource/bodoni-moda/700';
import '@fontsource/inter/400';
import '@fontsource/vt323';

const projects = [
  {
    title: "Quantum Chat",
    description: "Real-time messaging app with end-to-end encryption",
    imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb",
    link: "#"
  },
  {
    title: "Neural Canvas",
    description: "AI-powered digital art creation platform",
    imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4",
    link: "#"
  },
  {
    title: "Cyber Beats",
    description: "Synthesizer and music production suite",
    imageUrl: "https://images.unsplash.com/photo-1635070036544-40c0b66b2e34",
    link: "#"
  }
];

function App() {
  return (
    <div className="bg-cyberpunk-black min-h-screen text-white">
      {/* Floating Cyberpunk Symbols */}
      <div 
        style={{
          position: 'fixed',
          zIndex: 9999,
          top: '20%',
          left: '10%',
          fontSize: '24px',
          color: '#00FFFF',
          filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.9))',
          pointerEvents: 'none',
          animation: 'floatLeft 15s linear infinite'
        }}
      >
        <span>Δ</span>
      </div>
      
      <div 
        style={{
          position: 'fixed',
          zIndex: 9999,
          bottom: '25%',
          right: '15%',
          fontSize: '24px',
          color: '#FF00FF',
          filter: 'drop-shadow(0 0 10px rgba(255, 0, 255, 0.9))',
          pointerEvents: 'none',
          animation: 'floatRight 20s linear infinite'
        }}
      >
        <span>Ψ</span>
      </div>
      
      <div 
        style={{
          position: 'fixed',
          zIndex: 9999,
          top: '50%',
          left: '5%',
          fontSize: '24px',
          color: '#B76E79',
          filter: 'drop-shadow(0 0 10px rgba(183, 110, 121, 0.9))',
          pointerEvents: 'none',
          animation: 'floatUp 25s linear infinite'
        }}
      >
        <span>Ω</span>
      </div>
      
      <div 
        style={{
          position: 'fixed',
          zIndex: 9999,
          bottom: '10%',
          left: '20%',
          fontSize: '24px',
          color: '#ff00ff',
          filter: 'drop-shadow(0 0 10px rgba(255, 0, 255, 0.9))',
          pointerEvents: 'none',
          animation: 'floatDiagonal 30s linear infinite'
        }}
      >
        <span>Ξ</span>
      </div>

      <div 
        style={{
          position: 'fixed',
          zIndex: 9999,
          top: '30%',
          right: '20%',
          fontSize: '24px',
          color: '#00FF00',
          filter: 'drop-shadow(0 0 10px rgba(0, 255, 0, 0.9))',
          pointerEvents: 'none',
          animation: 'floatDiagonalReverse 22s linear infinite'
        }}
      >
        <span>Λ</span>
      </div>

      <div 
        style={{
          position: 'fixed',
          zIndex: 9999,
          bottom: '15%',
          left: '30%',
          fontSize: '24px',
          color: '#FFFF00',
          filter: 'drop-shadow(0 0 10px rgba(255, 255, 0, 0.9))',
          pointerEvents: 'none',
          animation: 'floatLeft 18s linear infinite'
        }}
      >
        <span>Φ</span>
      </div>

      {/* Film grain effect */}
      <div className="grain animate-grain" />
      
      {/* Scanline effect */}
      <div className="scanline animate-scanline" />
      
      {/* Grid lines effect */}
      <div className="grid-lines" />
      
      {/* Lightning effects */}
      <div className="lightning-effect lightning-left" />
      <div className="lightning-effect lightning-right" />
      
      {/* Navigation */}
      <Navbar />
      
      {/* Main content */}
      <main className="relative">
        <Hero />
        
        {/* Bio section with custom very transparent backdrop */}
        <div className="custom-bio-backdrop">
          <Bio />
        </div>
        
        {/* Game section with custom very transparent backdrop */}
        <div className="custom-game-backdrop">
          <SpaceGame />
        </div>
        
        {/* Portfolio section */}
        <section className="py-20 px-4 bg-gradient-to-b from-cyberpunk-dark to-cyberpunk-darker">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-vt323 text-4xl text-neon-cyan mb-12 text-center glow-text tracking-widest">
              CYBER MODULES
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <ProjectCard key={index} {...project} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
