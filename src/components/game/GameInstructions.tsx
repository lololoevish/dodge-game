"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, ChevronDown, ChevronUp } from "lucide-react"

const gameEntities = [
  {
    type: "player",
    emoji: "🔵",
    name: "Игрок",
    time: "0 сек",
    description: "Это вы! Управляйте мышью или касанием, избегайте всех фигур",
    color: "text-blue-500"
  },
  {
    type: "chaser",
    emoji: "🟥",
    name: "Красный преследователь",
    time: "10 сек",
    description: "Движется только по осям (вверх-вниз или влево-вправо) прямо к вам",
    color: "text-red-500"
  },
  {
    type: "triangle",
    emoji: "🔺",
    name: "Оранжевый треугольник",
    time: "12 сек",
    description: "Быстро вращается на месте, создавая вихрь опасности",
    color: "text-orange-500"
  },
  {
    type: "fire",
    emoji: "🔥",
    name: "Янтарный огненный шар",
    time: "18 сек",
    description: "Летит прямо, отскакивает от стен, оставляет огненный след",
    color: "text-amber-500"
  },
  {
    type: "pentagon",
    emoji: "⬟",
    name: "Фиолетовый пентагон",
    time: "20 сек",
    description: "Движется по расширяющейся спирали от центра экрана",
    color: "text-violet-500"
  },
  {
    type: "lightning",
    emoji: "⚡",
    name: "Желтая молния",
    time: "25 сек",
    description: "Мгновенно телепортируется в случайные места каждые 2 секунды",
    color: "text-yellow-500"
  },
  {
    type: "bouncing",
    emoji: "🟢",
    name: "Зеленый отскакивающий круг",
    time: "25 сек",
    description: "Летит прямо в случайном направлении, отскакивает от всех стен",
    color: "text-green-500"
  },
  {
    type: "star",
    emoji: "⭐",
    name: "Желтая звездочка-стрелок",
    time: "35 сек",
    description: "Неподвижна, но стреляет 5 фиолетовыми снарядами каждые 20 секунд",
    color: "text-yellow-500"
  },
  {
    type: "patrol-square",
    emoji: "🟧",
    name: "Патрульный квадрат",
    time: "35 сек",
    description: "Движется по заданному прямоугольному маршруту",
    color: "text-orange-500"
  },
  {
    type: "pulsating-sphere",
    emoji: "🟣",
    name: "Пульсирующая сфера",
    time: "45 сек",
    description: "Постоянно меняет свой размер, становясь то больше, то меньше",
    color: "text-purple-500"
  },
  {
    type: "ice",
    emoji: "❄️",
    name: "Голубая ледяная сфера",
    time: "50 сек",
    description: "Неподвижна, но замедляет все движения в большом радиусе вокруг себя",
    color: "text-cyan-500"
  },
  {
    type: "reflecting-projectile",
    emoji: "🔆",
    name: "Отражающийся снаряд",
    time: "50 сек",
    description: "Отскакивает от стен до 5 раз, меняя траекторию",
    color: "text-yellow-400"
  },
  {
    type: "mine",
    emoji: "💣",
    name: "Темно-красная мина",
    time: "60 сек",
    description: "Активируется через 3 секунды, взрывается при приближении",
    color: "text-red-800"
  },
  {
    type: "pendulum",
    emoji: "🔴",
    name: "Красный маятник",
    time: "70 сек",
    description: "Качается влево-вправо по центру экрана как настоящий маятник",
    color: "text-red-600"
  },
  {
    type: "laser",
    emoji: "📏",
    name: "Красный лазерный луч",
    time: "75 сек",
    description: "Длинная вращающаяся линия смерти с центральной точкой",
    color: "text-red-500"
  },
  {
    type: "diagonal",
    emoji: "🔷",
    name: "Синий диагональный охотник",
    time: "80 сек",
    description: "Умно движется по диагонали прямо к вашей текущей позиции",
    color: "text-blue-600"
  },
  {
    type: "teleport-cube",
    emoji: "📦",
    name: "Розовый телепорт-куб",
    time: "90 сек",
    description: "Плавно исчезает и телепортируется в новое место каждые 4 секунды",
    color: "text-pink-500"
  },
  {
    type: "spinner",
    emoji: "🌀",
    name: "Фиолетовый спиннер",
    time: "95 сек",
    description: "Быстро вращается вокруг центра, создавая опасную орбитальную траекторию",
    color: "text-violet-600"
  },
  {
    type: "ghost-ball",
    emoji: "👻",
    name: "Призрачный шар",
    time: "105 сек",
    description: "Периодически появляется и исчезает, отскакивая от стен",
    color: "text-purple-500"
  },
  {
    type: "snake-segment",
    emoji: "🐍",
    name: "Змеиный хвост (сегмент)",
    time: "110 сек",
    description: "Часть смертельной змейки, состоящей из 5 сегментов, преследующих игрока",
    color: "text-green-600"
  }
]

