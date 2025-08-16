import { connectDB } from '@/lib/connectDataBase';
import User from '@/lib/models/User';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await connectDB();

  const { phone, userName, timezone } = await request.json();

  const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4 цифры
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

  let user = await User.findOne({ phone });
  if (user) {
    user.verificationCode = code;
    user.verificationCodeExpires = expires;
    user.isLogged = true;
  } else {
    user = new User({
      phone,
      userName,
      verificationCode: code,
      verificationCodeExpires: expires,
      timezone,
      isLogged: true,
    });
  }
  await user.save();

  const API_KEY_AUTH = process.env.CALL_PHONE_AUTH as string;
  const API_KEY_LOGIN = process.env.CALL_LOGIN as string;
  const API_KEY_PASS = process.env.CALL_PASS as string;

  try {
    const resp = await fetch('https://api3.sms-agent.ru/v2.0/json/send/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': `Basic ${API_KEY_AUTH}`
      },
      body: JSON.stringify({
        login: API_KEY_LOGIN,
        pass: API_KEY_PASS,
        type: 'flashcall',
        payload: [{ phone }],
      })
    });

    const respData = await resp.json();

    const responseData = Array.isArray(respData) ? respData[0] : respData;
    const verificationCode = responseData.code;

    if (user) {
      user.verificationCode = verificationCode;
      await user.save();
    };

    console.log('Ответ API:', respData);
  } catch (error) {
    console.error('Ошибка при отправке SMS:', error);
  };

  return new Response(JSON.stringify({ message: 'Код отправлен' }), { status: 200 });
};

