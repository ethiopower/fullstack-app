import sgMail from '@sendgrid/mail';
import { BUSINESS_INFO } from './constants';
import {
  getOrderConfirmationTemplate,
  getOrderStatusUpdateTemplate,
  getContactFormTemplate,
  getNewsletterTemplate
} from './email-templates';

// Check if SendGrid API key is available
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
const EMAIL_ENABLED = !!SENDGRID_API_KEY;

if (EMAIL_ENABLED) {
  sgMail.setApiKey(SENDGRID_API_KEY!);
  console.log('✅ SendGrid email service initialized');
  
  // Validate from email
  if (!SENDGRID_FROM_EMAIL) {
    console.warn('⚠️  SENDGRID_FROM_EMAIL not found. Using default: orders@fafresh.com');
  } else {
    console.log(`✅ Using sender email: ${SENDGRID_FROM_EMAIL}`);
  }
} else {
  console.warn('⚠️  SENDGRID_API_KEY not found. Email will be logged to console only.');
  console.log('To enable email sending:');
  console.log('1. Add SENDGRID_API_KEY to .env.local');
  console.log('2. Add SENDGRID_FROM_EMAIL to .env.local');
  console.log('3. Verify sender email in SendGrid');
  console.log('4. Restart the development server');
}

interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
    isCustom?: boolean;
    measurements?: { [key: string]: string };
    personName?: string;
  }>;
  subtotal: number;
  deposit: number;
}

interface OrderStatusUpdateData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  status: string;
  message: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface NewsletterData {
  customerName: string;
  customerEmail: string;
  content: string;
}

export async function sendOrderConfirmationEmail(data: OrderConfirmationData) {
  const subject = `Order Confirmation - ${data.orderId} | Fafresh Cultural Fashion`;
  const htmlContent = getOrderConfirmationTemplate(data);
  
  if (EMAIL_ENABLED) {
    try {
      const msg = {
        to: data.customerEmail,
        from: {
          email: SENDGRID_FROM_EMAIL || 'orders@fafresh.com',
          name: 'Fafresh Cultural Fashion'
        },
        subject,
        html: htmlContent,
      };

      console.log('📧 Sending email via SendGrid:', {
        to: data.customerEmail,
        from: msg.from.email,
        subject
      });

      await sgMail.send(msg);
      console.log(`✅ Order confirmation email sent to ${data.customerEmail}`);
      return { success: true };
    } catch (error: any) {
      console.error('SendGrid error:', {
        message: error.message,
        response: error.response?.body,
        code: error.code
      });
      throw error;
    }
  } else {
    // Fallback: Log email content
    console.log('📧 EMAIL (SENDGRID NOT CONFIGURED):');
    console.log(`To: ${data.customerEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${htmlContent}`);
    return { success: true, note: 'Email logged to console (SendGrid not configured)' };
  }
}

export async function sendOrderStatusUpdateEmail(data: OrderStatusUpdateData) {
  const subject = `Order Update - ${data.orderId} | Fafresh Cultural Fashion`;
  const htmlContent = getOrderStatusUpdateTemplate(data);
  
  if (EMAIL_ENABLED) {
    try {
      const msg = {
        to: data.customerEmail,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'orders@fafresh.com',
          name: 'Fafresh Cultural Fashion'
        },
        subject,
        html: htmlContent,
      };

      await sgMail.send(msg);
      console.log(`✅ Order status email sent to ${data.customerEmail}`);
      return { success: true };
    } catch (error) {
      console.error('SendGrid error:', error);
      throw error;
    }
  } else {
    console.log('📧 EMAIL (SENDGRID NOT CONFIGURED):');
    console.log(`To: ${data.customerEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${htmlContent}`);
    return { success: true, note: 'Email logged to console (SendGrid not configured)' };
  }
}

export async function sendContactFormEmail(data: ContactFormData) {
  const subject = `New Contact Form Submission from ${data.name}`;
  const htmlContent = getContactFormTemplate(data);
  
  if (EMAIL_ENABLED) {
    try {
      const msg = {
        to: process.env.SENDGRID_ADMIN_EMAIL || 'info@fafresh.com',
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'contact@fafresh.com',
          name: 'Fafresh Website'
        },
        subject,
        html: htmlContent,
      };

      await sgMail.send(msg);
      console.log(`✅ Contact form email sent from ${data.email}`);
      return { success: true };
    } catch (error) {
      console.error('SendGrid error:', error);
      throw error;
    }
  } else {
    console.log('📧 EMAIL (SENDGRID NOT CONFIGURED):');
    console.log(`To: info@fafresh.com`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${htmlContent}`);
    return { success: true, note: 'Email logged to console (SendGrid not configured)' };
  }
}

export async function sendNewsletterEmail(data: NewsletterData) {
  const subject = 'Fafresh Cultural Fashion Newsletter';
  const htmlContent = getNewsletterTemplate(data);
  
  if (EMAIL_ENABLED) {
    try {
      const msg = {
        to: data.customerEmail,
        from: {
          email: process.env.SENDGRID_FROM_EMAIL || 'newsletter@fafresh.com',
          name: 'Fafresh Cultural Fashion'
        },
        subject,
        html: htmlContent,
      };

      await sgMail.send(msg);
      console.log(`✅ Newsletter sent to ${data.customerEmail}`);
      return { success: true };
    } catch (error) {
      console.error('SendGrid error:', error);
      throw error;
    }
  } else {
    console.log('📧 EMAIL (SENDGRID NOT CONFIGURED):');
    console.log(`To: ${data.customerEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content: ${htmlContent}`);
    return { success: true, note: 'Email logged to console (SendGrid not configured)' };
  }
} 