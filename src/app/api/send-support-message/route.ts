import { connectDB } from '@/lib/connectDataBase';
import { sendSupportMsg } from '@/utils/sendSupportMsg';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  await connectDB();

  const { email, userName, message, theme } = await request.json();

  if (!email || !message) {
    return NextResponse.json({ message: 'Введите email или сообщение' }, { status: 400 })
  };

  await sendSupportMsg(email, userName, message, theme);

  return new Response(JSON.stringify({ message: 'Сообщение отправено' }), { status: 200 });
};