import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

type OrderStatus = 'PENDING' | 'PROCESSING' | 'READY_FOR_PICKUP' | 'COMPLETED' | 'CANCELLED';

const statusMessages: Record<OrderStatus, { subject: string; text: string }> = {
  PENDING: {
    subject: 'Order Received - Fafresh Fashion',
    text: 'Thank you for your order! We\'ll start processing it soon.'
  },
  PROCESSING: {
    subject: 'Order Update - Your Order is Being Processed',
    text: 'Good news! We\'ve started working on your custom garment.'
  },
  READY_FOR_PICKUP: {
    subject: 'Order Ready for Pickup - Fafresh Fashion',
    text: 'Your order is ready for pickup at our store!'
  },
  COMPLETED: {
    subject: 'Order Completed - Thank You!',
    text: 'Your order has been completed. We hope you love your custom garment!'
  },
  CANCELLED: {
    subject: 'Order Cancelled - Fafresh Fashion',
    text: 'Your order has been cancelled. Please contact us if you have any questions.'
  }
};

export async function PUT(
  request: Request,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { status } = await request.json();

    // Update order status
    const order = await prisma.order.update({
      where: {
        id: params.orderId
      },
      data: {
        status
      },
      include: {
        customer: true
      }
    });

    // Send email notification
    const message = statusMessages[status as OrderStatus];
    if (message && order.customer.email) {
      await sgMail.send({
        to: order.customer.email,
        from: 'fafresh@samifekadu.com',
        subject: message.subject,
        text: message.text,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>${message.subject}</h2>
            <p>Dear ${order.customer.firstName},</p>
            <p>${message.text}</p>
            <p>Order Details:</p>
            <ul>
              <li>Order ID: ${order.id}</li>
              <li>Status: ${status}</li>
              <li>Total Amount: $${order.subtotal.toFixed(2)}</li>
            </ul>
            <p>If you have any questions, please don't hesitate to contact us.</p>
            <p>Best regards,<br>The Fafresh Fashion Team</p>
          </div>
        `
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Order status update error:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
} 