'use client';

import Select from '@/components/ui/Select';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { TeamMember, Activity } from '@/lib/types';

interface HistoryFiltersProps {
  members: TeamMember[];
  activities: Activity[];
  memberId: string;
  activityId: string;
  startDate: string;
  endDate: string;
  onMemberChange: (id: string) => void;
  onActivityChange: (id: string) => void;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onClear: () => void;
}

export default function HistoryFilters({
  members, activities,
  memberId, activityId, startDate, endDate,
  onMemberChange, onActivityChange, onStartDateChange, onEndDateChange, onClear,
}: HistoryFiltersProps) {
  const memberOptions = [
    { value: '', label: 'All Members' },
    ...members.map(m => ({ value: m.id, label: m.name })),
  ];

  const activityOptions = [
    { value: '', label: 'All Activities' },
    ...activities.map(a => ({ value: a.id, label: a.name })),
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 px-5 py-4 mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-end gap-4">
        <Select
          id="filter-member"
          label="Member"
          options={memberOptions}
          value={memberId}
          onChange={e => onMemberChange(e.target.value)}
        />
        <Select
          id="filter-activity"
          label="Activity"
          options={activityOptions}
          value={activityId}
          onChange={e => onActivityChange(e.target.value)}
        />
        <Input
          id="filter-start"
          label="From"
          type="date"
          value={startDate}
          onChange={e => onStartDateChange(e.target.value)}
        />
        <Input
          id="filter-end"
          label="To"
          type="date"
          value={endDate}
          onChange={e => onEndDateChange(e.target.value)}
        />
        <Button variant="ghost" size="sm" onClick={onClear}>Clear Filters</Button>
      </div>
    </div>
  );
}
