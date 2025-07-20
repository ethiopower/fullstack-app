'use client';

import { useState } from 'react';
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
  Modal,
  Stack,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Badge,
  Fade,
  Backdrop
} from '@mui/material';
import { Close, ShoppingCart, Add, Remove } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { THEME } from '@/lib/constants';
import { useCart } from '@/lib/CartContext';

// Sample ready-made products
const shopProducts = [
  {
    id: 'habesha-kemis-1',
    name: 'Traditional Habesha Kemis',
    price: 299,
    originalPrice: 399,
    description: 'Exquisite hand-embroidered cotton dress featuring intricate Ethiopian patterns and traditional tilf designs. Perfect for special occasions and cultural celebrations.',
    features: [
      'Hand-embroidered traditional patterns',
      'Premium 100% cotton fabric',
      'Traditional tilf border design',
      'Available in multiple sizes',
      'Cultural authenticity certified'
    ],
    image: '/images/instagram/imgi_1_278193034_380033810648589_636440153269846173_n.jpg',
    category: 'Traditional',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Cream', 'Light Blue'],
    inStock: true,
    bestseller: true
  },
  {
    id: 'modern-tilfi-1',
    name: 'Modern Tilfi Dress',
    price: 249,
    originalPrice: 320,
    description: 'Contemporary interpretation of traditional Ethiopian formal wear. Features modern cuts while maintaining cultural elements and sophisticated styling.',
    features: [
      'Modern contemporary design',
      'Traditional Ethiopian elements',
      'Comfortable fit and cut',
      'Suitable for formal events',
      'High-quality fabric blend'
    ],
    image: '/images/instagram/imgi_3_353591052_285357163930407_5308760856456849800_n.jpg',
    category: 'Modern',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Burgundy'],
    inStock: true,
    bestseller: false
  },
  {
    id: 'wedding-dress-1',
    name: 'Ethiopian Wedding Dress',
    price: 599,
    originalPrice: 799,
    description: 'Luxurious wedding dress combining traditional Ethiopian bridal elements with elegant modern styling. Perfect for the most special day of your life.',
    features: [
      'Luxury bridal fabric',
      'Traditional wedding elements',
      'Custom tailoring included',
      'Ceremonial accessories included',
      'Heirloom quality construction'
    ],
    image: '/images/instagram/imgi_7_278407559_1005903230031551_1377516088203914242_n.webp',
    category: 'Bridal',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Ivory', 'Champagne'],
    inStock: true,
    bestseller: true
  },
  {
    id: 'mens-suit-1',
    name: "Men's Ethiopian Suit",
    price: 399,
    originalPrice: 499,
    description: 'Sophisticated men\'s suit featuring traditional Ethiopian styling with modern tailoring. Perfect for formal occasions and cultural events.',
    features: [
      'Traditional Ethiopian styling',
      'Modern tailoring techniques',
      'Premium suit fabric',
      'Cultural pattern details',
      'Professional appearance'
    ],
    image: '/images/instagram/imgi_8_278414402_4983576831731269_5207514082339612036_n.webp',
    category: 'Men',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Navy', 'Charcoal'],
    inStock: true,
    bestseller: false
  }
];

