"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft, Trophy, Lock } from "lucide-react"
import { getAchievementProgress, getGamesPlayed } from "@/lib/achievementManager"
import type { Achievement } from "@/types/achievements"

export default function AchievementsPage() {
  const router = useRouter()
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [totalUnlocked, setTotalUnlocked] = useState(0)
  const [gamesPlayed, setGamesPlayed] = useState(0)

  useEffect(() => {
    const progress = getAchievementProgress()
    setAchievements(progress.achievements)
    setTotalUnlocked(progress.totalUnlocked)
    setGamesPlayed(getGamesPlayed())
  }, [])

  const totalAchievements = achievements.length
  const progressPercentage = totalAchievements > 0 
    ? Math.round((totalUnlocked / totalAchievements) * 100) 
    : 0

  // Группировка достижений по типам
  const timeAchievements = achievements.filter(a => a.type === 'time')
  const enemyAchievements = achievements.filter(a => a.type === 'enemy')
  const specialAchievements = achievements.filter(a => a.type === 'special')
  const enduranceAchievements = achievements.filter(a => a.type === 'endurance')
  const masteryAchievements = achievements.filter(a => a.type === 'mastery')
  const luckAchievements = achievements.filter(a => a.type === 'luck')

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return ''
    const date = new Date(timestamp)
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const AchievementCard = ({ achievement }: { achievement: Achievement }) => (
    <div
      className={`border-2 rounded-2xl p-6 transition-all duration-500 hover:scale-105 group ${
        achievement.unlocked
          ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/50 hover:border-amber-500/70 hover:shadow-xl hover:shadow-amber-500/20'
          : 'bg-muted/30 border-border opacity-60 hover:opacity-80 hover:border-border/80'
      }`}
    >
      <div className="flex items-start gap-5">
        <div className={`text-5xl transition-all duration-300 ${achievement.unlocked ? 'animate-bounce group-hover:scale-110' : 'grayscale group-hover:grayscale-0'}`}>
          {achievement.unlocked ? achievement.icon : <Lock className="h-10 w-10 text-muted-foreground" />}
        </div>
        <div className="flex-1">
          <h3 className={`font-bold text-xl mb-2 transition-colors duration-300 ${achievement.unlocked ? 'text-foreground group-hover:text-amber-600' : 'text-muted-foreground'}`}>
            {achievement.title}
          </h3>
          <p className="text-base text-muted-foreground mb-3 leading-relaxed">
            {achievement.description}
          </p>
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">
              🎉 Разблокировано: {formatDate(achievement.unlockedAt)}
            </p>
          )}
          {!achievement.unlocked && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              🔒 <span>Заблокировано</span>
            </p>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Хедер */}
      <div className="max-w-6xl mx-auto mb-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-2 hover:scale-105 transition-transform duration-300"
          >
            <ArrowLeft className="h-4 w-4" />
            Главное меню
          </Button>
          <ThemeToggle />
        </div>

        {/* Заголовок */}
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-3">
            <Trophy className="h-12 w-12 text-amber-500" />
            <h1 className="text-4xl font-bold">Достижения</h1>
          </div>
          <p className="text-muted-foreground">
            Разблокируйте все достижения, играя в Dodge Game!
          </p>
        </div>

        {/* Общий прогресс */}
        <div className="bg-card border border-border rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">
                {totalUnlocked} / {totalAchievements}
              </div>
              <div className="text-sm text-muted-foreground">Разблокировано</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-500">
                {progressPercentage}%
              </div>
              <div className="text-sm text-muted-foreground">Прогресс</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500">
                {gamesPlayed}
              </div>
              <div className="text-sm text-muted-foreground">Игр сыграно</div>
            </div>
          </div>

          {/* Прогресс-бар */}
          <div className="w-full bg-muted rounded-full h-4 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Список достижений */}
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Временные достижения */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            ⏱️ Достижения за время
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {timeAchievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>

        {/* Достижения за врагов */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            👾 Достижения за врагов
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enemyAchievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>

        {/* Специальные достижения */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            ⭐ Специальные достижения
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specialAchievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>

        {/* Достижения за выносливость */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🔥 Достижения за выносливость
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {enduranceAchievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>

        {/* Достижения за мастерство */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🎯 Достижения за мастерство
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {masteryAchievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>

        {/* Достижения за удачу */}
        <div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            🍀 Достижения за удачу
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {luckAchievements.map(achievement => (
              <AchievementCard key={achievement.id} achievement={achievement} />
            ))}
          </div>
        </div>
      </div>

      {/* Подсказка */}
      <div className="max-w-4xl mx-auto mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          💡 Совет: Играйте больше, чтобы разблокировать все достижения!
        </p>
      </div>
    </div>
  )
}
