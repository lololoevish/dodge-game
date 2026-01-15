"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw, Home } from "lucide-react"
import { GameEntity } from "@/types/game"
import { getEnemyDescription } from "@/lib/enemyDescriptions"

interface GameOverScreenProps {
  score: number
  bestScore: number
  onRestart: () => void
  onMainMenu: () => void
  killerEnemy: GameEntity | null
}

export function GameOverScreen({ score, bestScore, onRestart, onMainMenu, killerEnemy }: GameOverScreenProps) {
  const isNewRecord = score > bestScore
  const killerDescription = killerEnemy ? getEnemyDescription(killerEnemy.type) : null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg p-8 max-w-md w-full mx-4 space-y-6 shadow-xl">
        {/* Заголовок */}
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            💥 Игра окончена!
          </h2>
          {isNewRecord && (
            <p className="text-lg font-semibold text-primary animate-pulse">
              🏆 Новый рекорд! 🏆
            </p>
          )}
        </div>

        {/* Статистика */}
        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">🕰️ Ваш результат:</span>
              <span className="text-2xl font-bold text-primary">
                {score < 60 ? `${score} сек` : 
                 `${Math.floor(score / 60)}:${(score % 60).toString().padStart(2, '0')}`}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">🏆 Лучший рекорд:</span>
              <span className="text-xl font-semibold text-foreground">
                {Math.max(score, bestScore) < 60 ? 
                 `${Math.max(score, bestScore)} сек` : 
                 `${Math.floor(Math.max(score, bestScore) / 60)}:${(Math.max(score, bestScore) % 60).toString().padStart(2, '0')}`}
              </span>
            </div>
          </div>

          {killerDescription && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
              <p className="font-semibold text-red-400">Вас победил: {killerDescription.name}</p>
              <p className="text-xs text-muted-foreground mt-1">{killerDescription.description}</p>
            </div>
          )}

          {/* Сообщение в зависимости от результата */}
          <div className="text-center text-sm text-muted-foreground space-y-2">
            {score < 10 && (
              <div>
                <p className="text-red-500">🔴 Попробуйте продержаться дольше 10 секунд!</p>
                <p className="text-xs">Появляются: красные преследователи</p>
              </div>
            )}
            {score >= 10 && score < 30 && (
              <div>
                <p className="text-orange-500">🔶 Отлично! Теперь берегитесь вращающихся треугольников!</p>
                <p className="text-xs">Появляются: оранжевые треугольники, огненные шары</p>
              </div>
            )}
            {score >= 30 && score < 40 && (
              <div>
                <p className="text-green-500">🔵 Впечатляюще! Осторожно с отскакивающими кругами!</p>
                <p className="text-xs">Появляются: пентагоны-спирали, зеленые круги</p>
              </div>
            )}
            {score >= 40 && score < 60 && (
              <div>
                <p className="text-yellow-500">⭐ Невероятно! Вы увидели звёзды-стрелки!</p>
                <p className="text-xs text-amber-500">Молнии телепортируются, звёзды стреляют 5 снарядами</p>
              </div>
            )}
            {score >= 60 && score < 80 && (
              <div>
                <p className="text-purple-500 font-semibold">🔮 ЛЕГЕНДА! Вы пережили множественные залпы!</p>
                <p className="text-xs text-purple-400">Маятники, ледяные сферы, мины и диагональные охотники</p>
              </div>
            )}
            {score >= 80 && (
              <div>
                <p className="text-red-500 font-bold">🎆 МАСТЕР УКЛОНЕНИЯ! Невозможно!</p>
                <p className="text-xs text-pink-400">Вы прошли через лазеры и телепорт-кубы - это невероятно!</p>
              </div>
            )}
          </div>
        </div>

        {/* Кнопки */}
        <div className="space-y-3">
          <Button 
            onClick={onRestart}
            size="lg" 
            className="w-full text-lg font-semibold py-6"
          >
            <RotateCcw className="mr-2 h-5 w-5" />
            🔄 Играть снова
          </Button>
          
          <Button 
            onClick={onMainMenu}
            variant="outline"
            size="lg" 
            className="w-full text-lg font-semibold py-6"
          >
            <Home className="mr-2 h-5 w-5" />
            🏠 Главное меню
          </Button>
        </div>
      </div>
    </div>
  )
}