// Типы для системы достижений

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  requirement: number // Требование для разблокировки
  type: 'time' | 'enemy' | 'special' | 'endurance' | 'mastery' | 'luck' // Тип достижения
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
  // Временные достижения (12 достижений)
  {
    id: 'survivor_5',
    title: 'Первые секунды',
    description: 'Продержитесь 5 секунд',
    icon: '🌱',
    requirement: 5,
    type: 'time'
  },
  {
    id: 'survivor_10',
    title: 'Первые шаги',
    description: 'Продержитесь 10 секунд',
    icon: '🎯',
    requirement: 10,
    type: 'time'
  },
  {
    id: 'survivor_20',
    title: 'Учусь уклоняться',
    description: 'Продержитесь 20 секунд',
    icon: '🏃',
    requirement: 20,
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
    id: 'survivor_45',
    title: 'Становлюсь лучше',
    description: 'Продержитесь 45 секунд',
    icon: '📈',
    requirement: 45,
    type: 'time'
  },
  {
    id: 'survivor_60',
    title: 'Опытный игрок',
    description: 'Продержитесь 1 минуту',
    icon: '🥈',
    requirement: 60,
    type: 'time'
  },
  {
    id: 'survivor_90',
    title: 'Мастер',
    description: 'Продержитесь 1.5 минуты',
    icon: '⭐',
    requirement: 90,
    type: 'time'
  },
  {
    id: 'survivor_120',
    title: 'Эксперт уклонения',
    description: 'Продержитесь 2 минуты',
    icon: '🥇',
    requirement: 120,
    type: 'time'
  },
  {
    id: 'survivor_150',
    title: 'Виртуоз',
    description: 'Продержитесь 2.5 минуты',
    icon: '🎨',
    requirement: 150,
    type: 'time'
  },
  {
    id: 'survivor_180',
    title: 'Легенда',
    description: 'Продержитесь 3 минуты',
    icon: '💎',
    requirement: 180,
    type: 'time'
  },
  {
    id: 'survivor_240',
    title: 'Бессмертный',
    description: 'Продержитесь 4 минуты',
    icon: '👑',
    requirement: 240,
    type: 'time'
  },
  {
    id: 'survivor_300',
    title: 'Божество уклонения',
    description: 'Продержитесь 5 минут',
    icon: '🌟',
    requirement: 300,
    type: 'time'
  },
  
  // Достижения за встречу с врагами (12 достижений)
  {
    id: 'enemy_first',
    title: 'Первая встреча',
    description: 'Встретьте первого врага',
    icon: '👀',
    requirement: 1,
    type: 'enemy'
  },
  {
    id: 'enemy_2',
    title: 'Двойная угроза',
    description: 'Встретьте 2 разных врага',
    icon: '👥',
    requirement: 2,
    type: 'enemy'
  },
  {
    id: 'enemy_3',
    title: 'Тройная опасность',
    description: 'Встретьте 3 разных врага',
    icon: '🎭',
    requirement: 3,
    type: 'enemy'
  },
  {
    id: 'enemy_5',
    title: 'Знакомство с хаосом',
    description: 'Встретьте 5 разных врагов',
    icon: '🌪️',
    requirement: 5,
    type: 'enemy'
  },
  {
    id: 'enemy_7',
    title: 'Исследователь угроз',
    description: 'Встретьте 7 разных врагов',
    icon: '🔍',
    requirement: 7,
    type: 'enemy'
  },
  {
    id: 'enemy_10',
    title: 'Коллекционер опасностей',
    description: 'Встретьте 10 разных врагов',
    icon: '📚',
    requirement: 10,
    type: 'enemy'
  },
  {
    id: 'enemy_12',
    title: 'Почти все',
    description: 'Встретьте 12 разных врагов',
    icon: '🎯',
    requirement: 12,
    type: 'enemy'
  },
  {
    id: 'enemy_14',
    title: 'Знаток всех угроз',
    description: 'Встретьте 14 разных врагов',
    icon: '🏆',
    requirement: 14,
    type: 'enemy'
  },
  {
    id: 'enemy_16',
    title: 'Мастер всех опасностей',
    description: 'Встретьте всех 16 врагов',
    icon: '👑',
    requirement: 16,
    type: 'enemy'
  },
  {
    id: 'enemy_chaser',
    title: 'Встреча с преследователем',
    description: 'Встретьте красного преследователя',
    icon: '🔴',
    requirement: 1,
    type: 'enemy'
  },
  {
    id: 'enemy_bouncing',
    title: 'Прыгучий знакомый',
    description: 'Встретьте прыгающий круг',
    icon: '🟢',
    requirement: 1,
    type: 'enemy'
  },
  {
    id: 'enemy_star',
    title: 'Звездная встреча',
    description: 'Встретьте звезду-генератор',
    icon: '⭐',
    requirement: 1,
    type: 'enemy'
  },
  
  // Специальные достижения (12 достижений)
  {
    id: 'special_first_game',
    title: 'Первая попытка',
    description: 'Сыграйте первую игру',
    icon: '🎮',
    requirement: 1,
    type: 'special'
  },
  {
    id: 'special_fast_death',
    title: 'Быстрый финал',
    description: 'Проиграйте за первые 3 секунды',
    icon: '⚡',
    requirement: 3,
    type: 'special'
  },
  {
    id: 'special_5_games',
    title: 'Настойчивость',
    description: 'Сыграйте 5 игр',
    icon: '🔥',
    requirement: 5,
    type: 'special'
  },
  {
    id: 'special_10_games',
    title: 'Упорство',
    description: 'Сыграйте 10 игр',
    icon: '💪',
    requirement: 10,
    type: 'special'
  },
  {
    id: 'special_25_games',
    title: 'Увлеченный игрок',
    description: 'Сыграйте 25 игр',
    icon: '🎯',
    requirement: 25,
    type: 'special'
  },
  {
    id: 'special_50_games',
    title: 'Преданный игрок',
    description: 'Сыграйте 50 игр',
    icon: '🏅',
    requirement: 50,
    type: 'special'
  },
  {
    id: 'special_100_games',
    title: 'Ветеран',
    description: 'Сыграйте 100 игр',
    icon: '🎖️',
    requirement: 100,
    type: 'special'
  },
  {
    id: 'special_lucky_7',
    title: 'Счастливая семерка',
    description: 'Продержитесь ровно 77 секунд',
    icon: '🍀',
    requirement: 77,
    type: 'special'
  },
  {
    id: 'special_perfect_minute',
    title: 'Идеальная минута',
    description: 'Продержитесь ровно 60 секунд',
    icon: '⏰',
    requirement: 60,
    type: 'special'
  },
  {
    id: 'special_comeback',
    title: 'Возвращение',
    description: 'Улучшите свой рекорд на 30+ секунд',
    icon: '📈',
    requirement: 30,
    type: 'special'
  },
  {
    id: 'special_marathon',
    title: 'Марафонец',
    description: 'Сыграйте 10 игр подряд за день',
    icon: '🏃‍♂️',
    requirement: 10,
    type: 'special'
  },
  {
    id: 'special_explorer',
    title: 'Исследователь',
    description: 'Посетите все разделы игры',
    icon: '🗺️',
    requirement: 1,
    type: 'special'
  },

  // Достижения за выносливость (10 достижений)
  {
    id: 'endurance_streak_3',
    title: 'Тройная серия',
    description: 'Сыграйте 3 игры подряд',
    icon: '🔥',
    requirement: 3,
    type: 'endurance'
  },
  {
    id: 'endurance_streak_5',
    title: 'Пятерная серия',
    description: 'Сыграйте 5 игр подряд',
    icon: '🌟',
    requirement: 5,
    type: 'endurance'
  },
  {
    id: 'endurance_streak_10',
    title: 'Десятка подряд',
    description: 'Сыграйте 10 игр подряд',
    icon: '💫',
    requirement: 10,
    type: 'endurance'
  },
  {
    id: 'endurance_daily_5',
    title: 'Ежедневная пятерка',
    description: 'Сыграйте 5 игр за один день',
    icon: '📅',
    requirement: 5,
    type: 'endurance'
  },
  {
    id: 'endurance_daily_10',
    title: 'Дневной марафон',
    description: 'Сыграйте 10 игр за один день',
    icon: '🏃',
    requirement: 10,
    type: 'endurance'
  },
  {
    id: 'endurance_weekly_25',
    title: 'Недельный воин',
    description: 'Сыграйте 25 игр за неделю',
    icon: '⚔️',
    requirement: 25,
    type: 'endurance'
  },
  {
    id: 'endurance_total_time_30min',
    title: 'Полчаса в игре',
    description: 'Проведите 30 минут в игре суммарно',
    icon: '⏱️',
    requirement: 1800,
    type: 'endurance'
  },
  {
    id: 'endurance_total_time_1hour',
    title: 'Час в игре',
    description: 'Проведите 1 час в игре суммарно',
    icon: '🕐',
    requirement: 3600,
    type: 'endurance'
  },
  {
    id: 'endurance_total_time_2hours',
    title: 'Два часа в игре',
    description: 'Проведите 2 часа в игре суммарно',
    icon: '🕑',
    requirement: 7200,
    type: 'endurance'
  },
  {
    id: 'endurance_comeback_king',
    title: 'Король возвращений',
    description: 'Улучшите рекорд 5 раз',
    icon: '👑',
    requirement: 5,
    type: 'endurance'
  },

  // Достижения за мастерство (10 достижений)
  {
    id: 'mastery_close_call_10',
    title: 'На волоске',
    description: 'Избежьте столкновения 10 раз подряд',
    icon: '😅',
    requirement: 10,
    type: 'mastery'
  },
  {
    id: 'mastery_precision_60s',
    title: 'Точность',
    description: 'Продержитесь 60 секунд без резких движений',
    icon: '🎯',
    requirement: 60,
    type: 'mastery'
  },
  {
    id: 'mastery_edge_walker',
    title: 'Ходок по краю',
    description: 'Проведите 30 секунд у края экрана',
    icon: '🚶',
    requirement: 30,
    type: 'mastery'
  },
  {
    id: 'mastery_center_master',
    title: 'Мастер центра',
    description: 'Проведите 45 секунд в центре экрана',
    icon: '🎪',
    requirement: 45,
    type: 'mastery'
  },
  {
    id: 'mastery_smooth_operator',
    title: 'Плавный оператор',
    description: 'Играйте плавно без рывков 90 секунд',
    icon: '🌊',
    requirement: 90,
    type: 'mastery'
  },
  {
    id: 'mastery_multitasker',
    title: 'Многозадачник',
    description: 'Уклоняйтесь от 5 врагов одновременно',
    icon: '🤹',
    requirement: 5,
    type: 'mastery'
  },
  {
    id: 'mastery_speed_demon',
    title: 'Демон скорости',
    description: 'Двигайтесь на максимальной скорости 20 секунд',
    icon: '💨',
    requirement: 20,
    type: 'mastery'
  },
  {
    id: 'mastery_zen_master',
    title: 'Мастер дзен',
    description: 'Стойте неподвижно 10 секунд среди врагов',
    icon: '🧘',
    requirement: 10,
    type: 'mastery'
  },
  {
    id: 'mastery_corner_escape',
    title: 'Побег из угла',
    description: 'Выберитесь из угла окруженный врагами',
    icon: '🏃‍♂️',
    requirement: 1,
    type: 'mastery'
  },
  {
    id: 'mastery_perfect_circle',
    title: 'Идеальный круг',
    description: 'Двигайтесь по кругу 30 секунд',
    icon: '⭕',
    requirement: 30,
    type: 'mastery'
  },

  // Достижения за удачу (10 достижений)
  {
    id: 'luck_bonus_collector',
    title: 'Коллекционер бонусов',
    description: 'Соберите 10 бонусов за игру',
    icon: '🎁',
    requirement: 10,
    type: 'luck'
  },
  {
    id: 'luck_shield_master',
    title: 'Мастер щита',
    description: 'Используйте щит 5 раз за игру',
    icon: '🛡️',
    requirement: 5,
    type: 'luck'
  },
  {
    id: 'luck_time_lord',
    title: 'Повелитель времени',
    description: 'Соберите 3 бонуса времени за игру',
    icon: '⏰',
    requirement: 3,
    type: 'luck'
  },
  {
    id: 'luck_invisible_man',
    title: 'Человек-невидимка',
    description: 'Будьте невидимым 30 секунд суммарно',
    icon: '👻',
    requirement: 30,
    type: 'luck'
  },
  {
    id: 'luck_giant_mode',
    title: 'Режим гиганта',
    description: 'Будьте увеличенным 45 секунд суммарно',
    icon: '🦣',
    requirement: 45,
    type: 'luck'
  },
  {
    id: 'luck_slow_motion',
    title: 'Замедленная съемка',
    description: 'Замедлите врагов на 60 секунд суммарно',
    icon: '🐌',
    requirement: 60,
    type: 'luck'
  },
  {
    id: 'luck_bonus_chain',
    title: 'Цепочка бонусов',
    description: 'Соберите 3 бонуса подряд за 10 секунд',
    icon: '⛓️',
    requirement: 3,
    type: 'luck'
  },
  {
    id: 'luck_last_second',
    title: 'В последнюю секунду',
    description: 'Соберите бонус за секунду до смерти',
    icon: '⏱️',
    requirement: 1,
    type: 'luck'
  },
  {
    id: 'luck_blessed',
    title: 'Благословенный',
    description: 'Имейте 3 активных бонуса одновременно',
    icon: '✨',
    requirement: 3,
    type: 'luck'
  },
  {
    id: 'luck_fortune_favors',
    title: 'Фортуна благоволит',
    description: 'Соберите бонус в первые 5 секунд игры',
    icon: '🍀',
    requirement: 1,
    type: 'luck'
  }
]
