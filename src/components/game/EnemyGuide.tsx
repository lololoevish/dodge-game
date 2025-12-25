"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { X, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { getSortedEnemyDescriptions, type EnemyDescription } from '@/lib/enemyDescriptions'

interface EnemyGuideProps {
  encounteredEnemies: string[]
  currentGameTime: number
}

// Функция для расчета текущего уровня сложности
function calculateDifficultyLevel(gameTime: number): { level: number; multiplier: number } {
  const difficultyIntervals = Math.floor(gameTime / 10)
  const multiplier = Math.pow(0.95, difficultyIntervals)
  return {
    level: difficultyIntervals + 1,
    multiplier: multiplier
  }
}

export function EnemyGuide({ encounteredEnemies, currentGameTime }: EnemyGuideProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const allEnemies = getSortedEnemyDescriptions()
  const encounteredSet = new Set(encounteredEnemies)
  const difficulty = calculateDifficultyLevel(currentGameTime)

  // Враги, которых игрок уже встретил
  const encountered = allEnemies.filter((enemy: EnemyDescription) => encounteredSet.has(enemy.type))
  
  // Враги, которые скоро появятся (в течение следующих 10 секунд)
  const upcoming = allEnemies.filter((enemy: EnemyDescription) => 
    !encounteredSet.has(enemy.type) && 
    enemy.spawnTime <= currentGameTime + 10 &&
    enemy.spawnTime > currentGameTime
  )

  // Новые враги (только что встреченные в последние 5 секунд)
  const newEnemies = encountered.filter((enemy: EnemyDescription) => 
    Math.abs(enemy.spawnTime - currentGameTime) <= 5
  )

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-30">
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 shadow-lg"
          size="lg"
        >
          <BookOpen className="h-5 w-5" />
          Справочник врагов
          {newEnemies.length > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              +{newEnemies.length}
            </span>
          )}
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-30 w-96 max-h-[70vh] bg-background/95 backdrop-blur-md border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col">
      {/* Заголовок */}
      <div className="p-4 border-b border-border bg-muted/50 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <h3 className="font-bold text-lg">Справочник врагов</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Индикатор сложности */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Уровень сложности:</span>
            <span className="font-bold text-red-500">
              {difficulty.level}
            </span>
          </div>
          <div className="text-muted-foreground">
            Скорость спавна: <span className="font-semibold text-amber-500">
              {Math.round(difficulty.multiplier * 100)}%
            </span>
          </div>
        </div>
        
        {/* Прогресс-бар сложности */}
        <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-1000"
            style={{ width: `${Math.min(100, difficulty.level * 10)}%` }}
          />
        </div>
      </div>

      {/* Контент */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Предупреждение о скором появлении */}
        {upcoming.length > 0 && (
          <div className="bg-amber-500/20 border border-amber-500/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold">
              <span className="text-lg">⚠️</span>
              <span>Скоро появятся:</span>
            </div>
            {upcoming.map((enemy: EnemyDescription) => (
              <div key={enemy.type} className="text-sm">
                <span className="text-lg mr-2">{enemy.emoji}</span>
                <span className="font-medium">{enemy.name}</span>
                <span className="text-xs text-muted-foreground ml-2">
                  (через {enemy.spawnTime - Math.floor(currentGameTime)} сек)
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Встреченные враги */}
        {encountered.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-muted-foreground">
                Встречено: {encountered.length} / {allEnemies.length}
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 text-xs"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3 w-3 mr-1" />
                    Свернуть
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3 w-3 mr-1" />
                    Развернуть
                  </>
                )}
              </Button>
            </div>

            {encountered.map((enemy: EnemyDescription) => {
              const isNew = newEnemies.some((e: EnemyDescription) => e.type === enemy.type)
              
              return (
                <div
                  key={enemy.type}
                  className={`border rounded-lg p-3 transition-all ${
                    isNew 
                      ? 'border-green-500 bg-green-500/10 animate-pulse' 
                      : 'border-border bg-muted/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{enemy.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-semibold text-sm">{enemy.name}</h5>
                        {isNew && (
                          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                            НОВЫЙ!
                          </span>
                        )}
                      </div>
                      {(isExpanded || isNew) && (
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {enemy.description}
                        </p>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">
                        Появляется: {enemy.spawnTime} сек
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p className="text-sm">Вы еще не встретили ни одного врага</p>
            <p className="text-xs mt-2">Первый враг появится через 10 секунд</p>
          </div>
        )}

        {/* Неоткрытые враги */}
        {encountered.length < allEnemies.length && (
          <div className="border-t border-border pt-4 mt-4">
            <h4 className="font-semibold text-sm text-muted-foreground mb-3">
              Еще не встречено: {allEnemies.length - encountered.length}
            </h4>
            <div className="grid grid-cols-6 gap-2">
              {allEnemies
                .filter((enemy: EnemyDescription) => !encounteredSet.has(enemy.type))
                .map((enemy: EnemyDescription) => (
                  <div
                    key={enemy.type}
                    className="aspect-square flex items-center justify-center bg-muted/50 rounded border border-border opacity-30"
                    title="???"
                  >
                    <span className="text-2xl filter blur-sm">❓</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

      {/* Подсказка */}
      <div className="border-t border-border p-3 bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          💡 Новые враги появляются по мере увеличения времени игры
        </p>
      </div>
    </div>
  )
}
