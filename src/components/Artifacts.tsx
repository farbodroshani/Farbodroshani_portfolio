import { motion } from 'framer-motion';
import RetroFrame from './RetroFrame';
import GlitchText from './GlitchText';
import { useState, useEffect } from 'react';

export default function Artifacts() {
  const [meme, setMeme] = useState<{ url: string; title: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomMeme = async () => {
    setLoading(true);
    setError(null);
    try {
      // Separate tech and regular meme subreddits
      const techSubreddits = [
        'ProgrammerHumor',
        'codingmemes',
        'techhumor',
        'linuxmemes',
        'programmingmemes',
        'softwaregore'
      ];

      const regularSubreddits = [
        'memes',
        'dankmemes',
        'me_irl',
        'funny',
        'comedyheaven',
        'terriblefacebookmemes'
      ];
      
      // First choose between tech and regular (60% regular, 40% tech)
      const isTech = Math.random() < 0.4;
      const selectedSubreddits = isTech ? techSubreddits : regularSubreddits;
      
      // Then randomly select from the chosen category
      const randomSubreddit = selectedSubreddits[Math.floor(Math.random() * selectedSubreddits.length)];
      const response = await fetch(`https://meme-api.com/gimme/${randomSubreddit}`);
      const data = await response.json();
      
      // Only filter out extremely sensitive content
      if (data.nsfw && data.over_18) {
        throw new Error('Content filtered out');
      }

      setMeme({
        url: data.url,
        title: data.title
      });
    } catch (error) {
      console.error('Error fetching meme:', error);
      setError('Failed to load meme. Trying again...');
      // Retry after a short delay
      setTimeout(fetchRandomMeme, 1000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomMeme();
  }, []);

  return (
    <div className="min-h-screen pt-20 px-4">
      <h1 className="font-vt323 text-5xl md:text-6xl text-center mb-8 text-neon-cyan glow-text-cyan">
        <GlitchText intensity="intense" triggerProbability={0.3} triggerInterval={4000}>
          ARTIFACTS
        </GlitchText>
      </h1>
      <div className="h-[2px] bg-gradient-to-r from-transparent via-neon-pink to-transparent mb-12"></div>
      
      {/* System Status Section */}
      <RetroFrame className="max-w-2xl mx-auto mb-8" variant="dark">
        <div className="text-center py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlitchText intensity="medium" className="text-3xl text-neon-pink mb-6">
              SYSTEM STATUS: UNDER CONSTRUCTION
            </GlitchText>
            
            <div className="h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent mb-8"></div>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan opacity-30 blur"></div>
              <div className="relative bg-cyberpunk-black/60 border border-neon-cyan p-6 rounded-lg">
                <p className="text-neon-cyan font-vt323 text-xl mb-4">
                  &gt; INITIALIZING ARTIFACT SYSTEM...
                </p>
                <p className="text-white/80 font-vt323 text-lg mb-4">
                  ESTIMATED TIME REMAINING: [CALCULATING...]
                </p>
                <div className="flex justify-center space-x-2 mb-6">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 bg-neon-pink rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    ></div>
                  ))}
                </div>
                <p className="text-neon-cyan/80 font-vt323">
                  PLEASE STAND BY... ARTIFACTS WILL BE DEPLOYED SOON
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </RetroFrame>

      {/* Random Meme Generator */}
      <RetroFrame className="max-w-2xl mx-auto" variant="dark">
        <div className="text-center py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <GlitchText intensity="medium" className="text-3xl text-neon-pink mb-6">
              MEME GENERATOR
            </GlitchText>
            
            <div className="h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent mb-8"></div>
            
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-cyan opacity-30 blur"></div>
              <div className="relative bg-cyberpunk-black/60 border border-neon-cyan p-6 rounded-lg">
                <p className="text-neon-cyan/80 font-vt323 text-sm mb-4">
                  * These memes are generated from an external API and are not my own creations
                </p>
                {error && (
                  <p className="text-neon-pink font-vt323 text-sm mb-4">
                    {error}
                  </p>
                )}
                {loading ? (
                  <div className="flex flex-col items-center">
                    <div className="flex justify-center space-x-2 mb-4">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-3 h-3 bg-neon-pink rounded-full animate-pulse"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        ></div>
                      ))}
                    </div>
                    <p className="text-neon-cyan font-vt323">GENERATING MEME...</p>
                  </div>
                ) : meme ? (
                  <div className="space-y-4">
                    <img 
                      src={meme.url} 
                      alt={meme.title}
                      className="w-full h-auto rounded-lg border border-neon-cyan"
                    />
                    <p className="text-white/80 font-vt323">{meme.title}</p>
                    <button
                      onClick={fetchRandomMeme}
                      className="mt-4 px-6 py-2 bg-neon-pink/20 hover:bg-neon-pink/40 text-neon-pink font-vt323 rounded border border-neon-pink transition-colors"
                    >
                      GENERATE NEW MEME
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </motion.div>
        </div>
      </RetroFrame>
    </div>
  );
} 