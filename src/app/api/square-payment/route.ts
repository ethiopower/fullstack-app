import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/squareOrders';

// Square configuration from environment variables
const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN;
const SQUARE_LOCATION_ID = process.env.SQUARE_LOCATION_ID;

// Validate Square configuration
if (!SQUARE_ACCESS_TOKEN || !SQUARE_LOCATION_ID) {
  console.error('Missing Square configuration. Please check your .env.local file.');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sourceId, amount, orderId, customerEmail, orderData } = body;

    // Validate required fields
    if (!sourceId || !amount || !orderId) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // Create order in Square first
    try {
      const squareOrderResult = await createOrder({
        orderId,
        customerEmail,
        items: orderData?.items?.map((item: any) => ({
          name: item.name,
          quantity: item.quantity,
          basePriceMoney: {
            amount: Math.round(item.price * 100),
            currency: 'USD'
          },
          metadata: {
            size: item.size || '',
            color: item.color || '',
            personId: item.personId || 'default',
            measurements: item.measurements ? JSON.stringify(item.measurements) : '{}'
          }
        })) || [],
        metadata: {
          people: orderData?.people ? JSON.stringify(orderData.people) : undefined
        }
      });

      console.log('✅ Square order created:', squareOrderResult.squareOrderId);
    } catch (orderError) {
      console.error('Square order creation failed:', orderError);
      // Continue with payment even if order creation fails
    }

    // Square API payment request
    const squarePaymentData = {
      source_id: sourceId,
      amount_money: {
        amount: amount, // Amount in cents
        currency: 'USD'
      },
      idempotency_key: `${orderId}-${Date.now()}`, // Unique key for this payment
      location_id: SQUARE_LOCATION_ID, // Use location ID from environment
      reference_id: orderId, // Use reference_id instead of order_id
      buyer_email_address: customerEmail,
      note: `Custom fashion order ${orderId}`
      // Remove app_fee_money for sandbox testing
    };

    console.log('Sending payment request to Square:', JSON.stringify(squarePaymentData, null, 2));

    // Call Square Payments API
    const squareResponse = await fetch('https://connect.squareupsandbox.com/v2/payments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Square-Version': '2024-01-18'
      },
      body: JSON.stringify(squarePaymentData)
    });

    const squareResult = await squareResponse.json();

    if (!squareResponse.ok) {
      console.error('Square payment error:', squareResult);
      return NextResponse.json(
        { success: false, error: 'Payment processing failed', details: squareResult },
        { status: 400 }
      );
    }

    console.log('✅ Square payment successful:', squareResult.payment.id);

    // Return success with order ID for redirect
    return NextResponse.json({
      success: true,
      paymentId: squareResult.payment.id,
      orderId: orderId,
      amount: squareResult.payment.amount_money.amount,
      currency: squareResult.payment.amount_money.currency,
      status: squareResult.payment.status
    });

  } catch (error) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 