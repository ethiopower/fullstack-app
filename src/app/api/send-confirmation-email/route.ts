import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '@/lib/email';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  isCustom?: boolean;
  measurements?: { [key: string]: string };
  personName?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { 
      orderId, 
      customerEmail, 
      customerName, 
      orderTotal, 
      trackingUrl,
      items = [] as OrderItem[]
    } = await request.json();

    // Validate required fields
    if (!orderId || !customerEmail || !customerName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: orderId, customerEmail, customerName' },
        { status: 400 }
      );
    }

    // Format items for email template
    const formattedItems = items.map((item: OrderItem) => ({
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size,
      color: item.color,
      isCustom: item.isCustom,
      measurements: item.measurements,
      personName: item.personName
    }));

    // Send actual email using SendGrid
    try {
      await sendOrderConfirmationEmail({
        orderId,
        customerName,
        customerEmail,
        items: formattedItems,
        subtotal: Math.round((orderTotal || 0) / 100),
        deposit: Math.round((orderTotal || 0) / 100),
        trackingUrl: trackingUrl || `${request.headers.get('origin')}/order-tracking/${orderId}`
      });

      console.log(`✅ Order confirmation email sent to ${customerEmail} for order ${orderId}`);
      
      return NextResponse.json({ 
        success: true, 
        message: 'Confirmation email sent successfully' 
      });

    } catch (emailError) {
      console.error('SendGrid email error:', emailError);
      
      // Create detailed email content for fallback
      const itemsList = formattedItems.map((item: OrderItem) => {
        const measurementsText = item.isCustom && item.measurements
          ? Object.entries(item.measurements)
              .map(([key, value]) => `\n    - ${key}: ${value} cm`)
              .join('')
          : '';

        return `
          • ${item.name} x ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
            ${item.personName ? `For: ${item.personName}` : ''}
            ${item.size ? `Size: ${item.size}` : ''}
            ${item.color ? `Color: ${item.color}` : ''}
            ${measurementsText}
        `;
      }).join('\n');

      const fallbackEmailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2e7d32; color: white; padding: 20px; text-align: center;">
            <h1>Order Confirmation</h1>
            <p>Thank you for your custom order!</p>
          </div>
          
          <div style="padding: 20px;">
            <h2>Hi ${customerName},</h2>
            <p>Your custom fashion order has been confirmed and we'll start working on it right away.</p>
            
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Order Details:</h3>
              <p><strong>Order ID:</strong> ${orderId}</p>
              <div style="margin: 15px 0;">
                <strong>Items:</strong>
                <pre style="margin: 10px 0; white-space: pre-wrap;">${itemsList}</pre>
              </div>
              <p><strong>Total:</strong> $${((orderTotal || 0) / 100).toFixed(2)}</p>
              <p><strong>Status:</strong> Preparing</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${trackingUrl}" 
                 style="background-color: #2e7d32; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                🔍 Track Your Order
              </a>
            </div>
            
            <div style="text-align: center; margin: 10px 0;">
              <p style="color: #666; font-size: 14px;">
                Or copy this link: <a href="${trackingUrl}" style="color: #2e7d32;">${trackingUrl}</a>
              </p>
            </div>
            
            <h3>What's Next?</h3>
            <ul>
              <li>We'll start working on your custom garment immediately</li>
              <li>Estimated completion: 7-10 business days</li>
              <li>You'll receive updates via email</li>
              <li>Pickup location: Inside the Global Foods, 13814 Outlet Dr, Silver Spring, MD 20904</li>
            </ul>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <h3>Contact Us:</h3>
              <p>Phone: (240) 704-9915</p>
              <p>Location: Inside the Global Foods, Silver Spring, MD</p>
            </div>
          </div>
          
          <div style="background-color: #f0f0f0; padding: 15px; text-align: center; color: #666;">
            <p>Thank you for choosing Fafresh Cultural Fashion!</p>
          </div>
        </div>
      `;

      console.log('📧 Email Content (for manual sending):');
      console.log(`To: ${customerEmail}`);
      console.log(`Subject: Order Confirmation - ${orderId}`);
      console.log(fallbackEmailContent);
      
      // Return success even if email fails (don't block order completion)
      return NextResponse.json({ 
        success: true, 
        message: 'Order processed successfully. Email notification pending.' 
      });
    }

  } catch (error) {
    console.error('Error in confirmation email API:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process confirmation email' },
      { status: 500 }
    );
  }
} 