'use client';

import { useCart } from './CartContext';

export default function CartButton({ darkMode }) {
  const { count, setIsOpen } = useCart();

  return (
    <button
      onClick={() => setIsOpen(true)}
      style={{
        position: 'fixed', top: '1.5rem', right: '5.5rem', zIndex: 10000,
        background: 'none', border: 'none', cursor: 'none',
        display: 'flex', alignItems: 'center', gap: '0.5rem',
      }}
    >
      {/* Bag icon */}
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={darkMode ? '#ffffff' : '#0a0a0a'} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      {count > 0 && (
        <span style={{
          position: 'absolute', top: '-6px', right: '-8px',
          width: '18px', height: '18px', borderRadius: '50%',
          background: darkMode ? '#ffffff' : '#0a0a0a',
          color: darkMode ? '#0a0a0a' : '#ffffff',
          fontSize: '0.55rem', fontFamily: 'Montserrat, sans-serif',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 400, letterSpacing: 0,
        }}>
          {count > 9 ? '9+' : count}
        </span>
      )}
    </button>
  );
}
