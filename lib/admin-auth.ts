import type { AdminUser } from '@/types';
import { adminUsers, ADMIN_CREDENTIALS } from '@/data/admin-users';

// Simple in-memory token store (replace with JWT/Redis in production)
const activeSessions = new Map<string, { userId: string; expiresAt: number }>();

function generateToken(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function createSession(email: string, password: string): { session: { user: AdminUser; token: string; expiresAt: string } } | null {
  if (ADMIN_CREDENTIALS[email] !== password) return null;
  const user = adminUsers.find((u) => u.email === email);
  if (!user || user.status !== 'active') return null;

  const token = generateToken();
  const expiresAt = Date.now() + 8 * 60 * 60 * 1000; // 8 hours
  activeSessions.set(token, { userId: user.id, expiresAt });

  return {
    session: {
      user: { ...user, lastLogin: new Date().toISOString() },
      token,
      expiresAt: new Date(expiresAt).toISOString(),
    },
  };
}

export function validateToken(token: string): AdminUser | null {
  const entry = activeSessions.get(token);
  if (!entry || Date.now() > entry.expiresAt) {
    activeSessions.delete(token);
    return null;
  }
  return adminUsers.find((u) => u.id === entry.userId) ?? null;
}

export function revokeToken(token: string): void {
  activeSessions.delete(token);
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}
