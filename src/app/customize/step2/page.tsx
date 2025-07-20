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
  Chip,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  InputAdornment
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { THEME } from '@/lib/constants';
import { products, type Product } from '@/lib/products';
import Image from 'next/image';
import PlaceholderImage from '@/components/common/PlaceholderImage';
import { Search, FilterList, Sort, ShoppingCart, CheckCircleOutline } from '@mui/icons-material';
import { useCart } from '@/lib/CartContext';
import { getProductImagePath, handleImageError } from '@/lib/image-utils';
import { useOrder } from '@/lib/OrderContext';

export default function DesignSelectionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const personId = searchParams.get('personId');
  const { addItem } = useCart();
  const { people, updatePerson, getCurrentPerson, nextPerson, isLastPerson } = useOrder();

  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [availableDesigns, setAvailableDesigns] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'>('name_asc');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);

  const currentPerson = getCurrentPerson();

  useEffect(() => {
    if (!currentPerson) {
      router.push('/customize/step0');
      return;
    }

    // Filter and sort products
    let designs = products.filter(product => 
      product.gender.toLowerCase() === currentPerson.gender.toLowerCase() &&
      product.customizable &&
      !['Wedding', 'Traditional'].includes(product.category) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      product.price >= priceRange[0] &&
      product.price <= priceRange[1]
    );

    // Apply sorting
    designs.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.price - b.price;
        case 'price_desc':
          return b.price - a.price;
        case 'name_asc':
          return a.name.localeCompare(b.name);
        case 'name_desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    setAvailableDesigns(designs);
  }, [currentPerson, searchQuery, sortBy, priceRange, router]);

  const handleDesignSelect = (design: Product) => {
    if (!currentPerson) {
      router.push('/customize/step0');
      return;
    }

    // Add to cart first
    const cartItem = {
      id: Date.now(),
      productId: design.id,
      name: design.name,
      price: design.price,
      image: getProductImagePath(design.images[0]),
      quantity: 1,
      category: design.category,
      isCustom: true,
      personId: currentPerson.id
    };
    addItem(cartItem);

    // Update person with design selection
    updatePerson(currentPerson.id, { designId: design.id });

    // Navigate to sizing
    const queryString = new URLSearchParams({
      personId: currentPerson.id,
      gender: currentPerson.gender,
      design: design.id
    }).toString();
    
    router.push(`/customize/step3?${queryString}`);
  };

  const handleAddToCart = (product: Product) => {
    const cartItem = {
      id: Date.now(),
      productId: product.id,
      name: product.name,
      price: product.price,
      image: getProductImagePath(product.images[0]),
      quantity: 1,
      category: product.category
    };
    addItem(cartItem);
  };

  const handleNext = () => {
    if (!selectedDesign) return;
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.append(key, value);
    });
    params.set('designId', selectedDesign);
    router.push(`/customize/step3?${params.toString()}`);
  };

  const handleBack = () => {
    router.push(`/customize/step0`);
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
            Loading design options...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 2 }}>
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
                  {person.designId ? (
                    <Chip 
                      label="Design Selected" 
                      color="success" 
                      size="small" 
                      variant="outlined"
                    />
                  ) : person.id === currentPerson.id ? (
                    <Chip 
                      label="Selecting Design" 
                      color="primary" 
                      size="small"
                    />
                  ) : (
                    <Chip 
                      label="Pending" 
                      color="default" 
                      size="small" 
                      variant="outlined"
                    />
                  )}
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontFamily: THEME.typography.headingFamily,
              fontWeight: 500,
              mb: 2
            }}
          >
            Select Design for {currentPerson.name}
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              fontWeight: 'normal',
              maxWidth: '800px',
              mx: 'auto'
            }}
          >
            Choose from our curated collection of customizable designs
          </Typography>
        </Box>

        {/* Search and Sort Controls */}
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <TextField
            placeholder="Search designs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />

          <FormControl size="small" sx={{ minWidth: 200 }}>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              displayEmpty
              variant="outlined"
              startAdornment={<Sort sx={{ mr: 1, color: 'text.secondary' }} />}
            >
              <MenuItem value="name_asc">Name (A-Z)</MenuItem>
              <MenuItem value="name_desc">Name (Z-A)</MenuItem>
              <MenuItem value="price_asc">Price (Low-High)</MenuItem>
              <MenuItem value="price_desc">Price (High-Low)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Designs Grid */}
        <Grid container spacing={3}>
          {availableDesigns.map((design) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={design.id}>
              <Card 
                elevation={2}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6
                  }
                }}
                onClick={() => handleDesignSelect(design)}
              >
                {/* Product Image */}
                <Box sx={{ position: 'relative', pt: '120%' }}>
                  <Image
                    src={getProductImagePath(design.images[0])}
                    alt={design.name}
                    fill
                    style={{ objectFit: 'cover' }}
                    onError={handleImageError}
                  />
                  {/* Badges */}
                  <Stack
                    direction="row"
                    spacing={0.5}
                    sx={{ position: 'absolute', top: 8, left: 8 }}
                  >
                    {design.isNew && (
                      <Chip
                        label="New"
                        size="small"
                        sx={{ 
                          bgcolor: THEME.colors.primary,
                          color: 'white',
                          height: '20px',
                          '& .MuiChip-label': { px: 1, fontSize: '0.7rem' }
                        }}
                      />
                    )}
                    {design.isBestseller && (
                      <Chip
                        label="Bestseller"
                        size="small"
                        sx={{ 
                          bgcolor: THEME.colors.accent,
                          color: 'white',
                          height: '20px',
                          '& .MuiChip-label': { px: 1, fontSize: '0.7rem' }
                        }}
                      />
                    )}
                  </Stack>
                </Box>

                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="subtitle2" gutterBottom noWrap>
                    {design.name}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Typography variant="subtitle2" color="primary" sx={{ fontWeight: 600 }}>
                      ${design.price}
                    </Typography>
                    {design.originalPrice && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through', alignSelf: 'center' }}
                      >
                        ${design.originalPrice}
                      </Typography>
                    )}
                  </Stack>
                  <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5 }}>
                    <Chip
                      label={design.category}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        height: '20px',
                        '& .MuiChip-label': { px: 1, fontSize: '0.7rem' }
                      }}
                    />
                  </Stack>
                </CardContent>

                <CardContent sx={{ pt: 0, pb: 2 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDesignSelect(design);
                    }}
                    startIcon={<CheckCircleOutline />}
                    sx={{
                      background: `linear-gradient(45deg, ${THEME.colors.primary}, ${THEME.colors.secondary})`,
                      color: 'white',
                      '&:hover': {
                        background: `linear-gradient(45deg, ${THEME.colors.secondary}, ${THEME.colors.primary})`,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 6px 25px ${THEME.colors.primary}60`
                      }
                    }}
                  >
                    Select Design
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
} 