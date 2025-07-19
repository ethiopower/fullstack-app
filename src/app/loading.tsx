'use client';

import { Box, CircularProgress } from '@mui/material';
import { colors } from '@/lib/theme';

export default function Loading() {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          animation: 'fadeIn 0.3s ease-out',
        }}
      >
        <CircularProgress
          sx={{
            color: colors.green,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
          size={48}
        />
        <Box
          component="span"
          sx={{
            color: colors.black,
            fontWeight: 500,
            fontSize: '1.1rem',
            opacity: 0.8,
          }}
        >
          Loading...
        </Box>
      </Box>
    </Box>
  );
} 