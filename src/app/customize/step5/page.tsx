'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/CartContext';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  TextField,
  Grid,
  Alert,
  Divider
} from '@mui/material';
import { THEME } from '@/lib/constants';

type OrderSummary = {
  items: any[];
  people: any[];
  subtotal: number;
  tax: number;
  total: number;
};

type CustomerInfo = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  notes: string;
};

export default function GuestCheckoutPage() {
  const router = useRouter();
  const { clearCart, addItem } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    notes: '',
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const searchParams = new URLSearchParams(window.location.search);
    const source = searchParams.get('source');
    
    // Handle cart checkout vs custom order checkout
    if (source === 'cart') {
      const cartSummary = sessionStorage.getItem('cartOrderSummary');
      if (!cartSummary) {
        router.push('/cart');
        return;
      }
      try {
        setOrderSummary(JSON.parse(cartSummary));
      } catch (error) {
        console.error('Error parsing cart summary:', error);
        router.push('/cart');
      }
    } else {
      // Custom order flow
      const storedSummary = sessionStorage.getItem('orderSummary');
      if (!storedSummary) {
        router.push('/customize/step4');
        return;
      }
      try {
        setOrderSummary(JSON.parse(storedSummary));
      } catch (error) {
        console.error('Error parsing order summary:', error);
        router.push('/customize/step4');
      }
    }
  }, [router]);

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!customerInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!customerInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!customerInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    if (!customerInfo.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!customerInfo.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!customerInfo.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!customerInfo.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Save customer info to session storage
      sessionStorage.setItem('customerInfo', JSON.stringify(customerInfo));
      
      // Create order object for payment
      const order = {
        orderSummary,
        customerInfo,
        timestamp: new Date().toISOString(),
        orderId: `FAF-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`
      };
      
      sessionStorage.setItem('pendingOrder', JSON.stringify(order));
      
      // Redirect to payment page
      // Add customize items to cart for unified checkout
    if (orderSummary?.items) {
      orderSummary.items.forEach((item: any) => {
        const cartItem = {
          id: Date.now() + Math.random(),
          name: `Custom ${item.gender}'s Garment`,
          price: item.price,
          quantity: 1,
          image: '/images/fafresh-logo.png',
          size: item.measurements?.standardSize || 'Custom',
          color: 'Custom Design',
          category: 'custom',
          productId: `custom-${item.personId}`,
          customizations: {
            gender: item.gender,
            measurements: item.measurements,
            personId: item.personId,
            personName: item.personName
          }
        };
        addItem(cartItem);
      });
    }
    
    router.push('/customize/payment');
      
    } catch (error) {
      console.error('Error processing checkout:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    const searchParams = new URLSearchParams(window.location.search);
    const source = searchParams.get('source');
    
    if (source === 'cart') {
      router.push('/cart');
    } else {
      router.push('/customize/step4');
    }
  };

  if (!orderSummary) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center">
          Loading checkout...
        </Typography>
      </Container>
    );
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
          color: 'text.primary',
          textAlign: 'center'
        }}
      >
        Guest Checkout
      </Typography>

      <Typography 
        variant="h6" 
        sx={{ 
          mb: 6,
          color: 'text.secondary',
          textAlign: 'center',
          fontFamily: THEME.typography.headingFamily
        }}
      >
        Enter your information to complete your order
      </Typography>

      <Grid container spacing={4}>
        {/* Customer Information Form */}
        <Grid item xs={12} md={8}>
          <Card elevation={2}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
                Contact Information
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name *"
                    value={customerInfo.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    error={!!errors.firstName}
                    helperText={errors.firstName}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name *"
                    value={customerInfo.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    error={!!errors.lastName}
                    helperText={errors.lastName}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address *"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    error={!!errors.email}
                    helperText={errors.email}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number *"
                    value={customerInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    error={!!errors.phone}
                    helperText={errors.phone}
                  />
                </Grid>
              </Grid>

              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mt: 4, mb: 3 }}>
                Shipping Address
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address *"
                    value={customerInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    error={!!errors.address}
                    helperText={errors.address}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="City *"
                    value={customerInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    error={!!errors.city}
                    helperText={errors.city}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="State *"
                    value={customerInfo.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    error={!!errors.state}
                    helperText={errors.state}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="ZIP Code *"
                    value={customerInfo.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                    error={!!errors.zipCode}
                    helperText={errors.zipCode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Special Instructions (Optional)"
                    multiline
                    rows={3}
                    value={customerInfo.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any special requests or delivery instructions..."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Order Summary Sidebar */}
        <Grid item xs={12} md={4}>
          <Card 
            elevation={3}
            sx={{
              position: 'sticky',
              top: 20,
              border: `2px solid ${THEME.colors.primary}`,
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Order Summary
              </Typography>
              
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Items ({orderSummary.items.length}):</Typography>
                  <Typography>${orderSummary.subtotal.toFixed(2)}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography>Tax:</Typography>
                  <Typography>${orderSummary.tax.toFixed(2)}</Typography>
                </Box>
                
                <Divider />
                
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: THEME.colors.primary }}>
                    ${orderSummary.total.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>

              <Alert severity="info" sx={{ mt: 3, mb: 2 }}>
                <Typography variant="body2">
                  Free delivery to our store location. Pickup available in 3-4 weeks.
                </Typography>
              </Alert>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleSubmit}
                disabled={isSubmitting}
                sx={{
                  mt: 2,
                  bgcolor: THEME.colors.primary,
                  color: 'white',
                  py: 2,
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: THEME.colors.secondary
                  }
                }}
              >
                {isSubmitting ? 'Processing...' : 'Continue to Payment'}
              </Button>

              <Button
                variant="outlined"
                fullWidth
                size="large"
                onClick={handleBack}
                disabled={isSubmitting}
                sx={{
                  mt: 2,
                  borderColor: THEME.colors.primary,
                  color: THEME.colors.primary,
                  '&:hover': {
                    borderColor: THEME.colors.secondary,
                    color: THEME.colors.secondary
                  }
                }}
              >
                Back to Summary
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 