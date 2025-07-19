'use client';

import { Box } from '@mui/material';
import ReactPlayer from 'react-player';
import Image from 'next/image';
import { useState } from 'react';
import { BUSINESS_INFO } from '@/lib/constants';

export default function YouTubeEmbed() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <Box 
      component="section" 
      sx={{ 
        width: '100%',
        position: 'relative',
        paddingTop: '56.25%', // 16:9 aspect ratio
        bgcolor: 'black',
        cursor: 'pointer'
      }}
      onClick={() => setIsPlaying(true)}
    >
      {!isPlaying && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
          }}
        >
          <Image
            src="/images/instagram/imgi_13_278392924_109404108407718_3275092387011595748_n.webp"
            alt="Video Thumbnail"
            fill
            style={{ objectFit: 'cover' }}
          />
          {/* Play button overlay */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '80px',
              height: '80px',
              bgcolor: 'rgba(0, 0, 0, 0.7)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              '&::before': {
                content: '""',
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: '15px 0 15px 25px',
                borderColor: 'transparent transparent transparent white',
                marginLeft: '5px'
              }
            }}
          />
          {/* Dark overlay for better contrast */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(0, 0, 0, 0.3)',
            }}
          />
        </Box>
      )}
      <ReactPlayer
        url={BUSINESS_INFO.youtubeUrl}
        width="100%"
        height="100%"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
        }}
        playing={isPlaying}
        controls={isPlaying}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0
            }
          }
        }}
      />
    </Box>
  );
} 