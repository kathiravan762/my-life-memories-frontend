import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Slideshow({ memories }) {
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState(1);
  const [auto, setAuto] = useState(true);

  const next = useCallback(() => { setDir(1); setIdx(i => (i + 1) % memories.length); }, [memories.length]);
  const prev = () => { setDir(-1); setIdx(i => (i - 1 + memories.length) % memories.length); };

  useEffect(() => {
    if (!auto || memories.length < 2) return;
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [auto, next, memories.length]);

  if (!memories.length) return null;
  const m = memories[idx];
 const BASE_URL = process.env.REACT_APP_API_URL;

const src = m.photoUrl?.startsWith('http')
  ? m.photoUrl
  : `${BASE_URL}${m.photoUrl}`;

  const variants = {
    enter: d => ({ x: d > 0 ? '100%' : '-100%', scale: 1.05, opacity: 0 }),
    center: { x: 0, scale: 1, opacity: 1 },
    exit: d => ({ x: d > 0 ? '-30%' : '30%', scale: 0.95, opacity: 0 }),
  };

  return (
    <div style={{
      position: 'relative', borderRadius: 24, overflow: 'hidden',
      aspectRatio: '16/8',
      boxShadow: '0 30px 100px rgba(0,0,0,0.7)',
      border: '1px solid rgba(232,184,109,0.1)',
    }}>
      <AnimatePresence custom={dir} mode="wait">
        <motion.div key={idx} custom={dir} variants={variants}
          initial="enter" animate="center" exit="exit"
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          style={{ position: 'absolute', inset: 0 }}>
          <img src={src} alt={m.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {/* Gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(6,6,15,0.92) 0%, rgba(6,6,15,0.3) 40%, transparent 70%)',
          }} />
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '40px 48px 36px' }}>
            <div style={{
              fontFamily: 'var(--font-cinzel)', fontSize: 11, letterSpacing: '0.2em',
              color: 'var(--ember)', marginBottom: 10,
            }}>
              {new Date(m.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 3rem)', marginBottom: 10, lineHeight: 1.1 }}>
              {m.title}
            </h2>
            {m.aiCaption && (
              <p style={{ color: 'rgba(245,240,232,0.65)', fontStyle: 'italic', fontSize: 'clamp(13px, 2vw, 16px)', maxWidth: 600 }}>
                {m.aiCaption}
              </p>
            )}
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      {memories.length > 1 && (
        <>
          <button onClick={prev} style={arrowBtn('left')}>‹</button>
          <button onClick={next} style={arrowBtn('right')}>›</button>
        </>
      )}

      {/* Auto play toggle */}
      <button onClick={() => setAuto(a => !a)} style={{
        position: 'absolute', top: 16, right: 16,
        background: 'rgba(6,6,15,0.6)', border: '1px solid rgba(232,184,109,0.2)',
        color: 'var(--mist)', borderRadius: 8, padding: '6px 12px',
        cursor: 'pointer', fontSize: 13, backdropFilter: 'blur(10px)',
        letterSpacing: '0.05em',
      }}>
        {auto ? '⏸ Pause' : '▶ Play'}
      </button>

      {/* Dot indicators */}
      <div style={{
        position: 'absolute', bottom: 20, right: 48,
        display: 'flex', gap: 6,
      }}>
        {memories.map((_, i) => (
          <button key={i} onClick={() => { setDir(i > idx ? 1 : -1); setIdx(i); }} style={{
            width: i === idx ? 20 : 6, height: 6, borderRadius: 3,
            background: i === idx ? 'var(--ember)' : 'rgba(245,240,232,0.25)',
            border: 'none', cursor: 'pointer', padding: 0,
            transition: 'all 0.4s ease', boxShadow: i === idx ? '0 0 8px var(--ember)' : 'none',
          }} />
        ))}
      </div>
    </div>
  );
}

const arrowBtn = (side) => ({
  position: 'absolute', top: '50%', [side]: 20, transform: 'translateY(-50%)',
  background: 'rgba(6,6,15,0.65)', backdropFilter: 'blur(10px)',
  border: '1px solid rgba(232,184,109,0.2)',
  color: 'var(--pearl)', width: 52, height: 52, borderRadius: '50%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: 30, cursor: 'pointer', lineHeight: 1,
  transition: 'all 0.3s', zIndex: 2,
});
