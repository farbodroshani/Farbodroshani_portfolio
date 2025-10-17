import { useEffect, useState } from 'react';
import { Routes, Route, useLocation, Link } from 'react-router-dom';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import SpaceGame from './components/SpaceGame';
import Bio from './components/Bio';
import ProjectCarousel from './components/ProjectCarousel';
import LoadingScreen from './components/LoadingScreen';
import EffectsProvider from './components/EffectsProvider';
import Footer from './components/Footer';
import Artifacts from './components/Artifacts';
import Contact from './components/Contact';
import NeonRain from './components/NeonRain';
import './styles/effects.css';
import '@fontsource/bodoni-moda/700';
import '@fontsource/inter/400';
import '@fontsource/vt323';
import { Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GlitchText from './components/GlitchText';

// Home page content
function HomePage() {
  return (
    <>
      <Hero />
      
      {/* Bio section with custom very transparent backdrop */}
      <div className="custom-bio-backdrop">
        <Bio />
      </div>
      
      {/* Projects carousel with VHS aesthetic */}
      <ProjectCarousel />
      
      {/* Game section with custom very transparent backdrop */}
      <div className="custom-game-backdrop">
        <SpaceGame />
      </div>
    </>
  );
}


// Dragon Combat page content
function DragonCombatPage() {
  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-5xl mx-auto px-4">
        <h1 className="font-vt323 text-5xl md:text-6xl text-center mb-8 text-neon-cyan glow-text-cyan">
          <GlitchText intensity="intense" triggerProbability={0.3} triggerInterval={4000}>
            DRAGON_COMBAT
          </GlitchText>
        </h1>
        <div className="h-[2px] bg-gradient-to-r from-transparent via-neon-pink to-transparent mb-12"></div>
        
        {/* Game component with dedicated layout */}
        <div className="game-container relative">
          <div className="grid-overlay absolute inset-0"></div>
          <div className="game-wrapper bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-neon-cyan shadow-[0_0_15px_rgba(0,255,255,0.3)]">
            <SpaceGame />
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // State for loading screen
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("SYSTEM BOOTING");
  
  // Listen for route changes to show loading screen
  useEffect(() => {
    const handleRouteChange = () => {
      // Determine loading text based on destination
      let text = "LOADING";
      switch (location.pathname) {
        case '/':
          text = "INITIALIZING HOME SEQUENCE";
          break;
        case '/projects':
          text = "RETRIEVING ARTIFACTS";
          break;
        case '/game':
          text = "LOADING DRAGON_COMBAT";
          break;
        case '/artifacts':
          text = "ACCESSING ARTIFACT VAULT";
          break;
        case '/contact':
          text = "INITIALIZING CONTACT UPLINK";
          break;
        default:
          text = "SYSTEM BOOTING";
      }
      
      setLoadingText(text);
      setIsLoading(true);
    };
    
    handleRouteChange();
    
    return () => {}; // Cleanup
  }, [location.pathname]);
  
  // Handle loading completion
  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <EffectsProvider>
      <div className="bg-cyberpunk-black min-h-screen text-white flex flex-col">
        {/* Background effects and floating symbols */}
        <div className="fixed inset-0 pointer-events-none">
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

          {/* Visual effects */}
          <div className="grain animate-grain" />
          <div className="scanline animate-scanline" />
          <div className="grid-lines" />
          <div className="lightning-effect lightning-left" />
          <div className="lightning-effect lightning-right" />
        </div>

        {/* Main content wrapper */}
        <div className="flex flex-col min-h-screen">
          {/* Navigation */}
          <Navbar />
          
          {/* Floating Home Button */}
          {!isHomePage && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 500, 
                damping: 30,
                delay: 0.5 
              }}
              className="fixed bottom-4 right-4 z-40"
            >
              <Link 
                to="/" 
                className="flex items-center justify-center w-12 h-12 rounded-full bg-cyberpunk-black border-2 border-neon-pink shadow-lg hover:bg-neon-pink transition-all duration-300 group"
                aria-label="Return to home"
              >
                <Home 
                  size={24} 
                  className="text-neon-cyan group-hover:text-cyberpunk-black transition-colors" 
                />
              </Link>
            </motion.div>
          )}
          
          {/* Loading Screen */}
          <AnimatePresence>
            {isLoading && (
              <LoadingScreen
                onLoadingComplete={handleLoadingComplete}
                loadingText={loadingText}
              />
            )}
          </AnimatePresence>
          
          {/* Main content with routes */}
          <AnimatePresence mode="wait">
            {!isLoading && (
              <main className="flex-grow">
                <Routes location={location} key={location.pathname}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/projects" element={<ProjectCarousel />} />
                  <Route path="/game" element={<DragonCombatPage />} />
                  <Route path="/artifacts" element={<Artifacts />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
            )}
          </AnimatePresence>

          {/* Footer */}
          <Footer />
        </div>

        {/* Neon Rain Effect */}
        <NeonRain />
      </div>
    </EffectsProvider>
  );
}

export default App;
