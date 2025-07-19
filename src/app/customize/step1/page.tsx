'use client';

import { useState, useEffect } from 'react';
import {
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
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion | ''>('');

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
    if (currentPerson && selectedOccasion) {
      const params = new URLSearchParams();
      params.set('personId', currentPerson.id);
      params.set('gender', currentPerson.gender);
      params.set('occasion', selectedOccasion);
      router.push(`/customize/step2?${params.toString()}`);
    }
  };

  if (!currentPerson) {
    return <div>Loading...</div>;
  }

  // Get available occasions for the selected gender
  const availableOccasions = Object.keys(PRODUCT_DESIGNS[currentPerson.gender as Gender]) as Occasion[];

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

        {/* Occasion Selection */}
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
              <FormControl component="fieldset" fullWidth>
                <FormLabel
                  component="legend"
                  sx={{
                    fontSize: '1.25rem',
                    fontFamily: THEME.typography.headingFamily,
                    color: 'text.primary',
                    mb: 3
                  }}
                >
                  What's the occasion?
                </FormLabel>
                <RadioGroup
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value as Occasion)}
                >
                  <Stack spacing={2}>
                    {availableOccasions.map((occasionId) => (
                      <FormControlLabel
                        key={occasionId}
                        value={occasionId}
                        control={
                          <Radio
                            sx={{
                              color: THEME.colors.primary,
                              '&.Mui-checked': {
                                color: THEME.colors.primary
                              }
                            }}
                          />
                        }
                        label={occasionId.charAt(0).toUpperCase() + occasionId.slice(1)}
                      />
                    ))}
                  </Stack>
                </RadioGroup>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        justifyContent="center"
        sx={{ mt: 6 }}
      >
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={!currentPerson || !selectedOccasion}
          sx={{
            bgcolor: THEME.colors.primary,
            color: 'white',
            px: 6,
            py: 1.5,
            fontSize: '1rem',
            fontWeight: 500,
            '&:hover': {
              bgcolor: THEME.colors.secondary
            },
            '&.Mui-disabled': {
              bgcolor: 'action.disabledBackground',
              color: 'action.disabled'
            }
          }}
        >
          Next: Choose Design
        </Button>
      </Stack>
    </>
  );
} 