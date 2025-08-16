/* eslint-disable @typescript-eslint/no-unused-vars */
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/connectDataBase';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ message: 'Пользователь не найден' }, { status: 404 });
  };

  await connectDB();

  try {
    const foundedUser = await User.findOne({ _id: userId });
    return NextResponse.json({ message: foundedUser }, { status: 201 });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: unknown) {
    return NextResponse.json({ message: 'ошибка сервера' }, { status: 500 });
  };
};

//========================= update tariff

export async function PUT(request: NextRequest) {
  const { userId, tariff, expired, isLogged } = await request.json();

  await connectDB();

  if (isLogged === false) {
    try {
      await User.findByIdAndUpdate(userId, { isLogged });
      return NextResponse.json({ message: 'success' }, { status: 201 });
    } catch (err: unknown) {
      return NextResponse.json({ message: 'error' }, { status: 500 });
    };
  } else {
    try {
      await User.findByIdAndUpdate(userId, { tariff, expired });
      return NextResponse.json({ message: 'success' }, { status: 201 });
    } catch (err: unknown) {
      return NextResponse.json({ message: 'error' }, { status: 500 });
    };
  };
};