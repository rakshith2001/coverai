// src/app/api/update-credits/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { updateCredits } from '@/lib/actions/user.actions';

export async function POST(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth || !auth.userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = auth.userId;

  try {
    await updateCredits(userId, -1); // Reduce credits by 1
    return NextResponse.json({ message: 'Credits updated successfully' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
