'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stack,
  Button,
  Divider,
  Grid,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  AccessTime as TimeIcon,
  LocalShipping as ShippingIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { THEME, ROUTES } from '@/lib/constants';

type OrderDetails = {
  id: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  items: Array<{
    gender: string;
    occasion: string;
    design: any;
    measurements: any;
  }>;
  subtotal: number;
  deposit: number;
  status: string;
  orderDate: string;
};

const orderSteps = [
  'Order Placed',
  'Processing',
  'Ready for Pickup',
  'Completed'
];

export default function OrderConfirmationPage({
  params
}: {
  params: { orderId: string }
}) {
  const [order, setOrder] = useState<OrderDetails | null>(null);
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
        setError('Failed to load order details. Please try again later.');
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
          href={ROUTES.home}
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
        {/* Success Message */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <CheckCircleIcon
            sx={{
              fontSize: 64,
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
              mb: 2
            }}
          >
            Order Confirmed!
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Thank you for choosing Fafresh Fashion
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Order #{order.id}
          </Typography>
        </Box>

        <Grid container spacing={6}>
          {/* Order Details */}
          <Grid item xs={12} md={8}>
            {/* Order Status */}
            <Paper elevation={0} sx={{ p: 4, mb: 4 }}>
              <Typography variant="h6" gutterBottom>
                Order Status
              </Typography>
              <Stepper activeStep={orderStatus} alternativeLabel>
                {orderSteps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>

            {/* Order Items */}
            <Paper elevation={0} sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Order Details
              </Typography>
              <Stack spacing={3}>
                {order.items.map((item, index) => (
                  <Box key={index}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Custom {item.gender}'s {item.occasion} Outfit
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Design: {item.design.name}
                        </Typography>
                      </Grid>
                    </Grid>
                    {index < order.items.length - 1 && (
                      <Divider sx={{ mt: 2 }} />
                    )}
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Stack spacing={4}>
              {/* Payment Summary */}
              <Paper elevation={0} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Payment Summary
                </Typography>
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography>Subtotal</Typography>
                    <Typography>${order.subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography>Deposit Paid</Typography>
                    <Typography>${order.deposit.toFixed(2)}</Typography>
                  </Box>
                  <Divider />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography fontWeight="bold">Balance Due</Typography>
                    <Typography fontWeight="bold">
                      ${(order.subtotal - order.deposit).toFixed(2)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Next Steps */}
              <Paper elevation={0} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Next Steps
                </Typography>
                <Stack spacing={3}>
                  <Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <TimeIcon sx={{ color: THEME.colors.primary }} />
                      <Typography variant="subtitle1">Processing Time</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Your order will be ready in approximately 3 weeks
                    </Typography>
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <ShippingIcon sx={{ color: THEME.colors.primary }} />
                      <Typography variant="subtitle1">Order Updates</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      We'll send updates to {order.customer.email}
                    </Typography>
                  </Box>
                  <Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <StoreIcon sx={{ color: THEME.colors.primary }} />
                      <Typography variant="subtitle1">Store Pickup</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      We'll notify you when your order is ready for pickup
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              {/* Action Buttons */}
              <Stack spacing={2}>
                <Button
                  component={Link}
                  href={ROUTES.shop}
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: THEME.colors.primary,
                    color: 'white',
                    '&:hover': {
                      bgcolor: THEME.colors.secondary
                    }
                  }}
                >
                  Continue Shopping
                </Button>
                <Button
                  component={Link}
                  href={ROUTES.contact}
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
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
} 