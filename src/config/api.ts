/**
 * API Configuration
 * 
 * This file contains settings for the various APIs used in the application.
 * For production use, consider using environment variables or a secure configuration management system.
 */

export const apiConfig = {
  // Primary meme API
  primaryApi: {
    baseUrl: 'https://meme-api.com/gimme',
    enabled: true, // Set to false to skip trying this API
  },
  
  // Secondary meme API (APILeague)
  secondaryApi: {
    baseUrl: 'https://api.apileague.com/retrieve-random-meme',
    apiKey: import.meta.env.VITE_APILEAGUE_API_KEY || '', // Set your API key in .env file
    enabled: true, // Set to false to skip trying this API
  },
  
  // Tertiary meme API (Giphy)
  tertiaryApi: {
    baseUrl: 'https://api.giphy.com/v1/gifs',
    apiKey: import.meta.env.VITE_GIPHY_API_KEY || 'pLURtkhVrUXr3KG25Gy5IvzziV5OrZGa', // Public beta key, consider getting your own
    enabled: true, // Set to false to skip trying this API
  },
  
  // Local fallback (always enabled as last resort)
  localFallback: {
    enabled: true,
  }
};

// Fallback memes for when all APIs fail - using more reliable image sources
export const fallbackMemes = [
  {
    url: "https://cdn.pixabay.com/photo/2019/11/08/11/56/cat-4611189_960_720.jpg",
    title: "When the APIs are down but you still need your meme fix"
  },
  {
    url: "https://cdn.pixabay.com/photo/2020/05/01/01/57/girl-5115192_960_720.jpg",
    title: "404 Meme Not Found"
  },
  {
    url: "https://cdn.pixabay.com/photo/2016/03/28/12/35/cat-1285634_960_720.png",
    title: "The servers are experiencing technical difficulties"
  },
  {
    url: "https://cdn.pixabay.com/photo/2015/03/26/09/47/sky-690293_960_720.jpg",
    title: "When you try to fetch a meme but all the APIs are down"
  },
  {
    url: "https://cdn.pixabay.com/photo/2020/06/01/22/23/eye-5248678_960_720.jpg",
    title: "Internet connection not found. Running on backup power"
  },
  {
    url: "https://cdn.pixabay.com/photo/2020/04/17/14/16/thunder-5055656_960_720.jpg",
    title: "Server connection lost. Displaying emergency meme"
  },
  {
    url: "https://cdn.pixabay.com/photo/2016/12/13/05/15/puppy-1903313_960_720.jpg",
    title: "When you're waiting for the meme APIs to come back online"
  },
  {
    url: "https://cdn.pixabay.com/photo/2019/08/19/07/45/dog-4415649_960_720.jpg",
    title: "The look when your favorite meme API is down"
  }
]; 