"use client"; // 声明这是一个客户端组件

import React, { useState, useEffect, useRef, useCallback } from 'react';

// 定义游戏元素类型
interface Position {
  x: number;
  y: number;
}

interface Size {
  width: number;
  height: number;
}

interface GameObject {
  pos: Position;
  size: Size;
  draw: (ctx: CanvasRenderingContext2D, canvasWidth: number) => void; // Pass canvasWidth for context if needed
  update?: (delta: number, speed: number, canvasWidth: number) => void; // Pass canvasWidth
  getRect: () => Rect;
}

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

// --- 游戏常量 (Height and relative sizes) ---
// 注意：CANVAS_WIDTH 现在是动态的
const CANVAS_HEIGHT = 300;
const GROUND_Y = CANVAS_HEIGHT - 50;
const CHICKEN_START_X = 50;
const CHICKEN_WIDTH = 45; // Slightly wider for new design
const CHICKEN_HEIGHT = 40;
const CHICKEN_DUCK_HEIGHT = 25;
const GRAVITY = 0.6;
const JUMP_FORCE = -12;
const OBSTACLE_BASE_WIDTH = 25; // Base width for obstacles
const CACTUS_TALL_HEIGHT = 55;
const CACTUS_SHORT_HEIGHT = 40;
const PTERODACTYL_WIDTH = 50;
const PTERODACTYL_HEIGHT = 30;
const PTERODACTYL_Y_HIGH = GROUND_Y - CHICKEN_HEIGHT - 30; // Adjust fly height
const PTERODACTYL_Y_LOW = GROUND_Y - CHICKEN_DUCK_HEIGHT - PTERODACTYL_HEIGHT - 15; // Adjust fly height
const INITIAL_SPEED = 5;
const SPEED_INCREASE = 0.001;
const OBSTACLE_SPAWN_RATE_MIN = 1200; // ms (Adjusted for potentially wider screen)
const OBSTACLE_SPAWN_RATE_MAX = 2800; // ms (Adjusted)

// --- 工具函数 ---
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function checkCollision(rect1: Rect, rect2: Rect): boolean {
    // Add slight padding to make collision less harsh
    const padding = 5;
    return (
        rect1.x < rect2.x + rect2.width - padding &&
        rect1.x + rect1.width > rect2.x + padding &&
        rect1.y < rect2.y + rect2.height - padding &&
        rect1.y + rect1.height > rect2.y + padding
    );
}

// --- 游戏对象类 ---

// 小鸡
class Chicken implements GameObject {
  pos: Position;
  size: Size;
  velocityY: number = 0;
  isJumping: boolean = false;
  isDucking: boolean = false;
  baseY: number;
  legPhase: number = 0; // For running animation
  legTimer: number = 0;

  constructor() {
    this.size = { width: CHICKEN_WIDTH, height: CHICKEN_HEIGHT };
    this.baseY = GROUND_Y - this.size.height;
    this.pos = { x: CHICKEN_START_X, y: this.baseY };
  }

  jump() {
    if (!this.isJumping && !this.isDucking) {
      this.velocityY = JUMP_FORCE;
      this.isJumping = true;
    }
  }

  duck(isDucking: boolean) {
      if (this.isJumping) return;

      if (isDucking && !this.isDucking) {
          this.isDucking = true;
          this.size.height = CHICKEN_DUCK_HEIGHT;
          this.pos.y = GROUND_Y - this.size.height;
      } else if (!isDucking && this.isDucking) {
          this.isDucking = false;
          this.size.height = CHICKEN_HEIGHT;
          this.pos.y = this.baseY;
      }
  }

  update(delta: number) {
    // Gravity
    this.velocityY += GRAVITY;
    this.pos.y += this.velocityY;

    // Ground check
    const groundPosition = this.isDucking ? GROUND_Y - CHICKEN_DUCK_HEIGHT : GROUND_Y - CHICKEN_HEIGHT;
    if (this.pos.y >= groundPosition) {
      this.pos.y = groundPosition;
      this.velocityY = 0;
      this.isJumping = false;
      if (this.isDucking) {
          this.pos.y = GROUND_Y - CHICKEN_DUCK_HEIGHT;
      } else {
          this.size.height = CHICKEN_HEIGHT;
      }
    }

    // Leg animation timer (only when on ground and not ducking)
    if (!this.isJumping && !this.isDucking) {
        this.legTimer += delta;
        if (this.legTimer > 100) { // Switch leg phase every 100ms
            this.legPhase = (this.legPhase + 1) % 2;
            this.legTimer = 0;
        }
    } else {
        this.legTimer = 0; // Reset timer if jumping or ducking
        this.legPhase = 0; // Default leg position
    }
  }

