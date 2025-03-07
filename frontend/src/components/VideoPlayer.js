import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

const PlayerContainer = styled(motion.div)`
  width: 90%;
  max-width: 1200px;
  background: black;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  
  &::before {
    content: "";
    display: block;
    padding-top: 56.25%;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 20px;
  z-index: 10;
  
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const VideoFrame = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
  object-fit: contain;
`;

const VideoPlayer = ({ clip, onClose }) => {
  // Create a better Google Drive embed URL
  const embedUrl = `https://drive.google.com/file/d/${clip.id}/preview`;
  
  return (
    <Overlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <PlayerContainer
        onClick={(e) => e.stopPropagation()}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <CloseButton onClick={onClose}>×</CloseButton>
        <VideoFrame 
          src={embedUrl}
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </PlayerContainer>
    </Overlay>
  );
};

export default VideoPlayer; 