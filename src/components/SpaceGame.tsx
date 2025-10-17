import { useEffect, useRef, useState, useCallback } from 'react';
import RetroFrame from './RetroFrame';

interface Position {
  x: number;
  y: number;
}

export default function SpaceGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  const gameStateRef = useRef({
    snake: [{ x: 10, y: 10 }] as Position[],
    food: { x: 15, y: 15 } as Position,
    direction: { x: 0, y: 0 } as Position,
    nextDirection: { x: 0, y: 0 } as Position,
    gridSize: 20,
    gameSpeed: 150
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
  }, []);

  const updateGameState = useCallback(() => {
    const gameState = gameStateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return true;

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
      setScore(prev => prev + 10);
      generateFood();
    } else {
      // Remove tail if no food eaten
      gameState.snake.pop();
    }
    
    return true;
  }, [generateFood]);

  const renderGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gameState = gameStateRef.current;
    const gridSize = gameState.gridSize;

    // Clear canvas
    ctx.fillStyle = '#080010';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
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

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      if (index === 0) {
        // Snake head
        ctx.fillStyle = '#00ff00';
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 10;
      } else {
        // Snake body
        ctx.fillStyle = '#00aa00';
        ctx.shadowColor = '#00aa00';
        ctx.shadowBlur = 5;
      }
      
      ctx.fillRect(
        segment.x * gridSize + 1, 
        segment.y * gridSize + 1, 
        gridSize - 2, 
        gridSize - 2
      );
    });
    ctx.shadowBlur = 0;

    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.shadowColor = '#ff0000';
    ctx.shadowBlur = 10;
    ctx.fillRect(
      gameState.food.x * gridSize + 2, 
      gameState.food.y * gridSize + 2, 
      gridSize - 4, 
      gridSize - 4
    );
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
      gameSpeed: isMobile ? 200 : 150
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
      
      gameInterval = setTimeout(gameLoop, gameStateRef.current.gameSpeed);
    };

    gameInterval = setTimeout(gameLoop, gameStateRef.current.gameSpeed);

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
  };

  return (
    <div className="min-h-screen pt-20 px-4 relative">
      <RetroFrame className="max-w-2xl mx-auto" variant="dark">
        <div className="text-center">
          <p className="font-vt323 text-xl text-pink-500 mb-4">
            SCORE: <span className="text-cyan-400">{score}</span> | 
            HI-SCORE: <span className="text-cyan-400">{highScore}</span>
          </p>
          
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
          
          <div className="mt-4 text-cyan-400/80 font-vt323 text-sm tracking-wide">
            CONTROLS: {window.innerWidth <= 768 ? 'TOUCH TO SWIPE' : 'ARROW KEYS'}
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