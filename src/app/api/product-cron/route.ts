import { startCron } from '@/tasks/push-cron';
import { NextResponse } from 'next/server';

export async function POST() {
  await startCron();
  return NextResponse.json({ message: 'Cron endpoint вызван' });
};