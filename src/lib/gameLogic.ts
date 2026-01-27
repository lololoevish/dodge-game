import { GameState, GameConfig, Position, ChaserSquare, BouncingCircle, StarGenerator, PurpleProjectile, GameEntity,
  TriangleSpinner, PentagonSpiral, Lightning, FireBall, DiagonalHunter, Mine, LaserBeam, TeleportCube,
  Spinner, GhostBall, SnakeSegment, PulsatingSphere, PatrolSquare, ReflectingProjectile,
  Bonus, BonusType, ActiveBonus, CrystalController, PhantomDuplicator, ContaminationZone, HazardZone, MutatedEnemy, Boss, CannonBall } from '@/types/game'

export const defaultGameConfig: GameConfig = {
  gameWidth: 1200,
  gameHeight: 800,
  playerSize: 12,
  chaserSize: 18,
  circleSize: 18,
  chaserSpeed: 1.8,
  circleSpeed: 2.5,
  chaserSpawnTime: 5000,      // Появляется первым
  circleSpawnTime: 30000,
  starSpawnTime: 40000,
  starSize: 22,
  starShootInterval: 20000,
  projectileSize: 7,
  projectileSpeed: 3.5,
  // Новые фигуры
  triangleSize: 16,
  triangleSpawnTime: 15000,
  pentagonSize: 20,
  pentagonSpawnTime: 25000,
  lightningSize: 14,
  lightningSpawnTime: 35000,
  fireSize: 12,
  fireSpawnTime: 20000,
  diagonalSize: 16,
  diagonalSpawnTime: 60000,
  mineSize: 10,
  mineSpawnTime: 55000,
  laserSpawnTime: 70000,
  teleportCubeSize: 16,
  teleportCubeSpawnTime: 80000,
  // Новые враги
  spinnerSize: 14,
  spinnerSpawnTime: 90000,
  ghostBallSize: 18,
  ghostBallSpawnTime: 100000,
  // Параметры нарастающей сложности
  minSpawnTime: 2000,
  difficultyIncreaseRate: 0.98, // Замедлил сложность
  difficultyUpdateInterval: 15000, // Увеличил интервал
  // Новые параметры для змейки
  snakeSegmentSize: 16,
  snakeSegmentSpawnTime: 110000,
  // Параметры для новых фигур
  pulsatingSphereSize: 20,
  pulsatingSphereSpawnTime: 45000,
  patrolSquareSize: 18,
  patrolSquareSpawnTime: 35000,
  reflectingProjectileSize: 10,
  reflectingProjectileSpawnTime: 50000,
  // Параметры для бонусов
  bonusSpawnTime: 8000, // Уменьшил с 20000 до 8000 (8 секунд)
  bonusSize: 15,
  shieldDuration: 5000,
  slowEnemiesDuration: 8000,
  sizeUpDuration: 15000,
  invisibilityDuration: 7000,
  extraTimeAmount: 10,
  // Параметры для новых врагов
  crystalControllerSize: 24,
  crystalControllerSpawnTime: 110000,
  phantomDuplicatorSize: 18,
  phantomDuplicatorSpawnTime: 120000,
  contaminationZoneSize: 30,
  contaminationZoneSpawnTime: 130000,
  // Параметры для боссов
  bossSize: 60,
  bossHealth: 5,
  bossAttackInterval: 3000,
  // Параметры для пушки
  cannonDuration: 30000, // 30 секунд
  cannonBallSpeed: 8,
  cannonBallDamage: 1,
}

export function createInitialGameState(config: GameConfig): GameState {
  return {
    isPlaying: false,
    isGameOver: false,
    score: 0,
    startTime: 0,
    player: {
      id: 'player',
      type: 'player',
      position: { x: config.gameWidth / 2, y: config.gameHeight / 2 },
      size: { width: config.playerSize, height: config.playerSize },
      color: '#3b82f6' // blue-500
    },
    entities: [],
    gameArea: { width: config.gameWidth, height: config.gameHeight },
    encounteredEnemies: [],
    activeBonuses: [],
    killerEnemy: null
  }
}

export function updatePlayerPosition(gameState: GameState, newPosition: Position): GameState {
  const { gameArea, player } = gameState
  
  // Ограничиваем позицию игрока границами игрового поля
  const clampedX = Math.max(player.size.width / 2, 
    Math.min(gameArea.width - player.size.width / 2, newPosition.x))
  const clampedY = Math.max(player.size.height / 2,
    Math.min(gameArea.height - player.size.height / 2, newPosition.y))

  return {
    ...gameState,
    player: {
      ...player,
      position: { x: clampedX, y: clampedY }
    }
  }
}

export function spawnChaser(gameState: GameState, config: GameConfig): GameState {
  const sides = ['top', 'bottom', 'left', 'right']
  const side = sides[Math.floor(Math.random() * sides.length)]

  let x: number, y: number

  switch (side) {
    case 'top':
      x = Math.random() * config.gameWidth
      y = 0
      break
    case 'bottom':
      x = Math.random() * config.gameWidth
      y = config.gameHeight
      break
    case 'left':
      x = 0
      y = Math.random() * config.gameHeight
      break
    case 'right':
      x = config.gameWidth
      y = Math.random() * config.gameHeight
      break
    default:
      x = 0
      y = 0
  }

  const chaser: ChaserSquare = {
    id: `chaser-${Date.now()}`,
    type: 'chaser',
    position: { x, y },
    size: { width: config.chaserSize, height: config.chaserSize },
    color: '#ef4444', // red-500
    speed: config.chaserSpeed
  }

  const newEncounteredEnemies = gameState.encounteredEnemies.includes('chaser')
    ? gameState.encounteredEnemies
    : [...gameState.encounteredEnemies, 'chaser']

  return {
    ...gameState,
    entities: [...gameState.entities, chaser],
    encounteredEnemies: newEncounteredEnemies
  }
}

export function spawnBouncingCircle(gameState: GameState, config: GameConfig): GameState {
  const x = Math.random() * (config.gameWidth - config.circleSize) + config.circleSize / 2
  const y = Math.random() * (config.gameHeight - config.circleSize) + config.circleSize / 2

  // Случайное направление
  const angle = Math.random() * 2 * Math.PI
  const velocity = {
    x: Math.cos(angle) * config.circleSpeed,
    y: Math.sin(angle) * config.circleSpeed
  }

  const circle: BouncingCircle = {
    id: `circle-${Date.now()}`,
    type: 'bouncing',
    position: { x, y },
    size: { width: config.circleSize, height: config.circleSize },
    color: '#10b981', // emerald-500
    velocity,
    speed: config.circleSpeed
  }

  const newEncounteredEnemies = gameState.encounteredEnemies.includes('bouncing')
    ? gameState.encounteredEnemies
    : [...gameState.encounteredEnemies, 'bouncing']

  return {
    ...gameState,
    entities: [...gameState.entities, circle],
    encounteredEnemies: newEncounteredEnemies
  }
}


// 12. Пульсирующая сфера (увеличивается и уменьшается в размерах)
export function spawnPulsatingSphere(gameState: GameState, config: GameConfig): GameState {
  const x = Math.random() * (config.gameWidth - config.pulsatingSphereSize) + config.pulsatingSphereSize / 2
  const y = Math.random() * (config.gameHeight - config.pulsatingSphereSize) + config.pulsatingSphereSize / 2
  const angle = Math.random() * 2 * Math.PI

  const pulsatingSphere: PulsatingSphere = {
    id: `pulsating-sphere-${Date.now()}`,
    type: 'pulsating-sphere',
    position: { x, y },
    size: { width: config.pulsatingSphereSize, height: config.pulsatingSphereSize },
    color: '#ec4899', // pink-500
    velocity: {
      x: Math.cos(angle) * 1.2,
      y: Math.sin(angle) * 1.2
    },
    speed: 1.2,
    pulseSpeed: 0.05,
    pulseDirection: 1,
    baseSize: config.pulsatingSphereSize
  }

  const newEncounteredEnemies = gameState.encounteredEnemies.includes('pulsating-sphere')
    ? gameState.encounteredEnemies
    : [...gameState.encounteredEnemies, 'pulsating-sphere']

  return {
    ...gameState,
    entities: [...gameState.entities, pulsatingSphere],
    encounteredEnemies: newEncounteredEnemies
  }
}

export function spawnStarGenerator(gameState: GameState, config: GameConfig): GameState {
  const x = Math.random() * (config.gameWidth - config.starSize) + config.starSize / 2
  const y = Math.random() * (config.gameHeight - config.starSize) + config.starSize / 2

  const star: StarGenerator = {
    id: `star-${Date.now()}`,
    type: 'star',
    position: { x, y },
    size: { width: config.starSize, height: config.starSize },
    color: '#fbbf24', // amber-400
    lastShot: Date.now(),
    shootInterval: config.starShootInterval
  }

  const newEncounteredEnemies = gameState.encounteredEnemies.includes('star')
    ? gameState.encounteredEnemies
    : [...gameState.encounteredEnemies, 'star']

  return {
    ...gameState,
    entities: [...gameState.entities, star],
    encounteredEnemies: newEncounteredEnemies
  }
}

export function createProjectilesFromStar(
  star: StarGenerator, 
  playerPosition: Position, 
  config: GameConfig
): PurpleProjectile[] {
  const projectiles: PurpleProjectile[] = []
  
  // Создаем 5 снарядов в разных направлениях
  for (let i = 0; i < 5; i++) {
    let angle: number
    
    if (i === 0) {
      // Первый снаряд летит прямо к игроку
      const dx = playerPosition.x - star.position.x
      const dy = playerPosition.y - star.position.y
      angle = Math.atan2(dy, dx)
    } else {
      // Остальные снаряды разлетаются веером
      const baseAngle = Math.atan2(playerPosition.y - star.position.y, playerPosition.x - star.position.x)
      const spread = Math.PI / 3 // 60 градусов разброс
      angle = baseAngle + (spread * (i - 2) / 2) // От -30 до +30 градусов относительно направления к игроку
    }
    
    const velocity = {
      x: Math.cos(angle) * config.projectileSpeed,
      y: Math.sin(angle) * config.projectileSpeed
    }

    projectiles.push({
      id: `projectile-${Date.now()}-${i}`,
      type: 'projectile',
      position: { x: star.position.x, y: star.position.y },
      size: { width: config.projectileSize, height: config.projectileSize },
      color: '#a855f7', // purple-500
      velocity,
      speed: config.projectileSpeed
    })
  }
  
  return projectiles
}

