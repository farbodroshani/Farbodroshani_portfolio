/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'dark-purple': '#2A0F37',
        'light-purple': '#4B2A5A',
        'dusty-pink': '#B76E79',
        'gunmetal': '#1C1C1C',
        // Blood Dragon inspired colors
        'neon-pink': '#ff00ff',
        'neon-cyan': '#00ffff',
        'neon-purple': '#b000ff',
        'cyberpunk-black': '#080010',
        'cyberpunk-dark': '#120824',
        'cyberpunk-darker': '#0a0418',
        // Italian flag colors
        'italian-green': '#008C45',
        'italian-white': '#F4F9FF',
        'italian-red': '#CD212A',
      },
      fontFamily: {
        'bodoni': ['Bodoni Moda', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'vt323': ['VT323', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
        'grain': 'grain 8s steps(10) infinite',
        'fog-1': 'fog 10s ease-in-out infinite',
        'fog-2': 'fog 15s ease-in-out infinite reverse',
        'meme-bounce': 'memeBounce 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '10%': { transform: 'translate(-5%, -10%)' },
          '20%': { transform: 'translate(-15%, 5%)' },
          '30%': { transform: 'translate(7%, -25%)' },
          '40%': { transform: 'translate(-5%, 25%)' },
          '50%': { transform: 'translate(-15%, 10%)' },
          '60%': { transform: 'translate(15%, 0%)' },
          '70%': { transform: 'translate(0%, 15%)' },
          '80%': { transform: 'translate(3%, 35%)' },
          '90%': { transform: 'translate(-10%, 10%)' },
        },
        fog: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(15%, -15%)' },
          '50%': { transform: 'translate(-5%, 15%)' },
          '75%': { transform: 'translate(-15%, -5%)' },
        },
        memeBounce: {
          '0%, 100%': { transform: 'translateY(0) rotate(-5deg)' },
          '50%': { transform: 'translateY(-10px) rotate(5deg)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'italian-flag': 'linear-gradient(to right, #008C45, #F4F9FF, #CD212A)',
      },
    },
  },
  plugins: [],
};