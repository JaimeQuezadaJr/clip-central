import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const GridContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const ClipCard = styled(motion.div)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const Thumbnail = styled.div`
  height: 180px;
  background-color: #eee;
  position: relative;
  overflow: hidden;
`;

// Add the missing ThumbnailOverlay component
const ThumbnailOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ClipCard}:hover & {
    opacity: 1;
  }
`;

// Add the missing PlayButton component
const PlayButton = styled.div`
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  
  svg {
    width: 20px;
    height: 20px;
    margin-left: 4px; /* Slight offset for play icon */
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: ${props => props.loaded ? 1 : 0};
  transition: opacity 0.3s ease;
`;

const FallbackThumbnail = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0c4a6e, #0369a1);
  color: white;
  
  svg {
    width: 50px;
    height: 50px;
    opacity: 0.8;
  }
`;

const ClipInfo = styled.div`
  padding: 15px;
`;

const ClipTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ClipDate = styled.p`
  margin: 0;
  color: #888;
  font-size: 0.9rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 600;
  margin-bottom: 30px;
  text-align: center;
`;

// Play icon SVG
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

// Thumbnail component that handles loading and errors
const ClipThumbnail = ({ clip }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Function to get a direct thumbnail URL
  const getThumbnailUrl = (clip) => {
    // Try to use the thumbnail URL from the API response
    if (clip.thumbnail) {
      return clip.thumbnail;
    }
    
    // Fallback to a direct Google Drive thumbnail URL
    return `https://drive.google.com/thumbnail?id=${clip.id}&sz=w320-h180`;
  };
  
  return (
    <Thumbnail>
      {!error ? (
        <ThumbnailImage 
          src={getThumbnailUrl(clip)}
          alt={clip.name}
          loaded={loaded}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      ) : (
        <FallbackThumbnail>
          <PlayIcon />
        </FallbackThumbnail>
      )}
      <ThumbnailOverlay>
        <PlayButton>
          <PlayIcon />
        </PlayButton>
      </ThumbnailOverlay>
    </Thumbnail>
  );
};

const ClipGrid = ({ clips, onClipSelect }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Function to get a clean display name
  const getDisplayName = (filename) => {
    // Remove file extension
    return filename.replace(/\.[^/.]+$/, "");
  };

  return (
    <GridContainer>
      <SectionTitle>Latest Clips</SectionTitle>
      <Grid>
        {clips.map((clip, index) => (
          <ClipCard
            key={clip.id}
            onClick={() => onClipSelect(clip)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <ClipThumbnail clip={clip} />
            <ClipInfo>
              <ClipTitle>{getDisplayName(clip.name)}</ClipTitle>
              <ClipDate>{formatDate(clip.created)}</ClipDate>
            </ClipInfo>
          </ClipCard>
        ))}
      </Grid>
    </GridContainer>
  );
};

export default ClipGrid; 