import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { motion, useAnimation } from 'framer-motion';

// Get API URL from environment variables with fallback
const API_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : (process.env.REACT_APP_API_URL || 'http://localhost:8000');

const GridContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 80px;
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

// Play icon SVG
const PlayIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

// Simplified ClipThumbnail component
const ClipThumbnail = ({ clip }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Function to get a thumbnail URL through your proxy
  const getThumbnailUrl = (clip) => {
    return `${API_URL}/api/proxy-thumbnail/${clip.id}`;
  };
  
  return (
    <Thumbnail>
      {!imageError ? (
        <>
          {!imageLoaded && (
            <FallbackThumbnail>
              <LoadingSpinner />
            </FallbackThumbnail>
          )}
          <ThumbnailImage 
            src={getThumbnailUrl(clip)}
            alt={clip.name}
            style={{ opacity: imageLoaded ? 1 : 0 }}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              console.error(`Failed to load thumbnail for ${clip.name}`);
              setImageError(true);
            }}
          />
        </>
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

// Add a loading spinner component
const LoadingSpinner = styled.div`
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ClipGrid = ({ clips, onClipSelect }) => {
  const controls = useAnimation();
  const gridRef = useRef(null);
  
  // Set up Intersection Observer to trigger animations when grid comes into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When grid enters viewport
        if (entry.isIntersecting) {
          controls.start('visible');
        }
      },
      { threshold: 0.1 } // Trigger when 10% of the element is visible
    );
    
    if (gridRef.current) {
      observer.observe(gridRef.current);
    }
    
    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current);
      }
    };
  }, [controls]);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Stagger the animations of children
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDisplayName = (filename) => {
    return filename.replace(/\.[^/.]+$/, "");
  };

  return (
    <GridContainer id="clips-section" ref={gridRef}>
      <Grid
        as={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
      >
        {clips.map((clip) => (
          <ClipCard
            key={clip.id}
            onClick={() => onClipSelect(clip)}
            variants={itemVariants}
            // No need for initial, animate, or transition props here
            // as they're inherited from the parent motion component
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