'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Grid,
  Stack,
  Divider,
  Chip,
  Alert
} from '@mui/material';
import { Add, Remove, Delete, ShoppingBag } from '@mui/icons-material';
import { useCart } from '@/lib/CartContext';
import { THEME } from '@/lib/constants';

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) return;

    // Convert cart items to order format for unified checkout
    const orderSummary = {
      items: items.map(item => ({
        type: 'shop', // Mark as shop item vs custom item
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        size: item.size,
        color: item.color,
        category: item.category
      })),
      subtotal: Math.round(subtotal * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100
    };

    // Save to session storage for unified checkout flow
    sessionStorage.setItem('cartOrderSummary', JSON.stringify(orderSummary));
    
    // Go to unified checkout page
    router.push('/customize/step5?source=cart');
  };

  const handleContinueShopping = () => {
    router.push('/shop');
  };

  if (!isClient) {
    return <div>Loading...</div>;
  }

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
        Shopping Cart
      </Typography>

      <Typography 
        variant="h6" 
        sx={{ 
          mb: 6,
          color: 'text.secondary',
          fontFamily: THEME.typography.headingFamily
        }}
      >
        Review your selected items
      </Typography>

      {items.length === 0 ? (
        <Card elevation={2} sx={{ p: 6, textAlign: 'center' }}>
          <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Browse our collection and add items to your cart
          </Typography>
          <Button
            variant="contained"
            onClick={handleContinueShopping}
            sx={{
              bgcolor: THEME.colors.primary,
              '&:hover': { bgcolor: THEME.colors.secondary }
            }}
          >
            Start Shopping
          </Button>
        </Card>
      ) : (
        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {items.map((item) => (
                <Card key={item.id} elevation={2}>
                  <CardContent sx={{ p: 3 }}>
                    <Grid container spacing={3} alignItems="center">
                      {/* Product Image */}
                      <Grid item xs={12} sm={3}>
                        <CardMedia
                          component="img"
                          height="120"
                          image={item.image}
                          alt={item.name}
                          sx={{ objectFit: 'cover', borderRadius: 1 }}
                        />
                      </Grid>

                      {/* Product Details */}
                      <Grid item xs={12} sm={5}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                          {item.size && (
                            <Chip 
                              label={`Size: ${item.size}`} 
                              size="small" 
                              variant="outlined"
                            />
                          )}
                          {item.color && (
                            <Chip 
                              label={`Color: ${item.color}`} 
                              size="small" 
                              variant="outlined"
                            />
                          )}
                        </Stack>

                        <Typography 
                          variant="h6" 
                          sx={{ 
                            color: THEME.colors.primary,
                            fontWeight: 600 
                          }}
                        >
                          ${item.price}
                        </Typography>
                      </Grid>

                      {/* Quantity Controls */}
                      <Grid item xs={12} sm={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconButton
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            size="small"
                            sx={{ border: 1, borderColor: 'divider' }}
                          >
                            <Remove />
                          </IconButton>
                          <Typography variant="h6" sx={{ minWidth: '40px', textAlign: 'center' }}>
                            {item.quantity}
                          </Typography>
                          <IconButton
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            size="small"
                            sx={{ border: 1, borderColor: 'divider' }}
                          >
                            <Add />
                          </IconButton>
                        </Box>
                      </Grid>

                      {/* Remove Button */}
                      <Grid item xs={12} sm={2}>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                          <IconButton
                            onClick={() => removeItem(item.id)}
                            color="error"
                            sx={{
                              '&:hover': {
                                bgcolor: 'error.light',
                                color: 'white'
                              }
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ position: 'sticky', top: 24 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Summary
                </Typography>

                <Stack spacing={2} sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</Typography>
                    <Typography>${subtotal.toFixed(2)}</Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Tax (8%)</Typography>
                    <Typography>${tax.toFixed(2)}</Typography>
                  </Box>
                </Stack>

                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: THEME.colors.primary }}>
                    ${total.toFixed(2)}
                  </Typography>
                </Box>

                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="body2">
                    Ready-made items ship within 1-2 business days.
                    Custom items require 3-4 weeks for completion.
                  </Typography>
                </Alert>

                <Stack spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleCheckout}
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
                    Proceed to Checkout
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

                  <Button
                    variant="text"
                    size="small"
                    onClick={clearCart}
                    color="error"
                  >
                    Clear Cart
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
} 