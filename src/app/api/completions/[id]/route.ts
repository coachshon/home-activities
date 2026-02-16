import { NextRequest, NextResponse } from 'next/server';
import { getCompletions, saveCompletions } from '@/lib/storage';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const completions = await getCompletions();
  const filtered = completions.filter(c => c.id !== id);
  if (filtered.length === completions.length) {
    return NextResponse.json({ error: 'Completion not found' }, { status: 404 });
  }
  await saveCompletions(filtered);
  return NextResponse.json({ success: true });
}
