// src/app/api/get-user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs";

export async function GET(req: NextRequest) {
    const { userId } = auth();
  

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await getUserById(userId);
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
