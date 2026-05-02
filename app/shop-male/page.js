'use client';
 
import Navbar from '../components/Navbar';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';

 
export default function ShopMale() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const [darkMode, setDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);
 
  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') setDarkMode(false);
    setMounted(true);
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    let mx = 0, my = 0, rx = 0, ry = 0;
 
    const onMouseMove = (e) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    };
 
    document.addEventListener('mousemove', (e) => {
  if (!cursor || !ring) return;
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});
 
    let animId;

    (function animateRing() {
       if (!ring) return;
       rx += (mx - rx) * 0.12;
       ry += (my - ry) * 0.12;
       ring.style.left = rx + 'px';
       ring.style.top = ry + 'px';
       animId = requestAnimationFrame(animateRing);
   })();
 
    const expandEls = document.querySelectorAll('.look-item, a, button');
    const onEnter = () => ring.classList.add('expand');
    const onLeave = () => ring.classList.remove('expand');
    expandEls.forEach(el => {
      el.addEventListener('mouseenter', onEnter);
      el.addEventListener('mouseleave', onLeave);
    });
 
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);
 
  const theme = {
    bg: darkMode ? '#0a0a0a' : '#f5f0e8',
    text: darkMode ? '#ffffff' : '#0a0a0a',
    navBg: darkMode ? 'rgba(10,10,10,0.95)' : 'rgba(245,240,232,0.95)',
    footerBorder: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    footerText: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)',
    dim: darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)',
  };

  if (!mounted) return null;

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100vh', cursor: 'none', }}>
      <style>{`
        html { scroll-behavior: smooth; }
  
 
        .cursor {
          position: fixed; width: 10px; height: 10px; background: #4a4a4a;
          border-radius: 50%; pointer-events: none; z-index: 9999;
          transform: translate(-50%, -50%); mix-blend-mode: difference;
        }
        .cursor-ring {
          position: fixed; width: 36px; height: 36px;
          border: 1px solid rgba(90,90,90,0.5); border-radius: 50%;
          pointer-events: none; z-index: 9998; transform: translate(-50%, -50%);
          transition: width 0.4s, height 0.4s;
        }
        .cursor-ring.expand { width: 70px; height: 70px; border-color: #4a4a4a; }
 
        .page-hero {
          height: 55vh; display: flex; align-items: flex-end;
          padding: 3rem; position: relative; overflow: hidden;
        }
        .page-hero-content { position: relative; z-index: 3; }
        .page-title {
          font-family: 'Bebas Neue', cursive;
          font-size: clamp(3.5rem, 10vw, 8rem);
          letter-spacing: 0.1em; line-height: 0.9;
        }
        .page-subtitle {
          font-family: 'Cormorant Garamond', serif; font-style: italic;
          font-size: clamp(0.9rem, 2vw, 1.15rem); color: #4a4a4a;
          letter-spacing: 0.3em; margin-top: 0.8rem;
        }
 
        .lookbook { padding: 3rem; columns: 3; column-gap: 1.2rem; }
        @media (max-width: 900px) { .lookbook { columns: 2; } }
        @media (max-width: 540px) { .lookbook { columns: 1; padding: 1.5rem; } }
 
        .look-item {
          break-inside: avoid; margin-bottom: 1.2rem; position: relative;
          overflow: hidden; cursor: none; display: block; text-decoration: none;
        }
        .look-item:nth-child(3n+2) { margin-top: 3rem; }
        .look-item:nth-child(3n+3) { margin-top: -1.5rem; }
 
        .look-item img {
          width: 100%; height: auto; display: block;
          transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1), filter 0.5s;
          filter: brightness(0.92);
        }
        .look-item:hover img { transform: scale(1.04); filter: brightness(1.05); }
 
        .look-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top, rgba(10,10,10,0.7) 0%, transparent 50%);
          opacity: 0; transition: opacity 0.5s;
          display: flex; align-items: flex-end; padding: 1.5rem;
        }
        .look-item:hover .look-overlay { opacity: 1; }
 
        .look-view {
          font-size: 0.6rem; letter-spacing: 0.4em; text-transform: uppercase;
          color: #4a4a4a; border-bottom: 1px solid rgba(90,90,90,0.5); padding-bottom: 0.2rem;
        }
 
        .look-item::before {
          content: ''; position: absolute; top: 0; left: 0; width: 0; height: 0;
          border-top: 2px solid #4a4a4a; border-left: 2px solid #4a4a4a;
          transition: width 0.4s, height 0.4s; z-index: 5;
        }
        .look-item:hover::before { width: 30px; height: 30px; }
 
        .look-placeholder {
          background: rgba(128,128,128,0.05); border: 1px dashed rgba(90,90,90,0.2);
          aspect-ratio: 3/4; display: flex; align-items: center; justify-content: center;
          flex-direction: column; gap: 0.8rem;
        }
        .ph-icon { font-size: 2rem; opacity: 0.15; }
        .ph-text { font-size: 0.55rem; letter-spacing: 0.3em; text-transform: uppercase; opacity: 0.3; }
 
        .lookbook .look-item { opacity: 0; transform: translateY(30px); animation: itemReveal 0.7s ease forwards; }
        .look-item:nth-child(1) { animation-delay: 0.05s; }
        .look-item:nth-child(2) { animation-delay: 0.12s; }
        .look-item:nth-child(3) { animation-delay: 0.19s; }
        .look-item:nth-child(4) { animation-delay: 0.26s; }
        .look-item:nth-child(5) { animation-delay: 0.33s; }
        .look-item:nth-child(6) { animation-delay: 0.40s; }
        .look-item:nth-child(7) { animation-delay: 0.47s; }
        .look-item:nth-child(8) { animation-delay: 0.54s; }
        .look-item:nth-child(9) { animation-delay: 0.61s; }
        @keyframes itemReveal { to { opacity: 1; transform: translateY(0); } }
      `}</style>
 
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=Bebas+Neue&family=Montserrat:wght@200;300;400&display=swap" rel="stylesheet" />
 
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>
 
 
       <Navbar section="Men" darkMode={darkMode} />

      <div className="page-hero">
        <img src="/images/silverlogo.png" alt="Recrium" style={{position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'min(500px, 60vw)', opacity:0.06, zIndex:1}} />
        
        <div className="page-hero-content">
          <div className="page-title">MALE</div>
          <div className="page-subtitle">Current Collection</div>
        </div>
      </div>
 
      <div className="lookbook">
      
        {[...Array(9)].map((_, i) => (
          <div key={i} className="look-item look-placeholder">
            <div className="ph-icon">+</div>
            <div className="ph-text">Add Product Image</div>
          </div>
        ))}
      </div>
      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
 
      <Footer switchLink="/shop-female" switchLabel="Switch to Women →" darkMode={darkMode} />
    </div>
  );
}