'use client';

import { Box, Container, Typography } from '@mui/material';
import { colors } from '@/lib/theme';
import PlaceholderImage from '../common/PlaceholderImage';

export default function CulturalBanner() {
  return (
    <Box
      sx={{
        position: 'relative',
        height: '50vh',
        width: '100%',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background Image */}
      <Box sx={{ position: 'absolute', width: '100%', height: '100%' }}>
        <PlaceholderImage text="Cultural Banner Image" />
      </Box>

      {/* Dark Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1,
        }}
      />

      {/* Quote */}
      <Container
        maxWidth="lg"
        sx={{
          position: 'relative',
          zIndex: 2,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            color: colors.white,
            fontWeight: 700,
            fontStyle: 'italic',
            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
            '&::before, &::after': {
              content: '"""',
              color: colors.yellow,
              fontSize: '3rem',
              verticalAlign: 'middle',
              lineHeight: 0,
              position: 'relative',
              top: '-0.2em',
            },
          }}
        >
          Every thread tells a story
        </Typography>
      </Container>
    </Box>
  );
} 