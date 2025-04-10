import { motion } from 'framer-motion';

interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
}

export default function ProjectCard({ title, description, imageUrl, link }: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative overflow-hidden blood-dragon-card"
    >
      <div className="bg-gradient-to-r from-neon-pink to-neon-cyan p-[2px] relative overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
        
        <div className="relative bg-cyberpunk-darker rounded-lg overflow-hidden">
          <a href={link} className="block">
            <div className="relative h-48 overflow-hidden">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-110 filter saturate-150"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cyberpunk-black via-transparent to-transparent"></div>
              
              {/* Dragon eye overlay */}
              <div className="absolute bottom-0 right-0 w-16 h-16 dragon-eye">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-neon-pink rounded-full relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-4 h-4 bg-neon-cyan rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="scanline absolute inset-0 pointer-events-none"></div>
            </div>
            
            <div className="p-4">
              <h3 className="font-vt323 text-2xl text-neon-cyan mb-2 tracking-wider glow-text-cyan">
                {title}
              </h3>
              <p className="font-vt323 text-white/80 tracking-wide">
                {description}
              </p>
            </div>
            
            <div className="p-4 border-t border-neon-pink/20">
              <div className="flex items-center justify-between">
                <span className="font-vt323 text-neon-pink tracking-wider glow-text-pink">
                  &gt; ACTIVATE
                </span>
                <div className="pulse-dot"></div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </motion.div>
  );
}