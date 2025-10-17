import { useEffect, useRef, useState, useCallback } from 'react';
import RetroFrame from './RetroFrame';

interface Position {
  x: number;
  y: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
}

export default function SpaceGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [level, setLevel] = useState(1);
  const [speed, setSpeed] = useState(150);
  
  const gameStateRef = useRef({
    snake: [{ x: 10, y: 10 }] as Position[],
    food: { x: 15, y: 15 } as Position,
    direction: { x: 0, y: 0 } as Position,
    nextDirection: { x: 0, y: 0 } as Position,
    gridSize: 20,
    gameSpeed: 150,
    particles: [] as Particle[],
    powerUps: [] as Position[],
    specialFood: null as Position | null,
    specialFoodTimer: 0
  });

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const touchDevice = 'ontouchstart' in window;
      const smallScreen = window.innerWidth <= 768;
      
      const isMobileDevice = mobile || (touchDevice && smallScreen);
      setIsMobile(isMobileDevice);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const createParticles = useCallback((x: number, y: number, color: string, count: number = 5) => {
    const gameState = gameStateRef.current;
    for (let i = 0; i < count; i++) {
      gameState.particles.push({
        x: x * gameState.gridSize + gameState.gridSize / 2,
        y: y * gameState.gridSize + gameState.gridSize / 2,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        life: 30,
        maxLife: 30,
        color: color
      });
    }
  }, []);

  const generateFood = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const gridSize = gameStateRef.current.gridSize;
    const maxX = Math.floor(canvas.width / gridSize) - 1;
    const maxY = Math.floor(canvas.height / gridSize) - 1;
    
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * maxX),
        y: Math.floor(Math.random() * maxY)
      };
    } while (gameStateRef.current.snake.some(segment => 
      segment.x === newFood.x && segment.y === newFood.y
    ));
    
    gameStateRef.current.food = newFood;
    
    // Chance for special food
    if (Math.random() < 0.1) {
      gameStateRef.current.specialFood = newFood;
      gameStateRef.current.specialFoodTimer = 300; // 5 seconds at 60fps
    }
  }, []);

  const updateParticles = useCallback(() => {
    const gameState = gameStateRef.current;
    for (let i = gameState.particles.length - 1; i >= 0; i--) {
      const particle = gameState.particles[i];
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life--;
      
      if (particle.life <= 0) {
        gameState.particles.splice(i, 1);
      }
    }
  }, []);

  const updateGameState = useCallback(() => {
    const gameState = gameStateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return true;

    // Update particles
    updateParticles();

    // Update special food timer
    if (gameState.specialFoodTimer > 0) {
      gameState.specialFoodTimer--;
      if (gameState.specialFoodTimer === 0) {
        gameState.specialFood = null;
      }
    }

    // Update direction
    gameState.direction = { ...gameState.nextDirection };

    // Move snake head
    const head = { ...gameState.snake[0] };
    head.x += gameState.direction.x;
    head.y += gameState.direction.y;

    // Check wall collision
    const gridSize = gameState.gridSize;
    const maxX = Math.floor(canvas.width / gridSize) - 1;
    const maxY = Math.floor(canvas.height / gridSize) - 1;

    if (head.x < 0 || head.x > maxX || head.y < 0 || head.y > maxY) {
      setHighScore(prev => Math.max(prev, score));
      setGameOver(true);
      setGameStarted(false);
      return false;
    }

    // Check self collision
    if (gameState.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setHighScore(prev => Math.max(prev, score));
      setGameOver(true);
      setGameStarted(false);
      return false;
    }

    // Add new head
    gameState.snake.unshift(head);

    // Check food collision
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
      const points = gameState.specialFood ? 50 : 10;
      setScore(prev => {
        const newScore = prev + points;
        // Level up every 100 points
        const newLevel = Math.floor(newScore / 100) + 1;
        if (newLevel > level) {
          setLevel(newLevel);
          setSpeed(prev => Math.max(80, prev - 10)); // Increase speed, min 80ms
        }
        return newScore;
      });
      
      createParticles(head.x, head.y, gameState.specialFood ? '#ff00ff' : '#00ff00', 8);
      generateFood();
    } else {
      // Remove tail if no food eaten
      gameState.snake.pop();
    }
    
    return true;
  }, [generateFood, updateParticles, createParticles, level]);

  const renderGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gameState = gameStateRef.current;
    const gridSize = gameState.gridSize;

    // Clear canvas with animated background
    const time = Date.now() * 0.001;
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, `hsl(${(240 + Math.sin(time) * 20) % 360}, 50%, 5%)`);
    gradient.addColorStop(1, `hsl(${(280 + Math.cos(time) * 20) % 360}, 50%, 8%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw animated grid
    ctx.strokeStyle = `rgba(0, 255, 255, ${0.1 + Math.sin(time * 2) * 0.05})`;
    ctx.lineWidth = 1;
    
    for (let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw particles
    gameState.particles.forEach(particle => {
      const alpha = particle.life / particle.maxLife;
      ctx.fillStyle = particle.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
      ctx.shadowColor = particle.color;
      ctx.shadowBlur = 5;
      ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
    });
    ctx.shadowBlur = 0;

    // Draw snake with gradient
    gameState.snake.forEach((segment, index) => {
      const x = segment.x * gridSize + 1;
      const y = segment.y * gridSize + 1;
      const size = gridSize - 2;
      
      if (index === 0) {
        // Snake head with pulsing effect
        const pulse = 1 + Math.sin(time * 8) * 0.1;
        const headGradient = ctx.createRadialGradient(
          x + size/2, y + size/2, 0,
          x + size/2, y + size/2, size/2
        );
        headGradient.addColorStop(0, '#00ff88');
        headGradient.addColorStop(1, '#00aa44');
        
        ctx.fillStyle = headGradient;
        ctx.shadowColor = '#00ff88';
        ctx.shadowBlur = 15;
        ctx.fillRect(x, y, size * pulse, size * pulse);
        
        // Eyes
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x + size/3, y + size/3, 3, 3);
        ctx.fillRect(x + size*2/3, y + size/3, 3, 3);
      } else {
        // Snake body with gradient
        const bodyGradient = ctx.createLinearGradient(x, y, x + size, y + size);
        const intensity = Math.max(0.3, 1 - (index / gameState.snake.length));
        bodyGradient.addColorStop(0, `rgba(0, ${Math.floor(255 * intensity)}, ${Math.floor(170 * intensity)}, 0.8)`);
        bodyGradient.addColorStop(1, `rgba(0, ${Math.floor(170 * intensity)}, ${Math.floor(85 * intensity)}, 0.6)`);
        
        ctx.fillStyle = bodyGradient;
        ctx.shadowColor = '#00aa00';
        ctx.shadowBlur = 8;
        ctx.fillRect(x, y, size, size);
      }
    });
    ctx.shadowBlur = 0;

    // Draw food with special effects
    const foodX = gameState.food.x * gridSize + 2;
    const foodY = gameState.food.y * gridSize + 2;
    const foodSize = gridSize - 4;
    
    if (gameState.specialFood) {
      // Special food with pulsing rainbow effect
      const rainbowTime = time * 3;
      const hue = (rainbowTime * 50) % 360;
      const foodGradient = ctx.createRadialGradient(
        foodX + foodSize/2, foodY + foodSize/2, 0,
        foodX + foodSize/2, foodY + foodSize/2, foodSize/2
      );
      foodGradient.addColorStop(0, `hsl(${hue}, 100%, 60%)`);
      foodGradient.addColorStop(1, `hsl(${(hue + 60) % 360}, 100%, 40%)`);
      
      ctx.fillStyle = foodGradient;
      ctx.shadowColor = `hsl(${hue}, 100%, 50%)`;
      ctx.shadowBlur = 20;
      ctx.fillRect(foodX, foodY, foodSize, foodSize);
      
      // Sparkle effect
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 0;
      for (let i = 0; i < 4; i++) {
        const angle = (rainbowTime + i * Math.PI/2) * 2;
        const sparkleX = foodX + foodSize/2 + Math.cos(angle) * foodSize/3;
        const sparkleY = foodY + foodSize/2 + Math.sin(angle) * foodSize/3;
        ctx.fillRect(sparkleX - 1, sparkleY - 1, 2, 2);
      }
    } else {
      // Regular food
      const foodGradient = ctx.createRadialGradient(
        foodX + foodSize/2, foodY + foodSize/2, 0,
        foodX + foodSize/2, foodY + foodSize/2, foodSize/2
      );
      foodGradient.addColorStop(0, '#ff4444');
      foodGradient.addColorStop(1, '#aa0000');
      
      ctx.fillStyle = foodGradient;
      ctx.shadowColor = '#ff0000';
      ctx.shadowBlur = 15;
      ctx.fillRect(foodX, foodY, foodSize, foodSize);
    }
    ctx.shadowBlur = 0;
  }, []);
  
  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize game state
    gameStateRef.current = {
      snake: [{ x: 10, y: 10 }],
      food: { x: 15, y: 15 },
      direction: { x: 1, y: 0 }, // Start moving right
      nextDirection: { x: 1, y: 0 },
      gridSize: 20,
      gameSpeed: speed,
      particles: [],
      powerUps: [],
      specialFood: null,
      specialFoodTimer: 0
    };

    generateFood();

    const handleKeyPress = (e: KeyboardEvent) => {
      const gameState = gameStateRef.current;
      
      switch(e.key) {
        case 'ArrowUp':
          if (gameState.direction.y === 0) {
            gameState.nextDirection = { x: 0, y: -1 };
          }
          break;
        case 'ArrowDown':
          if (gameState.direction.y === 0) {
            gameState.nextDirection = { x: 0, y: 1 };
          }
          break;
        case 'ArrowLeft':
          if (gameState.direction.x === 0) {
            gameState.nextDirection = { x: -1, y: 0 };
          }
          break;
        case 'ArrowRight':
          if (gameState.direction.x === 0) {
            gameState.nextDirection = { x: 1, y: 0 };
          }
          break;
      }
    };

    const handleTouch = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      const gameState = gameStateRef.current;
      const dx = x - centerX;
      const dy = y - centerY;
      
      if (Math.abs(dx) > Math.abs(dy)) {
        // Horizontal swipe
        if (dx > 0 && gameState.direction.x === 0) {
          gameState.nextDirection = { x: 1, y: 0 };
        } else if (dx < 0 && gameState.direction.x === 0) {
          gameState.nextDirection = { x: -1, y: 0 };
        }
      } else {
        // Vertical swipe
        if (dy > 0 && gameState.direction.y === 0) {
          gameState.nextDirection = { x: 0, y: 1 };
        } else if (dy < 0 && gameState.direction.y === 0) {
          gameState.nextDirection = { x: 0, y: -1 };
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      handleTouch(e);
    };

    window.addEventListener('keydown', handleKeyPress);
    canvas.addEventListener('touchstart', handleTouch, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

    let gameInterval: NodeJS.Timeout;
    
    const gameLoop = () => {
      const gameRunning = updateGameState();
      if (!gameRunning) return;
      
      renderGame();
      
      gameInterval = setTimeout(gameLoop, speed);
    };

    gameInterval = setTimeout(gameLoop, speed);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      canvas.removeEventListener('touchstart', handleTouch);
      canvas.removeEventListener('touchmove', handleTouchMove);
      clearTimeout(gameInterval);
    };
  }, [gameStarted, isMobile]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setLevel(1);
    setSpeed(150);
  };

  return (
    <div className="min-h-screen pt-20 px-4 relative">
      <RetroFrame className="max-w-2xl mx-auto" variant="dark">
        <div className="text-center">
          <div className="font-vt323 text-lg text-pink-500 mb-4 space-y-1">
            <div className="flex justify-center space-x-6">
              <span>SCORE: <span className="text-cyan-400">{score}</span></span>
              <span>HI-SCORE: <span className="text-cyan-400">{highScore}</span></span>
            </div>
            <div className="flex justify-center space-x-6">
              <span>LEVEL: <span className="text-yellow-400">{level}</span></span>
              <span>SPEED: <span className="text-green-400">{Math.round(150/speed * 100)}%</span></span>
            </div>
          </div>
          
          {!gameStarted ? (
            <button
              onClick={startGame}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-vt323 text-xl px-6 py-3 rounded-lg transition-all mb-4 tracking-widest glow-button"
            >
              {gameOver ? 'TRY AGAIN' : 'START GAME'}
            </button>
          ) : null}
          
          <div className="relative w-full max-w-[600px] mx-auto aspect-[3/2]">
            <canvas
              ref={canvasRef}
              width={isMobile ? 400 : 600}
              height={isMobile ? 300 : 400}
              className="w-full h-full cursor-crosshair touch-none"
              style={{ backgroundColor: '#080010' }}
            />
            <div className="absolute inset-0 pointer-events-none scanline"></div>
          </div>
          
          <div className="mt-4 text-cyan-400/80 font-vt323 text-sm tracking-wide space-y-1">
            <div>CONTROLS: {window.innerWidth <= 768 ? 'TOUCH TO SWIPE' : 'ARROW KEYS'}</div>
            <div className="text-xs text-cyan-400/60">
              🎯 Regular food: +10 points | 🌟 Special food: +50 points | Level up every 100 points
            </div>
          </div>
          
          <div className="mt-10 relative overflow-hidden">
            <div className="text-center">
              <h3 className="font-vt323 text-2xl text-neon-pink mb-4 tracking-widest glow-text-pink">
                TECHNICAL EXPERTISE
              </h3>
              <div className="h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent mb-6"></div>
            </div>
            
            <div className="bg-cyberpunk-black/40 border-2 border-neon-cyan glow-border-cyan p-4 rounded-lg relative">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-neon-pink to-neon-purple rounded-full blur-xl opacity-30"></div>
              <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-gradient-to-tl from-neon-cyan to-neon-blue rounded-full blur-xl opacity-30"></div>
              
              <p className="text-white font-vt323 text-lg mb-4 relative z-10">
                <span className="text-neon-pink">&gt; </span>
                Specialized in full-stack development with expertise in React, Python machine learning, and C# applications. Building innovative solutions that bridge engineering and technology.
              </p>
              
              <div className="flex justify-center items-center space-x-3 relative z-10">
                <div className="px-3 py-1 bg-neon-pink/20 text-neon-pink font-vt323 rounded-md border border-neon-pink text-sm">
                  #PYTHON
                </div>
                <div className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan font-vt323 rounded-md border border-neon-cyan text-sm">
                  #REACT
                </div>
                <div className="px-3 py-1 bg-neon-purple/20 text-neon-purple font-vt323 rounded-md border border-neon-purple text-sm">
                  #C#
                </div>
              </div>
              
              <div className="scanline absolute inset-0 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </RetroFrame>
    </div>
  );
}