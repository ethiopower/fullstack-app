import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    // Test data
    const testData = {
      orderId: 'TEST-123',
      customerName: 'Test Customer',
      customerEmail: 'fekadu.sami@gmail.com',
      items: [{
        name: 'Test Product',
        price: 199.99,
        quantity: 1,
        size: 'Custom',
        isCustom: true,
        measurements: {
          chest: '100',
          waist: '80',
          hips: '90',
          length: '150'
        },
        personName: 'Test Person'
      }],
      subtotal: 199.99,
      deposit: 199.99
    };

    console.log('🧪 Sending test email with data:', testData);

    const result = await sendOrderConfirmationEmail(testData);

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      result
    });

  } catch (error: any) {
    console.error('Error sending test email:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      details: error.response?.body || error
    }, { status: 500 });
  }
} 