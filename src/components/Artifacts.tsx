import { motion } from 'framer-motion';
import RetroFrame from './RetroFrame';
import GlitchText from './GlitchText';
import { useState, useEffect } from 'react';
import { apiConfig, fallbackMemes } from '../config/api';

// Define the structure of a meme
interface Meme {
  url: string;
  title: string;
}

export default function Artifacts() {
  const [meme, setMeme] = useState<Meme | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiSource, setApiSource] = useState<string>("primary");

  // API fetching functions
  const fetchFromPrimaryApi = async () => {
    // Skip if disabled in config
    if (!apiConfig.primaryApi.enabled) {
      throw new Error('Primary API is disabled in configuration');
    }

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
    
    const response = await fetch(`${apiConfig.primaryApi.baseUrl}/${randomSubreddit}`);
    
    if (!response.ok) {
      throw new Error(`Primary API failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Only filter out extremely sensitive content
    if (data.nsfw && data.over_18) {
      throw new Error('Content filtered out');
    }

    setApiSource("primary");
    return {
      url: data.url,
      title: data.title
    };
  };

  const fetchFromSecondaryApi = async () => {
    // Skip if disabled in config
    if (!apiConfig.secondaryApi.enabled) {
      throw new Error('Secondary API is disabled in configuration');
    }

    // Check if we have an API key
    if (!apiConfig.secondaryApi.apiKey) {
      console.warn('Secondary API key not provided');
      throw new Error('Secondary API key missing');
    }

    // APILeague's random meme API
    const response = await fetch(
      `${apiConfig.secondaryApi.baseUrl}?api-key=${apiConfig.secondaryApi.apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`Secondary API failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    setApiSource("secondary");
    return {
      url: data.url,
      title: data.description || 'Random Meme'
    };
  };

  const fetchFromTertiaryApi = async () => {
    // Skip if disabled in config
    if (!apiConfig.tertiaryApi.enabled) {
      throw new Error('Tertiary API is disabled in configuration');
    }

    // Check if we have an API key
    if (!apiConfig.tertiaryApi.apiKey) {
      console.warn('Tertiary API key not provided');
      throw new Error('Tertiary API key missing');
    }

    // List of meme-related search terms
    const searchTerms = [
      'coding meme',
      'programmer humor',
      'funny cat',
      'reaction gif',
      'fail',
      'funny',
      'developer problems',
      'tech humor'
    ];

    // Select a random search term
    const randomTerm = searchTerms[Math.floor(Math.random() * searchTerms.length)];

    // Fetch from Giphy API
    const response = await fetch(
      `${apiConfig.tertiaryApi.baseUrl}/search?api_key=${apiConfig.tertiaryApi.apiKey}&q=${encodeURIComponent(randomTerm)}&limit=25&rating=g`
    );
    
    if (!response.ok) {
      throw new Error(`Tertiary API failed with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Make sure we have results
    if (!data.data || data.data.length === 0) {
      throw new Error('No results found from Giphy API');
    }

    // Pick a random GIF from the results
    const randomIndex = Math.floor(Math.random() * data.data.length);
    const gif = data.data[randomIndex];
    
    setApiSource("tertiary");
    return {
      url: gif.images.original.url,
      title: gif.title || randomTerm
    };
  };

  const useLocalFallback = () => {
    // Skip if disabled in config (though this should generally stay enabled)
    if (!apiConfig.localFallback.enabled) {
      throw new Error('Local fallback is disabled in configuration');
    }

    // Get a random meme from our local collection
    const randomMeme = fallbackMemes[Math.floor(Math.random() * fallbackMemes.length)];
    setApiSource("local");
    return randomMeme;
  };

  const fetchRandomMeme = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First try primary API
      if (apiConfig.primaryApi.enabled) {
        try {
          const meme = await fetchFromPrimaryApi();
          setMeme(meme);
          return;
        } catch (primaryError) {
          console.error('Primary API error:', primaryError);
        }
      }

      // If primary API fails or disabled, try secondary API
      if (apiConfig.secondaryApi.enabled) {
        try {
          const meme = await fetchFromSecondaryApi();
          setMeme(meme);
          return;
        } catch (secondaryError) {
          console.error('Secondary API error:', secondaryError);
        }
      }

      // If secondary API fails or disabled, try tertiary API
      if (apiConfig.tertiaryApi.enabled) {
        try {
          const meme = await fetchFromTertiaryApi();
          setMeme(meme);
          return;
        } catch (tertiaryError) {
          console.error('Tertiary API error:', tertiaryError);
        }
      }

      // If all APIs fail or disabled, use local fallback
      if (apiConfig.localFallback.enabled) {
        const meme = useLocalFallback();
        setMeme(meme);
        return;
      }

      // If we get here, all options failed
      setError('All meme sources failed. Please try again later.');
    } catch (error) {
      console.error('Error fetching meme:', error);
      setError('Failed to load meme. Please try again.');
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
                  * These memes are generated from various sources and are not my own creations
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
                      onError={(e) => {
                        // If image fails to load, try another meme
                        console.error('Image failed to load, fetching new meme');
                        fetchRandomMeme();
                      }}
                    />
                    <p className="text-white/80 font-vt323">{meme.title}</p>
                    
                    {/* Show API source info */}
                    <p className="text-neon-cyan/50 font-vt323 text-xs mt-2">
                      Source: {apiSource === "primary" ? "Meme API" : 
                               apiSource === "secondary" ? "APILeague" :
                               apiSource === "tertiary" ? "Giphy API" :
                               "Local Collection"}
                    </p>
                    
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