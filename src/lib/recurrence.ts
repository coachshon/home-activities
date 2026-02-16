import { addDays, addWeeks, addMonths, parseISO, isBefore, isAfter, isEqual, format } from 'date-fns';
import { Activity, Completion, ActivityOccurrence } from './types';

export function generateOccurrences(
  activity: Activity,
  rangeStart: string,
  rangeEnd: string,
  completions: Completion[]
): ActivityOccurrence[] {
  const start = parseISO(rangeStart);
  const end = parseISO(rangeEnd);
  const activityStart = parseISO(activity.startDate);
  const activityEnd = activity.endDate ? parseISO(activity.endDate) : null;

  const activityCompletions = completions.filter(c => c.activityId === activity.id);

  if (activity.recurrence === 'none') {
    const date = activityStart;
    if ((isBefore(date, start) && !isEqual(date, start)) || isAfter(date, end)) {
      return [];
    }
    if (activityEnd && isAfter(date, activityEnd)) {
      return [];
    }
    const dateStr = format(date, 'yyyy-MM-dd');
    return [{
      activityId: activity.id,
      date: dateStr,
      activity,
      completion: activityCompletions.find(c => c.date === dateStr) || null,
    }];
  }

  const occurrences: ActivityOccurrence[] = [];
  let current = activityStart;

  // Advance to the range start if activity starts before range
  while (isBefore(current, start) && !isEqual(current, start)) {
    current = advance(current, activity.recurrence);
  }

  while (!isAfter(current, end)) {
    if (activityEnd && isAfter(current, activityEnd)) break;

    const dateStr = format(current, 'yyyy-MM-dd');
    occurrences.push({
      activityId: activity.id,
      date: dateStr,
      activity,
      completion: activityCompletions.find(c => c.date === dateStr) || null,
    });

    current = advance(current, activity.recurrence);
  }

  return occurrences;
}

function advance(date: Date, recurrence: string): Date {
  switch (recurrence) {
    case 'daily': return addDays(date, 1);
    case 'weekly': return addWeeks(date, 1);
    case 'monthly': return addMonths(date, 1);
    default: return addDays(date, 1);
  }
}
