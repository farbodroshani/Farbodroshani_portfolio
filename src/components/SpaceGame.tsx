import { useEffect, useRef, useState, useCallback } from 'react';
import RetroFrame from './RetroFrame';

interface Enemy {
  x: number;
  y: number;
  width: number;
  height: number;
  health: number;
  speed: number;
}

interface Bullet {
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
  const [performanceMode, setPerformanceMode] = useState(false);
  
  const gameStateRef = useRef({
    player: { x: 0, y: 0, width: 30, height: 30, speed: 5 },
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    mousePosition: { x: 0, y: 0 },
    lightningEffect: { active: false, duration: 0, x: 0, y: 0 }
  });

  // Detect mobile device and set performance mode
  useEffect(() => {
    const checkMobile = () => {
      const mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const touchDevice = 'ontouchstart' in window;
      const smallScreen = window.innerWidth <= 768;
      
      const isMobileDevice = mobile || (touchDevice && smallScreen);
      setIsMobile(isMobileDevice);
      
      // Enable performance mode for mobile or low-end devices
      if (isMobileDevice || navigator.hardwareConcurrency <= 2) {
        setPerformanceMode(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const drawLightning = useCallback((x: number, y: number) => {
    const gameState = gameStateRef.current;
    gameState.lightningEffect.active = true;
    gameState.lightningEffect.duration = performanceMode ? 5 : 10; // Shorter effect on mobile
    gameState.lightningEffect.x = x;
    gameState.lightningEffect.y = y;
    
    // Only play audio if not in performance mode
    if (!performanceMode) {
      const audio = new Audio('https://www.myinstants.com/media/sounds/thunder.mp3');
      audio.volume = 0.1;
      audio.play().catch(() => {}); // Ignore audio errors
    }
  }, [performanceMode]);


  const updateGameState = useCallback(() => {
    const gameState = gameStateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return true;

    // Optimized player movement with reduced calculations
    const playerCenter = gameState.player.x + gameState.player.width / 2;
    const mouseX = gameState.mousePosition.x;
    const threshold = performanceMode ? 10 : 5; // Larger threshold for mobile
    
    if (mouseX > playerCenter + threshold) {
      gameState.player.x += gameState.player.speed;
    } else if (mouseX < playerCenter - threshold) {
      gameState.player.x -= gameState.player.speed;
    }

    // Clamp player position
    gameState.player.x = Math.max(0, Math.min(canvas.width - gameState.player.width, gameState.player.x));

    // Optimized bullet updates - remove bullets that are off screen
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
      const bullet = gameState.bullets[i];
      bullet.y -= performanceMode ? 8 : 10; // Slightly slower on mobile for better control

      if (bullet.y < 0) {
        gameState.bullets.splice(i, 1);
      }
    }

    // Reduced spawn rate and enemy count for mobile
    const maxEnemies = performanceMode ? 3 : 5;
    const spawnRate = performanceMode ? 0.02 : 0.03;
    
    if (Math.random() < spawnRate && gameState.enemies.length < maxEnemies) {
      const enemyWidth = performanceMode ? 35 : (40 + Math.floor(Math.random() * 20));
      const enemyHeight = performanceMode ? 25 : (30 + Math.floor(Math.random() * 15));
      
      gameState.enemies.push({
        x: Math.random() * (canvas.width - enemyWidth),
        y: -enemyHeight,
        width: enemyWidth,
        height: enemyHeight,
        health: 1 + Math.floor(score / 1000),
        speed: performanceMode ? (0.8 + Math.random() * 1.2) : (1 + Math.random() * 1.5)
      });
    }

    // Optimized collision detection
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
      const enemy = gameState.enemies[i];
      enemy.y += enemy.speed;

      let enemyHit = false;
      
      // Optimized bullet-enemy collision
      for (let j = gameState.bullets.length - 1; j >= 0; j--) {
        const bullet = gameState.bullets[j];
        // Simplified collision check
        if (bullet.x >= enemy.x && 
            bullet.x <= enemy.x + enemy.width &&
            bullet.y >= enemy.y &&
            bullet.y <= enemy.y + enemy.height) {
          
          gameState.bullets.splice(j, 1);
          enemy.health--;
          
          if (enemy.health <= 0) {
            gameState.enemies.splice(i, 1);
            setScore(prev => prev + 10);
            
            // Reduced lightning effect frequency on mobile
            if (!performanceMode && Math.random() < 0.1) {
              drawLightning(enemy.x, enemy.y);
            }
            enemyHit = true;
            break;
          }
        }
      }

      if (enemyHit) continue;

      // Optimized player-enemy collision
      const player = gameState.player;
      if (enemy.y + enemy.height > player.y &&
          enemy.x < player.x + player.width &&
          enemy.x + enemy.width > player.x &&
          enemy.y < player.y + player.height) {
        
        setHighScore(prev => Math.max(prev, score));
        setGameOver(true);
        setGameStarted(false);
        return false;
      }

      // Remove enemies that are off screen
      if (enemy.y > canvas.height) {
        gameState.enemies.splice(i, 1);
      }
    }
    
    return true;
  }, [performanceMode, drawLightning]);

  const renderGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gameState = gameStateRef.current;

    // Clear canvas
    ctx.fillStyle = '#080010';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Reduced grid lines for mobile performance
    if (!performanceMode) {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    }
    
    // Lightning effect (simplified for mobile)
    if (gameState.lightningEffect.active) {
      ctx.fillStyle = performanceMode ? 'rgba(255, 0, 255, 0.1)' : 'rgba(255, 0, 255, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      gameState.lightningEffect.duration--;
      if (gameState.lightningEffect.duration <= 0) {
        gameState.lightningEffect.active = false;
      }
    }

    // Player rendering (optimized shadows)
    if (!performanceMode) {
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 10;
    }
    ctx.fillStyle = '#ff0050';
    ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);
    if (!performanceMode) ctx.shadowBlur = 0;
    
    // Player center dot
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(gameState.player.x + gameState.player.width / 2, gameState.player.y + 10, 5, 0, Math.PI * 2);
    ctx.fill();

    // Bullets (batch rendering for better performance)
    ctx.fillStyle = '#00ffff';
    if (!performanceMode) {
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 10;
    }
    for (const bullet of gameState.bullets) {
      ctx.fillRect(bullet.x - 2, bullet.y, 4, 15);
    }
    if (!performanceMode) ctx.shadowBlur = 0;

    // Enemies (simplified rendering for mobile)
    for (const enemy of gameState.enemies) {
      if (!performanceMode) {
        ctx.shadowColor = '#ff00ff';
        ctx.shadowBlur = 10;
      }
      ctx.fillStyle = '#4B2A5A';
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      if (!performanceMode) ctx.shadowBlur = 0;
      
      // Simplified enemy details for mobile
      if (!performanceMode) {
        ctx.fillStyle = '#ff5500';
        ctx.beginPath();
        ctx.arc(enemy.x + 10, enemy.y + 10, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(enemy.x + enemy.width - 10, enemy.y + 10, 5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Fog effect (reduced for mobile)
    if (!performanceMode) {
      const fogGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      fogGradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
      fogGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
      fogGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      ctx.fillStyle = fogGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [performanceMode]);
  
  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    gameStateRef.current = {
      player: {
        x: canvas.width / 2,
        y: canvas.height - 30,
        width: 30,
        height: 30,
        speed: 5
      },
      bullets: [],
      enemies: [],
      mousePosition: { x: canvas.width / 2, y: 0 },
      lightningEffect: { active: false, duration: 0, x: 0, y: 0 }
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      gameStateRef.current.mousePosition.x = e.clientX - rect.left;
      gameStateRef.current.mousePosition.y = e.clientY - rect.top;
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        gameStateRef.current.mousePosition.x = touch.clientX - rect.left;
        gameStateRef.current.mousePosition.y = touch.clientY - rect.top;
      }
    };

    const handleMouseClick = useCallback(() => {
      gameStateRef.current.bullets.push({
        x: gameStateRef.current.player.x + gameStateRef.current.player.width / 2,
        y: gameStateRef.current.player.y
      });
      
      // Only play audio if not in performance mode
      if (!performanceMode) {
        const audio = new Audio('https://www.myinstants.com/media/sounds/laser.mp3');
        audio.volume = 0.1;
        audio.play().catch(() => {}); // Ignore audio errors
      }
    }, [performanceMode]);

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      if (touch) {
        gameStateRef.current.mousePosition.x = touch.clientX - rect.left;
        gameStateRef.current.mousePosition.y = touch.clientY - rect.top;
        handleMouseClick();
      }
    };

    // Add event listeners with proper options for mobile
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('click', handleMouseClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    
    // Additional mobile-specific events
    if (isMobile) {
      canvas.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });
      canvas.addEventListener('touchcancel', (e) => e.preventDefault(), { passive: false });
    }

    let animationId: number;
    let lastTime = 0;
    // Reduced FPS for mobile devices
    const fps = performanceMode ? 30 : 60;
    const frameTime = 1000 / fps;
    
    const gameLoop = (timestamp: number) => {
      if (!gameStarted) return;
      
      const elapsed = timestamp - lastTime;
      if (elapsed < frameTime) {
        animationId = requestAnimationFrame(gameLoop);
        return;
      }
      lastTime = timestamp - (elapsed % frameTime);
      
      const gameRunning = updateGameState();
      if (!gameRunning) return;
      
      renderGame();
      
      animationId = requestAnimationFrame(gameLoop);
    };

    animationId = requestAnimationFrame(gameLoop);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('click', handleMouseClick);
      canvas.removeEventListener('touchstart', handleTouchStart);
      
      // Remove mobile-specific event listeners
      if (isMobile) {
        canvas.removeEventListener('touchend', (e) => e.preventDefault());
        canvas.removeEventListener('touchcancel', (e) => e.preventDefault());
      }
      
      cancelAnimationFrame(animationId);
    };
  }, [gameStarted]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className={`${isMobile ? 'py-4' : 'min-h-screen pt-20'} px-4 relative`}>
      <RetroFrame className={`${isMobile ? 'max-w-sm' : 'max-w-2xl'} mx-auto`} variant="dark">
        <div className="text-center">
          <p className={`font-vt323 text-pink-500 mb-4 ${isMobile ? 'text-lg' : 'text-xl'}`}>
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
          
          <div className={`relative w-full mx-auto ${isMobile ? 'max-w-[300px] aspect-[4/3]' : 'max-w-[600px] aspect-[3/2]'}`}>
            <canvas
              ref={canvasRef}
              width={isMobile ? 300 : 600}
              height={isMobile ? 225 : 400}
              className="absolute top-0 left-0 w-full h-full cursor-crosshair touch-none"
              style={{ 
                backgroundColor: '#080010',
                touchAction: 'none',
                userSelect: 'none'
              }}
            />
            <div className="absolute inset-0 pointer-events-none scanline"></div>
            {performanceMode && (
              <div className="absolute top-2 left-2 bg-black/50 text-green-400 font-vt323 text-xs px-2 py-1 rounded">
                PERFORMANCE MODE
              </div>
            )}
          </div>
          
          <div className="mt-4 text-cyan-400/80 font-vt323 text-sm tracking-wide">
            MOVE: {isMobile ? 'TOUCH' : 'MOUSE'} | FIRE: {isMobile ? 'TAP' : 'CLICK'}
          </div>
          
          {isMobile && (
            <div className="mt-4 p-4 bg-cyberpunk-black/50 border border-neon-cyan/30 rounded-lg">
              <p className="font-vt323 text-neon-cyan text-sm text-center">
                💡 TIP: Touch and drag to move, tap to shoot!
              </p>
            </div>
          )}
          
          {!isMobile && (
            <div className="mt-10 relative overflow-hidden">
              <div className="text-center">
                <h3 className="font-vt323 text-2xl text-neon-pink mb-4 tracking-widest glow-text-pink">
                  TECHNICAL EXPERTISE
                </h3>
                <div className="h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent mb-6"></div>
              </div>
            
            <div className={`bg-cyberpunk-black/40 border-2 border-neon-cyan glow-border-cyan rounded-lg relative ${isMobile ? 'p-3' : 'p-4'}`}>
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-neon-pink to-neon-purple rounded-full blur-xl opacity-30"></div>
              <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-gradient-to-tl from-neon-cyan to-neon-blue rounded-full blur-xl opacity-30"></div>
              
              <p className={`text-white font-vt323 mb-4 relative z-10 ${isMobile ? 'text-sm' : 'text-lg'}`}>
                <span className="text-neon-pink">&gt; </span>
                Specialized in full-stack development with expertise in React, Python machine learning, and C# applications. Building innovative solutions that bridge engineering and technology.
              </p>
              
              <div className={`flex justify-center items-center relative z-10 ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
                <div className={`px-3 py-1 bg-neon-pink/20 text-neon-pink font-vt323 rounded-md border border-neon-pink ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  #PYTHON
                </div>
                <div className={`px-3 py-1 bg-neon-cyan/20 text-neon-cyan font-vt323 rounded-md border border-neon-cyan ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  #REACT
                </div>
                <div className={`px-3 py-1 bg-neon-purple/20 text-neon-purple font-vt323 rounded-md border border-neon-purple ${isMobile ? 'text-xs' : 'text-sm'}`}>
                  #C#
                </div>
              </div>
              
              <div className="scanline absolute inset-0 pointer-events-none"></div>
            </div>
          </div>
          )}
        </div>
      </RetroFrame>
    </div>
  );
}