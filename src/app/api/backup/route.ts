import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/utils/authOptions';
import { connectDB } from '@/lib/connectDataBase';
import Backup from '@/lib/models/Backup';
import User from '@/lib/models/User';

export const POST = async (request: NextRequest) => {
  const { userId, existingProducts, toBuyProducts } = await request.json();

  const session = await getServerSession(authOptions);
  if (!session || session.user.id !== userId) {
    return NextResponse.json({ message: "Пользователь не авторизован" }, { status: 401 });
  };

  await connectDB();

  try {
    // Пытаемся найти существующий бэкап пользователя
    const existingBackup = await Backup.findOne({ userId });

    if (existingBackup) {
      // Обновляем backup
      existingBackup.backup.existingProducts = existingProducts;
      existingBackup.backup.toBuyProducts = toBuyProducts;
      await existingBackup.save();
    } else {
      // Создаем новый документ
      await Backup.create({
        userId,
        backup: {
          existingProducts,
          toBuyProducts,
        },
      });
    }

    return NextResponse.json(
      {
        message: 'Бэкап успешно сохранён',
        backup: {
          existingProducts,
          toBuyProducts,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Ошибка при сохранении бэкапа:', error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  };
};

export const GET = async (request: NextRequest) => {
  const userId = request.nextUrl.searchParams.get("userId");

  const session = await getServerSession(authOptions);
  if (!session || !userId) {
    return NextResponse.json({ message: "Пользователь не авторизован" }, { status: 401 });
  };

  await connectDB();

  try {
    // Пытаемся найти существующий бэкап пользователя
    const existingBackup = await Backup.findOne({ userId });

    if (existingBackup) {
      return NextResponse.json({ message: existingBackup }, { status: 200 });
    } else {
      return NextResponse.json({ message: null }, { status: 200 });
    };
  } catch (error) {
    console.error('Ошибка запроса:', error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  };
};

export const DELETE = async (request: NextRequest) => {
  const { userId } = await request.json();

  const session = await getServerSession(authOptions);
  if (!session || !userId) {
    return NextResponse.json({ message: "Пользователь не авторизован" }, { status: 401 });
  };

  await connectDB();

  try {
    await User.findByIdAndDelete(userId);
    const deleteResult = await Backup.deleteOne({ userId });

    if (deleteResult.deletedCount === 1) {
      return NextResponse.json({ message: "deleted" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "deleted" }, { status: 200 });
    }
  } catch (error) {
    console.error('Ошибка при удалении бэкапа:', error);
    return NextResponse.json({ message: "Ошибка сервера" }, { status: 500 });
  };
};