// === НОВЫЕ ФИГУРЫ ===

// 1. Треугольник
export function spawnTriangle(gameState: GameState, config: GameConfig): GameState {
  const x = Math.random() * (config.gameWidth - config.triangleSize) + config.triangleSize / 2
  const y = Math.random() * (config.gameHeight - config.triangleSize) + config.triangleSize / 2

  const triangle: TriangleSpinner = {
    id: `triangle-${Date.now()}`,
    type: 'triangle',
    position: { x, y },
    size: { width: config.triangleSize, height: config.triangleSize },
    color: '#f97316', // orange-500
    rotation: 0,
    rotationSpeed: 0.1
  }

  const newEncounteredEnemies = gameState.encounteredEnemies.includes('triangle')
    ? gameState.encounteredEnemies
    : [...gameState.encounteredEnemies, 'triangle']

  return {
    ...gameState,
    entities: [...gameState.entities, triangle],
    encounteredEnemies: newEncounteredEnemies
  }
}

// 2. Пентагон
export function spawnPentagon(gameState: GameState, config: GameConfig): GameState {
  const centerX = config.gameWidth / 2
  const centerY = config.gameHeight / 2
  const initialRadius = 100

  const pentagon: PentagonSpiral = {
    id: `pentagon-${Date.now()}`,
    type: 'pentagon',
    position: { x: centerX + initialRadius, y: centerY },
    size: { width: config.pentagonSize, height: config.pentagonSize },
    color: '#8b5cf6', // violet-500
    centerX,
    centerY,
    radius: initialRadius,
    angle: 0,
    spiralSpeed: 0.02
  }

  const newEncounteredEnemies = gameState.encounteredEnemies.includes('pentagon')
    ? gameState.encounteredEnemies
    : [...gameState.encounteredEnemies, 'pentagon']

  return {
    ...gameState,
    entities: [...gameState.entities, pentagon],
    encounteredEnemies: newEncounteredEnemies
  }
}

// 3. Молния
export function spawnLightning(gameState: GameState, config: GameConfig): GameState {
  const x = Math.random() * config.gameWidth
  const y = Math.random() * config.gameHeight
  const targetX = Math.random() * config.gameWidth
  const targetY = Math.random() * config.gameHeight

  const lightning: Lightning = {
    id: `lightning-${Date.now()}`,
    type: 'lightning',
    position: { x, y },
    size: { width: config.lightningSize, height: config.lightningSize },
    color: '#facc15', // yellow-400
    targetX,
    targetY,
    teleportCooldown: 2000, // 2 секунды
    lastTeleport: Date.now()
  }

  return {
    ...gameState,
    entities: [...gameState.entities, lightning]
  }
}



// 6. Огненный шар
export function spawnFireBall(gameState: GameState, config: GameConfig): GameState {
  const x = Math.random() * config.gameWidth
  const y = Math.random() * config.gameHeight
  const angle = Math.random() * 2 * Math.PI
  const speed = 2
  
  const fireBall: FireBall = {
    id: `fire-${Date.now()}`,
    type: 'fire',
    position: { x, y },
    size: { width: config.fireSize, height: config.fireSize },
    color: '#f59e0b', // amber-500
    velocity: {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    },
    speed,
    trail: []
  }

  return {
    ...gameState,
    entities: [...gameState.entities, fireBall]
  }
}

// 7. Диагональный охотник
export function spawnDiagonalHunter(gameState: GameState, config: GameConfig): GameState {
  const x = Math.random() * config.gameWidth
  const y = Math.random() * config.gameHeight
  
  const diagonal: DiagonalHunter = {
    id: `diagonal-${Date.now()}`,
    type: 'diagonal',
    position: { x, y },
    size: { width: config.diagonalSize, height: config.diagonalSize },
    color: '#6366f1', // indigo-500
    targetX: gameState.player.position.x,
    targetY: gameState.player.position.y,
    speed: 1.8
  }

  return {
    ...gameState,
    entities: [...gameState.entities, diagonal]
  }
}

// 8. Мина
export function spawnMine(gameState: GameState, config: GameConfig): GameState {
  const x = Math.random() * (config.gameWidth - config.mineSize) + config.mineSize / 2
  const y = Math.random() * (config.gameHeight - config.mineSize) + config.mineSize / 2

  const mine: Mine = {
    id: `mine-${Date.now()}`,
    type: 'mine',
    position: { x, y },
    size: { width: config.mineSize, height: config.mineSize },
    color: '#991b1b', // red-800
    explosionRadius: 60,
    triggerRadius: 40,
    isArmed: false,
    armingTime: 3000 // 3 секунды до активации
  }

  return {
    ...gameState,
    entities: [...gameState.entities, mine]
  }
}

// 9. Лазерный луч
export function spawnLaser(gameState: GameState, config: GameConfig): GameState {
  const centerX = Math.random() * config.gameWidth
  const centerY = Math.random() * config.gameHeight
  const length = 200

  const laser: LaserBeam = {
    id: `laser-${Date.now()}`,
    type: 'laser',
    position: { x: centerX, y: centerY }, // Позиция центра
    size: { width: length, height: 4 }, // Длина и ширина луча
    color: '#ef4444', // red-500
    centerX,
    centerY,
    length,
    angle: 0,
    rotationSpeed: 0.03,
    width: 4
  }

  return {
    ...gameState,
    entities: [...gameState.entities, laser]
  }
}

// 10. Телепортирующийся куб
export function spawnTeleportCube(gameState: GameState, config: GameConfig): GameState {
  const x = Math.random() * (config.gameWidth - config.teleportCubeSize) + config.teleportCubeSize / 2
  const y = Math.random() * (config.gameHeight - config.teleportCubeSize) + config.teleportCubeSize / 2

  const cube: TeleportCube = {
    id: `teleport-cube-${Date.now()}`,
    type: 'teleport-cube',
    position: { x, y },
    size: { width: config.teleportCubeSize, height: config.teleportCubeSize },
    color: '#ec4899', // pink-500
    teleportInterval: 4000, // 4 секунды
    lastTeleport: Date.now(),
    fadeOpacity: 1
  }

  return {
    ...gameState,
    entities: [...gameState.entities, cube]
  }
}

export function updateChaserPosition(chaser: ChaserSquare, playerPosition: Position, speedMultiplier: number = 1): ChaserSquare {
  const dx = playerPosition.x - chaser.position.x
  const dy = playerPosition.y - chaser.position.y
  
  // Движение только по осям (без диагонали)
  let newX = chaser.position.x
  let newY = chaser.position.y
  
  const speed = chaser.speed * speedMultiplier;

  if (Math.abs(dx) > Math.abs(dy)) {
    // Движение по X
    newX += dx > 0 ? speed : -speed
  } else {
    // Движение по Y
    newY += dy > 0 ? speed : -speed
  }

  return {
    ...chaser,
    position: { x: newX, y: newY }
  }
}

export function updatePlayerControlledChaser(
  chaser: ChaserSquare, 
  controls: { up: boolean, down: boolean, left: boolean, right: boolean },
  gameArea: { width: number, height: number }
): ChaserSquare {
  let newX = chaser.position.x
  let newY = chaser.position.y
  
  // Движение по стрелочкам
  if (controls.left) newX -= chaser.speed
  if (controls.right) newX += chaser.speed
  if (controls.up) newY -= chaser.speed
  if (controls.down) newY += chaser.speed
  
  // Ограничиваем границами игровой области
  const halfSize = chaser.size.width / 2
  newX = Math.max(halfSize, Math.min(gameArea.width - halfSize, newX))
  newY = Math.max(halfSize, Math.min(gameArea.height - halfSize, newY))

  return {
    ...chaser,
    position: { x: newX, y: newY }
  }
}

export function updateCirclePosition(circle: BouncingCircle, gameArea: { width: number, height: number }, speedMultiplier: number = 1): BouncingCircle {
  const speed = circle.speed * speedMultiplier;
  const newVelocity = {
      x: circle.velocity.x * speedMultiplier,
      y: circle.velocity.y * speedMultiplier
  }
  let newX = circle.position.x + newVelocity.x
  let newY = circle.position.y + newVelocity.y

  const radius = circle.size.width / 2

  // Отскок от стен
  if (newX - radius <= 0 || newX + radius >= gameArea.width) {
    newVelocity.x = -newVelocity.x
    newX = newX - radius <= 0 ? radius : gameArea.width - radius
  }
  
  if (newY - radius <= 0 || newY + radius >= gameArea.height) {
    newVelocity.y = -newVelocity.y
    newY = newY - radius <= 0 ? radius : gameArea.height - radius
  }

  return {
    ...circle,
    position: { x: newX, y: newY },
    velocity: newVelocity
  }
}

export function updateProjectilePosition(
  projectile: PurpleProjectile, 
  gameArea: { width: number, height: number }
): PurpleProjectile | null {
  const newX = projectile.position.x + projectile.velocity.x
  const newY = projectile.position.y + projectile.velocity.y
  
  const radius = projectile.size.width / 2

  // Проверяем, не вышел ли снаряд за границы
  if (newX + radius < 0 || newX - radius > gameArea.width || 
      newY + radius < 0 || newY - radius > gameArea.height) {
    return null // Снаряд исчезает
  }

  return {
    ...projectile,
    position: { x: newX, y: newY }
  }
}

