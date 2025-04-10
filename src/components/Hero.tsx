import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-cyberpunk-dark to-cyberpunk-darker flex items-center justify-center overflow-visible pb-20">
      {/* Animated fog effect */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 animate-fog-1 bg-gradient-radial from-transparent via-neon-pink/10 to-transparent" />
        <div className="absolute inset-0 animate-fog-2 bg-gradient-radial from-transparent via-neon-cyan/10 to-transparent" />
      </div>

      <div className="vhs-effect w-full max-w-4xl mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="font-vt323 text-6xl md:text-8xl mb-4 text-white tracking-wider glow-text-cyan">
            <span className="text-neon-pink glow-text-pink">&gt;</span> FARBOD ROSHANI
          </h1>
          
          <div className="font-vt323 text-2xl md:text-3xl text-white opacity-80 mb-8 tracking-widest">
            <span className="text-neon-pink glow-text-pink">$</span> <span className="text-neon-cyan glow-text-cyan">CYBER DRAGON OPERATIVE</span>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mb-10 py-5"
          >
            {/* Explicitly styled button with margins and z-index */}
            <button 
              style={{
                background: 'linear-gradient(to right, #ff00ff, #b000ff)',
                color: 'white',
                fontFamily: '"VT323", monospace',
                fontSize: '20px',
                padding: '16px 32px',
                borderRadius: '8px',
                letterSpacing: '2px',
                boxShadow: '0 0 15px rgba(255, 0, 255, 0.5)',
                margin: '20px 0',
                position: 'relative',
                zIndex: 20,
                display: 'inline-block',
                width: 'auto',
                minWidth: '250px',
                overflow: 'visible'
              }}
            >
              INITIALIZE SEQUENCE
            </button>
          </motion.div>
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