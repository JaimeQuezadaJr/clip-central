import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeroContainer = styled.div`
  height: 100vh; /* Full viewport height */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0c4a6e, #0369a1);
  color: white;
  text-align: center;
  padding: 0 20px;
  position: relative; /* For positioning the scroll indicator */
  
  /* Fix for iOS devices to extend background to the top */
  padding-top: env(safe-area-inset-top, 0);
  margin-top: -env(safe-area-inset-top, 0);
`;

const LogoText = styled(motion.div)`
  font-size: 1.2rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 2rem;
  font-weight: 500;
  opacity: 0.8;
`;

const Title = styled(motion.h1)`
  font-size: 4.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: -0.5px;
  
  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

const Subtitle = styled(motion.p)`
  font-size: 1.5rem;
  max-width: 600px;
  margin-bottom: 2rem;
  opacity: 0.9;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

// New scroll indicator component
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
`;

const ScrollIcon = styled(motion.div)`
  width: 30px;
  height: 50px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 15px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 8px;
    left: 50%;
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
    transform: translateX(-50%);
  }
`;

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
      <LogoText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        Fortnite Clips
      </LogoText>
      <Title
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Epic Fortnite Moments
      </Title>
      <Subtitle
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
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
              background: 'white',
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