import { format, parseISO } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

/**
 * Formats a given ISO date string into a readable format.
 * @param isoDate - The ISO date string
 * @param dateFormat - Target format (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export const formatDate = (isoDate: string, dateFormat: string = 'MMM dd, yyyy'): string => {
  try {
    return format(parseISO(isoDate), dateFormat);
  } catch (error) {
    return isoDate;
  }
};

/**
 * Truncates text to a specified length and appends an ellipsis.
 * @param text - The text to truncate
 * @param maxLength - Maximum allowed length
 * @returns Truncated text
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Generates a standard UUID v4.
 * @returns A new UUID string
 */
export const generateId = (): string => {
  return uuidv4();
};

/**
 * Debounce utility to limit function execution rate.
 * @param func - Function to debounce
 * @param wait - Delay in milliseconds
 */
export function debounce<T extends (...args: any[]) => void>(func: T, wait: number): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Throttle utility to ensure a function is called at most once in a specified period.
 * @param func - Function to throttle
 * @param limit - Interval in milliseconds
 */
export function throttle<T extends (...args: any[]) => void>(func: T, limit: number): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return function (...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
