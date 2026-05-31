import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center gap-5 p-6 text-center">
      <h1 className="text-4xl font-bold">Mahin AI Platform</h1>
      <p className="text-slate-600 dark:text-slate-300">Professional AI chat for learning, coding, and daily productivity.</p>
      <div className="flex gap-3">
        <Link href="/login" className="rounded bg-brand-500 px-4 py-2 text-white">Login</Link>
        <Link href="/register" className="rounded border px-4 py-2">Create account</Link>
      </div>
      <footer className="mt-8 text-sm text-slate-500">© Mahin AI Developed by Mahin LTD | Developer by Tanvir</footer>
    </main>
  );
}
