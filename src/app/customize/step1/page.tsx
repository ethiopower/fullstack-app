'use client';

import { useState, useEffect } from 'react';
import {
  Alert,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Chip,
  Box
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { THEME, PRODUCT_DESIGNS, Gender, Occasion } from '@/lib/constants';

interface Person {
  id: string;
  name: string;
  gender: 'men' | 'women' | 'children';
}

// Client-side component for the form
export default function StyleSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const personId = searchParams.get('personId');
  
  const [people, setPeople] = useState<Person[]>([]);
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null);
  useEffect(() => {
    // Load people from sessionStorage
    if (typeof window === 'undefined') return;
    
    const storedPeople = sessionStorage.getItem('orderPeople');
    if (!storedPeople || !personId) {
      router.push('/customize/step0');
      return;
    }

    try {
      const peopleList = JSON.parse(storedPeople) as Person[];
      setPeople(peopleList);
      
      const person = peopleList.find(p => p.id === personId);
      if (person) {
        setCurrentPerson(person);
      } else {
        router.push('/customize/step0');
      }
    } catch (error) {
      router.push('/customize/step0');
    }
  }, [personId, router]);

  const handleNext = () => {
    if (currentPerson) {
      const params = new URLSearchParams();
      params.set('personId', currentPerson.id);
      params.set('gender', currentPerson.gender);
      router.push(`/customize/step2?${params.toString()}`);
    }
  };

  if (!currentPerson) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        bgcolor: 'background.default'
      }}>
        <Stack spacing={3} alignItems="center">
          <Box sx={{ 
            width: 40, 
            height: 40, 
            borderRadius: '50%',
            border: '3px solid',
            borderColor: `${THEME.colors.primary}50`,
            borderTopColor: THEME.colors.primary,
            animation: 'spin 1s linear infinite',
            '@keyframes spin': {
              '0%': { transform: 'rotate(0deg)' },
              '100%': { transform: 'rotate(360deg)' }
            }
          }} />
          <Typography color="text.secondary">
            Loading your customization details...
          </Typography>
        </Stack>
      </Box>
    );
  }

  // We're skipping occasion selection, so we don't need this anymore
  // const availableOccasions = Object.keys(PRODUCT_DESIGNS[currentPerson.gender as Gender]) as Occasion[];

  return (
    <>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2rem', md: '2.5rem' },
          fontFamily: THEME.typography.headingFamily,
          fontWeight: 500,
          mb: 2,
          color: 'text.primary'
        }}
      >
        Create Your Custom Design
      </Typography>

      <Typography 
        variant="h6" 
        sx={{ 
          mb: 6,
          color: 'text.secondary',
          fontFamily: THEME.typography.headingFamily
        }}
      >
        Let's design your perfect attire
      </Typography>

      <Grid container spacing={4}>
        {/* Person Information */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%',
              bgcolor: 'background.paper',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  fontSize: '1.25rem',
                  fontFamily: THEME.typography.headingFamily,
                  color: 'text.primary',
                  mb: 3
                }}
              >
                Designing for: {currentPerson.name}
              </Typography>
              <Chip
                label={`${currentPerson.gender.charAt(0).toUpperCase() + currentPerson.gender.slice(1)}'s Collection`}
                sx={{
                  bgcolor: THEME.colors.primary,
                  color: 'white',
                  fontSize: '1rem',
                  py: 2,
                  px: 3
                }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Next Step Button */}
        <Grid item xs={12} md={6}>
          <Card 
            elevation={0} 
            sx={{ 
              height: '100%',
              bgcolor: 'background.paper',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)'
              }
            }}
          >
            <CardContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleNext}
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  bgcolor: THEME.colors.primary,
                  '&:hover': {
                    bgcolor: THEME.colors.secondary
                  }
                }}
              >
                Continue to Sizing
              </Button>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ mt: 2, textAlign: 'center' }}
              >
                We'll help you choose the perfect measurements in the next step
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>


    </>
  );
} 