// === ОБНОВЛЕНИЕ НОВЫХ ФИГУР ===

// 1. Обновление треугольника
export function updateTriangle(triangle: TriangleSpinner): TriangleSpinner {
  return {
    ...triangle,
    rotation: triangle.rotation + triangle.rotationSpeed
  }
}

// 12. Обновление пульсирующей сферы
export function updatePulsatingSphere(sphere: PulsatingSphere, gameArea: { width: number, height: number }, speedMultiplier: number = 1): PulsatingSphere {
  const speed = sphere.speed * speedMultiplier;
  const newVelocity = {
      x: sphere.velocity.x * speedMultiplier,
      y: sphere.velocity.y * speedMultiplier
  }
  let newX = sphere.position.x + newVelocity.x
  let newY = sphere.position.y + newVelocity.y

  // Отскок от стен
  const radius = sphere.size.width / 2
  if (newX - radius <= 0 || newX + radius >= gameArea.width) {
    newVelocity.x = -newVelocity.x
    newX = newX - radius <= 0 ? radius : gameArea.width - radius
  }
  if (newY - radius <= 0 || newY + radius >= gameArea.height) {
    newVelocity.y = -newVelocity.y
    newY = newY - radius <= 0 ? radius : gameArea.height - radius
  }

  // Изменение размера (пульсация)
  let newPulseDirection = sphere.pulseDirection;
  let newBaseSize = sphere.baseSize + sphere.pulseDirection * sphere.pulseSpeed;
  
  if (newBaseSize > sphere.baseSize * 1.5) { // Максимальный размер 1.5 от базового
    newBaseSize = sphere.baseSize * 1.5;
    newPulseDirection = -1;
  } else if (newBaseSize < sphere.baseSize * 0.7) { // Минимальный размер 0.7 от базового
    newBaseSize = sphere.baseSize * 0.7;
    newPulseDirection = 1;
  }

  return {
    ...sphere,
    position: { x: newX, y: newY },
    velocity: newVelocity,
    baseSize: newBaseSize,
    pulseDirection: newPulseDirection,
    size: { width: newBaseSize, height: newBaseSize }
  }
}

// 13. Патрульный квадрат (движется по прямоугольной траектории)
export function updatePatrolSquare(square: PatrolSquare, gameArea: { width: number, height: number }): PatrolSquare {
  // Определяем путь патрулирования (прямоугольник)
  const patrolPath = [
    { x: square.patrolPath[0].x, y: square.patrolPath[0].y }, // Начальная позиция
    { x: square.patrolPath[0].x, y: square.patrolPath[0].y + 100 }, // Вниз на 10 пикселей
    { x: square.patrolPath[0].x + 100, y: square.patrolPath[0].y + 100 }, // Вправо на 100 пикселей
    { x: square.patrolPath[0].x + 100, y: square.patrolPath[0].y }, // Вверх на 10 пикселей
    { x: square.patrolPath[0].x, y: square.patrolPath[0].y }, // Возвращаемся в начальную позицию
  ];
  
  // Получаем текущую и следующую точки пути
  const currentTarget = patrolPath[square.currentTargetIndex];
  const nextTarget = patrolPath[(square.currentTargetIndex + 1) % patrolPath.length];
  
  // Рассчитываем направление к следующей точке
  const dx = currentTarget.x - square.position.x;
  const dy = currentTarget.y - square.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Если достигли текущей цели, переходим к следующей
  if (distance < 5) { // Если близко к цели (в пределах 5 пикселей)
    const newTargetIndex = (square.currentTargetIndex + 1) % patrolPath.length;
    return {
      ...square,
      currentTargetIndex: newTargetIndex
    };
  }
  
  // Двигаемся к цели
  const moveX = (dx / distance) * square.speed;
  const moveY = (dy / distance) * square.speed;
  
  return {
    ...square,
    position: {
      x: square.position.x + moveX,
      y: square.position.y + moveY
    }
  };
}


// 15. Отражающийся снаряд (отскакивает от стен и объектов)
export function updateReflectingProjectile(projectile: ReflectingProjectile, gameArea: { width: number, height: number }): ReflectingProjectile | null {
  const newX = projectile.position.x + projectile.velocity.x
  const newY = projectile.position.y + projectile.velocity.y
  
  const radius = projectile.size.width / 2

  // Проверяем столкновения со стенами и отражаем при необходимости
  let newVelocity = { ...projectile.velocity }
  let newBounceCount = projectile.bounceCount

  if (newX - radius <= 0 || newX + radius >= gameArea.width) {
    newVelocity.x = -newVelocity.x
    newBounceCount++
  }
  
  if (newY - radius <= 0 || newY + radius >= gameArea.height) {
    newVelocity.y = -newVelocity.y
    newBounceCount++
  }

  // Если превышено максимальное количество отскоков, удаляем снаряд
  if (newBounceCount > projectile.maxBounces) {
    return null
  }

  return {
    ...projectile,
    position: { x: newX, y: newY },
    velocity: newVelocity,
    bounceCount: newBounceCount
  }
}

// 2. Обновление пентагона
export function updatePentagon(pentagon: PentagonSpiral): PentagonSpiral {
  const newAngle = pentagon.angle + pentagon.spiralSpeed
  const newRadius = pentagon.radius + 0.2 // Медленно расширяем спираль
  
  return {
    ...pentagon,
    angle: newAngle,
    radius: newRadius,
    position: {
      x: pentagon.centerX + Math.cos(newAngle) * newRadius,
      y: pentagon.centerY + Math.sin(newAngle) * newRadius
    }
  }
}

// 3. Обновление молнии
export function updateLightning(lightning: Lightning, gameArea: { width: number, height: number }): Lightning {
  const currentTime = Date.now()
  
  if (currentTime - lightning.lastTeleport >= lightning.teleportCooldown) {
    // Телепортация
    return {
      ...lightning,
      position: { x: lightning.targetX, y: lightning.targetY },
      targetX: Math.random() * gameArea.width,
      targetY: Math.random() * gameArea.height,
      lastTeleport: currentTime
    }
  }
  
  return lightning
}



// 6. Обновление огненного шара
export function updateFireBall(fireBall: FireBall, gameArea: { width: number, height: number }): FireBall | null {
  let newX = fireBall.position.x + fireBall.velocity.x
  let newY = fireBall.position.y + fireBall.velocity.y
  let newVelocity = { ...fireBall.velocity }
  
  // Отскок от стен
  const radius = fireBall.size.width / 2
  if (newX - radius <= 0 || newX + radius >= gameArea.width) {
    newVelocity.x = -newVelocity.x
    newX = newX - radius <= 0 ? radius : gameArea.width - radius
  }
  if (newY - radius <= 0 || newY + radius >= gameArea.height) {
    newVelocity.y = -newVelocity.y
    newY = newY - radius <= 0 ? radius : gameArea.height - radius
  }
  
  // Обновляем след
  const newTrail = [...fireBall.trail, { x: fireBall.position.x, y: fireBall.position.y }]
  if (newTrail.length > 10) {
    newTrail.shift() // Удаляем старые следы
  }
  
  return {
    ...fireBall,
    position: { x: newX, y: newY },
    velocity: newVelocity,
    trail: newTrail
  }
}

// 7. Обновление диагонального охотника
export function updateDiagonalHunter(hunter: DiagonalHunter, playerPosition: Position): DiagonalHunter {
  const dx = hunter.targetX - hunter.position.x
  const dy = hunter.targetY - hunter.position.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  if (distance > 10) {
    // Нормализуем направление и умножаем на скорость
    const normalizedDx = (dx / distance) * hunter.speed
    const normalizedDy = (dy / distance) * hunter.speed
    
    return {
      ...hunter,
      position: {
        x: hunter.position.x + normalizedDx,
        y: hunter.position.y + normalizedDy
      }
    }
  }
  
  // Если достиг цели, выбираем новую цель
  return {
    ...hunter,
    targetX: playerPosition.x,
    targetY: playerPosition.y
  }
}

// 8. Обновление мины
export function updateMine(mine: Mine): Mine {
  const currentTime = Date.now()
  
  if (!mine.isArmed && currentTime - mine.armingTime >= 0) {
    return {
      ...mine,
      isArmed: true,
      color: '#dc2626' // Красный когда вооружена
    }
  }
  
  return mine
}

// 9. Обновление лазера
export function updateLaser(laser: LaserBeam): LaserBeam {
  return {
    ...laser,
    angle: laser.angle + laser.rotationSpeed
  }
}

// 10. Обновление телепортирующегося куба
export function updateTeleportCube(cube: TeleportCube, gameArea: { width: number, height: number }): TeleportCube {
  const currentTime = Date.now()
  
  if (currentTime - cube.lastTeleport >= cube.teleportInterval) {
    // Телепортация
    const newX = Math.random() * (gameArea.width - cube.size.width) + cube.size.width / 2
    const newY = Math.random() * (gameArea.height - cube.size.height) + cube.size.height / 2
    
    return {
      ...cube,
      position: { x: newX, y: newY },
      lastTeleport: currentTime,
      fadeOpacity: 1
    }
  }
  
  // Плавное исчезновение перед телепортацией
  const timeUntilTeleport = cube.teleportInterval - (currentTime - cube.lastTeleport)
  const fadeOpacity = timeUntilTeleport < 1000 ? timeUntilTeleport / 1000 : 1
  
  return {
    ...cube,
    fadeOpacity
  }
}

