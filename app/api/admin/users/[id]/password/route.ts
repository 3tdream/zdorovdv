import { NextRequest, NextResponse } from 'next/server';
import { validateToken, getTokenFromHeader } from '@/lib/admin-auth';
import { adminUsers, ADMIN_CREDENTIALS } from '@/data/admin-users';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = getTokenFromHeader(req.headers.get('authorization'));
  if (!token) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  const caller = validateToken(token);
  if (!caller || caller.role !== 'admin') return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });

  const { id } = await params;
  const user = adminUsers.find((u) => u.id === id);
  if (!user) return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });

  const { password } = await req.json();
  if (!password || password.length < 6) {
    return NextResponse.json({ error: 'Пароль должен быть не менее 6 символов' }, { status: 400 });
  }

  ADMIN_CREDENTIALS[user.email] = password;
  return NextResponse.json({ success: true });
}
