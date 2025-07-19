'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
  Stack
} from '@mui/material';
import {
  PaymentElement,
  useStripe,
  useElements,
  Elements
} from '@stripe/react-stripe-js';
import { stripe as stripePromise } from '@/lib/stripe';
import { THEME } from '@/lib/constants';

interface PaymentFormProps {
  amount: number;
  orderId: string;
  customerEmail: string;
  onSuccess: () => void;
  onError: (error: string) => void;
}

function PaymentFormContent({
  amount,
  orderId,
  customerEmail,
  onSuccess,
  onError
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    const createPaymentIntent = async () => {
      try {
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            orderId,
            customerEmail
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        setError('Failed to initialize payment. Please try again.');
        onError('Payment initialization failed');
      }
    };

    createPaymentIntent();
  }, [amount, orderId, customerEmail, onError]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + '/payment-confirmation',
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed');
        onError(submitError.message || 'Payment failed');
        return;
      }

      // Payment successful
      const response = await fetch('/api/payment', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId: clientSecret.split('_secret_')[0],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to confirm payment');
      }

      onSuccess();
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      onError('Payment processing failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Payment Details
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Amount to pay: ${amount.toFixed(2)}
          </Typography>
        </Box>

        <PaymentElement />

        <Button
          type="submit"
          variant="contained"
          disabled={!stripe || processing}
          sx={{
            mt: 3,
            bgcolor: THEME.colors.primary,
            color: 'white',
            '&:hover': {
              bgcolor: THEME.colors.secondary
            }
          }}
        >
          {processing ? (
            <CircularProgress size={24} sx={{ color: 'white' }} />
          ) : (
            `Pay $${amount.toFixed(2)}`
          )}
        </Button>
      </Stack>
    </form>
  );
}

export default function PaymentForm(props: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Get client secret
    const getClientSecret = async () => {
      try {
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: props.amount,
            orderId: props.orderId,
            customerEmail: props.customerEmail
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to initialize payment');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err) {
        props.onError('Failed to initialize payment');
      }
    };

    getClientSecret();
  }, [props]);

  if (!clientSecret) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 200
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: THEME.colors.primary,
        colorBackground: '#ffffff',
        colorText: '#000000',
        colorDanger: '#df1b41',
        fontFamily: 'system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '4px',
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentFormContent {...props} />
    </Elements>
  );
} 