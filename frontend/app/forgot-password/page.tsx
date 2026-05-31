'use client';

import { FormEvent, useState } from 'react';
import api from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    await api.post('/api/auth/forgot-password', { email });
    setStatus('If the email exists, a reset link has been sent.');
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <form onSubmit={submit} className="space-y-3 rounded-xl bg-white p-6 shadow dark:bg-slate-900">
        <h1 className="text-xl font-semibold">Forgot password</h1>
        <input className="w-full rounded border p-2" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <button className="w-full rounded bg-brand-500 py-2 text-white">Send reset link</button>
        {status && <p className="text-sm text-green-600">{status}</p>}
      </form>
    </main>
  );
}
