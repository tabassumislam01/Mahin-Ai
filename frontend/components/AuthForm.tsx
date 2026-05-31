'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { useAuthStore } from '@/store/auth';

type Props = { mode: 'login' | 'register' };

export default function AuthForm({ mode }: Props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post(`/api/auth/${mode}`, { name, email, password });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      document.cookie = `mahin_token=${data.accessToken}; path=/`;
      setUser(data.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      const message =
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : 'Authentication failed';
      setError(message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-3 rounded-xl bg-white p-6 shadow dark:bg-slate-900" onSubmit={submit}>
      <h1 className="text-xl font-semibold capitalize">{mode}</h1>
      {mode === 'register' && (
        <input className="w-full rounded border p-2" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />
      )}
      <input className="w-full rounded border p-2" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input className="w-full rounded border p-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button disabled={loading} className="w-full rounded bg-brand-500 py-2 text-white disabled:opacity-50">
        {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
      </button>
    </form>
  );
}
