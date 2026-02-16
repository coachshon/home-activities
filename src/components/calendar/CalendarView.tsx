'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { EventInput, DateSelectArg, EventClickArg, DatesSetArg } from '@fullcalendar/core';
import ActivityModal from './ActivityModal';
import { ActivityOccurrence, TeamMember } from '@/lib/types';
import { format } from 'date-fns';

export default function CalendarView() {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [occurrences, setOccurrences] = useState<ActivityOccurrence[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedOccurrence, setSelectedOccurrence] = useState<ActivityOccurrence | null>(null);
  const currentRange = useRef<{ start: string; end: string } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const fetchEvents = useCallback(async (start: string, end: string) => {
    const res = await fetch(`/api/activities?start=${start}&end=${end}`);
    const data: ActivityOccurrence[] = await res.json();
    setOccurrences(data);

    const calEvents: EventInput[] = data.map(occ => {
      const member = members.find(m => m.id === occ.activity.assigneeId);
      const title = member
        ? `${occ.activity.name} (${member.name})`
        : occ.activity.name;

      return {
        id: `${occ.activityId}-${occ.date}`,
        title,
        start: occ.date,
        allDay: true,
        backgroundColor: occ.activity.color,
        borderColor: occ.activity.color,
        classNames: occ.completion ? ['completed-event'] : [],
        extendedProps: { occurrence: occ },
      };
    });
    setEvents(calEvents);
  }, [members]);

  const fetchMembers = useCallback(async () => {
    const res = await fetch('/api/members');
    const data = await res.json();
    setMembers(data);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  useEffect(() => {
    if (currentRange.current && members.length >= 0) {
      fetchEvents(currentRange.current.start, currentRange.current.end);
    }
  }, [members, fetchEvents]);

  function handleDatesSet(arg: DatesSetArg) {
    const start = format(arg.start, 'yyyy-MM-dd');
    const end = format(arg.end, 'yyyy-MM-dd');
    currentRange.current = { start, end };
    fetchEvents(start, end);
  }

  function handleDateSelect(arg: DateSelectArg) {
    setSelectedDate(format(arg.start, 'yyyy-MM-dd'));
    setSelectedOccurrence(null);
    setModalOpen(true);
  }

  function handleEventClick(arg: EventClickArg) {
    const occ = arg.event.extendedProps.occurrence as ActivityOccurrence;
    setSelectedOccurrence(occ);
    setSelectedDate(occ.date);
    setModalOpen(true);
  }

  function handleSaved() {
    if (currentRange.current) {
      fetchEvents(currentRange.current.start, currentRange.current.end);
    }
    fetchMembers();
  }

  return (
    <div>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={
          isMobile
            ? { left: 'prev,next', center: 'title', right: '' }
            : { left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }
        }
        selectable
        select={handleDateSelect}
        eventClick={handleEventClick}
        events={events}
        datesSet={handleDatesSet}
        height="auto"
        dayMaxEvents={isMobile ? 2 : 4}
      />
      <ActivityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={handleSaved}
        selectedDate={selectedDate}
        occurrence={selectedOccurrence}
        members={members}
      />
    </div>
  );
}
