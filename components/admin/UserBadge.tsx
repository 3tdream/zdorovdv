import type { UserRole, UserStatus } from '@/types';

const roleLabels: Record<UserRole, string> = {
  admin: 'Администратор',
  manager: 'Менеджер',
  viewer: 'Наблюдатель',
};

const roleColors: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-700',
  manager: 'bg-blue-100 text-blue-700',
  viewer: 'bg-gray-100 text-gray-600',
};

const statusLabels: Record<UserStatus, string> = {
  active: 'Активен',
  inactive: 'Неактивен',
  blocked: 'Заблокирован',
};

const statusColors: Record<UserStatus, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-yellow-100 text-yellow-700',
  blocked: 'bg-red-100 text-red-700',
};

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[role]}`}>
      {roleLabels[role]}
    </span>
  );
}

export function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
