import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { useProfile } from '../context/ProfileContext';
import Slideshow from '../components/Slideshow';
const BASE_URL = process.env.REACT_APP_API_URL;
/* ── Typewriter hook ── */
function useTypewriter(text, speed = 45, startDelay = 0) {
  const [shown, setShown] = useState('');
  const [done, setDone] = useState(false);
  useEffect(() => {
    setShown(''); setDone(false);
    const delay = setTimeout(() => {
      let i = 0;
      const t = setInterval(() => {
        i++;
        setShown(text.slice(0, i));
        if (i >= text.length) { clearInterval(t); setDone(true); }
      }, speed);
      return () => clearInterval(t);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text, speed, startDelay]);
  return { shown, done };
}

/* ── Live age ── */
function useLiveAge(dob) {
  const [age, setAge] = useState({ y: 0, m: 0, d: 0, total: 0 });
  useEffect(() => {
    if (!dob) return;
    const calc = () => {
      const now = new Date(), b = new Date(dob);
      let y = now.getFullYear() - b.getFullYear();
      let m = now.getMonth() - b.getMonth();
      let d = now.getDate() - b.getDate();
      if (d < 0) { m--; d += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
      if (m < 0) { y--; m += 12; }
      const total = Math.floor((now - b) / 86400000);
      setAge({ y, m, d, total });
    };
    calc();
    const id = setInterval(calc, 30000);
    return () => clearInterval(id);
  }, [dob]);
  return age;
}

/* ── Floating particle ── */
function Particle({ i }) {
  const x = `${Math.random() * 100}vw`;
  const delay = Math.random() * 8;
  const dur = 12 + Math.random() * 12;
  const size = 1.5 + Math.random() * 2;
  const colors = ['#ff6b35', '#e8b86d', '#fff8e7', '#ff9a6c'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  return (
    <motion.div
      style={{
        position: 'absolute', bottom: -10, left: x,
        width: size, height: size, borderRadius: '50%',
        background: color, boxShadow: `0 0 ${size * 3}px ${color}`,
        pointerEvents: 'none',
      }}
      animate={{ y: ['0vh', '-110vh'], opacity: [0, 0.8, 0.8, 0] }}
      transition={{ duration: dur, delay, repeat: Infinity, ease: 'linear' }}
    />
  );
}

/* ── Stat tile ── */
function StatTile({ value, label, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        textAlign: 'center', padding: '24px 20px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(232,184,109,0.15)',
        borderRadius: 16, flex: 1, minWidth: 80,
      }}>
      <div style={{
        fontFamily: 'var(--font-display)', fontWeight: 300,
        fontSize: 'clamp(2rem, 5vw, 3.5rem)', color, lineHeight: 1, marginBottom: 8,
      }}>{value.toLocaleString()}</div>
      <div style={{ fontSize: 11, color: 'var(--fog)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>{label}</div>
    </motion.div>
  );
}

export default function HomePage() {
  const { profile } = useProfile();
  const age = useLiveAge(profile?.dateOfBirth);
  const { shown: bioText } = useTypewriter(profile?.bio || '', 30, 2200);
  const [memories, setMemories] = useState([]);
  const [stats, setStats] = useState({ total: 0, years: 0, favorites: 0 });
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    axios.get(`${BASE_URL}/api/memories`).then(res => {
      setMemories(res.data.slice(0, 10));
      const yrs = new Set(res.data.map(m => m.year)).size;
      const fav = res.data.filter(m => m.isFavorite).length;
      setStats({ total: res.data.length, years: yrs, favorites: fav });
    }).catch(() => {});
  }, []);
/* const profileSrc = profile?.profilePhoto
  ? `${BASE_URL}${profile.profilePhoto}`
  : null; */
  const profileSrc = profile?.profilePhoto || "";
  const dob = profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <div>
      {/* ═══ HERO SECTION ═══ */}
      <section ref={heroRef} style={{
        position: 'relative', minHeight: '100vh', overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: 'calc(var(--nav-h) + 40px) 32px 80px',
      }}>
        {/* Particles */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {Array.from({ length: 28 }, (_, i) => <Particle key={i} i={i} />)}
        </div>

        {/* Parallax bg glow */}
        <motion.div style={{ y: heroY, position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{
            position: 'absolute', top: '15%', left: '50%', transform: 'translateX(-50%)',
            width: '70vw', height: '50vh',
            background: 'radial-gradient(ellipse, rgba(255,107,53,0.09) 0%, transparent 65%)',
          }} />
          <div style={{
            position: 'absolute', top: '40%', left: '15%',
            width: 300, height: 300,
            background: 'radial-gradient(ellipse, rgba(232,184,109,0.06) 0%, transparent 70%)',
          }} />
        </motion.div>

        <motion.div style={{ opacity: heroOpacity, position: 'relative', zIndex: 1, textAlign: 'center', width: '100%', maxWidth: 900 }}>
          {/* Profile photo */}
          {profileSrc && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
              style={{ marginBottom: 36, display: 'inline-block' }}>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <div style={{
                  position: 'absolute', inset: -4, borderRadius: '50%', zIndex: 0,
                  background: 'conic-gradient(from 0deg, var(--ember), var(--gold), var(--ember))',
                  animation: 'spin 6s linear infinite',
                }} />
                <img src={profileSrc} alt={profile.name} style={{
                  width: 130, height: 130, borderRadius: '50%', objectFit: 'cover',
                  position: 'relative', zIndex: 1,
                  border: '4px solid var(--ink)',
                }} />
              </div>
            </motion.div>
          )}

          {/* Small label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            style={{
              fontFamily: 'var(--font-cinzel)', fontSize: '0.7rem',
              letterSpacing: '0.35em', color: 'var(--ember)',
              textTransform: 'uppercase', marginBottom: 20,
            }}>
            — A Life in Memories —
          </motion.div>

          {/* Main name */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="shimmer-gold"
            style={{ marginBottom: 24, lineHeight: 0.95 }}>
            {profile?.name || 'Your Name'}
          </motion.h1>

          {/* DOB */}
          {dob && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              style={{
                fontFamily: 'var(--font-body)', fontSize: 15,
                color: 'var(--fog)', letterSpacing: '0.1em', marginBottom: 36,
              }}>
              Born {dob}
            </motion.div>
          )}

          {/* AGE DISPLAY */}
          {profile?.dateOfBirth && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              style={{
                display: 'inline-flex', gap: 0, marginBottom: 44,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(232,184,109,0.2)',
                borderRadius: 20, overflow: 'hidden',
              }}>
              {[
                { val: age.y, label: 'Years', color: '#ff9a6c' },
                { val: age.m, label: 'Months', color: 'var(--gold)' },
                { val: age.d, label: 'Days', color: 'var(--ember)' },
              ].map((s, i) => (
                <div key={s.label} style={{
                  padding: '20px 36px', textAlign: 'center',
                  borderRight: i < 2 ? '1px solid rgba(232,184,109,0.15)' : 'none',
                }}>
                  <motion.div
                    key={s.val}
                    initial={{ scale: 1.2, color: '#fff' }}
                    animate={{ scale: 1, color: s.color }}
                    style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, lineHeight: 1 }}>
                    {s.val}
                  </motion.div>
                  <div style={{ fontSize: 11, color: 'var(--fog)', letterSpacing: '0.1em', marginTop: 6 }}>{s.label}</div>
                </div>
              ))}
            </motion.div>
          )}

          {/* Typewriter bio */}
          {profile?.bio && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 1.6 }}
              style={{
                maxWidth: 620, margin: '0 auto 52px',
                fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
                fontFamily: 'var(--font-display)', fontStyle: 'italic',
                fontWeight: 300, lineHeight: 1.9, color: 'var(--mist)',
              }}>
              <span>"{bioText}"</span>
              <AnimatePresence>
                {bioText.length < (profile?.bio || '').length && (
                  <motion.span
                    animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }}
                    style={{ borderRight: '2px solid var(--ember)', marginLeft: 2 }}
                  >&#8203;</motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.7 }}
            style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/memories" className="btn btn-ember" style={{ fontSize: 15, padding: '14px 36px' }}>
              Explore Memories ✦
            </Link>
            <Link to="/timeline" className="btn btn-gold" style={{ fontSize: 15 }}>
              View Timeline
            </Link>
            <Link to="/story" className="btn btn-ghost" style={{ fontSize: 15 }}>
              Read My Story
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3 }}
          style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', zIndex: 1 }}>
          <motion.div
            animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{ fontSize: 11, color: 'var(--fog)', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Scroll</div>
            <div style={{ width: 1, height: 40, background: 'linear-gradient(to bottom, var(--ember), transparent)' }} />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ STATS ═══ */}
      {stats.total > 0 && (
        <section style={{ padding: '0 32px 100px', maxWidth: 900, margin: '0 auto' }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            <StatTile value={stats.total} label="Memories" color="#ff9a6c" delay={0} />
            <StatTile value={stats.years} label="Years" color="var(--gold)" delay={0.1} />
            <StatTile value={stats.favorites} label="Favorites" color="#ff6b6b" delay={0.2} />
            <StatTile value={age.total} label="Days Alive" color="var(--mist)" delay={0.3} />
          </motion.div>
        </section>
      )}

      {/* ═══ SLIDESHOW ═══ */}
      {memories.length > 0 && (
        <section style={{ padding: '0 32px 120px', maxWidth: 1200, margin: '0 auto' }}>
          <div className="divider">
            <span>Memories Slideshow</span>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}>
            <Slideshow memories={memories} />
          </motion.div>
        </section>
      )}

      {/* ═══ RECENT MEMORIES ═══ */}
      {memories.length > 0 && (
        <section style={{ padding: '0 32px 120px', maxWidth: 1200, margin: '0 auto' }}>
          <div className="divider"><span>Recent Memories</span></div>
          <div className="mem-grid">
            {memories.slice(0, 6).map((m, i) => {
              const MemCard = require('../components/MemoryCard').default;
              return <MemCard key={m._id} memory={m} index={i} />;
            })}
          </div>
          <motion.div
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/memories" className="btn btn-gold" style={{ fontSize: 15 }}>
              View All Memories →
            </Link><br/>
            <Link to="/admin" className="btn btn-ember" style={{marginTop:"12px",borderRadius:"30px"}}>Go to Admin →</Link>
          </motion.div>
        </section>
      )}

      {/* ═══ EMPTY STATE ═══ */}
      {memories.length === 0 && (
        <section style={{ textAlign: 'center', padding: '40px 32px 100px' }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <div style={{ fontSize: '4rem', marginBottom: 20 }}>📸</div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: 12 }}>No Memories Yet</h3>
            <p style={{ color: 'var(--mist)', marginBottom: 32 }}>Visit the Admin page to start adding your memories.</p>
            <Link to="/admin" className="btn btn-ember">Go to Admin →</Link>
          </motion.div>
        </section>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
