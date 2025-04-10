import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, Menu, X, Instagram, Home } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import GlitchText from './GlitchText';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-cyberpunk-black/80 backdrop-blur-sm border-b-2 border-neon-pink">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - now links to home with hover effect */}
          <Link to="/">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.05, textShadow: "0 0 15px #00ffff" }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="font-vt323 text-2xl text-neon-cyan tracking-widest glow-text-cyan cursor-pointer flex items-center gap-2"
            >
              <Home size={20} className="inline-block text-neon-cyan" />
              <GlitchText 
                intensity="subtle" 
                triggerProbability={0.2} 
                triggerInterval={8000}
              >
                DRAGON::COMMAND
              </GlitchText>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLinks />
            <SocialLinks />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-neon-pink hover:text-neon-cyan transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-cyberpunk-black/95 backdrop-blur-sm border-b-2 border-neon-pink"
        >
          <div className="px-4 py-6 space-y-4">
            <div className="flex flex-col space-y-4">
              <NavLinks />
            </div>
            <div className="flex justify-center space-x-6 pt-4 border-t border-neon-pink/20">
              <SocialLinks />
            </div>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

function NavLinks() {
  return (
    <>
      <Link to="/" className="font-vt323 text-lg text-white hover:text-neon-cyan transition-colors tracking-wider nav-link">HOME</Link>
      <Link to="/dimension" className="font-vt323 text-lg text-white hover:text-neon-cyan transition-colors tracking-wider nav-link">
        <GlitchText intensity="subtle" triggerProbability={0.15} triggerInterval={10000}>
          DIMENSION_01
        </GlitchText>
      </Link>
      <Link to="/projects" className="font-vt323 text-lg text-white hover:text-neon-cyan transition-colors tracking-wider nav-link">ARTIFACTS</Link>
      <Link to="/game" className="font-vt323 text-lg text-white hover:text-neon-cyan transition-colors tracking-wider nav-link">DRAGON_COMBAT</Link>
    </>
  );
}

function SocialLinks() {
  return (
    <>
      <a
        href="https://github.com/farbodroshani"
        target="_blank"
        rel="noopener noreferrer"
        className="text-neon-cyan hover:text-neon-pink transition-colors social-icon"
      >
        <Github size={20} />
      </a>
      <a
        href="https://instagram.com/farbod.roshanii"
        target="_blank"
        rel="noopener noreferrer"
        className="text-neon-cyan hover:text-neon-pink transition-colors social-icon"
      >
        <Instagram size={20} />
      </a>
      <a
        href="https://linkedin.com/in/farbodroshani"
        target="_blank"
        rel="noopener noreferrer"
        className="text-neon-cyan hover:text-neon-pink transition-colors social-icon"
      >
        <Linkedin size={20} />
      </a>
      <a
        href="mailto:farbodroshanii@gmail.com"
        className="text-neon-cyan hover:text-neon-pink transition-colors social-icon"
      >
        <Mail size={20} />
      </a>
    </>
  );
}
