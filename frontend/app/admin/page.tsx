'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import api from '@/lib/api';

export default function AdminPage() {
  const [analytics, setAnalytics] = useState<{ users: number; conversations: number; messages: number } | null>(null);

  useEffect(() => {
    api.get('/api/admin/analytics').then((res) => setAnalytics(res.data)).catch(() => setAnalytics(null));
  }, []);

  return (
    <main className="mx-auto grid max-w-6xl gap-4 p-4 md:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
        <h1 className="mb-4 text-2xl font-semibold">Admin Dashboard</h1>
        {analytics ? (
          <div className="grid gap-3 sm:grid-cols-3">
            <Card title="Users" value={analytics.users} />
            <Card title="Conversations" value={analytics.conversations} />
            <Card title="Messages" value={analytics.messages} />
          </div>
        ) : (
          <p className="text-slate-600">Admin metrics unavailable. Ensure you are logged in as admin.</p>
        )}
      </section>
    </main>
  );
}

function Card({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded border p-4">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
