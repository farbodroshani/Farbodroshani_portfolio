import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import GlitchText from './GlitchText';
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
  const gameStateRef = useRef({
    player: { x: 0, y: 0, width: 30, height: 30, speed: 5 },
    bullets: [] as Bullet[],
    enemies: [] as Enemy[],
    mousePosition: { x: 0, y: 0 },
    lightningEffect: { active: false, duration: 0, x: 0, y: 0 }
  });

  const drawLightning = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    const gameState = gameStateRef.current;
    gameState.lightningEffect.active = true;
    gameState.lightningEffect.duration = 10;
    gameState.lightningEffect.x = x;
    gameState.lightningEffect.y = y;
    
    const audio = new Audio('https://www.myinstants.com/media/sounds/thunder.mp3');
    audio.volume = 0.2;
    audio.play();
  };

  const drawLaserBeam = (ctx: CanvasRenderingContext2D) => {
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
    
    const segments = 5;
    const offsetMax = 10;
    
    for (let i = 1; i <= segments; i++) {
      const ratio = i / segments;
      const x = player.x + player.width / 2 + (mousePosition.x - player.x - player.width / 2) * ratio;
      const y = player.y + (mousePosition.y - player.y) * ratio;
      
      const offset = (Math.random() * offsetMax) - (offsetMax / 2);
      
      ctx.lineTo(x + offset, y);
    }
    
    ctx.lineTo(mousePosition.x, mousePosition.y);
    ctx.strokeStyle = gradient;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;
  };

  const updateGameState = () => {
    const gameState = gameStateRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return true;

    if (gameState.mousePosition.x > gameState.player.x + gameState.player.width / 2 + 5) {
      gameState.player.x += gameState.player.speed;
    } else if (gameState.mousePosition.x < gameState.player.x + gameState.player.width / 2 - 5) {
      gameState.player.x -= gameState.player.speed;
    }

    if (gameState.player.x < 0) gameState.player.x = 0;
    if (gameState.player.x > canvas.width - gameState.player.width) {
      gameState.player.x = canvas.width - gameState.player.width;
    }

    for (let i = gameState.bullets.length - 1; i >= 0; i--) {
      const bullet = gameState.bullets[i];
      bullet.y -= 10;

      if (bullet.y < 0) {
        gameState.bullets.splice(i, 1);
      }
    }

    const spawnRate = 0.03;
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

    for (let i = gameState.enemies.length - 1; i >= 0; i--) {
      const enemy = gameState.enemies[i];
      enemy.y += enemy.speed;

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
  };

  const renderGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const gameState = gameStateRef.current;

    ctx.fillStyle = '#080010';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    
    for (let i = 0; i < canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }
    
    if (gameState.lightningEffect.active) {
      ctx.fillStyle = 'rgba(255, 0, 255, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      gameState.lightningEffect.duration--;
      if (gameState.lightningEffect.duration <= 0) {
        gameState.lightningEffect.active = false;
      }
    }

    ctx.shadowColor = '#ff00ff';
    ctx.shadowBlur = 10;
    ctx.fillStyle = '#ff0050';
    ctx.fillRect(gameState.player.x, gameState.player.y, gameState.player.width, gameState.player.height);
    ctx.shadowBlur = 0;
    
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(gameState.player.x + gameState.player.width / 2, gameState.player.y + 10, 5, 0, Math.PI * 2);
    ctx.fill();

    for (const bullet of gameState.bullets) {
      ctx.shadowColor = '#00ffff';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#00ffff';
      ctx.fillRect(bullet.x - 2, bullet.y, 4, 15);
      ctx.shadowBlur = 0;
    }

    for (const enemy of gameState.enemies) {
      ctx.shadowColor = '#ff00ff';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#4B2A5A';
      ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      ctx.shadowBlur = 0;
      
      ctx.fillStyle = '#ff5500';
      ctx.beginPath();
      ctx.arc(enemy.x + 10, enemy.y + 10, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(enemy.x + enemy.width - 10, enemy.y + 10, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    const fogGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    fogGradient.addColorStop(0, 'rgba(0, 0, 0, 0.1)');
    fogGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
    fogGradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
    ctx.fillStyle = fogGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  
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
      gameStateRef.current.mousePosition.x = touch.clientX - rect.left;
      gameStateRef.current.mousePosition.y = touch.clientY - rect.top;
    };

    const handleMouseClick = () => {
      gameStateRef.current.bullets.push({
        x: gameStateRef.current.player.x + gameStateRef.current.player.width / 2,
        y: gameStateRef.current.player.y
      });
      
      const audio = new Audio('https://www.myinstants.com/media/sounds/laser.mp3');
      audio.volume = 0.2;
      audio.play();
    };

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      handleMouseClick();
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('click', handleMouseClick);
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });

    let animationId: number;
    let lastTime = 0;
    const fps = 60;
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
      cancelAnimationFrame(animationId);
    };
  }, [gameStarted]);

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
              width={600}
              height={400}
              className="absolute top-0 left-0 w-full h-full cursor-crosshair touch-none"
              style={{ backgroundColor: '#080010' }}
            />
            <div className="absolute inset-0 pointer-events-none scanline"></div>
          </div>
          
          <div className="mt-4 text-cyan-400/80 font-vt323 text-sm tracking-wide">
            MOVE: {window.innerWidth <= 768 ? 'TOUCH' : 'MOUSE'} | FIRE: {window.innerWidth <= 768 ? 'TAP' : 'CLICK'}
          </div>
          
          <div className="mt-10 relative overflow-hidden">
            <div className="text-center">
              <h3 className="font-vt323 text-2xl text-neon-pink mb-4 tracking-widest glow-text-pink">
                FANBASE OF BOMBARDIRO CROCODILO!
              </h3>
              <div className="h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent mb-6"></div>
            </div>
            
            <div className="bg-cyberpunk-black/40 border-2 border-neon-cyan glow-border-cyan p-4 rounded-lg relative">
              <div className="absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br from-neon-pink to-neon-purple rounded-full blur-xl opacity-30"></div>
              <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-gradient-to-tl from-neon-cyan to-neon-blue rounded-full blur-xl opacity-30"></div>
              
              <p className="text-white font-vt323 text-lg mb-4 relative z-10">
                <span className="text-neon-pink">&gt; </span>
                Official member of the legendary Bombardiro Crocodilo fan community. Fighting for digital justice and pixel perfection across the multiverse.
              </p>
              
              <div className="flex justify-center items-center space-x-3 relative z-10">
                <div className="px-3 py-1 bg-neon-pink/20 text-neon-pink font-vt323 rounded-md border border-neon-pink text-sm">
                  #BOMBARDIRO
                </div>
                <div className="px-3 py-1 bg-neon-cyan/20 text-neon-cyan font-vt323 rounded-md border border-neon-cyan text-sm">
                  #CROCODILO
                </div>
                <div className="px-3 py-1 bg-neon-purple/20 text-neon-purple font-vt323 rounded-md border border-neon-purple text-sm">
                  #PIXELFANS
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