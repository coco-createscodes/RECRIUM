'use client';

import Link from 'next/link';

export default function Footer({ switchLink, switchLabel, darkMode }) {
  return (
    <footer style={{
      marginTop: '4rem', padding: '2rem 3rem',
      borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center'
    }}>
      <span style={{
        fontSize: '0.6rem', letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)'
      }}>
        © 2025 Recrium
      </span>
      <Link href={switchLink} style={{
        fontSize: '0.6rem', letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)',
        textDecoration: 'none'
      }}>
        {switchLabel}
      </Link>
    </footer>
  );
}