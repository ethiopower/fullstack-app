'use client';

import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Grid,
  Stack,
  Divider,
  Alert
} from '@mui/material';
import { THEME } from '@/lib/constants';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  isCustom?: boolean;
  measurements?: { [key: string]: string };
  personName?: string;
}

interface Order {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  items: OrderItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
}

export default function OrderTrackingPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.orderId}`);
        if (!response.ok) {
          throw new Error('Order not found');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError('Failed to load order details');
        console.error('Error fetching order:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.orderId]);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center">
          Loading order details...
        </Typography>
      </Container>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Order not found'}
        </Alert>
        <Typography variant="body1" textAlign="center">
          Please check your order ID and try again.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography
        variant="h1"
        sx={{
          fontSize: { xs: '2rem', md: '2.5rem' },
          fontFamily: THEME.typography.headingFamily,
          fontWeight: 500,
          mb: 2,
          color: 'text.primary',
          textAlign: 'center'
        }}
      >
        Order Summary
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{
            mb: 1,
            textAlign: 'center',
            fontFamily: THEME.typography.headingFamily
          }}
        >
          Status:
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Chip
            label={order.status}
            color={order.status === 'preparing' ? 'primary' : 'success'}
            sx={{
              fontSize: '1rem',
              py: 2,
              px: 3
            }}
          />
        </Box>
      </Box>

      <Grid container spacing={4}>
        {/* Order Details */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Order Details
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Order ID:</Typography>
                  <Typography>{order.id}</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Customer Name:</Typography>
                  <Typography>{order.customer.name}</Typography>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Delivery Address:</Typography>
                  <Typography>
                    {order.customer.address}<br />
                    {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Items */}
        <Grid item xs={12}>
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Order Items
              </Typography>

              <Stack spacing={2}>
                {order.items.map((item, index) => (
                  <Box key={item.id || index}>
                    {index > 0 && <Divider sx={{ my: 2 }} />}
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {item.name} x {item.quantity}
                        </Typography>
                        
                        <Stack spacing={1} sx={{ mt: 1, ml: 2 }}>
                          {item.personName && (
                            <Typography variant="body2" color="text.secondary">
                              For: {item.personName}
                            </Typography>
                          )}
                          
                          {item.size && (
                            <Typography variant="body2" color="text.secondary">
                              Size: {item.size}
                            </Typography>
                          )}
                          
                          {item.color && (
                            <Typography variant="body2" color="text.secondary">
                              Color: {item.color}
                            </Typography>
                          )}

                          {item.isCustom && item.measurements && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" color="text.secondary" gutterBottom>
                                Measurements:
                              </Typography>
                              <Grid container spacing={1} sx={{ pl: 2 }}>
                                {Object.entries(item.measurements).map(([key, value]) => (
                                  <Grid item xs={6} key={key}>
                                    <Typography variant="body2" color="text.secondary">
                                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value} cm
                                    </Typography>
                                  </Grid>
                                ))}
                              </Grid>
                            </Box>
                          )}
                        </Stack>

                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            color: THEME.colors.primary,
                            fontWeight: 600,
                            mt: 1
                          }}
                        >
                          ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Stack spacing={1}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Subtotal:</Typography>
                  <Typography>${order.subtotal.toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Tax:</Typography>
                  <Typography>${order.tax.toFixed(2)}</Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: THEME.colors.primary }}>
                    ${order.total.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 