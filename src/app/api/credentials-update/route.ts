import { connectDB } from "@/lib/connectDataBase";
import User from "@/lib/models/User";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) { //change user userName
  const dto = await request.json();

  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ message: "Пользователь не авторизован" }, { status: 400 });
  };

  await connectDB();

  await User.findByIdAndUpdate(dto.userId, { userName: dto.userName });
  return NextResponse.json({ message: dto.userName }, { status: 201 });
};