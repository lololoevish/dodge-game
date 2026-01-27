"use client"

import { BonusType, ActiveBonus } from "@/types/game"
import { Shield, Zap, ArrowUp, Eye, Clock } from "lucide-react"

interface ActiveBoostsProps {
  activeBonuses: ActiveBonus[]
  isMobile?: boolean
}

const getBonusInfo = (bonusType: BonusType) => {
  switch (bonusType) {
    case BonusType.SHIELD:
      return {
        icon: Shield,
        name: "Щит",
        color: "text-blue-500",
        bgColor: "bg-blue-500/20",
        borderColor: "border-blue-500/50"
      }
    case BonusType.SLOW_ENEMIES:
      return {
        icon: Zap,
        name: "Замедление",
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/20",
        borderColor: "border-yellow-500/50"
      }
    case BonusType.SIZE_UP:
      return {
        icon: ArrowUp,
        name: "Увеличение",
        color: "text-green-500",
        bgColor: "bg-green-500/20",
        borderColor: "border-green-500/50"
      }
    case BonusType.INVISIBILITY:
      return {
        icon: Eye,
        name: "Невидимость",
        color: "text-purple-500",
        bgColor: "bg-purple-500/20",
        borderColor: "border-purple-500/50"
      }
    case BonusType.EXTRA_TIME:
      return {
        icon: Clock,
        name: "Время",
        color: "text-orange-500",
        bgColor: "bg-orange-500/20",
        borderColor: "border-orange-500/50"
      }
    default:
      return {
        icon: Shield,
        name: "Буст",
        color: "text-gray-500",
        bgColor: "bg-gray-500/20",
        borderColor: "border-gray-500/50"
      }
  }
}

const formatTimeLeft = (endTime: number): string => {
  const timeLeft = Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
  return `${timeLeft}с`
}

export function ActiveBoosts({ activeBonuses, isMobile = false }: ActiveBoostsProps) {
  if (activeBonuses.length === 0) return null

  return (
    <div className={`fixed z-10 ${isMobile ? 'bottom-16 left-2 right-2' : 'bottom-6 left-6'}`}>
      <div className="flex flex-wrap gap-3">
        {activeBonuses.map((bonus) => {
          const bonusInfo = getBonusInfo(bonus.type)
          const Icon = bonusInfo.icon
          const timeLeft = formatTimeLeft(bonus.endTime)
          
          return (
            <div
              key={bonus.id}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-2xl border-2 backdrop-blur-md shadow-lg
                ${bonusInfo.bgColor} ${bonusInfo.borderColor}
                ${isMobile ? 'text-xs' : 'text-sm'}
                animate-pulse hover:scale-105 transition-all duration-300
                bg-gradient-to-r from-background/80 to-background/60
              `}
            >
              <Icon className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} ${bonusInfo.color} animate-bounce`} />
              <span className={`font-bold ${bonusInfo.color}`}>
                {bonusInfo.name}
              </span>
              <div className={`px-2 py-1 rounded-full bg-background/50 border border-border/30`}>
                <span className={`${bonusInfo.color} font-mono font-bold text-xs`}>
                  {timeLeft}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}