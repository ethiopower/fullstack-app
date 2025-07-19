import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing Stripe secret key');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-06-30.basil'
});

export async function POST(request: Request) {
  try {
    const { orderId, amount, customerEmail } = await request.json();

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
      metadata: {
        orderId,
        customerEmail
      }
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Payment error:', error);
    return NextResponse.json(
      { error: 'Failed to process payment' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { paymentIntentId } = await request.json();

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Update order status based on payment status
    if (paymentIntent.status === 'succeeded') {
      const orderId = paymentIntent.metadata.orderId;
      
      // Update order status in database
      // await prisma.order.update({
      //   where: { id: orderId },
      //   data: { status: 'PROCESSING' }
      // });

      return NextResponse.json({
        success: true,
        message: 'Payment confirmed'
      });
    }

    return NextResponse.json(
      { error: 'Payment not completed' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    );
  }
} 