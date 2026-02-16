'use client';

import { useState, useEffect } from 'react';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ColorPicker from '@/components/ui/ColorPicker';
import { TeamMember } from '@/lib/types';

interface MemberFormProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  member: TeamMember | null;
}

export default function MemberForm({ open, onClose, onSaved, member }: MemberFormProps) {
  const isEdit = !!member;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (member) {
      setName(member.name);
      setEmail(member.email);
      setColor(member.color);
    } else {
      setName('');
      setEmail('');
      setColor('#3b82f6');
    }
    setError('');
  }, [member, open]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const url = isEdit ? `/api/members/${member!.id}` : '/api/members';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, color }),
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

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? 'Edit Member' : 'Add Member'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm">{error}</div>
        )}

        <Input
          id="member-name"
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          placeholder="e.g. John Doe"
        />

        <Input
          id="member-email"
          label="Email (optional)"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="john@example.com"
        />

        <ColorPicker label="Color" value={color} onChange={setColor} />

        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update' : 'Add Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
