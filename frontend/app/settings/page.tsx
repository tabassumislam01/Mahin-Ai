'use client';

import { FormEvent, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/lib/api';

export default function SettingsPage() {
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [message, setMessage] = useState('');

  async function submit(e: FormEvent) {
    e.preventDefault();
    await api.put('/api/user/profile', { name, avatarUrl });
    setMessage('Profile updated successfully.');
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-4 p-4 md:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
        <h1 className="mb-4 text-2xl font-semibold">Settings</h1>
        <form className="space-y-3" onSubmit={submit}>
          <input className="w-full rounded border p-2" placeholder="Display name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className="w-full rounded border p-2" placeholder="Avatar URL" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
          <button className="rounded bg-brand-500 px-4 py-2 text-white">Save</button>
          {message && <p className="text-green-600">{message}</p>}
        </form>
      </section>
    </main>
  );
}
