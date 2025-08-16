import { connectDB } from "@/lib/connectDataBase";
import User from "@/lib/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest, response: NextResponse) {
  const { userId, timeToNotify } = await request.json();

  await connectDB();

  try {
    await User.findByIdAndUpdate(userId, { timeToNotify });
    return NextResponse.json({ message: 'success' }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: 'error' }, { status: 500 });
  };
};