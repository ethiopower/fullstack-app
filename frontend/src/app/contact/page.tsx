'use client';

import { Box, Container, Typography } from '@mui/material';
import { THEME } from '@/lib/constants';

export default function ContactPage() {
  return (
    <Box sx={{ py: THEME.spacing.section, minHeight: '100vh', mt: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontFamily: THEME.typography.headingFamily,
            fontWeight: 500,
            mb: 4
          }}
        >
          Contact Us
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Coming soon...
        </Typography>
      </Container>
    </Box>
  );
} 