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
    <div className={`fixed z-10 ${isMobile ? 'bottom-12 left-2 right-2' : 'bottom-4 left-4'}`}>
      <div className="flex flex-wrap gap-2">
        {activeBonuses.map((bonus) => {
          const bonusInfo = getBonusInfo(bonus.type)
          const Icon = bonusInfo.icon
          const timeLeft = formatTimeLeft(bonus.endTime)
          
          return (
            <div
              key={bonus.id}
              className={`
                flex items-center gap-2 px-3 py-2 rounded-lg border backdrop-blur-sm
                ${bonusInfo.bgColor} ${bonusInfo.borderColor}
                ${isMobile ? 'text-xs' : 'text-sm'}
                animate-pulse
              `}
            >
              <Icon className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} ${bonusInfo.color}`} />
              <span className={`font-medium ${bonusInfo.color}`}>
                {bonusInfo.name}
              </span>
              <span className={`${bonusInfo.color} opacity-80`}>
                {timeLeft}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}