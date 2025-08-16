import { connectDB } from '@/lib/connectDataBase';
import User from '@/lib/models/User';
import { NextRequest } from 'next/server';
import { sign } from 'jsonwebtoken';
import { UserErrors } from '@/lib/types/customErrors';

export async function POST(request: NextRequest) {
  await connectDB();
  const { email, code } = await request.json();

  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ message: 'Пользователь не найден' }), { status: UserErrors.USER_NOT_FOUND });
  };

  if (
    user.verificationCode !== code ||
    user.verificationCodeExpires < new Date()
  ) {
    return new Response(JSON.stringify({ message: 'Некорректный или просроченный код' }), { status: UserErrors.EXPIRED });
  };

  const secret = process.env.NEXTAUTH_SECRET as string;
  const token = sign({ email: user.email, id: user._id.toString() }, secret, { expiresIn: '70d' });

  user.emailVerified = true;
  user.verificationCode = null;
  user.verificationCodeExpires = null;
  await user.save();

  return new Response(JSON.stringify({ token }), { status: 200 });
};