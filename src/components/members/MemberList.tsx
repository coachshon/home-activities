'use client';

import { TeamMember } from '@/lib/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface MemberListProps {
  members: TeamMember[];
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
}

export default function MemberList({ members, onEdit, onDelete }: MemberListProps) {
  if (members.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No team members yet</p>
        <p className="text-sm mt-1">Add your first household member to get started</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
      {members.map(member => (
        <div key={member.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-5 py-4 gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm"
              style={{ backgroundColor: member.color }}
            >
              {member.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-medium text-gray-900">{member.name}</div>
              {member.email && (
                <div className="text-sm text-gray-500">{member.email}</div>
              )}
            </div>
            <Badge label={member.color} color={member.color} />
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button variant="ghost" size="sm" onClick={() => onEdit(member)}>
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                if (confirm(`Remove ${member.name}?`)) onDelete(member);
              }}
            >
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
