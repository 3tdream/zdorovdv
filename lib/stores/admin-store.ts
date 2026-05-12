import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AdminUser, AdminSession } from '@/types';

interface AdminState {
  session: AdminSession | null;
  users: AdminUser[];
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  fetchUsers: () => Promise<void>;
  createUser: (data: Omit<AdminUser, 'id' | 'createdAt' | 'lastLogin'> & { password: string }) => Promise<boolean>;
  updateUser: (id: string, data: Partial<Pick<AdminUser, 'name' | 'email' | 'role' | 'status'>>) => Promise<boolean>;
  deleteUser: (id: string) => Promise<boolean>;
  resetPassword: (id: string, newPassword: string) => Promise<boolean>;
}

const authHeader = (token: string) => ({ Authorization: `Bearer ${token}` });

export const useAdminStore = create<AdminState>()(
  persist(
    (set, get) => ({
      session: null,
      users: [],
      isLoading: false,
      error: null,

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        const res = await fetch('/api/admin/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) { set({ error: data.error || 'Ошибка входа', isLoading: false }); return false; }
        set({ session: data.session, isLoading: false });
        return true;
      },

      logout: () => set({ session: null, users: [] }),

      fetchUsers: async () => {
        const { session } = get();
        if (!session) return;
        set({ isLoading: true, error: null });
        const res = await fetch('/api/admin/users', { headers: authHeader(session.token) });
        const data = await res.json();
        if (!res.ok) { set({ error: data.error, isLoading: false }); return; }
        set({ users: data.users, isLoading: false });
      },

      createUser: async (userData) => {
        const { session } = get();
        if (!session) return false;
        set({ isLoading: true, error: null });
        const res = await fetch('/api/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...authHeader(session.token) },
          body: JSON.stringify(userData),
        });
        const data = await res.json();
        if (!res.ok) { set({ error: data.error, isLoading: false }); return false; }
        set((s) => ({ users: [...s.users, data.user], isLoading: false }));
        return true;
      },

      updateUser: async (id, userData) => {
        const { session } = get();
        if (!session) return false;
        set({ isLoading: true, error: null });
        const res = await fetch(`/api/admin/users/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', ...authHeader(session.token) },
          body: JSON.stringify(userData),
        });
        const data = await res.json();
        if (!res.ok) { set({ error: data.error, isLoading: false }); return false; }
        set((s) => ({ users: s.users.map((u) => (u.id === id ? data.user : u)), isLoading: false }));
        return true;
      },

      deleteUser: async (id) => {
        const { session } = get();
        if (!session) return false;
        set({ isLoading: true, error: null });
        const res = await fetch(`/api/admin/users/${id}`, {
          method: 'DELETE',
          headers: authHeader(session.token),
        });
        if (!res.ok) { const d = await res.json(); set({ error: d.error, isLoading: false }); return false; }
        set((s) => ({ users: s.users.filter((u) => u.id !== id), isLoading: false }));
        return true;
      },

      resetPassword: async (id, newPassword) => {
        const { session } = get();
        if (!session) return false;
        set({ isLoading: true, error: null });
        const res = await fetch(`/api/admin/users/${id}/password`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', ...authHeader(session.token) },
          body: JSON.stringify({ password: newPassword }),
        });
        const data = await res.json();
        if (!res.ok) { set({ error: data.error, isLoading: false }); return false; }
        set({ isLoading: false });
        return true;
      },
    }),
    { name: 'admin-session', partialize: (s) => ({ session: s.session }) }
  )
);
