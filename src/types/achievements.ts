// Типы для системы достижений

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  requirement: number // Требование для разблокировки
  type: 'time' | 'enemy' | 'special' // Тип достижения
  unlocked: boolean
  unlockedAt?: number // Timestamp разблокировки
}

export interface AchievementProgress {
  achievements: Achievement[]
  totalUnlocked: number
  lastUpdated: number
}

// Список всех достижений
export const ACHIEVEMENTS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  // Временные достижения
  {
    id: 'survivor_10',
    title: 'Первые шаги',
    description: 'Продержитесь 10 секунд',
    icon: '🎯',
    requirement: 10,
    type: 'time'
  },
  {
    id: 'survivor_30',
    title: 'Новичок',
    description: 'Продержитесь 30 секунд',
    icon: '🥉',
    requirement: 30,
    type: 'time'
  },
  {
    id: 'survivor_60',
    title: 'Опытный игрок',
    description: 'Продержитесь 60 секунд',
    icon: '🥈',
    requirement: 60,
    type: 'time'
  },
  {
    id: 'survivor_100',
    title: 'Мастер уклонения',
    description: 'Продержитесь 100 секунд',
    icon: '🥇',
    requirement: 100,
    type: 'time'
  },
  {
    id: 'survivor_120',
    title: 'Легенда',
    description: 'Продержитесь 120 секунд',
    icon: '💎',
    requirement: 120,
    type: 'time'
  },
  {
    id: 'survivor_180',
    title: 'Бессмертный',
    description: 'Продержитесь 3 минуты',
    icon: '👑',
    requirement: 180,
    type: 'time'
  },
  
  // Достижения за встречу с врагами
  {
    id: 'enemy_first',
    title: 'Первая встреча',
    description: 'Встретьте первого врага',
    icon: '👀',
    requirement: 1,
    type: 'enemy'
  },
  {
    id: 'enemy_5',
    title: 'Знакомство с опасностью',
    description: 'Встретьте 5 разных врагов',
    icon: '🎭',
    requirement: 5,
    type: 'enemy'
  },
  {
    id: 'enemy_10',
    title: 'Коллекционер угроз',
    description: 'Встретьте 10 разных врагов',
    icon: '📚',
    requirement: 10,
    type: 'enemy'
  },
  {
    id: 'enemy_all',
    title: 'Знаток всех опасностей',
    description: 'Встретьте всех 13 врагов',
    icon: '🏆',
    requirement: 13,
    type: 'enemy'
  },
  
  // Специальные достижения
  {
    id: 'special_fast_death',
    title: 'Быстрый старт',
    description: 'Проиграйте за первые 5 секунд',
    icon: '⚡',
    requirement: 5,
    type: 'special'
  },
  {
    id: 'special_first_game',
    title: 'Первая попытка',
    description: 'Сыграйте первую игру',
    icon: '🎮',
    requirement: 1,
    type: 'special'
  },
  {
    id: 'special_10_games',
    title: 'Упорство',
    description: 'Сыграйте 10 игр',
    icon: '🔥',
    requirement: 10,
    type: 'special'
  },
  {
    id: 'special_50_games',
    title: 'Преданный игрок',
    description: 'Сыграйте 50 игр',
    icon: '💪',
    requirement: 50,
    type: 'special'
  }
]
