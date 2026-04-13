'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

export default function ShopFemale() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') !== 'light';
    }
    return true;
  });

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    let mx = 0, my = 0, rx = 0, ry = 0;

    const onMouseMove = (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    };

    document.addEventListener('mousemove', onMouseMove);

    let animId;
    (function animateRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      animId = requestAnimationFrame(animateRing);
    })();

    const expandEls = document.querySelectorAll('.look-item, .look-feature, a, button');
    const onEnter = () => ring.classList.add('expand');
    const onLeave = () => ring.classList.remove('expand');
    expandEls.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });

    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div style={{
      background: darkMode ? '#0a0a0a' : '#f5f0e8',
      color: darkMode ? '#ffffff' : '#0a0a0a',
      minHeight: '100vh',
    }}>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --black: #0a0a0a;
          --gold: #4a4a4a;
          --gold-light: #8a8a8a;
          --white: #ffffff;
          --dim: rgba(255,255,255,0.35);
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--black);
          color: var(--white);
          transition: background 0.3s, color 0.3s;
          font-family: 'Montserrat', sans-serif;
          font-weight: 200;
          overflow-x: hidden;
          cursor: none;
        }

        .cursor {
          position: fixed;
          width: 10px; height: 10px;
          background: var(--gold);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          mix-blend-mode: difference;
        }
        .cursor-ring {
          position: fixed;
          width: 36px; height: 36px;
          border: 1px solid rgba(201,169,110,0.5);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
          transition: width 0.4s, height 0.4s, border-color 0.3s;
        }
        .cursor-ring.expand { width: 70px; height: 70px; border-color: var(--gold); }

        nav {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.8rem 3rem;
          background: linear-gradient(to bottom, rgba(10,10,10,0.95), transparent);
        }

        .nav-back {
          font-size: 0.6rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--dim);
          text-decoration: none;
          transition: color 0.3s;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .nav-back::before { content: '←'; font-size: 0.9rem; }
        .nav-back:hover { color: var(--gold); }

        .nav-logo {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
        }
        .nav-logo img { height: 36px; width: auto; filter: brightness(1.1); }

        .nav-section-label {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 1rem;
          color: var(--gold);
          letter-spacing: 0.2em;
        }

        .page-hero {
          height: 38vh;
          display: flex;
          align-items: flex-end;
          padding: 3rem 3rem;
          position: relative;
          overflow: hidden;
        }

        .page-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 40%, var(--black) 100%);
          z-index: 2;
        }

        .hero-watermark {
          position: absolute;
          top: 50%; left: 50%;
          transform: translate(-50%, -50%) rotate(-8deg);
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(6rem, 18vw, 16rem);
          color: rgba(201,169,110,0.04);
          white-space: nowrap;
          z-index: 1;
          user-select: none;
          letter-spacing: 0.05em;
        }

        .page-hero-content { position: relative; z-index: 3; }

        .page-title {
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(3.5rem, 10vw, 8rem);
          letter-spacing: 0.1em;
          line-height: 0.9;
          color: var(--white);
        }

        .page-subtitle {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(0.9rem, 2vw, 1.15rem);
          color: var(--gold);
          letter-spacing: 0.3em;
          margin-top: 0.8rem;
        }


        .lookbook { padding: 3rem; }

        .look-feature {
          width: 100%;
          margin-bottom: 1.2rem;
          position: relative;
          overflow: hidden;
          display: block;
          text-decoration: none;
          cursor: none;
        }
        .look-feature img {
          width: 100%; height: 65vh; object-fit: cover; display: block;
          transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s;
          filter: brightness(0.88);
        }
        .look-feature:hover img { transform: scale(1.03); filter: brightness(1); }
        .look-feature .look-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,10,10,0.65) 0%, transparent 40%);
          opacity: 0; transition: opacity 0.5s;
          display: flex; align-items: flex-end; padding: 2.5rem;
        }
        .look-feature:hover .look-overlay { opacity: 1; }
        .look-feature::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 0; height: 0;
          border-top: 2px solid var(--gold); border-left: 2px solid var(--gold);
          transition: width 0.4s, height 0.4s; z-index: 5;
        }
        .look-feature:hover::before { width: 40px; height: 40px; }

        .lookbook-grid { columns: 3; column-gap: 1.2rem; }
        @media (max-width: 900px) { .lookbook-grid { columns: 2; } }
        @media (max-width: 540px) {
          .lookbook-grid { columns: 1; }
          .lookbook { padding: 1.5rem; }
          .look-feature img { height: 50vh; }
        }

        .look-item {
          break-inside: avoid;
          margin-bottom: 1.2rem;
          position: relative;
          overflow: hidden;
          cursor: none;
          display: block;
          text-decoration: none;
        }
        .look-item:nth-child(3n+2) { margin-top: 4rem; }
        .look-item:nth-child(3n+3) { margin-top: -2rem; }

        .look-item img {
          width: 100%; height: auto; display: block;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s;
          filter: brightness(0.9);
        }
        .look-item:hover img { transform: scale(1.05); filter: brightness(1.05); }

        .look-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%);
          opacity: 0; transition: opacity 0.5s;
          display: flex; align-items: flex-end; padding: 1.5rem;
        }
        .look-item:hover .look-overlay { opacity: 1; }

        .look-view {
          font-size: 0.6rem; letter-spacing: 0.4em;
          text-transform: uppercase; color: var(--gold);
          border-bottom: 1px solid rgba(201,169,110,0.5);
          padding-bottom: 0.2rem;
        }

        .look-item::before {
          content: ''; position: absolute; top: 0; left: 0;
          width: 0; height: 0;
          border-top: 2px solid var(--gold); border-left: 2px solid var(--gold);
          transition: width 0.4s, height 0.4s; z-index: 5;
        }
        .look-item:hover::before { width: 30px; height: 30px; }

        .look-placeholder {
          background: rgba(255,255,255,0.03);
          border: 1px dashed rgba(201,169,110,0.15);
          aspect-ratio: 3/4;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 0.8rem;
        }
        .look-placeholder.wide { aspect-ratio: 16/7; }

        .ph-icon { font-size: 2rem; opacity: 0.15; }
        .ph-text {
          font-size: 0.55rem; letter-spacing: 0.3em;
          text-transform: uppercase; color: rgba(255,255,255,0.2);
        }

        .look-item, .look-feature {
          opacity: 0; transform: translateY(30px);
          animation: itemReveal 0.7s ease forwards;
        }
        .look-feature       { animation-delay: 0.05s; }
        .look-item:nth-child(1) { animation-delay: 0.12s; }
        .look-item:nth-child(2) { animation-delay: 0.19s; }
        .look-item:nth-child(3) { animation-delay: 0.26s; }
        .look-item:nth-child(4) { animation-delay: 0.33s; }
        .look-item:nth-child(5) { animation-delay: 0.40s; }
        .look-item:nth-child(6) { animation-delay: 0.47s; }
        .look-item:nth-child(7) { animation-delay: 0.54s; }
        .look-item:nth-child(8) { animation-delay: 0.61s; }

        @keyframes itemReveal { to { opacity: 1; transform: translateY(0); } }

        footer {
          margin-top: 4rem; padding: 2rem 3rem;
          border-top: 1px solid rgba(201,169,110,0.1);
          display: flex; justify-content: space-between; align-items: center;
        }
        footer span {
          font-size: 0.6rem; letter-spacing: 0.3em;
          text-transform: uppercase; color: rgba(255,255,255,0.2);
        }
        .footer-switch {
          font-size: 0.6rem; letter-spacing: 0.3em;
          text-transform: uppercase; color: var(--dim);
          text-decoration: none; transition: color 0.3s;
        }
        .footer-switch:hover { color: var(--gold); }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=Bebas+Neue&family=Montserrat:wght@200;300;400&display=swap" rel="stylesheet" />

      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>

      <nav>
        <Link href="/" className="nav-back">Back</Link>
        <div className="nav-logo">
          <img src="/images/rworded.png" width="100" height="70" alt="Recrium" />
        </div>
        <span className="nav-section-label">Women</span>
      </nav>

      <div className="page-hero">
        <img src="/images/silverlogo.png" alt="Recrium" style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'min(500px, 60vw)', opacity:0.06, zIndex:1}} />
        <div className="hero-watermark">Femme</div>
        <div className="page-hero-content">
          <div className="page-title">FEMALE</div>
          <div className="page-subtitle">Current Collection</div>
        </div>
      </div>


      <div className="lookbook">
        <div className="look-feature look-placeholder wide">
          <div className="ph-icon">+</div>
          <div className="ph-text">Add Featured Product Image</div>
        </div>

        <div className="lookbook-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="look-item look-placeholder">
              <div className="ph-icon">+</div>
              <div className="ph-text">Add Product Image</div>
            </div>
          ))}
        </div>
      </div>

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

      <footer>
        <span>© 2025 Recrium</span>
        <Link href="/shop-male" className="footer-switch">Switch to Men →</Link>
      </footer>
    </div>
  );
}