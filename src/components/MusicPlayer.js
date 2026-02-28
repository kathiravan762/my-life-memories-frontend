import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProfile } from '../context/ProfileContext';

export default function MusicPlayer() {
  const { profile } = useProfile();
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(0.25);
  const [open, setOpen] = useState(false);
  const audio = useRef(null);

  useEffect(() => { if (audio.current) audio.current.volume = vol; }, [vol]);
const src = profile?.backgroundMusic || null;
  if (!src || !profile?.musicEnabled) return null;

  const toggle = () => {
    if (!audio.current) return;
    if (playing) { audio.current.pause(); setPlaying(false); }
    else { audio.current.play().catch(() => {}); setPlaying(true); }
  };

  return (
    <>
      <audio ref={audio} src={src} loop preload="metadata" />
      <motion.div
        initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.6 }}
        style={{ position: 'fixed', bottom: 28, right: 28, zIndex: 800, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }}
              className="panel" style={{ padding: '14px 18px', minWidth: 180 }}>
              <p style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Volume</p>
              <input type="range" min={0} max={1} step={0.05} value={vol} onChange={e => setVol(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--ember)' }} />
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(!open)}
            style={{
              background: 'rgba(12,12,30,0.85)', border: '1px solid rgba(232,184,109,0.2)',
              color: 'var(--gold)', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', fontSize: 14,
              backdropFilter: 'blur(10px)',
            }}>
            🎵
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={toggle}
            style={{
              width: 44, height: 44, borderRadius: '50%',
              background: playing ? 'linear-gradient(135deg, var(--ember), #ff9a6c)' : 'rgba(12,12,30,0.85)',
              border: '1px solid rgba(232,184,109,0.3)',
              color: playing ? 'white' : 'var(--mist)',
              cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(10px)',
              boxShadow: playing ? '0 0 20px rgba(255,107,53,0.4)' : 'none',
            }}>
            {playing ? '⏸' : '▶'}
          </motion.button>
        </div>
      </motion.div>
    </>
  );
}
