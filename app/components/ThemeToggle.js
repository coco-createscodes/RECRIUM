'use client';

import { useState } from 'react';

export default function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') !== 'light';
    }
    return true;
  });

  return (
    <button
      onClick={() => {
        const next = !darkMode;
        setDarkMode(next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
      }}
      style={{
        position: 'fixed', top: '1.5rem', right: '2rem',
        zIndex: 1000, background: 'none', border: 'none',
        cursor: 'pointer', fontSize: '1.5rem',
        transform: 'rotate(180deg)', padding: 0,
      }}
    >
      {darkMode ? '💡' : '🔦'}
    </button>
  );
}
