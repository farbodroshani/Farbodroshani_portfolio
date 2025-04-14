import { Github } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-cyberpunk-black/80 border-t border-neon-cyan/30 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <h3 className="text-neon-pink font-vt323 text-xl tracking-wider">ABOUT</h3>
            <p className="text-white/70 font-vt323">
              A retro-futuristic personal website inspired by Far Cry 3: Blood Dragon.
              Built with React, TypeScript, and Tailwind CSS.
            </p>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-neon-cyan font-vt323 text-xl tracking-wider">SOURCE CODE</h3>
            <div className="flex items-center space-x-2">
              <a
                href="https://github.com/farbodroshani/Farbodroshani"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-white/70 hover:text-neon-cyan transition-colors font-vt323"
              >
                <Github className="w-5 h-5" />
                <span>View on GitHub</span>
              </a>
            </div>
          </div>
        </div>
        
        <motion.div 
          className="mt-12 pt-8 border-t border-neon-cyan/20 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-white/60 font-vt323 text-sm">
            © {currentYear} Farbod Roshani. All rights reserved.
          </p>
          <p className="text-white/40 font-vt323 text-xs mt-2">
            This website is licensed under MIT License. You can find the source code on GitHub,
            but please credit the original author when using any part of the code.
          </p>
        </motion.div>
      </div>
    </footer>
  );
} 