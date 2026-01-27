// Менеджер достижений

import { Achievement, AchievementProgress, ACHIEVEMENTS } from '@/types/achievements'
import { BonusType, ActiveBonus } from '@/types/game'

const STORAGE_KEY = 'dodgeGame-achievements'
const GAMES_PLAYED_KEY = 'dodgeGame-gamesPlayed'
const TOTAL_TIME_KEY = 'dodgeGame-totalTime'
const BONUSES_COLLECTED_KEY = 'dodgeGame-bonusesCollected'
const BEST_SCORE_KEY = 'dodgeGame-bestScore'

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
    if ((achievement.type === 'time' || achievement.type === 'mastery') && 
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
    if (achievement.type === 'enemy' && !achievement.unlocked) {
      let shouldUnlock = false
      
      // Проверяем достижения по количеству врагов
      if (achievement.id.startsWith('enemy_') && 
          !achievement.id.includes('chaser') && 
          !achievement.id.includes('bouncing') && 
          !achievement.id.includes('star') &&
          !achievement.id.includes('triangle') &&
          !achievement.id.includes('lightning') &&
          !achievement.id.includes('fire') &&
          !achievement.id.includes('mutated') &&
          achievement.id !== 'enemy_first') {
        shouldUnlock = enemyCount >= achievement.requirement
      }
      
      // Первый враг
      if (achievement.id === 'enemy_first' && enemyCount >= 1) {
        shouldUnlock = true
      }
      
      // Проверяем достижения за конкретных врагов
      if (achievement.id === 'enemy_chaser' && encounteredEnemies.includes('chaser')) {
        shouldUnlock = true
      }
      if (achievement.id === 'enemy_bouncing' && encounteredEnemies.includes('bouncing')) {
        shouldUnlock = true
      }
      if (achievement.id === 'enemy_star' && encounteredEnemies.includes('star')) {
        shouldUnlock = true
      }
      if (achievement.id === 'enemy_triangle' && encounteredEnemies.includes('triangle')) {
        shouldUnlock = true
      }
      if (achievement.id === 'enemy_lightning' && encounteredEnemies.includes('lightning')) {
        shouldUnlock = true
      }
      if (achievement.id === 'enemy_fire' && encounteredEnemies.includes('fire')) {
        shouldUnlock = true
      }
      if (achievement.id === 'enemy_mutated' && encounteredEnemies.includes('mutated-enemy')) {
        shouldUnlock = true
      }
      
      if (shouldUnlock) {
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

// Проверить достижения за бонусы
export function checkBonusAchievements(
  bonusesCollectedThisGame: number, 
  activeBonuses: ActiveBonus[], 
  bonusType?: BonusType,
  gameTime?: number
): Achievement[] {
  const achievements = getAchievements()
  const newlyUnlocked: Achievement[] = []
  
  achievements.forEach(achievement => {
    if (achievement.type === 'luck' && !achievement.unlocked) {
      let shouldUnlock = false
      
      // Первый бонус
      if (achievement.id === 'luck_first_bonus' && bonusesCollectedThisGame >= 1) {
        shouldUnlock = true
      }
      
      // Количество бонусов за игру
      if (achievement.id === 'luck_bonus_3' && bonusesCollectedThisGame >= 3) {
        shouldUnlock = true
      }
      if (achievement.id === 'luck_bonus_5' && bonusesCollectedThisGame >= 5) {
        shouldUnlock = true
      }
      
      // Конкретные типы бонусов
      if (bonusType) {
        if (achievement.id === 'luck_shield_user' && bonusType === BonusType.SHIELD) {
          shouldUnlock = true
        }
        if (achievement.id === 'luck_time_bonus' && bonusType === BonusType.EXTRA_TIME) {
          shouldUnlock = true
        }
        if (achievement.id === 'luck_slow_enemies' && bonusType === BonusType.SLOW_ENEMIES) {
          shouldUnlock = true
        }
        if (achievement.id === 'luck_size_up' && bonusType === BonusType.SIZE_UP) {
          shouldUnlock = true
        }
        if (achievement.id === 'luck_invisible' && bonusType === BonusType.INVISIBILITY) {
          shouldUnlock = true
        }
      }
      
      // Двойной эффект (2 активных бонуса одновременно)
      if (achievement.id === 'luck_double_bonus' && activeBonuses.length >= 2) {
        shouldUnlock = true
      }
      
      // Ранняя удача (бонус в первые 10 секунд)
      if (achievement.id === 'luck_early_bonus' && gameTime && gameTime <= 10 && bonusesCollectedThisGame >= 1) {
        shouldUnlock = true
      }
      
      if (shouldUnlock) {
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

// Проверить специальные достижения
export function checkSpecialAchievements(survivalTime: number, isFirstGame: boolean): Achievement[] {
  const achievements = getAchievements()
  const newlyUnlocked: Achievement[] = []
  
  // Быстрая смерть (3 секунды или меньше)
  if (survivalTime <= 3) {
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
  
  // Специальные временные достижения
  if (survivalTime === 77) {
    const lucky7 = achievements.find(a => a.id === 'special_lucky_7')
    if (lucky7 && !lucky7.unlocked) {
      lucky7.unlocked = true
      lucky7.unlockedAt = Date.now()
      newlyUnlocked.push(lucky7)
    }
  }
  
  if (survivalTime === 60) {
    const perfectMinute = achievements.find(a => a.id === 'special_perfect_minute')
    if (perfectMinute && !perfectMinute.unlocked) {
      perfectMinute.unlocked = true
      perfectMinute.unlockedAt = Date.now()
      newlyUnlocked.push(perfectMinute)
    }
  }
  
  // Проверка улучшения рекорда
  const currentBest = getBestScore()
  if (survivalTime > currentBest + 30) {
    const comeback = achievements.find(a => a.id === 'special_comeback')
    if (comeback && !comeback.unlocked) {
      comeback.unlocked = true
      comeback.unlockedAt = Date.now()
      newlyUnlocked.push(comeback)
    }
  }
  
  // Количество игр
  const gamesPlayed = getGamesPlayed()
  const gamesAchievements = [
    { id: 'special_5_games', count: 5 },
    { id: 'special_10_games', count: 10 },
    { id: 'special_25_games', count: 25 },
    { id: 'special_50_games', count: 50 },
    { id: 'special_100_games', count: 100 }
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

// Проверить достижения за выносливость
export function checkEnduranceAchievements(): Achievement[] {
  const achievements = getAchievements()
  const newlyUnlocked: Achievement[] = []
  const gamesPlayed = getGamesPlayed()
  const totalTime = getTotalTime()
  
  achievements.forEach(achievement => {
    if (achievement.type === 'endurance' && !achievement.unlocked) {
      let shouldUnlock = false
      
      // Достижения по общему времени
      if (achievement.id === 'endurance_total_time_30min' && totalTime >= 1800) {
        shouldUnlock = true
      }
      if (achievement.id === 'endurance_total_time_1hour' && totalTime >= 3600) {
        shouldUnlock = true
      }
      if (achievement.id === 'endurance_total_time_2hours' && totalTime >= 7200) {
        shouldUnlock = true
      }
      
      // Достижения по количеству игр (упрощенные)
      if (achievement.id === 'endurance_streak_3' && gamesPlayed >= 3) {
        shouldUnlock = true
      }
      if (achievement.id === 'endurance_streak_5' && gamesPlayed >= 5) {
        shouldUnlock = true
      }
      if (achievement.id === 'endurance_streak_10' && gamesPlayed >= 10) {
        shouldUnlock = true
      }
      if (achievement.id === 'endurance_daily_5' && gamesPlayed >= 5) {
        shouldUnlock = true
      }
      if (achievement.id === 'endurance_daily_10' && gamesPlayed >= 10) {
        shouldUnlock = true
      }
      if (achievement.id === 'endurance_weekly_25' && gamesPlayed >= 25) {
        shouldUnlock = true
      }
      
      if (shouldUnlock) {
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

// Получить общее время в игре
export function getTotalTime(): number {
  if (typeof window === 'undefined') return 0
  
  try {
    const saved = localStorage.getItem(TOTAL_TIME_KEY)
    return saved ? parseInt(saved, 10) : 0
  } catch (error) {
    return 0
  }
}

// Добавить время к общему времени
export function addTotalTime(seconds: number): number {
  if (typeof window === 'undefined') return 0
  
  const current = getTotalTime()
  const newTotal = current + seconds
  localStorage.setItem(TOTAL_TIME_KEY, newTotal.toString())
  return newTotal
}

// Получить лучший результат
export function getBestScore(): number {
  if (typeof window === 'undefined') return 0
  
  try {
    const saved = localStorage.getItem(BEST_SCORE_KEY)
    return saved ? parseInt(saved, 10) : 0
  } catch (error) {
    return 0
  }
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
  localStorage.removeItem(TOTAL_TIME_KEY)
  localStorage.removeItem(BONUSES_COLLECTED_KEY)
}
