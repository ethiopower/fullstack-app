'use client';

import { Box, Container, Typography, Button, Paper, Grid, IconButton, Stack, Divider } from '@mui/material';
import { RemoveCircleOutline, AddCircleOutline, DeleteOutline, ShoppingBagOutlined } from '@mui/icons-material';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { THEME } from '@/lib/constants';

export default function CartPage() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, minHeight: '70vh', mt: 8 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 3
          }}
        >
          <ShoppingBagOutlined sx={{ fontSize: 100, color: 'text.secondary', opacity: 0.5 }} />
          <Typography 
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              fontFamily: THEME.typography.headingFamily,
              fontWeight: 500
            }}
          >
            Your Cart is Empty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Explore our collection and find your perfect Ethiopian-inspired piece
          </Typography>
          <Button
            component={Link}
            href="/shop"
            variant="contained"
            size="large"
            sx={{
              bgcolor: THEME.colors.primary,
              color: 'white',
              px: 6,
              py: 2,
              '&:hover': {
                bgcolor: THEME.colors.secondary
              }
            }}
          >
            Start Shopping
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 8, mt: 8 }}>
      <Typography 
        variant="h1"
        sx={{
          fontSize: { xs: '2rem', md: '2.5rem' },
          fontFamily: THEME.typography.headingFamily,
          fontWeight: 500,
          mb: 4
        }}
      >
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ p: 2 }}>
            {items.map((item) => (
              <Box key={item.id} sx={{ mb: 2 }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Box sx={{ position: 'relative', pt: '100%' }}>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 768px) 33vw, 20vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={9}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="h6" color="primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                    {item.size && (
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Size: {item.size}
                      </Typography>
                    )}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <RemoveCircleOutline />
                        </IconButton>
                        <Typography>{item.quantity}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <AddCircleOutline />
                        </IconButton>
                      </Stack>
                      <IconButton
                        color="error"
                        onClick={() => removeItem(item.id)}
                      >
                        <DeleteOutline />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={0} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ my: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>${total.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Shipping</Typography>
                <Typography>Free</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary">
                  ${total.toFixed(2)}
                </Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                bgcolor: THEME.colors.primary,
                color: 'white',
                '&:hover': {
                  bgcolor: THEME.colors.secondary
                }
              }}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
} 