import { connectDB } from '@/lib/connectDataBase';
import User from '@/lib/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { UserErrors } from '@/lib/types/customErrors';

export async function PUT(request: NextRequest) {
  await connectDB();
  const { userId, code } = await request.json();

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return new Response(JSON.stringify({ message: 'Пользователь не найден' }), { status: UserErrors.USER_NOT_FOUND });
  }

  if (
    user.verificationCode !== code ||
    user.verificationCodeExpires < new Date()
  ) {
    return new Response(JSON.stringify({ message: 'Некорректный или просроченный код' }), { status: UserErrors.EXPIRED });
  };

  user.emailVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpires = null;
  user.email = user.emailForChange;
  user.emailForChange = '';
  await user.save();

  return NextResponse.json({ message: user.email }, { status: 201 });
};

export async function DELETE(request: NextRequest) { //сброс данных при отмене замены email
  const { userId } = await request.json();

  await connectDB();

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return new Response(JSON.stringify({ message: 'Пользователь не найден' }), { status: UserErrors.USER_NOT_FOUND });
  };

  user.emailVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpires = null;
  user.email = user.email;
  user.emailForChange = '';
  await user.save();

  return NextResponse.json({ message: user.email }, { status: 201 });
};