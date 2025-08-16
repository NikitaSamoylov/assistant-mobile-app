/* eslint-disable @typescript-eslint/no-unused-vars */
import { connectDB } from "@/lib/connectDataBase";
import User from "@/lib/models/User";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  const { userId, nextTariff, isNextTariffPayed } = await request.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Без авторизации' }, { status: 400 });
  };

  await connectDB();

  try {
    await User.findByIdAndUpdate(userId, { nextTariff, isNextTariffPayed });
    return NextResponse.json({ message: 'success' }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ message: 'error' }, { status: 500 });
  };
};

export async function PATCH(request: NextRequest) {
  const { userId, nextTariff, isNextTariffPayed, tariff, expired } = await request.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Без авторизации' }, { status: 400 });
  };

  await connectDB();

  try {
    await User.findByIdAndUpdate(userId, {
      nextTariff,
      isNextTariffPayed,
      tariff,
      expired,
    });
    return NextResponse.json({
      message: {
        message: 'success',
        data: {
          expired,
          tariff,
          nextTariff: '',
          isNextTariffPayed,
        }
      }
    }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ message: 'error' }, { status: 500 });
  };
};