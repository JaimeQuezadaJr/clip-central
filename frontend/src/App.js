import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Hero from './components/Hero';
import ClipGrid from './components/ClipGrid';
import VideoPlayer from './components/VideoPlayer';
import './App.css';

const AppContainer = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #333;
  background-color: #f5f5f7;
  min-height: 100vh;
`;

function App() {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClip, setSelectedClip] = useState(null);
  
  useEffect(() => {
    const fetchClips = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // First try a test endpoint to check if the server is responding
        await axios.get('http://localhost:8000/test');
        
        const response = await axios.get('http://localhost:8000/api/clips');
        setClips(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clips:', error);
        setError(error.message || 'Failed to fetch clips');
        setLoading(false);
      }
    };
    
    fetchClips();
    
    // Refresh clips every 5 minutes
    const interval = setInterval(fetchClips, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);
  
  const handleClipSelect = (clip) => {
    setSelectedClip(clip);
  };
  
  const closePlayer = () => {
    setSelectedClip(null);
  };
  
  return (
    <AppContainer>
      <Hero />
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {loading ? (
          <div className="loading">Loading your epic clips...</div>
        ) : error ? (
          <div className="error">Error: {error}</div>
        ) : (
          <ClipGrid clips={clips} onClipSelect={handleClipSelect} />
        )}
      </motion.div>
      
      <AnimatePresence>
        {selectedClip && (
          <VideoPlayer clip={selectedClip} onClose={closePlayer} />
        )}
      </AnimatePresence>
    </AppContainer>
  );
}

export default App;
