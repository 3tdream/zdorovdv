import { NextRequest, NextResponse } from 'next/server';
import { createSession } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email и пароль обязательны' }, { status: 400 });
  }

  const result = createSession(email, password);
  if (!result) {
    return NextResponse.json({ error: 'Неверный email или пароль' }, { status: 401 });
  }

  return NextResponse.json(result);
}
