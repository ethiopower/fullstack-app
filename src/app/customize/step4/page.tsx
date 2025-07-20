'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Chip
} from '@mui/material';
import { THEME, PRODUCT_DESIGNS } from '@/lib/constants';

type OrderItem = {
  personId: string;
  gender: string;
  occasion: string;
  design: string;
  measurements: Record<string, string>;
};

type Person = {
  id: string;
  name: string;
  gender: 'men' | 'women' | 'children';
};

export default function OrderSummaryPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderItem[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const storedOrderData = sessionStorage.getItem('orderData');
    const storedPeople = sessionStorage.getItem('orderPeople');
    
    if (!storedOrderData || !storedPeople) {
      router.push('/customize/step0');
      return;
    }

    try {
      const orders = JSON.parse(storedOrderData);
      const peopleList = JSON.parse(storedPeople);
      
      setOrderData(orders);
      setPeople(peopleList);
      
      // Calculate total (base price of $299 per item for now)
      const total = orders.length * 299;
      setTotalAmount(total);
      
    } catch (error) {
      console.error('Error loading order data:', error);
      router.push('/customize/step0');
    }
  }, [router]);

  const getPersonName = (personId: string) => {
    const person = people.find(p => p.id === personId);
    return person?.name || 'Unknown';
  };

  const getDesignName = (gender: string, occasion: string, designId: string) => {
    try {
      const design = PRODUCT_DESIGNS[gender as keyof typeof PRODUCT_DESIGNS]?.[occasion as keyof typeof PRODUCT_DESIGNS.men]?.find(d => d.id === designId);
      return design?.name || 'Selected Design';
    } catch {
      return 'Selected Design';
    }
  };

  const handleProceedToCheckout = () => {
    // Save total amount to session storage
    const orderSummary = {
      items: orderData,
      people: people,
      subtotal: totalAmount,
      tax: Math.round(totalAmount * 0.08 * 100) / 100, // 8% tax
      total: Math.round((totalAmount * 1.08) * 100) / 100
    };
    
    sessionStorage.setItem('orderSummary', JSON.stringify(orderSummary));
    router.push('/customize/step5');
  };

  const handleBack = () => {
    // Go back to last person's measurements
    if (orderData.length > 0) {
      const lastOrder = orderData[orderData.length - 1];
      const params = new URLSearchParams({
        personId: lastOrder.personId,
        gender: lastOrder.gender,
        occasion: lastOrder.occasion,
        design: lastOrder.design
      });
      router.push(`/customize/step3?${params.toString()}`);
    } else {
      router.push('/customize/step0');
    }
  };

  if (orderData.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center">
          Loading order summary...
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
        Order Summary
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
        Review your custom designs before checkout
      </Typography>

      <Grid container spacing={4}>
        {/* Order Items */}
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            {orderData.map((order, index) => (
              <Card 
                key={order.personId} 
                elevation={2}
                sx={{
                  border: `1px solid ${THEME.colors.primary}20`,
                  '&:hover': {
                    boxShadow: 3
                  }
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        {getPersonName(order.personId)}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                        <Chip 
                          label={order.gender} 
                          size="small" 
                          sx={{ bgcolor: THEME.colors.primary, color: 'white' }}
                        />
                        <Chip 
                          label={order.occasion} 
                          size="small" 
                          variant="outlined"
                        />
                      </Stack>
                      <Typography variant="body1" sx={{ mb: 1 }}>
                        <strong>Design:</strong> {getDesignName(order.gender, order.occasion, order.design)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                        Measurements:
                      </Typography>
                      <Grid container spacing={1}>
                        {Object.entries(order.measurements).map(([key, value]) => (
                          <Grid item xs={6} key={key}>
                            <Typography variant="body2" color="text.secondary">
                              {key.charAt(0).toUpperCase() + key.slice(1)}: {value}"
                            </Typography>
                          </Grid>
                        ))}
                      </Grid>
                    </Grid>
                  </Grid>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" textAlign="right" sx={{ color: THEME.colors.primary }}>
                    $299.00
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Grid>

        {/* Order Total */}
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
                Order Total
              </Typography>
              
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Subtotal ({orderData.length} items):</Typography>
                  <Typography>${totalAmount.toFixed(2)}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography>Tax (8%):</Typography>
                  <Typography>${(totalAmount * 0.08).toFixed(2)}</Typography>
                </Box>
                
                <Divider />
                
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: THEME.colors.primary }}>
                    ${(totalAmount * 1.08).toFixed(2)}
                  </Typography>
                </Box>
              </Stack>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleProceedToCheckout}
                sx={{
                  mt: 3,
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
                fullWidth
                size="large"
                onClick={handleBack}
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
                Back to Edit
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 