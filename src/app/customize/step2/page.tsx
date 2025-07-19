'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Stack,
  Chip
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { THEME} from '@/lib/constants';


export default function DesignSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gender = searchParams.get('gender') as Gender;
  const occasion = searchParams.get('occasion') as Occasion;

  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);

  useEffect(() => {
    if (!gender || !occasion) {
      router.push('/customize/step1');
    }
  }, [gender, occasion, router]);

  const designs = gender && occasion ? PRODUCT_DESIGNS[gender][occasion] : [];

  const handleDesignSelect = (designId: string) => {
    setSelectedDesign(designId);
  };

  const handleNext = () => {
    if (selectedDesign) {
      const params = new URLSearchParams();
      searchParams.forEach((value, key) => {
        params.append(key, value);
      });
      params.set('design', selectedDesign);
      router.push(`/customize/step3?${params.toString()}`);
    }
  };

  const handleBack = () => {
    router.push('/customize/step1');
  };

  return (
    <Box sx={{ py: THEME.spacing.section, minHeight: '100vh', mt: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontFamily: THEME.typography.headingFamily,
            fontWeight: 500,
            mb: 2
          }}
        >
          Choose Your Design
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
          Select a base design that we'll customize to your preferences
        </Typography>

        <Grid container spacing={4}>
          {designs.map((design) => (
            <Grid item xs={12} sm={6} md={4} key={design.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  outline: selectedDesign === design.id ? `2px solid ${THEME.colors.primary}` : 'none',
                  '&:hover': {
                    transform: 'translateY(-4px)'
                  }
                }}
                onClick={() => handleDesignSelect(design.id)}
              >
                <CardMedia
                  component="img"
                  height="300"
                  image={design.images[0]}
                  alt={design.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {design.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {design.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    Starting from ${design.basePrice.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant={selectedDesign === design.id ? "contained" : "outlined"}
                    sx={{
                      bgcolor: selectedDesign === design.id ? THEME.colors.primary : 'transparent',
                      color: selectedDesign === design.id ? 'white' : THEME.colors.primary,
                      borderColor: THEME.colors.primary,
                      '&:hover': {
                        bgcolor: selectedDesign === design.id ? THEME.colors.secondary : `${THEME.colors.primary}10`
                      }
                    }}
                  >
                    {selectedDesign === design.id ? 'Selected' : 'Select Design'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          justifyContent="center"
          sx={{ mt: 6 }}
        >
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{
              borderColor: THEME.colors.primary,
              color: THEME.colors.primary,
              px: 6,
              '&:hover': {
                borderColor: THEME.colors.secondary,
                color: THEME.colors.secondary
              }
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!selectedDesign}
            sx={{
              bgcolor: THEME.colors.primary,
              color: 'white',
              px: 6,
              '&:hover': {
                bgcolor: THEME.colors.secondary
              }
            }}
          >
            Next: Measurements
          </Button>
        </Stack>
      </Container>
    </Box>
  );
} 