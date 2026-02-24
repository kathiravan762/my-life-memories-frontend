import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useProfile } from '../context/ProfileContext';

const MOODS = ['happy','nostalgic','excited','peaceful','adventurous','loving','proud','grateful'];
const MOOD_ICONS = { happy:'😊', nostalgic:'🥺', excited:'🎉', peaceful:'😌', adventurous:'🌟', loving:'💕', proud:'🏆', grateful:'🙏' };

function Tab({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '10px 24px', border: 'none', cursor: 'pointer',
      background: active ? 'linear-gradient(135deg, var(--ember), #ff9a6c)' : 'transparent',
      color: active ? 'white' : 'var(--mist)',
      borderRadius: 8, fontFamily: 'var(--font-body)', fontSize: 14,
      fontWeight: active ? 600 : 400,
      transition: 'all 0.2s',
    }}>{label}</button>
  );
}

export default function AdminPage() {
  const { profile, refetch } = useProfile();
  const navigate = useNavigate();
  const [secret, setSecret] = useState('');
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState('upload');
  const [photos, setPhotos] = useState([]);
  const [cur, setCur] = useState(0);
  const [saving, setSaving] = useState(false);
  const [genCaption, setGenCaption] = useState(false);
  const defaultForm = () => ({ title: '', description: '', date: new Date().toISOString().split('T')[0], location: '', mood: 'happy', aiCaption: '', tags: '' });
  const [forms, setForms] = useState([]);

  // Profile form
  const [pForm, setPForm] = useState({
    name: profile?.name || '', bio: profile?.bio || '',
    tagline: profile?.tagline || '',
    dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
    musicEnabled: profile?.musicEnabled || false,
  });
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [bgMusic, setBgMusic] = useState(null);

  const onDrop = useCallback((files) => {
    const news = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setPhotos(p => [...p, ...news]);
    setForms(f => [...f, ...news.map(() => defaultForm())]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop, accept: { 'image/*': [] }, multiple: true
  });

  const upd = (i, k, v) => setForms(f => f.map((x, xi) => xi === i ? { ...x, [k]: v } : x));

  const aiCaption = async (i) => {
    setGenCaption(true);
    try {
      const f = forms[i];
      const r = await axios.post('/api/ai/caption', { title: f.title || 'Memory', description: f.description, date: f.date, mood: f.mood, location: f.location });
      upd(i, 'aiCaption', r.data.caption);
      toast.success('Caption ready ✦');
    } catch { toast.error('AI unavailable'); }
    finally { setGenCaption(false); }
  };

  const upload = async (e) => {
    e.preventDefault();
    if (!photos.length) return toast.error('Add photos first');
    setSaving(true);
    let ok = 0;
    for (let i = 0; i < photos.length; i++) {
      const f = forms[i];
      if (!f.title || !f.date) { toast.error(`Memory ${i + 1}: title & date required`); continue; }
      const fd = new FormData();
      fd.append('photo', photos[i].file);
      Object.entries(f).forEach(([k, v]) => {
        if (k === 'tags') fd.append('tags', JSON.stringify(v.split(',').map(t => t.trim()).filter(Boolean)));
        else fd.append(k, v);
      });
      try {
       await axios.post('http://localhost:5000/api/memories', fd, { headers: { 'Content-Type': 'multipart/form-data', 'x-admin-secret': secret } });
        ok++;
      } catch { toast.error(`Failed memory ${i + 1}`); }
    }
    setSaving(false);
    if (ok > 0) { toast.success(`${ok} memory(ies) saved!`); navigate('/memories'); }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(pForm).forEach(([k, v]) => fd.append(k, v));
      if (profilePhoto) fd.append('profilePhoto', profilePhoto);
      if (bgMusic) fd.append('backgroundMusic', bgMusic);
      await axios.put('http://localhost:5000/api/profile', fd, { headers: { 'Content-Type': 'multipart/form-data', 'x-admin-secret': secret } });
      toast.success('Profile updated!');
      refetch();
    } catch { toast.error('Failed to save'); }
    finally { setSaving(false); }
  };

  // Secret gate
  if (!authed) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="panel" style={{ padding: '52px 48px', maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 20 }}>🔐</div>
        <h2 style={{ fontFamily: 'var(--font-display)', marginBottom: 8 }}>Admin Access</h2>
        <p style={{ color: 'var(--mist)', marginBottom: 32, fontSize: 14 }}>Enter your admin secret to manage memories</p>
        <form onSubmit={e => { e.preventDefault(); setAuthed(true); }}>
          <div className="form-group" style={{ marginBottom: 28 }}>
            <label>Admin Secret</label>
            <input className="input" type="password" value={secret} onChange={e => setSecret(e.target.value)} placeholder="Enter ADMIN_SECRET from .env" required />
          </div>
          <button type="submit" className="btn btn-ember" style={{ width: '100%', justifyContent: 'center' }}>
            Enter Admin Panel
          </button>
        </form>
      </motion.div>
    </div>
  );

  return (
    <div className="page">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 48 }}>
        <div className="page-title">Admin Panel</div>
        <h1 style={{ fontFamily: 'var(--font-display)', marginBottom: 20 }}>Manage Content</h1>
        <div style={{ display: 'flex', gap: 8, background: 'rgba(255,255,255,0.03)', padding: 6, borderRadius: 12, width: 'fit-content', border: '1px solid rgba(232,184,109,0.1)' }}>
          {['upload', 'profile'].map(t => <Tab key={t} label={t === 'upload' ? '📸 Upload Memory' : '👤 Edit Profile'} active={tab === t} onClick={() => setTab(t)} />)}
        </div>
      </motion.div>

      {/* UPLOAD TAB */}
      {tab === 'upload' && (
        <form onSubmit={upload}>
          {/* Dropzone */}
          <div {...getRootProps()} style={{
            border: `2px dashed ${isDragActive ? 'var(--ember)' : 'rgba(232,184,109,0.2)'}`,
            borderRadius: 20, padding: '52px 32px', textAlign: 'center',
            background: isDragActive ? 'rgba(255,107,53,0.06)' : 'rgba(255,255,255,0.02)',
            cursor: 'pointer', marginBottom: 32, transition: 'all 0.2s',
          }}>
            <input {...getInputProps()} />
            <div style={{ fontSize: '3rem', marginBottom: 14 }}>{isDragActive ? '✦' : '📸'}</div>
            <p style={{ color: isDragActive ? 'var(--ember)' : 'var(--mist)', fontSize: 17 }}>
              {isDragActive ? 'Drop photos here' : 'Drag & drop photos or click to select'}
            </p>
            <p style={{ color: 'var(--fog)', fontSize: 13, marginTop: 6 }}>JPG, PNG, WebP · up to 15MB</p>
          </div>

          {/* Thumbnails */}
          {photos.length > 0 && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 32 }}>
              {photos.map((p, i) => (
                <div key={i} onClick={() => setCur(i)} style={{
                  position: 'relative', cursor: 'pointer',
                  border: `2px solid ${cur === i ? 'var(--ember)' : 'rgba(232,184,109,0.15)'}`,
                  borderRadius: 10, overflow: 'hidden',
                  boxShadow: cur === i ? '0 0 16px var(--ember-glow)' : 'none',
                }}>
                  <img src={p.preview} alt="" style={{ width: 76, height: 76, objectFit: 'cover', display: 'block' }} />
                  <button type="button" onClick={e => { e.stopPropagation(); setPhotos(x => x.filter((_, xi) => xi !== i)); setForms(x => x.filter((_, xi) => xi !== i)); }}
                    style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(0,0,0,0.7)', border: 'none', color: 'white', borderRadius: '50%', width: 18, height: 18, cursor: 'pointer', fontSize: 12, lineHeight: '18px', textAlign: 'center', padding: 0 }}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Form for current photo */}
          {photos.length > 0 && forms[cur] && (
            <motion.div key={cur} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              className="panel" style={{ padding: 36 }}>
              <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 28, color: 'var(--gold)' }}>
                Memory {cur + 1} / {photos.length}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Title *</label>
                  <input className="input" value={forms[cur].title} onChange={e => upd(cur, 'title', e.target.value)} placeholder="Memory title" required />
                </div>
                <div className="form-group">
                  <label>Date *</label>
                  <input className="input" type="date" value={forms[cur].date} onChange={e => upd(cur, 'date', e.target.value)} required />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input className="input" value={forms[cur].location} onChange={e => upd(cur, 'location', e.target.value)} placeholder="Where was this?" />
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>Description</label>
                  <textarea className="input" value={forms[cur].description} onChange={e => upd(cur, 'description', e.target.value)} placeholder="Tell the story..." />
                </div>
                <div className="form-group">
                  <label>Tags</label>
                  <input className="input" value={forms[cur].tags} onChange={e => upd(cur, 'tags', e.target.value)} placeholder="family, beach, summer..." />
                </div>
                <div className="form-group">
                  <label>Mood</label>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                    {MOODS.map(m => (
                      <button key={m} type="button" onClick={() => upd(cur, 'mood', m)} style={{
                        padding: '5px 12px', borderRadius: 20, border: '1px solid',
                        borderColor: forms[cur].mood === m ? 'var(--ember)' : 'rgba(232,184,109,0.2)',
                        background: forms[cur].mood === m ? 'rgba(255,107,53,0.15)' : 'transparent',
                        color: forms[cur].mood === m ? 'var(--ember)' : 'var(--fog)',
                        cursor: 'pointer', fontSize: 12,
                      }}>{MOOD_ICONS[m]} {m}</button>
                    ))}
                  </div>
                </div>
                <div className="form-group" style={{ gridColumn: '1/-1' }}>
                  <label>AI Caption</label>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <textarea className="input" value={forms[cur].aiCaption} onChange={e => upd(cur, 'aiCaption', e.target.value)} placeholder="Generate or write caption..." style={{ minHeight: 80 }} />
                    <button type="button" onClick={() => aiCaption(cur)} disabled={genCaption} className="btn btn-gold" style={{ alignSelf: 'start', whiteSpace: 'nowrap', minWidth: 140 }}>
                      {genCaption ? 'Writing...' : '✦ AI Generate'}
                    </button>
                  </div>
                </div>
              </div>
              {photos.length > 1 && (
                <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
                  <button type="button" onClick={() => setCur(c => Math.max(0, c - 1))} disabled={cur === 0} className="btn btn-ghost" style={{ padding: '8px 20px' }}>← Prev</button>
                  <button type="button" onClick={() => setCur(c => Math.min(photos.length - 1, c + 1))} disabled={cur === photos.length - 1} className="btn btn-ghost" style={{ padding: '8px 20px' }}>Next →</button>
                </div>
              )}
            </motion.div>
          )}

          {photos.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: 40 }}>
              <button type="submit" disabled={saving} className="btn btn-ember" style={{ fontSize: 17, padding: '15px 56px' }}>
                {saving ? 'Saving...' : `✦ Save ${photos.length} Memory(ies)`}
              </button>
            </div>
          )}
        </form>
      )}

      {/* PROFILE TAB */}
      {tab === 'profile' && (
        <form onSubmit={saveProfile}>
          <div className="panel" style={{ padding: 36 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Display Name</label>
                <input className="input" value={pForm.name} onChange={e => setPForm({ ...pForm, name: e.target.value })} placeholder="Your full name" />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input className="input" type="date" value={pForm.dateOfBirth} onChange={e => setPForm({ ...pForm, dateOfBirth: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Tagline</label>
                <input className="input" value={pForm.tagline} onChange={e => setPForm({ ...pForm, tagline: e.target.value })} placeholder="Short tagline" />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label>Bio</label>
                <textarea className="input" value={pForm.bio} onChange={e => setPForm({ ...pForm, bio: e.target.value })} placeholder="About you..." />
              </div>
              <div className="form-group">
                <label>Profile Photo</label>
                <input type="file" accept="image/*" onChange={e => setProfilePhoto(e.target.files[0])} style={{ color: 'var(--mist)', fontSize: 14 }} />
              </div>
              <div className="form-group">
                <label>Background Music (MP3)</label>
                <input type="file" accept="audio/*" onChange={e => setBgMusic(e.target.files[0])} style={{ color: 'var(--mist)', fontSize: 14 }} />
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, cursor: 'pointer', fontSize: 14, color: 'var(--mist)', fontWeight: 400 }}>
                  <input type="checkbox" checked={pForm.musicEnabled} onChange={e => setPForm({ ...pForm, musicEnabled: e.target.checked })} style={{ accentColor: 'var(--ember)' }} />
                  Enable music player
                </label>
              </div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <button type="submit" disabled={saving} className="btn btn-ember" style={{ fontSize: 17, padding: '15px 56px' }}>
              {saving ? 'Saving...' : '✦ Save Profile'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
