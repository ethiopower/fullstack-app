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
  Divider,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { THEME } from '@/lib/constants';
import { useOrder } from '@/lib/OrderContext';
import { StraightenRounded, Info } from '@mui/icons-material';
import Image from 'next/image';
import { useCart } from '@/lib/CartContext';

type Field = {
  id: string;
  label: string;
  helper: string;
};

type MeasurementFields = {
  [key: string]: Field[];
};

const measurementFields: MeasurementFields = {
  men: [
    { id: 'chest', label: 'Chest', helper: 'Measure around the fullest part of the chest (cm)' },
    { id: 'waist', label: 'Waist', helper: 'Measure around natural waistline (cm)' },
    { id: 'shoulder', label: 'Shoulder Width', helper: 'Measure from shoulder point to shoulder point (cm)' },
    { id: 'sleeve', label: 'Sleeve Length', helper: 'Measure from shoulder to wrist (cm)' },
    { id: 'neck', label: 'Neck', helper: 'Measure around the base of the neck (cm)' },
    { id: 'length', label: 'Shirt Length', helper: 'Measure from shoulder to desired length (cm)' },
    { id: 'inseam', label: 'Inseam', helper: 'Measure from crotch to ankle (cm)' },
    { id: 'height', label: 'Height', helper: 'Your full height (cm)' }
  ],
  women: [
    { id: 'bust', label: 'Bust', helper: 'Measure around the fullest part of the bust (cm)' },
    { id: 'waist', label: 'Waist', helper: 'Measure around natural waistline (cm)' },
    { id: 'hips', label: 'Hips', helper: 'Measure around the fullest part of hips (cm)' },
    { id: 'shoulder', label: 'Shoulder Width', helper: 'Measure from shoulder point to shoulder point (cm)' },
    { id: 'sleeve', label: 'Sleeve Length', helper: 'Measure from shoulder to wrist (cm)' },
    { id: 'length', label: 'Dress Length', helper: 'Measure from shoulder to desired length (cm)' },
    { id: 'height', label: 'Height', helper: 'Your full height (cm)' }
  ],
  children: [
    { id: 'chest', label: 'Chest', helper: 'Measure around the fullest part of the chest (cm)' },
    { id: 'waist', label: 'Waist', helper: 'Measure around natural waistline (cm)' },
    { id: 'shoulder', label: 'Shoulder Width', helper: 'Measure from shoulder point to shoulder point (cm)' },
    { id: 'sleeve', label: 'Sleeve Length', helper: 'Measure from shoulder to wrist (cm)' },
    { id: 'length', label: 'Outfit Length', helper: 'Measure from shoulder to desired length (cm)' },
    { id: 'height', label: 'Height', helper: 'Child\'s full height (cm)' },
    { id: 'age', label: 'Age', helper: 'Child\'s age in years' }
  ]
} as const;

