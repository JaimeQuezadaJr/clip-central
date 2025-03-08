import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import Hero from './components/Hero';
import ClipGrid from './components/ClipGrid';
import VideoPlayer from './components/VideoPlayer';
import './App.css';

// Replace this:
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// With this:
const API_URL = process.env.NODE_ENV === 'production' 
  ? '' // Empty string for production (uses relative URLs)
  : (process.env.REACT_APP_API_URL || 'http://localhost:8000'); // For development

const AppContainer = styled.div`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: #333;
  background-color: #f5f5f7;
  min-height: 100vh;
  /* Handle iOS safe areas */
  padding-top: env(safe-area-inset-top, 0);
  padding-right: env(safe-area-inset-right, 0);
  padding-bottom: env(safe-area-inset-bottom, 0);
  padding-left: env(safe-area-inset-left, 0);
`;

// Updated ContentSection with subtle background
const ContentSection = styled(motion.div)`
  padding-top: 60px;
  padding-bottom: 80px;
  min-height: 100vh;
  background-color: #f8f8f8; /* Light gray background for content section */
  background-image: radial-gradient(circle at 25px 25px, #f0f0f0 2%, transparent 0%);
  background-size: 50px 50px;
  background-position: 0 0;
`;

// Add a ScrollToTop button component
const ScrollToTopButton = styled(motion.button)`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(12, 74, 110, 0.8);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  z-index: 10;
  
  &:hover {
    background: rgba(12, 74, 110, 1);
  }
  
  svg {
    width: 24px;
    height: 24px;
  }
`;

function App() {
  const [clips, setClips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedClip, setSelectedClip] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  // Auto-scroll to top on page load/reload
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
    
    // Show/hide scroll button based on scroll position
    const handleScroll = () => {
      if (window.pageYOffset > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    // Set background color
    document.documentElement.style.backgroundColor = 'white';
    document.body.style.backgroundColor = 'white';
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
    };
  }, []);
  
  // Fetch clips from API
  useEffect(() => {
    const fetchClips = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await axios.get(`${API_URL}/api/clips`);
        setClips(response.data);
        setLoading(false);
        
        // Check if there's a clip ID in the URL hash
        const clipId = window.location.hash.replace('#clip-', '');
        if (clipId) {
          const clip = response.data.find(c => c.id === clipId);
          if (clip) {
            setSelectedClip(clip);
          }
        }
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
  
  // Handle clip selection and update URL
  const handleClipSelect = (clip) => {
    setSelectedClip(clip);
    // Update URL with clip ID
    window.location.hash = `clip-${clip.id}`;
  };
  
  // Handle closing the player and updating URL
  const closePlayer = () => {
    setSelectedClip(null);
    // Remove clip ID from URL
    window.history.pushState("", document.title, window.location.pathname + window.location.search);
  };
  
  // Listen for hash changes (e.g., when user uses browser back button)
  useEffect(() => {
    const handleHashChange = () => {
      const clipId = window.location.hash.replace('#clip-', '');
      if (clipId) {
        const clip = clips.find(c => c.id === clipId);
        if (clip) {
          setSelectedClip(clip);
        }
      } else {
        setSelectedClip(null);
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [clips]);
  
  // Function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  };
  
  return (
    <AppContainer>
      <Hero />
      
      <ContentSection
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {loading ? (
          <div className="loading">Loading your epic clips...</div>
        ) : error ? (
          <div className="error">Error: {error}</div>
        ) : (
          <ClipGrid clips={clips} onClipSelect={handleClipSelect} />
        )}
      </ContentSection>
      
      <AnimatePresence>
        {selectedClip && (
          <VideoPlayer clip={selectedClip} onClose={closePlayer} />
        )}
      </AnimatePresence>
      
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollButton && (
          <ScrollToTopButton
            onClick={scrollToTop}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
            </svg>
          </ScrollToTopButton>
        )}
      </AnimatePresence>
    </AppContainer>
  );
}

export default App;