export function checkCollision(player: Position & { size: { width: number, height: number } }, entity: GameEntity): boolean {
  const playerCenterX = player.x
  const playerCenterY = player.y
  const playerRadius = player.size.width / 2

  if (entity.type === 'bouncing' || entity.type === 'projectile' ||
      entity.type === 'triangle' || entity.type === 'pentagon' ||
      entity.type === 'lightning' || entity.type === 'fire' ||
      entity.type === 'teleport-cube' || entity.type === 'diagonal' ||
      entity.type === 'spinner' || entity.type === 'ghost-ball' ||
      entity.type === 'snake-segment') {
    // Круг-круг коллизия
    const entityCenterX = entity.position.x
    const entityCenterY = entity.position.y
    const entityRadius = entity.size.width / 2
    
    const distance = Math.sqrt(
      Math.pow(playerCenterX - entityCenterX, 2) + 
      Math.pow(playerCenterY - entityCenterY, 2)
    )
    
    return distance < (playerRadius + entityRadius)
  } else if (entity.type === 'laser') {
    // Коллизия с лазерным лучом
    const laser = entity as LaserBeam
    const dx = playerCenterX - laser.centerX
    const dy = playerCenterY - laser.centerY
    const distanceFromCenter = Math.sqrt(dx * dx + dy * dy)
    
    if (distanceFromCenter > laser.length) return false
    
    // Угол от центра лазера к игроку
    const angleToPlayer = Math.atan2(dy, dx)
    const angleDiff = Math.abs(angleToPlayer - laser.angle)
    const normalizedAngleDiff = Math.min(angleDiff, 2 * Math.PI - angleDiff)
    
    return normalizedAngleDiff < laser.width / distanceFromCenter
  } else if (entity.type === 'mine') {
    // Мина взрывается при приближении
    const mine = entity as Mine
    if (!mine.isArmed) return false
    
    const distance = Math.sqrt(
      Math.pow(playerCenterX - entity.position.x, 2) + 
      Math.pow(playerCenterY - entity.position.y, 2)
    )
    
    return distance < mine.triggerRadius
  } else {
    // Круг-прямоугольник коллизия для квадратов и звезд
    const rectLeft = entity.position.x - entity.size.width / 2
    const rectRight = entity.position.x + entity.size.width / 2
    const rectTop = entity.position.y - entity.size.height / 2
    const rectBottom = entity.position.y + entity.size.height / 2
    
    // Находим ближайшую точку прямоугольника к центру круга
    const closestX = Math.max(rectLeft, Math.min(playerCenterX, rectRight))
    const closestY = Math.max(rectTop, Math.min(playerCenterY, rectBottom))
    
    // Вычисляем расстояние от центра круга до ближайшей точки
    const distance = Math.sqrt(
      Math.pow(playerCenterX - closestX, 2) + 
      Math.pow(playerCenterY - closestY, 2)
    )
    
    return distance < playerRadius
  }
}

// Проверка столкновения с зоной опасности
function checkHazardZoneCollision(player: Position & { size: { width: number, height: number } }, hazardZone: HazardZone): boolean {
  const playerCenterX = player.x
  const playerCenterY = player.y
  const playerRadius = player.size.width / 2

  const rectLeft = hazardZone.position.x - hazardZone.size.width / 2
  const rectRight = hazardZone.position.x + hazardZone.size.width / 2
  const rectTop = hazardZone.position.y - hazardZone.size.height / 2
  const rectBottom = hazardZone.position.y + hazardZone.size.height / 2

  const closestX = Math.max(rectLeft, Math.min(playerCenterX, rectRight))
  const closestY = Math.max(rectTop, Math.min(playerCenterY, rectBottom))

  const distance = Math.sqrt(
    Math.pow(playerCenterX - closestX, 2) +
    Math.pow(playerCenterY - closestY, 2)
  )
  
  return distance < playerRadius
}

// Проверка столкновения между двумя сущностями
function checkEntityCollision(entity1: GameEntity, entity2: GameEntity): boolean {
  // Игнорируем статичные объекты и специальные типы
  if (entity1.type === 'star' || entity2.type === 'star' ||
      entity1.type === 'mine' || entity2.type === 'mine' ||
      entity1.type === 'laser' || entity2.type === 'laser') {
    return false
  }
  // Игнорируем столкновения между зонами опасности
  if (entity1.type === 'hazard-zone' || entity2.type === 'hazard-zone') {
    return false
  }

  const dx = entity1.position.x - entity2.position.x
  const dy = entity1.position.y - entity2.position.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  const minDistance = (entity1.size.width + entity2.size.width) / 2

  return distance < minDistance
}

// Обработка столкновения между сущностями
function handleEntityCollision(entity1: GameEntity, entity2: GameEntity): [GameEntity, GameEntity] {
  const dx = entity2.position.x - entity1.position.x
  const dy = entity2.position.y - entity1.position.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  if (distance === 0) return [entity1, entity2]

  // Нормализованный вектор столкновения
  const nx = dx / distance
  const ny = dy / distance

  let updated1 = { ...entity1 }
  let updated2 = { ...entity2 }

  // Обработка отскока для разных типов
  if (entity1.type === 'bouncing' && 'velocity' in entity1) {
    const bouncing1 = entity1 as BouncingCircle
    updated1 = {
      ...bouncing1,
      velocity: {
        x: -nx * bouncing1.speed,
        y: -ny * bouncing1.speed
      }
    }
  }

  if (entity2.type === 'bouncing' && 'velocity' in entity2) {
    const bouncing2 = entity2 as BouncingCircle
    updated2 = {
      ...bouncing2,
      velocity: {
        x: nx * bouncing2.speed,
        y: ny * bouncing2.speed
      }
    }
  }

  // Пентагон меняет направление спирали
  if (entity1.type === 'pentagon' && 'spiralSpeed' in entity1) {
    const pentagon1 = entity1 as PentagonSpiral
    updated1 = {
      ...pentagon1,
      spiralSpeed: -pentagon1.spiralSpeed
    }
  }

  if (entity2.type === 'pentagon' && 'spiralSpeed' in entity2) {
    const pentagon2 = entity2 as PentagonSpiral
    updated2 = {
      ...pentagon2,
      spiralSpeed: -pentagon2.spiralSpeed
    }
  }

  // Огненный шар отскакивает
  if (entity1.type === 'fire' && 'velocity' in entity1) {
    const fire1 = entity1 as FireBall
    updated1 = {
      ...fire1,
      velocity: {
        x: -nx * fire1.speed,
        y: -ny * fire1.speed
      }
    }
  }

  if (entity2.type === 'fire' && 'velocity' in entity2) {
    const fire2 = entity2 as FireBall
    updated2 = {
      ...fire2,
      velocity: {
        x: nx * fire2.speed,
        y: ny * fire2.speed
      }
    }
  }

  // Призрачный шар отскакивает
  if (entity1.type === 'ghost-ball' && 'velocity' in entity1) {
    const ghost1 = entity1 as GhostBall
    updated1 = {
      ...ghost1,
      velocity: {
        x: -nx * ghost1.speed,
        y: -ny * ghost1.speed
      }
    }
  }

  if (entity2.type === 'ghost-ball' && 'velocity' in entity2) {
    const ghost2 = entity2 as GhostBall
    updated2 = {
      ...ghost2,
      velocity: {
        x: nx * ghost2.speed,
        y: ny * ghost2.speed
      }
    }
  }

  // Треугольник меняет направление вращения
  if (entity1.type === 'triangle' && 'rotationSpeed' in entity1) {
    const triangle1 = entity1 as TriangleSpinner
    updated1 = {
      ...triangle1,
      rotationSpeed: -triangle1.rotationSpeed
    }
  }

  if (entity2.type === 'triangle' && 'rotationSpeed' in entity2) {
    const triangle2 = entity2 as TriangleSpinner
    updated2 = {
      ...triangle2,
      rotationSpeed: -triangle2.rotationSpeed
    }
  }

  // Спиннер меняет направление вращения
  if (entity1.type === 'spinner' && 'spinSpeed' in entity1) {
    const spinner1 = entity1 as Spinner
    updated1 = {
      ...spinner1,
      spinSpeed: -spinner1.spinSpeed
    }
  }

  if (entity2.type === 'spinner' && 'spinSpeed' in entity2) {
    const spinner2 = entity2 as Spinner
    updated2 = {
      ...spinner2,
      spinSpeed: -spinner2.spinSpeed
    }
  }

  return [updated1, updated2]
}

