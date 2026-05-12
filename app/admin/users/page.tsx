'use client';

import { useEffect, useState } from 'react';
import { useAdminStore } from '@/lib/stores/admin-store';
import { RoleBadge, StatusBadge } from '@/components/admin/UserBadge';
import UserModal from '@/components/admin/UserModal';
import PasswordModal from '@/components/admin/PasswordModal';
import type { AdminUser } from '@/types';

type ModalState =
  | { kind: 'none' }
  | { kind: 'create' }
  | { kind: 'edit'; user: AdminUser }
  | { kind: 'password'; user: AdminUser };

export default function UsersPage() {
  const { users, isLoading, error, fetchUsers, createUser, updateUser, deleteUser, resetPassword } =
    useAdminStore();
  const [modal, setModal] = useState<ModalState>({ kind: 'none' });

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const close = () => setModal({ kind: 'none' });

  const handleSaveUser = async (data: Partial<AdminUser> & { password?: string }) => {
    if (modal.kind === 'create') {
      const ok = await createUser(data as Parameters<typeof createUser>[0]);
      if (ok) close();
    } else if (modal.kind === 'edit') {
      const ok = await updateUser(modal.user.id, data);
      if (ok) close();
    }
  };

  const handleResetPassword = async (password: string) => {
    if (modal.kind !== 'password') return;
    const ok = await resetPassword(modal.user.id, password);
    if (ok) close();
  };

  const handleDelete = async (e: React.MouseEvent, user: AdminUser) => {
    e.stopPropagation();
    if (!confirm(`Удалить «${user.name}»?`)) return;
    await deleteUser(user.id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900">Пользователи</h1>
          <button
            onClick={() => setModal({ kind: 'create' })}
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Добавить пользователя
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
        {isLoading && users.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 px-6 py-12 text-center text-sm text-gray-400 animate-pulse">
            Загрузка...
          </div>
        )}
        {!isLoading && users.length === 0 && !error && (
          <div className="bg-white rounded-2xl border border-gray-200 py-16 text-center text-sm text-gray-500">
            Пользователей пока нет
          </div>
        )}
        {users.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden divide-y divide-gray-100">
            {users.map((user) => (
              <div
                key={user.id}
                onClick={() => setModal({ kind: 'edit', user })}
                className="group flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold shrink-0">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="hidden sm:flex items-center gap-2">
                  <RoleBadge role={user.role} />
                  <StatusBadge status={user.status} />
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                  <button title="Сбросить пароль" onClick={() => setModal({ kind: 'password', user })} className="p-1.5 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                  </button>
                  <button title="Удалить" onClick={(e) => handleDelete(e, user)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {(modal.kind === 'create' || modal.kind === 'edit') && (
        <UserModal user={modal.kind === 'edit' ? modal.user : null} onClose={close} onSave={handleSaveUser} isLoading={isLoading} />
      )}
      {modal.kind === 'password' && (
        <PasswordModal user={modal.user} onClose={close} onSave={handleResetPassword} isLoading={isLoading} />
      )}
    </div>
  );
}
