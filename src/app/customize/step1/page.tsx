'use client';

import { useState } from 'react';
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
  FormLabel
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { THEME, PRODUCT_DESIGNS, Gender, Occasion } from '@/lib/constants';

// Client-side component for the form
export default function StyleSelectionPage() {
  const router = useRouter();
  const [formState, setFormState] = useState<{
    gender: Gender;
    occasion: Occasion | '';
  }>({
    gender: 'men',
    occasion: ''
  });

  const handleGenderChange = (newGender: Gender) => {
    setFormState({
      gender: newGender,
      occasion: ''
    });
  };

  const handleOccasionChange = (newOccasion: Occasion) => {
    setFormState(prev => ({
      ...prev,
      occasion: newOccasion
    }));
  };

  const handleNext = () => {
    if (formState.gender && formState.occasion) {
      const params = new URLSearchParams();
      params.set('gender', formState.gender);
      params.set('occasion', formState.occasion);
      router.push(`/customize/step2?${params.toString()}`);
    }
  };

  // Get available occasions for the selected gender
  const availableOccasions = Object.keys(PRODUCT_DESIGNS[formState.gender]) as Occasion[];

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
        {/* Gender Selection */}
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
                  Who is this for?
                </FormLabel>
                <RadioGroup
                  value={formState.gender}
                  onChange={(e) => handleGenderChange(e.target.value as Gender)}
                >
                  <Stack spacing={2}>
                    <FormControlLabel
                      value="men"
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
                      label="Men's Collection"
                    />
                    <FormControlLabel
                      value="women"
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
                      label="Women's Collection"
                    />
                  </Stack>
                </RadioGroup>
              </FormControl>
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
                  value={formState.occasion}
                  onChange={(e) => handleOccasionChange(e.target.value as Occasion)}
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
          disabled={!formState.gender || !formState.occasion}
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