'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const existing = localStorage.getItem('theme') === 'dark';
    setDark(existing);
    document.documentElement.classList.toggle('dark', existing);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', next);
  };

  return (
    <button onClick={toggle} className="rounded-md border px-3 py-1 text-sm">
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}
