'use client';

import CalendarView from '@/components/calendar/CalendarView';

export default function HomePage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
        <p className="text-sm text-gray-500 mt-1">
          Click a date to add an activity, or click an event to edit it
        </p>
      </div>
      <CalendarView />
    </div>
  );
}
