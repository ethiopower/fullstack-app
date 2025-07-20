'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Stack,
  Chip,
  TextField,
  Alert,
  IconButton,
  Divider,
  Paper,
  Tooltip,
  Fade,
  Zoom,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, Add, Remove, Info, StraightenRounded, Straighten } from '@mui/icons-material';
import { THEME } from '@/lib/constants';
import { useCart } from '@/lib/CartContext';
import { products, type Product } from '@/lib/products';
import { getProductImagePath, handleImageError } from '@/lib/image-utils';

const measurementFields = {
  chest: { label: 'Chest', helper: 'Measure around the fullest part of your chest' },
  waist: { label: 'Waist', helper: 'Measure around your natural waistline' },
  hips: { label: 'Hips', helper: 'Measure around the fullest part of your hips' },
  shoulder: { label: 'Shoulder Width', helper: 'Measure from shoulder point to shoulder point across your back' },
  sleeve: { label: 'Sleeve Length', helper: 'Measure from shoulder to wrist' },
  length: { label: 'Length', helper: 'Measure from shoulder to desired length' }
};

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addItem } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [sizingMode, setSizingMode] = useState<'standard' | 'custom'>('standard');
  const [quantity, setQuantity] = useState(1);
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Find product by ID
  const product = products.find(p => p.id === params.id);
  if (!product) {
    return (
      <Container sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="error">Product not found</Alert>
        <Button
          variant="contained"
          onClick={() => router.push('/shop')}
          sx={{ mt: 2 }}
        >
          Back to Shop
        </Button>
      </Container>
    );
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const validateMeasurements = () => {
    if (sizingMode === 'standard') {
      return !!selectedSize;
    }

    const newErrors: Record<string, string> = {};
    Object.keys(measurementFields).forEach(field => {
      if (!measurements[field]) {
        newErrors[field] = 'This measurement is required';
      } else if (isNaN(Number(measurements[field])) || Number(measurements[field]) <= 0) {
        newErrors[field] = 'Please enter a valid measurement';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (!validateMeasurements()) {
      if (sizingMode === 'standard') {
        alert('Please select a size');
      }
      return;
    }

    const cartItem = {
      id: Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity,
      size: sizingMode === 'standard' ? selectedSize : 'Custom',
      measurements: sizingMode === 'custom' ? measurements : undefined,
      category: product.category
    };

    addItem(cartItem);
    router.push('/cart');
  };

  return (
    <Box sx={{ 
      py: THEME.spacing.section, 
      minHeight: '100vh', 
      bgcolor: '#FFFFFF',
      borderTop: '1px solid',
      borderColor: 'divider'
    }}>
      <Container maxWidth="xl">
        <Grid container spacing={8}>
          {/* Product Images */}
          <Grid item xs={12} lg={7}>
            <Box sx={{ 
              position: 'sticky',
              top: 100,
              display: 'flex',
              gap: 4
            }}>
              {/* Thumbnails */}
              <Stack spacing={2}>
                {product.images.map((image, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      width: 90,
                      height: 120,
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease-in-out',
                      border: selectedImage === index ? `2px solid ${THEME.colors.primary}` : '1px solid #eee',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      '&:hover': {
                        borderColor: THEME.colors.primary,
                        transform: 'translateY(-2px)'
                      }
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Image
                      src={getProductImagePath(image)}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      style={{ objectFit: 'cover' }}
                      onError={handleImageError}
                    />
                  </Paper>
                ))}
              </Stack>

              {/* Main Image */}
              <Paper
                elevation={0}
                sx={{
                  flex: 1,
                  position: 'relative',
                  height: 800,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: '1px solid #eee',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    borderColor: THEME.colors.primary,
                    transform: 'scale(1.01)'
                  }
                }}
              >
                <Image
                  src={getProductImagePath(product.images[selectedImage])}
                  alt={product.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  onError={handleImageError}
                  priority
                />
              </Paper>
            </Box>
          </Grid>

          {/* Product Details */}
          <Grid item xs={12} lg={5}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Stack spacing={4}>
                {/* Header */}
                <Box>
                  <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                    {product.isNew && (
                      <Chip
                        label="New Arrival"
                        size="small"
                        sx={{ 
                          bgcolor: THEME.colors.accent + '15',
                          color: THEME.colors.accent,
                          fontWeight: 600,
                          borderRadius: '20px',
                          border: `1px solid ${THEME.colors.accent}30`
                        }}
                      />
                    )}
                    <Chip
                      label={product.category}
                      size="small"
                      sx={{ 
                        bgcolor: THEME.colors.primary + '15',
                        color: THEME.colors.primary,
                        fontWeight: 600,
                        borderRadius: '20px',
                        border: `1px solid ${THEME.colors.primary}30`
                      }}
                    />
                  </Stack>

                  <Typography 
                    variant="h3" 
                    sx={{ 
                      fontFamily: THEME.typography.headingFamily,
                      fontSize: '2.5rem',
                      fontWeight: 600,
                      mb: 2,
                      color: '#1a1a1a',
                      letterSpacing: '-0.02em'
                    }}
                  >
                    {product.name}
                  </Typography>

                  <Typography 
                    variant="h4" 
                    sx={{ 
                      fontWeight: 600,
                      color: THEME.colors.primary,
                      mb: 4
                    }}
                  >
                    ${product.price}
                  </Typography>

                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: 'text.secondary',
                      mb: 4,
                      lineHeight: 1.8
                    }}
                  >
                    {product.description}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Size Selection */}
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Size
                    </Typography>
                    <ToggleButtonGroup
                      value={sizingMode}
                      exclusive
                      onChange={(_, value) => value && setSizingMode(value)}
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
                      <ToggleButton value="standard">Standard</ToggleButton>
                      <ToggleButton value="custom">Custom</ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>

                  {sizingMode === 'standard' ? (
                    <Grid container spacing={1} sx={{ mb: 4 }}>
                      {['XS', 'S', 'M', 'L', 'XL', '2XL'].map((size) => (
                        <Grid item key={size}>
                          <Button
                            variant={selectedSize === size ? 'contained' : 'outlined'}
                            onClick={() => setSelectedSize(size)}
                            sx={{
                              minWidth: '60px',
                              height: '60px',
                              borderRadius: '12px',
                              border: '1px solid',
                              borderColor: selectedSize === size ? THEME.colors.primary : 'divider',
                              color: selectedSize === size ? 'white' : 'text.primary',
                              '&:hover': {
                                borderColor: THEME.colors.primary,
                                bgcolor: selectedSize === size ? THEME.colors.primary : 'transparent'
                              }
                            }}
                          >
                            {size}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  ) : (
                    <Box sx={{ mb: 4 }}>
                      <Grid container spacing={3}>
                        {Object.entries(measurementFields).map(([field, { label, helper }]) => (
                          <Grid item xs={12} sm={6} key={field}>
                            <TextField
                              fullWidth
                              label={label}
                              value={measurements[field] || ''}
                              onChange={(e) => {
                                setMeasurements({ ...measurements, [field]: e.target.value });
                                if (errors[field]) {
                                  setErrors({ ...errors, [field]: '' });
                                }
                              }}
                              error={!!errors[field]}
                              helperText={errors[field] || helper}
                              InputProps={{
                                endAdornment: (
                                  <Tooltip 
                                    title={helper}
                                    placement="top"
                                    arrow
                                    open={showTooltip === field}
                                    onClose={() => setShowTooltip(null)}
                                  >
                                    <IconButton 
                                      size="small" 
                                      onClick={() => setShowTooltip(field)}
                                      sx={{ color: 'text.secondary' }}
                                    >
                                      <Info fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                )
                              }}
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '12px'
                                }
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* Quantity */}
                  <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Quantity
                    </Typography>
                    <Box sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: '12px',
                      p: 0.5
                    }}>
                      <IconButton 
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        sx={{ color: 'text.secondary' }}
                      >
                        <Remove />
                      </IconButton>
                      <Typography 
                        sx={{ 
                          mx: 2,
                          minWidth: '40px',
                          textAlign: 'center',
                          fontWeight: 600
                        }}
                      >
                        {quantity}
                      </Typography>
                      <IconButton 
                        onClick={() => handleQuantityChange(1)}
                        sx={{ color: 'text.secondary' }}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </Stack>

                  {/* Add to Cart Button */}
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleAddToCart}
                    startIcon={<ShoppingCart />}
                    sx={{
                      height: '60px',
                      borderRadius: '12px',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                        boxShadow: 'none',
                        bgcolor: THEME.colors.primary + 'dd'
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 