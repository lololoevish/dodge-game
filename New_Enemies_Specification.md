# Техническое задание: Новые типы врагов для игры "Dodge Game"

## Обзор

В рамках развития игры "Dodge Game" планируется добавление трех новых типов врагов, каждый из которых будет иметь уникальное поведение и механику взаимодействия с игровым полем и другими объектами. Ниже представлено техническое задание для разработки этих врагов.

## Новые типы врагов

### 1. Кристаллический контроллер (Crystal Controller)

#### Концепция:
- **Название:** Кристаллический контроллер
- **Внешний вид:** Сияющий сине-фиолетовый кристалл с гексагональной формой
- **Поведение:** Этот враг не представляет прямой угрозы сам по себе, но периодически испускает импульсы, которые "замораживают" других врагов на короткое время (1-2 секунды). Во время заморозки враги продолжают находиться на своих позициях, но не могут двигаться. После окончания эффекта они возобновляют свое обычное поведение.
- **Сложность:** Средняя - враг временно снижает общую угрозу на поле, но его непредсказуемость может создавать ложное чувство безопасности.

#### Технические требования:
- Должен быть добавлен в перечень доступных врагов
- Должен появляться на карте с заданным интервалом
- Должен периодически активировать эффект заморозки на других врагов в радиусе действия
- Не должен представлять прямой угрозы игроку

### 2. Призрачный дубликатор (Phantom Duplicator)

#### Концепция:
- **Название:** Призрачный дубликатор
- **Внешний вид:** Полупрозрачная серая копия игрока с более темными чертами
- **Поведение:** Этот враг копирует движения игрока с небольшой задержкой (0.5-1.5 секунды). Он не стремится напрямую столкнуться с игроком, а повторяет его маршрут с задержкой, создавая эффект "фантома" игрока. Иногда он может делать небольшие отклонения от маршрута, чтобы усложнить уклонение.
- **Сложность:** Высокая - из-за непредсказуемых отклонений и задержки в копировании действий игрока.

#### Технические требования:
- Должен быть добавлен в перечень доступных врагов
- Должен появляться на карте с заданным интервалом
- Должен отслеживать движения игрока с задержкой
- Должен воспроизводить движения игрока с небольшими отклонениями
- Должен представлять угрозу при прямом контакте

### 3. Зона заражения (Contamination Zone)

#### Концепция:
- **Название:** Зона заражения
- **Внешний вид:** Круглая пульсирующая область с радиоактивным символом в центре, окрашенная в зеленый цвет
- **Поведение:** Этот враг перемещается по карте, оставляя за собой временные "зоны опасности" - области, в которых игрок получает урон при контакте. Эти зоны существуют 5-10 секунд после ухода врага. Враг сам по себе также представляет угрозу при прямом контакте.
- **Сложность:** Высокая - требует не только уклонения от самого врага, но и учета зон опасности на карте.

#### Технические требования:
- Должен быть добавлен в перечень доступных врагов
- Должен появляться на карте с заданным интервалом
- Должен преследовать игрока по карте
- Должен оставлять за собой временные зоны опасности
- Должен представлять угрозу при прямом контакте
- Временные зоны должны существовать ограниченное время и представлять угрозу игроку

## Технический дизайн

### Изменения в src/types/game.ts:

#### Добавить новые интерфейсы:
```typescript
// 14. Кристаллический контроллер (замораживает других врагов)
export interface CrystalController extends GameObject {
  type: 'crystal-controller'
  lastFreeze: number
  freezeCooldown: number
  freezeDuration: number
  freezeRadius: number
}

// 15. Призрачный дубликатор (копирует движения игрока)
export interface PhantomDuplicator extends GameObject {
  type: 'phantom-duplicator'
  targetPosition: Position
  delay: number
  lastUpdate: number
  offset: number
}

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

// Добавить новые типы в GameEntity:
export type GameEntity = Player | ChaserSquare | BouncingCircle | StarGenerator | PurpleProjectile |
  TriangleSpinner | PentagonSpiral | Lightning | FireBall | DiagonalHunter |
  Mine | LaserBeam | TeleportCube | Spinner | GhostBall | SnakeSegment |
  PulsatingSphere | PatrolSquare | ReflectingProjectile | Bonus | CrystalController | 
  PhantomDuplicator | ContaminationZone | HazardZone
```