  // ***** FIX: Added canvasWidth parameter *****
  draw(ctx: CanvasRenderingContext2D, canvasWidth: number) {
    ctx.save(); // Save context state
    ctx.translate(this.pos.x, this.pos.y); // Move origin to chicken's position

    // Body (Orange)
    ctx.fillStyle = '#FFA500'; // Orange
    ctx.beginPath();
    if (this.isDucking) {
        // Ducking body (flatter)
        ctx.ellipse(this.size.width / 2, this.size.height * 0.6, this.size.width / 2, this.size.height * 0.4, 0, 0, Math.PI * 2);
    } else {
        // Standing body
        ctx.ellipse(this.size.width / 2, this.size.height / 2, this.size.width / 2.2, this.size.height / 2, 0, 0, Math.PI * 2);
    }
    ctx.fill();

    // Head (Slightly lighter orange)
    ctx.fillStyle = '#FFC04D';
    ctx.beginPath();
    const headX = this.size.width * 0.7;
    const headY = this.isDucking ? this.size.height * 0.4 : this.size.height * 0.35;
    const headRadius = this.isDucking ? this.size.width * 0.18 : this.size.width * 0.2;
    ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
    ctx.fill();

    // Eye (Black)
    ctx.fillStyle = 'black';
    ctx.beginPath();
    const eyeX = headX + headRadius * 0.3;
    const eyeY = headY - headRadius * 0.1;
    ctx.arc(eyeX, eyeY, 3, 0, Math.PI * 2);
    ctx.fill();

    // Beak (Yellow)
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    const beakX = headX + headRadius * 0.8;
    const beakY = headY + headRadius * 0.2;
    ctx.moveTo(beakX, beakY);
    ctx.lineTo(beakX + 8, beakY + 3);
    ctx.lineTo(beakX, beakY + 6);
    ctx.closePath();
    ctx.fill();

    // Legs (Orange - only draw when not ducking)
    if (!this.isDucking) {
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 4;
        ctx.beginPath();
        const legY = this.size.height;
        const legX1 = this.size.width * 0.35;
        const legX2 = this.size.width * 0.65;

        if (this.legPhase === 0) {
            // Leg 1 forward, Leg 2 back
            ctx.moveTo(legX1, legY * 0.8); ctx.lineTo(legX1 + 5, legY + 3); // Leg 1
            ctx.moveTo(legX2, legY * 0.8); ctx.lineTo(legX2 - 5, legY + 3); // Leg 2
        } else {
            // Leg 1 back, Leg 2 forward
            ctx.moveTo(legX1, legY * 0.8); ctx.lineTo(legX1 - 5, legY + 3); // Leg 1
            ctx.moveTo(legX2, legY * 0.8); ctx.lineTo(legX2 + 5, legY + 3); // Leg 2
        }
        ctx.stroke();
    }


    ctx.restore(); // Restore context state
  }

  getRect(): Rect {
     // Adjust bounding box slightly for better visual fit
    const paddingX = 5;
    const paddingY = 3;
    return {
        x: this.pos.x + paddingX,
        y: this.pos.y + paddingY,
        width: this.size.width - paddingX * 2,
        height: this.size.height - paddingY
    };
  }
}

// 仙人掌
class Cactus implements GameObject {
  pos: Position;
  size: Size;
  type: 'short' | 'tall' | 'group'; // Add group type
  numSegments: number;

  constructor(canvasWidth: number) {
    const rand = Math.random();
    if (rand < 0.4) {
        this.type = 'short';
        this.size = { width: OBSTACLE_BASE_WIDTH, height: CACTUS_SHORT_HEIGHT };
    } else if (rand < 0.8) {
        this.type = 'tall';
        this.size = { width: OBSTACLE_BASE_WIDTH * 1.2, height: CACTUS_TALL_HEIGHT };
    } else {
        this.type = 'group';
        // Group width is wider, height is based on short cactus
        this.size = { width: OBSTACLE_BASE_WIDTH * 2.5, height: CACTUS_SHORT_HEIGHT };
    }

    this.numSegments = randomInt(2, 4); // For drawing detail
    this.pos = {
      x: canvasWidth,
      y: GROUND_Y - this.size.height,
    };
  }

