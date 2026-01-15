"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { GameInstructions } from "@/components/game/GameInstructions"
import { Trophy } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [showInstructions, setShowInstructions] = useState(false)
  const [bestScore, setBestScore] = useState("0")

  useEffect(() => {
    const score = localStorage.getItem("dodgeGame-bestScore") || "0"
    setBestScore(score)
  }, [])

  const handleStartGame = () => {
    router.push("/game")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 text-foreground">
      {/* Переключатель темы в правом верхнем углу */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Главный контент */}
      <div className="text-center space-y-8 max-w-lg w-full">
        {/* Логотип/название игры */}
        <div className="space-y-4">
          <h1 className="text-7xl font-bold tracking-wide">
            УКЛОНЕНИЕ
          </h1>
          <h2 className="text-3xl font-semibold text-muted-foreground">
            ИГРА
          </h2>
          <p className="text-base text-muted-foreground px-4">
            Избегайте 16 различных игровых фигур и продержитесь как можно дольше!
          </p>
          <p className="text-lg text-muted-foreground mt-6 px-4 sm:px-8">
            Добро пожаловать в Dodge Game! Это динамичная аркада, в которой ваша цель — выжить как можно дольше, уворачиваясь от бесконечного потока врагов. Управляйте своим курсором, собирайте бонусы и ставьте новые рекорды!
          </p>
        </div>

        {/* Выбор режима игры */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center">
            Готовы к испытанию?
          </h3>
        </div>

        {/* Лучший рекорд */}
        <div className="border rounded-2xl p-8 space-y-3">
          <h3 className="text-lg font-bold flex items-center justify-center gap-2">
            <Trophy className="h-5 w-5" />
            Лучший рекорд
          </h3>
          <p className="text-5xl font-bold">
            {parseInt(bestScore) < 60 ? `${bestScore} сек` :
             `${Math.floor(parseInt(bestScore) / 60)}:${(parseInt(bestScore) % 60).toString().padStart(2, '0')}`}
          </p>
        </div>

        {/* Кнопки */}
        <div className="space-y-4">
          {/* Кнопка запуска игры */}
          <Button onClick={handleStartGame} size="lg" className="w-full">
            Начать игру
          </Button>

          {/* Кнопка инструкций */}
          <Button
            onClick={() => setShowInstructions(true)}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Враги и угрозы
          </Button>

          {/* Кнопка достижений */}
          <Button
            onClick={() => router.push("/achievements")}
            variant="outline"
            size="lg"
            className="w-full"
          >
            Достижения
          </Button>
        </div>

        {/* Управление */}
        <div className="text-sm text-muted-foreground space-y-2 border rounded-xl p-4">
          <p><strong>Десктоп:</strong> Управляйте мышью</p>
          <p><strong>Мобильные:</strong> Касайтесь экрана</p>
          <p className="text-destructive font-bold mt-2">ИЗБЕГАЙТЕ ВСЕХ ЦВЕТНЫХ ФИГУР!</p>
        </div>
      </div>

      {/* Модальное окно с инструкциями */}
      {showInstructions && (
        <GameInstructions onClose={() => setShowInstructions(false)} />
      )}
    </div>
  )
}
