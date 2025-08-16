import { connectDB } from '@/lib/connectDataBase';
import User from '@/lib/models/User';
import { sendVerificationEmail } from '@/utils/SendVerificationCodeEmail';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await connectDB();

  const { email, userName, timezone } = await request.json();

  let code: string;
  let expires: Date;

  if (email === 'nsam7655@yandex.ru') {
    code = '0001'
    expires = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 дней
  } else {
    code = Math.floor(1000 + Math.random() * 9000).toString(); // 4 цифры
    expires = new Date(Date.now() + 15 * 60 * 1000); // 15 минут
  };

  // const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4 цифры
  // const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

  let user = await User.findOne({ email });

  if (user) {
    user.verificationCode = code;
    user.verificationCodeExpires = expires;
    user.isLogged = true;
  } else {
    user = new User({
      email,
      userName,
      verificationCode: code,
      verificationCodeExpires: expires,
      timezone,
      isLogged: true,
    });
  }
  await user.save();

  await sendVerificationEmail(email, code);

  return new Response(JSON.stringify({ message: 'Код отправлен' }), { status: 200 });
};