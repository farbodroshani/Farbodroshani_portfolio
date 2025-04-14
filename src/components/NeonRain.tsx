import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface RainDrop {
  id: number;
  x: number;
  y: number;
  speed: number;
  length: number;
  opacity: number;
}

export default function NeonRain() {
  const [isActive, setIsActive] = useState(false);
  const [drops, setDrops] = useState<RainDrop[]>([]);

  useEffect(() => {
    if (!isActive) return;

    const createDrop = (): RainDrop => ({
      id: Math.random(),
      x: Math.random() * 100,
      y: -10,
      speed: 2 + Math.random() * 3,
      length: 20 + Math.random() * 30,
      opacity: 0.3 + Math.random() * 0.7,
    });

    const interval = setInterval(() => {
      setDrops(prev => {
        const newDrops = prev
          .map(drop => ({
            ...drop,
            y: drop.y + drop.speed,
          }))
          .filter(drop => drop.y < 100);

        if (newDrops.length < 50) {
          newDrops.push(createDrop());
        }

        return newDrops;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <>
      <button
        onClick={() => setIsActive(!isActive)}
        className="fixed bottom-4 left-4 z-50 px-4 py-2 bg-cyberpunk-black border-2 border-neon-cyan text-neon-cyan font-vt323 hover:bg-neon-cyan hover:text-cyberpunk-black transition-all duration-300"
      >
        {isActive ? 'DISABLE RAIN' : 'ENABLE RAIN'}
      </button>

      <AnimatePresence>
        {isActive && (
          <div className="fixed inset-0 pointer-events-none">
            {drops.map(drop => (
              <motion.div
                key={drop.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: drop.opacity }}
                exit={{ opacity: 0 }}
                className="absolute w-[2px] bg-gradient-to-b from-neon-cyan to-transparent"
                style={{
                  left: `${drop.x}%`,
                  top: `${drop.y}%`,
                  height: `${drop.length}px`,
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </>
  );
} 