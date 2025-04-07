"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';

// --- Interfaces and Constants --- (保持不变)
interface Position { x: number; y: number; }
interface Size { width: number; height: number; }
interface Cloud { pos: Position; size: Size; speed: number; }
interface GameObject {
  pos: Position;
  size: Size;
  draw: (ctx: CanvasRenderingContext2D, canvasWidth: number) => void;
  update?: (delta: number, speed: number, canvasWidth: number) => void;
  getRect: () => Rect;
}
interface Rect { x: number; y: number; width: number; height: number; }

const CANVAS_HEIGHT = 300;
const GROUND_Y = CANVAS_HEIGHT - 50;
const CHICKEN_START_X = 50;
const CHICKEN_WIDTH = 45;
const CHICKEN_HEIGHT = 40;
const CHICKEN_DUCK_HEIGHT = 25;
const GRAVITY = 0.7;
const JUMP_FORCE = -13;
const OBSTACLE_BASE_WIDTH = 25;
const CACTUS_TALL_HEIGHT = 55;
const CACTUS_SHORT_HEIGHT = 40;
const PTERODACTYL_WIDTH = 50;
const PTERODACTYL_HEIGHT = 30;
const PTERODACTYL_Y_HIGH = GROUND_Y - CHICKEN_HEIGHT - 30;
const PTERODACTYL_Y_LOW = GROUND_Y - CHICKEN_DUCK_HEIGHT - PTERODACTYL_HEIGHT - 15;
const INITIAL_SPEED = 5;
const SPEED_INCREASE = 0.0018;
const OBSTACLE_SPAWN_RATE_MIN = 1100;
const OBSTACLE_SPAWN_RATE_MAX = 2600;
const PTERODACTYL_SCORE_THRESHOLD = 150;
const LEADERBOARD_KEY = 'chickenRunnerLeaderboard';
const LEADERBOARD_SIZE = 5;
const CLOUD_SPEED_MIN = 0.3;
const CLOUD_SPEED_MAX = 0.8;
const NUM_CLOUDS = 5;

// --- Colors --- (保持不变)
const COLOR_SKY = '#87CEEB'; const COLOR_GROUND = '#8B4513'; const COLOR_CHICKEN_BODY = '#FFA500'; const COLOR_CHICKEN_HEAD = '#FFC04D'; const COLOR_CHICKEN_BEAK = '#FFFF00'; const COLOR_CACTUS = '#2E8B57'; const COLOR_CACTUS_OUTLINE = '#228B22'; const COLOR_PTERO_BODY = '#A9A9A9'; const COLOR_PTERO_OUTLINE = '#696969'; const COLOR_SCORE_TEXT = '#1F2937'; const COLOR_CLOUD = '#FFFFFF';

// --- Utility Functions --- (保持不变)
function randomInt(min: number, max: number): number { return Math.floor(Math.random() * (max - min + 1)) + min; }
function randomFloat(min: number, max: number): number { return Math.random() * (max - min) + min; }
function checkCollision(rect1: Rect, rect2: Rect): boolean { return ( rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.y + rect1.height > rect2.y ); }

