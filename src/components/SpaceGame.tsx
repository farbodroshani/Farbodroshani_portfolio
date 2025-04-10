import { useCallback, useEffect, useRef, useState } from 'react';
import RetroFrame from './RetroFrame';

export default function SpaceGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const gameStateRef = useRef({
    player: { x: 0, y: 0, width: 30, height: 30, speed: 5 },
    bullets: [] as { x: number; y: number }[],
    enemies: [] as { x: number; y: number; width: number; height: number; health: number; speed: number }[],
    mousePosition: { x: 0, y: 0 },
    lightningEffect: { active: false, duration: 0, x: 0, y: 0 }
  });

  // Drawing functions outside of the effect for better performance
  const drawLightning = useCallback((ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const gameState = gameStateRef.current;
    gameState.lightningEffect.active = true;
    gameState.lightningEffect.duration = 10;
    gameState.lightningEffect.x = x;
    gameState.lightningEffect.y = y;
    
    // Play lightning sound
    const audio = new Audio('https://www.myinstants.com/media/sounds/thunder.mp3');
    audio.volume = 0.2;
    audio.play();
  }, []);

  const drawLaserBeam = useCallback((ctx: CanvasRenderingContext2D) => {
    const { player, mousePosition } = gameStateRef.current;
    
    const gradient = ctx.createLinearGradient(
      player.x + player.width / 2, 
      player.y, 
      mousePosition.x, 
      mousePosition.y
    );
    
    gradient.addColorStop(0, '#ff0050');
    gradient.addColorStop(0.5, '#ff00ff');
    gradient.addColorStop(1, '#00ffff');
    
    ctx.beginPath();
    ctx.moveTo(player.x + player.width / 2, player.y);
    
    // Create zig-zag pattern for laser
    const segments = 5;
    const offsetMax = 10;
    
    for (let i = 1; i <= segments; i++) {
      const ratio = i / segments;
      const x = player.x + player.width / 2 + (mousePosition.x - player.x - player.width / 2) * ratio;
      const y = player.y + (mousePosition.y - player.y) * ratio;
      
      // Add random offset for zigzag effect (less random for performance)
      const offset = (Math.random() * offsetMax) - (offsetMax / 2);
      
      ctx.lineTo(x + offset, y);
    }
    
    ctx.lineTo(mousePosition.x, mousePosition.y);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Add glow effect
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
  }, []);

  // Game logic separated for better performance
  const updateGameState = useCallback(() => {
    const gameState = gameStateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return true;

    // Move player towards mouse X position
    if (gameState.mousePosition.x > gameState.player.x + gameState.player.width / 2 + 5) {
      gameState.player.x += gameState.player.speed;
    } else if (gameState.mousePosition.x < gameState.player.x + gameState.player.width / 2 - 5) {
      gameState.player.x -= gameState.player.speed;
    }

    // Keep player within canvas bounds
    if (gameState.player.x < 0) gameState.player.x = 0;
    if (gameState.player.x > canvas.width - gameState.player.width) {
      gameState.player.x = canvas.width - gameState.player.width;
    }

    // Update bullets
    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
      const bullet = gameState.bullets[i];
      bullet.y -= 10;

      if (bullet.y < 0) {
        gameState.bullets.splice(i, 1);
      }
    }

    // Spawn enemies
    const spawnRate = 0.02 + Math.min(score / 2000, 0.03);
    if (Math.random() < spawnRate && gameState.enemies.length < 5) {
      const enemyWidth = 40 + Math.floor(Math.random() * 20);
      const enemyHeight = 30 + Math.floor(Math.random() * 15);
      
      gameState.enemies.push({
        x: Math.random() * (canvas.width - enemyWidth),
        y: -enemyHeight,
        width: enemyWidth,
        height: enemyHeight,
        health: 1 + Math.floor(score / 1000),
        speed: 1 + Math.random() * 1.5
      });
    }

    // Update enemies
    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
      const enemy = gameState.enemies[i];
      enemy.y += enemy.speed;

      // Check collision with bullets
      let enemyHit = false;
      for (let j = gameState.bullets.length - 1; j >= 0; j--) {
        const bullet = gameState.bullets[j];
        if (bullet.x > enemy.x && 
            bullet.x < enemy.x + enemy.width &&
            bullet.y < enemy.y + enemy.height &&
            bullet.y > enemy.y) {
          
          gameState.bullets.splice(j, 1);
          enemy.health--;
          
          if (enemy.health <= 0) {
            gameState.enemies.splice(i, 1);
            setScore(prev => prev + 10);
            
            if (Math.random() < 0.1) {
              const ctx = canvas.getContext('2d');
              if (ctx) drawLightning(ctx, enemy.x, enemy.y);
            }
            enemyHit = true;
            break;
          }
        }
      }

      if (enemyHit) continue;

      // Check collision with player
      if (enemy.y + enemy.height > gameState.player.y &&
          enemy.x < gameState.player.x + gameState.player.width &&
          enemy.x + enemy.width > gameState.player.x &&
          enemy.y < gameState.player.y + gameState.player.height) {
        
        setHighScore(prev => Math.max(prev, score));
        setGameOver(true);
        setGameStarted(false);
        return false;
      }

      if (enemy.y > canvas.height) {
        gameState.enemies.splice(i, 1);
      }
    }
    
    return true;
  }, [score, drawLightning]);

  const renderGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gameState = gameStateRef.current;

    // Use solid black background
    ctx.fillStyle = '#080010'; // solid black
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid lines (Blood Dragon style)
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    // Horizontal grid lines
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
    
    // Lightning effect if active
    if (gameState.lightningEffect.active) {
      ctx.fillStyle = 'rgba(255, 0, 255, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      gameState.lightningEffect.duration--;
      if (gameState.lightningEffect.duration <= 0) {
        gameState.lightningEffect.active = false;
      }
    }

    // Draw player with neon glow
    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ff0050';
    ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);
    ctx.shadowBlur = 0;
    
    // Draw dragon eye
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(gameState.player.x + gameState.player.width / 2, gameState.player.y + 10, 5, 0, Math.PI * 2);
    ctx.fill();

    // Draw bullets
    for (const bullet of gameState.bullets) {
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(bullet.x - 2, bullet.y, 4, 15);
      ctx.shadowBlur = 0;
    }

    // Draw enemies
    for (const enemy of gameState.enemies) {
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#4B2A5A';
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      ctx.shadowBlur = 0;
      
      // Add dragon eyes
      ctx.fillStyle = '#ff5500';
      ctx.beginPath();
      ctx.arc(enemy.x + 10, enemy.y + 10, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(enemy.x + enemy.width - 10, enemy.y + 10, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add fog effect
    const fogGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    fogGradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)'); // More transparent at top
    fogGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)'); // Slightly more fog in middle
    fogGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)'); // More fog at bottom but still transparent
    ctx.fillStyle = fogGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);
  
  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Initialize game state
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

    // Event listeners for mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      gameStateRef.current.mousePosition.x = e.clientX - rect.left;
      gameStateRef.current.mousePosition.y = e.clientY - rect.top;
    };

    // Event listener for mouse click (shooting)
    const handleMouseClick = () => {
      gameStateRef.current.bullets.push({
        x: gameStateRef.current.player.x + gameStateRef.current.player.width / 2,
        y: gameStateRef.current.player.y
      });
      
      // Play sound effect
      const audio = new Audio('https://www.myinstants.com/media/sounds/laser.mp3');
      audio.volume = 0.2;
      audio.play();
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleMouseClick);

    // Game loop
    let animationId: number;
    let lastTime = 0;
    const fps = 60;
    const frameTime = 1000 / fps;
    
    const gameLoop = (timestamp: number) => {
      if (!gameStarted) return;
      
      // Throttle frame rate for better performance
      const elapsed = timestamp - lastTime;
      if (elapsed < frameTime) {
        animationId = requestAnimationFrame(gameLoop);
        return;
      }
      lastTime = timestamp - (elapsed % frameTime);
      
      // Update game state
      const gameRunning = updateGameState();
      if (!gameRunning) return;
      
      // Render the game
      renderGame();
      
      animationId = requestAnimationFrame(gameLoop);
    };

    // Start game loop
    animationId = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleMouseClick);
      cancelAnimationFrame(animationId);
    };
  }, [gameStarted, drawLaserBeam, updateGameState, renderGame]);

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
              onClick={() => {
                setGameStarted(true);
                setGameOver(false);
                setScore(0);
              }}
              className="bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-vt323 text-xl px-6 py-3 rounded-lg transition-all mb-4 tracking-widest glow-button"
            >
              {gameOver ? 'TRY AGAIN' : 'START GAME'}
            </button>
          ) : null}
          
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="cursor-crosshair mx-auto w-full max-w-[600px] h-auto"
              style={{ backgroundColor: '#080010' }}
            />
            
            <div className="absolute inset-0 pointer-events-none scanline"></div>
          </div>
          
          <div className="mt-4 text-cyan-400/80 font-vt323 text-sm tracking-wide">
            MOVE: MOUSE | FIRE: CLICK
          </div>
        </div>
      </RetroFrame>
    </div>
  );
}