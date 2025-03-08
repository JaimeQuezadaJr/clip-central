import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Updated HeroContainer with white background
const HeroContainer = styled.div`
  height: 100vh; /* Full viewport height */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
  color: black;
  text-align: center;
  padding: 0 20px;
  position: relative;
  
  /* Fix for iOS devices to extend background to the top */
  padding-top: env(safe-area-inset-top, 0);
  margin-top: -env(safe-area-inset-top, 0);
`;

const LogoContainer = styled(motion.div)`
  margin-bottom: 2rem;
  width: 200px;
  height: 200px;
  
  @media (max-width: 768px) {
    width: 150px;
    height: 150px;
  }
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const Title = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: -0.5px;
  color: black;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  max-width: 600px;
  margin-bottom: 2rem;
  opacity: 0.8;
  line-height: 1.5;
  color: #333;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

// Scroll indicator with updated colors
const ScrollIndicator = styled(motion.div)`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const ScrollText = styled.div`
  font-size: 0.9rem;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.7;
  color: #333;
`;

const ScrollIcon = styled(motion.div)`
  width: 30px;
  height: 50px;
  border: 2px solid rgba(0, 0, 0, 0.3);
  border-radius: 15px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    width: 6px;
    height: 6px;
    background: black;
    border-radius: 50%;
    transform: translateX(-50%);
  }
`;

// New YouTube handle component
const YouTubeHandle = styled(motion.a)`
  font-size: 1.3rem;
  font-weight: 600;
  color: #333;
  text-decoration: none;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  
  span {
    margin-right: 4px;
    opacity: 0.7;
  }
  
  svg {
    margin-left: 8px;
    transition: transform 0.3s ease;
  }
  
  &:hover {
    color: #c4302b;
    
    svg {
      transform: scale(1.2);
    }
  }
`;

// YouTube icon component
const YouTubeIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="currentColor"
    style={{ marginLeft: '8px' }}
  >
    <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
  </svg>
);

const Hero = () => {
  // Function to scroll to the clips section
  const scrollToClips = () => {
    const clipsSection = document.getElementById('clips-section');
    if (clipsSection) {
      clipsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <HeroContainer>
      <LogoContainer
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        <Logo src="/images/lannister-logo.png" alt="Logo" />
      </LogoContainer>
      
      {/* Add YouTube handle below the logo */}
      <YouTubeHandle 
        href="https://www.youtube.com/@maverickjrx" 
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <span>@</span>maverickjrx
        <YouTubeIcon />
      </YouTubeHandle>
      
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Fortnite Clip Central
      </Title>
      
      <Subtitle
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        Check out my collection of the most incredible plays, victories, and highlights
      </Subtitle>
      
      <ScrollIndicator
        onClick={scrollToClips}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <ScrollText>Scroll to see clips</ScrollText>
        <ScrollIcon
          animate={{ 
            y: [0, 10, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut" 
          }}
        >
          <motion.div
            animate={{ 
              y: [0, 15, 0],
              opacity: [1, 0, 1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 1.5,
              ease: "easeInOut" 
            }}
            style={{
              width: '6px',
              height: '6px',
              background: 'black',
              borderRadius: '50%',
              position: 'absolute',
              top: '8px',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </ScrollIcon>
      </ScrollIndicator>
    </HeroContainer>
  );
};

export default Hero; 