export default function MeasurementsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { updatePerson, getCurrentPerson, nextPerson, isLastPerson, people } = useOrder();
  const { items, updateItem } = useCart();

  const [sizingOption, setSizingOption] = useState<'standard' | 'custom'>('custom');
  const [standardSize, setStandardSize] = useState<string>('');
  const [measurements, setMeasurements] = useState<{ [key: string]: string }>({});
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [activeGuide, setActiveGuide] = useState<string | null>(null);

  const measurementGuides: { [key: string]: string } = {
    chest: '/images/measurements/chest.png',
    bust: '/images/measurements/bust.png',
    waist: '/images/measurements/waist.png',
    hips: '/images/measurements/hips.png',
    shoulder: '/images/measurements/shoulder.png',
    sleeve: '/images/measurements/sleeve.png',
    length: '/images/measurements/length.png',
    inseam: '/images/measurements/inseam.png',
    neck: '/images/measurements/neck.png',
    height: '/images/measurements/height.png'
  };

  const currentPerson = getCurrentPerson();

  useEffect(() => {
    if (!currentPerson || !currentPerson.designId) {
      router.push('/customize/step2');
      return;
    }

    // Initialize measurements object
    const fields = measurementFields[currentPerson.gender] || [];
    const initialMeasurements: { [key: string]: string } = {};
    fields.forEach(field => {
      initialMeasurements[field.id] = '';
    });
    setMeasurements(initialMeasurements);
  }, [currentPerson, router]);

  const handleMeasurementChange = (field: string, value: string) => {
    setMeasurements(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
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

    const newErrors: { [key: string]: string } = {};
    const fields = measurementFields[currentPerson!.gender];

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
    if (!currentPerson) return;

    if (validateMeasurements()) {
      // Update person with size information
      updatePerson(currentPerson.id, {
        size: sizingOption === 'standard' ? standardSize : 'Custom',
        measurements: sizingOption === 'custom' ? measurements : undefined
      });

      // Update cart item with measurements
      const cartItem = items.find(item => item.personId === currentPerson.id);
      if (cartItem) {
        updateItem(cartItem.id, {
          size: sizingOption === 'standard' ? standardSize : 'Custom',
          measurements: sizingOption === 'custom' ? measurements : undefined,
          isCustom: true
        });
      }

      if (isLastPerson()) {
        router.push('/cart');
      } else {
        nextPerson();
        router.push(`/customize/step2?personId=${people[people.indexOf(currentPerson) + 1].id}`);
      }
    }
  };

  const handleBack = () => {
    if (currentPerson) {
      router.push(`/customize/step2?personId=${currentPerson.id}`);
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
            Loading sizing options...
          </Typography>
        </Stack>
      </Box>
    );
  }

  const standardSizes = currentPerson.gender === 'children' 
    ? ['2T', '3T', '4T', '5T', '6', '7', '8', '10', '12', '14', '16', 'Custom']
    : ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom'];

  const handleSizeChange = (size: string) => {
    setStandardSize(size);
    if (size === 'Custom') {
      setSizingOption('custom');
    } else {
      setSizingOption('standard');
    }
  };

  return (
    <Box sx={{ py: THEME.spacing.section, minHeight: '100vh', mt: 8 }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        {/* Progress Indicator */}
        <Box sx={{ mb: 4 }}>
          <Stack spacing={2}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Order Progress
            </Typography>
            {people.map((person, index) => (
              <Box
                key={person.id}
                sx={{
                  p: 2,
                  border: '1px solid',
                  borderColor: person.id === currentPerson.id ? THEME.colors.primary : 'divider',
                  borderRadius: 1,
                  bgcolor: person.id === currentPerson.id ? `${THEME.colors.primary}10` : 'transparent'
                }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="body1" sx={{ flex: 1 }}>
                    {index + 1}. {person.name}
                  </Typography>
                  <Stack direction="row" spacing={1}>
                    {person.designId && (
                      <Chip 
                        label="Design ✓" 
                        color="success" 
                        size="small" 
                        variant="outlined"
                      />
                    )}
                    {person.size ? (
                      <Chip 
                        label="Size ✓" 
                        color="success" 
                        size="small" 
                        variant="outlined"
                      />
                    ) : person.id === currentPerson.id ? (
                      <Chip 
                        label="Selecting Size" 
                        color="primary" 
                        size="small"
                      />
                    ) : (
                      <Chip 
                        label="Size Pending" 
                        color="default" 
                        size="small" 
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>

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
          Choose Size for {currentPerson.name}
        </Typography>

        <Typography 
          variant="h6" 
          sx={{ 
            mb: 4,
            color: 'text.secondary',
            fontFamily: THEME.typography.headingFamily
          }}
        >
          Enter your measurements for the perfect fit
        </Typography>

        <Grid container spacing={4}>
          {/* Custom Measurements */}
          <Grid item xs={12} md={8}>
            <Card elevation={2}>
              <CardContent>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Sizing Method
                  </Typography>
                  <ToggleButtonGroup
                    value={sizingOption}
                    exclusive
                    onChange={(_, value) => value && setSizingOption(value)}
                    size="small"
                    sx={{
                      '& .MuiToggleButton-root': {
                        border: '1px solid',
                        borderColor: 'divider',
                        px: 2,
                        '&.Mui-selected': {
                          bgcolor: THEME.colors.primary + '15',
                          color: THEME.colors.primary,
                          borderColor: THEME.colors.primary,
                          '&:hover': {
                            bgcolor: THEME.colors.primary + '25'
                          }
                        }
                      }
                    }}
                  >
                    <ToggleButton value="custom">Custom Measurements</ToggleButton>
                    <ToggleButton value="standard">Standard Sizes</ToggleButton>
                  </ToggleButtonGroup>
                </Stack>

                {sizingOption === 'custom' ? (
                  <Grid container spacing={3}>
                    {measurementFields[currentPerson.gender].map((field) => (
                      <Grid item xs={12} sm={6} key={field.id}>
                        <Box
                          sx={{
                            position: 'relative',
                            '&:hover': {
                              '& .measurement-guide': {
                                opacity: 1,
                                visibility: 'visible'
                              }
                            }
                          }}
                        >
                          <FormControl fullWidth error={!!errors[field.id]}>
                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                              <FormLabel>{field.label}</FormLabel>
                              {measurementGuides[field.id] && (
                                <Tooltip title="Click to see measurement guide">
                                  <IconButton
                                    size="small"
                                    onClick={() => setActiveGuide(activeGuide === field.id ? null : field.id)}
                                    sx={{ color: 'text.secondary' }}
                                  >
                                    <StraightenRounded fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              )}
                            </Stack>
                            <TextField
                              value={measurements[field.id] || ''}
                              onChange={(e) => handleMeasurementChange(field.id, e.target.value)}
                              type="number"
                              size="small"
                              error={!!errors[field.id]}
                              helperText={errors[field.id] || field.helper}
                              InputProps={{
                                endAdornment: <InputAdornment position="end">cm</InputAdornment>
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '8px'
                                }
                              }}
                            />
                          </FormControl>

                          {/* Measurement Guide Dialog */}
                          <Dialog
                            open={activeGuide === field.id}
                            onClose={() => setActiveGuide(null)}
                            maxWidth="sm"
                            fullWidth
                          >
                            <DialogTitle>
                              How to Measure: {field.label}
                            </DialogTitle>
                            <DialogContent>
                              {measurementGuides[field.id] && (
                                <Box sx={{ position: 'relative', width: '100%', height: 400, mb: 2 }}>
                                  <Image
                                    src={measurementGuides[field.id]}
                                    alt={`How to measure ${field.label}`}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                  />
                                </Box>
                              )}
                              <Typography variant="body1">
                                {field.helper}
                              </Typography>
                            </DialogContent>
                            <DialogActions>
                              <Button onClick={() => setActiveGuide(null)}>Close</Button>
                            </DialogActions>
                          </Dialog>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  <Box>
                    <FormControl fullWidth>
                      <InputLabel>Select a Standard Size</InputLabel>
                      <Select
                        value={standardSize}
                        onChange={(e) => setStandardSize(e.target.value)}
                        label="Select a Standard Size"
                      >
                        <MenuItem value="" disabled>Choose a size</MenuItem>
                        {standardSizes.map((size) => (
                          <MenuItem key={size} value={size}>{size}</MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>
                        Select your usual clothing size, or switch to custom measurements for a perfect fit
                      </FormHelperText>
                    </FormControl>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Size Guide */}
          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Measurement Tips
                </Typography>
                <Stack spacing={2}>
                  <Alert severity="info" sx={{ '& .MuiAlert-message': { width: '100%' } }}>
                    <Typography variant="subtitle2" gutterBottom>
                      For the most accurate measurements:
                    </Typography>
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      <li>Use a fabric measuring tape</li>
                      <li>Keep the tape snug but not tight</li>
                      <li>Measure over undergarments</li>
                      <li>Stand naturally while measuring</li>
                    </ul>
                  </Alert>
                  <Button
                    variant="outlined"
                    onClick={() => window.open('/size-guide.pdf', '_blank')}
                    startIcon={<Info />}
                    fullWidth
                  >
                    View Full Size Guide
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Navigation */}
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          sx={{ mt: 4 }}
        >
          <Button
            variant="outlined"
            onClick={handleBack}
            sx={{
              px: 4,
              py: 1,
              fontSize: '0.9rem',
              fontWeight: 500
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!standardSize && sizingOption !== 'custom'}
            sx={{
              bgcolor: THEME.colors.primary,
              color: 'white',
              px: 4,
              py: 1,
              fontSize: '0.9rem',
              fontWeight: 500,
              '&:hover': {
                bgcolor: THEME.colors.secondary
              }
            }}
          >
            Continue
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}