'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Button
} from '@mui/material';
import {
  LocalShipping as ShippingIcon,
  Store as StoreIcon,
  Phone as PhoneIcon,
  Email as EmailIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { THEME, BUSINESS_INFO } from '@/lib/constants';

type OrderStatus = 'PENDING' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED';

type Order = {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  orderDate: string;
  status: OrderStatus;
  subtotal: number;
  items: Array<{
    gender: string;
    occasion: string;
    design: any;
    measurements: any;
  }>;
};

const orderSteps = [
  'Order Placed',
  'Processing',
  'Ready for Pickup',
  'Completed'
];

const statusColors: Record<OrderStatus, string> = {
  PENDING: '#FFA726',
  PROCESSING: '#29B6F6',
  READY_FOR_PICKUP: '#66BB6A',
  COMPLETED: '#4CAF50',
  CANCELLED: '#EF5350'
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function OrderTrackingPage({
  params
}: {
  params: { orderId: string }
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [params.orderId]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '70vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !order) {
    return (
      <Container maxWidth="md" sx={{ py: 8, minHeight: '70vh', mt: 8 }}>
        <Alert severity="error" sx={{ mb: 4 }}>
          {error || 'Order not found'}
        </Alert>
        <Button
          component={Link}
          href="/"
          variant="contained"
          sx={{
            bgcolor: THEME.colors.primary,
            color: 'white',
            '&:hover': {
              bgcolor: THEME.colors.secondary
            }
          }}
        >
          Return Home
        </Button>
      </Container>
    );
  }

  const orderStatus = orderSteps.indexOf(order.status);

  return (
    <Box sx={{ py: THEME.spacing.section, minHeight: '100vh', mt: 8 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h1"
          sx={{
            fontSize: { xs: '2rem', md: '2.5rem' },
            fontFamily: THEME.typography.headingFamily,
            fontWeight: 500,
            mb: 2
          }}
        >
          Order Status
        </Typography>

        <Typography variant="h6" color="text.secondary" gutterBottom>
          Order #{order.id}
        </Typography>

        <Grid container spacing={6}>
          {/* Order Status */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 4, mb: 4 }}>
              <Stack spacing={4}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Current Status
                  </Typography>
                  <Chip
                    label={order.status.replace('_', ' ')}
                    sx={{
                      bgcolor: `${statusColors[order.status]}15`,
                      color: statusColors[order.status],
                      fontWeight: 500,
                      fontSize: '1rem',
                      py: 1
                    }}
                  />
                </Box>

                <Box>
                  <Stepper activeStep={orderStatus} alternativeLabel>
                    {orderSteps.map((label) => (
                      <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Order Details */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Order Date
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(order.orderDate)}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Items
                  </Typography>
                  {order.items.map((item, index) => (
                    <Box key={index} sx={{ mt: 2 }}>
                      <Typography variant="body1" fontWeight="medium">
                        Custom {item.gender}'s {item.occasion} Outfit
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Design: {item.design.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Amount
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    ${order.subtotal.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>

          {/* Store Information */}
          <Grid item xs={12} md={4}>
            <Stack spacing={4}>
              <Paper elevation={0} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Store Information
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <StoreIcon sx={{ color: THEME.colors.primary }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Address
                        </Typography>
                        <Typography variant="body1">
                          {BUSINESS_INFO.address.full}<br />
                          {BUSINESS_INFO.location}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <PhoneIcon sx={{ color: THEME.colors.primary }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Phone
                        </Typography>
                        <Typography variant="body1">
                          {BUSINESS_INFO.phone}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>

                  <Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <EmailIcon sx={{ color: THEME.colors.primary }} />
                      <Box>
                        <Typography variant="subtitle2" color="text.secondary">
                          Email
                        </Typography>
                        <Typography variant="body1">
                          {BUSINESS_INFO.contactEmail}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Paper>

              <Button
                component={Link}
                href="/contact"
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: THEME.colors.primary,
                  color: THEME.colors.primary,
                  '&:hover': {
                    borderColor: THEME.colors.secondary,
                    color: THEME.colors.secondary
                  }
                }}
              >
                Contact Us
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 