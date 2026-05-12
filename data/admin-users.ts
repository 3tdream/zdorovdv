import type { AdminUser } from '@/types';

// In production replace with a real DB. Passwords are stored as plain text here
// only for demo — use bcrypt in production.
export const ADMIN_CREDENTIALS: Record<string, string> = {
  'admin@zdorov.ru': 'admin123',
  'manager@zdorov.ru': 'manager123',
  'viewer@zdorov.ru': 'viewer123',
};

export const adminUsers: AdminUser[] = [
  {
    id: 'user-1',
    name: 'Администратор',
    email: 'admin@zdorov.ru',
    role: 'admin',
    status: 'active',
    createdAt: '2024-01-01T00:00:00.000Z',
    lastLogin: null,
  },
  {
    id: 'user-2',
    name: 'Менеджер Клиники',
    email: 'manager@zdorov.ru',
    role: 'manager',
    status: 'active',
    createdAt: '2024-03-15T10:00:00.000Z',
    lastLogin: null,
  },
  {
    id: 'user-3',
    name: 'Наблюдатель',
    email: 'viewer@zdorov.ru',
    role: 'viewer',
    status: 'active',
    createdAt: '2024-06-01T09:00:00.000Z',
    lastLogin: null,
  },
];