  update(delta: number, speed: number) {
    this.pos.x -= speed * delta * 0.1;
  }

  // ***** FIX: Added canvasWidth parameter *****
  draw(ctx: CanvasRenderingContext2D, canvasWidth: number) {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    ctx.fillStyle = '#2E8B57'; // SeaGreen
    ctx.strokeStyle = '#228B22'; // ForestGreen
    ctx.lineWidth = 2;

    if (this.type === 'group') {
        // Draw a group of 2-3 small cacti
        const cactusWidth = OBSTACLE_BASE_WIDTH * 0.8;
        const cactusHeight = this.size.height;
        // Cactus 1 (left)
        this.drawSingleCactus(ctx, 0, 0, cactusWidth, cactusHeight);
        // Cactus 2 (right)
        this.drawSingleCactus(ctx, cactusWidth * 1.5, 0, cactusWidth, cactusHeight);
        // Optional Cactus 3 (middle back)
        if (Math.random() < 0.5) {
             this.drawSingleCactus(ctx, cactusWidth * 0.75, -5, cactusWidth*0.8, cactusHeight*0.9);
        }

    } else {
        // Draw single tall or short cactus
         this.drawSingleCactus(ctx, 0, 0, this.size.width, this.size.height);
         // Add arms to tall cactus
         if (this.type === 'tall') {
             const armWidth = this.size.width * 0.3;
             const armHeight = this.size.height * 0.5;
             // Left Arm
             ctx.fillRect(this.size.width * 0.1, this.size.height * 0.2, armWidth, armHeight * 0.6); // Base
             ctx.fillRect(this.size.width * 0.1 - armWidth*0.5, this.size.height * 0.2, armWidth*0.5, armHeight * 0.2); // Top part
             // Right Arm
             ctx.fillRect(this.size.width * 0.6, this.size.height * 0.3, armWidth, armHeight * 0.6); // Base
             ctx.fillRect(this.size.width * 0.6 + armWidth, this.size.height * 0.3, armWidth*0.5, armHeight * 0.2); // Top part

             ctx.strokeRect(this.size.width * 0.1, this.size.height * 0.2, armWidth, armHeight * 0.6);
             ctx.strokeRect(this.size.width * 0.1 - armWidth*0.5, this.size.height * 0.2, armWidth*0.5, armHeight * 0.2);
             ctx.strokeRect(this.size.width * 0.6, this.size.height * 0.3, armWidth, armHeight * 0.6);
             ctx.strokeRect(this.size.width * 0.6 + armWidth, this.size.height * 0.3, armWidth*0.5, armHeight * 0.2);
         }
    }

    ctx.restore();
  }

  // Helper to draw one cactus body
  drawSingleCactus(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
      // Main body rounded rect
      ctx.beginPath();
      ctx.moveTo(x + 5, y);
      ctx.lineTo(x + w - 5, y);
      ctx.arcTo(x + w, y, x + w, y + 5, 5);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x, y + 5);
      ctx.arcTo(x, y, x + 5, y, 5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Vertical lines for texture
      ctx.beginPath();
      for (let i = 1; i < this.numSegments; i++) {
          const lineX = x + (w / this.numSegments) * i;
          ctx.moveTo(lineX, y + 5);
          ctx.lineTo(lineX, y + h - 5);
      }
      ctx.lineWidth = 1;
      ctx.strokeStyle = '#556B2F'; // DarkOliveGreen
      ctx.stroke();
  }


   getRect(): Rect {
    // Adjust bounding box for groups
    return {
        x: this.pos.x,
        y: this.pos.y,
        width: this.size.width,
        height: this.size.height
    };
  }
}

// 翼手龙
class Pterodactyl implements GameObject {
    pos: Position;
    size: Size;
    wingPhase: number = 0; // 0: up, 1: down
    wingTimer: number = 0;
    wingSpeed: number = 120; // ms per wing flap phase

    constructor(canvasWidth: number) {
        this.size = { width: PTERODACTYL_WIDTH, height: PTERODACTYL_HEIGHT };
        const flyHeight = Math.random() < 0.4 ? PTERODACTYL_Y_LOW : PTERODACTYL_Y_HIGH;
        this.pos = {
            x: canvasWidth,
            y: flyHeight,
        };
    }

