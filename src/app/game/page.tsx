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
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-muted/10 flex flex-col relative overflow-hidden ${platformMode === 'mobile' ? 'touch-none select-none' : ''}`}>
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-500/3 to-pink-500/3 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Хедер игры - разный для разных платформ */}
      <div className={`absolute top-0 left-0 right-0 z-20 flex items-center justify-between ${platformMode === 'mobile' ? 'p-2' : 'p-4'} bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-md border-b-2 border-gradient-to-r from-border/50 via-border to-border/50 shadow-lg`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMainMenu}
          className={`flex items-center gap-2 hover:bg-blue-500/10 hover:text-blue-500 transition-all duration-300 hover:scale-105 ${platformMode === 'mobile' ? 'text-xs' : 'text-sm'}`}
        >
          <ArrowLeft className={`${platformMode === 'mobile' ? 'h-3 w-3' : 'h-4 w-4'} animate-pulse`} />
          {platformMode === 'mobile' ? "Меню" : "Главное меню"}
        </Button>
        
        <div className={`flex items-center ${platformMode === 'mobile' ? 'gap-1' : 'gap-4'}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleTogglePause}
            className={`flex items-center gap-2 hover:bg-amber-500/10 hover:text-amber-500 transition-all duration-300 hover:scale-105 ${platformMode === 'mobile' ? 'text-xs' : 'text-sm'}`}
            disabled={gameState === "gameOver"}
          >
            {gameState === "paused" ? (
              <>
                <Play className={`${platformMode === 'mobile' ? 'h-3 w-3' : 'h-4 w-4'} animate-bounce`} />
                {platformMode === 'mobile' ? "▶️" : "Продолжить"}
              </>
            ) : (
              <>
                <Pause className={`${platformMode === 'mobile' ? 'h-3 w-3' : 'h-4 w-4'} animate-pulse`} />
                {platformMode === 'mobile' ? "⏸️" : "Пауза"}
              </>
            )}
          </Button>
          <div className={`${platformMode === 'mobile' ? 'text-sm' : 'text-lg'} font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse`}>
            {platformMode === 'mobile' ? formatTime(score).replace(" сек", "с") : `Время: ${formatTime(score)}`}
          </div>
          {platformMode === 'desktop' && (
            <div className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-border/50">
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
            <div className="absolute inset-0 z-30 bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-lg flex items-center justify-center p-4">
              <div className={`text-center space-y-8 bg-gradient-to-br from-card/90 to-card/70 border-2 border-border/50 rounded-3xl p-10 shadow-2xl backdrop-blur-sm hover:border-border transition-all duration-500 ${platformMode === 'mobile' ? 'max-w-sm w-full' : 'max-w-md'}`}>
                <div className={`${platformMode === 'mobile' ? 'text-6xl' : 'text-8xl'} animate-bounce`}>⏸️</div>
                <h2 className={`${platformMode === 'mobile' ? 'text-2xl' : 'text-4xl'} font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent`}>Игра на паузе</h2>
                <div className={`space-y-3 text-muted-foreground ${platformMode === 'mobile' ? 'text-sm' : 'text-base'}`}>
                  {platformMode === 'desktop' && (
                    <p className="flex items-center justify-center gap-2">
                      Нажмите <kbd className="px-3 py-2 bg-gradient-to-br from-muted to-muted/70 rounded-lg text-xs font-bold border border-border/50 shadow-sm">Пробел</kbd> или кнопку "Продолжить"
                    </p>
                  )}
                  <p className="text-lg">чтобы возобновить игру</p>
                </div>
                <div className={`flex gap-4 justify-center ${platformMode === 'mobile' ? 'flex-col' : 'flex-row'}`}>
                  <Button 
                    onClick={handleTogglePause} 
                    className={`flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-green-500/30 transition-all duration-300 hover:scale-105 ${platformMode === 'mobile' ? 'w-full h-12' : 'w-auto h-12'}`}
                  >
                    <Play className="h-5 w-5 animate-pulse" />
                    Продолжить
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleMainMenu} 
                    className={`border-2 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 ${platformMode === 'mobile' ? 'w-full h-12' : 'w-auto h-12'}`}
                  >
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
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-background/95 via-background/90 to-background/95 backdrop-blur-md border-t-2 border-gradient-to-r from-border/50 via-border to-border/50 p-3 shadow-lg">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 bg-muted/50 px-3 py-2 rounded-full border border-border/50">
                  <div className="text-muted-foreground">Рекорд:</div>
                  <div className="font-bold text-amber-500">{formatTime(bestScore).replace(" сек", "с")}</div>
                </div>
                <div className="text-center px-3 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                  <div className="text-blue-500 font-medium">Касайтесь экрана для управления</div>
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