'use client';

import { useState, useEffect } from 'react';
import type { AdminUser, UserRole, UserStatus } from '@/types';

interface Props {
  user?: AdminUser | null;
  onClose: () => void;
  onSave: (data: Partial<AdminUser> & { password?: string }) => Promise<void>;
  isLoading: boolean;
}

const roles: UserRole[] = ['admin', 'manager', 'viewer'];
const roleLabels: Record<UserRole, string> = { admin: 'Администратор', manager: 'Менеджер', viewer: 'Наблюдатель' };
const statuses: UserStatus[] = ['active', 'inactive', 'blocked'];
const statusLabels: Record<UserStatus, string> = { active: 'Активен', inactive: 'Неактивен', blocked: 'Заблокирован' };

export default function UserModal({ user, onClose, onSave, isLoading }: Props) {
  const isEdit = !!user;
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [role, setRole] = useState<UserRole>(user?.role ?? 'viewer');
  const [status, setStatus] = useState<UserStatus>(user?.status ?? 'active');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (user) { setName(user.name); setEmail(user.email); setRole(user.role); setStatus(user.status); }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ name, email, role, status, ...(!isEdit && { password }) });
  };

  const field = (label: string, el: React.ReactNode) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {el}
    </div>
  );

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{isEdit ? 'Редактировать пользователя' : 'Новый пользователь'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {field('Имя', <input className={inputCls} value={name} onChange={(e) => setName(e.target.value)} required placeholder="Иван Иванов" />)}
          {field('Email', <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="user@zdorov.ru" />)}
          {!isEdit && field('Пароль', <input className={inputCls} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Минимум 6 символов" />)}
          {field('Роль', (
            <select className={inputCls} value={role} onChange={(e) => setRole(e.target.value as UserRole)}>
              {roles.map((r) => <option key={r} value={r}>{roleLabels[r]}</option>)}
            </select>
          ))}
          {isEdit && field('Статус', (
            <select className={inputCls} value={status} onChange={(e) => setStatus(e.target.value as UserStatus)}>
              {statuses.map((s) => <option key={s} value={s}>{statusLabels[s]}</option>)}
            </select>
          ))}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors">Отмена</button>
            <button type="submit" disabled={isLoading} className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg py-2 text-sm font-semibold transition-colors">
              {isLoading ? 'Сохранение...' : isEdit ? 'Сохранить' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
