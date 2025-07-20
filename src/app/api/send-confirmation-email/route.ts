import { NextResponse } from 'next/server';
import { squareOrders } from '@/lib/squareOrders';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const { orderId, customerEmail, customerName, trackingUrl } = await request.json();

    // Fetch order details from Square
    const order = await squareOrders.getOrder(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    // Send confirmation email
    await sendOrderConfirmationEmail({
      orderId,
      customerName,
      customerEmail,
      items: order.items.map(item => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        isCustom: item.isCustom,
        measurements: item.measurements,
        personName: item.personName
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      total: order.total,
      trackingUrl
    });

    return NextResponse.json({
      success: true,
      message: `Order confirmation email sent to ${customerEmail}`
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    );
  }
} 