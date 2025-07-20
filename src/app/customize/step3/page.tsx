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
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
  Select,
  MenuItem,
  InputLabel,
  Divider
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
  ],
  children: [
    { id: 'chest', label: 'Chest', helper: 'Measure around the fullest part of the chest' },
    { id: 'waist', label: 'Waist', helper: 'Measure around natural waistline' },
    { id: 'shoulder', label: 'Shoulder Width', helper: 'Measure from shoulder point to shoulder point' },
    { id: 'sleeve', label: 'Sleeve Length', helper: 'Measure from shoulder to wrist' },
    { id: 'length', label: 'Outfit Length', helper: 'Measure from shoulder to desired length' },
    { id: 'height', label: 'Height', helper: 'Child\'s full height' },
    { id: 'age', label: 'Age', helper: 'Child\'s age in years' }
  ]
} as const;

export default function MeasurementsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gender = searchParams.get('gender') as keyof typeof measurementFields;
  const occasion = searchParams.get('occasion');
  const designId = searchParams.get('design');

  const [sizingOption, setSizingOption] = useState<'standard' | 'custom'>('standard');
  const [standardSize, setStandardSize] = useState<string>('');
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
    if (sizingOption === 'standard') {
      if (!standardSize) {
        alert('Please select a standard size');
        return false;
      }
      return true;
    }

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
      // Save current person's data to session storage
      const personId = searchParams.get('personId');
      const gender = searchParams.get('gender');
      const occasion = searchParams.get('occasion');
      const design = searchParams.get('design');
      
      // Get existing order data
      const existingOrders = JSON.parse(sessionStorage.getItem('orderData') || '[]');
      
      // Add current person's order
      const currentOrder = {
        personId,
        gender,
        occasion,
        design,
        sizingType: sizingOption,
        measurements: sizingOption === 'standard' ? { standardSize } : measurements
      };
      
      const updatedOrders = [...existingOrders.filter((order: any) => order.personId !== personId), currentOrder];
      sessionStorage.setItem('orderData', JSON.stringify(updatedOrders));
      
      // Check if there are more people to process
      const people = JSON.parse(sessionStorage.getItem('orderPeople') || '[]');
      const completedPeople = updatedOrders.map((order: any) => order.personId);
      const remainingPeople = people.filter((person: any) => !completedPeople.includes(person.id));
      
      if (remainingPeople.length > 0) {
        // Go to next person
        const nextPerson = remainingPeople[0];
        router.push(`/customize/step1?personId=${nextPerson.id}`);
      } else {
        // All people completed, go to order summary
        router.push('/customize/step4');
      }
    }
  };

  const handleBack = () => {
    router.push(`/customize/step2?gender=${gender}&occasion=${occasion}`);
  };

  const fields = measurementFields[gender] || [];
  const standardSizes = gender === 'children' 
    ? ['2T', '3T', '4T', '5T', '6', '7', '8', '10', '12', '14', '16']
    : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
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
        Sizing Options
      </Typography>

      <Typography variant="h6" color="text.secondary" sx={{ mb: 6 }}>
        Choose how you'd like to get the perfect fit
      </Typography>

      {/* Sizing Option Selection */}
      <Grid container spacing={4} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card 
            elevation={sizingOption === 'standard' ? 3 : 1}
            sx={{ 
              height: '100%',
              border: sizingOption === 'standard' ? `2px solid ${THEME.colors.primary}` : '1px solid',
              borderColor: sizingOption === 'standard' ? THEME.colors.primary : 'divider',
              cursor: 'pointer'
            }}
            onClick={() => setSizingOption('standard')}
          >
            <CardContent sx={{ p: 3 }}>
              <FormControlLabel
                control={
                  <Radio
                    checked={sizingOption === 'standard'}
                    onChange={() => setSizingOption('standard')}
                    sx={{ color: THEME.colors.primary }}
                  />
                }
                label={
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Standard Sizes
                  </Typography>
                }
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                Choose from our standard size chart. Quick and convenient option.
              </Typography>

              <Alert severity="warning" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  <strong>Disclaimer:</strong> Standard sizes may not provide the perfect fit for everyone. 
                  We recommend custom measurements for the best results.
                </Typography>
              </Alert>

              {sizingOption === 'standard' && (
                <FormControl fullWidth>
                  <InputLabel>Select Size</InputLabel>
                  <Select
                    value={standardSize}
                    label="Select Size"
                    onChange={(e) => setStandardSize(e.target.value)}
                  >
                    {standardSizes.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card 
            elevation={sizingOption === 'custom' ? 3 : 1}
            sx={{ 
              height: '100%',
              border: sizingOption === 'custom' ? `2px solid ${THEME.colors.primary}` : '1px solid',
              borderColor: sizingOption === 'custom' ? THEME.colors.primary : 'divider',
              cursor: 'pointer'
            }}
            onClick={() => setSizingOption('custom')}
          >
            <CardContent sx={{ p: 3 }}>
              <FormControlLabel
                control={
                  <Radio
                    checked={sizingOption === 'custom'}
                    onChange={() => setSizingOption('custom')}
                    sx={{ color: THEME.colors.primary }}
                  />
                }
                label={
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Custom Measurements
                  </Typography>
                }
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                Provide your exact measurements for a perfect, tailored fit.
              </Typography>

              <Alert severity="success">
                <Typography variant="body2">
                  <strong>Recommended:</strong> Custom measurements ensure the best possible fit 
                  and the highest quality result for your custom garment.
                </Typography>
              </Alert>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Custom Measurements Form */}
      {sizingOption === 'custom' && (
        <>
          <Divider sx={{ my: 4 }} />
          
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Your Measurements
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Please provide your measurements in inches. For the most accurate fit, 
            we recommend having someone help you take measurements.
          </Typography>

          <Grid container spacing={4}>
            {fields.map((field) => (
              <Grid item xs={12} sm={6} key={field.id}>
                <FormControl fullWidth error={Boolean(errors[field.id])}>
                  <FormLabel
                    sx={{
                      color: 'text.primary',
                      mb: 1,
                      fontWeight: 500
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
        </>
      )}

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