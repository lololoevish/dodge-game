"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { GameInstructions } from "@/components/game/GameInstructions"
import { PlatformSelector } from "@/components/PlatformSelector"
import { Trophy, Play, BookOpen, Award, Sparkles, Settings } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [showInstructions, setShowInstructions] = useState(false)
  const [showPlatformSelector, setShowPlatformSelector] = useState(false)
  const [bestScore, setBestScore] = useState("0")
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedPlatform, setSelectedPlatform] = useState<'desktop' | 'mobile' | null>(null)

  useEffect(() => {
    const score = localStorage.getItem("dodgeGame-bestScore") || "0"
    setBestScore(score)
    
    // Проверяем, выбрана ли уже платформа
    const platform = localStorage.getItem("dodgeGame-platform") as 'desktop' | 'mobile' | null
    setSelectedPlatform(platform)
    
    setIsLoaded(true)
  }, [])

  const handleStartGame = () => {
    if (!selectedPlatform) {
      setShowPlatformSelector(true)
    } else {
      router.push(`/game?platform=${selectedPlatform}`)
    }
  }

  const handlePlatformSelect = (platform: 'desktop' | 'mobile') => {
    setSelectedPlatform(platform)
    localStorage.setItem("dodgeGame-platform", platform)
    setShowPlatformSelector(false)
    router.push(`/game?platform=${platform}`)
  }

  const handleChangePlatform = () => {
    setShowPlatformSelector(true)
  }

  if (showPlatformSelector) {
    return <PlatformSelector onSelect={handlePlatformSelect} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex flex-col items-center justify-center p-4 text-foreground relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-green-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Переключатель темы */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle />
      </div>

      {/* Главный контент */}
      <div className={`text-center space-y-8 max-w-2xl w-full relative z-10 transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Логотип с анимацией */}
        <div className="space-y-6 relative">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent blur-sm opacity-50 group-hover:opacity-100 transition-opacity duration-500">
              <h1 className="text-8xl font-black tracking-wider">
                DODGE
              </h1>
            </div>
            <h1 className="relative text-8xl font-black tracking-wider bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse hover:scale-105 transition-transform duration-300 cursor-default">
              DODGE
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-3 animate-bounce">
            <Sparkles className="h-8 w-8 text-yellow-500 animate-spin" />
            <h2 className="text-4xl font-bold text-muted-foreground hover:text-foreground transition-colors duration-300">
              GAME
            </h2>
            <Sparkles className="h-8 w-8 text-yellow-500 animate-spin" style={{animationDelay: '0.5s'}} />
          </div>
          
          <div className="bg-gradient-to-r from-transparent via-border to-transparent h-px w-full animate-pulse"></div>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto hover:text-foreground transition-colors duration-300">
            Уклоняйтесь от <span className="text-red-500 font-bold animate-pulse">25+ различных врагов</span> и продержитесь как можно дольше в этой динамичной аркаде!
          </p>
          
          {/* Список врагов */}
          <div className="mt-8 p-6 bg-gradient-to-br from-muted/30 to-muted/10 border-2 border-border/30 rounded-3xl backdrop-blur-sm hover:border-border/50 transition-all duration-500 group">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl animate-bounce">👾</span>
              Враги в игре
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span>Базовый</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-orange-500 rounded-full animate-pulse delay-100"></div>
                <span>Быстрый</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse delay-200"></div>
                <span>Большой</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-300"></div>
                <span>Маленький</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse delay-400"></div>
                <span>Зигзаг</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse delay-500"></div>
                <span>Следящий</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse delay-600"></div>
                <span>Телепорт</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-cyan-500 rounded-full animate-pulse delay-700"></div>
                <span>Замедляющий</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse delay-800"></div>
                <span>Ускоряющий</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-teal-500 rounded-full animate-pulse delay-900"></div>
                <span>Невидимый</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse delay-1000"></div>
                <span>Взрывной</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse delay-1100"></div>
                <span>Магнитный</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-lime-500 rounded-full animate-pulse delay-1200"></div>
                <span>Отражающий</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse delay-1300"></div>
                <span>Фазовый</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-violet-500 rounded-full animate-pulse delay-1400"></div>
                <span>Клонирующий</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-fuchsia-500 rounded-full animate-pulse delay-1500"></div>
                <span>Гравитационный</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-sky-500 rounded-full animate-pulse delay-1600"></div>
                <span>Лазерный</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse delay-1700"></div>
                <span>Щитовой</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-orange-600 rounded-full animate-pulse delay-1800"></div>
                <span>Регенерирующий</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-yellow-600 rounded-full animate-pulse delay-1900"></div>
                <span>Камикадзе</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse delay-2000"></div>
                <span>Призрачный</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse delay-2100"></div>
                <span>Ледяной</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse delay-2200"></div>
                <span>Огненный</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-pink-600 rounded-full animate-pulse delay-2300"></div>
                <span>Электрический</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-background/50 hover:bg-background/80 transition-all duration-300">
                <div className="w-3 h-3 bg-gray-500 rounded-full animate-pulse delay-2400"></div>
                <span>И другие...</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Каждый враг имеет уникальные способности и поведение!
            </p>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Лучший рекорд */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/20 p-8 hover:scale-105 hover:border-amber-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
              <Trophy className="h-16 w-16 text-amber-500" />
            </div>
            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <Trophy className="h-8 w-8 text-amber-500 animate-bounce" />
                <h3 className="text-xl font-bold">Лучший рекорд</h3>
              </div>
              <p className="text-5xl font-black text-amber-500 group-hover:scale-110 transition-transform duration-300">
                {parseInt(bestScore) < 60 ? `${bestScore}с` :
                 `${Math.floor(parseInt(bestScore) / 60)}:${(parseInt(bestScore) % 60).toString().padStart(2, '0')}`}
              </p>
            </div>
          </div>

          {/* Статистика врагов */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border-2 border-red-500/20 p-8 hover:scale-105 hover:border-red-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-red-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
              <Award className="h-16 w-16 text-red-500" />
            </div>
            <div className="relative space-y-4">
              <div className="flex items-center gap-3">
                <Award className="h-8 w-8 text-red-500 animate-pulse" />
                <h3 className="text-xl font-bold">Типов врагов</h3>
              </div>
              <p className="text-5xl font-black text-red-500 group-hover:scale-110 transition-transform duration-300">25+</p>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="space-y-6">
          {/* Главная кнопка */}
          <Button 
            onClick={handleStartGame} 
            size="lg" 
            className="w-full h-20 text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <Play className="h-8 w-8 mr-4 group-hover:animate-pulse relative z-10" />
            <span className="relative z-10">Начать игру</span>
          </Button>

          {/* Кнопка смены платформы */}
          {selectedPlatform && (
            <Button
              onClick={handleChangePlatform}
              variant="outline"
              size="sm"
              className="w-full text-sm hover:bg-muted/50 transition-all duration-300"
            >
              <Settings className="h-4 w-4 mr-2" />
              Сменить платформу ({selectedPlatform === 'desktop' ? 'Компьютер' : 'Мобильное'})
            </Button>
          )}

          {/* Дополнительные кнопки */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Button
              onClick={() => setShowInstructions(true)}
              variant="outline"
              size="lg"
              className="h-16 font-semibold border-2 hover:bg-blue-500/10 hover:border-blue-500/50 hover:scale-105 transition-all duration-300 group"
            >
              <BookOpen className="h-6 w-6 mr-3 group-hover:animate-bounce" />
              <div className="text-left">
                <div>Враги и угрозы</div>
                <div className="text-xs opacity-70">Изучите противников</div>
              </div>
            </Button>

            <Button
              onClick={() => router.push("/achievements")}
              variant="outline"
              size="lg"
              className="h-16 font-semibold border-2 hover:bg-amber-500/10 hover:border-amber-500/50 hover:scale-105 transition-all duration-300 group"
            >
              <Trophy className="h-6 w-6 mr-3 group-hover:animate-bounce" />
              <div className="text-left">
                <div>Достижения</div>
                <div className="text-xs opacity-70">66 наград ждут вас</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Управление */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-muted/50 to-muted/20 border-2 border-border/50 p-8 backdrop-blur-sm hover:border-border transition-all duration-500 group">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative space-y-6">
            <h4 className="text-2xl font-bold mb-6 flex items-center gap-3">
              🎮 Управление
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent"></div>
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-base">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-all duration-300 group/item">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse group-hover/item:scale-125 transition-transform duration-300"></div>
                <div>
                  <div className="font-semibold">Десктоп</div>
                  <div className="text-sm text-muted-foreground">Управляйте мышью</div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-background/50 hover:bg-background/80 transition-all duration-300 group/item">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse delay-300 group-hover/item:scale-125 transition-transform duration-300"></div>
                <div>
                  <div className="font-semibold">Мобильные</div>
                  <div className="text-sm text-muted-foreground">Касайтесь экрана</div>
                </div>
              </div>
            </div>
            <div className="mt-6 p-6 bg-destructive/10 border-2 border-destructive/20 rounded-2xl hover:border-destructive/30 transition-all duration-300">
              <p className="text-destructive font-bold text-center text-lg flex items-center justify-center gap-3">
                ⚠️ ИЗБЕГАЙТЕ ВСЕХ ЦВЕТНЫХ ФИГУР!
                <span className="animate-pulse">⚠️</span>
              </p>
            </div>
          </div>
        </div>

        {/* Подпись */}
        <div className="text-center space-y-3 opacity-60 hover:opacity-100 transition-opacity duration-500">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>Создано с</span>
            <span className="text-red-500 animate-pulse text-lg">❤️</span>
            <span>для любителей аркадных игр</span>
          </div>
          <p className="animate-pulse text-muted-foreground">Удачи в выживании! 🎯</p>
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground/60">
            <span>66 достижений</span>
            <span>•</span>
            <span>25+ врагов</span>
            <span>•</span>
            <span>Бесконечное веселье</span>
          </div>
        </div>
      </div>

      {/* Модальное окно с инструкциями */}
      {showInstructions && (
        <GameInstructions onClose={() => setShowInstructions(false)} />
      )}
    </div>
  )
}
