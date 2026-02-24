import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import MemoryCard from '../components/MemoryCard';

export default function MemoriesPage() {
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    axios.get('/api/memories').then(r => setMemories(r.data)).finally(() => setLoading(false));
  }, []);

  const filtered = memories.filter(m => {
    if (filter === 'favorites' && !m.isFavorite) return false;
    if (search) {
      const q = search.toLowerCase();
      return m.title.toLowerCase().includes(q) || m.description?.toLowerCase().includes(q) || m.tags?.some(t => t.toLowerCase().includes(q));
    }
    return true;
  });

  return (
    <div className="page">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        style={{ marginBottom: 60 }}>
        <div className="page-title">Collection</div>
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 16 }}>
          My Memories
        </h1>
        <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, var(--ember), transparent)' }} />
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        style={{ display: 'flex', gap: 14, marginBottom: 48, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          className="input" placeholder="Search memories, tags..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ flex: 1, minWidth: 220 }}
        />
        <button onClick={() => setFilter('all')} className={`btn ${filter === 'all' ? 'btn-ember' : 'btn-ghost'}`}
          style={{ padding: '12px 24px' }}>All</button>
        <button onClick={() => setFilter('favorites')} className={`btn ${filter === 'favorites' ? 'btn-ember' : 'btn-ghost'}`}
          style={{ padding: '12px 24px' }}>❤️ Favorites</button>
      </motion.div>

      {loading && <div className="loader-wrap"><div className="loader" /></div>}

      {!loading && filtered.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: 80 }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 20 }}>✦</div>
          <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--mist)' }}>No memories found</h3>
        </motion.div>
      )}

      <div className="mem-grid">
        {filtered.map((m, i) => <MemoryCard key={m._id} memory={m} index={i} />)}
      </div>
    </div>
  );
}
