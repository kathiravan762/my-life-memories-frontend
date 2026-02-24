import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useProfile } from '../context/ProfileContext';

export default function BirthdayCelebration() {
  const { profile } = useProfile();
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!profile?.dateOfBirth) return;
    const today = new Date();
    const dob = new Date(profile.dateOfBirth);
    const isBday = today.getMonth() === dob.getMonth() && today.getDate() === dob.getDate();
    if (!isBday) return;
    const key = 'bday_dismissed_' + today.toDateString();
    if (localStorage.getItem(key)) return;
    setTimeout(() => setShow(true), 1500);
  }, [profile]);

  useEffect(() => {
    if (!show || dismissed) return;
    const burst = () => {
      const colors = ['#ff6b35', '#e8b86d', '#fff8e7', '#ff9a6c', '#ffcf8b'];
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.55 }, colors });
      confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 }, colors });
      confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 }, colors });
    };
    burst();
    const id = setInterval(burst, 3500);
    return () => clearInterval(id);
  }, [show, dismissed]);

  const dismiss = () => {
    setDismissed(true);
    localStorage.setItem('bday_dismissed_' + new Date().toDateString(), '1');
  };

  return (
    <AnimatePresence>
      {show && !dismissed && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, zIndex: 9990,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'rgba(3,3,10,0.85)', backdropFilter: 'blur(8px)',
          }}>
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            style={{
              textAlign: 'center', padding: '70px 80px',
              background: 'linear-gradient(160deg, rgba(18,18,42,0.98), rgba(10,10,25,0.98))',
              border: '1px solid rgba(232,184,109,0.35)',
              borderRadius: 32, maxWidth: '90vw',
              boxShadow: '0 0 100px rgba(255,107,53,0.25), 0 0 200px rgba(232,184,109,0.1)',
            }}>
            <motion.div
              animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{ fontSize: '5rem', marginBottom: 24 }}>
              🎂
            </motion.div>
            <div style={{
              fontFamily: 'var(--font-cinzel)',
              fontSize: '0.8rem', letterSpacing: '0.3em',
              color: 'var(--ember)', marginBottom: 16,
            }}>
              TODAY IS YOUR SPECIAL DAY
            </div>
            <h1 className="shimmer-gold" style={{ fontSize: 'clamp(2.2rem, 6vw, 4rem)', marginBottom: 12, lineHeight: 1 }}>
              Happy Birthday
            </h1>
            <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', color: 'var(--pearl)', fontSize: 'clamp(1.8rem, 4vw, 3rem)', marginBottom: 20 }}>
              {profile?.name} ✦
            </h2>
            <p style={{ color: 'var(--mist)', marginBottom: 44, fontSize: 17, maxWidth: 380, margin: '0 auto 44px' }}>
              May this year bring you beautiful moments and memories worth keeping forever.
            </p>
            <button onClick={dismiss} className="btn btn-ember" style={{ fontSize: 16, padding: '14px 44px' }}>
              Thank You 🥂
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
