'use client';

import { useState, useEffect, useCallback } from 'react';
import Button from '@/components/ui/Button';
import MemberList from '@/components/members/MemberList';
import MemberForm from '@/components/members/MemberForm';
import { TeamMember } from '@/lib/types';

export default function MembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const fetchMembers = useCallback(async () => {
    const res = await fetch('/api/members');
    const data = await res.json();
    setMembers(data);
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  function handleAdd() {
    setEditingMember(null);
    setModalOpen(true);
  }

  function handleEdit(member: TeamMember) {
    setEditingMember(member);
    setModalOpen(true);
  }

  async function handleDelete(member: TeamMember) {
    await fetch(`/api/members/${member.id}`, { method: 'DELETE' });
    fetchMembers();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage household members who can be assigned to activities
          </p>
        </div>
        <Button onClick={handleAdd}>Add Member</Button>
      </div>

      <MemberList members={members} onEdit={handleEdit} onDelete={handleDelete} />

      <MemberForm
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={fetchMembers}
        member={editingMember}
      />
    </div>
  );
}
