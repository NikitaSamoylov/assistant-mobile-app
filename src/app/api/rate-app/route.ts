import { connectDB } from "@/lib/connectDataBase";
import Rate from "@/lib/models/Rate";
import { TRating } from "@/lib/types/rating";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  const url = new URL(request.url);
  const userId = url.searchParams.get('userId');

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Пользователь не авторизован" }, { status: 401 });
  };

  await connectDB();

  try {
    let rateDoc = await Rate.findOne({});
    if (!rateDoc) {
      return NextResponse.json({ ratings: [] }, { status: 200 });
    };

    const userRating = rateDoc.rating.find((r: TRating) => r.userId === userId);
    if (userRating) {
      return NextResponse.json({ message: userRating }, { status: 200 });
    } else {
      return NextResponse.json({ message: null }, { status: 200 });
    };
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Непредвиденная ошибка" }, { status: 500 });
  };
};

export const POST = async (request: NextRequest) => {
  const rateDto = await request.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Пользователь не авторизован" }, { status: 401 });
  }

  await connectDB();

  try {
    const { userId, rate, message, rateDate } = rateDto;

    // Находим единственный документ
    let rateDoc = await Rate.findOne();

    if (!rateDoc) {
      // Создаем новый документ с оценкой и сообщением
      rateDoc = new Rate({ rating: [{ userId, rate, message, rateDate }] });
      await rateDoc.save();
      return NextResponse.json({ message: "Оценка добавлена" }, { status: 201 });
    };

    // Ищем индекс оценки этого пользователя
    const index = rateDoc.rating.findIndex((r: TRating) => r.userId === userId);

    if (index !== -1) {
      // Обновляем оценку и сообщение
      rateDoc.rating[index].rate = rate;
      rateDoc.rating[index].message = message;
      rateDoc.rating[index].rateDate = rateDate;
    } else {
      // Добавляем новую оценку
      rateDoc.rating.push({ userId, rate, message, rateDate });
    };

    await rateDoc.save();
    return NextResponse.json({ message: "Оценка сохранена" }, { status: 200 });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Непредвиденная ошибка" }, { status: 500 });
  };
};