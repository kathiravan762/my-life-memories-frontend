import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MOOD_ICON = { happy:'😊', nostalgic:'🥺', excited:'🎉', peaceful:'😌', adventurous:'🌟', loving:'💕', proud:'🏆', grateful:'🙏' };

export default function MemoryCard({ memory, index = 0 }) {
  const [flipped, setFlipped] = useState(false);

<img src={memory.photoUrl} />

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1400, height: 420, cursor: 'pointer' }}
      onClick={() => setFlipped(f => !f)}>
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
        style={{ width: '100%', height: '100%', position: 'relative', transformStyle: 'preserve-3d' }}>

        {/* ── FRONT ── */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          borderRadius: 20, overflow: 'hidden',
          border: '1px solid rgba(232,184,109,0.15)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5)',
        }}>
          <div style={{ position: 'relative', height: '65%', overflow: 'hidden' }}>
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              src={src} alt={memory.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
            {/* Overlay gradient */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to bottom, transparent 50%, rgba(6,6,15,0.6) 100%)',
            }} />
            {/* Year badge */}
            <div style={{
              position: 'absolute', top: 14, left: 14,
              background: 'rgba(6,6,15,0.7)', backdropFilter: 'blur(10px)',
              border: '1px solid rgba(232,184,109,0.25)',
              borderRadius: 8, padding: '4px 10px',
              fontFamily: 'var(--font-cinzel)', fontSize: 12, color: 'var(--gold)',
              letterSpacing: '0.1em',
            }}>
              {new Date(memory.date).getFullYear()}
            </div>
            {memory.isFavorite && (
              <div style={{ position: 'absolute', top: 14, right: 14, fontSize: 18 }}>❤️</div>
            )}
          </div>

          <div style={{
            padding: '18px 20px 20px',
            background: 'linear-gradient(180deg, rgba(12,12,28,0.98), rgba(6,6,15,0.98))',
            height: '35%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: 6, lineHeight: 1.3 }}>
                {memory.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--mist)', lineHeight: 1.5 }}>
                {memory.description?.substring(0, 75)}{memory.description?.length > 75 ? '...' : ''}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, color: 'rgba(232,184,109,0.6)' }}>
                {new Date(memory.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
              <span style={{ fontSize: 12, color: 'var(--fog)', fontStyle: 'italic' }}>tap to flip ↩</span>
            </div>
          </div>
        </div>

        {/* ── BACK ── */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)',
          borderRadius: 20, overflow: 'hidden',
          background: 'linear-gradient(160deg, rgba(20,12,30,0.99), rgba(12,8,20,0.99))',
          border: '1px solid rgba(255,107,53,0.25)',
          padding: '28px 24px',
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 0 80px rgba(255,107,53,0.04)',
        }}>
          <div>
            <div style={{
              height: 3, borderRadius: 2, marginBottom: 20,
              background: 'linear-gradient(90deg, var(--ember), var(--gold), transparent)',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <span style={{ fontSize: 22 }}>{MOOD_ICON[memory.mood] || '✦'}</span>
              <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.3rem' }}>{memory.title}</h3>
            </div>

            {memory.aiCaption && (
              <div style={{
                borderLeft: '2px solid var(--ember)',
                paddingLeft: 14, marginBottom: 16,
              }}>
                <p style={{ fontStyle: 'italic', color: 'rgba(232,184,109,0.85)', fontSize: 14, lineHeight: 1.7 }}>
                  "{memory.aiCaption}"
                </p>
              </div>
            )}

            <p style={{ color: 'var(--mist)', fontSize: 14, lineHeight: 1.7 }}>
              {memory.description || 'A moment worth remembering...'}
            </p>
          </div>

          <div>
            {memory.location && (
              <p style={{ fontSize: 13, color: 'var(--fog)', marginBottom: 10 }}>
                📍 {memory.location}
              </p>
            )}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {memory.tags?.slice(0, 4).map(tag => (
                <span key={tag} style={{
                  fontSize: 11, padding: '3px 10px', borderRadius: 20,
                  background: 'rgba(255,107,53,0.1)',
                  border: '1px solid rgba(255,107,53,0.2)',
                  color: 'var(--ember)',
                  letterSpacing: '0.04em',
                }}>{tag}</span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
