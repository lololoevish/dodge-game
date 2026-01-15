# Технический дизайн новых врагов для игры "Dodge Game"

## 1. Кристаллический контроллер (Crystal Controller)

### Изменения в src/types/game.ts:
```typescript
// 14. Кристаллический контроллер (замораживает других врагов)
export interface CrystalController extends GameObject {
  type: 'crystal-controller'
  lastFreeze: number
  freezeCooldown: number
  freezeDuration: number
  freezeRadius: number
}

// Добавить в GameEntity:
export type GameEntity = Player | ChaserSquare | BouncingCircle | StarGenerator | PurpleProjectile |
  TriangleSpinner | PentagonSpiral | Lightning | FireBall | DiagonalHunter |
  Mine | LaserBeam | TeleportCube | Spinner | GhostBall | SnakeSegment |
  PulsatingSphere | PatrolSquare | ReflectingProjectile | Bonus | CrystalController
```

### Изменения в src/lib/gameLogic.ts:
```typescript
// Функция спавна
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

// Функция обновления
export function updateCrystalController(controller: CrystalController): CrystalController {
  return controller // Кристаллический контроллер не двигается
}

// Функция заморозки врагов
export function freezeNearbyEnemies(gameState: GameState, controller: CrystalController): GameState {
  const currentTime = Date.now()
  if (currentTime - controller.lastFreeze >= controller.freezeCooldown) {
    // Находим врагов в радиусе действия
    const enemiesToFreeze = gameState.entities.filter(entity => {
      if (entity.type === 'player' || entity.type === 'bonus' || entity.type === 'crystal-controller') {
        return false
      }
      
      const dx = entity.position.x - controller.position.x
      const dy = entity.position.y - controller.position.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      return distance <= controller.freezeRadius
    }) as (Exclude<GameEntity, Player | Bonus | CrystalController>)[]
    
    // Добавляем эффект заморозки к найденным врагам
    // Реализация будет зависеть от общей системы состояний врагов
    
    return {
      ...gameState,
      entities: gameState.entities.map(entity => {
        if (enemiesToFreeze.some(e => e.id === entity.id)) {
          // Добавляем эффект заморозки к врагу
          return {
            ...entity,
            frozenUntil: currentTime + controller.freezeDuration
          } as typeof entity
        }
        return entity
      }),
      crystalController: {
        ...controller,
        lastFreeze: currentTime
      }
    }
  }
  
  return gameState
}
```

### Изменения в src/lib/enemyDescriptions.ts:
```typescript
{
  type: 'crystal-controller',
  emoji: '💎',
  name: 'Кристаллический контроллер',
  description: 'Периодически замораживает других врагов в радиусе действия на 1.5 секунды',
  spawnTime: 110 // появляется позже остальных
}
```

## 2. Призрачный дубликатор (Phantom Duplicator)

### Изменения в src/types/game.ts:
```typescript
// 15. Призрачный дубликатор (копирует движения игрока)
export interface PhantomDuplicator extends GameObject {
  type: 'phantom-duplicator'
  targetPosition: Position
 delay: number
 lastUpdate: number
  offset: number
}

// Добавить в GameEntity:
export type GameEntity = Player | ChaserSquare | BouncingCircle | StarGenerator | PurpleProjectile |
  TriangleSpinner | PentagonSpiral | Lightning | FireBall | DiagonalHunter |
  Mine | LaserBeam | TeleportCube | Spinner | GhostBall | SnakeSegment |
  PulsatingSphere | PatrolSquare | ReflectingProjectile | Bonus | CrystalController | PhantomDuplicator
```

### Изменения в src/lib/gameLogic.ts:
```typescript
// Функция спавна
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
    targetPosition: { x, y },
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

// Функция обновления
export function updatePhantomDuplicator(duplicator: PhantomDuplicator, gameState: GameState): PhantomDuplicator {
  const currentTime = Date.now()
  
  // Обновляем позицию с задержкой
  if (currentTime - duplicator.lastUpdate >= duplicator.delay) {
    // Добавляем случайное отклонение
    const offsetX = (Math.random() - 0.5) * duplicator.offset
    const offsetY = (Math.random() - 0.5) * duplicator.offset
    
    return {
      ...duplicator,
      position: {
        x: duplicator.targetPosition.x + offsetX,
        y: duplicator.targetPosition.y + offsetY
      },
      lastUpdate: currentTime
    }
  }
  
  return duplicator
}
```

### Изменения в src/lib/enemyDescriptions.ts:
```typescript
{
  type: 'phantom-duplicator',
  emoji: '👻',
  name: 'Призрачный дубликатор',
  description: 'Копирует движения игрока с задержкой, создавая фантома, повторяющего ваш маршрут',
  spawnTime: 120 // появляется позже остальных
}
```

## 3. Зона заражения (Contamination Zone)

### Изменения в src/types/game.ts:
```typescript
// 16. Зона заражения (оставляет зоны опасности)
export interface ContaminationZone extends GameObject {
  type: 'contamination-zone'
  lastDrop: number
  dropInterval: number
 zoneDuration: number
}

// Интерфейс для временной зоны опасности
export interface HazardZone extends GameObject {
  type: 'hazard-zone'
  expirationTime: number
}

// Добавить в GameEntity:
export type GameEntity = Player | ChaserSquare | BouncingCircle | StarGenerator | PurpleProjectile |
  TriangleSpinner | PentagonSpiral | Lightning | FireBall | DiagonalHunter |
  Mine | LaserBeam | TeleportCube | Spinner | GhostBall | SnakeSegment |
  PulsatingSphere | PatrolSquare | ReflectingProjectile | Bonus | CrystalController | 
  PhantomDuplicator | ContaminationZone | HazardZone
```

### Изменения в src/lib/gameLogic.ts:
```typescript
// Функция спавна
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

// Функция обновления
export function updateContaminationZone(zone: ContaminationZone, gameState: GameState, playerPosition: Position): [ContaminationZone, GameEntity[]] {
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
```

### Изменения в src/lib/enemyDescriptions.ts:
```typescript
{
  type: 'contamination-zone',
  emoji: '☢️',
  name: 'Зона заражения',
  description: 'Преследует игрока и оставляет за собой временные зоны опасности, наносящие урон',
  spawnTime: 130 // появляется позже остальных
}
```

## Интеграция в основной игровой цикл

В файле `src/lib/gameLogic.ts` в функции `updateGameEntities` нужно:

1. Добавить обработку новых типов врагов в основной цикл обновления
2. Обновить функцию `checkGameOver` для проверки столкновений с зонами опасности
3. Обновить логику отслеживания врагов для новых типов