'use client';
 
import Navbar from '../components/Navbar';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Footer from '../components/Footer';
import ThemeToggle from '../components/ThemeToggle';
import CartDrawer from '../components/CartDrawer';
import CartButton from '../components/CartButton';
import { useCart } from '../components/CartContext';

// ── YOUR PRODUCTS ──────────────────────────────────
// Replace with your real products. image path is optional.
const PRODUCTS = [
  { id: 'm1', name: 'Product 1', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
  { id: 'm2', name: 'Product 2', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
  { id: 'm3', name: 'Product 3', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
  { id: 'm4', name: 'Product 4', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
  { id: 'm5', name: 'Product 5', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
  { id: 'm6', name: 'Product 6', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
  { id: 'm7', name: 'Product 7', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
  { id: 'm8', name: 'Product 8', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
  { id: 'm9', name: 'Product 9', price: 0, image: null, sizes: ['XS','S','M','L','XL'] },
];
// ───────────────────────────────────────────────────

export default function ShopMale() {
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const [darkMode, setDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [addedItems, setAddedItems] = useState({});
  const [activeProduct, setActiveProduct] = useState(null); // which product card is open
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
  }, [mounted]);

  const handleAdd = (product) => {
    const size = selectedSizes[product.id];
    if (!size) return;
    addItem({ ...product, size });
    setAddedItems(p => ({ ...p, [product.id]: true }));
    setTimeout(() => setAddedItems(p => ({ ...p, [product.id]: false })), 1500);
    setActiveProduct(null);
  };
 
  const theme = {
    bg: darkMode ? '#0a0a0a' : '#f5f0e8',
    text: darkMode ? '#ffffff' : '#0a0a0a',
    navBg: darkMode ? 'rgba(10,10,10,0.95)' : 'rgba(245,240,232,0.95)',
    footerBorder: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    footerText: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.3)',
    dim: darkMode ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)',
    border: darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
    card: darkMode ? '#111' : '#ece8e0',
    sub: darkMode ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)',
  };

  if (!mounted) return null;

  return (
    <div style={{ background: theme.bg, color: theme.text, minHeight: '100vh', cursor: 'none' }}>
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
          background: linear-gradient(to top, rgba(10,10,10,0.85) 0%, transparent 55%);
          opacity: 0; transition: opacity 0.5s;
          display: flex; flex-direction: column; justify-content: flex-end; padding: 1.2rem;
        }
        .look-item:hover .look-overlay { opacity: 1; }

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

        .size-btn { transition: all 0.2s ease; }
        .size-btn:hover { opacity: 0.8; }
        .add-btn { transition: all 0.3s ease; }
        .add-btn:hover { opacity: 0.8; }
      `}</style>
 
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;1,300;1,400&family=Bebas+Neue&family=Montserrat:wght@200;300;400&display=swap" rel="stylesheet" />
 
      <div className="cursor" ref={cursorRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>

      {/* Cart */}
      <CartDrawer darkMode={darkMode} />
      <CartButton darkMode={darkMode} />
 
      <Navbar section="Men" darkMode={darkMode} />

      <div className="page-hero">
        <img src="/images/silverlogo.png" alt="Recrium" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(500px, 60vw)', opacity: 0.06, zIndex: 1 }} />
        <div className="page-hero-content">
          <div className="page-title">MALE</div>
          <div className="page-subtitle">Current Collection</div>
        </div>
      </div>
 
      <div className="lookbook">
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

            {/* Hover overlay with name + price */}
            <div className="look-overlay">
              <div style={{ fontSize: '0.75rem', fontWeight: 300, letterSpacing: '0.1em', color: '#fff', marginBottom: '0.2rem' }}>{product.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', marginBottom: '0.6rem' }}>₦{product.price.toLocaleString()}</div>
              <div style={{ fontSize: '0.55rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', borderBottom: '1px solid rgba(255,255,255,0.3)', paddingBottom: '0.2rem', width: 'fit-content' }}>
                Tap to add
              </div>
            </div>

            {/* Expanded add-to-cart panel */}
            {activeProduct === product.id && (
              <div
                style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.92)', zIndex: 10, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '1.2rem' }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: 300, marginBottom: '0.2rem', letterSpacing: '0.05em' }}>{product.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1rem' }}>₦{product.price.toLocaleString()}</div>

                {/* Sizes */}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.8rem' }}>
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      className="size-btn"
                      onClick={() => setSelectedSizes(p => ({ ...p, [product.id]: size }))}
                      style={{
                        padding: '0.3rem 0.55rem', background: 'none', cursor: 'none',
                        border: `1px solid ${selectedSizes[product.id] === size ? '#fff' : 'rgba(255,255,255,0.2)'}`,
                        color: selectedSizes[product.id] === size ? '#fff' : 'rgba(255,255,255,0.4)',
                        fontSize: '0.6rem', letterSpacing: '0.1em', fontFamily: 'Montserrat, sans-serif',
                      }}
                    >
                      {size}
                    </button>
                  ))}
                </div>

                {!selectedSizes[product.id] && (
                  <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.6rem', letterSpacing: '0.15em' }}>Select a size</div>
                )}

                <button
                  className="add-btn"
                  onClick={() => handleAdd(product)}
                  disabled={!selectedSizes[product.id]}
                  style={{
                    width: '100%', padding: '0.7rem',
                    background: addedItems[product.id] ? '#4a4a4a' : selectedSizes[product.id] ? '#fff' : 'rgba(255,255,255,0.1)',
                    color: addedItems[product.id] ? '#fff' : selectedSizes[product.id] ? '#0a0a0a' : 'rgba(255,255,255,0.3)',
                    border: 'none', fontFamily: 'Montserrat, sans-serif', fontWeight: 300,
                    fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', cursor: 'none',
                  }}
                >
                  {addedItems[product.id] ? '✓ Added' : 'Add to Cart'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
      <Footer switchLink="/shop-female" switchLabel="Switch to Women →" darkMode={darkMode} />
    </div>
  );
}