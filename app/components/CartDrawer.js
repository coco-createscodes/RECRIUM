'use client';

import { useState } from 'react';
import { useCart } from './CartContext';
import emailjs from '@emailjs/browser';
import { createClient } from '@supabase/supabase-js';

const EMAILJS_SERVICE_ID  = 'service_883sp4q';
const EMAILJS_TEMPLATE_ID = 'template_u0hs6or';
const EMAILJS_PUBLIC_KEY  = 'rnYu4fZUeYhu4XLwK';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Generates a short, human-readable order reference like REC-4F9K2
function generateOrderRef() {
  const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'; // no 0/O/1/I to avoid confusion
  let code = '';
  for (let i = 0; i < 5; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return `REC-${code}`;
}

export default function CartDrawer() {
  const { items, removeItem, updateQty, clearCart, total, count, isOpen, setIsOpen } = useCart();

  const [view, setView] = useState('cart'); // 'cart' | 'checkout' | 'payment' | 'success'
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', city: '', postal: '', country: '' });
  const [errors, setErrors] = useState({});
  const [orderRef, setOrderRef] = useState('');

  const t = { bg: '#f5f0e8', border: 'rgba(0,0,0,0.08)', text: '#0a0a0a', sub: 'rgba(0,0,0,0.45)', input: '#ece8e0', inputBorder: 'rgba(0,0,0,0.12)', overlay: 'rgba(0,0,0,0.4)', accent: '#4a4a4a' };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Required';
    if (!form.address.trim()) e.address = 'Required';
    if (!form.city.trim()) e.city = 'Required';
    if (!form.postal.trim()) e.postal = 'Required';
    if (!form.country.trim()) e.country = 'Required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const ref = generateOrderRef();
    const orderLines = items.map(i => `${i.name} (${i.size}) x${i.qty} — ₦${(i.price * i.qty).toFixed(2)}`).join('\n');

    try {
      // 1. Save the order to Supabase first — this is our source of truth,
      // independent of whether the email succeeds.
      const { error: dbError } = await supabase.from('orders').insert({
        order_ref: ref,
        customer_name: form.name,
        customer_phone: form.phone,
        customer_email: form.email,
        delivery_address: `${form.address}, ${form.city}, ${form.postal}, ${form.country}`,
        items: items.map(i => ({ id: i.id, name: i.name, size: i.size, qty: i.qty, price: i.price })),
        total: total,
      });

      if (dbError) {
        console.error('Supabase insert error:', dbError);
        alert(`Order failed to save: ${dbError.message}`);
        setLoading(false);
        return;
      }

      // 2. Send the notification email (best-effort — order is already saved either way)
      try {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            order_ref:         ref,
            customer_name:     form.name,
            customer_email:    form.email,
            customer_phone:    form.phone,
            shipping_address:  `${form.address}, ${form.city}, ${form.postal}, ${form.country}`,
            order_summary:     orderLines,
            order_total:       `₦${total.toFixed(2)}`,
            delivery_fee:      'To be confirmed',
            grand_total:       'To be confirmed',
            order_date:        new Date().toLocaleString(),
          },
          EMAILJS_PUBLIC_KEY
        );
      } catch (emailErr) {
        // Don't block the customer — the order is safely in Supabase regardless.
        console.error('EmailJS error (order still saved):', emailErr);
      }

      setOrderRef(ref);
      setView('payment');
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Something went wrong placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentDone = () => {
    clearCart();
    setView('success');
  };

  const close = () => { setIsOpen(false); setTimeout(() => setView('cart'), 400); };

  const inputStyle = (field) => ({
    width: '100%', padding: '0.75rem 1rem', background: t.input,
    border: `1px solid ${errors[field] ? '#c0392b' : t.inputBorder}`,
    color: t.text, fontFamily: 'Montserrat, sans-serif', fontSize: '0.78rem',
    letterSpacing: '0.05em', outline: 'none', borderRadius: '2px',
    boxSizing: 'border-box',
  });

  const headerTitle = { cart: 'YOUR CART', checkout: 'CHECKOUT', payment: 'PAYMENT', success: 'ORDER PLACED' }[view];

  return (
    <>
      {/* Overlay */}
      <div onClick={close} style={{
        position: 'fixed', inset: 0, background: t.overlay,
        zIndex: 100000, opacity: isOpen ? 1 : 0,
        pointerEvents: isOpen ? 'auto' : 'none',
        transition: 'opacity 0.35s ease',
      }} />

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 'min(460px, 100vw)',
        background: t.bg, zIndex: 100001, display: 'flex', flexDirection: 'column',
        transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
        borderLeft: `1px solid ${t.border}`,
      }}>

        {/* Header */}
        <div style={{ padding: '1.8rem 2rem 1.2rem', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.6rem', letterSpacing: '0.2em', color: t.text }}>{headerTitle}</div>
            {view === 'cart' && count > 0 && (
              <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: t.sub, marginTop: '0.2rem', textTransform: 'uppercase' }}>
                {count} item{count !== 1 ? 's' : ''}
              </div>
            )}
          </div>
          <button onClick={close} style={{ background: 'none', border: 'none', cursor: 'none', color: t.sub, fontSize: '1.4rem', lineHeight: 1, padding: '0.25rem' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem 2rem' }}>

          {/* ── CART VIEW ── */}
          {view === 'cart' && (
            items.length === 0
              ? <div style={{ textAlign: 'center', marginTop: '4rem', color: t.sub }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🛒</div>
                  <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.1rem' }}>Your cart is empty</div>
                </div>
              : items.map(item => (
                  <div key={`${item.id}-${item.size}`} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: `1px solid ${t.border}` }}>
                    {item.image && <img src={item.image} alt={item.name} style={{ width: '80px', height: '100px', objectFit: 'cover', flexShrink: 0 }} />}
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '0.85rem', letterSpacing: '0.1em', color: t.text }}>{item.name}</div>
                      <div style={{ fontSize: '0.7rem', color: t.sub, marginTop: '0.3rem', letterSpacing: '0.15em' }}>SIZE: {item.size}</div>
                      <div style={{ fontSize: '0.8rem', color: t.text, marginTop: '0.4rem', fontWeight: 300 }}>₦{item.price.toFixed(2)}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.8rem' }}>
                        <button onClick={() => updateQty(item.id, item.size, item.qty - 1)} style={{ width: '26px', height: '26px', background: 'none', border: `1px solid ${t.border}`, color: t.text, cursor: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                        <span style={{ fontSize: '0.8rem', color: t.text, minWidth: '20px', textAlign: 'center' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.size, item.qty + 1)} style={{ width: '26px', height: '26px', background: 'none', border: `1px solid ${t.border}`, color: t.text, cursor: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                        <button onClick={() => removeItem(item.id, item.size)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: t.sub, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'none' }}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))
          )}

          {/* ── CHECKOUT VIEW ── */}
          {view === 'checkout' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {[
                { key: 'name',    label: 'Full Name',       placeholder: 'Your name' },
                { key: 'email',   label: 'Email Address',   placeholder: 'your@email.com' },
                { key: 'phone',   label: 'Phone Number',    placeholder: 'e.g. 08012345678' },
                { key: 'address', label: 'Street Address',  placeholder: 'Street address' },
                { key: 'city',    label: 'City',            placeholder: 'City' },
                { key: 'postal',  label: 'Postal Code',     placeholder: 'Postal code' },
                { key: 'country', label: 'Country',         placeholder: 'Country' },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'block', fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: t.sub, marginBottom: '0.4rem' }}>{label}</label>
                  <input
                    value={form[key]}
                    onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: '' })); }}
                    placeholder={placeholder}
                    style={inputStyle(key)}
                  />
                  {errors[key] && <div style={{ fontSize: '0.65rem', color: '#c0392b', marginTop: '0.3rem' }}>{errors[key]}</div>}
                </div>
              ))}

              {/* Order summary */}
              <div style={{ marginTop: '0.5rem', padding: '1rem', background: t.input, borderRadius: '2px' }}>
                <div style={{ fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: t.sub, marginBottom: '0.8rem' }}>Order Summary</div>
                {items.map(i => (
                  <div key={`${i.id}-${i.size}`} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: t.text, marginBottom: '0.4rem' }}>
                    <span>{i.name} ({i.size}) ×{i.qty}</span>
                    <span>₦{(i.price * i.qty).toFixed(2)}</span>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${t.border}`, marginTop: '0.8rem', paddingTop: '0.8rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: t.text, fontWeight: 400 }}>
                  <span>Total</span>
                  <span>₦{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── PAYMENT VIEW ── */}
          {view === 'payment' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1rem', color: t.sub, lineHeight: 1.7 }}>
                Your order has been received. Please complete payment using the details below.
              </div>

              {/* Order reference */}
              <div style={{ border: `1px solid ${t.accent}`, padding: '1rem 1.5rem', background: t.input, textAlign: 'center' }}>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: t.sub, marginBottom: '0.4rem' }}>Your Order Reference</div>
                <div style={{ fontSize: '1.3rem', letterSpacing: '0.15em', fontFamily: 'Bebas Neue, cursive', color: t.text }}>{orderRef}</div>
                <div style={{ fontSize: '0.62rem', color: t.sub, marginTop: '0.4rem' }}>Please include this in your Instagram DM</div>
              </div>

              {/* Account details box */}
              <div style={{ border: `1px solid ${t.border}`, padding: '1.5rem', background: t.input }}>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: t.sub, marginBottom: '1.2rem' }}>Bank Transfer</div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: t.sub, marginBottom: '0.3rem' }}>Bank</div>
                  <div style={{ fontSize: '1rem', color: t.text, letterSpacing: '0.05em', fontWeight: 300 }}>Opay</div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: t.sub, marginBottom: '0.3rem' }}>Account Number</div>
                  <div style={{ fontSize: '1.4rem', color: t.text, letterSpacing: '0.2em', fontFamily: 'Bebas Neue, cursive' }}>8161551540</div>
                </div>

                <div>
                  <div style={{ fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase', color: t.sub, marginBottom: '0.3rem' }}>Amount</div>
                  <div style={{ fontSize: '1rem', color: t.text, fontWeight: 300 }}>₦{total.toFixed(2)} <span style={{ fontSize: '0.65rem', color: t.sub }}>(+ delivery TBC)</span></div>
                </div>
              </div>

              {/* Instagram box */}
              <div style={{ border: `1px solid ${t.border}`, padding: '1.5rem', background: t.input }}>
                <div style={{ fontSize: '0.6rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: t.sub, marginBottom: '1rem' }}>Send Proof of Payment</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={t.accent} strokeWidth="1.5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17.5" cy="6.5" r="1" fill={t.accent} stroke="none"/>
                  </svg>
                  <a href="https://www.instagram.com/recrium.ttw" target="_blank" rel="noreferrer"
                    style={{ color: t.text, textDecoration: 'none', fontSize: '0.95rem', letterSpacing: '0.1em', fontWeight: 300 }}>
                    @recrium.ttw
                  </a>
                </div>
                <div style={{ fontSize: '0.68rem', color: t.sub, marginTop: '0.8rem', lineHeight: 1.6 }}>
                  DM us your payment screenshot along with order <strong>{orderRef}</strong>. We'll confirm and process your order within 24 hours.
                </div>
              </div>
            </div>
          )}

          {/* ── SUCCESS VIEW ── */}
          {view === 'success' && (
            <div style={{ textAlign: 'center', marginTop: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>✓</div>
              <div style={{ fontFamily: 'Bebas Neue, cursive', fontSize: '1.4rem', letterSpacing: '0.2em', color: t.text, marginBottom: '1rem' }}>THANK YOU</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1rem', color: t.sub, lineHeight: 1.7 }}>
                Once we confirm your payment<br />we'll get your order on its way.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {view === 'cart' && items.length > 0 && (
          <div style={{ padding: '1.5rem 2rem', borderTop: `1px solid ${t.border}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: t.sub }}>Total</span>
              <span style={{ fontSize: '1rem', color: t.text }}>₦{total.toFixed(2)}</span>
            </div>
            <button onClick={() => setView('checkout')}
              style={{ width: '100%', padding: '1rem', background: t.text, color: t.bg, border: 'none', fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase', cursor: 'none' }}>
              Proceed to Checkout
            </button>
          </div>
        )}

        {view === 'checkout' && (
          <div style={{ padding: '1.5rem 2rem', borderTop: `1px solid ${t.border}`, display: 'flex', gap: '0.75rem' }}>
            <button onClick={() => setView('cart')}
              style={{ flex: 1, padding: '1rem', background: 'none', color: t.sub, border: `1px solid ${t.border}`, fontFamily: 'Montserrat, sans-serif', fontSize: '0.65rem', letterSpacing: '0.3em', textTransform: 'uppercase', cursor: 'none' }}>
              Back
            </button>
            <button onClick={handleSubmit} disabled={loading}
              style={{ flex: 2, padding: '1rem', background: loading ? t.sub : t.text, color: t.bg, border: 'none', fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase', cursor: 'none', opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s' }}>
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        )}

        {view === 'payment' && (
          <div style={{ padding: '1.5rem 2rem', borderTop: `1px solid ${t.border}` }}>
            <button onClick={handlePaymentDone}
              style={{ width: '100%', padding: '1rem', background: t.text, color: t.bg, border: 'none', fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase', cursor: 'none' }}>
              I've Sent Payment
            </button>
          </div>
        )}

        {view === 'success' && (
          <div style={{ padding: '1.5rem 2rem', borderTop: `1px solid ${t.border}` }}>
            <button onClick={close}
              style={{ width: '100%', padding: '1rem', background: t.text, color: t.bg, border: 'none', fontFamily: 'Montserrat, sans-serif', fontWeight: 300, fontSize: '0.7rem', letterSpacing: '0.4em', textTransform: 'uppercase', cursor: 'none' }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}