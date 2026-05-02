'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';
import CartDrawer from '../components/CartDrawer';
import CartButton from '../components/CartButton';
import { useCart } from '../components/CartContext';

// ── YOUR PRODUCTS ──────────────────────────────────
// Featured product shown at the top (wide banner)
const FEATURED = { id: 'f0', name: 'Featured Product', price: 0, image: null, sizes: ['XS','S','M','L','XL'] };

// Grid products
const PRODUCTS = [
  { id: 'f1', name: 'Product 1', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
  { id: 'f2', name: 'Product 2', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
  { id: 'f3', name: 'Product 3', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
  { id: 'f4', name: 'Product 4', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
  { id: 'f5', name: 'Product 5', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
  { id: 'f6', name: 'Product 6', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
  { id: 'f7', name: 'Product 7', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
  { id: 'f8', name: 'Product 8', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
];
// ───────────────────────────────────────────────────

export default function ShopFemale() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const [darkMode, setDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [activeProduct, setActiveProduct] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light') setDarkMode(false);
    setMounted(true);
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
      if (!ring) return;
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

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [mounted]);

  const handleAdd = (product) => {
    const size = selectedSizes[product.id];
    if (!size) return;
    addItem({ ...product, size });
    setAddedItems(p => ({ ...p, [product.id]: true }));
    setTimeout(() => setAddedItems(p => ({ ...p, [product.id]: false })), 1500);
    setActiveProduct(null);
  };

  if (!mounted) return null;

  return (
    <div style={{
      background: darkMode ? '#0a0a0a' : '#f5f0e8',
      color: darkMode ? '#ffffff' : '#0a0a0a',
      minHeight: '100vh',
      cursor: 'none',
    }}>
      <style>{`
        :root { --bg: ${darkMode ? '#0a0a0a' : '#f5f0e8'}; }
        html { scroll-behavior: smooth; }
        body { background: transparent; color: inherit; font-family: 'Montserrat', sans-serif; font-weight: 200; overflow-x: hidden; cursor: none; }

        .cursor { position: fixed; width: 10px; height: 10px; background: #ffffff; border-radius: 50%; pointer-events: none; z-index: 9999; transform: translate(-50%, -50%); }
        .cursor-ring { position: fixed; width: 36px; height: 36px; border: 1px solid rgba(201,169,110,0.5); border-radius: 50%; pointer-events: none; z-index: 9998; transform: translate(-50%, -50%); transition: width 0.4s, height 0.4s, border-color 0.3s; }
        .cursor-ring.expand { width: 70px; height: 70px; border-color: var(--gold); }

        .page-hero { height: 55vh; display: flex; align-items: flex-end; padding: 3rem; position: relative; overflow: hidden; }
        .page-hero::before { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 40%, var(--bg) 100%); z-index: 2; }
        .hero-watermark { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-8deg); font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(6rem, 18vw, 16rem); color: rgba(201,169,110,0.04); white-space: nowrap; z-index: 1; user-select: none; letter-spacing: 0.05em; }
        .page-hero-content { position: relative; z-index: 3; }
        .page-title { font-family: 'Bebas Neue', cursive; font-size: clamp(3.5rem, 10vw, 8rem); letter-spacing: 0.1em; line-height: 0.9; }
        .page-subtitle { font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: clamp(0.9rem, 2vw, 1.15rem); color: var(--gold); letter-spacing: 0.3em; margin-top: 0.8rem; }

        .lookbook { padding: 3rem; }

        .look-feature { width: 100%; margin-bottom: 1.2rem; position: relative; overflow: hidden; display: block; text-decoration: none; cursor: none; }
        .look-feature img { width: 100%; height: 65vh; object-fit: cover; display: block; transition: transform 0.9s cubic-bezier(0.16,1,0.3,1), filter 0.5s; filter: brightness(0.88); }
        .look-feature:hover img { transform: scale(1.03); filter: brightness(1); }
        .look-feature::before { content: ''; position: absolute; top: 0; left: 0; width: 0; height: 0; border-top: 2px solid var(--gold); border-left: 2px solid var(--gold); transition: width 0.4s, height 0.4s; z-index: 5; }
        .look-feature:hover::before { width: 40px; height: 40px; }

        .lookbook-grid { columns: 3; column-gap: 1.2rem; }
        @media (max-width: 900px) { .lookbook-grid { columns: 2; } }
        @media (max-width: 540px) { .lookbook-grid { columns: 1; } .lookbook { padding: 1.5rem; } .look-feature img { height: 50vh; } }

        .look-item { break-inside: avoid; margin-bottom: 1.2rem; position: relative; overflow: hidden; cursor: none; display: block; text-decoration: none; }
        .look-item:nth-child(3n+2) { margin-top: 4rem; }
        .look-item:nth-child(3n+3) { margin-top: -2rem; }
        .look-item img { width: 100%; height: auto; display: block; transition: transform 0.8s cubic-bezier(0.16,1,0.3,1), filter 0.5s; filter: brightness(0.9); }
        .look-item:hover img { transform: scale(1.05); filter: brightness(1.05); }

        .look-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 55%); opacity: 0; transition: opacity 0.5s; display: flex; flex-direction: column; justify-content: flex-end; padding: 1.2rem; }
        .look-item:hover .look-overlay,
        .look-feature:hover .look-overlay { opacity: 1; }

        .look-item::before { content: ''; position: absolute; top: 0; left: 0; width: 0; height: 0; border-top: 2px solid var(--gold); border-left: 2px solid var(--gold); transition: width 0.4s, height 0.4s; z-index: 5; }
        .look-item:hover::before { width: 30px; height: 30px; }

        .look-placeholder { background: rgba(255,255,255,0.03); border: 1px dashed rgba(201,169,110,0.15); aspect-ratio: 3/4; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 0.8rem; }
        .look-placeholder.wide { aspect-ratio: 16/7; }
        .ph-icon { font-size: 2rem; opacity: 0.15; }
        .ph-text { font-size: 0.55rem; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.2); }

        .look-item, .look-feature { opacity: 0; transform: translateY(30px); animation: itemReveal 0.7s ease forwards; }
        .look-feature { animation-delay: 0.05s; }
        .look-item:nth-child(1) { animation-delay: 0.12s; }
        .look-item:nth-child(2) { animation-delay: 0.19s; }
        .look-item:nth-child(3) { animation-delay: 0.26s; }
        .look-item:nth-child(4) { animation-delay: 0.33s; }
        .look-item:nth-child(5) { animation-delay: 0.40s; }
        .look-item:nth-child(6) { animation-delay: 0.47s; }
        .look-item:nth-child(7) { animation-delay: 0.54s; }
        .look-item:nth-child(8) { animation-delay: 0.61s; }
        @keyframes itemReveal { to { opacity: 1; transform: translateY(0); } }

        .size-btn { transition: all 0.2s ease; }
        .add-btn { transition: all 0.3s ease; }
      `}</style>

      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=Bebas+Neue&family=Montserrat:wght@200;300;400&display=swap" rel="stylesheet" />

      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>

      {/* Cart */}
      <CartDrawer darkMode={darkMode} />
      <CartButton darkMode={darkMode} />

      <Navbar section="Women" darkMode={darkMode} />

      <div className="page-hero">
        <img src="/images/silverlogo.png" alt="Recrium" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(500px, 60vw)', opacity: 0.06, zIndex: 1 }} />
        <div className="page-hero-content">
          <div className="page-title">FEMALE</div>
          <div className="page-subtitle">Current Collection</div>
        </div>
      </div>

      <div className="lookbook">

        {/* Featured product */}
        <div
          className="look-feature"
          onClick={() => setActiveProduct(activeProduct === FEATURED.id ? null : FEATURED.id)}
        >
          {FEATURED.image
            ? <img src={FEATURED.image} alt={FEATURED.name} onError={(e) => { e.target.style.display = 'none'; }} />
            : <div className="look-placeholder wide">
                <div className="ph-icon">+</div>
                <div className="ph-text">Add Featured Product Image</div>
              </div>
          }

          {/* Hover overlay */}
          {FEATURED.image && (
            <div className="look-overlay">
              <div style={{ fontSize: '0.9rem', fontWeight: 300, letterSpacing: '0.1em', color: '#fff', marginBottom: '0.2rem' }}>{FEATURED.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>₦{FEATURED.price.toLocaleString()}</div>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.2rem', width: 'fit-content' }}>Tap to add</div>
            </div>
          )}

          {/* Expanded panel */}
          {activeProduct === FEATURED.id && (
            <div
              style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.92)', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', gap: '1rem' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: '1rem', color: '#fff', fontWeight: 300, letterSpacing: '0.1em' }}>{FEATURED.name}</div>
              <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)' }}>₦{FEATURED.price.toLocaleString()}</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {FEATURED.sizes.map(size => (
                  <button key={size} className="size-btn"
                    onClick={() => setSelectedSizes(p => ({ ...p, [FEATURED.id]: size }))}
                    style={{ padding: '0.35rem 0.65rem', background: 'none', cursor: 'none', border: `1px solid ${selectedSizes[FEATURED.id] === size ? '#fff' : 'rgba(255,255,255,0.2)'}`, color: selectedSizes[FEATURED.id] === size ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '0.6rem', letterSpacing: '0.1em', fontFamily: 'Montserrat, sans-serif' }}>
                    {size}
                  </button>
                ))}
              </div>
              <button className="add-btn" onClick={() => handleAdd(FEATURED)} disabled={!selectedSizes[FEATURED.id]}
                style={{ padding: '0.8rem 2.5rem', background: addedItems[FEATURED.id] ? '#4a4a4a' : selectedSizes[FEATURED.id] ? '#fff' : 'rgba(255,255,255,0.1)', color: addedItems[FEATURED.id] ? '#fff' : selectedSizes[FEATURED.id] ? '#0a0a0a' : 'rgba(255,255,255,0.3)', border: 'none', fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.35em', textTransform: 'uppercase', cursor: 'none' }}>
                {addedItems[FEATURED.id] ? '✓ Added' : 'Add to Cart'}
              </button>
            </div>
          )}
        </div>

        {/* Product grid */}
        <div className="lookbook-grid">
          {PRODUCTS.map((product) => (
            <div
              key={product.id}
              className="look-item"
              onClick={() => setActiveProduct(activeProduct === product.id ? null : product.id)}
            >
              {product.image
                ? <img src={product.image} alt={product.name} onError={(e) => { e.target.style.display = 'none'; }} />
                : <div className="look-placeholder">
                    <div className="ph-icon">+</div>
                    <div className="ph-text">Add Product Image</div>
                  </div>
              }

              {/* Hover overlay */}
              <div className="look-overlay">
                <div style={{ fontSize: '0.75rem', fontWeight: 300, letterSpacing: '0.1em', color: '#fff', marginBottom: '0.2rem' }}>{product.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem' }}>₦{product.price.toLocaleString()}</div>
                <div style={{ fontSize: '0.55rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.2rem', width: 'fit-content' }}>Tap to add</div>
              </div>

              {/* Expanded add-to-cart panel */}
              {activeProduct === product.id && (
                <div
                  style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.92)', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.2rem' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 300, marginBottom: '0.2rem', letterSpacing: '0.05em' }}>{product.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>₦{product.price.toLocaleString()}</div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                    {product.sizes.map(size => (
                      <button key={size} className="size-btn"
                        onClick={() => setSelectedSizes(p => ({ ...p, [product.id]: size }))}
                        style={{ padding: '0.3rem 0.55rem', background: 'none', cursor: 'none', border: `1px solid ${selectedSizes[product.id] === size ? '#fff' : 'rgba(255,255,255,0.2)'}`, color: selectedSizes[product.id] === size ? '#fff' : 'rgba(255,255,255,0.4)', fontSize: '0.6rem', letterSpacing: '0.1em', fontFamily: 'Montserrat, sans-serif' }}>
                        {size}
                      </button>
                    ))}
                  </div>
                  {!selectedSizes[product.id] && (
                    <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.6rem', letterSpacing: '0.15em' }}>Select a size</div>
                  )}
                  <button className="add-btn" onClick={() => handleAdd(product)} disabled={!selectedSizes[product.id]}
                    style={{ width: '100%', padding: '0.7rem', background: addedItems[product.id] ? '#4a4a4a' : selectedSizes[product.id] ? '#fff' : 'rgba(255,255,255,0.1)', color: addedItems[product.id] ? '#fff' : selectedSizes[product.id] ? '#0a0a0a' : 'rgba(255,255,255,0.3)', border: 'none', fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', cursor: 'none' }}>
                    {addedItems[product.id] ? '✓ Added' : 'Add to Cart'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      <Footer switchLink="/shop-male" switchLabel="Switch to Men →" darkMode={darkMode} />
    </div>
  );
}