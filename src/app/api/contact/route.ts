import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, phone, message } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Send email to admin
    await sgMail.send({
      to: 'fafresh@samifekadu.com',
      from: 'fafresh@samifekadu.com',
      subject: 'New Contact Form Submission',
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    // Send confirmation email to user
    await sgMail.send({
      to: email,
      from: 'fafresh@samifekadu.com',
      subject: 'Thank you for contacting Fafresh Fashion',
      text: `
        Dear ${name},

        Thank you for contacting Fafresh Fashion. We have received your message and will get back to you shortly.

        Best regards,
        The Fafresh Fashion Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Thank you for contacting Fafresh Fashion</h2>
          <p>Dear ${name},</p>
          <p>Thank you for contacting Fafresh Fashion. We have received your message and will get back to you shortly.</p>
          <p>Best regards,<br>The Fafresh Fashion Team</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Message sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
} 