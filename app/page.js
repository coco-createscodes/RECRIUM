'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
   setTimeout(() => {
  document.getElementById('loader').classList.add('hide');
}, 1800);

    // Parallax-ish: logo drifts slightly on scroll within hero
    const logoWrap = document.querySelector('.logo-wrap');
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroH = document.querySelector('.hero').offsetHeight;
      const progress = Math.min(scrollY / heroH, 1);
      logoWrap.style.transform = `translateY(${-progress * 80}px)`;
      logoWrap.style.opacity = 1 - progress * 1.6;
    });
   // toggle light/dark mode
    const toggle = document.getElementById('theme-toggle');
    toggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
     });

  }, []);

  return (
    <>
      <style>{`
        *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

        :root {
          --cream: #f5f0e8;
          --black: #0a0a0a;
          --gold: #4a4a4a;
          --gold-light: #8a8a8a;
          --white: #ffffff;
        }

        html { scroll-behavior: smooth; }

        body {
          background: var(--black);
          color: var(--white);
          font-family: 'Montserrat', sans-serif;
          font-weight: 200;
          overflow-x: hidden;
        }

        body.light-mode {
         background: #f5f5f5;
         color: #0a0a0a;
        }

        .theme-toggle {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 999;
          background: none;
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 0.5rem 1rem;
          font-size: 0.6rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          cursor: pointer;
        }

        body.light-mode .theme-toggle {
          border-color: rgba(0,0,0,0.3);
          color: #0a0a0a;
        }

        .hero {
          position: relative;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background: var(--black);
        }

        .hero::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 3;
          opacity: 0.6;
        }

        .hero-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,110,0.12) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1;
          animation: glowPulse 4s ease-in-out infinite;
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.6; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        }

        .hero-lines {
          position: absolute;
          inset: 0;
          z-index: 2;
          pointer-events: none;
        }
        .hero-lines::before, .hero-lines::after {
          content: '';
          position: absolute;
          left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,169,110,0.3), transparent);
        }
        .hero-lines::before { top: 30%; }
        .hero-lines::after { bottom: 30%; }

        .logo-wrap {
          position: relative;
          z-index: 10;
          text-align: center;
          animation: logoReveal 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
          transform: translateY(40px);
        }

        @keyframes logoReveal {
          to { opacity: 1; transform: translateY(0); }
        }

        .logo-img {
          width: min(850px, 95vw);
          height: auto;
          display: block;
          margin: 0 auto 1.5rem;
          filter: brightness(1.05) drop-shadow(0 0 40px rgba(201,169,110,0.3));
        }

        .logo-text {
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(4rem, 14vw, 10rem);
          letter-spacing: 0.25em;
          color: var(--white);
          line-height: 1;
          text-shadow: 0 0 80px rgba(201,169,110,0.4);
        }

        .logo-tagline {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-weight: 300;
          font-size: clamp(0.85rem, 2vw, 1.1rem);
          color: var(--gold);
          letter-spacing: 0.4em;
          text-transform: uppercase;
          margin-top: 0.5rem;
          opacity: 0;
          animation: fadeIn 1s 1.2s ease forwards;
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        .scroll-hint {
          position: absolute;
          bottom: 2.5rem;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          opacity: 0;
          animation: fadeIn 1s 2s ease forwards;
          cursor: pointer;
        }

        .scroll-hint span {
          font-size: 0.6rem;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }

        .scroll-arrow {
          width: 1px;
          height: 50px;
          background: linear-gradient(to bottom, var(--gold), transparent);
          animation: scrollLine 2s ease-in-out infinite;
        }

        @keyframes scrollLine {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        .shop-section {
          height: 100vh;
          display: flex;
          position: relative;
          overflow: hidden;
        }

        .shop-side {
          position: relative;
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
          overflow: hidden;
          cursor: pointer;
          transition: flex 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .shop-section:hover .shop-side { flex: 0.5; }
        .shop-section .shop-side:hover { flex: 1.6; }

        .shop-male {
          background: linear-gradient(135deg, #0d0d0d 0%, #1a1410 60%, #0a0a0a 100%);
        }

        .shop-male::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            linear-gradient(135deg, rgba(201,169,110,0.05) 0%, transparent 60%),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 40px,
              rgba(201,169,110,0.02) 40px,
              rgba(201,169,110,0.02) 41px
            );
        }

        .shop-female {
          background: linear-gradient(225deg, #0a0a0a 0%, #14100f 60%, #0d0d0d 100%);
          border-left: 1px solid rgba(201,169,110,0.2);
        }

        .shop-female::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(225deg, rgba(201,169,110,0.07) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 80%, rgba(201,169,110,0.04) 0%, transparent 60%);
        }

        .side-content {
          position: relative;
          z-index: 5;
          text-align: center;
          padding: 2rem;
        }

        .side-label {
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(3.5rem, 8vw, 7rem);
          letter-spacing: 0.15em;
          color: var(--white);
          line-height: 1;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), color 0.3s;
        }

        .shop-side:hover .side-label {
          color: var(--gold);
          transform: scale(1.05);
        }

        .side-sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: clamp(0.9rem, 1.8vw, 1.2rem);
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin-top: 0.8rem;
          transition: color 0.3s, opacity 0.3s;
        }

        .shop-side:hover .side-sub {
          color: var(--gold-light);
          opacity: 1;
        }

        .side-cta {
          display: inline-block;
          margin-top: 2rem;
          padding: 0.8rem 2.5rem;
          border: 1px solid rgba(201,169,110,0.4);
          color: var(--gold);
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: 0.7rem;
          letter-spacing: 0.4em;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.4s ease;
          opacity: 0;
          transform: translateY(10px);
        }

        .shop-side:hover .side-cta {
          opacity: 1;
          transform: translateY(0);
          background: rgba(201,169,110,0.1);
          border-color: var(--gold);
        }

        .divider-label {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 1px solid rgba(201,169,110,0.5);
          background: var(--black);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.55rem;
          letter-spacing: 0.2em;
          color: var(--gold);
          text-transform: uppercase;
          pointer-events: none;
          transition: opacity 0.3s;
        }

        .shop-section:hover .divider-label { opacity: 0; }

        .corner-deco {
          position: absolute;
          width: 40px;
          height: 40px;
          z-index: 6;
          pointer-events: none;
        }

        .corner-deco.tl { top: 2rem; left: 2rem; border-top: 1px solid rgba(255,255,255,0.3); border-left: 1px solid rgba(255,255,255,0.3); }
        .corner-deco.br { bottom: 2rem; right: 2rem; border-bottom: 1px solid rgba(255,255,255,0.3); border-right: 1px solid rgba(255,255,255,0.3); }

        .shop-side::after {
          content: '';
          position: absolute;
          top: -100%;
          left: -60%;
          width: 40%;
          height: 300%;
          background: linear-gradient(105deg, transparent 40%, rgba(201,169,110,0.06) 50%, transparent 60%);
          transform: rotate(15deg);
          transition: left 0.9s ease;
          pointer-events: none;
        }

        .shop-side:hover::after { left: 140%; }

        #loader {
          position: fixed;
          inset: 0;
          background: var(--black);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 1.5rem;
          transition: opacity 0.6s ease, visibility 0.6s ease;
        }

        #loader.hide { opacity: 0; visibility: hidden; }

        .loader-logo {
          font-family: 'Bebas Neue', cursive;
          font-size: 3rem;
          letter-spacing: 0.5em;
          color: var(--white);
          opacity: 0;
          animation: fadeIn 0.8s 0.3s ease forwards;
        }

        .loader-bar {
          width: 120px;
          height: 1px;
          background: rgba(255,255,255,0.1);
          position: relative;
          overflow: hidden;
        }

        .loader-bar::after {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gold);
          transform: translateX(-100%);
          animation: loadBar 1.4s 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes loadBar {
          to { transform: translateX(0); }
        }

        @media (max-width: 640px) {
          .shop-section { flex-direction: column; }
          .shop-side { flex: 1 !important; }
          .shop-section:hover .shop-side { flex: 1 !important; }
          .shop-section .shop-side:hover { flex: 1.4 !important; }
          .shop-female { border-left: none; border-top: 1px solid rgba(201,169,110,0.2); }
          .divider-label { display: none; }
        }
      `}</style>

      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Bebas+Neue&family=Montserrat:wght@200;300;400&display=swap" rel="stylesheet" />

      {/* Loading screen */}
      <div id="loader">
        <div className="loader-logo">
          <img width="350px" height="200px" src="/images/rworded.png" alt="Recrium" onError={(e) => { e.target.style.display = 'none'; }} />
        </div>
        <div className="loader-bar"></div>
      </div>

      {/* Hero Section */}
      <section className="hero" id="hero">
        <div style={{position:'absolute', top:'1.5rem', left:'2rem', zIndex:20}}>
          <img src="/images/silverlogo.png" alt="Recrium" style={{width:'80px', height:'auto'}} />
        </div>
        <div className="hero-glow"></div>
        <div className="hero-lines"></div>

        <div className="logo-wrap">
          <img
            className="logo-img"
            src="/images/rworldwide.png"
            alt="Recrium"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
          <div className="logo-text" style={{display:'none'}}>RECRIUM</div>
        </div>

        <div className="scroll-hint" onClick={() => document.getElementById('shop').scrollIntoView({behavior:'smooth'})}>
          <span>Explore</span>
          <div className="scroll-arrow"></div>
        </div>
      </section>

      {/* Shop Section */}
      <section className="shop-section" id="shop">

        {/* Male */}
        <a href="/shop-male" className="shop-side shop-male">
          <div className="corner-deco tl"></div>
          <div className="corner-deco br"></div>
          <div className="side-content">
            <div className="side-label">MEN</div>
            <div className="side-sub">New Collection</div>
            <span className="side-cta">Shop Now</span>
          </div>
        </a>

        {/* Centre badge */}
        <div className="divider-label">or</div>

        {/* Female */}
        <a href="/shop-female" className="shop-side shop-female">
          <div className="corner-deco tl"></div>
          <div className="corner-deco br"></div>
          <div className="side-content">
            <div className="side-label">WOMEN</div>
            <div className="side-sub">New Collection</div>
            <span className="side-cta">Shop Now</span>
          </div>
        </a>

      </section>

      <button className='theme-toggle' id='theme-toggle'>
        Light / Dark
      </button>

      
    </>
  );
}