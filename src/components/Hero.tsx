import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import GlitchText from './GlitchText';

export default function Hero() {
  
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 pb-24">
      <div className="absolute inset-0 z-0">
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        
        {/* Abstract shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-cyan/20 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-neon-pink/20 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="container px-4 z-10">
        <motion.div 
          className="text-center max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-vt323 text-6xl md:text-8xl text-neon-cyan tracking-widest glow-text-cyan mb-4">
            <GlitchText intensity="intense" triggerProbability={0.4} triggerInterval={3500}>
              FARBOD ROSHANI
            </GlitchText>
          </h1>
          
          <h2 className="font-bodoni-moda text-2xl md:text-3xl text-white/90 mb-8">
            <GlitchText intensity="subtle" triggerProbability={0.2} triggerInterval={7000}>
              CYBERNETIC DEVELOPMENT SPECIALIST
            </GlitchText>
          </h2>
          
          <div className="w-48 h-1 bg-gradient-to-r from-neon-pink to-neon-cyan mx-auto mb-8"></div>
          
          <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto mb-12 font-inter">
            Welcome to my digital nexus. I specialize in crafting robust interfaces and digital experiences that merge function and aesthetic. My code transforms ideas into reality.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a 
              href="#projects"
              className="bg-neon-cyan/20 text-neon-cyan border-2 border-neon-cyan/50 py-3 px-8 font-vt323 text-xl tracking-wide rounded-sm hover:bg-neon-cyan/30 transition-colors relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">VIEW PROJECTS</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-cyan/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
            </motion.a>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to="/contact"
                className="bg-neon-pink/20 text-neon-pink border-2 border-neon-pink/50 py-3 px-8 font-vt323 text-xl tracking-wide rounded-sm hover:bg-neon-pink/30 transition-colors relative overflow-hidden group block"
              >
                <span className="relative z-10">INITIATE CONTACT</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-pink/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-500"></div>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Floating elements */}
      <motion.div
        animate={{
          y: [-20, 20],
          rotate: [0, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 right-1/4 w-32 h-32 bg-gradient-to-br from-neon-pink/20 to-transparent rounded-full blur-xl"
      />
      <motion.div
        animate={{
          y: [20, -20],
          rotate: [360, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-gradient-to-tl from-neon-cyan/20 to-transparent rounded-full blur-xl"
      />
      
    </section>
  );
}