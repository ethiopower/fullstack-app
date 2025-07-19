import sgMail from '@sendgrid/mail';
import { BUSINESS_INFO } from './constants';
import {
  getOrderConfirmationTemplate,
  getOrderStatusUpdateTemplate,
  getContactFormTemplate,
  getNewsletterTemplate
} from './email-templates';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

interface OrderConfirmationData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    gender: string;
    occasion: string;
    design: {
      name: string;
    };
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

export async function sendOrderConfirmation(data: OrderConfirmationData): Promise<void> {
  const html = getOrderConfirmationTemplate({
    orderId: data.orderId,
    customerName: data.customerName,
    items: data.items,
    subtotal: data.subtotal,
    deposit: data.deposit
  });

  await sgMail.send({
    to: data.customerEmail,
    from: BUSINESS_INFO.contactEmail,
    subject: 'Order Confirmation - Fafresh Fashion',
    html
  });
}

export async function sendOrderStatusUpdate(data: OrderStatusUpdateData): Promise<void> {
  const html = getOrderStatusUpdateTemplate({
    orderId: data.orderId,
    customerName: data.customerName,
    status: data.status,
    message: data.message
  });

  await sgMail.send({
    to: data.customerEmail,
    from: BUSINESS_INFO.contactEmail,
    subject: 'Order Status Update - Fafresh Fashion',
    html
  });
}

export async function sendContactFormNotification(data: ContactFormData): Promise<void> {
  const html = getContactFormTemplate(data);

  await sgMail.send({
    to: BUSINESS_INFO.contactEmail,
    from: BUSINESS_INFO.contactEmail,
    subject: 'New Contact Form Submission',
    html
  });

  // Send confirmation to customer
  await sgMail.send({
    to: data.email,
    from: BUSINESS_INFO.contactEmail,
    subject: 'Thank You for Contacting Fafresh Fashion',
    html: getOrderStatusUpdateTemplate({
      orderId: '',
      customerName: data.name,
      status: 'Message Received',
      message: 'Thank you for contacting us. We\'ll get back to you shortly.'
    })
  });
}

export async function sendNewsletter(data: NewsletterData): Promise<void> {
  const html = getNewsletterTemplate({
    customerName: data.customerName,
    content: data.content
  });

  await sgMail.send({
    to: data.customerEmail,
    from: BUSINESS_INFO.contactEmail,
    subject: 'Latest Updates from Fafresh Fashion',
    html
  });
} 