'use client';

import { useState, useEffect, useRef } from 'react';
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
  Divider,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { THEME } from '@/lib/constants';
import { squarecreds } from '@/lib/creds';

type PendingOrder = {
  orderSummary: {
    items: any[];
    people: any[];
    subtotal: number;
    tax: number;
    total: number;
  };
  customerInfo: {
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
  timestamp: string;
  orderId: string;
};

declare global {
  interface Window {
    Square: any;
  }
}

export default function PaymentPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [pendingOrder, setPendingOrder] = useState<PendingOrder | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [isSquareLoaded, setIsSquareLoaded] = useState(false);
  const [cardInstance, setCardInstance] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const storedOrder = sessionStorage.getItem('pendingOrder');
    if (!storedOrder) {
      router.push('/customize/step5');
      return;
    }

    try {
      setPendingOrder(JSON.parse(storedOrder));
    } catch (error) {
      console.error('Error parsing pending order:', error);
      router.push('/customize/step5');
    }
  }, [router]);

  useEffect(() => {
    if (!pendingOrder || isInitialized) return;

    const loadSquareSDK = () => {
      // Check if Square is already loaded
      if (window.Square) {
        console.log('Square SDK already loaded');
        setIsSquareLoaded(true);
        return;
      }

      // Check if script is already being loaded
      const existingScript = document.querySelector('script[src*="square.js"]');
      if (existingScript) {
        console.log('Square SDK script already loading');
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://sandbox.web.squarecdn.com/v1/square.js';
      script.async = true;
      script.onload = () => {
        console.log('Square SDK loaded successfully');
        setIsSquareLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Square SDK script');
        setPaymentError('Payment system is temporarily unavailable. Please check your internet connection and try again.');
      };
      document.head.appendChild(script);
    };

    loadSquareSDK();
    setIsInitialized(true);
  }, [pendingOrder, isInitialized]);

  useEffect(() => {
    if (!isSquareLoaded || !pendingOrder || cardInstance) return;

    const initializeSquare = async () => {
      try {
        // Wait for DOM element to be ready
        if (!cardContainerRef.current) {
          setTimeout(initializeSquare, 100);
          return;
        }

        console.log('Initializing Square payments...');
        
        if (!squarecreds.id || squarecreds.id.trim() === '') {
          console.error('DEVELOPER: Square Application ID not configured in src/lib/creds.ts');
          throw new Error('Payment system configuration error');
        }
        
        const payments = window.Square.payments(squarecreds.id);
        const card = await payments.card({
          style: {
            input: {
              fontSize: '16px',
              fontFamily: 'Arial, sans-serif',
              color: '#2c3e50'
            },
            '.input-container': {
              borderRadius: '8px',
              borderColor: '#e0e0e0'
            }
          }
        });
        
        await card.attach(cardContainerRef.current);
        setCardInstance(card);
        console.log('Square card form attached successfully');
        setPaymentError('');
        
      } catch (error) {
        console.error('Square initialization error:', error);
        
        const errorStr = (error as Error)?.message || String(error);
        if (errorStr.includes('401')) {
          console.warn('DEVELOPER: Invalid Square Application ID. Check src/lib/creds.ts');
        } else if (errorStr.includes('domain')) {
          console.warn('DEVELOPER: Add localhost:3000 to Square Dashboard → Web Payments SDK → Domains');
        }
        
        setPaymentError('Our payment system is temporarily unavailable. Please try again in a few moments or contact support if the issue persists.');
      }
    };

    initializeSquare();
  }, [isSquareLoaded, pendingOrder, cardInstance]);

  const handlePayment = async () => {
    if (!pendingOrder || !cardInstance) return;

    setIsProcessing(true);
    setPaymentError('');

    try {
      const result = await cardInstance.tokenize();
      
      if (result.status === 'OK') {
        const response = await fetch('/api/square-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            sourceId: result.token,
            amount: Math.round(pendingOrder.orderSummary.total * 100),
            orderId: pendingOrder.orderId,
            customerEmail: pendingOrder.customerInfo.email,
            orderData: pendingOrder
          }),
        });

        const paymentResult = await response.json();

        if (paymentResult.success) {
          // Clear all cart and session data after successful payment
          clearCart();
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem('pendingOrder');
            sessionStorage.removeItem('orderSummary');
            sessionStorage.removeItem('customerInfo');
            sessionStorage.removeItem('orderData');
            sessionStorage.removeItem('orderPeople');
            sessionStorage.removeItem('cartOrderSummary');
            sessionStorage.removeItem('people');
            sessionStorage.removeItem('currentPersonIndex');
            localStorage.removeItem('cart');
            localStorage.removeItem('cart-items');
            // Force cart update
            window.dispatchEvent(new Event('storage'));
          }
          
          // Send order confirmation email
          try {
            await fetch('/api/send-confirmation-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: pendingOrder.orderId,
                customerEmail: pendingOrder.customerInfo?.email || 'customer@example.com',
                customerName: `${pendingOrder.customerInfo?.firstName || 'Customer'} ${pendingOrder.customerInfo?.lastName || ''}`,
                orderTotal: paymentResult.amount || Math.round(pendingOrder.orderSummary?.total * 100) || 0,
                trackingUrl: `${window.location.origin}/order-tracking/${pendingOrder.orderId}`
              })
            });
            console.log('✅ Order confirmation email sent');
          } catch (error) {
            console.error('Failed to send confirmation email:', error);
          }

          router.push(`/order-confirmation/${pendingOrder.orderId}`);
        } else {
          throw new Error(paymentResult.error || 'Payment failed');
        }
      } else {
        throw new Error(result.errors?.map((e: any) => e.detail).join(', ') || 'Card tokenization failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      const errorMessage = (error as Error)?.message || 'Payment failed';
      setPaymentError(`Payment failed: ${errorMessage}. Please check your card details and try again.`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    router.push('/customize/step5');
  };

  if (!pendingOrder) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Typography variant="h4" textAlign="center">
          Loading payment...
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
        Complete Your Payment
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
        Secure payment processing with Square
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={8}>
          {/* Order Summary */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Order Summary
              </Typography>
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Order ID: {pendingOrder.orderId}
              </Typography>

              <Stack spacing={2} sx={{ mt: 2 }}>
                <Box display="flex" justifyContent="space-between">
                  <Typography>Items ({pendingOrder.orderSummary.items.length}):</Typography>
                  <Typography>${pendingOrder.orderSummary.subtotal.toFixed(2)}</Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between">
                  <Typography>Tax:</Typography>
                  <Typography>${pendingOrder.orderSummary.tax.toFixed(2)}</Typography>
                </Box>
                
                <Divider />
                
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Total Amount:
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: THEME.colors.primary }}>
                    ${pendingOrder.orderSummary.total.toFixed(2)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card elevation={2} sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Billing Information
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Name:</Typography>
                  <Typography>{pendingOrder.customerInfo.firstName} {pendingOrder.customerInfo.lastName}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary">Email:</Typography>
                  <Typography>{pendingOrder.customerInfo.email}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">Address:</Typography>
                  <Typography>
                    {pendingOrder.customerInfo.address}<br />
                    {pendingOrder.customerInfo.city}, {pendingOrder.customerInfo.state} {pendingOrder.customerInfo.zipCode}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card elevation={2}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Payment Information
              </Typography>

              {paymentError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {paymentError}
                </Alert>
              )}

              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  <strong>Order Information:</strong><br />
                  • Your custom order will be ready for pickup in 3-4 weeks<br />
                  • You will receive email updates on your order progress<br />
                  • All payments are processed securely through Square
                </Typography>
              </Alert>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 600 }}>
                  Card Information
                </Typography>
                <Box
                  ref={cardContainerRef}
                  sx={{
                    border: 1,
                    borderColor: 'divider',
                    borderRadius: 2,
                    p: 2,
                    minHeight: '60px',
                    backgroundColor: '#f9f9f9'
                  }}
                />
              </Box>

              <Stack spacing={2}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handlePayment}
                  disabled={isProcessing || !isSquareLoaded || !cardInstance}
                  fullWidth
                  sx={{
                    bgcolor: THEME.colors.primary,
                    color: 'white',
                    py: 2,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: THEME.colors.secondary
                    },
                    '&:disabled': {
                      bgcolor: 'action.disabledBackground'
                    }
                  }}
                >
                  {isProcessing ? (
                    <>
                      <CircularProgress size={20} sx={{ mr: 2, color: 'white' }} />
                      Processing Payment...
                    </>
                  ) : !isSquareLoaded ? (
                    'Loading Payment System...'
                  ) : !cardInstance ? (
                    'Setting up Payment Form...'
                  ) : (
                    `Pay $${pendingOrder.orderSummary.total.toFixed(2)}`
                  )}
                </Button>

                {isProcessing && (
                  <Box display="flex" alignItems="center" justifyContent="center" sx={{ py: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Please wait while we process your payment securely...
                    </Typography>
                  </Box>
                )}

                <Button
                  variant="outlined"
                  size="large"
                  onClick={handleBack}
                  disabled={isProcessing}
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
                  Back to Checkout
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 