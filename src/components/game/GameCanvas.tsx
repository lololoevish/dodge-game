"use client";

import { useRef, useEffect, useState, useCallback } from 'react'
import { GameState, GameConfig, Position, BonusType, ActiveBonus, MutatedEnemy } from '@/types/game'

// Функция для безопасного получения размеров окна
const getWindowDimensions = () => {
  if (typeof window !== 'undefined') {
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };
  }
  return {
    width: 1200,
    height: 800
  };
};
import {
  createInitialGameState,
  updatePlayerPosition,
  spawnChaser,
  spawnBouncingCircle,
  spawnStarGenerator,
  spawnTriangle,
  spawnPentagon,
  spawnLightning,
  spawnFireBall,
  spawnDiagonalHunter,
  spawnMine,
  spawnLaser,
  spawnTeleportCube,
  spawnSpinner,
  spawnGhostBall,
  spawnSnake,
  createProjectilesFromStar,
  updateGameEntities,
  checkGameOver,
  calculateCurrentSpawnIntervals,
  spawnBonus,
  applyBonus,
  updateActiveBonuses,
  spawnPulsatingSphere,
  spawnReflectingProjectile,
  spawnCrystalController,
  spawnPhantomDuplicator,
  spawnContaminationZone,
} from '@/lib/gameLogic'

import { GameEntity } from '@/types/game';

interface GameCanvasProps {
  gameState: "playing" | "paused" | "gameOver"
  onGameOver: (score: number, killerEnemy: GameEntity | null) => void
  onScoreUpdate: (score: number) => void
  onEncounteredEnemiesUpdate: (enemies: string[]) => void
  onActiveBonusesUpdate: (bonuses: ActiveBonus[]) => void
  onBonusCollected?: (bonusType: BonusType) => void
  className?: string
}

