'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Chip,
  Grid,
  Alert,
  CircularProgress,
  Stack
} from '@mui/material';
import { 
  CheckCircle, 
  Schedule, 
  Build, 
  LocalShipping, 
  Done 
} from '@mui/icons-material';
import { THEME } from '@/lib/constants';

const orderSteps = [
  {
    label: 'Order Placed',
    icon: <CheckCircle />,
    description: 'Your order has been confirmed and payment processed'
  },
  {
    label: 'Preparing',
    icon: <Build />,
    description: 'We are crafting your custom garment'
  },
  {
    label: 'Quality Check',
    icon: <Schedule />,
    description: 'Final quality inspection and finishing touches'
  },
  {
    label: 'Ready for Pickup',
    icon: <LocalShipping />,
    description: 'Your order is ready for pickup at our location'
  },
  {
    label: 'Completed',
    icon: <Done />,
    description: 'Order picked up successfully'
  }
];

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size?: string;
  isCustom?: boolean;
  measurements?: { [key: string]: string };
  color?: string;
  personId?: string;
}

interface Person {
  id: string;
  name: string;
  measurements?: { [key: string]: string };
}

interface Order {
  id: string;
  status: string;
  total: number;
  subtotal: number;
  tax: number;
  items: OrderItem[];
  people?: Person[];
  customer?: {
    name: string;
    email: string;
    phone?: string;
  };
  pickupDate?: string;
}

export default function OrderTrackingPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        setError('Unable to find order. Please check your order ID.');
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrder();
    }
  }, [orderId]);

  const getCurrentStep = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'preparing': return 1;
      case 'quality_check': return 2;
      case 'ready': return 3;
      case 'completed': return 4;
      default: return 1;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading order details...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Container>
    );
  }

  const activeStep = getCurrentStep(order?.status || 'preparing');

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h3" gutterBottom textAlign="center" sx={{ fontWeight: 600 }}>
        Track Your Order
      </Typography>
      
      <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 4 }}>
        Order ID: {orderId}
      </Typography>

      {order && (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Progress
                </Typography>
                
                <Stepper activeStep={activeStep} orientation="vertical">
                  {orderSteps.map((step, index) => (
                    <Step key={step.label}>
                      <StepLabel 
                        icon={step.icon}
                        sx={{
                          '& .MuiStepLabel-iconContainer': {
                            color: index <= activeStep ? THEME.colors.primary : 'grey.400'
                          }
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {step.label}
                        </Typography>
                      </StepLabel>
                      <StepContent>
                        <Typography color="text.secondary">
                          {step.description}
                        </Typography>
                      </StepContent>
                    </Step>
                  ))}
                </Stepper>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={4}>
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Order Summary
                </Typography>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Status:</Typography>
                  <Chip 
                    label={order.status || 'preparing'} 
                    color="warning" 
                    variant="outlined"
                    sx={{ mt: 0.5 }}
                  />
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Total:</Typography>
                  <Typography variant="h6" sx={{ color: THEME.colors.primary }}>
                    ${order.total?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>

                {/* Items with Measurements */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Order Items:
                  </Typography>
                  {order.items?.map((item: OrderItem, index: number) => {
                    const person = order.people?.find((p: Person) => p.id === item.personId);
                    return (
                      <Card 
                        key={index} 
                        variant="outlined" 
                        sx={{ mb: 2, p: 2, bgcolor: 'grey.50' }}
                      >
                        <Stack spacing={1}>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {item.name}
                          </Typography>
                          <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip 
                              label={`Qty: ${item.quantity}`} 
                              size="small" 
                              variant="outlined" 
                            />
                            {item.size && (
                              <Chip 
                                label={item.size} 
                                size="small" 
                                color={item.isCustom ? 'primary' : 'default'}
                                variant="outlined" 
                              />
                            )}
                            {item.color && (
                              <Chip 
                                label={item.color} 
                                size="small" 
                                variant="outlined" 
                              />
                            )}
                          </Stack>
                          {person && (
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                For: {person.name}
                              </Typography>
                              {item.isCustom && item.measurements && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    Measurements:
                                  </Typography>
                                  <Grid container spacing={1} sx={{ mt: 0.5 }}>
                                    {Object.entries(item.measurements).map(([key, value]) => (
                                      <Grid item xs={6} key={key}>
                                        <Typography 
                                          variant="caption" 
                                          sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between',
                                            color: 'text.secondary'
                                          }}
                                        >
                                          <span style={{ textTransform: 'capitalize' }}>
                                            {key}:
                                          </span>
                                          <span>{value} cm</span>
                                        </Typography>
                                      </Grid>
                                    ))}
                                  </Grid>
                                </Box>
                              )}
                            </Box>
                          )}
                          <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </Typography>
                        </Stack>
                      </Card>
                    );
                  })}
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">Subtotal:</Typography>
                  <Typography variant="subtitle2">
                    ${order.subtotal?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>

                {order.tax > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Tax:</Typography>
                    <Typography variant="subtitle2">
                      ${order.tax.toFixed(2)}
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">Total:</Typography>
                  <Typography variant="h6" sx={{ color: THEME.colors.primary, fontWeight: 600 }}>
                    ${order.total?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>

                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Pickup Location:
                  </Typography>
                  <Typography variant="body2">
                    Inside the Global Foods<br />
                    13814 Outlet Dr<br />
                    Silver Spring, MD 20904<br />
                    <strong>Phone: (240) 704-9915</strong>
                  </Typography>
                </Box>

                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    We'll email you when your order is ready for pickup!
                  </Typography>
                </Alert>

                {/* Customer Information */}
                {order.customer && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">Customer:</Typography>
                    <Typography variant="subtitle2">
                      {order.customer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.customer.email}
                    </Typography>
                    {order.customer.phone && (
                      <Typography variant="body2" color="text.secondary">
                        {order.customer.phone}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* Pickup Details */}
                {order.pickupDate && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Estimated Pickup Date:
                    </Typography>
                    <Typography variant="subtitle2">
                      {new Date(order.pickupDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
} 