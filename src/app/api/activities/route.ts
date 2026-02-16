import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getActivities, saveActivities, getCompletions } from '@/lib/storage';
import { generateOccurrences } from '@/lib/recurrence';
import { validateActivity } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get('start');
  const end = searchParams.get('end');

  const activities = await getActivities();

  if (start && end) {
    const completions = await getCompletions();
    const occurrences = activities.flatMap(activity =>
      generateOccurrences(activity, start, end, completions)
    );
    return NextResponse.json(occurrences);
  }

  return NextResponse.json(activities);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const error = validateActivity(body);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const now = new Date().toISOString();
  const activity = {
    id: uuidv4(),
    name: body.name.trim(),
    description: body.description || '',
    assigneeId: body.assigneeId || null,
    recurrence: body.recurrence || 'none',
    startDate: body.startDate,
    endDate: body.endDate || null,
    color: body.color || '#3b82f6',
    createdAt: now,
    updatedAt: now,
  };

  const activities = await getActivities();
  activities.push(activity);
  await saveActivities(activities);

  return NextResponse.json(activity, { status: 201 });
}
