'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  Divider,
  Grid,
  Alert,
  Chip
} from '@mui/material';
import { CheckCircle, Phone, Email, LocationOn, CalendarToday } from '@mui/icons-material';
import { THEME, BUSINESS_INFO } from '@/lib/constants';

type Order = {
  id?: string;
  orderId?: string;
  squareOrderId?: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: any[];
  people: any[];
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  paymentStatus?: string;
  timestamp?: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error('Order not found');
        }

        const orderData = await response.json();
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Order not found. Please check your order ID.');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const handleBackToHome = () => {
    router.push('/');
  };

  const handleNewOrder = () => {
    router.push('/customize/step0');
  };

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
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Order not found'}
        </Alert>
        <Button variant="contained" onClick={handleBackToHome}>
          Back to Home
        </Button>
      </Container>
    );
  }

  const estimatedDelivery = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000); // 3 weeks from now

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* Success Header */}
      <Box textAlign="center" sx={{ mb: 6 }}>
        <CheckCircle 
          sx={{ 
            fontSize: 80, 
            color: THEME.colors.primary, 
            mb: 2 
          }} 
        />
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
          Order Confirmed!
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            fontFamily: THEME.typography.headingFamily
          }}
        >
          Thank you for your custom order. We'll start working on it right away.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Order Details */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {/* Order Information */}
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Order ID:</Typography>
                    <Typography variant="h6" sx={{ color: THEME.colors.primary, fontFamily: 'monospace', fontSize: '1rem' }}>
                      {order.id || order.squareOrderId || orderId || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Order Date:</Typography>
                    <Typography>
                      {order.createdAt ? 
                        new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 
                        new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      }
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Stack direction="row" spacing={1}>
                      <Chip 
                        label={order.status || 'preparing'} 
                        color="warning" 
                        variant="outlined"
                      />
                      <Chip 
                        label="paid" 
                        color="primary" 
                        variant="outlined"
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Customer Information
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Name:</Typography>
                    <Typography>{order.customer.firstName} {order.customer.lastName}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Email:</Typography>
                    <Typography>{order.customer.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Phone:</Typography>
                    <Typography>{order.customer.phone}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="text.secondary">Address:</Typography>
                    <Typography>
                      {order.customer.address}<br />
                      {order.customer.city}, {order.customer.state} {order.customer.zipCode}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Items ({order.items.length})
                </Typography>
                
                <Stack spacing={2}>
                  {order.items.map((item, index) => {
                    const person = order.people.find(p => p.id === item.personId);
                    return (
                      <Box 
                        key={item.personId} 
                        sx={{ 
                          p: 2, 
                          border: 1, 
                          borderColor: 'divider', 
                          borderRadius: 2 
                        }}
                      >
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={6}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                              {item.name || 'Custom Fashion Garment'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                              For: {person?.name || 'Customer'} • {person?.category || 'Adult'} • {person?.gender || 'Unisex'}
                            </Typography>
                            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                              {item.size && (
                                <Chip label={`Size: ${item.size}`} size="small" />
                              )}
                              {item.color && (
                                <Chip label={`Color: ${item.color}`} size="small" variant="outlined" />
                              )}
                            </Stack>
                          </Grid>
                          <Grid item xs={12} sm={6} textAlign="right">
                            <Typography variant="h6" sx={{ color: THEME.colors.primary }}>
                              ${item.price?.toFixed(2) || '299.00'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Qty: {item.quantity || 1}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <Stack spacing={3}>
            {/* Order Total */}
            <Card elevation={3} sx={{ border: `2px solid ${THEME.colors.primary}` }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Total
                </Typography>
                
                <Stack spacing={2}>
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Subtotal:</Typography>
                    <Typography>${order.subtotal.toFixed(2)}</Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography>Tax:</Typography>
                    <Typography>${order.tax.toFixed(2)}</Typography>
                  </Box>
                  
                  <Divider />
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Total Paid:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: THEME.colors.primary }}>
                      ${order.total.toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  What's Next?
                </Typography>
                
                <Stack spacing={2}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <CalendarToday sx={{ color: THEME.colors.primary }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Estimated Completion
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {estimatedDelivery.toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={2}>
                    <LocationOn sx={{ color: THEME.colors.primary }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Pickup Location
                      </Typography>
                                             <Typography variant="body2" color="text.secondary">
                         {BUSINESS_INFO.address.full}
                       </Typography>
                    </Box>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={2}>
                    <Phone sx={{ color: THEME.colors.primary }} />
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        Contact Us
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {BUSINESS_INFO.phone}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>

                <Alert severity="info" sx={{ mt: 3 }}>
                  <Typography variant="body2">
                    We'll email you when your order is ready for pickup!
                  </Typography>
                </Alert>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Stack spacing={2}>
              <Button
                variant="contained"
                fullWidth
                onClick={handleNewOrder}
                sx={{
                  bgcolor: THEME.colors.primary,
                  color: 'white',
                  py: 2,
                  '&:hover': {
                    bgcolor: THEME.colors.secondary
                  }
                }}
              >
                Place Another Order
              </Button>
              
              <Button
                variant="outlined"
                fullWidth
                onClick={handleBackToHome}
                sx={{
                  borderColor: THEME.colors.primary,
                  color: THEME.colors.primary,
                  '&:hover': {
                    borderColor: THEME.colors.secondary,
                    color: THEME.colors.secondary
                  }
                }}
              >
                Back to Home
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
} 