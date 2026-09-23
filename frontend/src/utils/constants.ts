export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/',
  EVENTS: '/events',
  NOTES: '/notes',
  HABITS: '/habits',
  PROFILE: '/profile',
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/login',
    REGISTER: '/api/register',
    LOGOUT: '/api/logout',
    USER: '/api/user',
  },
  EVENTS: '/api/events',
  NOTES: '/api/notes',
  HABITS: {
    BASE: '/api/habits',
    TRACKING: '/api/habit-tracking',
  },
} as const;

export const EVENT_TYPES = [
  { value: 'personal', label: 'Личное', icon: '❤️' },
  { value: 'work', label: 'Работа', icon: '💼' },
  { value: 'health', label: 'Здоровье', icon: '💪' },
  { value: 'learning', label: 'Обучение', icon: '📚' },
  { value: 'spiritual', label: 'Духовное', icon: '🔮' },
  { value: 'creative', label: 'Творческое', icon: '🎨' },
  { value: 'social', label: 'Социальное', icon: '👥' },
  { value: 'financial', label: 'Финансовое', icon: '💰' },
] as const;

export const HABIT_FREQUENCIES = [
  { value: 'daily', label: 'Ежедневно' },
  { value: 'weekly', label: 'Еженедельно' },
  { value: 'monthly', label: 'Ежемесячно' },
  { value: 'custom', label: 'Пользовательский' },
] as const;

export const ICON_OPTIONS = [
  '🎯', '💼', '❤️', '📚', '💪', '🎉', '✈️', '💰', '🔮', '🧙‍♂️',
  '⚔️', '🛡️', '🧪', '🌿', '🔥', '💧', '🌍', '💨', '👁️', '👂',
  '🌙', '☀️', '⭐', '🌟', '💫', '🕯️', '📿', '🧘‍♀️', '🍃', '🐺'
] as const;

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  THEME: 'theme',
} as const;

export const APP_CONFIG = {
  PAGE_SIZE: 10,
  MAX_TAG_LENGTH: 20,
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MIN_PASSWORD_LENGTH: 6,
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in ms
} as const;

export const MESSAGES = {
  SUCCESS: {
    EVENT_CREATED: 'Квест успешно создан',
    EVENT_UPDATED: 'Квест успешно обновлен',
    EVENT_DELETED: 'Квест успешно удален',
    NOTE_CREATED: 'Запись успешно создана',
    NOTE_UPDATED: 'Запись успешно обновлена',
    NOTE_DELETED: 'Запись успешно удалена',
    HABIT_CREATED: 'Привычка успешно создана',
    HABIT_UPDATED: 'Привычка успешно обновлена',
    HABIT_DELETED: 'Привычка успешно удалена',
    LOGIN: 'Вы успешно вошли в систему',
    LOGOUT: 'Вы успешно вышли из системы',
    REGISTER: 'Регистрация прошла успешно',
  },
  ERROR: {
    NETWORK: 'Ошибка сети. Пожалуйста, проверьте подключение.',
    UNAUTHORIZED: 'Сессия истекла. Пожалуйста, войдите снова.',
    FORBIDDEN: 'У вас нет прав для выполнения этого действия.',
    NOT_FOUND: 'Запрашиваемый ресурс не найден.',
    SERVER_ERROR: 'Внутренняя ошибка сервера. Пожалуйста, попробуйте позже.',
    VALIDATION: 'Пожалуйста, проверьте введенные данные.',
    EVENT_CREATE_FAILED: 'Не удалось создать квест.',
    EVENT_UPDATE_FAILED: 'Не удалось обновить квест.',
    EVENT_DELETE_FAILED: 'Не удалось удалить квест.',
    NOTE_CREATE_FAILED: 'Не удалось создать запись.',
    NOTE_UPDATE_FAILED: 'Не удалось обновить запись.',
    NOTE_DELETE_FAILED: 'Не удалось удалить запись.',
    HABIT_CREATE_FAILED: 'Не удалось создать привычку.',
    HABIT_UPDATE_FAILED: 'Не удалось обновить привычку.',
    HABIT_DELETE_FAILED: 'Не удалось удалить привычку.',
    LOGIN_FAILED: 'Неверный email или пароль.',
    REGISTER_FAILED: 'Пользователь с таким email уже существует.',
  },
  INFO: {
    EVENT_REMINDER: 'Напоминание о квесте',
    HABIT_REMINDER: 'Напоминание о привычке',
    BACKUP_CREATED: 'Резервная копия создана',
    SYNC_IN_PROGRESS: 'Синхронизация в процессе...',
  },
  CONFIRM: {
    DELETE_EVENT: 'Вы уверены, что хотите удалить этот квест? Это действие нельзя отменить.',
    DELETE_NOTE: 'Вы уверены, что хотите удалить эту запись? Это действие нельзя отменить.',
    DELETE_HABIT: 'Вы уверены, что хотите удалить эту привычку? Это действие нельзя отменить.',
    LOGOUT: 'Вы уверены, что хотите выйти из учетной записи?',
  },
} as const;