export type Recurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Activity {
  id: string;
  name: string;
  description: string;
  assigneeId: string | null;
  recurrence: Recurrence;
  startDate: string; // ISO date string YYYY-MM-DD
  endDate: string | null; // ISO date string YYYY-MM-DD, null = indefinite
  color: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  color: string;
  createdAt: string;
}

export interface Completion {
  id: string;
  activityId: string;
  date: string; // ISO date string YYYY-MM-DD
  completedBy: string; // member id
  completedAt: string; // ISO datetime
  notes: string;
}

// Calendar event representation (activity occurrence for a specific date)
export interface ActivityOccurrence {
  activityId: string;
  date: string;
  activity: Activity;
  completion: Completion | null;
}
