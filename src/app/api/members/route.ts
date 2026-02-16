import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getMembers, saveMembers } from '@/lib/storage';
import { validateMember } from '@/lib/validation';

export async function GET() {
  const members = await getMembers();
  return NextResponse.json(members);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const error = validateMember(body);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  const member = {
    id: uuidv4(),
    name: body.name.trim(),
    email: body.email || '',
    color: body.color || '#3b82f6',
    createdAt: new Date().toISOString(),
  };

  const members = await getMembers();
  members.push(member);
  await saveMembers(members);

  return NextResponse.json(member, { status: 201 });
}
