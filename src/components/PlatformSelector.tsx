"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Monitor, Smartphone } from "lucide-react"

interface PlatformSelectorProps {
  onSelect: (platform: 'desktop' | 'mobile') => void
}

export function PlatformSelector({ onSelect }: PlatformSelectorProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md w-full">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Выберите платформу
          </h1>
          <p className="text-muted-foreground">
            Для лучшего игрового опыта выберите ваше устройство
          </p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => onSelect('desktop')}
            size="lg"
            className="w-full h-20 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 group"
          >
            <Monitor className="h-8 w-8 mr-4 group-hover:animate-pulse" />
            <div className="text-left">
              <div>Компьютер / Ноутбук</div>
              <div className="text-sm opacity-80">Управление мышью</div>
            </div>
          </Button>

          <Button
            onClick={() => onSelect('mobile')}
            size="lg"
            variant="outline"
            className="w-full h-20 text-lg font-semibold border-2 hover:bg-green-500/10 hover:border-green-500/50 transition-all duration-300 group"
          >
            <Smartphone className="h-8 w-8 mr-4 group-hover:animate-pulse" />
            <div className="text-left">
              <div>Телефон / Планшет</div>
              <div className="text-sm opacity-80">Сенсорное управление</div>
            </div>
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Вы можете изменить это в настройках позже</p>
        </div>
      </div>
    </div>
  )
}