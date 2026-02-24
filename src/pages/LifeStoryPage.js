import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

function StoryParagraph({ text, index }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.8 }}
      style={{
        fontSize: 'clamp(1rem, 2vw, 1.15rem)',
        fontFamily: 'var(--font-display)',
        fontWeight: 300, lineHeight: 2,
        color: 'rgba(245,240,232,0.88)',
        marginBottom: 36,
        textIndent: index > 0 ? '2.5em' : 0,
      }}>
      {text}
    </motion.p>
  );
}

export default function LifeStoryPage() {
  const [story, setStory] = useState('');
  const [loading, setLoading] = useState(false);
  const [paragraphs, setParagraphs] = useState([]);

  useEffect(() => {
    if (story) setParagraphs(story.split('\n\n').filter(p => p.trim()));
  }, [story]);

  const generate = async () => {
    setLoading(true);
    setStory('');
    try {
      const res = await axios.post('/api/ai/life-story');
      setStory(res.data.story);
      toast.success('Your story has been written ✦');
    } catch {
      toast.error('Could not generate story. Check your API key.');
    } finally { setLoading(false); }
  };

  return (
    <div className="page" style={{ maxWidth: 800 }}>
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
        style={{ marginBottom: 60 }}>
        <div className="page-title">AI Narrative</div>
        <h1 style={{ fontFamily: 'var(--font-display)' }}>My Life Story</h1>
        <div style={{ width: 60, height: 2, background: 'linear-gradient(90deg, var(--ember), transparent)', marginTop: 20 }} />
      </motion.div>

      {!story && !loading && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ textAlign: 'center', padding: '80px 32px' }}
          className="panel">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            style={{ fontSize: '5rem', marginBottom: 28 }}>
            📖
          </motion.div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', marginBottom: 20, color: 'var(--pearl)' }}>
            Let AI Write Your Story
          </h2>
          <p style={{ color: 'var(--mist)', marginBottom: 48, maxWidth: 480, margin: '0 auto 48px', fontSize: 17, lineHeight: 1.8 }}>
            Claude AI will read through all your memories and craft a beautiful, 
            emotional autobiographical narrative — your life told as literature.
          </p>
          <button onClick={generate} className="btn btn-ember" style={{ fontSize: 16, padding: '16px 52px' }}>
            ✦ Generate My Story
          </button>
        </motion.div>
      )}

      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          style={{ textAlign: 'center', padding: '80px 32px' }} className="panel">
          <div className="loader" style={{ margin: '0 auto 28px' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', marginBottom: 12 }}>
            Weaving your narrative...
          </h3>
          <p style={{ color: 'var(--mist)' }}>Claude is reading your memories and crafting your story</p>
        </motion.div>
      )}

      {story && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Drop cap first letter */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 80, height: 3, borderRadius: 2, marginBottom: 40,
              background: 'linear-gradient(90deg, var(--ember), var(--gold))',
            }} />
            {paragraphs.map((p, i) => (
              <StoryParagraph key={i} text={p} index={i} />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 14, marginTop: 60, justifyContent: 'center' }}>
            <button onClick={generate} className="btn btn-gold">✦ Regenerate</button>
            <button onClick={() => navigator.clipboard.writeText(story).then(() => toast.success('Copied!'))}
              className="btn btn-ghost">📋 Copy</button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
