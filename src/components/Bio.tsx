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
                  COMMANDER FARBOD ROSHANI, CYBER DRAGON DIVISION
                </p>
                
                <p className="tracking-wide">
                  Specialized in digital warfare and tactical coding operations. Born in the neon wastelands of Silicon Valley, raised by a family of sentient AI bots.
                </p>
                
                <p className="tracking-wide">
                  Through years of combat in the virtual trenches, I've harnessed the ancient powers of JavaScript, TypeScript, and React. My arsenal includes Python-powered data weapons and node.js tactical modules.
                </p>
                
                <p className="tracking-wide">
                  <span className="text-neon-pink inline-block animate-pulse">!</span> When not hunting bugs in the digital realm, I command elite squads in tabletop strategy games and decode ancient scrolls of programming wisdom.
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
                    href="https://instagram.com/farbod.roshanii"
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
                <span className="font-vt323 text-neon-cyan">CODING POWER</span>
                <span className="font-vt323 text-neon-pink">9000+</span>
              </div>
              <div className="h-3 bg-cyberpunk-black/50 rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan" style={{width: '95%'}}></div>
              </div>
            </div>
            
            <div className="max-w-xs mx-auto w-full">
              <div className="flex justify-between mb-1">
                <span className="font-vt323 text-neon-cyan">DRAGON ENERGY</span>
                <span className="font-vt323 text-neon-pink">87%</span>
              </div>
              <div className="h-3 bg-cyberpunk-black/50 rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-neon-pink to-neon-cyan" style={{width: '87%'}}></div>
              </div>
            </div>
            
            <div className="max-w-xs mx-auto w-full">
              <div className="flex justify-between mb-1">
                <span className="font-vt323 text-neon-cyan">COMBAT REFLEXES</span>
                <span className="font-vt323 text-neon-pink">LETHAL</span>
              </div>
              <div className="h-3 bg-cyberpunk-black/50 rounded overflow-hidden">
                <div className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink" style={{width: '100%'}}></div>
              </div>
            </div>
            
            <div className="max-w-xs mx-auto w-full">
              <div className="flex justify-between mb-1">
                <span className="font-vt323 text-neon-cyan">COFFEE CONSUMED</span>
                <span className="font-vt323 text-neon-pink">∞</span>
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