// --- Game Object Classes --- (保持不变)
// Chicken Class
class Chicken implements GameObject { /* ... Class Implementation ... */
  pos: Position; size: Size; velocityY: number = 0; isJumping: boolean = false; isDucking: boolean = false; baseY: number; legPhase: number = 0; legTimer: number = 0;
  constructor() { this.size = { width: CHICKEN_WIDTH, height: CHICKEN_HEIGHT }; this.baseY = GROUND_Y - this.size.height; this.pos = { x: CHICKEN_START_X, y: this.baseY }; }
  jump() { if (!this.isJumping && !this.isDucking) { this.velocityY = JUMP_FORCE; this.isJumping = true; } }
  duck(isDucking: boolean) { if (this.isJumping) return; if (isDucking && !this.isDucking) { this.isDucking = true; this.size.height = CHICKEN_DUCK_HEIGHT; this.pos.y = GROUND_Y - this.size.height; } else if (!isDucking && this.isDucking) { this.isDucking = false; this.size.height = CHICKEN_HEIGHT; this.pos.y = this.baseY; } }
  update(delta: number) { this.velocityY += GRAVITY; this.pos.y += this.velocityY; const groundPosition = this.isDucking ? GROUND_Y - CHICKEN_DUCK_HEIGHT : GROUND_Y - CHICKEN_HEIGHT; if (this.pos.y >= groundPosition) { this.pos.y = groundPosition; this.velocityY = 0; this.isJumping = false; if (this.isDucking) { this.pos.y = GROUND_Y - CHICKEN_DUCK_HEIGHT; } else { this.size.height = CHICKEN_HEIGHT; } } if (!this.isJumping && !this.isDucking) { this.legTimer += delta; if (this.legTimer > 100) { this.legPhase = (this.legPhase + 1) % 2; this.legTimer = 0; } } else { this.legTimer = 0; this.legPhase = 0; } }
  draw(ctx: CanvasRenderingContext2D, canvasWidth: number) { ctx.save(); ctx.translate(this.pos.x, this.pos.y); ctx.fillStyle = COLOR_CHICKEN_BODY; ctx.beginPath(); if (this.isDucking) { ctx.ellipse(this.size.width / 2, this.size.height * 0.6, this.size.width / 2, this.size.height * 0.4, 0, 0, Math.PI * 2); } else { ctx.ellipse(this.size.width / 2, this.size.height / 2, this.size.width / 2.2, this.size.height / 2, 0, 0, Math.PI * 2); } ctx.fill(); ctx.fillStyle = COLOR_CHICKEN_HEAD; ctx.beginPath(); const headX = this.size.width * 0.7; const headY = this.isDucking ? this.size.height * 0.4 : this.size.height * 0.35; const headRadius = this.isDucking ? this.size.width * 0.18 : this.size.width * 0.2; ctx.arc(headX, headY, headRadius, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = 'black'; ctx.beginPath(); const eyeX = headX + headRadius * 0.3; const eyeY = headY - headRadius * 0.1; ctx.arc(eyeX, eyeY, 3, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = COLOR_CHICKEN_BEAK; ctx.beginPath(); const beakX = headX + headRadius * 0.8; const beakY = headY + headRadius * 0.2; ctx.moveTo(beakX, beakY); ctx.lineTo(beakX + 8, beakY + 3); ctx.lineTo(beakX, beakY + 6); ctx.closePath(); ctx.fill(); if (!this.isDucking) { ctx.strokeStyle = COLOR_CHICKEN_BODY; ctx.lineWidth = 4; ctx.beginPath(); const legY = this.size.height; const legX1 = this.size.width * 0.35; const legX2 = this.size.width * 0.65; if (this.legPhase === 0) { ctx.moveTo(legX1, legY * 0.8); ctx.lineTo(legX1 + 5, legY + 3); ctx.moveTo(legX2, legY * 0.8); ctx.lineTo(legX2 - 5, legY + 3); } else { ctx.moveTo(legX1, legY * 0.8); ctx.lineTo(legX1 - 5, legY + 3); ctx.moveTo(legX2, legY * 0.8); ctx.lineTo(legX2 + 5, legY + 3); } ctx.stroke(); } ctx.restore(); }
  getRect(): Rect { const paddingX = 5; const paddingY = 3; return { x: this.pos.x + paddingX, y: this.pos.y + paddingY, width: this.size.width - paddingX * 2, height: this.size.height - paddingY }; }
}
// Cactus Class
class Cactus implements GameObject { /* ... Class Implementation ... */
  pos: Position; size: Size; type: 'short' | 'tall' | 'group'; numSegments: number;
  constructor(canvasWidth: number, score: number) { const rand = Math.random(); const groupProbability = 0.2 + Math.min(0.3, score * 0.00015); if (rand < groupProbability) { this.type = 'group'; this.size = { width: OBSTACLE_BASE_WIDTH * 2.5, height: CACTUS_SHORT_HEIGHT }; } else if (rand < groupProbability + 0.4) { this.type = 'tall'; this.size = { width: OBSTACLE_BASE_WIDTH * 1.2, height: CACTUS_TALL_HEIGHT }; } else { this.type = 'short'; this.size = { width: OBSTACLE_BASE_WIDTH, height: CACTUS_SHORT_HEIGHT }; } this.numSegments = randomInt(2, 4); this.pos = { x: canvasWidth, y: GROUND_Y - this.size.height }; }
  update(delta: number, speed: number) { this.pos.x -= speed * delta * 0.1; }
  draw(ctx: CanvasRenderingContext2D, canvasWidth: number) { ctx.save(); ctx.translate(this.pos.x, this.pos.y); ctx.fillStyle = COLOR_CACTUS; ctx.strokeStyle = COLOR_CACTUS_OUTLINE; ctx.lineWidth = 2; if (this.type === 'group') { const cw = OBSTACLE_BASE_WIDTH * 0.8; const ch = this.size.height; this.drawSingleCactus(ctx, 0, 0, cw, ch); this.drawSingleCactus(ctx, cw * 1.5, 0, cw, ch); if (Math.random() < 0.5) { this.drawSingleCactus(ctx, cw * 0.75, -5, cw*0.8, ch*0.9); } } else { this.drawSingleCactus(ctx, 0, 0, this.size.width, this.size.height); if (this.type === 'tall') { const aw = this.size.width * 0.3; const ah = this.size.height * 0.5; ctx.fillRect(this.size.width*0.1, this.size.height*0.2, aw, ah*0.6); ctx.fillRect(this.size.width*0.1 - aw*0.5, this.size.height*0.2, aw*0.5, ah*0.2); ctx.fillRect(this.size.width*0.6, this.size.height*0.3, aw, ah*0.6); ctx.fillRect(this.size.width*0.6 + aw, this.size.height*0.3, aw*0.5, ah*0.2); ctx.strokeRect(this.size.width*0.1, this.size.height*0.2, aw, ah*0.6); ctx.strokeRect(this.size.width*0.1 - aw*0.5, this.size.height*0.2, aw*0.5, ah*0.2); ctx.strokeRect(this.size.width*0.6, this.size.height*0.3, aw, ah*0.6); ctx.strokeRect(this.size.width*0.6 + aw, this.size.height*0.3, aw*0.5, ah*0.2); } } ctx.restore(); }
  drawSingleCactus(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) { ctx.beginPath(); ctx.moveTo(x + 5, y); ctx.lineTo(x + w - 5, y); ctx.arcTo(x + w, y, x + w, y + 5, 5); ctx.lineTo(x + w, y + h); ctx.lineTo(x, y + h); ctx.lineTo(x, y + 5); ctx.arcTo(x, y, x + 5, y, 5); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.beginPath(); for (let i = 1; i < this.numSegments; i++) { const lineX = x + (w / this.numSegments) * i; ctx.moveTo(lineX, y + 5); ctx.lineTo(lineX, y + h - 5); } ctx.lineWidth = 1; ctx.strokeStyle = '#556B2F'; ctx.stroke(); }
   getRect(): Rect { return { x: this.pos.x, y: this.pos.y, width: this.size.width, height: this.size.height }; }
}
// Pterodactyl Class
class Pterodactyl implements GameObject { /* ... Class Implementation ... */
    pos: Position; size: Size; wingPhase: number = 0; wingTimer: number = 0; wingSpeed: number = 120;
    constructor(canvasWidth: number) { this.size = { width: PTERODACTYL_WIDTH, height: PTERODACTYL_HEIGHT }; const flyHeight = Math.random() < 0.4 ? PTERODACTYL_Y_LOW : PTERODACTYL_Y_HIGH; this.pos = { x: canvasWidth, y: flyHeight }; }
    update(delta: number, speed: number) { this.pos.x -= (speed + 1.5) * delta * 0.1; this.wingTimer += delta; if (this.wingTimer > this.wingSpeed) { this.wingPhase = (this.wingPhase + 1) % 2; this.wingTimer = 0; } }
    draw(ctx: CanvasRenderingContext2D, canvasWidth: number) { ctx.save(); ctx.translate(this.pos.x, this.pos.y); ctx.fillStyle = COLOR_PTERO_BODY; ctx.strokeStyle = COLOR_PTERO_OUTLINE; ctx.lineWidth = 1; const bw = this.size.width * 0.6; const bh = this.size.height * 0.5; const bx = this.size.width * 0.2; const by = this.size.height * 0.3; ctx.beginPath(); ctx.ellipse(bx + bw / 2, by + bh / 2, bw / 2, bh / 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); const hr = this.size.height * 0.25; const hx = this.size.width * 0.85; const hy = this.size.height * 0.4; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(hx + hr * 0.8, hy - hr * 0.2); ctx.lineTo(hx + hr * 2.5, hy); ctx.lineTo(hx + hr * 0.8, hy + hr * 0.2); ctx.closePath(); ctx.fill(); const wsx = this.size.width * 0.3; const wsy = this.size.height * 0.5; const wl = this.size.width * 0.7; const wtx = wsx - wl * 0.3; ctx.beginPath(); if (this.wingPhase === 0) { ctx.moveTo(wsx, wsy); ctx.quadraticCurveTo(wsx - wl * 0.5, wsy - this.size.height * 1.2, wtx, wsy - this.size.height * 0.5); ctx.lineTo(wtx + 10, wsy + 5); ctx.quadraticCurveTo(wsx - wl * 0.3, wsy + 8, wsx, wsy + 3); } else { ctx.moveTo(wsx, wsy); ctx.quadraticCurveTo(wsx - wl * 0.4, wsy + this.size.height * 0.8, wtx, wsy + this.size.height * 0.6); ctx.lineTo(wtx + 10, wsy - 5); ctx.quadraticCurveTo(wsx - wl * 0.3, wsy - 8, wsx, wsy - 3); } ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore(); }
    getRect(): Rect { return { x: this.pos.x, y: this.pos.y, width: this.size.width, height: this.size.height }; }
}


// --- React 组件 ---
const ChickenRunnerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWidthRef = useRef<number>(800);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gameSpeed, setGameSpeed] = useState<number>(INITIAL_SPEED);
  const [leaderboard, setLeaderboard] = useState<number[]>([]);
  const cloudsRef = useRef<Cloud[]>([]);

