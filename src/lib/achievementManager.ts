// Менеджер достижений

import { Achievement, AchievementProgress, ACHIEVEMENTS } from '@/types/achievements'

const STORAGE_KEY = 'dodgeGame-achievements'
const GAMES_PLAYED_KEY = 'dodgeGame-gamesPlayed'

// Получить все достижения из localStorage
export function getAchievements(): Achievement[] {
  if (typeof window === 'undefined') return []
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (!saved) {
      // Инициализируем достижения
      const initial = ACHIEVEMENTS.map(ach => ({
        ...ach,
        unlocked: false
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(saved)
  } catch (error) {
    console.error('Error loading achievements:', error)
    return ACHIEVEMENTS.map(ach => ({ ...ach, unlocked: false }))
  }
}

// Сохранить достижения
export function saveAchievements(achievements: Achievement[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements))
  } catch (error) {
    console.error('Error saving achievements:', error)
  }
}

// Разблокировать достижение
export function unlockAchievement(achievementId: string): Achievement | null {
  const achievements = getAchievements()
  const achievement = achievements.find(a => a.id === achievementId)
  
  if (!achievement || achievement.unlocked) {
    return null
  }
  
  achievement.unlocked = true
  achievement.unlockedAt = Date.now()
  saveAchievements(achievements)
  
  return achievement
}

// Проверить достижения по времени выживания
export function checkTimeAchievements(survivalTime: number): Achievement[] {
  const achievements = getAchievements()
  const newlyUnlocked: Achievement[] = []
  
  achievements.forEach(achievement => {
    if (achievement.type === 'time' && 
        !achievement.unlocked && 
        survivalTime >= achievement.requirement) {
      achievement.unlocked = true
      achievement.unlockedAt = Date.now()
      newlyUnlocked.push(achievement)
    }
  })
  
  if (newlyUnlocked.length > 0) {
    saveAchievements(achievements)
  }
  
  return newlyUnlocked
}

// Проверить достижения по встреченным врагам
export function checkEnemyAchievements(encounteredEnemies: string[]): Achievement[] {
  const achievements = getAchievements()
  const newlyUnlocked: Achievement[] = []
  const enemyCount = encounteredEnemies.length
  
  achievements.forEach(achievement => {
    if (achievement.type === 'enemy' && 
        !achievement.unlocked && 
        enemyCount >= achievement.requirement) {
      achievement.unlocked = true
      achievement.unlockedAt = Date.now()
      newlyUnlocked.push(achievement)
    }
  })
  
  if (newlyUnlocked.length > 0) {
    saveAchievements(achievements)
  }
  
  return newlyUnlocked
}

// Проверить специальные достижения
export function checkSpecialAchievements(survivalTime: number, isFirstGame: boolean): Achievement[] {
  const achievements = getAchievements()
  const newlyUnlocked: Achievement[] = []
  
  // Быстрая смерть
  if (survivalTime <= 5) {
    const fastDeath = achievements.find(a => a.id === 'special_fast_death')
    if (fastDeath && !fastDeath.unlocked) {
      fastDeath.unlocked = true
      fastDeath.unlockedAt = Date.now()
      newlyUnlocked.push(fastDeath)
    }
  }
  
  // Первая игра
  if (isFirstGame) {
    const firstGame = achievements.find(a => a.id === 'special_first_game')
    if (firstGame && !firstGame.unlocked) {
      firstGame.unlocked = true
      firstGame.unlockedAt = Date.now()
      newlyUnlocked.push(firstGame)
    }
  }
  
  // Количество игр
  const gamesPlayed = getGamesPlayed()
  const gamesAchievements = [
    { id: 'special_10_games', count: 10 },
    { id: 'special_50_games', count: 50 }
  ]
  
  gamesAchievements.forEach(({ id, count }) => {
    if (gamesPlayed >= count) {
      const achievement = achievements.find(a => a.id === id)
      if (achievement && !achievement.unlocked) {
        achievement.unlocked = true
        achievement.unlockedAt = Date.now()
        newlyUnlocked.push(achievement)
      }
    }
  })
  
  if (newlyUnlocked.length > 0) {
    saveAchievements(achievements)
  }
  
  return newlyUnlocked
}

// Получить количество сыгранных игр
export function getGamesPlayed(): number {
  if (typeof window === 'undefined') return 0
  
  try {
    const saved = localStorage.getItem(GAMES_PLAYED_KEY)
    return saved ? parseInt(saved, 10) : 0
  } catch (error) {
    return 0
  }
}

// Увеличить счетчик игр
export function incrementGamesPlayed(): number {
  if (typeof window === 'undefined') return 0
  
  const current = getGamesPlayed()
  const newCount = current + 1
  localStorage.setItem(GAMES_PLAYED_KEY, newCount.toString())
  return newCount
}

// Получить прогресс достижений
export function getAchievementProgress(): AchievementProgress {
  const achievements = getAchievements()
  const totalUnlocked = achievements.filter(a => a.unlocked).length
  
  return {
    achievements,
    totalUnlocked,
    lastUpdated: Date.now()
  }
}

// Сбросить все достижения (для тестирования)
export function resetAchievements(): void {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(GAMES_PLAYED_KEY)
}
