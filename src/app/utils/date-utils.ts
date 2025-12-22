import { DAYS_OF_WEEK, DayOfWeekCode } from '../models/mobile-post-office.model';
import { inject } from '@angular/core';

/**
 * Convert dayOfWeekCode (1-7) to translated day name
 * 1 = Monday, 7 = Sunday
 */
export function dayOfWeekCodeToName(code: number, translate?: (key: string) => string): string {
  const dayKeys: Record<number, string> = {
    1: 'day.monday',
    2: 'day.tuesday',
    3: 'day.wednesday',
    4: 'day.thursday',
    5: 'day.friday',
    6: 'day.saturday',
    7: 'day.sunday',
  };

  if (translate && dayKeys[code]) {
    return translate(dayKeys[code]);
  }

  // Fallback to English
  const day = DAYS_OF_WEEK.find((d) => d.code === code);
  return day ? day.name : 'Unknown';
}

/**
 * Convert day name to dayOfWeekCode
 */
export function dayNameToCode(name: string): DayOfWeekCode | undefined {
  const day = DAYS_OF_WEEK.find((d) => d.name === name);
  return day?.code;
}

/**
 * Get all day names
 */
export function getAllDayNames(): string[] {
  return DAYS_OF_WEEK.map((d) => d.name);
}

/**
 * Format time from HH:MM to display format
 */
export function formatTime(time: string): string {
  return time; // Already in HH:MM format
}

/**
 * Check if a time is valid HH:MM format
 */
export function isValidTimeFormat(time: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(time);
}