export default function ShopPage() {
  const router = useRouter();
  const { addItem, items } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0] || '');
    setSelectedColor(product.colors[0] || '');
    setQuantity(1);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedProduct(null);
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedProduct || !selectedSize || !selectedColor) return;

    const cartItem = {
      id: Date.now(), // Generate unique numeric ID
      productId: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.image,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      category: selectedProduct.category
    };

    addItem(cartItem);
    handleCloseModal();
  };

  const handleContinueShopping = () => {
    handleCloseModal();
  };

  const handleCheckout = () => {
    router.push('/cart');
  };

  const getTotalCartItems = () => {
    return items.reduce((total: number, item: any) => total + item.quantity, 0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Header */}
      <Box sx={{ mb: 6, textAlign: 'center' }}>
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
          Ready-Made Collection
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 4,
            color: 'text.secondary',
            fontFamily: THEME.typography.headingFamily
          }}
        >
          Beautiful Ethiopian fashion, ready to ship
        </Typography>

        {/* Cart Button */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
          <Button
            variant="outlined"
            startIcon={
              <Badge badgeContent={getTotalCartItems()} color="primary">
                <ShoppingCart />
              </Badge>
            }
            onClick={handleCheckout}
            sx={{
              borderColor: THEME.colors.primary,
              color: THEME.colors.primary,
              '&:hover': {
                borderColor: THEME.colors.secondary,
                color: THEME.colors.secondary
              }
            }}
          >
            View Cart
          </Button>
        </Box>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={4}>
        {shopProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                }
              }}
              onClick={() => handleProductClick(product)}
            >
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  height="300"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                
                {/* Badges */}
                <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
                  <Stack direction="row" spacing={1}>
                    {product.bestseller && (
                      <Chip
                        label="Bestseller"
                        size="small"
                        sx={{
                          bgcolor: THEME.colors.primary,
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    )}
                    {product.originalPrice > product.price && (
                      <Chip
                        label="Sale"
                        size="small"
                        sx={{
                          bgcolor: '#f44336',
                          color: 'white',
                          fontWeight: 600
                        }}
                      />
                    )}
                  </Stack>
                </Box>

                {/* Quick Add Button */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    opacity: 0,
                    transition: 'opacity 0.3s ease',
                    '.MuiCard-root:hover &': {
                      opacity: 1
                    }
                  }}
                >
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: THEME.colors.primary,
                      color: 'white',
                      minWidth: 'auto',
                      px: 2,
                      '&:hover': {
                        bgcolor: THEME.colors.secondary
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product);
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  {product.name}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ mb: 2, height: '40px', overflow: 'hidden' }}
                >
                  {product.description.slice(0, 80)}...
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: THEME.colors.primary,
                      fontWeight: 600 
                    }}
                  >
                    ${product.price}
                  </Typography>
                  {product.originalPrice > product.price && (
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        textDecoration: 'line-through',
                        color: 'text.secondary'
                      }}
                    >
                      ${product.originalPrice}
                    </Typography>
                  )}
                </Box>

                <Chip
                  label={product.category}
                  size="small"
                  variant="outlined"
                  sx={{ borderColor: THEME.colors.primary }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Product Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={modalOpen}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '95%', sm: '90%', md: '80%', lg: '70%' },
              maxWidth: '900px',
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              borderRadius: 3,
              boxShadow: 24,
              overflow: 'auto'
            }}
          >
            {selectedProduct && (
              <>
                {/* Modal Header */}
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  p: 3,
                  borderBottom: 1,
                  borderColor: 'divider'
                }}>
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    {selectedProduct.name}
                  </Typography>
                  <IconButton onClick={handleCloseModal}>
                    <Close />
                  </IconButton>
                </Box>

                {/* Modal Content */}
                <Grid container>
                  {/* Product Image */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 3 }}>
                      <Box
                        component="img"
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        sx={{
                          width: '100%',
                          height: { xs: '300px', md: '400px' },
                          objectFit: 'cover',
                          borderRadius: 2
                        }}
                      />
                    </Box>
                  </Grid>

                  {/* Product Details */}
                  <Grid item xs={12} md={6}>
                    <Box sx={{ p: 3 }}>
                      {/* Price */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                        <Typography 
                          variant="h4" 
                          sx={{ 
                            color: THEME.colors.primary,
                            fontWeight: 600 
                          }}
                        >
                          ${selectedProduct.price}
                        </Typography>
                        {selectedProduct.originalPrice > selectedProduct.price && (
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              textDecoration: 'line-through',
                              color: 'text.secondary'
                            }}
                          >
                            ${selectedProduct.originalPrice}
                          </Typography>
                        )}
                      </Box>

                      {/* Description */}
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {selectedProduct.description}
                      </Typography>

                      {/* Features */}
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Features:
                      </Typography>
                      <Box component="ul" sx={{ pl: 2, mb: 3 }}>
                        {selectedProduct.features.map((feature: string, index: number) => (
                          <Typography component="li" variant="body2" key={index} sx={{ mb: 0.5 }}>
                            {feature}
                          </Typography>
                        ))}
                      </Box>

                      {/* Size Selection */}
                      <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Size</InputLabel>
                        <Select
                          value={selectedSize}
                          label="Size"
                          onChange={(e) => setSelectedSize(e.target.value)}
                        >
                          {selectedProduct.sizes.map((size: string) => (
                            <MenuItem key={size} value={size}>
                              {size}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Color Selection */}
                      <FormControl fullWidth sx={{ mb: 3 }}>
                        <InputLabel>Color</InputLabel>
                        <Select
                          value={selectedColor}
                          label="Color"
                          onChange={(e) => setSelectedColor(e.target.value)}
                        >
                          {selectedProduct.colors.map((color: string) => (
                            <MenuItem key={color} value={color}>
                              {color}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* Quantity */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                          Quantity:
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <IconButton
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            size="small"
                            sx={{ border: 1, borderColor: 'divider' }}
                          >
                            <Remove />
                          </IconButton>
                          <Typography variant="h6" sx={{ minWidth: '40px', textAlign: 'center' }}>
                            {quantity}
                          </Typography>
                          <IconButton
                            onClick={() => setQuantity(quantity + 1)}
                            size="small"
                            sx={{ border: 1, borderColor: 'divider' }}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </Box>

                      <Divider sx={{ mb: 3 }} />

                      {/* Total Price */}
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Total: ${(selectedProduct.price * quantity).toFixed(2)}
                        </Typography>
                      </Box>

                      {/* Action Buttons */}
                      <Stack spacing={2}>
                        <Button
                          variant="contained"
                          size="large"
                          onClick={handleAddToCart}
                          disabled={!selectedSize || !selectedColor}
                          sx={{
                            bgcolor: THEME.colors.primary,
                            color: 'white',
                            py: 2,
                            fontSize: '1.1rem',
                            '&:hover': {
                              bgcolor: THEME.colors.secondary
                            }
                          }}
                        >
                          Add to Cart
                        </Button>
                        
                        <Button
                          variant="outlined"
                          size="large"
                          onClick={handleContinueShopping}
                          sx={{
                            borderColor: THEME.colors.primary,
                            color: THEME.colors.primary,
                            '&:hover': {
                              borderColor: THEME.colors.secondary,
                              color: THEME.colors.secondary
                            }
                          }}
                        >
                          Continue Shopping
                        </Button>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </>
            )}
          </Box>
        </Fade>
      </Modal>
    </Container>
  );
} 