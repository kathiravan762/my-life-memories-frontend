import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import MemoriesPage from './pages/MemoriesPage';
import TimelinePage from './pages/TimelinePage';
import LifeStoryPage from './pages/LifeStoryPage';
import AdminPage from './pages/AdminPage';
import BirthdayCelebration from './components/BirthdayCelebration';
import MusicPlayer from './components/MusicPlayer';
import { ProfileProvider } from './context/ProfileContext';
import './styles/global.css';

export default function App() {
  return (
    <ProfileProvider>
      <BrowserRouter>
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(12,12,30,0.95)',
              color: '#f5f0e8',
              border: '1px solid rgba(232,184,109,0.25)',
              backdropFilter: 'blur(20px)',
              fontFamily: 'DM Sans, sans-serif',
              fontSize: 14,
            }
          }}
        />
        <Navigation />
        <BirthdayCelebration />
        <MusicPlayer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/memories" element={<MemoriesPage />} />
          <Route path="/timeline" element={<TimelinePage />} />
          <Route path="/story" element={<LifeStoryPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </ProfileProvider>
  );
}
