import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';

function TimelineCard({ memory, side, index }) {
  const src = memory.photoUrl?.startsWith('http') ? memory.photoUrl : `http://localhost:5000${memory.photoUrl}`;
  const isLeft = side === 'left';

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.8, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: isLeft ? '1fr 40px 1fr' : '1fr 40px 1fr',
        gap: 0, alignItems: 'center',
        marginBottom: 56,
      }}>
      {/* Left side */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '0 28px 0 0' }}>
        {isLeft && <MemoryBubble memory={memory} src={src} />}
      </div>

      {/* Center dot */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <motion.div
          whileInView={{ scale: [0.5, 1.3, 1] }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          style={{
            width: 14, height: 14, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--ember), var(--gold))',
            boxShadow: '0 0 16px var(--ember-glow)',
            flexShrink: 0,
          }}
        />
      </div>

      {/* Right side */}
      <div style={{ padding: '0 0 0 28px' }}>
        {!isLeft && <MemoryBubble memory={memory} src={src} />}
      </div>
    </motion.div>
  );
}

function MemoryBubble({ memory, src }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(255,107,53,0.15)' }}
      transition={{ duration: 0.3 }}
      style={{
        background: 'rgba(12,12,28,0.85)',
        border: '1px solid rgba(232,184,109,0.15)',
        borderRadius: 20, overflow: 'hidden',
        maxWidth: 400, width: '100%',
        boxShadow: '0 8px 40px rgba(0,0,0,0.4)',
      }}>
      <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
        <motion.img
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.6 }}
          src={src} alt={memory.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(12,12,28,0.7) 0%, transparent 50%)',
        }} />
      </div>
      <div style={{ padding: '16px 20px 20px' }}>
        <div style={{
          fontFamily: 'var(--font-cinzel)', fontSize: 11,
          color: 'var(--ember)', letterSpacing: '0.12em', marginBottom: 8,
        }}>
          {new Date(memory.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', marginBottom: 8, lineHeight: 1.3 }}>
          {memory.title}
        </h4>
        {(memory.aiCaption || memory.description) && (
          <p style={{ fontSize: 13.5, color: 'var(--mist)', lineHeight: 1.6, fontStyle: memory.aiCaption ? 'italic' : 'normal' }}>
            {(memory.aiCaption || memory.description).substring(0, 100)}...
          </p>
        )}
        {memory.location && (
          <p style={{ fontSize: 12, color: 'var(--fog)', marginTop: 10 }}>📍 {memory.location}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function TimelinePage() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/memories/timeline').then(r => setTimeline(r.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        style={{ marginBottom: 80, textAlign: 'center' }}>
        <div className="page-title">Journey Through Time</div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>Life Timeline</h1>
        <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, transparent, var(--ember), transparent)', margin: '20px auto 0' }} />
      </motion.div>

      {loading && <div className="loader-wrap"><div className="loader" /></div>}

      {timeline.map((group, gi) => (
        <div key={group.year} style={{ position: 'relative', marginBottom: 80 }}>
          {/* Year marker */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: 48 }}>
            <div style={{
              background: 'linear-gradient(135deg, rgba(255,107,53,0.15), rgba(232,184,109,0.1))',
              border: '1px solid rgba(255,107,53,0.3)',
              borderRadius: 50, padding: '10px 48px',
              fontFamily: 'var(--font-cinzel)', fontSize: '1.8rem', color: 'var(--gold)',
              letterSpacing: '0.1em',
              boxShadow: '0 0 40px rgba(255,107,53,0.15)',
            }}>
              {group.year}
            </div>
          </motion.div>

          {/* Central line */}
          <div style={{
            position: 'absolute', left: '50%', top: 70, bottom: -40,
            width: 1, transform: 'translateX(-50%)',
            background: 'linear-gradient(to bottom, rgba(255,107,53,0.4), rgba(232,184,109,0.2), transparent)',
          }} />

          {/* Memories */}
          {group.memories.map((m, i) => (
            <TimelineCard key={m._id} memory={m} side={i % 2 === 0 ? 'left' : 'right'} index={i} />
          ))}
        </div>
      ))}

      {!loading && timeline.length === 0 && (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <p style={{ color: 'var(--mist)', fontSize: 18 }}>No memories yet. Add some to build your timeline.</p>
        </div>
      )}
    </div>
  );
}
