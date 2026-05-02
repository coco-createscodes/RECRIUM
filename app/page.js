'use client';

import { useEffect, useState, useRef } from 'react';

export default function Home() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const [darkMode, setDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

useEffect(() => {
  const saved = localStorage.getItem('theme');
  if (saved === 'light') setDarkMode(false);
  setMounted(true);

  setTimeout(() => {
    document.getElementById('loader').classList.add('hide');
  }, 1800);

  const logoWrap = document.querySelector('.logo-wrap');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const heroH = document.querySelector('.hero').offsetHeight;
    const progress = Math.min(scrollY / heroH, 1);
    logoWrap.style.transform = `translateY(${-progress * 80}px)`;
    logoWrap.style.opacity = 1 - progress * 1.6;
  });
}, []);

useEffect(() => {
  if (!mounted) return;

  const cursor = cursorRef.current;
  const ring = ringRef.current;
  if (!cursor || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;
  let animId;

  const onMouseMove = (e) => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top = my + 'px';
  };
  document.addEventListener('mousemove', onMouseMove);

  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    animId = requestAnimationFrame(animateRing);
  })();

  return () => {
    document.removeEventListener('mousemove', onMouseMove);
    cancelAnimationFrame(animId);
  };
}, [mounted]);

  if (!mounted) return null;

  const dark = {
    bg: '#0a0a0a',
    text: '#ffffff',
    heroBg: '#0a0a0a',
    shopMaleBg: 'linear-gradient(135deg, #0d0d0d 0%, #1a1410 60%, #0a0a0a 100%)',
    shopFemaleBg: 'linear-gradient(225deg, #0a0a0a 0%, #14100f 60%, #0d0d0d 100%)',
    loaderBg: '#0a0a0a',
    dividerBg: '#0a0a0a',
    subText: 'rgba(255,255,255,0.4)',
  };

  const light = {
    bg: '#f5f0e8',
    text: '#0a0a0a',
    heroBg: '#f5f0e8',
    shopMaleBg: 'linear-gradient(135deg, #e8e4dc 0%, #d4d0c8 60%, #f5f0e8 100%)',
    shopFemaleBg: 'linear-gradient(225deg, #f5f0e8 0%, #ece8e0 60%, #e8e4dc 100%)',
    loaderBg: '#f5f0e8',
    dividerBg: '#f5f0e8',
    subText: 'rgba(0,0,0,0.4)',
  };

  const theme = darkMode ? dark : light;

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100vh', cursor: 'none' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        body { font-family: 'Montserrat', sans-serif; font-weight: 200; overflow-x: hidden; }

        .cursor {
          position: fixed; width: 10px; height: 10px;
          background: ${darkMode ? '#ffffff' : '#0a0a0a'};
          border-radius: 50%; pointer-events: none;
          z-index: 99999; transform: translate(-50%, -50%);
        }
        .cursor-ring {
          position: fixed; width: 36px; height: 36px;
          border: 1px solid ${darkMode ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.3)'};
          border-radius: 50%; pointer-events: none;
          z-index: 99998; transform: translate(-50%, -50%);
        }

        .hero {
          position: relative; height: 100vh;
          display: flex; align-items: center;
          justify-content: center; overflow: hidden;
        }
        .hero::before {
          content: ''; position: absolute; inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none; z-index: 3; opacity: 0.6;
        }
        .hero-glow {
          position: absolute; width: 600px; height: 600px; border-radius: 50%;
          background: radial-gradient(circle, rgba(90,90,90,0.12) 0%, transparent 70%);
          top: 50%; left: 50%; transform: translate(-50%, -50%);
          z-index: 1; animation: glowPulse 4s ease-in-out infinite;
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }
        .hero-lines { position: absolute; inset: 0; z-index: 2; pointer-events: none; }
        .hero-lines::before, .hero-lines::after {
          content: ''; position: absolute; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(90,90,90,0.3), transparent);
        }
        .hero-lines::before { top: 30%; }
        .hero-lines::after { bottom: 30%; }

        .logo-wrap {
          position: relative; z-index: 10; text-align: center;
          animation: logoReveal 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0; transform: translateY(40px);
        }
        @keyframes logoReveal { to { opacity: 1; transform: translateY(0); } }
        .logo-img {
          width: min(850px, 95vw); height: auto; display: block; margin: 0 auto 1.5rem;
          filter: brightness(1.05) drop-shadow(0 0 40px rgba(90,90,90,0.3));
        }
        @keyframes fadeIn { to { opacity: 1; } }

        .scroll-hint {
          position: absolute; bottom: 2.5rem; left: 50%;
          transform: translateX(-50%); z-index: 10;
          display: flex; flex-direction: column; align-items: center;
          gap: 0.5rem; opacity: 0; animation: fadeIn 1s 2s ease forwards; cursor: none;
        }
        .scroll-hint span { font-size: 0.6rem; letter-spacing: 0.35em; text-transform: uppercase; color: rgba(128,128,128,0.6); }
        .scroll-arrow {
          width: 1px; height: 50px;
          background: linear-gradient(to bottom, #4a4a4a, transparent);
          animation: scrollLine 2s ease-in-out infinite;
        }
        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        .shop-section { height: 100vh; display: flex; position: relative; overflow: hidden; }
        .shop-side {
          position: relative; flex: 1; display: flex; align-items: center;
          justify-content: center; text-decoration: none; overflow: hidden;
          cursor: none; transition: flex 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .shop-section:hover .shop-side { flex: 0.5; }
        .shop-section .shop-side:hover { flex: 1.6; }
        .side-content { position: relative; z-index: 5; text-align: center; padding: 2rem; }
        .side-label {
          font-family: 'Bebas Neue', cursive; font-size: clamp(3.5rem, 8vw, 7rem);
          letter-spacing: 0.15em; line-height: 1;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s;
        }
        .shop-side:hover .side-label { color: #4a4a4a; transform: scale(1.05); }
        .side-sub {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: clamp(0.9rem, 1.8vw, 1.2rem); letter-spacing: 0.3em;
          text-transform: uppercase; margin-top: 0.8rem; transition: color 0.3s, opacity 0.3s;
        }
        .side-cta {
          display: inline-block; margin-top: 2rem; padding: 0.8rem 2.5rem;
          border: 1px solid rgba(90,90,90,0.4); color: #4a4a4a;
          font-family: 'Montserrat', sans-serif; font-weight: 300;
          font-size: 0.7rem; letter-spacing: 0.4em; text-transform: uppercase;
          text-decoration: none; transition: all 0.4s ease; opacity: 0; transform: translateY(10px);
        }
        .shop-side:hover .side-cta { opacity: 1; transform: translateY(0); background: rgba(90,90,90,0.1); border-color: #4a4a4a; }

        .divider-label {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          z-index: 20; width: 80px; height: 80px; border-radius: 50%;
          border: 1px solid rgba(90,90,90,0.5); display: flex; align-items: center;
          justify-content: center; font-size: 0.55rem; letter-spacing: 0.2em;
          color: #4a4a4a; text-transform: uppercase; pointer-events: none; transition: opacity 0.3s;
        }
        .shop-section:hover .divider-label { opacity: 0; }

        .corner-deco { position: absolute; width: 40px; height: 40px; z-index: 6; pointer-events: none; }
        .corner-deco.tl { top: 2rem; left: 2rem; border-top: 1px solid rgba(128,128,128,0.3); border-left: 1px solid rgba(128,128,128,0.3); }
        .corner-deco.br { bottom: 2rem; right: 2rem; border-bottom: 1px solid rgba(128,128,128,0.3); border-right: 1px solid rgba(128,128,128,0.3); }
        .shop-side::after {
          content: ''; position: absolute; top: -100%; left: -60%; width: 40%; height: 300%;
          background: linear-gradient(105deg, transparent 40%, rgba(90,90,90,0.06) 50%, transparent 60%);
          transform: rotate(15deg); transition: left 0.9s ease; pointer-events: none;
        }
        .shop-side:hover::after { left: 140%; }

        #loader {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 1.5rem;
          transition: opacity 0.6s ease, visibility 0.6s ease;
        }
        #loader.hide { opacity: 0; visibility: hidden; }
        .loader-bar { width: 120px; height: 1px; background: rgba(128,128,128,0.2); position: relative; overflow: hidden; }
        .loader-bar::after {
          content: ''; position: absolute; inset: 0; background: #4a4a4a;
          transform: translateX(-100%); animation: loadBar 1.4s 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        @keyframes loadBar { to { transform: translateX(0); } }

        .bulb-btn {
          position: fixed; top: 1.5rem; right: 2rem; z-index: 10000;
          background: none; border: none; cursor: none; font-size: 1.5rem;
          transform: rotate(180deg); line-height: 1; padding: 0;
        }

        @media (max-width: 640px) {
          .shop-section { flex-direction: column; }
          .shop-side { flex: 1 !important; }
          .shop-section:hover .shop-side { flex: 1 !important; }
          .shop-section .shop-side:hover { flex: 1.4 !important; }
          .divider-label { display: none; }
        }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Bebas+Neue&family=Montserrat:wght@200;300;400&display=swap" rel="stylesheet" />

      {/* Cursor */}
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>

      {/* Loader */}
      <div id="loader" style={{ background: theme.loaderBg }}>
        <div style={{ opacity: 0, animation: 'fadeIn 0.8s 0.3s ease forwards' }}>
          <img width="350" height="200" src="/images/rworded.png" alt="Recrium"
            onError={(e) => { e.target.style.display = 'none'; }}
            style={{ filter: darkMode ? 'none' : 'invert(1)' }}
          />
        </div>
        <div className="loader-bar"></div>
      </div>

      {/* Bulb toggle */}
      <button className="bulb-btn" onClick={() => {
        const next = !darkMode;
        setDarkMode(next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
      }}>
        {darkMode ? '💡' : '🔦'}
      </button>

      {/* Hero */}
      <section className="hero" id="hero" style={{ background: theme.heroBg }}>
        <div style={{ position: 'absolute', top: '1.5rem', left: '2rem', zIndex: 20 }}>
          <img src="/images/silverlogo.png" alt="Recrium"
            style={{ width: '80px', height: 'auto', filter: darkMode ? 'none' : 'invert(1)' }} />
        </div>
        <div className="hero-glow"></div>
        <div className="hero-lines"></div>
        <div className="logo-wrap">
          <img className="logo-img" src="/images/rworldwide.png" alt="Recrium"
            onError={(e) => { e.target.style.display = 'none'; }}
            style={{ filter: darkMode ? 'none' : 'invert(1)' }}
          />
          <div className="logo-text" style={{ display: 'none', color: theme.text }}>RECRIUM</div>
        </div>
        <div className="scroll-hint"
          onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}>
          <span>Explore</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Shop Section */}
      <section className="shop-section" id="shop">
        <a href="/shop-male" className="shop-side" style={{ background: theme.shopMaleBg }}>
          <div className="corner-deco tl"></div>
          <div className="corner-deco br"></div>
          <div className="side-content">
            <div className="side-label" style={{ color: theme.text }}>MEN</div>
            <div className="side-sub" style={{ color: theme.subText }}>New Collection</div>
            <span className="side-cta">Shop Now</span>
          </div>
        </a>

        <div className="divider-label" style={{ background: theme.dividerBg, color: theme.text }}>or</div>

        <a href="/shop-female" className="shop-side"
          style={{ background: theme.shopFemaleBg, borderLeft: '1px solid rgba(90,90,90,0.2)' }}>
          <div className="corner-deco tl"></div>
          <div className="corner-deco br"></div>
          <div className="side-content">
            <div className="side-label" style={{ color: theme.text }}>WOMEN</div>
            <div className="side-sub" style={{ color: theme.subText }}>New Collection</div>
            <span className="side-cta">Shop Now</span>
          </div>
        </a>
      </section>
    </div>
  );
}