    update(delta: number, speed: number) {
        this.pos.x -= (speed + 1) * delta * 0.1; // Slightly faster than ground obstacles

        // Wing animation
        this.wingTimer += delta;
        if (this.wingTimer > this.wingSpeed) {
            this.wingPhase = (this.wingPhase + 1) % 2;
            this.wingTimer = 0;
        }
    }

    // ***** FIX: Added canvasWidth parameter *****
    draw(ctx: CanvasRenderingContext2D, canvasWidth: number) {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.fillStyle = '#A9A9A9'; // DarkGray
        ctx.strokeStyle = '#696969'; // DimGray
        ctx.lineWidth = 1;

        // Body
        const bodyWidth = this.size.width * 0.6;
        const bodyHeight = this.size.height * 0.5;
        const bodyX = this.size.width * 0.2;
        const bodyY = this.size.height * 0.3;
        ctx.beginPath();
        ctx.ellipse(bodyX + bodyWidth / 2, bodyY + bodyHeight / 2, bodyWidth / 2, bodyHeight / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();


        // Head
        const headRadius = this.size.height * 0.25;
        const headX = this.size.width * 0.85;
        const headY = this.size.height * 0.4;
        ctx.beginPath();
        ctx.arc(headX, headY, headRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        // Beak
        ctx.beginPath();
        ctx.moveTo(headX + headRadius * 0.8, headY - headRadius * 0.2);
        ctx.lineTo(headX + headRadius * 2.5, headY);
        ctx.lineTo(headX + headRadius * 0.8, headY + headRadius * 0.2);
        ctx.closePath();
        ctx.fill();


        // Wings
        const wingStartX = this.size.width * 0.3;
        const wingStartY = this.size.height * 0.5;
        const wingLength = this.size.width * 0.7;
        const wingTipX = wingStartX - wingLength * 0.3; // Wings angled back slightly

        ctx.beginPath();
        if (this.wingPhase === 0) { // Wings up
            // Top wing line
            ctx.moveTo(wingStartX, wingStartY);
            ctx.quadraticCurveTo(wingStartX - wingLength * 0.5, wingStartY - this.size.height * 1.2, wingTipX, wingStartY - this.size.height * 0.5);
            // Bottom wing line back to body
            ctx.lineTo(wingTipX + 10, wingStartY + 5); // Add thickness
             ctx.quadraticCurveTo(wingStartX - wingLength * 0.3, wingStartY + 8, wingStartX, wingStartY + 3);
        } else { // Wings down
            // Top wing line
            ctx.moveTo(wingStartX, wingStartY);
             ctx.quadraticCurveTo(wingStartX - wingLength * 0.4, wingStartY + this.size.height * 0.8, wingTipX, wingStartY + this.size.height * 0.6);
             // Bottom wing line back to body
             ctx.lineTo(wingTipX + 10, wingStartY - 5); // Add thickness
             ctx.quadraticCurveTo(wingStartX - wingLength * 0.3, wingStartY - 8, wingStartX, wingStartY - 3);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();


        ctx.restore();
    }

    getRect(): Rect {
        // Slightly adjust bounding box
        return {
            x: this.pos.x,
            y: this.pos.y,
            width: this.size.width,
            height: this.size.height
        };
    }
}


// --- React 组件 ---
const ChickenRunnerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidthRef = useRef<number>(800); // Default width, will be updated
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameSpeed, setGameSpeed] = useState<number>(INITIAL_SPEED);

  // Game objects refs
  const chickenRef = useRef<Chicken>(new Chicken());
  const obstaclesRef = useRef<GameObject[]>([]);
  const lastTimeRef = useRef<number>(0);
  const scoreTimerRef = useRef<number>(0);
  const obstacleSpawnTimerRef = useRef<number>(0);
  const nextSpawnTimeRef = useRef<number>(randomInt(OBSTACLE_SPAWN_RATE_MIN, OBSTACLE_SPAWN_RATE_MAX));
  const animationFrameIdRef = useRef<number | null>(null);
  const isDuckingRef = useRef<boolean>(false);

  // ***** FIX: Moved useCallback definitions before useEffect *****

  // --- Game Logic Callbacks (Reset, GameOver, Input, Resize, Loop) ---

  const resetGame = useCallback(() => {
    // console.log("resetGame called.");
    chickenRef.current = new Chicken(); // Recreate chicken
    obstaclesRef.current = [];
    setScore(0);
    setGameSpeed(INITIAL_SPEED);
    setIsGameOver(false);
    setIsPlaying(true);
    lastTimeRef.current = performance.now();
    scoreTimerRef.current = 0;
    obstacleSpawnTimerRef.current = 0;
    nextSpawnTimeRef.current = randomInt(OBSTACLE_SPAWN_RATE_MIN, OBSTACLE_SPAWN_RATE_MAX);
    isDuckingRef.current = false;

    if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
    }
  }, []); // No dependencies needed here as it only resets state/refs

