"use client"

import { useEffect, useState } from 'react'
import { getEnemyDescription } from '@/lib/enemyDescriptions'

interface EnemyNotificationProps {
  enemyType: string
  onDismiss: () => void
}

export function EnemyNotification({ enemyType, onDismiss }: EnemyNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)
  const enemy = getEnemyDescription(enemyType)

  useEffect(() => {
    // Автоматически скрываем уведомление через 5 секунд
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onDismiss, 300) // Даем время на анимацию
    }, 5000)

    return () => clearTimeout(timer)
  }, [onDismiss])

  if (!enemy) return null

  return (
    <div
      className={`transition-all duration-300 transform ${
        isVisible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-4 opacity-0'
      }`}
    >
      <div className="bg-gradient-to-r from-red-500/90 to-orange-500/90 backdrop-blur-md border-2 border-red-400 rounded-lg p-4 shadow-2xl max-w-sm animate-pulse">
        <div className="flex items-start gap-3">
          <span className="text-4xl flex-shrink-0 animate-bounce">{enemy.emoji}</span>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-white bg-red-600 px-2 py-1 rounded-full">
                НОВЫЙ ВРАГ!
              </span>
            </div>
            <h4 className="font-bold text-white text-sm mb-1">{enemy.name}</h4>
            <p className="text-xs text-white/90 leading-relaxed">
              {enemy.description}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

interface EnemyNotificationsContainerProps {
  newEnemies: string[]
  onDismiss: (enemyType: string) => void
}

export function EnemyNotificationsContainer({ newEnemies, onDismiss }: EnemyNotificationsContainerProps) {
  if (newEnemies.length === 0) return null

  return (
    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-20 space-y-2 pointer-events-none">
      {newEnemies.map(enemyType => (
        <EnemyNotification
          key={enemyType}
          enemyType={enemyType}
          onDismiss={() => onDismiss(enemyType)}
        />
      ))}
    </div>
  )
}
