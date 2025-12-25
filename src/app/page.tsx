"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { GameInstructions } from "@/components/game/GameInstructions"
import { Play, HelpCircle, Trophy, BookOpen } from "lucide-react"

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
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex flex-col items-center justify-center p-4 text-white">
      {/* Переключатель темы в правом верхнем углу */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Главный контент */}
      <div className="text-center space-y-8 max-w-lg w-full">
        {/* Логотип/название игры */}
        <div className="space-y-4">
          <h1 className="text-7xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-wide">
            УКЛОНЕНИЕ
          </h1>
          <h2 className="text-3xl font-semibold text-purple-300">
            ИГРА
          </h2>
          <p className="text-base text-purple-200 px-4">
            Избегайте 16 различных игровых фигур и продержитесь как можно дольше!
          </p>
        </div>

        {/* Выбор режима игры */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-center text-cyan-200">
            Готовы к испытанию?
          </h3>
        </div>

        {/* Лучший рекорд */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 space-y-3 shadow-2xl shadow-purple-500/20">
          <h3 className="text-lg font-bold text-amber-300 flex items-center justify-center gap-2">
            <Trophy className="h-5 w-5" />
            Лучший рекорд
          </h3>
          <p className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            {parseInt(bestScore) < 60 ? `${bestScore} сек` :
             `${Math.floor(parseInt(bestScore) / 60)}:${(parseInt(bestScore) % 60).toString().padStart(2, '0')}`}
          </p>
        </div>

        {/* Кнопки */}
        <div className="space-y-4">
          {/* Кнопка запуска игры */}
          <Button
            onClick={handleStartGame}
            size="lg"
            className="w-full text-xl font-bold py-8 text-white bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 shadow-2xl shadow-emerald-500/30 transition-all duration-300 hover:shadow-emerald-500/50 hover:scale-105 rounded-2xl"
          >
            <Play className="mr-3 h-6 w-6" />
            🎮 Начать игру
          </Button>

          {/* Кнопка инструкций */}
          <Button
            onClick={() => setShowInstructions(true)}
            variant="outline"
            size="lg"
            className="w-full text-lg font-semibold py-5 border-2 border-purple-400 text-purple-100 hover:bg-purple-500/30 transition-all duration-300 rounded-xl"
          >
            <BookOpen className="mr-3 h-6 w-6 text-purple-300" />
            📚 Враги и угрозы
          </Button>

          {/* Кнопка достижений */}
          <Button
            onClick={() => router.push("/achievements")}
            variant="outline"
            size="lg"
            className="w-full text-lg font-semibold py-5 border-2 border-amber-500 text-amber-100 hover:bg-amber-500/20 transition-all duration-300 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10"
          >
            <Trophy className="mr-3 h-6 w-6 text-amber-400" />
            🏆 Достижения
          </Button>
        </div>

        {/* Управление */}
        <div className="text-sm text-purple-300 space-y-2 bg-black/20 rounded-xl p-4 border border-purple-500/30">
          <p>🖱️ <strong>Десктоп:</strong> Управляйте мышью</p>
          <p>📱 <strong>Мобильные:</strong> Касайтесь экрана</p>
          <p className="text-red-400 font-bold mt-2">💀 ИЗБЕГАЙТЕ ВСЕХ ЦВЕТНЫХ ФИГУР!</p>
        </div>
      </div>

      {/* Модальное окно с инструкциями */}
      {showInstructions && (
        <GameInstructions onClose={() => setShowInstructions(false)} />
      )}
    </div>
  )
}
