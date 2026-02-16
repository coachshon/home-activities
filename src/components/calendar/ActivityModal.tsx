'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import ColorPicker from '@/components/ui/ColorPicker';
import { Activity, TeamMember, ActivityOccurrence } from '@/lib/types';

interface ActivityModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  selectedDate: string | null;
  occurrence: ActivityOccurrence | null;
  members: TeamMember[];
}

export default function ActivityModal({
  open, onClose, onSaved, selectedDate, occurrence, members,
}: ActivityModalProps) {
  const isEdit = !!occurrence;
  const activity = occurrence?.activity;

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [recurrence, setRecurrence] = useState('none');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (activity) {
      setName(activity.name);
      setDescription(activity.description);
      setAssigneeId(activity.assigneeId || '');
      setRecurrence(activity.recurrence);
      setStartDate(activity.startDate);
      setEndDate(activity.endDate || '');
      setColor(activity.color);
    } else {
      setName('');
      setDescription('');
      setAssigneeId('');
      setRecurrence('none');
      setStartDate(selectedDate || '');
      setEndDate('');
      setColor('#3b82f6');
    }
    setError('');
  }, [activity, selectedDate, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const body = {
      name, description, assigneeId: assigneeId || null,
      recurrence, startDate, endDate: endDate || null, color,
    };

    try {
      const url = isEdit ? `/api/activities/${activity!.id}` : '/api/activities';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to save');
        return;
      }
      onSaved();
      onClose();
    } catch {
      setError('Network error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!activity || !confirm('Delete this activity and all its completions?')) return;
    setSaving(true);
    try {
      await fetch(`/api/activities/${activity.id}`, { method: 'DELETE' });
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleComplete() {
    if (!occurrence) return;
    setSaving(true);
    try {
      if (occurrence.completion) {
        await fetch(`/api/completions/${occurrence.completion.id}`, { method: 'DELETE' });
      } else {
        const completedBy = assigneeId || members[0]?.id;
        if (!completedBy) {
          setError('No team member to mark as completer. Add a team member first.');
          setSaving(false);
          return;
        }
        await fetch('/api/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            activityId: occurrence.activityId,
            date: occurrence.date,
            completedBy,
          }),
        });
      }
      onSaved();
      onClose();
    } finally {
      setSaving(false);
    }
  }

  const memberOptions = [
    { value: '', label: 'Unassigned' },
    ...members.map(m => ({ value: m.id, label: m.name })),
  ];

  const recurrenceOptions = [
    { value: 'none', label: 'One-time' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
  ];

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Activity' : 'New Activity'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
        )}

        <Input
          id="activity-name"
          label="Activity Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="e.g. Vacuum living room"
        />

        <div className="space-y-1">
          <label htmlFor="activity-desc" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="activity-desc"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Optional description..."
          />
        </div>

        <Select
          id="activity-assignee"
          label="Assigned To"
          options={memberOptions}
          value={assigneeId}
          onChange={e => setAssigneeId(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            id="activity-recurrence"
            label="Recurrence"
            options={recurrenceOptions}
            value={recurrence}
            onChange={e => setRecurrence(e.target.value)}
          />
          <Input
            id="activity-start"
            label="Start Date"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />
        </div>

        <Input
          id="activity-end"
          label="End Date (optional)"
          type="date"
          value={endDate}
          onChange={e => setEndDate(e.target.value)}
        />

        <ColorPicker label="Color" value={color} onChange={setColor} />

        <div className="flex items-center gap-2 pt-2 border-t">
          {isEdit && (
            <>
              <Button
                type="button"
                variant={occurrence?.completion ? 'secondary' : 'primary'}
                size="sm"
                onClick={handleToggleComplete}
                disabled={saving}
              >
                {occurrence?.completion ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                onClick={handleDelete}
                disabled={saving}
              >
                Delete
              </Button>
            </>
          )}
          <div className="flex-1" />
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
