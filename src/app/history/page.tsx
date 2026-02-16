'use client';

import { useState, useEffect, useCallback } from 'react';
import HistoryFilters from '@/components/history/HistoryFilters';
import CompletionTable from '@/components/history/CompletionTable';
import { Completion, Activity, TeamMember } from '@/lib/types';

export default function HistoryPage() {
  const [completions, setCompletions] = useState<Completion[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [memberId, setMemberId] = useState('');
  const [activityId, setActivityId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchCompletions = useCallback(async () => {
    const params = new URLSearchParams();
    if (memberId) params.set('memberId', memberId);
    if (activityId) params.set('activityId', activityId);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);
    const res = await fetch(`/api/completions?${params}`);
    const data = await res.json();
    setCompletions(data);
  }, [memberId, activityId, startDate, endDate]);

  const fetchMeta = useCallback(async () => {
    const [actRes, memRes] = await Promise.all([
      fetch('/api/activities'),
      fetch('/api/members'),
    ]);
    setActivities(await actRes.json());
    setMembers(await memRes.json());
  }, []);

  useEffect(() => {
    fetchMeta();
  }, [fetchMeta]);

  useEffect(() => {
    fetchCompletions();
  }, [fetchCompletions]);

  async function handleUncomplete(completion: Completion) {
    await fetch(`/api/completions/${completion.id}`, { method: 'DELETE' });
    fetchCompletions();
  }

  function handleClearFilters() {
    setMemberId('');
    setActivityId('');
    setStartDate('');
    setEndDate('');
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Completion History</h1>
        <p className="text-sm text-gray-500 mt-1">
          View and filter all completed activities
        </p>
      </div>

      <HistoryFilters
        members={members}
        activities={activities}
        memberId={memberId}
        activityId={activityId}
        startDate={startDate}
        endDate={endDate}
        onMemberChange={setMemberId}
        onActivityChange={setActivityId}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onClear={handleClearFilters}
      />

      <CompletionTable
        completions={completions}
        activities={activities}
        members={members}
        onUncomplete={handleUncomplete}
      />
    </div>
  );
}
