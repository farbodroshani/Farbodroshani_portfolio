import { motion } from 'framer-motion';
import RetroFrame from './RetroFrame';
import { Instagram } from 'lucide-react';
import GlitchText from './GlitchText';

export default function Bio() {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <RetroFrame>
          <div className="text-center mb-8">
            <h2 className="font-vt323 text-4xl text-neon-cyan mb-4 tracking-widest glow-text-cyan">
              <GlitchText disabled>
                OPERATOR PROFILE
              </GlitchText>
            </h2>
            <div className="h-[2px] bg-gradient-to-r from-transparent via-neon-pink to-transparent"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            <div className="md:col-span-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative rounded-lg overflow-hidden border-2 border-neon-pink glow-border-pink flex items-center justify-center"
                style={{ height: '100%', backgroundColor: '#000' }}
              >
                <span className="font-vt323 text-2xl text-neon-cyan">404 Error: User Not Found</span>
                <div className="absolute inset-0 bg-gradient-to-t from-cyberpunk-black via-transparent to-transparent"></div>
                <div className="scanline absolute inset-0 pointer-events-none"></div>
              </motion.div>
            </div>
            
            <div className="md:col-span-2">
              <div className="font-vt323 text-lg space-y-4 text-white">
                <p className="text-neon-cyan tracking-wide">
                  <span className="text-neon-pink">&gt; </span>
                  FARBOD ROSHANI, SOFTWARE ENGINEER & CIVIL ENGINEER
                </p>
                
                <p className="tracking-wide">
                  I am a versatile professional with expertise in software development, machine learning, and civil engineering. Currently pursuing my Master's degree in Civil Engineering, Road and Transportation at Amirkabir University, building upon my Bachelor's degree in Civil Engineering from Tabriz University.
                </p>
                
                <p className="tracking-wide">
                  With extensive experience in Python for machine learning applications and C# development, I have successfully designed and developed over 20+ websites using React frameworks. My technical arsenal includes expertise in PR/KOL management, data analysis, and full-stack web development.
                </p>
                
                <p className="tracking-wide">
                  <span className="text-neon-pink inline-block animate-pulse">!</span> Combining my engineering background with cutting-edge software development skills, I create innovative solutions that bridge the gap between traditional engineering and modern technology.
                </p>
                
                <div className="pt-4 flex space-x-4 justify-center md:justify-start">
                  <a
                    href="https://drive.google.com/file/d/11pZ4VZdZuXT5kQ6pd7LwvAB8y7gMx9p8/view"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-neon-cyan/20 hover:bg-neon-cyan/30 border border-neon-cyan text-neon-cyan font-vt323 px-4 py-2 rounded tracking-wider"
                  >
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                    >
                      DOWNLOAD CV.EXE
                    </motion.button>
                  </a>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="bg-neon-pink/20 hover:bg-neon-pink/30 border border-neon-pink text-neon-pink font-vt323 px-4 py-2 rounded tracking-wider"
                  >
                    CONTACT UPLINK
                  </motion.button>
                  <a
                    href="https://instagram.com/farbodroshanii"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon-cyan hover:text-neon-pink transition-colors social-icon"
                  >
                    <Instagram size={20} />
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats bars */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="max-w-xs mx-auto w-full">
              <div className="flex justify-between mb-1">
                <span className="font-vt323 text-neon-cyan">PYTHON/ML</span>
                <span className="font-vt323 text-neon-pink">95%</span>
              </div>
              <div className="h-3 bg-cyberpunk-black/50 rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan" style={{width: '95%'}}></div>
              </div>
            </div>
            
            <div className="max-w-xs mx-auto w-full">
              <div className="flex justify-between mb-1">
                <span className="font-vt323 text-neon-cyan">REACT/C#</span>
                <span className="font-vt323 text-neon-pink">90%</span>
              </div>
              <div className="h-3 bg-cyberpunk-black/50 rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan" style={{width: '90%'}}></div>
              </div>
            </div>
            
            <div className="max-w-xs mx-auto w-full">
              <div className="flex justify-between mb-1">
                <span className="font-vt323 text-neon-cyan">WEBSITES BUILT</span>
                <span className="font-vt323 text-neon-pink">20+</span>
              </div>
              <div className="h-3 bg-cyberpunk-black/50 rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink" style={{width: '100%'}}></div>
              </div>
            </div>
            
            <div className="max-w-xs mx-auto w-full">
              <div className="flex justify-between mb-1">
                <span className="font-vt323 text-neon-cyan">EDUCATION LEVEL</span>
                <span className="font-vt323 text-neon-pink">MASTER'S</span>
              </div>
              <div className="h-3 bg-cyberpunk-black/50 rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan animate-pulse" style={{width: '100%'}}></div>
              </div>
            </div>
          </div>
        </RetroFrame>
      </div>
    </section>
  );
} 