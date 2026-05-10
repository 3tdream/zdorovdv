'use client';

import { useState } from 'react';
import type { AdminUser } from '@/types';

interface Props {
  user: AdminUser;
  onClose: () => void;
  onSave: (password: string) => Promise<void>;
  isLoading: boolean;
}

export default function PasswordModal({ user, onClose, onSave, isLoading }: Props) {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [err, setErr] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setErr('Минимум 6 символов'); return; }
    if (password !== confirm) { setErr('Пароли не совпадают'); return; }
    setErr('');
    await onSave(password);
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500';

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Сброс пароля</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-500">Новый пароль для <span className="font-medium text-gray-800">{user.name}</span></p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Новый пароль</label>
            <input className={inputCls} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Минимум 6 символов" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Подтверждение</label>
            <input className={inputCls} type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required placeholder="Повторите пароль" />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 border border-gray-300 text-gray-700 rounded-lg py-2 text-sm font-medium hover:bg-gray-50 transition-colors">Отмена</button>
            <button type="submit" disabled={isLoading} className="flex-1 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg py-2 text-sm font-semibold transition-colors">
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