export function updateGameEntities(gameState: GameState, config: GameConfig): GameState {
  let newGameState = { ...gameState };

  // Обновляем активные бонусы
  newGameState = updateActiveBonuses(newGameState);

  const isSlowEnemiesActive = newGameState.activeBonuses.some(b => b.type === BonusType.SLOW_ENEMIES);
  const isSizeUpActive = newGameState.activeBonuses.some(b => b.type === BonusType.SIZE_UP);
  const isInvisibilityActive = newGameState.activeBonuses.some(b => b.type === BonusType.INVISIBILITY);

  // Обновляем размер игрока, если активен бонус SizeUp
  if (isSizeUpActive && newGameState.player.size.width === config.playerSize) {
    newGameState.player.size = { width: config.playerSize * 2, height: config.playerSize * 2 };
  } else if (!isSizeUpActive && newGameState.player.size.width !== config.playerSize) {
    newGameState.player.size = { width: config.playerSize, height: config.playerSize };
  }
  
  // Обновляем прозрачность игрока, если активен бонус невидимости
  if (isInvisibilityActive) {
      newGameState.player.color = 'rgba(59, 130, 246, 0.3)'; // blue-500 with opacity
  } else {
      newGameState.player.color = '#3b82f6'; // blue-500
  }

  const entitiesToProcess = [...newGameState.entities];
  let updatedEntities: GameEntity[] = [];
  const hazardZonesToAdd: HazardZone[] = [];
  
  // Обработка Кристаллического контроллера и заморозки
  const crystalController = entitiesToProcess.find(e => e.type === 'crystal-controller') as CrystalController | undefined;
  let isFrozen = false;
  let freezeEndTime = 0;

  if (crystalController && Date.now() - crystalController.lastFreeze > crystalController.freezeCooldown) {
    isFrozen = true;
    freezeEndTime = Date.now() + crystalController.freezeDuration;
    crystalController.lastFreeze = Date.now();
  }

  // Сначала обновляем позиции всех сущностей
  entitiesToProcess.forEach(entity => {
    let isEntityFrozen = false;
    if (isFrozen && entity.type !== 'player' && entity.type !== 'crystal-controller' && entity.type !== 'hazard-zone') {
        const dx = entity.position.x - crystalController!.position.x;
        const dy = entity.position.y - crystalController!.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < crystalController!.freezeRadius) {
            isEntityFrozen = true;
        }
    }

    if (isEntityFrozen) {
      updatedEntities.push(entity);
      return;
    }

    switch (entity.type) {
      case 'chaser':
        const speedMultiplier = isSlowEnemiesActive ? 0.5 : 1;
        const updatedChaser = updateChaserPosition(entity, newGameState.player.position, speedMultiplier);
        updatedEntities.push(updatedChaser);
        break;
      case 'bouncing':
        const updatedCircle = updateCirclePosition(entity, newGameState.gameArea, isSlowEnemiesActive ? 0.5 : 1);
        updatedEntities.push(updatedCircle);
        break;
      case 'star':
        updatedEntities.push(entity) // Звездочки не двигаются
        break
      case 'projectile':
        const updatedStarProjectile = updateProjectilePosition(entity, gameState.gameArea)
        if (updatedStarProjectile) {
          updatedEntities.push(updatedStarProjectile)
        }
        break
      // Новые фигуры
      case 'triangle':
        updatedEntities.push(updateTriangle(entity))
        break
      case 'pentagon':
        updatedEntities.push(updatePentagon(entity))
        break
      case 'lightning':
        updatedEntities.push(updateLightning(entity, gameState.gameArea))
        break
      case 'fire':
        const updatedFire = updateFireBall(entity, gameState.gameArea)
        if (updatedFire) {
          updatedEntities.push(updatedFire)
        }
        break
      case 'diagonal':
        updatedEntities.push(updateDiagonalHunter(entity, gameState.player.position))
        break
      case 'mine':
        updatedEntities.push(updateMine(entity))
        break
      case 'laser':
        updatedEntities.push(updateLaser(entity))
        break
      case 'teleport-cube':
        updatedEntities.push(updateTeleportCube(entity, gameState.gameArea))
        break
      case 'spinner':
        updatedEntities.push(updateSpinner(entity))
        break
      case 'ghost-ball':
        updatedEntities.push(updateGhostBall(entity, gameState.gameArea))
        break
      case 'snake-segment':
        const speedMultiplierSnake = isSlowEnemiesActive ? 0.5 : 1;
        updatedEntities.push(updateSnakeSegment(entity, newGameState.player.position, newGameState.entities.filter(e => e.type === 'snake-segment') as SnakeSegment[], speedMultiplierSnake))
        break
      case 'pulsating-sphere':
        const speedMultiplierPulsating = isSlowEnemiesActive ? 0.5 : 1;
        updatedEntities.push(updatePulsatingSphere(entity, newGameState.gameArea, speedMultiplierPulsating))
        break
      case 'patrol-square':
        updatedEntities.push(updatePatrolSquare(entity, gameState.gameArea))
        break
      case 'reflecting-projectile':
        const updatedReflectingProjectile = updateReflectingProjectile(entity, gameState.gameArea)
        if (updatedReflectingProjectile) {
          updatedEntities.push(updatedReflectingProjectile)
        }
        break
      case 'crystal-controller':
        updatedEntities.push(updateCrystalController(entity));
        break;
      case 'phantom-duplicator':
        updatedEntities.push(updatePhantomDuplicator(entity, newGameState));
        break;
      case 'contamination-zone':
        const [updatedZone, newHazards] = updateContaminationZone(entity, newGameState.player.position);
        updatedEntities.push(updatedZone);
        if (newHazards.length > 0) {
          hazardZonesToAdd.push(...newHazards);
        }
        break;
      case 'hazard-zone':
        updatedEntities.push(entity) // Зоны опасности не двигаются
        break;
      case 'bonus':
        updatedEntities.push(entity); // Бонусы не двигаются
        break;
      case 'mutated-enemy':
        const updatedMutated = updateMutatedEnemy(entity as MutatedEnemy, newGameState.player.position);
        updatedEntities.push(updatedMutated);
        break;
      case 'boss':
        const updatedBoss = updateBoss(entity as Boss, newGameState.player.position, newGameState.gameArea);
        updatedEntities.push(updatedBoss);
        break;
      case 'cannon-ball':
        const updatedCannonBall = updateCannonBall(entity as CannonBall, newGameState.gameArea);
        if (updatedCannonBall) {
          updatedEntities.push(updatedCannonBall);
        }
        break;
      default:
        updatedEntities.push(entity)
    }
  })
  
  // Добавляем новые зоны опасности
  updatedEntities.push(...hazardZonesToAdd);

  // Удаляем просроченные зоны опасности
  updatedEntities = updateHazardZones(updatedEntities);

  // Проверяем мутации врагов в зонах опасности
  const [mutatedEntities, updatedEncounteredEnemies] = checkEnemyMutations(updatedEntities, newGameState);
  updatedEntities = mutatedEntities;
  newGameState.encounteredEnemies = updatedEncounteredEnemies;

  // Проверяем попадания снарядов пушки
  const cannonBalls = updatedEntities.filter(e => e.type === 'cannon-ball') as CannonBall[];
  let totalBossesDefeated = 0;
  for (const cannonBall of cannonBalls) {
    const [entitiesAfterHit, hitSomething, bossDefeated] = checkCannonBallHit(cannonBall, updatedEntities);
    if (bossDefeated) {
      totalBossesDefeated++;
    }
    if (hitSomething) {
      // Удаляем снаряд после попадания
      updatedEntities = entitiesAfterHit.filter(e => e.id !== cannonBall.id);
    } else {
      updatedEntities = entitiesAfterHit;
    }
  }
  
  // Обновляем счетчик побежденных боссов
  if (totalBossesDefeated > 0) {
    // Это будет обработано в GameCanvas через колбэк
    newGameState.defeatedBossesThisUpdate = totalBossesDefeated;
  }

  // Проверяем столкновения между сущностями
  for (let i = 0; i < updatedEntities.length; i++) {
    for (let j = i + 1; j < updatedEntities.length; j++) {
      if (checkEntityCollision(updatedEntities[i], updatedEntities[j])) {
        const [updated1, updated2] = handleEntityCollision(updatedEntities[i], updatedEntities[j])
        updatedEntities[i] = updated1
        updatedEntities[j] = updated2
      }
    }
  }

  newGameState.entities = updatedEntities;

  // Проверка столкновения игрока с бонусами
  const bonuses = newGameState.entities.filter(e => e.type === 'bonus') as Bonus[];
  for (const bonus of bonuses) {
    if (checkCollision({ ...newGameState.player.position, size: newGameState.player.size }, bonus)) {
      newGameState = applyBonus(newGameState, bonus, config);
    }
  }

  return newGameState;
}

// Функция для вычисления текущих интервалов спавна на основе времени игры и коэффициента сложности
export function calculateCurrentSpawnIntervals(config: GameConfig, gameTime: number) {
 // Количество интервалов улучшения сложности, прошедших с начала игры
 const difficultyIntervalsPassed = Math.floor(gameTime / config.difficultyUpdateInterval);
 
 // Расчет коэффициента сложности: каждый интервал уменьшаем интервалы спавна
 const difficultyFactor = Math.pow(config.difficultyIncreaseRate, difficultyIntervalsPassed);
 
 // Расчет текущих интервалов спавна с ограничением минимального времени
 const calculateSpawnTime = (baseTime: number): number => {
   return Math.max(config.minSpawnTime, baseTime * difficultyFactor);
 };
 
 return {
   chaserSpawnTime: calculateSpawnTime(config.chaserSpawnTime),
   circleSpawnTime: calculateSpawnTime(config.circleSpawnTime),
   starSpawnTime: calculateSpawnTime(config.starSpawnTime),
   triangleSpawnTime: calculateSpawnTime(config.triangleSpawnTime),
   pentagonSpawnTime: calculateSpawnTime(config.pentagonSpawnTime),
   lightningSpawnTime: calculateSpawnTime(config.lightningSpawnTime),
   fireSpawnTime: calculateSpawnTime(config.fireSpawnTime),
   diagonalSpawnTime: calculateSpawnTime(config.diagonalSpawnTime),
   mineSpawnTime: calculateSpawnTime(config.mineSpawnTime),
   laserSpawnTime: calculateSpawnTime(config.laserSpawnTime),
   teleportCubeSpawnTime: calculateSpawnTime(config.teleportCubeSpawnTime),
   spinnerSpawnTime: calculateSpawnTime(config.spinnerSpawnTime),
   ghostBallSpawnTime: calculateSpawnTime(config.ghostBallSpawnTime),
   snakeSegmentSpawnTime: calculateSpawnTime(config.snakeSegmentSpawnTime),
   pulsatingSphereSpawnTime: calculateSpawnTime(config.pulsatingSphereSpawnTime),
   patrolSquareSpawnTime: calculateSpawnTime(config.patrolSquareSpawnTime),
   reflectingProjectileSpawnTime: calculateSpawnTime(config.reflectingProjectileSpawnTime),
   crystalControllerSpawnTime: calculateSpawnTime(config.crystalControllerSpawnTime),
   phantomDuplicatorSpawnTime: calculateSpawnTime(config.phantomDuplicatorSpawnTime),
   contaminationZoneSpawnTime: calculateSpawnTime(config.contaminationZoneSpawnTime),
 };
}

