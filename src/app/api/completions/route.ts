import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getCompletions, saveCompletions } from '@/lib/storage';
import { validateCompletion } from '@/lib/validation';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const activityId = searchParams.get('activityId');
  const memberId = searchParams.get('memberId');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  let completions = await getCompletions();

  if (activityId) {
    completions = completions.filter(c => c.activityId === activityId);
  }
  if (memberId) {
    completions = completions.filter(c => c.completedBy === memberId);
  }
  if (startDate) {
    completions = completions.filter(c => c.date >= startDate);
  }
  if (endDate) {
    completions = completions.filter(c => c.date <= endDate);
  }

  // Sort by date descending
  completions.sort((a, b) => b.date.localeCompare(a.date));

  return NextResponse.json(completions);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const error = validateCompletion(body);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const completions = await getCompletions();

  // Check if already completed for this activity+date
  const existing = completions.find(
    c => c.activityId === body.activityId && c.date === body.date
  );
  if (existing) {
    return NextResponse.json({ error: 'Already completed for this date' }, { status: 409 });
  }

  const completion = {
    id: uuidv4(),
    activityId: body.activityId,
    date: body.date,
    completedBy: body.completedBy,
    completedAt: new Date().toISOString(),
    notes: body.notes || '',
  };

  completions.push(completion);
  await saveCompletions(completions);

  return NextResponse.json(completion, { status: 201 });
}
