import { NextRequest, NextResponse } from 'next/server';
import { validateToken, getTokenFromHeader } from '@/lib/admin-auth';
import { adminUsers, ADMIN_CREDENTIALS } from '@/data/admin-users';
import type { AdminUser } from '@/types';

function requireAdmin(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get('authorization'));
  if (!token) return null;
  const user = validateToken(token);
  if (!user || user.role !== 'admin') return null;
  return user;
}

// GET /api/admin/users — list all users (admin + manager)
export async function GET(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get('authorization'));
  if (!token) return NextResponse.json({ error: 'Не авторизован' }, { status: 401 });
  const user = validateToken(token);
  if (!user) return NextResponse.json({ error: 'Сессия истекла' }, { status: 401 });
  if (user.role === 'viewer') return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });

  return NextResponse.json({ users: adminUsers });
}

// POST /api/admin/users — create user (admin only)
export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });

  const body = await req.json();
  const { name, email, role, status, password } = body;

  if (!name || !email || !role || !password) {
    return NextResponse.json({ error: 'Заполните все обязательные поля' }, { status: 400 });
  }
  if (adminUsers.find((u) => u.email === email)) {
    return NextResponse.json({ error: 'Пользователь с таким email уже существует' }, { status: 409 });
  }

  const newUser: AdminUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    role,
    status: status ?? 'active',
    createdAt: new Date().toISOString(),
    lastLogin: null,
  };

  adminUsers.push(newUser);
  ADMIN_CREDENTIALS[email] = password;

  return NextResponse.json({ user: newUser }, { status: 201 });
}
