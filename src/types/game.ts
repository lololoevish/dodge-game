// Типы для игровых объектов
export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface GameObject {
  id: string
  position: Position
  size: Size
  color: string
}

export interface Player extends GameObject {
  type: 'player'
}

export interface ChaserSquare extends GameObject {
  type: 'chaser'
  speed: number
}

export interface BouncingCircle extends GameObject {
  type: 'bouncing'
  velocity: Position
  speed: number
}

export interface StarGenerator extends GameObject {
  type: 'star'
  lastShot: number
  shootInterval: number
}

export interface PurpleProjectile extends GameObject {
  type: 'projectile'
  velocity: Position
  speed: number
}

// 1. Треугольник (быстро вращается)
export interface TriangleSpinner extends GameObject {
  type: 'triangle'
  rotation: number
  rotationSpeed: number
}

// 2. Пентагон (медленно движется по спирали)
export interface PentagonSpiral extends GameObject {
  type: 'pentagon'
  centerX: number
  centerY: number
  radius: number
  angle: number
  spiralSpeed: number
}

// 3. Молния (мгновенно перемещается)
export interface Lightning extends GameObject {
  type: 'lightning'
  targetX: number
  targetY: number
  teleportCooldown: number
  lastTeleport: number
}

// 4. Огненный шар (оставляет огненные следы)
export interface FireBall extends GameObject {
  type: 'fire'
  velocity: Position
  speed: number
  trail: Position[]
}

// 5. Диагональный охотник (движется по диагонали)
export interface DiagonalHunter extends GameObject {
  type: 'diagonal'
  targetX: number
  targetY: number
  speed: number
}

// 6. Мина (взрывается при приближении)
export interface Mine extends GameObject {
  type: 'mine'
  explosionRadius: number
  triggerRadius: number
  isArmed: boolean
  armingTime: number
}

// 7. Лазерный луч (вращается вокруг центра)
export interface LaserBeam extends GameObject {
  type: 'laser'
  centerX: number
  centerY: number
  length: number
  angle: number
  rotationSpeed: number
  width: number
}

// 8. Телепортирующийся куб (случайно меняет место)
export interface TeleportCube extends GameObject {
  type: 'teleport-cube'
  teleportInterval: number
  lastTeleport: number
  fadeOpacity: number
}

// 9. Спиннер (быстро вращается вокруг центра)
export interface Spinner extends GameObject {
  type: 'spinner'
  centerX: number
  centerY: number
  radius: number
  angle: number
  spinSpeed: number
}

// 10. Призрачный шар (постепенно появляется и исчезает)
export interface GhostBall extends GameObject {
  type: 'ghost-ball'
  velocity: Position
  speed: number
  opacity: number
  fadeDirection: number
}

// 11. Сегмент змейки (часть составного врага "змейка")
export interface SnakeSegment extends GameObject {
  type: 'snake-segment'
  velocity: Position
  speed: number
  segmentIndex: number // Позиция сегмента в змейке (0 - голова)
  connectedTo?: string // ID предыдущего сегмента
}

// 12. Пульсирующая сфера (увеличивается и уменьшается в размерах)
export interface PulsatingSphere extends GameObject {
  type: 'pulsating-sphere'
  velocity: Position
  speed: number
  pulseSpeed: number
  pulseDirection: number
  baseSize: number
}

// 13. Патрульный квадрат (движется по прямоугольной траектории)
export interface PatrolSquare extends GameObject {
  type: 'patrol-square'
  speed: number
  patrolPath: {x: number, y: number}[]
  currentTargetIndex: number
  direction: number
}


// 15. Отражающийся снаряд (отскакивает от стен и объектов)
export interface ReflectingProjectile extends GameObject {
  type: 'reflecting-projectile'
  velocity: Position
  speed: number
  bounceCount: number
  maxBounces: number
}


export type GameEntity = Player | ChaserSquare | BouncingCircle | StarGenerator | PurpleProjectile |
  TriangleSpinner | PentagonSpiral | Lightning | FireBall | DiagonalHunter |
  Mine | LaserBeam | TeleportCube | Spinner | GhostBall | SnakeSegment |
  PulsatingSphere | PatrolSquare | ReflectingProjectile

export interface GameState {
  isPlaying: boolean
  isGameOver: boolean
  score: number
  startTime: number
  player: Player
  entities: GameEntity[]
  gameArea: Size
  encounteredEnemies: string[] // Список типов встреченных врагов
}

export interface GameConfig {
  gameWidth: number
  gameHeight: number
  playerSize: number
  chaserSize: number
  circleSize: number
  chaserSpeed: number
  circleSpeed: number
  chaserSpawnTime: number
  circleSpawnTime: number
  starSpawnTime: number
  starSize: number
  starShootInterval: number
  projectileSize: number
  projectileSpeed: number
  // Новые параметры для 10 фигур
  triangleSize: number
  triangleSpawnTime: number
  pentagonSize: number
  pentagonSpawnTime: number
  lightningSize: number
  lightningSpawnTime: number
  fireSize: number
  fireSpawnTime: number
  diagonalSize: number
  diagonalSpawnTime: number
  mineSize: number
  mineSpawnTime: number
  laserSpawnTime: number
  teleportCubeSize: number
  teleportCubeSpawnTime: number
  // Новые враги
  spinnerSize: number
  spinnerSpawnTime: number
  ghostBallSize: number
  ghostBallSpawnTime: number
  snakeSegmentSize: number
  snakeSegmentSpawnTime: number
  // Параметры для новых фигур
  pulsatingSphereSize: number
  pulsatingSphereSpawnTime: number
 patrolSquareSize: number
  patrolSquareSpawnTime: number
  reflectingProjectileSize: number
  reflectingProjectileSpawnTime: number
  // Параметры нарастающей сложности
  minSpawnTime: number
  difficultyIncreaseRate: number
 difficultyUpdateInterval: number
}