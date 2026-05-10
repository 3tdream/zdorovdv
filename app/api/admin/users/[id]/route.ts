import { NextRequest, NextResponse } from 'next/server';
import { validateToken, getTokenFromHeader } from '@/lib/admin-auth';
import { adminUsers, ADMIN_CREDENTIALS } from '@/data/admin-users';

function requireAdmin(req: NextRequest) {
  const token = getTokenFromHeader(req.headers.get('authorization'));
  if (!token) return null;
  const user = validateToken(token);
  if (!user || user.role !== 'admin') return null;
  return user;
}

// PATCH /api/admin/users/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });

  const { id } = await params;
  const idx = adminUsers.findIndex((u) => u.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });

  const body = await req.json();
  const { name, email, role, status } = body;

  if (email && email !== adminUsers[idx].email) {
    if (adminUsers.find((u) => u.email === email)) {
      return NextResponse.json({ error: 'Email уже используется' }, { status: 409 });
    }
    // Move credentials to new email
    ADMIN_CREDENTIALS[email] = ADMIN_CREDENTIALS[adminUsers[idx].email];
    delete ADMIN_CREDENTIALS[adminUsers[idx].email];
  }

  adminUsers[idx] = {
    ...adminUsers[idx],
    ...(name && { name }),
    ...(email && { email }),
    ...(role && { role }),
    ...(status && { status }),
  };

  return NextResponse.json({ user: adminUsers[idx] });
}

// DELETE /api/admin/users/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Нет доступа' }, { status: 403 });

  const { id } = await params;
  if (admin.id === id) return NextResponse.json({ error: 'Нельзя удалить себя' }, { status: 400 });

  const idx = adminUsers.findIndex((u) => u.id === id);
  if (idx === -1) return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 });

  delete ADMIN_CREDENTIALS[adminUsers[idx].email];
  adminUsers.splice(idx, 1);

  return new NextResponse(null, { status: 204 });
}
