import { Recurrence } from './types';

const RECURRENCE_VALUES: Recurrence[] = ['none', 'daily', 'weekly', 'monthly'];
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;

export function validateActivity(data: Record<string, unknown>): string | null {
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return 'Name is required';
  }
  if (data.recurrence && !RECURRENCE_VALUES.includes(data.recurrence as Recurrence)) {
    return 'Invalid recurrence value';
  }
  if (!data.startDate || typeof data.startDate !== 'string' || !DATE_REGEX.test(data.startDate)) {
    return 'Valid start date (YYYY-MM-DD) is required';
  }
  if (data.endDate && typeof data.endDate === 'string' && !DATE_REGEX.test(data.endDate)) {
    return 'End date must be YYYY-MM-DD format';
  }
  if (data.color && typeof data.color === 'string' && !COLOR_REGEX.test(data.color)) {
    return 'Color must be a hex color (#RRGGBB)';
  }
  return null;
}

export function validateMember(data: Record<string, unknown>): string | null {
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    return 'Name is required';
  }
  if (data.email && typeof data.email === 'string' && !data.email.includes('@')) {
    return 'Invalid email format';
  }
  if (data.color && typeof data.color === 'string' && !COLOR_REGEX.test(data.color)) {
    return 'Color must be a hex color (#RRGGBB)';
  }
  return null;
}

export function validateCompletion(data: Record<string, unknown>): string | null {
  if (!data.activityId || typeof data.activityId !== 'string') {
    return 'Activity ID is required';
  }
  if (!data.date || typeof data.date !== 'string' || !DATE_REGEX.test(data.date as string)) {
    return 'Valid date (YYYY-MM-DD) is required';
  }
  if (!data.completedBy || typeof data.completedBy !== 'string') {
    return 'Completed by (member ID) is required';
  }
  return null;
}
