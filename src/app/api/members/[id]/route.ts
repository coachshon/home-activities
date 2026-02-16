import { NextRequest, NextResponse } from 'next/server';
import { getMembers, saveMembers, getActivities, saveActivities } from '@/lib/storage';
import { validateMember } from '@/lib/validation';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const members = await getMembers();
  const member = members.find(m => m.id === id);
  if (!member) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }
  return NextResponse.json(member);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const error = validateMember(body);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const members = await getMembers();
  const index = members.findIndex(m => m.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  members[index] = {
    ...members[index],
    name: body.name.trim(),
    email: body.email ?? members[index].email,
    color: body.color ?? members[index].color,
  };

  await saveMembers(members);
  return NextResponse.json(members[index]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const members = await getMembers();
  const filtered = members.filter(m => m.id !== id);
  if (filtered.length === members.length) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }
  await saveMembers(filtered);

  // Unassign from activities
  const activities = await getActivities();
  let changed = false;
  for (const activity of activities) {
    if (activity.assigneeId === id) {
      activity.assigneeId = null;
      changed = true;
    }
  }
  if (changed) {
    await saveActivities(activities);
  }

  return NextResponse.json({ success: true });
}
