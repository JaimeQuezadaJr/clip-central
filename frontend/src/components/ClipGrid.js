import React from 'react';
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
  background-image: ${props => props.src ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
`;

const ClipInfo = styled.div`
  padding: 15px;
`;

const ClipTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.1rem;
  font-weight: 600;
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

const ClipGrid = ({ clips, onClipSelect }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
            <Thumbnail 
              src={clip.thumbnail || `/placeholder-thumbnail.jpg`} 
            />
            <ClipInfo>
              <ClipTitle>{clip.name}</ClipTitle>
              <ClipDate>{formatDate(clip.created)}</ClipDate>
            </ClipInfo>
          </ClipCard>
        ))}
      </Grid>
    </GridContainer>
  );
};

export default ClipGrid; 