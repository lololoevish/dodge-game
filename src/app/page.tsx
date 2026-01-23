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
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent blur-sm">
              <h1 className="text-8xl font-black tracking-wider">
                DODGE
              </h1>
            </div>
            <h1 className="relative text-8xl font-black tracking-wider bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-pulse">
              DODGE
            </h1>
          </div>
          
          <div className="flex items-center justify-center gap-3">
            <Sparkles className="h-8 w-8 text-yellow-500 animate-spin" />
            <h2 className="text-4xl font-bold text-muted-foreground">
              GAME
            </h2>
            <Sparkles className="h-8 w-8 text-yellow-500 animate-spin" />
          </div>
          
          <div className="bg-gradient-to-r from-transparent via-border to-transparent h-px w-full"></div>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-lg mx-auto">
            Уклоняйтесь от <span className="text-red-500 font-bold">16 различных врагов</span> и продержитесь как можно дольше в этой динамичной аркаде!
          </p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Лучший рекорд */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-6 hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Trophy className="h-6 w-6 text-amber-500" />
                <h3 className="text-lg font-bold">Лучший рекорд</h3>
              </div>
              <p className="text-4xl font-black text-amber-500">
                {parseInt(bestScore) < 60 ? `${bestScore}с` :
                 `${Math.floor(parseInt(bestScore) / 60)}:${(parseInt(bestScore) % 60).toString().padStart(2, '0')}`}
              </p>
            </div>
          </div>

          {/* Статистика врагов */}
          <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20 p-6 hover:scale-105 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative space-y-3">
              <div className="flex items-center justify-center gap-2">
                <Award className="h-6 w-6 text-red-500" />
                <h3 className="text-lg font-bold">Типов врагов</h3>
              </div>
              <p className="text-4xl font-black text-red-500">16</p>
            </div>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="space-y-4">
          {/* Главная кнопка */}
          <Button 
            onClick={handleStartGame} 
            size="lg" 
            className="w-full h-16 text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 group"
          >
            <Play className="h-6 w-6 mr-3 group-hover:animate-pulse" />
            Начать игру
          </Button>

          {/* Кнопка смены платформы */}
          {selectedPlatform && (
            <Button
              onClick={handleChangePlatform}
              variant="outline"
              size="sm"
              className="w-full text-xs"
            >
              <Settings className="h-3 w-3 mr-2" />
              Сменить платформу ({selectedPlatform === 'desktop' ? 'Компьютер' : 'Мобильное'})
            </Button>
          )}

          {/* Дополнительные кнопки */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => setShowInstructions(true)}
              variant="outline"
              size="lg"
              className="h-14 font-semibold border-2 hover:bg-blue-500/10 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <BookOpen className="h-5 w-5 mr-2 group-hover:animate-bounce" />
              Враги и угрозы
            </Button>

            <Button
              onClick={() => router.push("/achievements")}
              variant="outline"
              size="lg"
              className="h-14 font-semibold border-2 hover:bg-amber-500/10 hover:border-amber-500/50 transition-all duration-300 group"
            >
              <Trophy className="h-5 w-5 mr-2 group-hover:animate-bounce" />
              Достижения
            </Button>
          </div>
        </div>

        {/* Управление */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border/50 p-6 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-purple-500/5"></div>
          <div className="relative space-y-3">
            <h4 className="text-lg font-bold mb-4">🎮 Управление</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span><strong>Десктоп:</strong> Управляйте мышью</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse delay-300"></div>
                <span><strong>Мобильные:</strong> Касайтесь экрана</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive font-bold text-center">
                ⚠️ ИЗБЕГАЙТЕ ВСЕХ ЦВЕТНЫХ ФИГУР!
              </p>
            </div>
          </div>
        </div>

        {/* Подпись */}
        <div className="text-xs text-muted-foreground/60 space-y-1">
          <p>Создано с ❤️ для любителей аркадных игр</p>
          <p className="animate-pulse">Удачи в выживании! 🎯</p>
        </div>
      </div>

      {/* Модальное окно с инструкциями */}
      {showInstructions && (
        <GameInstructions onClose={() => setShowInstructions(false)} />
      )}
    </div>
  )
}
