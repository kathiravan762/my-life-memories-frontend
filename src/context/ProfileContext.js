import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const ProfileContext = createContext(null);
export const useProfile = () => useContext(ProfileContext);


export const ProfileProvider = ({ children }) => {
const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const BASE_URL = process.env.REACT_APP_API_URL;
   try {
    const res = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/profile`
    );
    setProfile(res.data);
  } catch (e) {
    console.error('Profile fetch failed', e);
  } finally {
    setLoading(false);
  }
    } catch (e) {
      console.error('Profile fetch failed', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, refetch: fetchProfile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
