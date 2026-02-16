import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { Activity, TeamMember, Completion } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

const locks: Record<string, Promise<void>> = {};

async function withLock<T>(file: string, fn: () => Promise<T>): Promise<T> {
  while (locks[file]) {
    await locks[file];
  }
  let resolve: () => void;
  locks[file] = new Promise<void>((r) => { resolve = r; });
  try {
    return await fn();
  } finally {
    delete locks[file];
    resolve!();
  }
}

async function readJson<T>(filename: string): Promise<T[]> {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeJson<T>(filename: string, data: T[]): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);
  const tmpPath = filePath + '.tmp';
  await writeFile(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
  // Atomic rename
  const { rename } = await import('fs/promises');
  await rename(tmpPath, filePath);
}

// Activities
export async function getActivities(): Promise<Activity[]> {
  return readJson<Activity>('activities.json');
}

export async function saveActivities(activities: Activity[]): Promise<void> {
  return withLock('activities', () => writeJson('activities.json', activities));
}

// Members
export async function getMembers(): Promise<TeamMember[]> {
  return readJson<TeamMember>('members.json');
}

export async function saveMembers(members: TeamMember[]): Promise<void> {
  return withLock('members', () => writeJson('members.json', members));
}

// Completions
export async function getCompletions(): Promise<Completion[]> {
  return readJson<Completion>('completions.json');
}

export async function saveCompletions(completions: Completion[]): Promise<void> {
  return withLock('completions', () => writeJson('completions.json', completions));
}