  const handleGameOver = useCallback(() => {
    // console.log("handleGameOver called.");
    setIsPlaying(false);
    setIsGameOver(true);
    if (score > highScore) {
      setHighScore(score);
    }
  }, [score, highScore]); // Depends on score and highScore

   const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (isGameOver || !isPlaying) { // Start or Restart
        resetGame();
      } else if (isPlaying) { // Jump during play
        chickenRef.current.jump();
      }
    } else if (e.code === 'ArrowDown') {
       e.preventDefault();
       if (isPlaying && !isDuckingRef.current) {
           isDuckingRef.current = true;
           chickenRef.current.duck(true);
       }
    }
  }, [isPlaying, isGameOver, resetGame]); // Depends on these states/functions

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
      if (e.code === 'ArrowDown') {
          e.preventDefault();
          if (isPlaying && isDuckingRef.current) {
              isDuckingRef.current = false;
              chickenRef.current.duck(false);
          }
      }
  }, [isPlaying]); // Depends on isPlaying

   const handleResize = useCallback(() => {
        if (canvasRef.current) {
            canvasWidthRef.current = window.innerWidth;
            canvasRef.current.width = canvasWidthRef.current;
            canvasRef.current.height = CANVAS_HEIGHT;

            if (!isPlaying && !isGameOver) {
                 const ctx = canvasRef.current.getContext('2d');
                 if (ctx) {
                     ctx.clearRect(0, 0, canvasWidthRef.current, CANVAS_HEIGHT);
                     ctx.fillStyle = '#888';
                     ctx.fillRect(0, GROUND_Y, canvasWidthRef.current, CANVAS_HEIGHT - GROUND_Y);
                 }
            }
            // console.log("Resized canvas width to:", canvasWidthRef.current);
        }
    }, [isPlaying, isGameOver]); // Depends on these states

  const gameLoop = useCallback((currentTime: number) => {
    if (!isPlaying) {
        animationFrameIdRef.current = null;
        return;
    }
     if (!canvasRef.current) {
         console.error("gameLoop: canvasRef.current is null!");
         setIsPlaying(false);
         return;
     }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) {
         console.error("gameLoop: Failed to get 2D context!");
         setIsPlaying(false);
         return;
    }

    const currentCanvasWidth = canvasWidthRef.current;
    const deltaTime = (currentTime - lastTimeRef.current);
    lastTimeRef.current = currentTime;

    // --- Updates ---
    chickenRef.current.update(deltaTime);
    obstaclesRef.current = obstaclesRef.current.filter(obstacle => {
      obstacle.update?.(deltaTime, gameSpeed, currentCanvasWidth);
      return obstacle.pos.x + obstacle.size.width > 0;
    });
    setGameSpeed(prevSpeed => prevSpeed + SPEED_INCREASE * deltaTime * 0.1);
    scoreTimerRef.current += deltaTime;
    if (scoreTimerRef.current >= 100) {
      setScore(prevScore => prevScore + 1);
      scoreTimerRef.current = 0;
    }

    // --- Spawning ---
    obstacleSpawnTimerRef.current += deltaTime;
    if (obstacleSpawnTimerRef.current >= nextSpawnTimeRef.current) {
      const isPterodactyl = Math.random() < 0.3 && score > 200;
      const newObstacle = isPterodactyl
        ? new Pterodactyl(currentCanvasWidth)
        : new Cactus(currentCanvasWidth);
      obstaclesRef.current.push(newObstacle);
      obstacleSpawnTimerRef.current = 0;
      const dynamicMin = Math.max(500, OBSTACLE_SPAWN_RATE_MIN - gameSpeed * 15);
      const dynamicMax = Math.max(1000, OBSTACLE_SPAWN_RATE_MAX - gameSpeed * 15);
      nextSpawnTimeRef.current = randomInt(dynamicMin, dynamicMax);
    }

    // --- Drawing ---
    ctx.clearRect(0, 0, currentCanvasWidth, CANVAS_HEIGHT);
    ctx.fillStyle = '#888';
    ctx.fillRect(0, GROUND_Y, currentCanvasWidth, CANVAS_HEIGHT - GROUND_Y);
    chickenRef.current.draw(ctx, currentCanvasWidth); // Pass width
    obstaclesRef.current.forEach(obstacle => obstacle.draw(ctx, currentCanvasWidth)); // Pass width
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`分数: ${score}`, currentCanvasWidth - 20, 30);
    ctx.fillText(`最高分: ${highScore}`, currentCanvasWidth - 20, 60);


    // --- Collision Detection ---
    const chickenRect = chickenRef.current.getRect();
    for (const obstacle of obstaclesRef.current) {
      if (checkCollision(chickenRect, obstacle.getRect())) {
        handleGameOver();
        return; // Stop this frame
      }
    }

    // --- Next Frame ---
    animationFrameIdRef.current = requestAnimationFrame(gameLoop);

  }, [isPlaying, gameSpeed, score, highScore, handleGameOver]); // Dependencies


  // --- Effects ---

    // Effect for initial setup and resize listener
    useEffect(() => {
        // console.log("Component Mounted. Adding listeners and setting initial size.");
        handleResize(); // Initial size set

        window.addEventListener('resize', handleResize);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Cleanup
        return () => {
            // console.log("Component Unmounting. Removing listeners.");
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
                animationFrameIdRef.current = null;
            }
        };
        // ***** FIX: Dependencies now include the stable callback functions *****
    }, [handleResize, handleKeyDown, handleKeyUp]);


  // Effect to start/stop game loop based on isPlaying
  useEffect(() => {
    if (isPlaying && !animationFrameIdRef.current) {
    //   console.log("Effect[isPlaying]: Starting game loop...");
      lastTimeRef.current = performance.now();
      animationFrameIdRef.current = requestAnimationFrame(gameLoop);
    //   console.log("Effect[isPlaying]: Requested frame:", animationFrameIdRef.current);
    } else if (!isPlaying && animationFrameIdRef.current) {
    //   console.log("Effect[isPlaying]: Stopping game loop. Cancelling frame:", animationFrameIdRef.current);
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
  }, [isPlaying, gameLoop]); // Depends on isPlaying and the stable gameLoop function


  return (
    // Use w-full to make the container take full width
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-0 md:p-4 w-full">
       {/* Header section */}
       <div className="text-center mb-2 px-4">
            <h1 className="text-3xl font-bold text-orange-600">小鸡快跑!（podwer by Gemini 2.5 Pro (experimental)）</h1>
            <p className="text-gray-700">按 <kbd className="kbd-style">空格键</kbd> 跳跃, 按 <kbd className="kbd-style">↓</kbd> 蹲下</p>
       </div>

       {/* Canvas container - takes full width, fixed height */}
       <div className="relative w-full border-y-2 border-black" style={{ height: CANVAS_HEIGHT }}>
            <canvas
                ref={canvasRef}
                // Width/Height attributes are set dynamically in handleResize
                style={{ display: 'block' }} // Ensure canvas takes block layout
            />
            {/* Overlay */}
            {(!isPlaying || isGameOver) && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-60 text-white p-4 text-center">
                    {isGameOver && (
                    <>
                        <p className="text-4xl font-bold mb-4">游戏结束!</p>
                        <p className="text-2xl mb-4">你的分数: {score}</p>
                        <p className="text-xl">按 <kbd className="kbd-style">空格键</kbd> 重新开始</p>
                    </>
                    )}
                    {!isPlaying && !isGameOver && (
                    <p className="text-2xl">按 <kbd className="kbd-style">空格键</kbd> 开始游戏</p>
                    )}
                </div>
            )}
       </div>
       {/* Simple style for KBD elements */}
       <style jsx global>{`
            .kbd-style {
                display: inline-block;
                padding: 0.2em 0.4em;
                font-size: 0.85em;
                font-weight: 600;
                line-height: 1;
                color: #24292e;
                vertical-align: middle;
                background-color: #fafbfc;
                border: solid 1px #d1d5da;
                border-bottom-color: #c6cbd1;
                border-radius: 3px;
                box-shadow: inset 0 -1px 0 #c6cbd1;
            }
       `}</style>
    </div>
  );
};

export default ChickenRunnerGame;
