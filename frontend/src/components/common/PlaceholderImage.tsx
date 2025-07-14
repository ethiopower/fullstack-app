'use client';

import { Box } from '@mui/material';
import { colors } from '@/lib/theme';

interface PlaceholderImageProps {
  width?: string | number;
  height?: string | number;
  text?: string;
}

export default function PlaceholderImage({ 
  width = '100%', 
  height = '100%',
  text = 'Placeholder Image'
}: PlaceholderImageProps) {
  return (
    <Box
      sx={{
        width,
        height,
        backgroundColor: 'rgba(15, 157, 88, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: colors.green,
        border: `1px dashed ${colors.green}`,
        borderRadius: 1,
        padding: 2,
        textAlign: 'center',
      }}
    >
      {text}
    </Box>
  );
} 