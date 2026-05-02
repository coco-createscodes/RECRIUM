'use client';

export default function ThemeToggle({ darkMode, setDarkMode }) {
  return (
    <button
      onClick={() => {
        const next = !darkMode;
        setDarkMode(next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
      }}
      style={{
        position: 'fixed', top: '1.5rem', left: '9rem',
        zIndex: 1000, background: 'none', border: 'none',
        cursor: 'pointer', fontSize: '1.5rem',
        transform: 'rotate(180deg)', padding: 0,
      }}
    >
      {darkMode ? '💡' : '🔦'}
    </button>
  );
}