// 11. Спиннер (быстро вращается вокруг центра)
export function spawnSpinner(gameState: GameState, config: GameConfig): GameState {
  const centerX = config.gameWidth / 2
  const centerY = config.gameHeight / 2
  const radius = 150

  const spinner: Spinner = {
    id: `spinner-${Date.now()}`,
    type: 'spinner',
    position: { x: centerX + radius, y: centerY },
    size: { width: config.spinnerSize, height: config.spinnerSize },
    color: '#7c3aed', // violet-600
    centerX,
    centerY,
    radius,
    angle: 0,
    spinSpeed: 0.05
  }

  const newEncounteredEnemies = gameState.encounteredEnemies.includes('spinner')
    ? gameState.encounteredEnemies
    : [...gameState.encounteredEnemies, 'spinner']

  return {
    ...gameState,
    entities: [...gameState.entities, spinner],
    encounteredEnemies: newEncounteredEnemies
  }
}


// 12. Призрачный шар (постепенно появляется и исчезает)
export function spawnGhostBall(gameState: GameState, config: GameConfig): GameState {
  const x = Math.random() * (config.gameWidth - config.ghostBallSize) + config.ghostBallSize / 2
  const y = Math.random() * (config.gameHeight - config.ghostBallSize) + config.ghostBallSize / 2
  const angle = Math.random() * 2 * Math.PI

  const ghostBall: GhostBall = {
    id: `ghost-ball-${Date.now()}`,
    type: 'ghost-ball',
    position: { x, y },
    size: { width: config.ghostBallSize, height: config.ghostBallSize },
    color: '#8b5cf6', // violet-500
    velocity: {
      x: Math.cos(angle) * 1.5,
      y: Math.sin(angle) * 1.5
    },
    speed: 1.5,
    opacity: 0.3,
    fadeDirection: 1
  }

  const newEncounteredEnemies = gameState.encounteredEnemies.includes('ghost-ball')
    ? gameState.encounteredEnemies
    : [...gameState.encounteredEnemies, 'ghost-ball']

  return {
    ...gameState,
    entities: [...gameState.entities, ghostBall],
    encounteredEnemies: newEncounteredEnemies
  }
}

// 16. Отражающийся снаряд (отскакивает от стен)
export function spawnReflectingProjectile(gameState: GameState, config: GameConfig): GameState {
  // Случайная позиция и направление
  const x = Math.random() * (config.gameWidth - config.reflectingProjectileSize) + config.reflectingProjectileSize / 2;
  const y = Math.random() * (config.gameHeight - config.reflectingProjectileSize) + config.reflectingProjectileSize / 2;
  const angle = Math.random() * 2 * Math.PI;

  const reflectingProjectile: ReflectingProjectile = {
    id: `reflecting-projectile-${Date.now()}`,
    type: 'reflecting-projectile',
    position: { x, y },
    size: { width: config.reflectingProjectileSize, height: config.reflectingProjectileSize },
    color: '#fbbf24', // amber-400
    velocity: {
      x: Math.cos(angle) * 3,
      y: Math.sin(angle) * 3
    },
    speed: 3,
    bounceCount: 0,
    maxBounces: 5
  }

  const newEncounteredEnemies = gameState.encounteredEnemies.includes('reflecting-projectile')
    ? gameState.encounteredEnemies
    : [...gameState.encounteredEnemies, 'reflecting-projectile']

  return {
    ...gameState,
    entities: [...gameState.entities, reflectingProjectile],
    encounteredEnemies: newEncounteredEnemies
  }
}


// Обновление спиннера
export function updateSpinner(spinner: Spinner): Spinner {
  const newAngle = spinner.angle + spinner.spinSpeed

  return {
    ...spinner,
    angle: newAngle,
    position: {
      x: spinner.centerX + Math.cos(newAngle) * spinner.radius,
      y: spinner.centerY + Math.sin(newAngle) * spinner.radius
    }
  }
}

// Обновление призрачного шара
export function updateGhostBall(ghostBall: GhostBall, gameArea: { width: number, height: number }): GhostBall {
  let newX = ghostBall.position.x + ghostBall.velocity.x
  let newY = ghostBall.position.y + ghostBall.velocity.y
  let newVelocity = { ...ghostBall.velocity }

  // Отскок от стен
  const radius = ghostBall.size.width / 2
  if (newX - radius <= 0 || newX + radius >= gameArea.width) {
    newVelocity.x = -newVelocity.x
    newX = newX - radius <= 0 ? radius : gameArea.width - radius
  }
  if (newY - radius <= 0 || newY + radius >= gameArea.height) {
    newVelocity.y = -newVelocity.y
    newY = newY - radius <= 0 ? radius : gameArea.height - radius
  }

  // Изменение прозрачности
  let newOpacity = ghostBall.opacity + (ghostBall.fadeDirection * 0.02)
  let newFadeDirection = ghostBall.fadeDirection

  if (newOpacity >= 1) {
    newOpacity = 1
    newFadeDirection = -1
  } else if (newOpacity <= 0.1) {
    newOpacity = 0.1
    newFadeDirection = 1
  }

  return {
    ...ghostBall,
    position: { x: newX, y: newY },
    velocity: newVelocity,
    opacity: newOpacity,
    fadeDirection: newFadeDirection
  }
}

// 11. Спавн змейки из 5 сегментов (сегменты движутся к игроку)
export function spawnSnake(gameState: GameState, config: GameConfig): GameState {
  const snakeLength = 5;
  const segments: SnakeSegment[] = [];
  const spacing = 25; // Расстояние между сегментами
  
  // Создаем голову змейки
  const headX = Math.random() * (config.gameWidth - config.snakeSegmentSize) + config.snakeSegmentSize / 2;
  const headY = Math.random() * (config.gameHeight - config.snakeSegmentSize) + config.snakeSegmentSize / 2;
  
  // Определяем направление к игроку для головы
  const dx = gameState.player.position.x - headX;
  const dy = gameState.player.position.y - headY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const speed = 1.2;
  
  const head: SnakeSegment = {
    id: `snake-head-${Date.now()}`,
    type: 'snake-segment',
    position: { x: headX, y: headY },
    size: { width: config.snakeSegmentSize, height: config.snakeSegmentSize },
    color: '#ef4444', // Красная голова
    velocity: {
      x: (dx / distance) * speed,
      y: (dy / distance) * speed
    },
    speed,
    segmentIndex: 0, // Голова
    connectedTo: undefined
  };
  
  segments.push(head);
  
  // Создаем остальные сегменты, следующие за головой
  for (let i = 1; i < snakeLength; i++) {
    const segmentX = headX - Math.cos(Math.atan2(dy, dx)) * spacing * i;
    const segmentY = headY - Math.sin(Math.atan2(dy, dx)) * spacing * i;
    
    const segment: SnakeSegment = {
      id: `snake-segment-${Date.now()}-${i}`,
      type: 'snake-segment',
      position: { x: segmentX, y: segmentY },
      size: { width: config.snakeSegmentSize, height: config.snakeSegmentSize },
      color: '#f87171', // Светло-красные сегменты
      velocity: {
        x: (dx / distance) * speed * 0.8, // Slightly slower than the head
        y: (dy / distance) * speed * 0.8
      },
      speed: speed * 0.8,
      segmentIndex: i, // Позиция в змейке
      connectedTo: segments[i-1].id // Связь с предыдущим сегментом
    };
    
    segments.push(segment);
  }

  const newEncounteredEnemies = gameState.encounteredEnemies.includes('snake-segment')
    ? gameState.encounteredEnemies
    : [...gameState.encounteredEnemies, 'snake-segment']

  return {
    ...gameState,
    entities: [...gameState.entities, ...segments],
    encounteredEnemies: newEncounteredEnemies
  };
}


// Обновление позиции сегмента змейки
export function updateSnakeSegment(segment: SnakeSegment, playerPosition: Position, allSegments: SnakeSegment[], speedMultiplier: number = 1): SnakeSegment {
  // Голова змейки движется к игроку
  if (segment.segmentIndex === 0) {
    const dx = playerPosition.x - segment.position.x;
    const dy = playerPosition.y - segment.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const speed = segment.speed * speedMultiplier;

    if (distance > 0) {
      // Нормализуем направление к игроку и умножаем на скорость
      const normalizedDx = (dx / distance) * speed;
      const normalizedDy = (dy / distance) * speed;

      return {
        ...segment,
        position: {
          x: segment.position.x + normalizedDx,
          y: segment.position.y + normalizedDy
        },
        velocity: {
          x: normalizedDx,
          y: normalizedDy
        }
      };
    }
  } else {
    // Остальные сегменты следуют за предыдущим сегментом
    const prevSegmentId = segment.connectedTo;
    const prevSegment = allSegments.find(s => s.id === prevSegmentId);

    if (prevSegment) {
      const dx = prevSegment.position.x - segment.position.x;
      const dy = prevSegment.position.y - segment.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const followDistance = 20; // Расстояние, на котором сегмент должен следовать за предыдущим

      if (distance > followDistance) {
        // Нормализуем направление к предыдущему сегменту и умножаем на скорость
        const normalizedDx = (dx / distance) * segment.speed;
        const normalizedDy = (dy / distance) * segment.speed;

        return {
          ...segment,
          position: {
            x: segment.position.x + normalizedDx,
            y: segment.position.y + normalizedDy
          },
          velocity: {
            x: normalizedDx,
            y: normalizedDy
          }
        };
      }
    }
  }

  return segment;
}

// === ЛОГИКА БОНУСОВ ===