#### Добавить новые параметры в GameConfig:
```typescript
export interface GameConfig {
  // ... существующие параметры ...
  
  // Новые параметры для врагов
  crystalControllerSize: number
  crystalControllerSpawnTime: number
  phantomDuplicatorSize: number
  phantomDuplicatorSpawnTime: number
  contaminationZoneSize: number
  contaminationZoneSpawnTime: number
}
```

### Изменения в src/lib/gameLogic.ts:

#### Добавить функции спавна:
```typescript
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
```

#### Добавить функции обновления:
```typescript
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

#### Интеграция в основной игровой цикл:
```typescript
// В функции updateGameEntities добавить обработку новых врагов
export function updateGameEntities(gameState: GameState, config: GameConfig): GameState {
  let updatedEntities: GameEntity[] = [];
  let newGameState = { ...gameState };

  // Обновляем активные бонусы
  newGameState = updateActiveBonuses(newGameState);

  // ... существующая логика ...

  // Обработка новых врагов
  const newEntities: GameEntity[] = [];
  const hazardZonesToAdd: GameEntity[] = [];

  newGameState.entities.forEach(entity => {
    switch (entity.type) {
      // ... существующие типы ...
      
      case 'crystal-controller':
        newEntities.push(updateCrystalController(entity));
        break;
        
      case 'phantom-duplicator':
        newEntities.push(updatePhantomDuplicator(entity, newGameState));
        break;
        
      case 'contamination-zone':
        const [updatedZone, newHazards] = updateContaminationZone(entity, newGameState, newGameState.player.position);
        newEntities.push(updatedZone);
        if (newHazards.length > 0) {
          hazardZonesToAdd.push(...newHazards);
        }
        break;
        
      default:
        newEntities.push(entity);
    }
  });

  // Добавляем новые зоны опасности
  newEntities.push(...hazardZonesToAdd);

  // Удаляем просроченные зоны опасности
  newEntities = updateHazardZones(newEntities);

  newGameState.entities = newEntities;

  return newGameState;
}
```

### Изменения в src/lib/enemyDescriptions.ts:

#### Добавить описания новых врагов:
```typescript
export const enemyDescriptions: EnemyDescription[] = [
  // ... существующие враги ...
  
  {
    type: 'crystal-controller',
    emoji: '💎',
    name: 'Кристаллический контроллер',
    description: 'Периодически замораживает других врагов в радиусе действия на 1.5 секунды',
    spawnTime: 110 // появляется позже остальных
  },
  {
    type: 'phantom-duplicator',
    emoji: '👻',
    name: 'Призрачный дубликатор',
    description: 'Копирует движения игрока с задержкой, создавая фантома, повторяющего ваш маршрут',
    spawnTime: 120 // появляется позже остальных
  },
  {
    type: 'contamination-zone',
    emoji: '☢️',
    name: 'Зона заражения',
    description: 'Преследует игрока и оставляет за собой временные зоны опасности, наносящие урон',
    spawnTime: 130 // появляется позже остальных
  }
]
```

## Параметры конфигурации

В файле `defaultGameConfig` добавить значения для новых параметров:
```typescript
export const defaultGameConfig: GameConfig = {
  // ... существующие параметры ...
  
  // Параметры для новых врагов
  crystalControllerSize: 24,
  crystalControllerSpawnTime: 110000,
  phantomDuplicatorSize: 18,
  phantomDuplicatorSpawnTime: 120000,
  contaminationZoneSize: 30,
  contaminationZoneSpawnTime: 130000,
}
```

## Тестирование

После реализации новых врагов необходимо провести тестирование:

1. Проверить корректность спавна каждого типа врага
2. Проверить поведение каждого врага в соответствии с описанием
3. Проверить взаимодействие новых врагов с игроком и другими объектами
4. Проверить корректность удаления временных зон опасности
5. Проверить влияние новых врагов на общую сложность игры