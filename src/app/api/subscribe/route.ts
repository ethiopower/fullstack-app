import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Send confirmation email to subscriber
    await sgMail.send({
      to: email,
      from: 'fafresh@samifekadu.com',
      subject: 'Welcome to Fafresh Fashion Newsletter',
      text: 'Thank you for subscribing to our newsletter! We\'ll keep you updated with our latest collections and offers.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Welcome to Fafresh Fashion!</h2>
          <p>Thank you for subscribing to our newsletter.</p>
          <p>We'll keep you updated with our latest collections, special offers, and Ethiopian cultural fashion insights.</p>
          <p>Best regards,<br>The Fafresh Fashion Team</p>
        </div>
      `,
    });

    // Send notification to admin
    await sgMail.send({
      to: 'fafresh@samifekadu.com',
      from: 'fafresh@samifekadu.com',
      subject: 'New Newsletter Subscription',
      text: `New subscriber: ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h3>New Newsletter Subscription</h3>
          <p>Email: ${email}</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Subscription successful' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to process subscription' },
      { status: 500 }
    );
  }
} 