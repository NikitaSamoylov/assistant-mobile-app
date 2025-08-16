import { connectDB } from '@/lib/connectDataBase';
import User from '@/lib/models/User';
import { sendChangeEmailCode } from '@/utils/sendChangeEmailCode';
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  await connectDB();

  const { newEmail, userId } = await request.json();

  const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4 цифры
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

  await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        verificationCode: code,
        verificationCodeExpires: expires,
        emailForChange: newEmail,
      },
    },
    { new: true },
  );

  await sendChangeEmailCode(newEmail, code);

  return new Response(JSON.stringify({ message: 'Код отправлен' }), { status: 200 });
};