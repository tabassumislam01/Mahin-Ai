import Sidebar from '@/components/Sidebar';
import ThemeToggle from '@/components/ThemeToggle';

export default function DashboardPage() {
  return (
    <main className="mx-auto grid max-w-6xl gap-4 p-4 md:grid-cols-[260px_1fr]">
      <Sidebar />
      <section className="rounded-xl bg-white p-6 shadow dark:bg-slate-900">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">User Dashboard</h1>
          <ThemeToggle />
        </div>
        <p className="text-slate-600 dark:text-slate-300">Manage your conversations, profile, and settings from a single place.</p>
      </section>
    </main>
  );
}
