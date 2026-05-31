'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/chat', label: 'Chat' },
  { href: '/settings', label: 'Settings' },
  { href: '/admin', label: 'Admin' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-full rounded-xl bg-white p-4 shadow dark:bg-slate-900 md:w-64">
      <p className="mb-4 text-lg font-bold">Mahin AI</p>
      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block rounded px-3 py-2 text-sm ${pathname === link.href ? 'bg-brand-500 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
