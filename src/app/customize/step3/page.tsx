'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Stack,
  TextField,
  FormControl,
  FormLabel,
  FormHelperText,
  Alert
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { THEME } from '@/lib/constants';

type Measurements = {
  [key: string]: string;
};

const measurementFields = {
  men: [
    { id: 'neck', label: 'Neck', helper: 'Measure around the base of the neck' },
    { id: 'chest', label: 'Chest', helper: 'Measure around the fullest part of the chest' },
    { id: 'waist', label: 'Waist', helper: 'Measure around natural waistline' },
    { id: 'hips', label: 'Hips', helper: 'Measure around the fullest part of the hips' },
    { id: 'shoulder', label: 'Shoulder Width', helper: 'Measure from shoulder point to shoulder point' },
    { id: 'sleeve', label: 'Sleeve Length', helper: 'Measure from shoulder to wrist' },
    { id: 'inseam', label: 'Inseam', helper: 'Measure from crotch to ankle' },
    { id: 'height', label: 'Height', helper: 'Your full height' }
  ],
  women: [
    { id: 'bust', label: 'Bust', helper: 'Measure around the fullest part of the bust' },
    { id: 'waist', label: 'Waist', helper: 'Measure around natural waistline' },
    { id: 'hips', label: 'Hips', helper: 'Measure around the fullest part of the hips' },
    { id: 'shoulder', label: 'Shoulder Width', helper: 'Measure from shoulder point to shoulder point' },
    { id: 'sleeve', label: 'Sleeve Length', helper: 'Measure from shoulder to wrist' },
    { id: 'length', label: 'Dress Length', helper: 'Measure from shoulder to desired length' },
    { id: 'height', label: 'Height', helper: 'Your full height' }
  ]
} as const;

export default function MeasurementsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gender = searchParams.get('gender') as keyof typeof measurementFields;
  const occasion = searchParams.get('occasion');
  const designId = searchParams.get('design');

  const [measurements, setMeasurements] = useState<Measurements>({});
  const [errors, setErrors] = useState<Measurements>({});

  useEffect(() => {
    if (!gender || !occasion || !designId) {
      router.push('/customize/step1');
      return;
    }

    // Initialize measurements
    const fields = measurementFields[gender];
    const initialMeasurements = fields.reduce((acc, field) => {
      acc[field.id] = '';
      return acc;
    }, {} as Measurements);
    setMeasurements(initialMeasurements);
  }, [gender, occasion, designId, router]);

  const handleInputChange = (field: string, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateMeasurements = () => {
    const newErrors: Measurements = {};
    const fields = measurementFields[gender];

    fields.forEach(field => {
      if (!measurements[field.id]) {
        newErrors[field.id] = 'This field is required';
      } else if (isNaN(Number(measurements[field.id]))) {
        newErrors[field.id] = 'Please enter a valid number';
      } else if (Number(measurements[field.id]) <= 0) {
        newErrors[field.id] = 'Measurement must be greater than 0';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateMeasurements()) {
      const params = new URLSearchParams();
      Array.from(searchParams.entries()).forEach(([key, value]) => {
        params.append(key, value);
      });
      params.set('measurements', JSON.stringify(measurements));
      router.push(`/customize/step4?${params.toString()}`);
    }
  };

  const handleBack = () => {
    router.push(`/customize/step2?gender=${gender}&occasion=${occasion}`);
  };

  const fields = measurementFields[gender] || [];

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
          Your Measurements
        </Typography>

        <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
          Please provide your measurements in inches
        </Typography>

        <Alert severity="info" sx={{ mb: 4 }}>
          For the most accurate fit, we recommend having someone help you take measurements.
          Watch our measurement guide video for detailed instructions.
        </Alert>

        <Grid container spacing={4}>
          {fields.map((field) => (
            <Grid item xs={12} sm={6} key={field.id}>
              <FormControl fullWidth error={Boolean(errors[field.id])}>
                <FormLabel
                  sx={{
                    color: 'text.primary',
                    mb: 1
                  }}
                >
                  {field.label}
                </FormLabel>
                <TextField
                  value={measurements[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  placeholder="Enter measurement in inches"
                  type="number"
                  inputProps={{ step: 0.25 }}
                  error={Boolean(errors[field.id])}
                  helperText={errors[field.id] || field.helper}
                  fullWidth
                />
              </FormControl>
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
            sx={{
              bgcolor: THEME.colors.primary,
              color: 'white',
              px: 6,
              '&:hover': {
                bgcolor: THEME.colors.secondary
              }
            }}
          >
            Next: Review
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}