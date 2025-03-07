import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const HeroContainer = styled.div`
  height: 80vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0c4a6e, #0369a1);
  color: white;
  text-align: center;
  padding: 0 20px;
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

const LogoText = styled(motion.div)`
  font-size: 1.2rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 2rem;
  font-weight: 500;
  opacity: 0.8;
`;

const Hero = () => {
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
    </HeroContainer>
  );
};

export default Hero; 