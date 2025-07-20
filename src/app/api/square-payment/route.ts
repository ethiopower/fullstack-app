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
    if (!sourceId || !amount || !orderId || !customerEmail) {
      return NextResponse.json(
        { success: false, error: 'Missing required payment information' },
        { status: 400 }
      );
    }

    // Validate items array
    if (!Array.isArray(orderData?.items) || orderData.items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order must contain at least one item' },
        { status: 400 }
      );
    }

    // Create order in Square first
    try {
      // Compose full customer name
      let safeCustomerName = 'Customer';
      if (orderData?.customerName && orderData.customerName.trim()) {
        safeCustomerName = orderData.customerName.trim();
      } else if (orderData?.customerInfo?.firstName) {
        safeCustomerName = `${orderData.customerInfo.firstName} ${orderData.customerInfo.lastName || ''}`.trim();
      } else if (customerEmail) {
        safeCustomerName = customerEmail.split('@')[0];
      }

      const squareOrderResult = await createOrder({
        orderId,
        customerEmail,
        items: orderData.items.map((item: any) => ({
          name: item.name || `Custom ${item.gender}'s Garment`,
          quantity: String(item.quantity || 1), // Convert to string for Square API
          base_price_money: { // Square API expects snake_case
            amount: Math.round(item.price * 100), // Convert to cents
            currency: 'USD'
          },
          metadata: {
            size: item.size || 'N/A',
            color: item.color || 'As Selected',
            isCustom: item.isCustom ? 'true' : 'false',
            measurements: item.measurements ? JSON.stringify(item.measurements) : '{}',
            personName: item.personName || safeCustomerName,
            personId: item.personId || 'default'
          }
        })),
        metadata: {
          customer_name: safeCustomerName,
          customer_email: customerEmail,
          order_type: orderData?.isCustom ? 'custom_fashion' : 'regular',
          created_at: new Date().toISOString(),
          people: orderData?.people ? JSON.stringify(orderData.people) : '[]'
        }
      });

      console.log('✅ Square order created:', squareOrderResult.squareOrderId);
    } catch (orderError: any) {
      console.error('Square order creation failed:', orderError);
      return NextResponse.json(
        { success: false, error: orderError.message || 'Failed to create order' },
        { status: 500 }
      );
    }

    // Square API payment request
    const squarePaymentData = {
      source_id: sourceId,
      amount_money: {
        amount, // Amount in cents
        currency: 'USD'
      },
      idempotency_key: `${orderId}-${Date.now()}`,
      location_id: SQUARE_LOCATION_ID!,
      reference_id: orderId,
      buyer_email_address: customerEmail,
      note: `Order ${orderId}`
    };

    console.log('Sending payment request to Square:', JSON.stringify(squarePaymentData, null, 2));

    // Call Square Payments API
    const response = await fetch('https://connect.squareupsandbox.com/v2/payments', {
      method: 'POST',
      headers: {
        'Square-Version': '2024-01-18',
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(squarePaymentData)
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Square payment failed:', result);
      return NextResponse.json(
        { success: false, error: 'Payment processing failed' },
        { status: 500 }
      );
    }

    console.log('✅ Square payment successful:', result.payment.id);
    return NextResponse.json({ success: true, paymentId: result.payment.id });

  } catch (error: any) {
    console.error('Payment processing error:', error);
    return NextResponse.json(
      { success: false, error: 'Payment processing failed. Please try again.' },
      { status: 500 }
    );
  }
} 