  // Game objects refs (保持不变)
  const chickenRef = useRef<Chicken>(new Chicken());
  const obstaclesRef = useRef<GameObject[]>([]);
  const lastTimeRef = useRef<number>(0);
  const scoreTimerRef = useRef<number>(0);
  const obstacleSpawnTimerRef = useRef<number>(0);
  const nextSpawnTimeRef = useRef<number>(randomInt(OBSTACLE_SPAWN_RATE_MIN, OBSTACLE_SPAWN_RATE_MAX));
  const animationFrameIdRef = useRef<number | null>(null);
  const isDuckingRef = useRef<boolean>(false);

  // --- Utility / Logic Callbacks --- (保持不变 - InitializeClouds, DrawBackground, UpdateClouds, Load/Save Leaderboard, ResetGame, GameOver, Input, Resize)
  const initializeClouds = useCallback((canvasWidth: number) => { cloudsRef.current = []; for (let i = 0; i < NUM_CLOUDS; i++) { cloudsRef.current.push({ pos: { x: randomFloat(0, canvasWidth), y: randomFloat(20, CANVAS_HEIGHT / 2.5), }, size: { width: randomFloat(50, 100), height: randomFloat(15, 30), }, speed: randomFloat(CLOUD_SPEED_MIN, CLOUD_SPEED_MAX), }); } }, []);
  const drawBackground = useCallback((ctx: CanvasRenderingContext2D, canvasWidth: number) => { ctx.fillStyle = COLOR_SKY; ctx.fillRect(0, 0, canvasWidth, GROUND_Y); ctx.fillStyle = COLOR_CLOUD; ctx.globalAlpha = 0.8; cloudsRef.current.forEach(cloud => { ctx.beginPath(); ctx.ellipse(cloud.pos.x + cloud.size.width / 2, cloud.pos.y + cloud.size.height / 2, cloud.size.width / 2, cloud.size.height / 2, 0, 0, Math.PI * 2); ctx.ellipse(cloud.pos.x + cloud.size.width * 0.2, cloud.pos.y + cloud.size.height * 0.8, cloud.size.width * 0.3, cloud.size.height * 0.4, 0, 0, Math.PI * 2); ctx.ellipse(cloud.pos.x + cloud.size.width * 0.8, cloud.pos.y + cloud.size.height * 0.7, cloud.size.width * 0.4, cloud.size.height * 0.5, 0, 0, Math.PI * 2); ctx.closePath(); ctx.fill(); }); ctx.globalAlpha = 1.0; ctx.fillStyle = COLOR_GROUND; ctx.fillRect(0, GROUND_Y, canvasWidth, CANVAS_HEIGHT - GROUND_Y); ctx.fillStyle = '#5C3317'; ctx.fillRect(0, GROUND_Y, canvasWidth, 3); }, []);
  const updateClouds = useCallback((delta: number, canvasWidth: number) => { cloudsRef.current.forEach(cloud => { cloud.pos.x -= cloud.speed * delta * 0.1; if (cloud.pos.x + cloud.size.width < 0) { cloud.pos.x = canvasWidth; cloud.pos.y = randomFloat(20, CANVAS_HEIGHT / 2.5); cloud.size = { width: randomFloat(50, 100), height: randomFloat(15, 30) }; cloud.speed = randomFloat(CLOUD_SPEED_MIN, CLOUD_SPEED_MAX); } }); }, []);
  const loadLeaderboard = useCallback(() => { if (typeof window !== 'undefined') { try { const storedLeaderboard = localStorage.getItem(LEADERBOARD_KEY); if (storedLeaderboard) { const parsed = JSON.parse(storedLeaderboard); if (Array.isArray(parsed) && parsed.every(item => typeof item === 'number')) { const sortedScores = parsed.sort((a, b) => b - a).slice(0, LEADERBOARD_SIZE); setLeaderboard(sortedScores); if (sortedScores.length > 0 && sortedScores[0] > highScore) { setHighScore(sortedScores[0]); } return; } else { localStorage.removeItem(LEADERBOARD_KEY); } } } catch (error) { console.error("Failed to load leaderboard:", error); localStorage.removeItem(LEADERBOARD_KEY); } } setLeaderboard([]); }, [highScore]);
  const saveLeaderboard = useCallback((scores: number[]) => { if (typeof window !== 'undefined') { try { const scoresToSave = [...scores].sort((a, b) => b - a).slice(0, LEADERBOARD_SIZE); localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(scoresToSave)); } catch (error) { console.error("Failed to save leaderboard:", error); } } }, []);
  const resetGame = useCallback(() => { chickenRef.current = new Chicken(); obstaclesRef.current = []; setScore(0); setGameSpeed(INITIAL_SPEED); setIsGameOver(false); lastTimeRef.current = performance.now(); scoreTimerRef.current = 0; obstacleSpawnTimerRef.current = 0; nextSpawnTimeRef.current = randomInt(OBSTACLE_SPAWN_RATE_MIN, OBSTACLE_SPAWN_RATE_MAX); isDuckingRef.current = false; initializeClouds(canvasWidthRef.current); if (canvasRef.current) { const ctx = canvasRef.current.getContext('2d'); if (ctx) { ctx.clearRect(0, 0, canvasWidthRef.current, CANVAS_HEIGHT); } } if (animationFrameIdRef.current) { cancelAnimationFrame(animationFrameIdRef.current); animationFrameIdRef.current = null; } setIsPlaying(true); }, [initializeClouds]);
  const handleGameOver = useCallback(() => { setIsPlaying(false); setIsGameOver(true); const finalScore = score; let currentHighest = highScore; if (finalScore > highScore) { setHighScore(finalScore); currentHighest = finalScore; } const updatedLeaderboard = [...leaderboard]; updatedLeaderboard.push(finalScore); const newLeaderboard = [...new Set(updatedLeaderboard)].sort((a, b) => b - a).slice(0, LEADERBOARD_SIZE); setLeaderboard(newLeaderboard); saveLeaderboard(newLeaderboard); }, [score, highScore, leaderboard, saveLeaderboard]);
  const handleKeyDown = useCallback((e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); if (!isPlaying && !isGameOver) { resetGame(); } else if (isPlaying) { chickenRef.current.jump(); } } else if (e.code === 'ArrowDown') { e.preventDefault(); if (isPlaying && !isDuckingRef.current) { isDuckingRef.current = true; chickenRef.current.duck(true); } } }, [isPlaying, isGameOver, resetGame]);
  const handleKeyUp = useCallback((e: KeyboardEvent) => { if (e.code === 'ArrowDown') { e.preventDefault(); if (isPlaying && isDuckingRef.current) { isDuckingRef.current = false; chickenRef.current.duck(false); } } }, [isPlaying]);
  const handleResize = useCallback(() => { if (canvasRef.current) { canvasWidthRef.current = window.innerWidth; canvasRef.current.width = canvasWidthRef.current; canvasRef.current.height = CANVAS_HEIGHT; initializeClouds(canvasWidthRef.current); if (!isPlaying && !isGameOver) { const ctx = canvasRef.current.getContext('2d'); if (ctx) { drawBackground(ctx, canvasWidthRef.current); } } } }, [isPlaying, isGameOver, initializeClouds, drawBackground]);

  // Game Loop (保持不变)
  const gameLoop = useCallback((currentTime: number) => {
    if (!isPlaying) { animationFrameIdRef.current = null; return; }
    if (!canvasRef.current) { console.error("gameLoop: canvasRef.current is null!"); setIsPlaying(false); return; }
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) { console.error("gameLoop: Failed to get 2D context!"); setIsPlaying(false); return; }
    const currentCanvasWidth = canvasWidthRef.current; const deltaTime = (currentTime - lastTimeRef.current); lastTimeRef.current = currentTime;
    chickenRef.current.update(deltaTime); obstaclesRef.current = obstaclesRef.current.filter(obstacle => { obstacle.update?.(deltaTime, gameSpeed, currentCanvasWidth); return obstacle.pos.x + obstacle.size.width > 0; }); setGameSpeed(prevSpeed => prevSpeed + SPEED_INCREASE * deltaTime * 0.1); updateClouds(deltaTime, currentCanvasWidth);
    scoreTimerRef.current += deltaTime; if (scoreTimerRef.current >= 100) { setScore(prevScore => prevScore + 1); scoreTimerRef.current = 0; }
    obstacleSpawnTimerRef.current += deltaTime; if (obstacleSpawnTimerRef.current >= nextSpawnTimeRef.current) { const isPterodactyl = Math.random() < 0.35 && score > PTERODACTYL_SCORE_THRESHOLD; const newObstacle = isPterodactyl ? new Pterodactyl(currentCanvasWidth) : new Cactus(currentCanvasWidth, score); obstaclesRef.current.push(newObstacle); obstacleSpawnTimerRef.current = 0; const dynamicMin = Math.max(400, OBSTACLE_SPAWN_RATE_MIN - gameSpeed * 25); const dynamicMax = Math.max(800, OBSTACLE_SPAWN_RATE_MAX - gameSpeed * 20); nextSpawnTimeRef.current = randomInt(dynamicMin, dynamicMax); }
    ctx.clearRect(0, 0, currentCanvasWidth, CANVAS_HEIGHT); drawBackground(ctx, currentCanvasWidth); chickenRef.current.draw(ctx, currentCanvasWidth); obstaclesRef.current.forEach(obstacle => obstacle.draw(ctx, currentCanvasWidth)); ctx.fillStyle = COLOR_SCORE_TEXT; ctx.font = 'bold 24px Arial'; ctx.textAlign = 'right'; ctx.fillText(`${score}`, currentCanvasWidth - 20, 40); ctx.font = '16px Arial'; ctx.fillText(`最高分: ${highScore}`, currentCanvasWidth - 20, 65);
    const chickenRect = chickenRef.current.getRect(); for (const obstacle of obstaclesRef.current) { const obstacleRect = obstacle.getRect(); if (checkCollision(chickenRect, obstacleRect)) { handleGameOver(); return; } }
    animationFrameIdRef.current = requestAnimationFrame(gameLoop);
  }, [isPlaying, gameSpeed, score, highScore, handleGameOver, drawBackground, updateClouds]); // Dependencies


  // --- Effects --- (保持不变)
    useEffect(() => { loadLeaderboard(); handleResize(); window.addEventListener('resize', handleResize); window.addEventListener('keydown', handleKeyDown); window.addEventListener('keyup', handleKeyUp); return () => { window.removeEventListener('resize', handleResize); window.removeEventListener('keydown', handleKeyDown); window.removeEventListener('keyup', handleKeyUp); if (animationFrameIdRef.current) { cancelAnimationFrame(animationFrameIdRef.current); animationFrameIdRef.current = null; } }; }, [handleResize, handleKeyDown, handleKeyUp, loadLeaderboard]);
    useEffect(() => { if (isPlaying && !animationFrameIdRef.current) { lastTimeRef.current = performance.now(); animationFrameIdRef.current = requestAnimationFrame(gameLoop); } else if (!isPlaying && animationFrameIdRef.current) { cancelAnimationFrame(animationFrameIdRef.current); animationFrameIdRef.current = null; } }, [isPlaying, gameLoop]);


  return (
    // Layout (保持不变)
    <div className="game-container flex flex-col items-center justify-start w-full font-press-start pt-4 pb-8 bg-gray-200">
        <Head>
           <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet" />
        </Head>

       {/* Header section (保持不变) */}
       <div className="text-center px-4 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-orange-600">小鸡快跑!</h1>
            {!isPlaying && ( <p className="text-gray-700 text-sm mt-1">按 <kbd className="kbd-style">空格键</kbd> 跳跃, 按 <kbd className="kbd-style">↓</kbd> 蹲下</p> )}
       </div>

       {/* Canvas container (保持不变) */}
       <div className="relative w-full border-y-4 border-gray-700 shadow-lg mb-6" style={{ height: CANVAS_HEIGHT }}>
            <canvas
                ref={canvasRef}
                style={{ display: 'block' }}
            />
            {/* Initial Start Message Overlay (保持不变) */}
            {!isPlaying && !isGameOver && ( <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white p-4 text-center"> <p className="text-2xl animate-pulse">按 <kbd className="kbd-style">空格键</kbd> 开始游戏</p> </div> )}
       </div>

        {/* Persistent Leaderboard Below Canvas (保持不变) */}
        <div className="w-full max-w-md px-4 mx-auto">
             <div className="text-left border-2 border-gray-600 p-3 rounded-lg bg-gray-100 shadow-md">
                 <h3 className="text-lg font-bold mb-2 text-center text-gray-800">最高分排行</h3>
                 {leaderboard.length > 0 ? (
                    <ol className="list-decimal list-inside space-y-1 text-gray-700">
                        {leaderboard.map((lbScore, index) => (
                        <li key={index} className={`text-base ${lbScore === highScore && isGameOver ? 'text-yellow-600 font-bold' : ''}`}>
                           {index + 1}. {lbScore}
                        </li>
                        ))}
                    </ol>
                 ) : (
                    <p className="text-gray-500 italic text-center text-sm">暂无记录</p>
                 )}
            </div>
        </div>

        {/* ***** FIX: Game Over Modal using Inline Styles ***** */}
        {isGameOver && (
            <div style={{ // Overlay styles
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent black
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 100, // Ensure it's on top
            }}>
                <div style={{ // Content styles
                    backgroundColor: 'white',
                    padding: '2rem', // ~p-8
                    borderRadius: '0.5rem', // rounded-lg
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // shadow-xl
                    textAlign: 'center',
                    maxWidth: '24rem', // ~max-w-sm
                    width: 'calc(100% - 2rem)', // Ensure some margin on small screens
                    fontFamily: "'Press Start 2P', cursive", // Apply game font
                }}>
                    <h2 style={{
                        fontSize: '1.5rem', // ~text-2xl
                        fontWeight: 'bold',
                        color: '#1F2937', // text-gray-800
                        marginBottom: '1rem' // mb-4
                    }}>
                        游戏结束!
                    </h2>
                    <p style={{
                        fontSize: '1.25rem', // ~text-xl
                        color: '#374151', // text-gray-700
                        marginBottom: '1.5rem' // mb-6
                    }}>
                        分数: <span style={{ fontWeight: 'bold', color: '#EA580C' }}>{score}</span> {/* text-orange-600 */}
                    </p>
                    {/* Keep button styling with Tailwind for convenience */}
                    <button
                        onClick={resetGame}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-md text-lg transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-75"
                        style={{ fontFamily: "'Press Start 2P', cursive" }} // Ensure button also uses the font
                    >
                        重新游戏
                    </button>
                </div>
            </div>
        )}


       {/* KBD and Global Styles (保持不变) */}
       <style jsx global>{` /* ... KBD and Pulse styles ... */ `}</style>
        <style jsx global>{`
            body { font-family: 'Press Start 2P', cursive; }
            .kbd-style { display: inline-block; padding: 0.2em 0.4em; font-size: 0.8em; font-weight: normal; line-height: 1; color: #24292e; vertical-align: middle; background-color: #fafbfc; border: solid 1px #d1d5da; border-bottom-color: #c6cbd1; border-radius: 3px; box-shadow: inset 0 -1px 0 #c6cbd1; margin: 0 0.1em; }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
            .animate-pulse { animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
       `}</style>
    </div>
  );
};

export default ChickenRunnerGame;