export function spawnBonus(gameState: GameState, config: GameConfig): GameState {
  // Проверяем, нужна ли пушка (если есть босс)
  const needsCannon = shouldSpawnCannon(gameState)
  
  let bonusType: BonusType
  
  if (needsCannon && Math.random() < 0.7) { // 70% шанс пушки если есть босс
    bonusType = BonusType.CANNON
  } else {
    // Увеличиваем шанс появления щита
    const weightedBonusTypes = [
      BonusType.SHIELD, BonusType.SHIELD, BonusType.SHIELD, // Щит появляется в 3 раза чаще
      BonusType.SLOW_ENEMIES,
      BonusType.SIZE_UP,
      BonusType.INVISIBILITY,
      BonusType.EXTRA_TIME
    ];
    
    bonusType = weightedBonusTypes[Math.floor(Math.random() * weightedBonusTypes.length)];
  }

  const x = Math.random() * (config.gameWidth - config.bonusSize) + config.bonusSize / 2;
  const y = Math.random() * (config.gameHeight - config.bonusSize) + config.bonusSize / 2;

  const bonus: Bonus = {
    id: `bonus-${Date.now()}`,
    type: 'bonus',
    bonusType,
    position: { x, y },
    size: { width: config.bonusSize, height: config.bonusSize },
    color: bonusType === BonusType.CANNON ? '#f59e0b' : '#FFD700', // Оранжевый для пушки, золотой для остальных
  };

  return {
    ...gameState,
    entities: [...gameState.entities, bonus],
  };
}

export function applyBonus(gameState: GameState, bonus: Bonus, config: GameConfig): GameState {
  const now = Date.now();
  let newActiveBonuses = [...gameState.activeBonuses];
  let newScore = gameState.score;

  const existingBonusIndex = newActiveBonuses.findIndex(ab => ab.type === bonus.bonusType);
  if (existingBonusIndex !== -1) {
    // Если бонус уже активен, просто продлеваем его действие
    newActiveBonuses[existingBonusIndex].endTime += getBonusDuration(bonus.bonusType, config);
  } else {
    // Иначе добавляем новый активный бонус
    const activeBonus: ActiveBonus = {
      id: bonus.id,
      type: bonus.bonusType,
      endTime: now + getBonusDuration(bonus.bonusType, config),
    };
    newActiveBonuses.push(activeBonus);
  }

  if (bonus.bonusType === BonusType.EXTRA_TIME) {
    newScore += config.extraTimeAmount;
  }

  return {
    ...gameState,
    score: newScore,
    activeBonuses: newActiveBonuses,
    entities: gameState.entities.filter(e => e.id !== bonus.id), // Удаляем бонус с поля
  };
}

function getBonusDuration(bonusType: BonusType, config: GameConfig): number {
  switch (bonusType) {
    case BonusType.SHIELD:
      return config.shieldDuration;
    case BonusType.SLOW_ENEMIES:
      return config.slowEnemiesDuration;
    case BonusType.SIZE_UP:
      return config.sizeUpDuration;
    case BonusType.INVISIBILITY:
      return config.invisibilityDuration;
    case BonusType.CANNON:
      return config.cannonDuration;
    default:
      return 0;
  }
}

export function updateActiveBonuses(gameState: GameState): GameState {
  const now = Date.now();
  const activeBonuses = gameState.activeBonuses.filter(bonus => bonus.endTime > now);
  
  // Логика для бонусов, которые изменяют состояние игрока или врагов
  // должна быть применена здесь, в игровом цикле.
  // Например, для замедления врагов, нужно будет изменить их скорость.
  // Для щита - игнорировать коллизии.

  return { ...gameState, activeBonuses };
}


export function checkGameOver(gameState: GameState): GameEntity | null {
  const isShieldActive = gameState.activeBonuses.some(b => b.type === BonusType.SHIELD);
  if (isShieldActive) {
    return null; // Игрок неуязвим
  }

  for (const entity of gameState.entities) {
    if (entity.type === 'bonus') continue; // Не проверять столкновение с бонусами
    if (checkCollision({ ...gameState.player.position, size: gameState.player.size }, entity)) {
      return entity; // Возвращаем врага, с которым произошло столкновение
    }
  }
  
  return null; // Столкновений нет
}

// Функция спавна кристаллического контроллера
export function spawnCrystalController(gameState: GameState, config: GameConfig): GameState {
  const x = Math.random() * (config.gameWidth - config.crystalControllerSize) + config.crystalControllerSize / 2
  const y = Math.random() * (config.gameHeight - config.crystalControllerSize) + config.crystalControllerSize / 2

  const crystalController: CrystalController = {
    id: `crystal-controller-${Date.now()}`,
    type: 'crystal-controller',
    position: { x, y },
    size: { width: config.crystalControllerSize, height: config.crystalControllerSize },
    color: '#8b5cf6', // violet-500
    lastFreeze: Date.now(),
    freezeCooldown: 8000, // 8 секунд
    freezeDuration: 1500, // 1.5 секунды
    freezeRadius: 150
  }

  const newEncounteredEnemies = gameState.encounteredEnemies.includes('crystal-controller')
    ? gameState.encounteredEnemies
    : [...gameState.encounteredEnemies, 'crystal-controller']

  return {
    ...gameState,
    entities: [...gameState.entities, crystalController],
    encounteredEnemies: newEncounteredEnemies
  }
}

// Функция спавна призрачного дубликатора
export function spawnPhantomDuplicator(gameState: GameState, config: GameConfig): GameState {
  // Начинаем за пределами экрана, чтобы дать время для синхронизации
  const x = -config.phantomDuplicatorSize
  const y = -config.phantomDuplicatorSize

  const duplicator: PhantomDuplicator = {
    id: `phantom-duplicator-${Date.now()}`,
    type: 'phantom-duplicator',
    position: { x, y },
    size: { width: config.phantomDuplicatorSize, height: config.phantomDuplicatorSize },
    color: 'rgba(128, 128, 128, 0.6)', // полупрозрачный серый
    targetPosition: { ...gameState.player.position },
    delay: 1000, // 1 секунда задержки
    lastUpdate: Date.now(),
    offset: 30 // максимальное отклонение от маршрута
  }

  const newEncounteredEnemies = gameState.encounteredEnemies.includes('phantom-duplicator')
    ? gameState.encounteredEnemies
    : [...gameState.encounteredEnemies, 'phantom-duplicator']

  return {
    ...gameState,
    entities: [...gameState.entities, duplicator],
    encounteredEnemies: newEncounteredEnemies
  }
}

// Функция спавна зоны заражения
export function spawnContaminationZone(gameState: GameState, config: GameConfig): GameState {
  const x = Math.random() * (config.gameWidth - config.contaminationZoneSize) + config.contaminationZoneSize / 2
  const y = Math.random() * (config.gameHeight - config.contaminationZoneSize) + config.contaminationZoneSize / 2

  const contaminationZone: ContaminationZone = {
    id: `contamination-zone-${Date.now()}`,
    type: 'contamination-zone',
    position: { x, y },
    size: { width: config.contaminationZoneSize, height: config.contaminationZoneSize },
    color: '#4ade80', // green-400
    lastDrop: Date.now(),
    dropInterval: 5000, // 5 секунд
    zoneDuration: 8000 // 8 секунд жизни зоны
  }

  const newEncounteredEnemies = gameState.encounteredEnemies.includes('contamination-zone')
    ? gameState.encounteredEnemies
    : [...gameState.encounteredEnemies, 'contamination-zone']

  return {
    ...gameState,
    entities: [...gameState.entities, contaminationZone],
    encounteredEnemies: newEncounteredEnemies
  }
}

// Функция обновления кристаллического контроллера
export function updateCrystalController(controller: CrystalController): CrystalController {
  return controller // Кристаллический контроллер не двигается
}

// Функция обновления призрачного дубликатора
export function updatePhantomDuplicator(duplicator: PhantomDuplicator, gameState: GameState): PhantomDuplicator {
  const currentTime = Date.now()
  
  // Обновляем позицию с задержкой
  if (currentTime - duplicator.lastUpdate >= duplicator.delay) {
    // Обновляем целевую позицию до текущей позиции игрока
    const newTargetPosition = { ...gameState.player.position }
    
    // Добавляем случайное отклонение
    const offsetX = (Math.random() - 0.5) * duplicator.offset
    const offsetY = (Math.random() - 0.5) * duplicator.offset
    
    return {
      ...duplicator,
      position: {
        x: duplicator.targetPosition.x + offsetX,
        y: duplicator.targetPosition.y + offsetY
      },
      targetPosition: newTargetPosition,
      lastUpdate: currentTime
    }
  }
  
  return duplicator
}

// Функция обновления зоны заражения
export function updateContaminationZone(zone: ContaminationZone, playerPosition: Position): [ContaminationZone, HazardZone[]] {
  const currentTime = Date.now()
  const newHazards: HazardZone[] = []
  
  // Движение к игроку
  const dx = playerPosition.x - zone.position.x
  const dy = playerPosition.y - zone.position.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  const speed = 0.8
  
  let newPosition = { ...zone.position }
  if (distance > 5) { // Если не слишком близко к игроку
    const normalizedDx = (dx / distance) * speed
    const normalizedDy = (dy / distance) * speed
    newPosition = {
      x: zone.position.x + normalizedDx,
      y: zone.position.y + normalizedDy
    }
  }
  
  // Создание зоны опасности
  if (currentTime - zone.lastDrop >= zone.dropInterval) {
    const hazardZone: HazardZone = {
      id: `hazard-zone-${Date.now()}`,
      type: 'hazard-zone',
      position: { ...zone.position },
      size: { width: 40, height: 40 }, // Размер зоны опасности
      color: 'rgba(74, 222, 128, 0.3)', // Прозрачный зеленый
      expirationTime: currentTime + zone.zoneDuration
    }
    
    newHazards.push(hazardZone)
    
    return [{
      ...zone,
      position: newPosition,
      lastDrop: currentTime
    }, newHazards]
  }
  
  return [{
    ...zone,
    position: newPosition
  }, newHazards]
}

