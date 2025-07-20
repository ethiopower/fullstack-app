'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Stack,
  Drawer,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Divider,
  Badge,
  Fade,
  useMediaQuery,
  useTheme,
  Pagination,
  Alert,
  InputAdornment
} from '@mui/material';
import {
  FilterList,
  Close,
  ShoppingCart,
  Search,
  Sort,
  Tune,
  Star,
  LocalShipping,
  Refresh
} from '@mui/icons-material';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { THEME } from '@/lib/constants';
import { useCart } from '@/lib/CartContext';
import {
  products,
  productCategories,
  productGenders,
  productColors,
  productSizes,
  filterProducts,
  type Product,
  type ProductCategory,
  type ProductGender,
  type ProductColor,
  type ProductSize
} from '@/lib/products';
import { getProductImagePath, handleImageError } from '@/lib/image-utils';

// Number of products per page
const PRODUCTS_PER_PAGE = 12;

export default function ShopPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { addItem } = useCart();

  // Filter states
  const [category, setCategory] = useState<ProductCategory | ''>('');
  const [gender, setGender] = useState<ProductGender | ''>('');
  const [color, setColor] = useState<ProductColor | ''>('');
  const [size, setSize] = useState<ProductSize | ''>('');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomizable, setShowCustomizable] = useState(false);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'>('name_asc');

  // UI states
  const [filtersOpen, setFiltersOpen] = useState(false); // Changed from !isMobile to false
  const [page, setPage] = useState(1);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Apply filters
  useEffect(() => {
    let result = [...products];

    // Apply all filters
    result = filterProducts.byCategory(result, category || undefined);
    result = filterProducts.byGender(result, gender || undefined);
    result = filterProducts.byColor(result, color || undefined);
    result = filterProducts.bySize(result, size || undefined);
    result = filterProducts.byPrice(result, priceRange[0], priceRange[1]);
    result = filterProducts.bySearch(result, searchQuery);
    result = filterProducts.byCustomizable(result, showCustomizable);
    result = filterProducts.byAvailability(result, inStockOnly);

    // Apply sorting
    result.sort((a, b) => {
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

    setFilteredProducts(result);
    setPage(1); // Reset to first page when filters change
  }, [category, gender, color, size, priceRange, searchQuery, showCustomizable, inStockOnly, sortBy]);

  const clearFilters = () => {
    setCategory('');
    setGender('');
    setColor('');
    setSize('');
    setPriceRange([0, 1000]);
    setSearchQuery('');
    setShowCustomizable(false);
    setInStockOnly(false);
    setSortBy('name_asc');
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

  const handleProductClick = (product: Product) => {
    router.push(`/product/${product.id}?category=${product.category}&gender=${product.gender}`);
  };

  // Calculate pagination
  const pageCount = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const displayProducts = filteredProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const FiltersPanel = () => (
    <Stack spacing={3} sx={{ width: isMobile ? '100%' : '280px', p: 3, bgcolor: 'background.paper', borderRadius: 2, border: '1px solid', borderColor: 'divider' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filters
        </Typography>
        <Button
          variant="text"
          size="small"
          onClick={clearFilters}
          startIcon={<Refresh />}
        >
          Clear All
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
      />

      {/* Category Filter */}
      <FormControl fullWidth size="small">
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value as ProductCategory)}
          label="Category"
        >
          <MenuItem value="">All Categories</MenuItem>
          {productCategories.map((cat) => (
            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Gender Filter */}
      <FormControl fullWidth size="small">
        <InputLabel>Gender</InputLabel>
        <Select
          value={gender}
          onChange={(e) => setGender(e.target.value as ProductGender)}
          label="Gender"
        >
          <MenuItem value="">All Genders</MenuItem>
          {productGenders.map((gen) => (
            <MenuItem key={gen} value={gen}>{gen}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Color Filter */}
      <FormControl fullWidth size="small">
        <InputLabel>Color</InputLabel>
        <Select
          value={color}
          onChange={(e) => setColor(e.target.value as ProductColor)}
          label="Color"
        >
          <MenuItem value="">All Colors</MenuItem>
          {productColors.map((clr) => (
            <MenuItem key={clr} value={clr}>{clr}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Size Filter */}
      <FormControl fullWidth size="small">
        <InputLabel>Size</InputLabel>
        <Select
          value={size}
          onChange={(e) => setSize(e.target.value as ProductSize)}
          label="Size"
        >
          <MenuItem value="">All Sizes</MenuItem>
          {productSizes.map((sz) => (
            <MenuItem key={sz} value={sz}>{sz}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Price Range */}
      <Box>
        <Typography variant="subtitle2" gutterBottom>Price Range</Typography>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
          step={50}
          valueLabelFormat={(value) => `$${value}`}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="caption" color="text.secondary">
            ${priceRange[0]}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            ${priceRange[1]}
          </Typography>
        </Box>
      </Box>

      {/* Additional Filters */}
      <Stack spacing={1}>
        <Button
          variant={showCustomizable ? "contained" : "outlined"}
          onClick={() => setShowCustomizable(!showCustomizable)}
          size="small"
          sx={{ justifyContent: 'flex-start' }}
        >
          Customizable Only
        </Button>
        <Button
          variant={inStockOnly ? "contained" : "outlined"}
          onClick={() => setInStockOnly(!inStockOnly)}
          size="small"
          sx={{ justifyContent: 'flex-start' }}
        >
          In Stock Only
        </Button>
      </Stack>
    </Stack>
  );

  return (
    <Box sx={{ py: THEME.spacing.section, minHeight: '100vh', mt: 8 }}>
      <Container maxWidth="xl">
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
            Shop Collection
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
            Discover our curated collection of Ethiopian fashion
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Filters - Desktop */}
          {!isMobile && (
            <Grid item xs={12} md={3}>
              <FiltersPanel />
            </Grid>
          )}

          {/* Products */}
          <Grid item xs={12} md={!isMobile ? 9 : 12}>
            {/* Sort and Filter Controls */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {isMobile && (
                  <Button
                    onClick={() => setFiltersOpen(true)}
                    startIcon={<FilterList />}
                    variant="outlined"
                    size="small"
                  >
                    Filters
                  </Button>
                )}
                <Typography variant="body2" color="text.secondary">
                  {filteredProducts.length} products found
                </Typography>
              </Box>

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

            {/* Products Grid */}
            <Grid container spacing={3}>
              {displayProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <Card
                    elevation={2}
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      transition: 'transform 0.2s ease-in-out',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }}
                    onClick={() => handleProductClick(product)}
                  >
                    {/* Product Image */}
                    <Box sx={{ position: 'relative', pt: '120%' }}>
                      <Image
                        src={getProductImagePath(product.images[0])}
                        alt={product.name}
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
                        {product.isNew && (
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
                        {product.isBestseller && (
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
                      <Typography variant="h6" gutterBottom noWrap>
                        {product.name}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                          ${product.price}
                        </Typography>
                        {product.originalPrice && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ textDecoration: 'line-through', alignSelf: 'center' }}
                          >
                            ${product.originalPrice}
                          </Typography>
                        )}
                      </Stack>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ gap: 0.5, mb: 2 }}>
                        <Chip
                          label={product.category}
                          size="small"
                          variant="outlined"
                          sx={{ 
                            height: '20px',
                            '& .MuiChip-label': { px: 1, fontSize: '0.7rem' }
                          }}
                        />
                        <Chip
                          label={product.gender}
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
                          e.stopPropagation(); // Prevent card click when clicking button
                          handleProductClick(product);
                        }}
                        startIcon={<ShoppingCart />}
                        sx={{
                          bgcolor: THEME.colors.primary,
                          '&:hover': {
                            bgcolor: THEME.colors.secondary
                          }
                        }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {pageCount > 1 && (
              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <Pagination
                  count={pageCount}
                  page={page}
                  onChange={(_, value) => setPage(value)}
                  color="primary"
                />
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>

      {/* Mobile Filters Drawer */}
      <Drawer
        anchor="left"
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: '100%',
            maxWidth: '320px'
          }
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">Filters</Typography>
          <IconButton onClick={() => setFiltersOpen(false)}>
            <Close />
          </IconButton>
        </Box>
        <FiltersPanel />
      </Drawer>
    </Box>
  );
} 