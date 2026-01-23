"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { GameCanvas } from "@/components/game/GameCanvas"
import { GameOverScreen } from "@/components/game/GameOverScreen"
import { EnemyNotificationsContainer } from "@/components/game/EnemyNotification"
import { ArrowLeft, Pause, Play } from "lucide-react"
import { useRouter } from "next/navigation"
import { 
  checkTimeAchievements, 
  checkEnemyAchievements, 
  checkSpecialAchievements,
  incrementGamesPlayed,
  getGamesPlayed
} from "@/lib/achievementManager"
import type { Achievement } from "@/types/achievements"
import { GameEntity } from "@/types/game"
 
export default function GamePage() {
  const router = useRouter()
  const [gameState, setGameState] = useState<"playing" | "paused" | "gameOver">("playing")
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [gameKey, setGameKey] = useState(0) // Для перезапуска игры
  const [encounteredEnemies, setEncounteredEnemies] = useState<string[]>([])
  const [newEnemies, setNewEnemies] = useState<string[]>([]) // Новые враги для уведомлений
  const [previousEncountered, setPreviousEncountered] = useState<string[]>([])
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]) // Новые достижения
  const [isFirstGame, setIsFirstGame] = useState(false)
  const [killerEnemy, setKillerEnemy] = useState<GameEntity | null>(null);

  // Загрузка лучшего рекорда при монтировании
  useEffect(() => {
    const saved = localStorage.getItem("dodgeGame-bestScore")
    if (saved) {
      setBestScore(parseInt(saved, 10))
    }
    
    // Проверяем, первая ли это игра
    const gamesPlayed = getGamesPlayed()
    setIsFirstGame(gamesPlayed === 0)
  }, [])

  // Переключение паузы
  const handleTogglePause = useCallback(() => {
    setGameState(prev => prev === "playing" ? "paused" : "playing")
  }, [])

  // Обработка нажатия клавиш для паузы
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === 'Space' && gameState !== "gameOver") {
        event.preventDefault()
        handleTogglePause()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState, handleTogglePause])
  const handleGameOver = useCallback((finalScore: number, killer: GameEntity | null) => {
    setGameState("gameOver")
    setKillerEnemy(killer);
    
    // Сохраняем новый рекорд если он лучше
    if (finalScore > bestScore) {
      setBestScore(finalScore)
      localStorage.setItem("dodgeGame-bestScore", finalScore.toString())
    }
    
    // Увеличиваем счетчик игр
    incrementGamesPlayed()
    
    // Проверяем достижения
    const timeAchievements = checkTimeAchievements(finalScore)
    const enemyAchievements = checkEnemyAchievements(encounteredEnemies)
    const specialAchievements = checkSpecialAchievements(finalScore, isFirstGame)
    
    const allNewAchievements = [
      ...timeAchievements,
      ...enemyAchievements,
      ...specialAchievements
    ]
    
    if (allNewAchievements.length > 0) {
      setNewAchievements(allNewAchievements)
    }
  }, [bestScore, encounteredEnemies, isFirstGame])

  // Обновление счета
  const handleScoreUpdate = useCallback((newScore: number) => {
    setScore(newScore)
  }, [])

  // Обновление списка встреченных врагов
  const handleEncounteredEnemiesUpdate = useCallback((enemies: string[]) => {
    setEncounteredEnemies(enemies)
    
    // Определяем новых врагов
    const newlyEncountered = enemies.filter(enemy => !previousEncountered.includes(enemy))
    if (newlyEncountered.length > 0) {
      setNewEnemies(prev => [...prev, ...newlyEncountered])
      setPreviousEncountered(enemies)
    }
  }, [previousEncountered])

  // Удаление уведомления о враге
  const handleDismissNotification = useCallback((enemyType: string) => {
    setNewEnemies(prev => prev.filter(e => e !== enemyType))
  }, [])

  // Перезапуск игры
  const handleRestart = useCallback(() => {
    setGameState("playing")
    setScore(0)
    setEncounteredEnemies([])
    setNewEnemies([])
    setPreviousEncountered([])
    setNewAchievements([])
    setIsFirstGame(false)
    setGameKey(prev => prev + 1) // Принудительно пересоздаем GameCanvas
    setKillerEnemy(null);
  }, [])

  // Возврат в главное меню
  const handleMainMenu = useCallback(() => {
    router.push("/")
  }, [router])

  // Форматирование времени
  const formatTime = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds} сек`
    }
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      {/* Хедер игры - плавающий поверх игры */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 bg-background/80 backdrop-blur-sm border-b border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMainMenu}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Главное меню
        </Button>
        
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTogglePause}
            className="flex items-center gap-2"
            disabled={gameState === "gameOver"}
          >
            {gameState === "paused" ? (
              <>
                <Play className="h-4 w-4" />
                Продолжить
              </>
            ) : (
              <>
                <Pause className="h-4 w-4" />
                Пауза
              </>
            )}
          </Button>
          <div className="text-lg font-bold">
            Время: {formatTime(score)}
          </div>
          <div className="text-sm text-muted-foreground">
            Рекорд: {formatTime(bestScore)}
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Игровая область - полноэкранная */}
      {(gameState === "playing" || gameState === "paused") && (
        <>
          {/* Экран паузы */}
          {gameState === "paused" && (
            <div className="absolute inset-0 z-30 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-center space-y-6 bg-card border border-border rounded-lg p-8 shadow-2xl">
                <div className="text-6xl">⏸️</div>
                <h2 className="text-3xl font-bold">Игра на паузе</h2>
                <div className="space-y-2 text-muted-foreground">
                  <p>Нажмите <kbd className="px-2 py-1 bg-muted rounded text-xs">Пробел</kbd> или кнопку "Продолжить"</p>
                  <p>чтобы возобновить игру</p>
                </div>
                <div className="flex gap-4 justify-center">
                  <Button onClick={handleTogglePause} className="flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Продолжить
                  </Button>
                  <Button variant="outline" onClick={handleMainMenu}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Главное меню
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Уведомления о новых врагах */}
          <EnemyNotificationsContainer
            newEnemies={newEnemies}
            onDismiss={handleDismissNotification}
          />
          
          <GameCanvas
            key={gameKey}
            gameState={gameState}
            onGameOver={handleGameOver}
            onScoreUpdate={handleScoreUpdate}
            onEncounteredEnemiesUpdate={handleEncounteredEnemiesUpdate}
          />
        </>
      )}

      {/* Экран окончания игры */}
      {gameState === "gameOver" && (
        <>
          <GameOverScreen
            score={score}
            bestScore={bestScore}
            onRestart={handleRestart}
            onMainMenu={handleMainMenu}
            killerEnemy={killerEnemy}
          />
          
          {/* Уведомления о новых достижениях */}
          {newAchievements.length > 0 && (
            <div className="fixed top-24 right-4 z-50 space-y-2 max-w-sm">
              {newAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg p-4 shadow-2xl animate-bounce"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{achievement.icon}</span>
                    <div>
                      <div className="text-xs font-bold uppercase">Достижение разблокировано!</div>
                      <div className="font-bold">{achievement.title}</div>
                      <div className="text-sm opacity-90">{achievement.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}