/* eslint-disable @typescript-eslint/no-unused-vars */
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDataBase';

export async function PUT(request: NextRequest) {
  const { userId, subscription, timeToNotify } = await request.json();

  await connectDB();

  try {
    await User.findByIdAndUpdate(userId, { pushSubscription: subscription, timeToNotify });
    return NextResponse.json({ message: subscription }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ message: 'ошибка сервера' }, { status: 500 });
  };
};

export async function DELETE(request: NextRequest) {
  const userId = await request.json();

  await connectDB();

  try {
    await User.findByIdAndUpdate(userId, { pushSubscription: null });
    return NextResponse.json({ message: 'Подписка удалена' }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ message: 'ошибка сервера' }, { status: 500 });
  };
};