"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { GameCanvas } from "@/components/game/GameCanvas"
import { GameOverScreen } from "@/components/game/GameOverScreen"
import { EnemyNotificationsContainer } from "@/components/game/EnemyNotification"
import { ActiveBoosts } from "@/components/game/ActiveBoosts"
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
import { GameEntity, ActiveBonus } from "@/types/game"
 
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
  const [activeBonuses, setActiveBonuses] = useState<ActiveBonus[]>([]) // Активные бонусы

  // Получение платформы из URL или localStorage
  const [platformMode, setPlatformMode] = useState<'desktop' | 'mobile'>('desktop')

  useEffect(() => {
    // Получаем платформу из URL параметров или localStorage
    const urlParams = new URLSearchParams(window.location.search)
    const urlPlatform = urlParams.get('platform') as 'desktop' | 'mobile' | null
    const storedPlatform = localStorage.getItem("dodgeGame-platform") as 'desktop' | 'mobile' | null
    
    const platform = urlPlatform || storedPlatform || 'desktop'
    setPlatformMode(platform)
    
    // Сохраняем в localStorage если получили из URL
    if (urlPlatform) {
      localStorage.setItem("dodgeGame-platform", urlPlatform)
    }
  }, [])

  // Определение мобильного устройства (только для мобильного режима)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (platformMode === 'mobile') {
      setIsMobile(true)
    } else {
      setIsMobile(false)
    }
  }, [platformMode])
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

  // Обновление активных бонусов
  const handleActiveBonusesUpdate = useCallback((bonuses: ActiveBonus[]) => {
    setActiveBonuses(bonuses)
  }, [])
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
    setActiveBonuses([]) // Очищаем активные бонусы
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
    <div className={`min-h-screen bg-background flex flex-col relative ${platformMode === 'mobile' ? 'touch-none select-none' : ''}`}>
      {/* Хедер игры - разный для разных платформ */}
      <div className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between ${platformMode === 'mobile' ? 'p-2' : 'p-4'} bg-background/90 backdrop-blur-sm border-b border-border`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMainMenu}
          className={`flex items-center gap-2 ${platformMode === 'mobile' ? 'text-xs' : 'text-sm'}`}
        >
          <ArrowLeft className={`${platformMode === 'mobile' ? 'h-3 w-3' : 'h-4 w-4'}`} />
          {platformMode === 'mobile' ? "Меню" : "Главное меню"}
        </Button>
        
        <div className={`flex items-center ${platformMode === 'mobile' ? 'gap-1' : 'gap-4'}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTogglePause}
            className={`flex items-center gap-2 ${platformMode === 'mobile' ? 'text-xs' : 'text-sm'}`}
            disabled={gameState === "gameOver"}
          >
            {gameState === "paused" ? (
              <>
                <Play className={`${platformMode === 'mobile' ? 'h-3 w-3' : 'h-4 w-4'}`} />
                {platformMode === 'mobile' ? "▶️" : "Продолжить"}
              </>
            ) : (
              <>
                <Pause className={`${platformMode === 'mobile' ? 'h-3 w-3' : 'h-4 w-4'}`} />
                {platformMode === 'mobile' ? "⏸️" : "Пауза"}
              </>
            )}
          </Button>
          <div className={`${platformMode === 'mobile' ? 'text-sm' : 'text-lg'} font-bold`}>
            {platformMode === 'mobile' ? formatTime(score).replace(" сек", "с") : `Время: ${formatTime(score)}`}
          </div>
          {platformMode === 'desktop' && (
            <div className="text-sm text-muted-foreground">
              Рекорд: {formatTime(bestScore)}
            </div>
          )}
          {platformMode === 'desktop' && <ThemeToggle />}
        </div>
      </div>

      {/* Игровая область - полноэкранная */}
      {(gameState === "playing" || gameState === "paused") && (
        <>
          {/* Экран паузы - разный для разных платформ */}
          {gameState === "paused" && (
            <div className="absolute inset-0 z-30 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4">
              <div className={`text-center space-y-6 bg-card border border-border rounded-lg p-8 shadow-2xl ${platformMode === 'mobile' ? 'max-w-sm w-full' : 'max-w-md'}`}>
                <div className={`${platformMode === 'mobile' ? 'text-4xl' : 'text-6xl'}`}>⏸️</div>
                <h2 className={`${platformMode === 'mobile' ? 'text-xl' : 'text-3xl'} font-bold`}>Игра на паузе</h2>
                <div className={`space-y-2 text-muted-foreground ${platformMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
                  {platformMode === 'desktop' && (
                    <p>Нажмите <kbd className="px-2 py-1 bg-muted rounded text-xs">Пробел</kbd> или кнопку "Продолжить"</p>
                  )}
                  <p>чтобы возобновить игру</p>
                </div>
                <div className={`flex gap-4 justify-center ${platformMode === 'mobile' ? 'flex-col' : 'flex-row'}`}>
                  <Button onClick={handleTogglePause} className={`flex items-center gap-2 ${platformMode === 'mobile' ? 'w-full' : 'w-auto'}`}>
                    <Play className="h-4 w-4" />
                    Продолжить
                  </Button>
                  <Button variant="outline" onClick={handleMainMenu} className={`${platformMode === 'mobile' ? 'w-full' : 'w-auto'}`}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Главное меню
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Уведомления о новых врагах - только для десктопа */}
          {platformMode === 'desktop' && (
            <EnemyNotificationsContainer
              newEnemies={newEnemies}
              onDismiss={handleDismissNotification}
            />
          )}
          
          <GameCanvas
            key={gameKey}
            gameState={gameState}
            onGameOver={handleGameOver}
            onScoreUpdate={handleScoreUpdate}
            onEncounteredEnemiesUpdate={handleEncounteredEnemiesUpdate}
            onActiveBonusesUpdate={handleActiveBonusesUpdate}
            className="absolute inset-0 w-full h-full"
          />

          {/* Индикатор активных бустов */}
          <ActiveBoosts 
            activeBonuses={activeBonuses} 
            isMobile={platformMode === 'mobile'} 
          />

          {/* Мобильная панель внизу - только для мобильного режима */}
          {platformMode === 'mobile' && (
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-background/90 backdrop-blur-sm border-t border-border p-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="text-muted-foreground">Рекорд:</div>
                  <div className="font-bold">{formatTime(bestScore).replace(" сек", "с")}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Касайтесь экрана для управления</div>
                </div>
                <ThemeToggle />
              </div>
            </div>
          )}
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
          
          {/* Уведомления о новых достижениях - разные для разных платформ */}
          {newAchievements.length > 0 && (
            <div className={`fixed z-50 space-y-2 ${platformMode === 'mobile' ? 'top-16 right-2 max-w-xs' : 'top-24 right-4 max-w-sm'}`}>
              {newAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className={`bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg shadow-2xl animate-bounce ${platformMode === 'mobile' ? 'p-3' : 'p-4'}`}
                >
                  <div className={`flex items-center ${platformMode === 'mobile' ? 'gap-2' : 'gap-3'}`}>
                    <span className={`${platformMode === 'mobile' ? 'text-xl' : 'text-3xl'}`}>{achievement.icon}</span>
                    <div>
                      <div className="text-xs font-bold uppercase">Достижение!</div>
                      <div className={`font-bold ${platformMode === 'mobile' ? 'text-sm' : 'text-base'}`}>{achievement.title}</div>
                      <div className={`opacity-90 ${platformMode === 'mobile' ? 'text-xs' : 'text-sm'}`}>{achievement.description}</div>
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