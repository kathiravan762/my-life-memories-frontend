import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';

export default function Navigation() {
  const { profile } = useProfile();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => setOpen(false), [location]);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/memories', label: 'Memories' },
    { to: '/timeline', label: 'Timeline' },
    { to: '/story', label: 'My Story' },
  ];

  return (
    <motion.nav
      initial={{ y: -90, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 'var(--nav-h)',
        background: scrolled ? 'rgba(6,6,15,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(24px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(232,184,109,0.1)' : 'none',
        transition: 'all 0.5s ease',
      }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none' }}>
          <motion.div whileHover={{ scale: 1.03 }} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32,
              background: 'linear-gradient(135deg, var(--ember), var(--gold))',
              borderRadius: '50%',
              boxShadow: '0 0 18px rgba(255,107,53,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14,
            }}>✦</div>
            <span style={{
              fontFamily: 'var(--font-cinzel)', fontSize: 14, letterSpacing: '0.15em',
              color: 'var(--pearl)', fontWeight: 400,
            }}>
              {profile?.name?.split(' ')[0]?.toUpperCase() || 'MEMORIES'}
            </span>
          </motion.div>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 40, alignItems: 'center' }} className="desk-nav">
          {links.map(({ to, label }) => {
            const active = location.pathname === to;
            return (
              <Link key={to} to={to} style={{
                textDecoration: 'none', position: 'relative',
                color: active ? 'var(--gold)' : 'var(--mist)',
                fontFamily: 'var(--font-body)', fontSize: 14,
                fontWeight: active ? 500 : 400,
                letterSpacing: '0.06em',
                transition: 'color 0.3s',
              }}>
                {label}
                {active && (
                  <motion.div layoutId="nav-dot" style={{
                    position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)',
                    width: 4, height: 4, borderRadius: '50%',
                    background: 'var(--ember)',
                    boxShadow: '0 0 8px var(--ember)',
                  }} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="mob-toggle" style={{
          display: 'none', background: 'none', border: 'none',
          color: 'var(--mist)', cursor: 'pointer', fontSize: 22, lineHeight: 1,
        }}>
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              background: 'rgba(6,6,15,0.97)', backdropFilter: 'blur(20px)',
              borderBottom: '1px solid rgba(232,184,109,0.15)',
              overflow: 'hidden',
            }}>
            <div style={{ padding: '20px 32px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>
              {links.map(({ to, label }) => (
                <Link key={to} to={to} style={{
                  textDecoration: 'none',
                  color: location.pathname === to ? 'var(--gold)' : 'var(--mist)',
                  fontSize: 18, fontFamily: 'var(--font-display)', fontStyle: 'italic',
                }}>
                  {label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .desk-nav { display: none !important; }
          .mob-toggle { display: block !important; }
        }
      `}</style>
    </motion.nav>
  );
}
