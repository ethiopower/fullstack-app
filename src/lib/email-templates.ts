import { BUSINESS_INFO } from './constants';

interface OrderConfirmationData {
  orderId: string;
  customerName: string;
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
  content: string;
}

const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Fafresh Fashion</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background-color: #078930;
      color: white;
      padding: 20px;
      text-align: center;
    }
    .content {
      padding: 20px;
      background-color: #ffffff;
    }
    .footer {
      background-color: #f5f5f5;
      padding: 20px;
      text-align: center;
      font-size: 14px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #078930;
      color: white;
      text-decoration: none;
      border-radius: 4px;
      margin: 20px 0;
    }
    .social-links {
      margin-top: 20px;
    }
    .social-links a {
      color: #078930;
      text-decoration: none;
      margin: 0 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Fafresh Fashion</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>
        ${BUSINESS_INFO.brandName}<br>
        123 Fashion Street<br>
        Silver Spring, MD 20910<br>
        ${BUSINESS_INFO.phone}
      </p>
      <div class="social-links">
        <a href="${BUSINESS_INFO.instagramUrl}" target="_blank">Instagram</a>
        <a href="${BUSINESS_INFO.youtubeUrl}" target="_blank">YouTube</a>
        <a href="${BUSINESS_INFO.tiktokUrl}" target="_blank">TikTok</a>
      </div>
      <p style="margin-top: 20px; font-size: 12px;">
        You received this email because you are a customer of Fafresh Fashion.
        If you believe this is a mistake, please contact us.
      </p>
    </div>
  </div>
</body>
</html>
`;

export function getOrderConfirmationTemplate(data: OrderConfirmationData): string {
  const itemsList = data.items
    .map(item => {
      const measurementsHtml = item.isCustom && item.measurements ? `
        <div style="margin-left: 20px; font-size: 14px; color: #666;">
          <p style="margin: 5px 0;"><strong>Measurements:</strong></p>
          ${Object.entries(item.measurements)
            .map(([key, value]) => `
              <p style="margin: 2px 0;">
                ${key.charAt(0).toUpperCase() + key.slice(1)}: ${value} cm
              </p>
            `)
            .join('')}
        </div>
      ` : '';

      return `
        <li style="margin-bottom: 15px;">
          <div>
            <strong>${item.name}</strong> x ${item.quantity}
            <span style="color: #078930;"> - $${(item.price * item.quantity).toFixed(2)}</span>
          </div>
          ${item.personName ? `<div style="margin-left: 20px; color: #666;">For: ${item.personName}</div>` : ''}
          ${item.size ? `<div style="margin-left: 20px; color: #666;">Size: ${item.size}</div>` : ''}
          ${item.color ? `<div style="margin-left: 20px; color: #666;">Color: ${item.color}</div>` : ''}
          ${measurementsHtml}
        </li>
      `;
    })
    .join('');

  const content = `
    <h2>Thank You for Your Order!</h2>
    <p>Dear ${data.customerName},</p>
    <p>We're excited to confirm your order with Fafresh Fashion. Here are your order details:</p>
    
    <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 4px;">
      <p><strong>Order ID:</strong> ${data.orderId}</p>
      <p><strong>Items:</strong></p>
      <ul style="list-style-type: none; padding-left: 0;">
        ${itemsList}
      </ul>
      <p><strong>Subtotal:</strong> $${data.subtotal.toFixed(2)}</p>
      <p><strong>Deposit Paid:</strong> $${data.deposit.toFixed(2)}</p>
      <p><strong>Balance Due:</strong> $${(data.subtotal - data.deposit).toFixed(2)}</p>
    </div>

    <p>What happens next?</p>
    <ol>
      <li>We'll start working on your custom garment</li>
      <li>You'll receive updates as we progress</li>
      <li>We'll notify you when your order is ready for pickup</li>
    </ol>

    <p>
      If you have any questions, please don't hesitate to contact us at
      <a href="mailto:${BUSINESS_INFO.contactEmail}">${BUSINESS_INFO.contactEmail}</a>
    </p>
  `;

  return baseTemplate(content);
}

export function getOrderStatusUpdateTemplate(data: OrderStatusUpdateData): string {
  const content = `
    <h2>Order Status Update</h2>
    <p>Dear ${data.customerName},</p>
    <p>We have an update about your order (ID: ${data.orderId}).</p>
    
    <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 4px;">
      <p><strong>Status:</strong> ${data.status}</p>
      <p>${data.message}</p>
    </div>

    <p>
      If you have any questions, please don't hesitate to contact us at
      <a href="mailto:${BUSINESS_INFO.contactEmail}">${BUSINESS_INFO.contactEmail}</a>
    </p>
  `;

  return baseTemplate(content);
}

export function getContactFormTemplate(data: ContactFormData): string {
  const content = `
    <h2>New Contact Form Submission</h2>
    <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 4px;">
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Message:</strong></p>
      <p style="white-space: pre-wrap;">${data.message}</p>
    </div>
  `;

  return baseTemplate(content);
}

export function getNewsletterTemplate(data: NewsletterData): string {
  const content = `
    <h2>Latest Updates from Fafresh Fashion</h2>
    <p>Dear ${data.customerName},</p>
    
    <div style="margin: 20px 0;">
      ${data.content}
    </div>

    <a href="${BUSINESS_INFO.instagramUrl}" class="button" target="_blank">
      Follow Us on Instagram
    </a>

    <p style="margin-top: 20px; font-size: 12px;">
      You received this email because you subscribed to our newsletter.
      If you wish to unsubscribe, please click <a href="#">here</a>.
    </p>
  `;

  return baseTemplate(content);
} 