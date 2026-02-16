import { NextRequest, NextResponse } from 'next/server';
import { getActivities, saveActivities, getCompletions, saveCompletions } from '@/lib/storage';
import { validateActivity } from '@/lib/validation';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const activities = await getActivities();
  const activity = activities.find(a => a.id === id);
  if (!activity) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
  }
  return NextResponse.json(activity);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const error = validateActivity(body);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const activities = await getActivities();
  const index = activities.findIndex(a => a.id === id);
  if (index === -1) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
  }

  activities[index] = {
    ...activities[index],
    name: body.name.trim(),
    description: body.description ?? activities[index].description,
    assigneeId: body.assigneeId ?? activities[index].assigneeId,
    recurrence: body.recurrence ?? activities[index].recurrence,
    startDate: body.startDate,
    endDate: body.endDate ?? null,
    color: body.color ?? activities[index].color,
    updatedAt: new Date().toISOString(),
  };

  await saveActivities(activities);
  return NextResponse.json(activities[index]);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const activities = await getActivities();
  const filtered = activities.filter(a => a.id !== id);
  if (filtered.length === activities.length) {
    return NextResponse.json({ error: 'Activity not found' }, { status: 404 });
  }
  await saveActivities(filtered);

  // Also remove related completions
  const completions = await getCompletions();
  const filteredCompletions = completions.filter(c => c.activityId !== id);
  await saveCompletions(filteredCompletions);

  return NextResponse.json({ success: true });
}