// Функция обновления зон опасности
export function updateHazardZones(entities: GameEntity[]): GameEntity[] {
  const currentTime = Date.now()
  return entities.filter(entity => {
    if (entity.type === 'hazard-zone') {
      return (entity as HazardZone).expirationTime > currentTime
    }
    return true
  })
}

// Функция создания мутированного врага
export function createMutatedEnemy(originalEnemy: GameEntity): MutatedEnemy {
  const aggressiveness = Math.floor(Math.random() * 3) + 1 // 1-3 уровень агрессивности
  
  return {
    id: `mutated-${originalEnemy.id}`,
    type: 'mutated-enemy',
    originalType: originalEnemy.type,
    position: { ...originalEnemy.position },
    size: { 
      width: originalEnemy.size.width * (1 + aggressiveness * 0.2), // Увеличиваем размер
      height: originalEnemy.size.height * (1 + aggressiveness * 0.2)
    },
    color: aggressiveness === 1 ? '#ff6b6b' : aggressiveness === 2 ? '#ff4757' : '#ff3838', // Красные оттенки
    mutationTime: Date.now(),
    speed: 1.5 + aggressiveness * 0.5, // Увеличиваем скорость
    aggressiveness
  }
}

// Функция проверки мутации врагов в зонах опасности
export function checkEnemyMutations(entities: GameEntity[], gameState: GameState): [GameEntity[], string[]] {
  const hazardZones = entities.filter(e => e.type === 'hazard-zone') as HazardZone[]
  const mutatedEntities: GameEntity[] = []
  let newEncounteredEnemies = [...gameState.encounteredEnemies]
  
  entities.forEach(entity => {
    // Пропускаем игрока, бонусы, зоны опасности и уже мутированных врагов
    if (entity.type === 'player' || entity.type === 'bonus' || 
        entity.type === 'hazard-zone' || entity.type === 'mutated-enemy') {
      mutatedEntities.push(entity)
      return
    }
    
    // Проверяем, находится ли враг в зоне опасности
    let shouldMutate = false
    for (const hazardZone of hazardZones) {
      const dx = entity.position.x - hazardZone.position.x
      const dy = entity.position.y - hazardZone.position.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < hazardZone.size.width / 2) {
        shouldMutate = true
        break
      }
    }
    
    if (shouldMutate) {
      // Создаем мутированного врага
      const mutatedEnemy = createMutatedEnemy(entity)
      mutatedEntities.push(mutatedEnemy)
      
      // Добавляем мутированного врага в список встреченных
      if (!newEncounteredEnemies.includes('mutated-enemy')) {
        newEncounteredEnemies.push('mutated-enemy')
      }
    } else {
      mutatedEntities.push(entity)
    }
  })
  
  return [mutatedEntities, newEncounteredEnemies]
}

// Функция обновления мутированного врага
export function updateMutatedEnemy(enemy: MutatedEnemy, playerPosition: Position): MutatedEnemy {
  // Агрессивное движение к игроку
  const dx = playerPosition.x - enemy.position.x
  const dy = playerPosition.y - enemy.position.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  let newPosition = { ...enemy.position }
  if (distance > 5) {
    const normalizedDx = (dx / distance) * enemy.speed
    const normalizedDy = (dy / distance) * enemy.speed
    newPosition = {
      x: enemy.position.x + normalizedDx,
      y: enemy.position.y + normalizedDy
    }
  }
  
  return {
    ...enemy,
    position: newPosition
  }
}

// === СИСТЕМА БОССОВ ===

// Функция создания босса
export function spawnBoss(gameState: GameState, config: GameConfig, minute: number): GameState {
  const bossTypes: Boss['bossType'][] = ['minute-1', 'minute-2', 'minute-3', 'minute-4', 'minute-5']
  const bossType = bossTypes[Math.min(minute - 1, 4)] // Максимум 5 типов боссов
  
  const x = config.gameWidth / 2
  const y = config.gameHeight / 2
  
  const boss: Boss = {
    id: `boss-${minute}-${Date.now()}`,
    type: 'boss',
    bossType,
    position: { x, y },
    size: { width: config.bossSize, height: config.bossSize },
    color: getBossColor(bossType),
    health: config.bossHealth,
    maxHealth: config.bossHealth,
    spawnTime: Date.now(),
    lastAttack: Date.now(),
    attackInterval: config.bossAttackInterval,
    phase: 1
  }
  
  const newEncounteredEnemies = gameState.encounteredEnemies.includes('boss')
    ? gameState.encounteredEnemies
    : [...gameState.encounteredEnemies, 'boss']
  
  return {
    ...gameState,
    entities: [...gameState.entities, boss],
    encounteredEnemies: newEncounteredEnemies
  }
}

// Функция получения цвета босса
function getBossColor(bossType: Boss['bossType']): string {
  switch (bossType) {
    case 'minute-1': return '#8b5cf6' // фиолетовый
    case 'minute-2': return '#ef4444' // красный
    case 'minute-3': return '#f59e0b' // оранжевый
    case 'minute-4': return '#10b981' // зеленый
    case 'minute-5': return '#3b82f6' // синий
    default: return '#6b7280' // серый
  }
}

// Функция обновления босса
export function updateBoss(boss: Boss, playerPosition: Position, gameArea: { width: number, height: number }): Boss {
  const currentTime = Date.now()
  
  // Движение босса (медленное преследование игрока)
  const dx = playerPosition.x - boss.position.x
  const dy = playerPosition.y - boss.position.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  let newPosition = { ...boss.position }
  if (distance > 10) {
    const speed = 0.5 + (boss.phase - 1) * 0.2 // Скорость увеличивается с фазой
    const normalizedDx = (dx / distance) * speed
    const normalizedDy = (dy / distance) * speed
    newPosition = {
      x: Math.max(boss.size.width / 2, Math.min(gameArea.width - boss.size.width / 2, boss.position.x + normalizedDx)),
      y: Math.max(boss.size.height / 2, Math.min(gameArea.height - boss.size.height / 2, boss.position.y + normalizedDy))
    }
  }
  
  // Определение фазы босса по здоровью
  const healthPercent = boss.health / boss.maxHealth
  let newPhase = 1
  if (healthPercent <= 0.33) newPhase = 3
  else if (healthPercent <= 0.66) newPhase = 2
  
  return {
    ...boss,
    position: newPosition,
    phase: newPhase,
    lastAttack: currentTime
  }
}

// Функция создания снаряда пушки
export function createCannonBall(startPosition: Position, targetPosition: Position, config: GameConfig): CannonBall {
  const dx = targetPosition.x - startPosition.x
  const dy = targetPosition.y - startPosition.y
  const distance = Math.sqrt(dx * dx + dy * dy)
  
  const velocity = {
    x: (dx / distance) * config.cannonBallSpeed,
    y: (dy / distance) * config.cannonBallSpeed
  }
  
  return {
    id: `cannon-ball-${Date.now()}`,
    type: 'cannon-ball',
    position: { ...startPosition },
    size: { width: 8, height: 8 },
    color: '#fbbf24', // желтый
    velocity,
    speed: config.cannonBallSpeed,
    damage: config.cannonBallDamage
  }
}

// Функция обновления снаряда пушки
export function updateCannonBall(cannonBall: CannonBall, gameArea: { width: number, height: number }): CannonBall | null {
  const newPosition = {
    x: cannonBall.position.x + cannonBall.velocity.x,
    y: cannonBall.position.y + cannonBall.velocity.y
  }
  
  // Удаляем снаряд если он вышел за границы
  if (newPosition.x < 0 || newPosition.x > gameArea.width || 
      newPosition.y < 0 || newPosition.y > gameArea.height) {
    return null
  }
  
  return {
    ...cannonBall,
    position: newPosition
  }
}

// Функция проверки попадания снаряда в врага
export function checkCannonBallHit(cannonBall: CannonBall, entities: GameEntity[]): [GameEntity[], boolean, boolean] {
  const updatedEntities: GameEntity[] = []
  let hitSomething = false
  let bossDefeated = false
  
  entities.forEach(entity => {
    if (entity.id === cannonBall.id) {
      return // Пропускаем сам снаряд
    }
    
    // Проверяем попадание в врагов (кроме игрока, бонусов и зон опасности)
    if (entity.type !== 'player' && entity.type !== 'bonus' && entity.type !== 'hazard-zone') {
      const dx = cannonBall.position.x - entity.position.x
      const dy = cannonBall.position.y - entity.position.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      if (distance < (cannonBall.size.width / 2 + entity.size.width / 2)) {
        hitSomething = true
        
        // Если это босс, уменьшаем здоровье
        if (entity.type === 'boss') {
          const boss = entity as Boss
          const newHealth = boss.health - cannonBall.damage
          
          if (newHealth <= 0) {
            // Босс побежден, не добавляем его в список
            bossDefeated = true
            return
          } else {
            // Обновляем здоровье босса
            updatedEntities.push({
              ...boss,
              health: newHealth
            })
            return
          }
        } else {
          // Обычный враг уничтожается с одного попадания
          return
        }
      }
    }
    
    updatedEntities.push(entity)
  })
  
  return [updatedEntities, hitSomething, bossDefeated]
}

// Функция спавна пушки (бонуса)
export function shouldSpawnCannon(gameState: GameState): boolean {
  // Спавним пушку если есть босс на поле
  return gameState.entities.some(entity => entity.type === 'boss')
}

// Функция проверки необходимости спавна босса
export function shouldSpawnBoss(elapsedTime: number, gameState: GameState): number | null {
  const minutes = Math.floor(elapsedTime / 60000) // Переводим в минуты
  
  // Проверяем, нужно ли спавнить босса для текущей минуты
  if (minutes >= 1 && minutes <= 5) {
    const bossAlreadyExists = gameState.entities.some(entity => 
      entity.type === 'boss' && (entity as Boss).bossType === `minute-${minutes}` as Boss['bossType']
    )
    
    if (!bossAlreadyExists) {
      return minutes
    }
  }
  
  return null
}