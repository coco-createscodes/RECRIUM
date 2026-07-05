'use client';

import Link from 'next/link';

export default function Navbar({ section }) {
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '1.8rem 3rem',
      background: 'rgba(245,240,232,0.95)',
    }}>
      <Link href="/" style={{
        fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase',
        color: 'rgba(0,0,0,0.4)',
        textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.6rem'
      }}>
        ← Back
      </Link>

      <span style={{
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
        fontSize: '1rem', color: '#4a4a4a', letterSpacing: '0.2em'
      }}>
        {section}
      </span>
    </nav>
  );
}