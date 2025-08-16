import { connectDB } from '@/lib/connectDataBase';
import User from '@/lib/models/User';
import { NextRequest } from 'next/server';

export async function PUT(request: NextRequest) {
  await connectDB();

  const { newPhone, userId } = await request.json();

  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 минут

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
        payload: [{ phone: newPhone }],
      })
    });

    const respData = await resp.json();

    const responseData = Array.isArray(respData) ? respData[0] : respData;
    const verificationCode = responseData.code;

    await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          verificationCode: verificationCode,
          verificationCodeExpires: expires,
          phoneForChange: newPhone,
        },
      },
      { new: true },
    );

    console.log('Ответ API:', respData);
  } catch (error) {
    console.error('Ошибка при отправке SMS:', error);
  };

  return new Response(JSON.stringify({ message: 'Код отправлен' }), { status: 200 });
};