export function GameCanvas({ gameState, onGameOver, onScoreUpdate, onEncounteredEnemiesUpdate, onActiveBonusesUpdate, onBonusCollected, className }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>(0)
  const gameStateRef = useRef<GameState | null>(null)
  const lastChaserSpawnRef = useRef<number>(0)
  const lastCircleSpawnRef = useRef<number>(0)
  const lastStarSpawnRef = useRef<number>(0)
  // Новые ссылки для спавна
  const lastTriangleSpawnRef = useRef<number>(0)
  const lastPentagonSpawnRef = useRef<number>(0)
  const lastLightningSpawnRef = useRef<number>(0)
  const lastFireSpawnRef = useRef<number>(0)
  const lastDiagonalSpawnRef = useRef<number>(0)
  const lastMineSpawnRef = useRef<number>(0)
  const lastLaserSpawnRef = useRef<number>(0)
  const lastTeleportCubeSpawnRef = useRef<number>(0)
  const lastSpinnerSpawnRef = useRef<number>(0)
  const lastGhostBallSpawnRef = useRef<number>(0)
  const lastSnakeSegmentSpawnRef = useRef<number>(0)
  const lastBonusSpawnRef = useRef<number>(0)
  const lastCrystalControllerSpawnRef = useRef<number>(0)
  const lastPhantomDuplicatorSpawnRef = useRef<number>(0)
  const lastContaminationZoneSpawnRef = useRef<number>(0)
  const [windowSize, setWindowSize] = useState(getWindowDimensions());

  const [gameConfig, setGameConfig] = useState<GameConfig>(() => ({
    gameWidth: getWindowDimensions().width,
    gameHeight: getWindowDimensions().height,
    playerSize: 12,
    chaserSize: 20,
    circleSize: 20,
    chaserSpeed: 2,
    circleSpeed: 3,
    chaserSpawnTime: 10000,
    circleSpawnTime: 30000,
    starSpawnTime: 40000,
    starSize: 24,
    starShootInterval: 20000, // 20 секунд
    projectileSize: 8,
    projectileSpeed: 4,
    // Новые фигуры
    triangleSize: 18,
    triangleSpawnTime: 15000,
    pentagonSize: 22,
    pentagonSpawnTime: 25000,
    lightningSize: 16,
    lightningSpawnTime: 35000,
    fireSize: 14,
    fireSpawnTime: 20000,
    diagonalSize: 18,
    diagonalSpawnTime: 60000,
    mineSize: 12,
    mineSpawnTime: 55000,
    laserSpawnTime: 70000,
    teleportCubeSize: 18,
    teleportCubeSpawnTime: 80000,
    // Новые враги
    spinnerSize: 16,
    spinnerSpawnTime: 90000,
    ghostBallSize: 20,
    ghostBallSpawnTime: 100000,
    // Параметры нарастающей сложности
    minSpawnTime: 2000, // Минимальный интервал спавна (2 секунды)
    difficultyIncreaseRate: 0.95, // Каждые 10 секунд интервалы уменьшаются на 5%
    difficultyUpdateInterval: 10000, // Обновление сложности каждые 10 секунд
    // Новые параметры для змейки
    snakeSegmentSize: 16,
    snakeSegmentSpawnTime: 110000, // 110 секунд
    // Параметры для новых фигур
    pulsatingSphereSize: 20,
    pulsatingSphereSpawnTime: 45000,
    patrolSquareSize: 18,
    patrolSquareSpawnTime: 35000,
    gravityTrapSize: 25,
    gravityTrapSpawnTime: 80000,
    reflectingProjectileSize: 10,
    reflectingProjectileSpawnTime: 50000,
    // Бонусы
    bonusSpawnTime: 8000, // Уменьшил для более частого появления
    bonusSize: 15,
    shieldDuration: 5000,
    slowEnemiesDuration: 8000,
    sizeUpDuration: 15000,
    invisibilityDuration: 7000,
    extraTimeAmount: 10,
    crystalControllerSize: 24,
    crystalControllerSpawnTime: 110000,
    phantomDuplicatorSize: 18,
    phantomDuplicatorSpawnTime: 120000,
    contaminationZoneSize: 30,
    contaminationZoneSpawnTime: 130000,
  }))
  
  const [localGameState, setLocalGameState] = useState<GameState>(() => 
    createInitialGameState(gameConfig)
  )

  // Обновление размеров при изменении размера окна
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        const newDimensions = getWindowDimensions();
        
        setGameConfig(prevConfig => {
          if (prevConfig.gameWidth !== newDimensions.width || prevConfig.gameHeight !== newDimensions.height) {
            return {
              ...prevConfig,
              gameWidth: newDimensions.width,
              gameHeight: newDimensions.height
            }
          }
          return prevConfig
        })
        
        setWindowSize(newDimensions);
        
        if (gameStateRef.current) {
          gameStateRef.current = {
            ...gameStateRef.current,
            gameArea: { width: newDimensions.width, height: newDimensions.height }
          }
        }
      }

      // Only set up the event listener, don't call handleResize immediately
      window.addEventListener('resize', handleResize)

      // Initialize dimensions on mount
      handleResize()

      return () => {
        window.removeEventListener('resize', handleResize)
      }
    }
  }, []) // Empty dependency array - only run once

  // Инициализация игры
  const startGame = useCallback(() => {
    const currentConfig = {
      gameWidth: getWindowDimensions().width,
      gameHeight: getWindowDimensions().height,
      playerSize: 12,
      chaserSize: 20,
      circleSize: 20,
      chaserSpeed: 2,
      circleSpeed: 3,
      chaserSpawnTime: 10000,
      circleSpawnTime: 30000,
      starSpawnTime: 40000,
      starSize: 24,
      starShootInterval: 300000,
      projectileSize: 8,
      projectileSpeed: 4,
      // Новые фигуры
      triangleSize: 18,
      triangleSpawnTime: 15000,
      pentagonSize: 22,
      pentagonSpawnTime: 25000,
      lightningSize: 16,
      lightningSpawnTime: 35000,
      fireSize: 14,
      fireSpawnTime: 20000,
      diagonalSize: 18,
      diagonalSpawnTime: 60000,
      mineSize: 12,
      mineSpawnTime: 55000,
      laserSpawnTime: 70000,
      teleportCubeSize: 18,
      teleportCubeSpawnTime: 80000,
      // Новые враги
      spinnerSize: 14,
      spinnerSpawnTime: 65000,
      ghostBallSize: 18,
      ghostBallSpawnTime: 70000,
      // Параметры нарастающей сложности
      minSpawnTime: 2000,
      difficultyIncreaseRate: 0.96,
      difficultyUpdateInterval: 8000,
      // Новые параметры для змейки
      snakeSegmentSize: 16,
      snakeSegmentSpawnTime: 110000, // 110 секунд
      // Параметры для новых фигур
      pulsatingSphereSize: 20,
      pulsatingSphereSpawnTime: 45000,
      patrolSquareSize: 18,
      patrolSquareSpawnTime: 35000,
      gravityTrapSize: 25,
      gravityTrapSpawnTime: 80000,
      reflectingProjectileSize: 10,
      reflectingProjectileSpawnTime: 50000,
      bonusSpawnTime: 8000, // Уменьшил для более частого появления
      bonusSize: 15,
      shieldDuration: 5000,
      slowEnemiesDuration: 8000,
      sizeUpDuration: 15000,
      invisibilityDuration: 7000,
      extraTimeAmount: 10,
    }
    const currentConfigWithNewEnemies = {
      ...currentConfig,
      crystalControllerSize: 24,
      crystalControllerSpawnTime: 110000,
      phantomDuplicatorSize: 18,
      phantomDuplicatorSpawnTime: 120000,
      contaminationZoneSize: 30,
      contaminationZoneSpawnTime: 130000,
    }
    
    const initialState = createInitialGameState(currentConfigWithNewEnemies as GameConfig)
    const newState = {
      ...initialState,
      isPlaying: true,
      startTime: Date.now()
    }
    setLocalGameState(newState)
    gameStateRef.current = newState
    lastChaserSpawnRef.current = Date.now()
    lastCircleSpawnRef.current = Date.now()
    lastStarSpawnRef.current = Date.now()
    // Инициализируем время для новых фигур
    lastTriangleSpawnRef.current = Date.now()
    lastPentagonSpawnRef.current = Date.now()
    lastLightningSpawnRef.current = Date.now()
    lastFireSpawnRef.current = Date.now()
    lastDiagonalSpawnRef.current = Date.now()
    lastMineSpawnRef.current = Date.now()
    lastLaserSpawnRef.current = Date.now()
    lastTeleportCubeSpawnRef.current = Date.now()
    lastSpinnerSpawnRef.current = Date.now()
    lastGhostBallSpawnRef.current = Date.now()
    lastSnakeSegmentSpawnRef.current = Date.now()
    lastBonusSpawnRef.current = Date.now()
    lastCrystalControllerSpawnRef.current = Date.now()
    lastPhantomDuplicatorSpawnRef.current = Date.now()
    lastContaminationZoneSpawnRef.current = Date.now()
  }, [])

  // Остановка игры
  const stopGame = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }
    setLocalGameState(prev => ({
      ...prev,
      isPlaying: false,
      isGameOver: true
    }))
  }, [])

  // Обработка движения мыши
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!canvasRef.current || !gameStateRef.current?.isPlaying) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    const mouseX = (event.clientX - rect.left) * scaleX
    const mouseY = (event.clientY - rect.top) * scaleY

    const newState = updatePlayerPosition(gameStateRef.current, { x: mouseX, y: mouseY })
    gameStateRef.current = newState
    setLocalGameState(newState)
  }, [])

  // Обработка касаний для мобильных устройств
  const handleTouchMove = useCallback((event: TouchEvent) => {
    if (!canvasRef.current || !gameStateRef.current?.isPlaying) return
    
    event.preventDefault()
    const touch = event.touches[0]
    if (!touch) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    const touchX = (touch.clientX - rect.left) * scaleX
    const touchY = (touch.clientY - rect.top) * scaleY

    const newState = updatePlayerPosition(gameStateRef.current, { x: touchX, y: touchY })
    gameStateRef.current = newState
    setLocalGameState(newState)

    // Обновляем список встреченных врагов
    onEncounteredEnemiesUpdate(newState.encounteredEnemies)
  }, [])

  // Игровой цикл
  const gameLoop = useCallback(() => {
    if (!gameStateRef.current?.isPlaying) return
    if (gameState === "paused") return

    const currentTime = Date.now()
    const elapsedTime = currentTime - gameStateRef.current.startTime
    let newState = { ...gameStateRef.current }

    // Обновляем счет (время в секундах)
    const newScore = Math.floor(elapsedTime / 1000)
    newState.score = newScore
    onScoreUpdate(newScore)

    // Получаем текущие значения конфигурации игры напрямую
    const baseConfig = {
      chaserSpawnTime: 6000, // Уменьшили до 6 секунд
      circleSpawnTime: 20000, // Уменьшили до 20 секунд
      starSpawnTime: 30000, // Уменьшили до 30 секунд
      starShootInterval: 15000, // Уменьшили до 15 секунд
      gameWidth: getWindowDimensions().width,
      gameHeight: getWindowDimensions().height,
      playerSize: 10, // Уменьшили размер игрока
      chaserSize: 22, // Увеличили размер врага
      circleSize: 22, // Увеличили размер врага
      chaserSpeed: 2.5, // Увеличили скорость врага
      circleSpeed: 3.5, // Увеличили скорость врага
      starSize: 26, // Увеличили размер врага
      projectileSize: 9, // Увеличили размер снаряда
      projectileSpeed: 5, // Увеличили скорость снаряда
      // Новые фигуры
      triangleSize: 20, // Увеличили размер врага
      triangleSpawnTime: 10000, // Уменьшили до 10 секунд
      pentagonSize: 24, // Увеличили размер врага
      pentagonSpawnTime: 18000, // Уменьшили до 18 секунд
      lightningSize: 18, // Увеличили размер врага
      lightningSpawnTime: 22000, // Уменьшили до 22 секунд
      fireSize: 16, // Увеличили размер врага
      fireSpawnTime: 1200, // Уменьшили до 12 секунд
      diagonalSize: 20, // Увеличили размер врага
      diagonalSpawnTime: 40000, // Уменьшили до 40 секунд
      mineSize: 14, // Увеличили размер врага
      mineSpawnTime: 35000, // Уменьшили до 35 секунд
      laserSpawnTime: 50000, // Уменьшили до 50 секунд
      teleportCubeSize: 20, // Увеличили размер врага
      teleportCubeSpawnTime: 6000, // Уменьшили до 60 секунд
      // Новые враги
      spinnerSize: 18, // Увеличили размер врага
      spinnerSpawnTime: 70000, // Уменьшили до 70 секунд
      ghostBallSize: 22, // Увеличили размер врага
      ghostBallSpawnTime: 80000, // Уменьшили до 80 секунд
      // Параметры нарастающей сложности
      minSpawnTime: 300, // Уменьшили минимальное время до 0.3 секунд
      difficultyIncreaseRate: 0.85, // Увеличили скорость увеличения сложности (15% уменьшение за интервал)
      difficultyUpdateInterval: 5000, // Обновление сложности каждые 5 секунд
      // Новые параметры для змейки
      snakeSegmentSize: 16,
      snakeSegmentSpawnTime: 10000, // 110 секунд
      // Параметры для новых фигур
      pulsatingSphereSize: 20,
      pulsatingSphereSpawnTime: 45000, // 45 секунд
      patrolSquareSize: 18,
      patrolSquareSpawnTime: 35000, // 35 секунд
      gravityTrapSize: 25,
      gravityTrapSpawnTime: 800, // 80 секунд
      reflectingProjectileSize: 10,
      reflectingProjectileSpawnTime: 50000, // 50 секунд
      bonusSpawnTime: 8000, // Уменьшил для более частого появления
      bonusSize: 15,
      shieldDuration: 5000,
      slowEnemiesDuration: 8000,
      sizeUpDuration: 15000,
      invisibilityDuration: 7000,
      extraTimeAmount: 10,
    }
    const currentConfigWithNewEnemies = {
      ...baseConfig,
      crystalControllerSize: 24,
      crystalControllerSpawnTime: 110000,
      phantomDuplicatorSize: 18,
      phantomDuplicatorSpawnTime: 120000,
      contaminationZoneSize: 30,
      contaminationZoneSpawnTime: 130000,
    }

    // Вычисляем текущие интервалы спавна на основе времени игры
    const currentSpawnIntervals = calculateCurrentSpawnIntervals(currentConfigWithNewEnemies as GameConfig, elapsedTime)
    const currentConfig = {
      ...baseConfig,
      ...currentSpawnIntervals,
      crystalControllerSize: 24,
      phantomDuplicatorSize: 18,
      contaminationZoneSize: 30,
    } as GameConfig

    // Спавним чейзера через 10 секунд
    if (elapsedTime >= currentConfig.chaserSpawnTime && 
        currentTime - lastChaserSpawnRef.current >= currentConfig.chaserSpawnTime) {
      newState = spawnChaser(newState, currentConfig)
      lastChaserSpawnRef.current = currentTime
    }

    // Спавним отскакивающий круг через 30 секунд
    if (elapsedTime >= currentConfig.circleSpawnTime && 
        currentTime - lastCircleSpawnRef.current >= currentConfig.circleSpawnTime) {
      newState = spawnBouncingCircle(newState, currentConfig)
      lastCircleSpawnRef.current = currentTime
    }

    // Спавним звездочку через 40 секунд
    if (elapsedTime >= currentConfig.starSpawnTime && 
        currentTime - lastStarSpawnRef.current >= currentConfig.starSpawnTime) {
      newState = spawnStarGenerator(newState, currentConfig)
      lastStarSpawnRef.current = currentTime
    }

    // === СПАВН НОВЫХ ФИГУР ===
    
    // Спавним треугольник через 15 секунд
    if (elapsedTime >= currentConfig.triangleSpawnTime && 
        currentTime - lastTriangleSpawnRef.current >= currentConfig.triangleSpawnTime) {
      newState = spawnTriangle(newState, currentConfig)
      lastTriangleSpawnRef.current = currentTime
    }

    // Спавним пентагон через 25 секунд
    if (elapsedTime >= currentConfig.pentagonSpawnTime && 
        currentTime - lastPentagonSpawnRef.current >= currentConfig.pentagonSpawnTime) {
      newState = spawnPentagon(newState, currentConfig)
      lastPentagonSpawnRef.current = currentTime
    }

    // Спавним молнию через 35 секунд
    if (elapsedTime >= currentConfig.lightningSpawnTime && 
        currentTime - lastLightningSpawnRef.current >= currentConfig.lightningSpawnTime) {
      newState = spawnLightning(newState, currentConfig)
      lastLightningSpawnRef.current = currentTime
    }

    // Спавним огненные шары каждые 20 секунд
    if (elapsedTime >= currentConfig.fireSpawnTime && 
        currentTime - lastFireSpawnRef.current >= currentConfig.fireSpawnTime) {
      newState = spawnFireBall(newState, currentConfig)
      lastFireSpawnRef.current = currentTime
    }

    // Спавним диагонального охотника через 60 секунд
    if (elapsedTime >= currentConfig.diagonalSpawnTime && 
        currentTime - lastDiagonalSpawnRef.current >= currentConfig.diagonalSpawnTime) {
      newState = spawnDiagonalHunter(newState, currentConfig)
      lastDiagonalSpawnRef.current = currentTime
    }

    // Спавним лазер через 70 секунд
    if (elapsedTime >= currentConfig.laserSpawnTime && 
        currentTime - lastLaserSpawnRef.current >= currentConfig.laserSpawnTime) {
      newState = spawnLaser(newState, currentConfig)
      lastLaserSpawnRef.current = currentTime
    }

    // Спавним телепортирующийся куб через 80 секунд
    if (elapsedTime >= currentConfig.teleportCubeSpawnTime &&
        currentTime - lastTeleportCubeSpawnRef.current >= currentConfig.teleportCubeSpawnTime) {
      newState = spawnTeleportCube(newState, currentConfig)
      lastTeleportCubeSpawnRef.current = currentTime
    }

    // Спавним спиннер через 90 секунд
    if (elapsedTime >= currentConfig.spinnerSpawnTime &&
        currentTime - lastSpinnerSpawnRef.current >= currentConfig.spinnerSpawnTime) {
      newState = spawnSpinner(newState, currentConfig)
      lastSpinnerSpawnRef.current = currentTime
    }

    // Спавним призрачный шар через 100 секунд
    if (elapsedTime >= currentConfig.ghostBallSpawnTime &&
        currentTime - lastGhostBallSpawnRef.current >= currentConfig.ghostBallSpawnTime) {
      newState = spawnGhostBall(newState, currentConfig)
      lastGhostBallSpawnRef.current = currentTime
    }

    // Спавним змейку из 5 сегментов через 110 секунд
    if (elapsedTime >= currentConfig.snakeSegmentSpawnTime &&
        currentTime - lastSnakeSegmentSpawnRef.current >= currentConfig.snakeSegmentSpawnTime) {
      newState = spawnSnake(newState, currentConfig)
      lastSnakeSegmentSpawnRef.current = currentTime
    }

    // Спавним бонусы
    if (currentTime - lastBonusSpawnRef.current >= currentConfig.bonusSpawnTime) {
        newState = spawnBonus(newState, currentConfig);
        lastBonusSpawnRef.current = currentTime;
    }

    // Спавним новых врагов
    if (elapsedTime >= currentConfig.crystalControllerSpawnTime &&
        currentTime - lastCrystalControllerSpawnRef.current >= currentConfig.crystalControllerSpawnTime) {
      newState = spawnCrystalController(newState, currentConfig)
      lastCrystalControllerSpawnRef.current = currentTime
    }

    if (elapsedTime >= currentConfig.phantomDuplicatorSpawnTime &&
        currentTime - lastPhantomDuplicatorSpawnRef.current >= currentConfig.phantomDuplicatorSpawnTime) {
      newState = spawnPhantomDuplicator(newState, currentConfig)
      lastPhantomDuplicatorSpawnRef.current = currentTime
    }

    if (elapsedTime >= currentConfig.contaminationZoneSpawnTime &&
        currentTime - lastContaminationZoneSpawnRef.current >= currentConfig.contaminationZoneSpawnTime) {
      newState = spawnContaminationZone(newState, currentConfig)
      lastContaminationZoneSpawnRef.current = currentTime
    }


    // Проверяем, нужно ли стрелять из звездочек
    const starsToShoot = newState.entities.filter(entity => 
      entity.type === 'star' && 
      currentTime - entity.lastShot >= entity.shootInterval
    )

    starsToShoot.forEach(star => {
      if (star.type === 'star') {
        const projectiles = createProjectilesFromStar(star, newState.player.position, currentConfig)
        newState.entities.push(...projectiles)
        
        // Обновляем время последнего выстрела
        const updatedStar = { ...star, lastShot: currentTime }
        const starIndex = newState.entities.findIndex(e => e.id === star.id)
        if (starIndex !== -1) {
          newState.entities[starIndex] = updatedStar
        }
      }
    })

    // Обновляем позиции объектов
    const previousBonusCount = newState.entities.filter(e => e.type === 'bonus').length
    newState = updateGameEntities(newState, currentConfig)
    const currentBonusCount = newState.entities.filter(e => e.type === 'bonus').length
    
    // Если количество бонусов уменьшилось, значит игрок собрал бонус
    if (previousBonusCount > currentBonusCount && onBonusCollected) {
      // Найдем какой бонус был собран (это упрощение, в реальности нужно отслеживать конкретный тип)
      // Для простоты будем считать что собран случайный бонус
      const bonusTypes = Object.values(BonusType)
      const randomBonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)]
      onBonusCollected(randomBonusType)
    }

    // Проверяем коллизии
    const killerEnemy = checkGameOver(newState);
    if (killerEnemy) {
      newState.isGameOver = true
      newState.isPlaying = false
      newState.killerEnemy = killerEnemy;
      gameStateRef.current = newState
      setLocalGameState(newState)
      onGameOver(newScore, killerEnemy)
      return
    }

    gameStateRef.current = newState
    setLocalGameState(newState)

    // Обновляем активные бонусы
    onActiveBonusesUpdate(newState.activeBonuses)

    // Продолжаем игровой цикл
    animationFrameRef.current = requestAnimationFrame(gameLoop)
  }, [gameState, onGameOver, onScoreUpdate, onEncounteredEnemiesUpdate, onActiveBonusesUpdate, onBonusCollected])

  // Рендеринг игры
  const render = useCallback(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx || !gameStateRef.current) return

    // Очищаем canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    const state = gameStateRef.current

    // Определяем тему (проверяем класс dark на html элементе)
    const isDarkTheme = document.documentElement.classList.contains('dark')
    
    // Рисуем игрока (круг) - фиолетовый цвет с адаптивной обводкой
    ctx.fillStyle = '#391CFF' // Фиолетовый цвет
    ctx.strokeStyle = isDarkTheme ? '#ffffff' : '#000000' // Белая обводка в темной теме, черная в светлой
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(
      state.player.position.x, 
      state.player.position.y, 
      state.player.size.width / 2, 
      0, 
      2 * Math.PI
    )
    ctx.fill()
    ctx.stroke()

    // Рисуем игровые объекты
    state.entities.forEach(entity => {
      ctx.fillStyle = entity.color
      
      if (entity.type === 'bouncing' || entity.type === 'projectile' || 
          entity.type === 'pentagon' || entity.type === 'lightning' || 
          entity.type === 'fire') {
        // Рисуем круг
        ctx.beginPath()
        ctx.arc(
          entity.position.x,
          entity.position.y,
          entity.size.width / 2,
          0,
          2 * Math.PI
        )
        ctx.fill()
      } else if (entity.type === 'triangle') {
        // Рисуем вращающийся треугольник
        const triangleEntity = entity as import('@/types/game').TriangleSpinner
        const centerX = entity.position.x
        const centerY = entity.position.y
        const radius = entity.size.width / 2
        
        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(triangleEntity.rotation)
        
        ctx.beginPath()
        for (let i = 0; i < 3; i++) {
          const angle = (i * 2 * Math.PI) / 3
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius
          
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      } else if (entity.type === 'star') {
        // Рисуем звездочку
        const centerX = entity.position.x
        const centerY = entity.position.y
        const outerRadius = entity.size.width / 2
        const innerRadius = outerRadius * 0.4
        const spikes = 5
        
        ctx.beginPath()
        for (let i = 0; i < spikes * 2; i++) {
          const angle = (i * Math.PI) / spikes
          const radius = i % 2 === 0 ? outerRadius : innerRadius
          const x = centerX + Math.cos(angle) * radius
          const y = centerY + Math.sin(angle) * radius
          
          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.fill()
      } else if (entity.type === 'laser') {
        // Рисуем лазерный луч
        const laserEntity = entity as import('@/types/game').LaserBeam
        
        ctx.strokeStyle = entity.color
        ctx.lineWidth = laserEntity.width
        ctx.beginPath()
        
        const startX = laserEntity.centerX + Math.cos(laserEntity.angle) * 10
        const startY = laserEntity.centerY + Math.sin(laserEntity.angle) * 10
        const endX = laserEntity.centerX + Math.cos(laserEntity.angle) * laserEntity.length
        const endY = laserEntity.centerY + Math.sin(laserEntity.angle) * laserEntity.length
        
        ctx.moveTo(startX, startY)
        ctx.lineTo(endX, endY)
        ctx.stroke()
        
        // Центр лазера
        ctx.fillStyle = entity.color
        ctx.beginPath()
        ctx.arc(laserEntity.centerX, laserEntity.centerY, 5, 0, 2 * Math.PI)
        ctx.fill()
      } else if (entity.type === 'mine') {
        // Рисуем мину
        const mineEntity = entity as import('@/types/game').Mine
        
        // Основная мина
        ctx.fillStyle = mineEntity.isArmed ? '#dc2626' : '#525252' // Красный если вооружена
        ctx.fillRect(
          entity.position.x - entity.size.width / 2,
          entity.position.y - entity.size.height / 2,
          entity.size.width,
          entity.size.height
        )
        
        // Область взрыва (только если вооружена)
        if (mineEntity.isArmed) {
          ctx.strokeStyle = '#dc2626'
          ctx.globalAlpha = 0.3
          ctx.lineWidth = 1
          ctx.beginPath()
          ctx.arc(
            entity.position.x,
            entity.position.y,
            mineEntity.triggerRadius,
            0,
            2 * Math.PI
          )
          ctx.stroke()
          ctx.globalAlpha = 1
        }
      } else if (entity.type === 'teleport-cube') {
        // Рисуем телепортирующийся куб
        const cubeEntity = entity as import('@/types/game').TeleportCube

        ctx.globalAlpha = cubeEntity.fadeOpacity
        ctx.fillRect(
          entity.position.x - entity.size.width / 2,
          entity.position.y - entity.size.height / 2,
          entity.size.width,
          entity.size.height
        )
        ctx.globalAlpha = 1
      } else if (entity.type === 'spinner') {
        // Рисуем спиннер
        const spinnerEntity = entity as import('@/types/game').Spinner
        const centerX = entity.position.x
        const centerY = entity.position.y
        const radius = entity.size.width / 2

        ctx.save()
        ctx.translate(centerX, centerY)
        ctx.rotate(spinnerEntity.angle)

        ctx.beginPath()
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2
          const x = Math.cos(angle) * radius
          const y = Math.sin(angle) * radius

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      } else if (entity.type === 'ghost-ball') {
        // Рисуем призрачный шар
        const ghostEntity = entity as import('@/types/game').GhostBall
        
        ctx.globalAlpha = ghostEntity.opacity
        ctx.beginPath()
        ctx.arc(
          entity.position.x,
          entity.position.y,
          entity.size.width / 2,
          0,
          2 * Math.PI
        )
        ctx.fill()
        ctx.globalAlpha = 1
      } else if (entity.type === 'snake-segment') {
        // Рисуем сегмент змейки
        const segmentEntity = entity as import('@/types/game').SnakeSegment
        
        ctx.fillRect(
          entity.position.x - entity.size.width / 2,
          entity.position.y - entity.size.height / 2,
          entity.size.width,
          entity.size.height
        )
      } else {
        // Рисуем обычный квадрат
        ctx.fillRect(
          entity.position.x - entity.size.width / 2,
          entity.position.y - entity.size.height / 2,
          entity.size.width,
          entity.size.height
        )
      }
      if (entity.type === 'bonus') {
        // Рисуем бонус с эффектом свечения
        const bonusEntity = entity as import('@/types/game').Bonus
        const currentTime = Date.now();
        const glowAlpha = 0.6 + 0.4 * Math.sin(currentTime / 300); // Пульсация от 0.6 до 1.0
        const glowRadius = entity.size.width / 2 + 5 + 3 * Math.sin(currentTime / 300); // Пульсирующий радиус

        // Рисуем свечение
        ctx.save();
        ctx.globalAlpha = glowAlpha;
        ctx.beginPath();
        ctx.arc(entity.position.x, entity.position.y, glowRadius, 0, 2 * Math.PI);
        ctx.fillStyle = bonusEntity.color;
        ctx.shadowColor = bonusEntity.color;
        ctx.shadowBlur = 15;
        ctx.fill();
        ctx.restore();

        // Рисуем сам бонус
        ctx.fillStyle = bonusEntity.color;
        ctx.beginPath();
        ctx.arc(
          entity.position.x,
          entity.position.y,
          entity.size.width / 2,
          0,
          2 * Math.PI
        );
        ctx.fill();

        // Рисуем букву
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(bonusEntity.bonusType.charAt(0).toUpperCase(), entity.position.x, entity.position.y);
      } else if (entity.type === 'crystal-controller') {
        // Рисуем кристаллический контроллер
        const crystalEntity = entity as import('@/types/game').CrystalController;
        const centerX = entity.position.x;
        const centerY = entity.position.y;
        const radius = entity.size.width / 2;
        
        ctx.save();
        ctx.translate(centerX, centerY);
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i * Math.PI) / 3;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.fillStyle = entity.color;
        ctx.fill();
        ctx.restore();
      } else if (entity.type === 'phantom-duplicator') {
        // Рисуем призрачного дубликатора
        ctx.globalAlpha = 0.6;
        ctx.fillStyle = entity.color;
        ctx.beginPath();
        ctx.arc(
          entity.position.x,
          entity.position.y,
          entity.size.width / 2,
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.globalAlpha = 1;
      } else if (entity.type === 'contamination-zone') {
        // Рисуем зону заражения
        ctx.fillStyle = entity.color;
        ctx.beginPath();
        ctx.arc(
          entity.position.x,
          entity.position.y,
          entity.size.width / 2,
          0,
          2 * Math.PI
        );
        ctx.fill();
        // Рисуем символ радиации
        ctx.fillStyle = 'black';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('☢️', entity.position.x, entity.position.y);
      } else if (entity.type === 'hazard-zone') {
        // Рисуем зону опасности
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = entity.color;
        ctx.fillRect(
          entity.position.x - entity.size.width / 2,
          entity.position.y - entity.size.height / 2,
          entity.size.width,
          entity.size.height
        );
        ctx.globalAlpha = 1;
      } else if (entity.type === 'mutated-enemy') {
        // Рисуем мутированного врага
        const mutatedEntity = entity as import('@/types/game').MutatedEnemy;
        
        // Рисуем пульсирующее свечение
        const currentTime = Date.now();
        const pulseAlpha = 0.3 + 0.4 * Math.sin(currentTime / 200); // Быстрая пульсация
        
        ctx.save();
        ctx.globalAlpha = pulseAlpha;
        ctx.beginPath();
        ctx.arc(entity.position.x, entity.position.y, entity.size.width / 2 + 5, 0, 2 * Math.PI);
        ctx.fillStyle = entity.color;
        ctx.shadowColor = entity.color;
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.restore();
        
        // Рисуем основное тело мутированного врага
        ctx.fillStyle = entity.color;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(
          entity.position.x,
          entity.position.y,
          entity.size.width / 2,
          0,
          2 * Math.PI
        );
        ctx.fill();
        ctx.stroke();
        
        // Рисуем символ мутации
        ctx.fillStyle = 'white';
        ctx.font = `bold ${Math.max(12, entity.size.width / 3)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('⚠️', entity.position.x, entity.position.y);
      }
    })

    // Планируем следующий кадр рендеринга
    requestAnimationFrame(render)
  }, [])

  // Эффект для запуска игры
  useEffect(() => {
    startGame()
  }, [startGame])

  // Эффект для обработчиков событий
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('touchmove', handleTouchMove)
    }
  }, [handleMouseMove, handleTouchMove])

  // Эффект для игрового цикла
  useEffect(() => {
    if (gameStateRef.current?.isPlaying && gameState === "playing") {
      animationFrameRef.current = requestAnimationFrame(gameLoop)
      requestAnimationFrame(render)
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameState, gameLoop, render])

  return (
    <div className={`fixed inset-0 w-full h-full ${className || ''}`}>
      <canvas
        ref={canvasRef}
        width={windowSize.width}
        height={windowSize.height}
        className="bg-white dark:bg-background cursor-none block w-full h-full"
        style={{
          width: '100vw',
          height: '100vh',
          objectFit: 'cover'
        }}
      />
    </div>
  )
}