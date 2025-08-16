import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { userId, content } = await request.json();

  if (!userId) {
    return NextResponse.json({ message: "Пользователь не найден" }, { status: 404 });
  };

  const resp = await fetch('https://api.gen-api.ru/api/v1/networks/deepseek-v3', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AI_CHAT_KEY}`
    },
    body: JSON.stringify({
      is_sync: true,
      messages: [{
        role: "user",
        content,
        // content: `Представь ты лучший в мире шеф-повар. Предложи до 4 блюд, включая подробный рецепт, что приготовить, если есть такие продукты: ${userProducts}. Возьми которые нужны из этого списка. Не смешивай сладкое с соленым, например: пряники с колбасой. Не предлагай рецепты, для которых нужны продукты, которых нет в массиве. Уложись в 1600 символов. Рассчитывай на 4 порции. В конце заверши ответ: Рецепты рассчитаны на 4 порции. Приятного аппетита! Не используй в ответе заголовок ингредиенты и не перечисляй ингредиенты. Начни ответ таким образом: С ингредиентами, которые есть у вас, можно приготовить: `,
      }]
    })
  });

  const data = await resp.json();

  return NextResponse.json({ message: data.response[0].choices[0].message.content }, { status: 200 });
};
