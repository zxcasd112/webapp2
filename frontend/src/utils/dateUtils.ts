import { format, parseISO, isValid, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { ru } from 'date-fns/locale';

export const formatDate = (dateString: string, formatString: string = 'PPP') => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(date, formatString, { locale: ru });
  } catch (error) {
    return dateString;
  }
};

export const formatDateTime = (dateString: string) => {
  return formatDate(dateString, "dd MMM yyyy, HH:mm");
};

export const formatTimeAgo = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'только что';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин. назад`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч. назад`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} дн. назад`;

    return formatDate(dateString);
  } catch (error) {
    return dateString;
  }
};

export const getRelativeDate = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;

    const today = startOfWeek(new Date(), { weekStartsOn: 1 });
    const targetDate = startOfWeek(date, { weekStartsOn: 1 });

    const diffDays = Math.floor((targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Завтра';
    if (diffDays === -1) return 'Вчера';
    if (diffDays < 7) return `Через ${diffDays} дней`;
    if (diffDays > -7) return `${Math.abs(diffDays)} дней назад`;

    return formatDate(dateString, "dd MMM");
  } catch (error) {
    return dateString;
  }
};

export const isToday = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return false;
    return format(date, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  } catch (error) {
    return false;
  }
};

export const isTomorrow = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return false;
    return format(addDays(date, 1), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  } catch (error) {
    return false;
  }
};

export const isYesterday = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return false;
    return format(subDays(date, 1), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
  } catch (error) {
    return false;
  }
};

export const getWeekRange = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return { start: '', end: '' };

    const start = startOfWeek(date, { weekStartsOn: 1 });
    const end = endOfWeek(date, { weekStartsOn: 1 });

    return {
      start: format(start, "dd MMM"),
      end: format(end, "dd MMM")
    };
  } catch (error) {
    return { start: '', end: '' };
  }
};

export const getMonthRange = (dateString: string) => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return { start: '', end: '' };

    const start = startOfMonth(date);
    const end = endOfMonth(date);

    return {
      start: format(start, "dd MMM yyyy"),
      end: format(end, "dd MMM yyyy")
    };
  } catch (error) {
    return { start: '', end: '' };
  }
};

export const addDaysToDate = (dateString: string, days: number): string => {
  try {
    const date = parseISO(dateString);
    if (!isValid(date)) return dateString;
    return format(addDays(date, days), "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
  } catch (error) {
    return dateString;
  }
};