interface GameInstructionsProps {
  onClose: () => void
  encounteredEnemies?: string[]
  currentGameTime?: number
}

export function GameInstructions({ onClose, encounteredEnemies = [], currentGameTime = 0 }: GameInstructionsProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Показываем все сущности сразу без фильтрации
  const filteredEntities = gameEntities

  // Враги, которые скоро появятся (в течение следующих 10 секунд)
  const upcomingEnemies = gameEntities.filter(entity => {
    if (entity.type === 'player') return false
    const spawnTime = parseInt(entity.time)
    return spawnTime <= currentGameTime + 10 &&
           spawnTime > currentGameTime
  })

  // Расчет уровня сложности
  const difficultyLevel = Math.floor(currentGameTime / 10) + 1
  const difficultyMultiplier = Math.pow(0.95, Math.floor(currentGameTime / 10))

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Заголовок */}
        <div className="p-6 border-b border-gray-700 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">📋 Игровые фигуры</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-300 hover:text-white hover:bg-gray-700/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Индикатор сложности */}
          {currentGameTime > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Уровень сложности:</span>
                  <span className="font-bold text-red-400">{difficultyLevel}</span>
                </div>
                <div className="text-gray-400">
                  Скорость спавна: <span className="font-semibold text-amber-400">
                    {Math.round(difficultyMultiplier * 100)}%
                  </span>
                </div>
              </div>
              
              {/* Прогресс-бар сложности */}
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-1000"
                  style={{ width: `${Math.min(100, difficultyLevel * 10)}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Статистика встреченных врагов */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">
              Всего фигур: <span className="font-semibold text-white">
                {gameEntities.length - 1}
              </span>
            </span>
          </div>
        </div>

        {/* Предупреждение о скором появлении */}
        {upcomingEnemies.length > 0 && (
          <div className="mx-6 mt-4 bg-amber-900/30 border border-amber-700/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
              <span className="text-lg">⚠️</span>
              <span>Скоро появятся:</span>
            </div>
            {upcomingEnemies.map(enemy => (
              <div key={enemy.type} className="text-xs flex items-center gap-2">
                <span className="text-lg">{enemy.emoji}</span>
                <span className="font-medium text-gray-200">{enemy.name}</span>
                <span className="text-gray-400">
                  (через {parseInt(enemy.time) - Math.floor(currentGameTime)} сек)
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Управление */}
        <div className="p-6 border-b border-gray-700 bg-gray-800/50">
          <h3 className="text-lg font-semibold mb-3 text-white">🎮 Управление</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🖥️</span>
              <span className="text-gray-300">Десктоп: Двигайте мышью</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📱</span>
              <span className="text-gray-300">Мобильные: Касайтесь экрана</span>
            </div>
          </div>
        </div>

        {/* Список фигур */}
        <div className="overflow-y-auto flex-1" style={{ maxHeight: isExpanded ? '400px' : '200px' }}>
          <div className="p-6 space-y-4">
            {filteredEntities.slice(0, isExpanded ? filteredEntities.length : Math.min(4, filteredEntities.length)).map((entity, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-xl bg-gray-800/40 hover:bg-gray-700/50 transition-all duration-200 border border-gray-700/50">
                <span className="text-4xl flex-shrink-0">{entity.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className={`font-bold text-lg ${entity.color}`}>{entity.name}</h4>
                    <span className="text-xs px-3 py-1 bg-purple-900/50 text-purple-300 rounded-full border border-purple-700">
                      {entity.time}
                    </span>
                  </div>
                  <p className="text-gray-300 leading-relaxed">
                    {entity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Кнопка расширения */}
        <div className="p-4 border-t border-gray-700 bg-gray-800/30">
          <Button
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full py-3 text-base font-semibold border-gray-600 text-white hover:bg-purple-900/30 hover:border-purple-600"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-5 w-5 mr-2" />
                Свернуть список
              </>
            ) : (
              <>
                <ChevronDown className="h-5 w-5 mr-2" />
                Показать все {filteredEntities.length} фигур
              </>
            )}
          </Button>
        </div>

        {/* Подсказка */}
        <div className="p-6 bg-gray-800/40 border-t border-gray-700">
          <div className="text-center">
            <p className="text-sm text-purple-300 mb-2">
              💡 <strong>Подсказка:</strong> Всего в игре {gameEntities.length - 1} различных фигур
            </p>
            <p className="text-xs text-gray-400">
              Сложность игры постепенно увеличивается с течением времени!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}