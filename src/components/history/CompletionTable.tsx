'use client';

import { Completion, Activity, TeamMember } from '@/lib/types';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface CompletionTableProps {
  completions: Completion[];
  activities: Activity[];
  members: TeamMember[];
  onUncomplete: (completion: Completion) => void;
}

export default function CompletionTable({
  completions, activities, members, onUncomplete,
}: CompletionTableProps) {
  if (completions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No completion records found</p>
        <p className="text-sm mt-1">Complete activities from the calendar to see them here</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Activity
            </th>
            <th className="px-3 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-3 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Completed By
            </th>
            <th className="px-3 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
              Notes
            </th>
            <th className="px-3 sm:px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {completions.map(completion => {
            const activity = activities.find(a => a.id === completion.activityId);
            const member = members.find(m => m.id === completion.completedBy);
            return (
              <tr key={completion.id} className="hover:bg-gray-50">
                <td className="px-3 sm:px-5 py-3 text-sm">
                  <div className="flex items-center gap-2">
                    {activity && (
                      <span
                        className="w-3 h-3 rounded-full inline-block"
                        style={{ backgroundColor: activity.color }}
                      />
                    )}
                    {activity?.name || 'Deleted Activity'}
                  </div>
                </td>
                <td className="px-3 sm:px-5 py-3 text-sm text-gray-600">
                  {completion.date}
                </td>
                <td className="px-3 sm:px-5 py-3 text-sm">
                  {member ? (
                    <Badge label={member.name} color={member.color} />
                  ) : (
                    <span className="text-gray-400">Unknown</span>
                  )}
                </td>
                <td className="px-3 sm:px-5 py-3 text-sm text-gray-600 hidden sm:table-cell">
                  {completion.notes || '-'}
                </td>
                <td className="px-3 sm:px-5 py-3 text-sm">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Remove this completion record?')) {
                        onUncomplete(completion);
                      }
                    }}
                  >
                    Undo
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
