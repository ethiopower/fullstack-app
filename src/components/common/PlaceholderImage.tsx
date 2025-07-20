'use client';

import { Box, Typography } from '@mui/material';
import BrokenImageIcon from '@mui/icons-material/BrokenImage';
import { THEME } from '@/lib/constants';

type PlaceholderImageProps = {
  text?: string;
  aspectRatio?: string | number;
  height?: string | number;
  showIcon?: boolean;
};

export default function PlaceholderImage({ 
  text = 'Image not available',
  aspectRatio = '1/1',
  height = '100%',
  showIcon = true
}: PlaceholderImageProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height,
        aspectRatio,
        bgcolor: 'grey.100',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'text.secondary',
        padding: 2,
        textAlign: 'center',
        borderRadius: 1,
        background: `linear-gradient(45deg, ${THEME.colors.primary}10, ${THEME.colors.secondary}10)`,
        border: `1px solid ${THEME.colors.primary}20`
      }}
    >
      {showIcon && <BrokenImageIcon sx={{ fontSize: 40, mb: 1, color: THEME.colors.primary }} />}
      <Typography 
        variant="caption"
        sx={{
          color: 'text.secondary',
          fontWeight: 500,
          maxWidth: '80%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
      >
        {text}
      </Typography>
    </Box>
  );
} 